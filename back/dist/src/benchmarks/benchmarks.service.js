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
exports.BenchmarksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BenchmarksService = class BenchmarksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query.name)
            where.name = query.name;
        if (query.model)
            where.model = query.model;
        return this.prisma.benchmark.findMany({
            where,
            orderBy: [{ score: 'desc' }, { date: 'desc' }],
            include: {
                harness: {
                    select: {
                        id: true,
                        slug: true,
                        name: true,
                        orgName: true,
                        category: true,
                        verified: true,
                    },
                },
            },
            take: 200,
        });
    }
    async findByHarnessSlug(slug) {
        const harness = await this.prisma.harness.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!harness) {
            throw new common_1.NotFoundException(`Harness "${slug}" not found`);
        }
        return this.prisma.benchmark.findMany({
            where: { harnessId: harness.id },
            orderBy: { date: 'desc' },
        });
    }
    async createForSlug(slug, dto) {
        const harness = await this.prisma.harness.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!harness) {
            throw new common_1.NotFoundException(`Harness "${slug}" not found`);
        }
        return this.prisma.benchmark.create({
            data: {
                harnessId: harness.id,
                name: dto.name,
                score: dto.score,
                model: dto.model,
                date: dto.date,
            },
        });
    }
};
exports.BenchmarksService = BenchmarksService;
exports.BenchmarksService = BenchmarksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BenchmarksService);
//# sourceMappingURL=benchmarks.service.js.map