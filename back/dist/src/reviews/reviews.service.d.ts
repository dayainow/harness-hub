import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByHarnessSlug(slug: string): Promise<{
        items: ({
            user: {
                name: string | null;
                id: string;
                username: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            harnessId: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            rating: number;
            body: string;
            usageContext: string | null;
        })[];
        summary: {
            count: number;
            averageRating: number;
        };
    }>;
    createForSlug(slug: string, userEmail: string, dto: CreateReviewDto): Promise<{
        user: {
            name: string | null;
            id: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        harnessId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        rating: number;
        body: string;
        usageContext: string | null;
    }>;
}
