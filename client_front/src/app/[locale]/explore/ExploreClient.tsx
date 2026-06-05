'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  CATEGORY_META,
  getHarnesses,
  type Harness,
  type HarnessCategory,
  type HarnessListResponse,
  type QueryParams,
} from '@/lib/api';
import { HarnessCard } from '@/components/HarnessCard';
import { SearchX } from 'lucide-react';

interface Props {
  initialData: HarnessListResponse;
  initialQuery: QueryParams;
}

const CATEGORIES: HarnessCategory[] = [
  'CODING_AGENT',
  'EVAL_HARNESS',
  'RAG_FRAMEWORK',
  'RESEARCH_AGENT',
  'TOOL_USE',
  'MULTI_AGENT',
  'BROWSER_AGENT',
  'DATA_PIPELINE',
];

const MODELS = [
  { id: 'claude', label: 'Claude' },
  { id: 'gpt-4', label: 'GPT-4 / o1' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'llama', label: 'Llama' },
  { id: 'local', label: 'Local' },
];

const LANGUAGES = ['python', 'typescript', 'go', 'rust'];
const LICENSES: { tier: 'GREEN' | 'YELLOW' | 'RED'; label: string }[] = [
  { tier: 'GREEN', label: 'MIT / Apache' },
  { tier: 'YELLOW', label: 'GPL' },
  { tier: 'RED', label: 'Custom / Restricted' },
];

const SORTS: { id: 'stars' | 'downloads' | 'recent' | 'name'; key: string }[] = [
  { id: 'downloads', key: 'sortInstalled' },
  { id: 'recent', key: 'sortRecent' },
  { id: 'stars', key: 'sortStars' },
  { id: 'name', key: 'sortName' },
];

export default function ExploreClient({ initialData, initialQuery }: Props) {
  const t = useTranslations('Explore');
  const tCats = useTranslations('Categories');
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [data, setData] = useState<HarnessListResponse>(initialData);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Track selected filters as arrays for multi-select.
  const [categories, setCategories] = useState<string[]>(
    initialQuery.category ? (initialQuery.category as string).split(',').filter(Boolean) : [],
  );
  const [models, setModels] = useState<string[]>(
    initialQuery.modelCompat ? initialQuery.modelCompat.split(',').filter(Boolean) : [],
  );
  const [languages, setLanguages] = useState<string[]>(
    initialQuery.languages ? initialQuery.languages.split(',').filter(Boolean) : [],
  );
  const [licenseTier, setLicenseTier] = useState<string | undefined>(initialQuery.licenseTier);
  const [verified, setVerified] = useState(initialQuery.verified === 'true');
  const [featured, setFeatured] = useState(initialQuery.featured === 'true');
  const [search, setSearch] = useState(initialQuery.search ?? '');
  const [sort, setSort] = useState<QueryParams['sort']>(initialQuery.sort ?? 'stars');
  const [page, setPage] = useState(initialQuery.page ?? 1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active filter pills
  const activeFilters = useMemo(() => {
    const out: { key: string; label: string; remove: () => void }[] = [];
    categories.forEach((c) => out.push({
      key: `cat-${c}`,
      label: CATEGORY_META[c as HarnessCategory]?.label ?? c,
      remove: () => setCategories((arr) => arr.filter((x) => x !== c)),
    }));
    models.forEach((m) => out.push({
      key: `m-${m}`,
      label: MODELS.find((x) => x.id === m)?.label ?? m,
      remove: () => setModels((arr) => arr.filter((x) => x !== m)),
    }));
    languages.forEach((l) => out.push({
      key: `l-${l}`,
      label: l,
      remove: () => setLanguages((arr) => arr.filter((x) => x !== l)),
    }));
    if (licenseTier) out.push({
      key: `lic-${licenseTier}`,
      label: licenseTier,
      remove: () => setLicenseTier(undefined),
    });
    if (verified) out.push({ key: 'verified', label: `${t('verified')} ✓`, remove: () => setVerified(false) });
    if (featured) out.push({ key: 'featured', label: t('featured'), remove: () => setFeatured(false) });
    if (search) out.push({ key: 'search', label: `“${search}”`, remove: () => setSearch('') });
    return out;
  }, [categories, models, languages, licenseTier, verified, featured, search]);

  const buildQuery = (): QueryParams => {
    const allOrNone = categories.length === 0 || categories.length === CATEGORIES.length;
    return {
      category: allOrNone ? undefined : (categories.join(',') as HarnessCategory),
      modelCompat: models.length ? models.join(',') : undefined,
      languages: languages.length ? languages.join(',') : undefined,
      licenseTier: licenseTier as 'GREEN' | 'YELLOW' | 'RED' | undefined,
      verified: verified ? 'true' : undefined,
      featured: featured ? 'true' : undefined,
      search: search || undefined,
      sort,
      page,
      limit: 24,
    };
  };

  // Sync URL search params and refetch when filters change.
  // Skip the initial render — SSR already loaded initialData with the correct query.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const query = buildQuery();
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '' || v === 1 || v === 24) continue;
      usp.set(k, String(v));
    }
    const qs = usp.toString();
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
    });

    let cancelled = false;
    setLoading(true);
    getHarnesses(query)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, models, languages, licenseTier, verified, featured, search, sort, page]);

  const toggle = (arr: string[], setter: (v: string[]) => void, value: string) => {
    setPage(1);
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const clearAll = () => {
    setCategories([]);
    setModels([]);
    setLanguages([]);
    setLicenseTier(undefined);
    setVerified(false);
    setFeatured(false);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* 모바일 오버레이 배경 */}
        {mobileFilterOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60"
            onClick={() => setMobileFilterOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            lg:rounded-2xl lg:border lg:p-5 lg:self-start lg:sticky lg:top-20 lg:block
            ${mobileFilterOpen
              ? 'fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t overflow-y-auto max-h-[85vh] p-5'
              : 'hidden lg:block'}
          `}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono-code text-xs uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
              {t('filters')}
            </p>
            <div className="flex items-center gap-3">
              {activeFilters.length > 0 && (
                <button onClick={clearAll} className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  {t('clear')}
                </button>
              )}
              {/* 모바일 닫기 버튼 */}
              <button
                className="lg:hidden inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)', color: '#0A0E14' }}
                onClick={() => setMobileFilterOpen(false)}
              >
                {t('results', { count: data.pagination.total })} 보기
              </button>
            </div>
          </div>

          <FilterGroup label={t('category')}>
            {CATEGORIES.map((c) => (
              <Checkbox
                key={c}
                checked={categories.includes(c)}
                onChange={() => toggle(categories, setCategories, c)}
                label={tCats(c)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label={t('modelCompat')}>
            {MODELS.map((m) => (
              <Checkbox
                key={m.id}
                checked={models.includes(m.id)}
                onChange={() => toggle(models, setModels, m.id)}
                label={m.label}
              />
            ))}
          </FilterGroup>

          <FilterGroup label={t('language')}>
            {LANGUAGES.map((l) => (
              <Checkbox
                key={l}
                checked={languages.includes(l)}
                onChange={() => toggle(languages, setLanguages, l)}
                label={l}
              />
            ))}
          </FilterGroup>

          <FilterGroup label={t('license')}>
            {LICENSES.map((lic) => (
              <Checkbox
                key={lic.tier}
                checked={licenseTier === lic.tier}
                onChange={() => {
                  setPage(1);
                  setLicenseTier(licenseTier === lic.tier ? undefined : lic.tier);
                }}
                label={lic.label}
              />
            ))}
          </FilterGroup>

          <FilterGroup label={t('quality')} last>
            <Checkbox
              checked={verified}
              onChange={() => {
                setPage(1);
                setVerified(!verified);
              }}
              label={`${t('verified')} ✓`}
            />
            <Checkbox
              checked={featured}
              onChange={() => {
                setPage(1);
                setFeatured(!featured);
              }}
              label={t('featured')}
            />
          </FilterGroup>

        </aside>

        {/* Main */}
        <section>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {t('title')}
              </h1>
              <p
                className="font-mono-code text-xs mt-1"
                style={{ color: 'var(--text-3)' }}
              >
                {t('results', { count: data.pagination.total })}
              </p>
            </div>

            <div className="flex items-center gap-2">
            {/* 모바일: 필터 토글 버튼 */}
            <button
              className="lg:hidden inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
              onClick={() => setMobileFilterOpen(true)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>tune</span>
              {t('filters')}
              {activeFilters.length > 0 && (
                <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: 'var(--accent)', color: '#0A0E14' }}>
                  {activeFilters.length}
                </span>
              )}
            </button>
            <div
              className="flex items-center gap-2 rounded-lg border px-2 py-1"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <span
                className="font-mono-code text-[10px] uppercase tracking-widest ml-1"
                style={{ color: 'var(--text-3)' }}
              >
                {t('sort')}
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as QueryParams['sort']);
                  setPage(1);
                }}
                className="bg-transparent text-sm outline-none cursor-pointer pr-1"
                style={{ color: 'var(--text)' }}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id} style={{ backgroundColor: 'var(--bg-card)' }}>
                    {t(s.key)}
                  </option>
                ))}
              </select>
            </div>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={f.remove}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border"
                  style={{
                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                    borderColor: 'rgba(0, 229, 255, 0.3)',
                    color: 'var(--accent)',
                  }}
                >
                  {f.label}
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    close
                  </span>
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl border animate-pulse"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <div
              className="rounded-2xl border p-20 flex flex-col items-center justify-center text-center"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div 
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-3)' }}
              >
                <SearchX size={32} strokeWidth={1.5} />
              </div>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>
                No results found
              </p>
              <p style={{ color: 'var(--text-3)' }}>
                {t('empty')}
              </p>
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAll}
                  className="mt-6 px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                    color: '#0A0E14',
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.items.map((h: Harness) => (
                <HarnessCard key={h.id} harness={h} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-40"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
              >
                ← Prev
              </button>
              <span
                className="font-mono-code text-xs"
                style={{ color: 'var(--text-3)' }}
              >
                {page} / {data.pagination.totalPages}
              </span>
              <button
                disabled={!data.pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-40"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? '' : 'mb-5 pb-5 border-b'} style={!last ? { borderColor: 'var(--border-sub)' } : undefined}>
      <p
        className="font-mono-code text-[10px] uppercase tracking-widest mb-2"
        style={{ color: 'var(--text-4)' }}
      >
        {label}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className="flex items-center gap-2 text-sm cursor-pointer rounded-md px-1 py-1 transition-colors"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-raised)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span
        className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
        style={{
          backgroundColor: checked ? 'var(--accent)' : 'transparent',
          borderColor: checked ? 'var(--accent)' : 'var(--border)',
        }}
      >
        {checked && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 14, color: '#0A0E14' }}
          >
            check
          </span>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span style={{ color: 'var(--text-2)' }}>{label}</span>
    </label>
  );
}
