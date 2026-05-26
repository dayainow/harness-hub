"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarnessesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const query_harnesses_dto_1 = require("./dto/query-harnesses.dto");
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
let HarnessesService = class HarnessesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
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
    async findBySlug(slug) {
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
            throw new common_1.NotFoundException(`Harness "${slug}" not found`);
        }
        return harness;
    }
    async create(dto) {
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
    async submitHarness(dto) {
        const slug = this.extractSlugFromRepoUrl(dto.repoUrl);
        if (!slug) {
            throw new common_1.BadRequestException('repoUrl에서 "org/name" 슬러그를 추출할 수 없습니다.');
        }
        const [orgFromSlug, nameFromSlug] = slug.split('/');
        const existing = await this.prisma.harness.findFirst({
            where: {
                OR: [{ slug }, { repoUrl: dto.repoUrl }],
            },
            select: { id: true },
        });
        if (existing) {
            throw new common_1.ConflictException('이미 등록된 리포지토리입니다.');
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
    extractSlugFromRepoUrl(repoUrl) {
        try {
            const url = new URL(repoUrl);
            if (!/github\.com$/i.test(url.hostname))
                return null;
            const parts = url.pathname.split('/').filter(Boolean);
            if (parts.length < 2)
                return null;
            const [org, name] = parts;
            const cleanName = name.replace(/\.git$/i, '');
            if (!org || !cleanName)
                return null;
            return `${org}/${cleanName}`;
        }
        catch {
            return null;
        }
    }
    async getStats() {
        const [totalHarnesses, verifiedHarnesses, totalBenchmarks, downloadsAgg] = await Promise.all([
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
    async updateStats(slug, stats) {
        return this.prisma.harness.update({
            where: { slug },
            data: stats,
        });
    }
    buildWhere(query) {
        const where = { status: 'ACTIVE' };
        if (query.category) {
            const cats = query.category
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean);
            if (cats.length === 1) {
                where.category = cats[0];
            }
            else if (cats.length > 1) {
                where.category = { in: cats };
            }
        }
        if (query.licenseTier)
            where.licenseTier = query.licenseTier;
        if (query.verified !== undefined)
            where.verified = query.verified === 'true';
        if (query.featured !== undefined)
            where.featured = query.featured === 'true';
        const langs = this.splitCsv(query.languages);
        if (langs.length)
            where.languages = { hasSome: langs };
        const models = this.splitCsv(query.modelCompat);
        if (models.length) {
            where.OR = models.map((m) => ({
                modelCompat: { hasSome: this.expandModelMatch(m) },
            }));
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            const searchOr = [
                { name: { contains: q, mode: 'insensitive' } },
                { orgName: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { tags: { has: q.toLowerCase() } },
            ];
            if (where.OR) {
                where.AND = [{ OR: where.OR }, { OR: searchOr }];
                delete where.OR;
            }
            else {
                where.OR = searchOr;
            }
        }
        return where;
    }
    buildOrderBy(sort) {
        switch (sort) {
            case query_harnesses_dto_1.HarnessSortEnum.DOWNLOADS:
                return [{ downloadsCount: 'desc' }, { stars: 'desc' }];
            case query_harnesses_dto_1.HarnessSortEnum.RECENT:
                return [{ updatedAt: 'desc' }];
            case query_harnesses_dto_1.HarnessSortEnum.NAME:
                return [{ name: 'asc' }];
            case query_harnesses_dto_1.HarnessSortEnum.STARS:
            default:
                return [{ stars: 'desc' }, { downloadsCount: 'desc' }];
        }
    }
    splitCsv(value) {
        if (!value)
            return [];
        return value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }
    expandModelMatch(value) {
        return [value];
    }
};
exports.HarnessesService = HarnessesService;
exports.HarnessesService = HarnessesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HarnessesService);
//# sourceMappingURL=harnesses.service.js.map