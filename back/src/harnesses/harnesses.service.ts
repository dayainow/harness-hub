import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HARNESS_DESCRIPTIONS } from '../../prisma/harness-descriptions.generated';
import { BENCHMARKS as SEED_BENCHMARKS } from '../../prisma/seed-benchmarks';
import { COLLECTIONS as SEED_COLLECTIONS } from '../../prisma/seed-collections';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHarnessDto } from './dto/create-harness.dto';
import {
  HarnessCategoryEnum,
  HarnessSortEnum,
  QueryHarnessesDto,
} from './dto/query-harnesses.dto';
import { SubmitHarnessDto } from './dto/submit-harness.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@Injectable()
export class HarnessesService {
  private readonly logger = new Logger(HarnessesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Non-destructive sync of `description` + `readmeExcerpt` for known
   * harnesses. Keyed by `slug`, so bookmarks / reviews / collections are
   * untouched. Mirrors `prisma/update-descriptions.ts` and reads the same
   * generated data file so both code paths stay aligned.
   */
  async syncDescriptions(): Promise<{
    total: number;
    updated: number;
    missing: number;
    skipped: string[];
  }> {
    const total = HARNESS_DESCRIPTIONS.length;
    let updated = 0;
    const skipped: string[] = [];

    for (const item of HARNESS_DESCRIPTIONS) {
      const result = await this.prisma.harness.updateMany({
        where: { slug: item.slug },
        data: {
          description: item.description,
          readmeExcerpt: item.readmeExcerpt,
        },
      });
      if (result.count > 0) {
        updated += 1;
      } else {
        skipped.push(item.slug);
      }
    }

    this.logger.log(
      `syncDescriptions: updated ${updated}/${total} (${skipped.length} skipped)`,
    );

    return {
      total,
      updated,
      missing: skipped.length,
      skipped,
    };
  }

  /**
   * Seed the well-known benchmark numbers shipped with the app into the DB.
   * Idempotent: skips entries whose (harnessId, name, model) tuple already
   * exists. Mirrors `prisma/seed-benchmarks.ts` so operators can refresh
   * benchmarks on Railway without shelling into the container.
   */
  async seedBenchmarks(): Promise<{
    total: number;
    created: number;
    skippedExisting: number;
    skippedMissing: number;
    missingSlugs: string[];
  }> {
    const total = SEED_BENCHMARKS.length;
    let created = 0;
    let skippedExisting = 0;
    const missingSlugs: string[] = [];

    for (const b of SEED_BENCHMARKS) {
      const harness = await this.prisma.harness.findUnique({
        where: { slug: b.harnessSlug },
      });
      if (!harness) {
        missingSlugs.push(b.harnessSlug);
        continue;
      }

      const existing = await this.prisma.benchmark.findFirst({
        where: { harnessId: harness.id, name: b.name, model: b.model },
      });
      if (existing) {
        skippedExisting += 1;
        continue;
      }

      await this.prisma.benchmark.create({
        data: {
          harnessId: harness.id,
          name: b.name,
          score: b.score,
          model: b.model,
          date: b.date,
        },
      });
      created += 1;
    }

    this.logger.log(
      `seedBenchmarks: created=${created} skippedExisting=${skippedExisting} skippedMissing=${missingSlugs.length} total=${total}`,
    );

    return {
      total,
      created,
      skippedExisting,
      skippedMissing: missingSlugs.length,
      missingSlugs,
    };
  }

  /**
   * Seed curated English collections from `prisma/seed-collections.ts`.
   * Idempotent: collections with an existing slug are skipped. Missing harness
   * slugs are silently filtered out so the call is safe to retry across
   * environments that ship a different subset of harnesses.
   */
  async seedCollections(): Promise<{
    total: number;
    created: number;
    skippedExisting: number;
    createdSlugs: string[];
    skippedSlugs: string[];
    missingHarnesses: Record<string, string[]>;
  }> {
    const total = SEED_COLLECTIONS.length;
    let created = 0;
    const createdSlugs: string[] = [];
    const skippedSlugs: string[] = [];
    const missingHarnesses: Record<string, string[]> = {};

    const curator = await this.prisma.user.findFirst({
      where: { username: 'harnesshub-curator' },
      select: { id: true },
    });
    if (!curator) {
      throw new NotFoundException(
        'Curator user "harnesshub-curator" not found. Run the base seed first.',
      );
    }

    for (const col of SEED_COLLECTIONS) {
      const existing = await this.prisma.collection.findUnique({
        where: { slug: col.slug },
      });
      if (existing) {
        skippedSlugs.push(col.slug);
        continue;
      }

      const harnesses = await this.prisma.harness.findMany({
        where: { slug: { in: col.harnessSlugs } },
        select: { id: true, slug: true },
      });
      const slugToId = new Map(harnesses.map((h) => [h.slug, h.id]));
      const missing = col.harnessSlugs.filter((s) => !slugToId.has(s));
      if (missing.length) {
        missingHarnesses[col.slug] = missing;
      }
      const orderedHarnessIds = col.harnessSlugs
        .map((slug) => slugToId.get(slug))
        .filter((id): id is string => Boolean(id));

      await this.prisma.collection.create({
        data: {
          slug: col.slug,
          title: col.title,
          description: col.description,
          curatorId: curator.id,
          isPublic: true,
          items: {
            create: orderedHarnessIds.map((harnessId) => ({ harnessId })),
          },
        },
      });
      created += 1;
      createdSlugs.push(col.slug);
    }

    this.logger.log(
      `seedCollections: created=${created} skippedExisting=${skippedSlugs.length} total=${total}`,
    );

    return {
      total,
      created,
      skippedExisting: skippedSlugs.length,
      createdSlugs,
      skippedSlugs,
      missingHarnesses,
    };
  }

  async findAll(query: QueryHarnessesDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query.sort);

    const [total, items] = await Promise.all([
      this.prisma.harness.count({ where }),
      this.prisma.harness.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          benchmarks: {
            orderBy: { date: 'desc' },
            take: 3,
          },
          _count: {
            select: { reviews: true, bookmarks: true },
          },
        },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + items.length < total,
      },
    };
  }

  async findFeatured() {
    return this.prisma.harness.findMany({
      where: { featured: true, status: 'ACTIVE' },
      orderBy: [{ stars: 'desc' }, { downloadsCount: 'desc' }],
      take: 12,
      include: {
        benchmarks: {
          orderBy: { date: 'desc' },
          take: 3,
        },
        _count: {
          select: { reviews: true, bookmarks: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const harness = await this.prisma.harness.findUnique({
      where: { slug },
      include: {
        benchmarks: { orderBy: { date: 'desc' } },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            user: {
              select: { id: true, username: true, name: true, avatarUrl: true },
            },
          },
        },
        _count: {
          select: { reviews: true, bookmarks: true },
        },
      },
    });

    if (!harness) {
      throw new NotFoundException(`Harness "${slug}" not found`);
    }

    return harness;
  }

  async create(dto: CreateHarnessDto) {
    return this.prisma.harness.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        orgName: dto.orgName,
        repoUrl: dto.repoUrl,
        description: dto.description,
        readmeExcerpt: dto.readmeExcerpt,
        stars: dto.stars ?? 0,
        forks: dto.forks ?? 0,
        issuesOpen: dto.issuesOpen ?? 0,
        latestVersion: dto.latestVersion,
        license: dto.license,
        licenseTier: dto.licenseTier ?? 'GREEN',
        languages: dto.languages ?? [],
        category: dto.category ?? 'OTHER',
        modelCompat: dto.modelCompat ?? [],
        tags: dto.tags ?? [],
        verified: dto.verified ?? false,
        featured: dto.featured ?? false,
        installCmd: dto.installCmd,
        downloadsCount: dto.downloadsCount ?? 0,
      },
    });
  }

  async submitHarness(
    dto: SubmitHarnessDto,
  ): Promise<{ success: boolean; slug: string; message: string }> {
    const slug = this.extractSlugFromRepoUrl(dto.repoUrl);
    if (!slug) {
      throw new BadRequestException(
        'repoUrl에서 "org/name" 슬러그를 추출할 수 없습니다.',
      );
    }
    const [orgFromSlug, nameFromSlug] = slug.split('/');

    const existing = await this.prisma.harness.findFirst({
      where: {
        OR: [{ slug }, { repoUrl: dto.repoUrl }],
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('이미 등록된 리포지토리입니다.');
    }

    await this.prisma.harness.create({
      data: {
        slug,
        name: dto.name?.trim() || nameFromSlug,
        orgName: dto.orgName?.trim() || orgFromSlug,
        repoUrl: dto.repoUrl,
        description: dto.description?.trim() || '',
        stars: dto.stars ?? 0,
        license: dto.license,
        languages: dto.languages ?? [],
        category: dto.category ?? 'OTHER',
        modelCompat: dto.modelCompat ?? [],
        tags: dto.tags ?? [],
        installCmd: dto.installCmd,
        verified: false,
        featured: false,
        status: 'PENDING',
      },
    });

    return {
      success: true,
      slug,
      message: '등록 신청이 완료됐습니다. 검토 후 공개됩니다.',
    };
  }

  private extractSlugFromRepoUrl(repoUrl: string): string | null {
    try {
      const url = new URL(repoUrl);
      if (!/github\.com$/i.test(url.hostname)) return null;
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length < 2) return null;
      const [org, name] = parts;
      const cleanName = name.replace(/\.git$/i, '');
      if (!org || !cleanName) return null;
      return `${org}/${cleanName}`;
    } catch {
      return null;
    }
  }

  async getStats(): Promise<{
    totalHarnesses: number;
    verifiedHarnesses: number;
    totalBenchmarks: number;
    totalDownloads: number;
  }> {
    const [totalHarnesses, verifiedHarnesses, totalBenchmarks, downloadsAgg] =
      await Promise.all([
        this.prisma.harness.count({ where: { status: 'ACTIVE' } }),
        this.prisma.harness.count({
          where: { status: 'ACTIVE', verified: true },
        }),
        this.prisma.benchmark.count(),
        this.prisma.harness.aggregate({
          _sum: { downloadsCount: true },
          where: { status: 'ACTIVE' },
        }),
      ]);
    return {
      totalHarnesses,
      verifiedHarnesses,
      totalBenchmarks,
      totalDownloads: downloadsAgg._sum.downloadsCount ?? 0,
    };
  }

  async updateStats(
    slug: string,
    stats: {
      stars?: number;
      forks?: number;
      issuesOpen?: number;
      downloadsCount?: number;
      lastUpdated?: Date;
    },
  ) {
    return this.prisma.harness.update({
      where: { slug },
      data: stats,
    });
  }

  private buildWhere(query: QueryHarnessesDto): Prisma.HarnessWhereInput {
    const where: Prisma.HarnessWhereInput = { status: 'ACTIVE' };

    if (query.category) {
      const cats = query.category
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (cats.length === 1) {
        where.category = cats[0] as HarnessCategoryEnum;
      } else if (cats.length > 1) {
        where.category = { in: cats as HarnessCategoryEnum[] };
      }
    }
    if (query.licenseTier) where.licenseTier = query.licenseTier;
    if (query.verified !== undefined)
      where.verified = query.verified === 'true';
    if (query.featured !== undefined)
      where.featured = query.featured === 'true';

    const langs = this.splitCsv(query.languages);
    if (langs.length) where.languages = { hasSome: langs };

    const models = this.splitCsv(query.modelCompat);
    if (models.length) {
      // Match harness if any of its modelCompat entries contains any of the
      // requested model substrings (e.g. "claude" matches "claude-sonnet-4-6").
      where.OR = models.map((m) => ({
        modelCompat: { hasSome: this.expandModelMatch(m) },
      }));
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      const searchOr: Prisma.HarnessWhereInput[] = [
        { name: { contains: q, mode: 'insensitive' } },
        { orgName: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q.toLowerCase() } },
      ];
      // Merge with any existing OR (from modelCompat) using AND.
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchOr }];
        delete where.OR;
      } else {
        where.OR = searchOr;
      }
    }

    return where;
  }

  private buildOrderBy(
    sort?: HarnessSortEnum,
  ): Prisma.HarnessOrderByWithRelationInput[] {
    switch (sort) {
      case HarnessSortEnum.DOWNLOADS:
        return [{ downloadsCount: 'desc' }, { stars: 'desc' }];
      case HarnessSortEnum.RECENT:
        return [{ updatedAt: 'desc' }];
      case HarnessSortEnum.NAME:
        return [{ name: 'asc' }];
      case HarnessSortEnum.STARS:
      default:
        return [{ stars: 'desc' }, { downloadsCount: 'desc' }];
    }
  }

  private splitCsv(value?: string): string[] {
    if (!value) return [];
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /**
   * Expands a partial model identifier into all variants we want to match.
   * Since Prisma `hasSome` does not support substring matching on array
   * elements, we keep this as an exact-match list. For partial matches we
   * rely on the seed data using full IDs (e.g. "claude-sonnet-4-6").
   */
  private expandModelMatch(value: string): string[] {
    return [value];
  }
}
