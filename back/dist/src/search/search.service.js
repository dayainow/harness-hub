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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(q) {
        const query = q.trim();
        if (!query)
            return { harnesses: [] };
        const where = this.buildWhere(query);
        const harnesses = await this.prisma.harness.findMany({
            where,
            select: {
                id: true,
                slug: true,
                name: true,
                orgName: true,
                description: true,
                category: true,
                stars: true,
                verified: true,
                featured: true,
                tags: true,
            },
            orderBy: [{ stars: 'desc' }, { downloadsCount: 'desc' }],
            take: 20,
        });
        return { harnesses };
    }
    async suggest(q) {
        const query = q.trim();
        if (!query || query.length < 2)
            return { harnesses: [] };
        const where = this.buildWhere(query);
        const harnesses = await this.prisma.harness.findMany({
            where,
            select: {
                id: true,
                slug: true,
                name: true,
                orgName: true,
                category: true,
            },
            orderBy: [{ stars: 'desc' }],
            take: 6,
        });
        return { harnesses };
    }
    buildWhere(query) {
        return {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { orgName: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { slug: { contains: query, mode: 'insensitive' } },
                { tags: { has: query.toLowerCase() } },
            ],
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map