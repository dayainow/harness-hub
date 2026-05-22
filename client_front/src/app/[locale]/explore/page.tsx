import ExploreClient from './ExploreClient';
import { getHarnesses, type HarnessCategory } from '@/lib/api';

interface SearchParams {
  category?: string;
  modelCompat?: string;
  languages?: string;
  licenseTier?: string;
  verified?: string;
  featured?: string;
  search?: string;
  sort?: string;
  page?: string;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const initialQuery = {
    category: sp.category as HarnessCategory | undefined,
    modelCompat: sp.modelCompat,
    languages: sp.languages,
    licenseTier: sp.licenseTier as 'GREEN' | 'YELLOW' | 'RED' | undefined,
    verified: sp.verified as 'true' | 'false' | undefined,
    featured: sp.featured as 'true' | 'false' | undefined,
    search: sp.search,
    sort: (sp.sort as 'stars' | 'downloads' | 'recent' | 'name' | undefined) ?? 'stars',
    page: sp.page ? Number(sp.page) : 1,
    limit: 24,
  };

  const initial = await getHarnesses(initialQuery);

  return <ExploreClient initialData={initial} initialQuery={initialQuery} />;
}
