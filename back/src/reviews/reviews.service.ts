import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByHarnessSlug(slug: string) {
    const harness = await this.prisma.harness.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!harness) {
      throw new NotFoundException(`Harness "${slug}" not found`);
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

  async createForSlug(
    slug: string,
    userEmail: string,
    dto: CreateReviewDto,
  ) {
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
      throw new NotFoundException(`Harness "${slug}" not found`);
    }
    if (!user) {
      throw new UnauthorizedException(
        'User profile not found. Please complete signup.',
      );
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
}
