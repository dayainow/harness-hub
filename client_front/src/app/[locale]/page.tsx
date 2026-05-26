import HomeClient from '@/components/HomeClient';
import {
  getFeaturedHarnesses,
  getHarnesses,
  getStats,
  type HarnessCategory,
} from '@/lib/api';

export const revalidate = 300;

const CATS: HarnessCategory[] = [
  'CODING_AGENT',
  'EVAL_HARNESS',
  'RAG_FRAMEWORK',
  'RESEARCH_AGENT',
  'TOOL_USE',
  'MULTI_AGENT',
  'BROWSER_AGENT',
  'DATA_PIPELINE',
];

export default async function HomePage() {
  // Parallel fetch: featured + site stats + per-category counts
  const [featured, stats, ...byCat] = await Promise.all([
    getFeaturedHarnesses(),
    getStats(),
    ...CATS.map((c) => getHarnesses({ category: c, limit: 1 })),
  ]);

  const categoryCounts = CATS.reduce(
    (acc, c, i) => {
      acc[c] = byCat[i]?.pagination?.total ?? 0;
      return acc;
    },
    {} as Record<HarnessCategory, number>,
  );

  return (
    <HomeClient
      featured={featured}
      totalIndexed={stats.totalHarnesses}
      totalVerified={stats.verifiedHarnesses}
      totalBenchmarks={stats.totalBenchmarks}
      totalInstalls={stats.totalDownloads}
      categoryCounts={categoryCounts}
    />
  );
}
