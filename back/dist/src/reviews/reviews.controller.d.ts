import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findAll(org: string, name: string): Promise<{
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
    create(org: string, name: string, dto: CreateReviewDto, authorization?: string): Promise<{
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
    private extractUser;
}
