import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
export declare class CollectionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            items: number;
        };
        curator: {
            name: string | null;
            id: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        description: string;
        updatedAt: Date;
        title: string;
        isPublic: boolean;
        curatorId: string;
    })[]>;
    findBySlug(slug: string): Promise<{
        curator: {
            name: string | null;
            id: string;
            username: string;
            avatarUrl: string | null;
        };
        items: ({
            harness: {
                benchmarks: {
                    name: string;
                    score: number;
                    model: string;
                    date: Date;
                    id: string;
                    harnessId: string;
                    createdAt: Date;
                }[];
                _count: {
                    reviews: number;
                    bookmarks: number;
                };
            } & {
                name: string;
                id: string;
                createdAt: Date;
                slug: string;
                orgName: string;
                repoUrl: string;
                description: string;
                readmeExcerpt: string | null;
                stars: number;
                forks: number;
                issuesOpen: number;
                latestVersion: string | null;
                lastUpdated: Date | null;
                license: string | null;
                licenseTier: import("@prisma/client").$Enums.LicenseTier;
                languages: string[];
                category: import("@prisma/client").$Enums.HarnessCategory;
                modelCompat: string[];
                tags: string[];
                verified: boolean;
                featured: boolean;
                status: import("@prisma/client").$Enums.HarnessStatus;
                installCmd: string | null;
                downloadsCount: number;
                updatedAt: Date;
            };
        } & {
            id: string;
            harnessId: string;
            addedAt: Date;
            collectionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        description: string;
        updatedAt: Date;
        title: string;
        isPublic: boolean;
        curatorId: string;
    }>;
    create(userEmail: string, dto: CreateCollectionDto): Promise<{
        curator: {
            name: string | null;
            id: string;
            username: string;
            avatarUrl: string | null;
        };
        items: ({
            harness: {
                name: string;
                id: string;
                createdAt: Date;
                slug: string;
                orgName: string;
                repoUrl: string;
                description: string;
                readmeExcerpt: string | null;
                stars: number;
                forks: number;
                issuesOpen: number;
                latestVersion: string | null;
                lastUpdated: Date | null;
                license: string | null;
                licenseTier: import("@prisma/client").$Enums.LicenseTier;
                languages: string[];
                category: import("@prisma/client").$Enums.HarnessCategory;
                modelCompat: string[];
                tags: string[];
                verified: boolean;
                featured: boolean;
                status: import("@prisma/client").$Enums.HarnessStatus;
                installCmd: string | null;
                downloadsCount: number;
                updatedAt: Date;
            };
        } & {
            id: string;
            harnessId: string;
            addedAt: Date;
            collectionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        description: string;
        updatedAt: Date;
        title: string;
        isPublic: boolean;
        curatorId: string;
    }>;
}
