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
exports.CollectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CollectionsService = class CollectionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.collection.findMany({
            where: { isPublic: true },
            orderBy: { updatedAt: 'desc' },
            include: {
                curator: {
                    select: { id: true, username: true, name: true, avatarUrl: true },
                },
                _count: { select: { items: true } },
            },
        });
    }
    async findBySlug(slug) {
        const collection = await this.prisma.collection.findUnique({
            where: { slug },
            include: {
                curator: {
                    select: { id: true, username: true, name: true, avatarUrl: true },
                },
                items: {
                    orderBy: { addedAt: 'asc' },
                    include: {
                        harness: {
                            include: {
                                benchmarks: { orderBy: { date: 'desc' }, take: 2 },
                                _count: { select: { reviews: true, bookmarks: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!collection) {
            throw new common_1.NotFoundException(`Collection "${slug}" not found`);
        }
        return collection;
    }
    async create(userEmail, dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: userEmail },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User profile not found. Please complete signup.');
        }
        let itemConnections = [];
        if (dto.harnessSlugs?.length) {
            const harnesses = await this.prisma.harness.findMany({
                where: { slug: { in: dto.harnessSlugs } },
                select: { id: true, slug: true },
            });
            const foundSlugs = new Set(harnesses.map((h) => h.slug));
            const missing = dto.harnessSlugs.filter((s) => !foundSlugs.has(s));
            if (missing.length) {
                throw new common_1.BadRequestException(`Unknown harness slugs: ${missing.join(', ')}`);
            }
            itemConnections = harnesses.map((h) => ({ harnessId: h.id }));
        }
        return this.prisma.collection.create({
            data: {
                slug: dto.slug,
                title: dto.title,
                description: dto.description,
                isPublic: dto.isPublic ?? true,
                curatorId: user.id,
                items: itemConnections.length
                    ? { create: itemConnections }
                    : undefined,
            },
            include: {
                curator: {
                    select: { id: true, username: true, name: true, avatarUrl: true },
                },
                items: { include: { harness: true } },
            },
        });
    }
};
exports.CollectionsService = CollectionsService;
exports.CollectionsService = CollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CollectionsService);
//# sourceMappingURL=collections.service.js.map