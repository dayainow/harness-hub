import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBenchmarkDto,
  QueryBenchmarksDto,
} from './dto/create-benchmark.dto';

@Injectable()
export class BenchmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryBenchmarksDto) {
    const where: Prisma.BenchmarkWhereInput = {};
    if (query.name) where.name = query.name;
    if (query.model) where.model = query.model;

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

  async findByHarnessSlug(slug: string) {
    const harness = await this.prisma.harness.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!harness) {
      throw new NotFoundException(`Harness "${slug}" not found`);
    }
    return this.prisma.benchmark.findMany({
      where: { harnessId: harness.id },
      orderBy: { date: 'desc' },
    });
  }

  async createForSlug(slug: string, dto: CreateBenchmarkDto) {
    const harness = await this.prisma.harness.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!harness) {
      throw new NotFoundException(`Harness "${slug}" not found`);
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
}
