export interface SeedBenchmark {
    harnessSlug: string;
    name: string;
    score: number;
    model: string;
    date: Date;
}
export declare const BENCHMARKS: SeedBenchmark[];
