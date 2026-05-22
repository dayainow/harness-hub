import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findBySlug(slug: string) {
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
      throw new NotFoundException(`Collection "${slug}" not found`);
    }
    return collection;
  }

  async create(userEmail: string, dto: CreateCollectionDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });
    if (!user) {
      throw new UnauthorizedException(
        'User profile not found. Please complete signup.',
      );
    }

    let itemConnections: { harnessId: string }[] = [];
    if (dto.harnessSlugs?.length) {
      const harnesses = await this.prisma.harness.findMany({
        where: { slug: { in: dto.harnessSlugs } },
        select: { id: true, slug: true },
      });
      const foundSlugs = new Set(harnesses.map((h) => h.slug));
      const missing = dto.harnessSlugs.filter((s) => !foundSlugs.has(s));
      if (missing.length) {
        throw new BadRequestException(
          `Unknown harness slugs: ${missing.join(', ')}`,
        );
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
}
