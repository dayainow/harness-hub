import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(q: string) {
    const query = q.trim();
    if (!query) return { harnesses: [] };

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

  async suggest(q: string) {
    const query = q.trim();
    if (!query || query.length < 2) return { harnesses: [] };

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

  private buildWhere(query: string): Prisma.HarnessWhereInput {
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
}
