import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        success: boolean;
        data: ({
            _count: {
                reviews: number;
                bookmarks: number;
                collections: number;
            };
        } & {
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        })[];
    }>;
    updateRole(id: string, role: string): Promise<{
        success: boolean;
        data: {
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    getMe(authorization?: string): Promise<{
        _count: {
            reviews: number;
            bookmarks: number;
            collections: number;
        };
    } & {
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        username: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    syncUser(authorization?: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        username: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    updateUsername(authorization?: string, username?: string): Promise<{
        success: boolean;
        data: {
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    listBookmarks(authorization?: string): Promise<{
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
            createdAt: Date;
            userId: string;
        })[];
    }>;
    findById(id: string): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        _count: {
            reviews: number;
            bookmarks: number;
            collections: number;
        };
        username: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    toggleBookmark(org: string, name: string, authorization?: string): Promise<{
        bookmarked: boolean;
    }>;
    private extractUser;
}
