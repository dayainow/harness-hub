import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Role = 'USER' | 'ADMIN' | 'CURATOR';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

  async updateRole(id: string, role: Role) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
    });
    return { success: true, data: user };
  }

  async findByEmail(email: string) {
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

  async findById(id: string) {
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
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUsername(email: string, username: string) {
    const usernameRegex = /^[a-zA-Z0-9가-힣_-]+$/;
    if (!usernameRegex.test(username)) {
      throw new BadRequestException(
        '닉네임은 공백 없이 한글, 영문, 숫자, _ , - 만 사용할 수 있습니다.',
      );
    }
    if (username.length < 2 || username.length > 32) {
      throw new BadRequestException(
        '닉네임은 2자 이상 32자 이하로 설정해야 합니다.',
      );
    }
    const existing = await this.prisma.user.findUnique({ where: { username } });
    if (existing && existing.email !== email) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }
    return this.prisma.user.update({
      where: { email },
      data: { username },
    });
  }

  async listBookmarks(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) {
      throw new UnauthorizedException(
        'User profile not found. Please complete signup.',
      );
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

  async syncUser(input: {
    supabaseId: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  }) {
    const { email, name, avatarUrl } = input;
    if (!email) {
      throw new BadRequestException('email is required');
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

  private async generateUniqueUsername(email: string): Promise<string> {
    const localPart = email.split('@')[0] ?? 'user';
    // sanitize: keep allowed chars only
    const base = localPart.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24) || 'user';

    for (let attempt = 0; attempt < 10; attempt++) {
      const suffix = Math.floor(1000 + Math.random() * 9000).toString();
      const candidate = `${base}${suffix}`;
      const existing = await this.prisma.user.findUnique({
        where: { username: candidate },
        select: { id: true },
      });
      if (!existing) return candidate;
    }
    // very unlikely fallback
    return `${base}${Date.now().toString().slice(-6)}`;
  }

  async toggleBookmark(email: string, slug: string) {
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
      throw new UnauthorizedException(
        'User profile not found. Please complete signup.',
      );
    }
    if (!harness) {
      throw new NotFoundException(`Harness "${slug}" not found`);
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
}
