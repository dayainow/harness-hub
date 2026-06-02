import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolve the application (Prisma) User id from the Supabase-authenticated
   * email. The Supabase user is mapped to a Prisma User by unique email.
   */
  private async resolveUserId(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) {
      throw new UnauthorizedException(
        'User profile not found. Please complete signup.',
      );
    }
    return user.id;
  }

  private async ensureHarnessExists(harnessId: string): Promise<void> {
    const harness = await this.prisma.harness.findUnique({
      where: { id: harnessId },
      select: { id: true },
    });
    if (!harness) {
      throw new NotFoundException(`Harness "${harnessId}" not found`);
    }
  }

  /** Add a bookmark for the current user on the given harness. */
  async add(email: string, harnessId: string) {
    const userId = await this.resolveUserId(email);
    await this.ensureHarnessExists(harnessId);

    const existing = await this.prisma.harnessBookmark.findUnique({
      where: { userId_harnessId: { userId, harnessId } },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Already bookmarked');
    }

    const created = await this.prisma.harnessBookmark.create({
      data: { userId, harnessId },
    });
    return { bookmarked: true, id: created.id };
  }

  /** Remove the current user's bookmark on the given harness. */
  async remove(email: string, harnessId: string) {
    const userId = await this.resolveUserId(email);

    const existing = await this.prisma.harnessBookmark.findUnique({
      where: { userId_harnessId: { userId, harnessId } },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.prisma.harnessBookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }

  /** List the current user's bookmarks with the related harness included. */
  async listMine(email: string) {
    const userId = await this.resolveUserId(email);

    return this.prisma.harnessBookmark.findMany({
      where: { userId },
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

  /** Check whether the current user has bookmarked the given harness. */
  async check(email: string, harnessId: string) {
    const userId = await this.resolveUserId(email);

    const existing = await this.prisma.harnessBookmark.findUnique({
      where: { userId_harnessId: { userId, harnessId } },
      select: { id: true },
    });
    return { bookmarked: Boolean(existing) };
  }
}
