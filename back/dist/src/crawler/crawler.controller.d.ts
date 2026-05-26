import { CrawlerService } from './crawler.service';
export declare class CrawlerController {
    private readonly crawlerService;
    constructor(crawlerService: CrawlerService);
    syncAll(): Promise<{
        message: string;
    }>;
    syncOne(id: string): Promise<{
        success: boolean;
        slug: string;
        stars: any;
    } | undefined>;
}
