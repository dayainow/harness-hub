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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByHarnessSlug(slug) {
        const harness = await this.prisma.harness.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!harness) {
            throw new common_1.NotFoundException(`Harness "${slug}" not found`);
        }
        const [items, agg] = await Promise.all([
            this.prisma.review.findMany({
                where: { harnessId: harness.id },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, username: true, name: true, avatarUrl: true },
                    },
                },
            }),
            this.prisma.review.aggregate({
                where: { harnessId: harness.id },
                _avg: { rating: true },
                _count: { _all: true },
            }),
        ]);
        return {
            items,
            summary: {
                count: agg._count._all,
                averageRating: agg._avg.rating ?? 0,
            },
        };
    }
    async createForSlug(slug, userEmail, dto) {
        const [harness, user] = await Promise.all([
            this.prisma.harness.findUnique({
                where: { slug },
                select: { id: true },
            }),
            this.prisma.user.findUnique({
                where: { email: userEmail },
                select: { id: true },
            }),
        ]);
        if (!harness) {
            throw new common_1.NotFoundException(`Harness "${slug}" not found`);
        }
        if (!user) {
            throw new common_1.UnauthorizedException('User profile not found. Please complete signup.');
        }
        return this.prisma.review.upsert({
            where: {
                harnessId_userId: {
                    harnessId: harness.id,
                    userId: user.id,
                },
            },
            create: {
                harnessId: harness.id,
                userId: user.id,
                rating: dto.rating,
                body: dto.body,
                usageContext: dto.usageContext,
            },
            update: {
                rating: dto.rating,
                body: dto.body,
                usageContext: dto.usageContext,
            },
            include: {
                user: {
                    select: { id: true, username: true, name: true, avatarUrl: true },
                },
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map