import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
  constructor(private readonly prisma: PrismaService) {}

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
