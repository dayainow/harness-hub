import { PrismaService } from '../prisma/prisma.service';
import { CreateHarnessDto } from './dto/create-harness.dto';
import { QueryHarnessesDto } from './dto/query-harnesses.dto';
import { SubmitHarnessDto } from './dto/submit-harness.dto';
export declare class HarnessesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    syncDescriptions(): Promise<{
        total: number;
        updated: number;
        missing: number;
        skipped: string[];
    }>;
    seedBenchmarks(): Promise<{
        total: number;
        created: number;
        skippedExisting: number;
        skippedMissing: number;
        missingSlugs: string[];
    }>;
    seedCollections(): Promise<{
        total: number;
        created: number;
        skippedExisting: number;
        createdSlugs: string[];
        skippedSlugs: string[];
        missingHarnesses: Record<string, string[]>;
    }>;
    findAll(query: QueryHarnessesDto): Promise<{
        items: ({
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
        };
    }>;
    findFeatured(): Promise<({
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
    })[]>;
    findBySlug(slug: string): Promise<{
        benchmarks: {
            name: string;
            score: number;
            model: string;
            date: Date;
            id: string;
            harnessId: string;
            createdAt: Date;
        }[];
        reviews: ({
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
    }>;
    create(dto: CreateHarnessDto): Promise<{
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
    }>;
    submitHarness(dto: SubmitHarnessDto): Promise<{
        success: boolean;
        slug: string;
        message: string;
    }>;
    private extractSlugFromRepoUrl;
    getStats(): Promise<{
        totalHarnesses: number;
        verifiedHarnesses: number;
        totalBenchmarks: number;
        totalDownloads: number;
    }>;
    updateStats(slug: string, stats: {
        stars?: number;
        forks?: number;
        issuesOpen?: number;
        downloadsCount?: number;
        lastUpdated?: Date;
    }): Promise<{
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
    }>;
    private buildWhere;
    private buildOrderBy;
    private splitCsv;
    private expandModelMatch;
}
