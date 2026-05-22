import { BenchmarksService } from './benchmarks.service';
import { CreateBenchmarkDto, QueryBenchmarksDto } from './dto/create-benchmark.dto';
export declare class BenchmarksController {
    private readonly benchmarksService;
    constructor(benchmarksService: BenchmarksService);
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
    findByHarness(org: string, name: string): Promise<{
        name: string;
        score: number;
        model: string;
        date: Date;
        id: string;
        harnessId: string;
        createdAt: Date;
    }[]>;
    create(org: string, name: string, dto: CreateBenchmarkDto): Promise<{
        name: string;
        score: number;
        model: string;
        date: Date;
        id: string;
        harnessId: string;
        createdAt: Date;
    }>;
}
