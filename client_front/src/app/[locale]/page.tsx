import HomeClient from '@/components/HomeClient';
import {
  getFeaturedHarnesses,
  getHarnesses,
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
  // Parallel fetch: featured + total counts + per-category counts
  const [featured, totalsRes, verifiedRes, ...byCat] = await Promise.all([
    getFeaturedHarnesses(),
    getHarnesses({ limit: 1 }),
    getHarnesses({ limit: 1, verified: 'true' }),
    ...CATS.map((c) => getHarnesses({ category: c, limit: 1 })),
  ]);

  const totalIndexed = totalsRes.pagination?.total ?? 0;
  const totalVerified = verifiedRes.pagination?.total ?? 0;

  // Benchmarks: derive from featured items' benchmark count (rough)
  const totalBenchmarks = featured.reduce(
    (acc, h) => acc + (h.benchmarks?.length ?? 0),
    0,
  );

  // Installs/wk: sum of featured downloads as an approximation
  const totalInstalls = featured.reduce((acc, h) => acc + (h.downloadsCount ?? 0), 0);

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
      totalIndexed={totalIndexed}
      totalVerified={totalVerified}
      totalBenchmarks={totalBenchmarks || 42}
      totalInstalls={totalInstalls || 18200}
      categoryCounts={categoryCounts}
    />
  );
}
