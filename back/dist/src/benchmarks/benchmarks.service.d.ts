import { PrismaService } from '../prisma/prisma.service';
import { CreateBenchmarkDto, QueryBenchmarksDto } from './dto/create-benchmark.dto';
export declare class BenchmarksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryBenchmarksDto): Promise<({
        harness: {
            name: string;
            id: string;
            slug: string;
            orgName: string;
            category: import("@prisma/client").$Enums.HarnessCategory;
            verified: boolean;
        };
    } & {
        name: string;
        score: number;
        model: string;
        date: Date;
        id: string;
        harnessId: string;
        createdAt: Date;
    })[]>;
    findByHarnessSlug(slug: string): Promise<{
        name: string;
        score: number;
        model: string;
        date: Date;
        id: string;
        harnessId: string;
        createdAt: Date;
    }[]>;
    createForSlug(slug: string, dto: CreateBenchmarkDto): Promise<{
        name: string;
        score: number;
        model: string;
        date: Date;
        id: string;
        harnessId: string;
        createdAt: Date;
    }>;
}
