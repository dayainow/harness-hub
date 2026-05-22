import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(q: string): Promise<{
        harnesses: {
            name: string;
            id: string;
            slug: string;
            orgName: string;
            description: string;
            stars: number;
            category: import("@prisma/client").$Enums.HarnessCategory;
            tags: string[];
            verified: boolean;
            featured: boolean;
        }[];
    }>;
    suggest(q: string): Promise<{
        harnesses: {
            name: string;
            id: string;
            slug: string;
            orgName: string;
            category: import("@prisma/client").$Enums.HarnessCategory;
        }[];
    }>;
}
