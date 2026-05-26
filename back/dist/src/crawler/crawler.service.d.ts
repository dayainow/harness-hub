import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class CrawlerService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    private classifyLicense;
    handleCron(): Promise<void>;
    syncAllActiveHarnesses(): Promise<void>;
    syncHarness(harnessId: string): Promise<{
        success: boolean;
        slug: string;
        stars: any;
    } | undefined>;
}
