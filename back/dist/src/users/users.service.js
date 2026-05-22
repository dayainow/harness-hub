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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            include: {
                _count: {
                    select: {
                        reviews: true,
                        collections: true,
                        bookmarks: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: users };
    }
    async updateRole(id, role) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { role },
        });
        return { success: true, data: user };
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                _count: {
                    select: {
                        reviews: true,
                        collections: true,
                        bookmarks: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { reviews: true, collections: true, bookmarks: true },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateUsername(email, username) {
        const usernameRegex = /^[a-zA-Z0-9가-힣_-]+$/;
        if (!usernameRegex.test(username)) {
            throw new common_1.BadRequestException('닉네임은 공백 없이 한글, 영문, 숫자, _ , - 만 사용할 수 있습니다.');
        }
        if (username.length < 2 || username.length > 32) {
            throw new common_1.BadRequestException('닉네임은 2자 이상 32자 이하로 설정해야 합니다.');
        }
        const existing = await this.prisma.user.findUnique({ where: { username } });
        if (existing && existing.email !== email) {
            throw new common_1.ConflictException('이미 사용 중인 닉네임입니다.');
        }
        return this.prisma.user.update({
            where: { email },
            data: { username },
        });
    }
    async listBookmarks(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User profile not found. Please complete signup.');
        }
        return this.prisma.harnessBookmark.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                harness: {
                    include: {
                        _count: { select: { reviews: true, bookmarks: true } },
                        benchmarks: { orderBy: { date: 'desc' }, take: 2 },
                    },
                },
            },
        });
    }
    async syncUser(input) {
        const { email, name, avatarUrl } = input;
        if (!email) {
            throw new common_1.BadRequestException('email is required');
        }
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            const updated = await this.prisma.user.update({
                where: { email },
                data: {
                    name: name ?? existing.name,
                    avatarUrl: avatarUrl ?? existing.avatarUrl,
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    name: true,
                    avatarUrl: true,
                    role: true,
                },
            });
            return updated;
        }
        const username = await this.generateUniqueUsername(email);
        const created = await this.prisma.user.create({
            data: {
                email,
                username,
                name: name ?? null,
                avatarUrl: avatarUrl ?? null,
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                avatarUrl: true,
                role: true,
            },
        });
        return created;
    }
    async generateUniqueUsername(email) {
        const localPart = email.split('@')[0] ?? 'user';
        const base = localPart.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24) || 'user';
        for (let attempt = 0; attempt < 10; attempt++) {
            const suffix = Math.floor(1000 + Math.random() * 9000).toString();
            const candidate = `${base}${suffix}`;
            const existing = await this.prisma.user.findUnique({
                where: { username: candidate },
                select: { id: true },
            });
            if (!existing)
                return candidate;
        }
        return `${base}${Date.now().toString().slice(-6)}`;
    }
    async toggleBookmark(email, slug) {
        const [user, harness] = await Promise.all([
            this.prisma.user.findUnique({
                where: { email },
                select: { id: true },
            }),
            this.prisma.harness.findUnique({
                where: { slug },
                select: { id: true },
            }),
        ]);
        if (!user) {
            throw new common_1.UnauthorizedException('User profile not found. Please complete signup.');
        }
        if (!harness) {
            throw new common_1.NotFoundException(`Harness "${slug}" not found`);
        }
        const existing = await this.prisma.harnessBookmark.findUnique({
            where: {
                userId_harnessId: { userId: user.id, harnessId: harness.id },
            },
        });
        if (existing) {
            await this.prisma.harnessBookmark.delete({ where: { id: existing.id } });
            return { bookmarked: false };
        }
        await this.prisma.harnessBookmark.create({
            data: { userId: user.id, harnessId: harness.id },
        });
        return { bookmarked: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map