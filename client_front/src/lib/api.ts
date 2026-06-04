/**
 * HarnessHub API client.
 * Base URL is configured via NEXT_PUBLIC_API_URL (already includes the /api suffix).
 */
import type {
  ApiResponse,
  BookmarkAddResult,
  BookmarkRemoveResult,
  BookmarkStatus,
  BookmarkMyList,
} from '@/types/bookmark';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === 'production' ? 'https://harness-hub-api-production.up.railway.app/api' : 'http://localhost:3002/api');

const DEFAULT_TIMEOUT_MS = 8000;

export interface Benchmark {
  id: string;
  harnessId: string;
  name: string;
  score: number;
  model: string;
  date: string;
}

export interface Harness {
  id: string;
  slug: string;
  name: string;
  orgName: string;
  repoUrl: string;
  description: string;
  readmeExcerpt: string | null;
  stars: number;
  forks: number;
  issuesOpen: number;
  latestVersion: string | null;
  lastUpdated: string | null;
  license: string | null;
  licenseTier: 'GREEN' | 'YELLOW' | 'RED';
  languages: string[];
  category: HarnessCategory;
  modelCompat: string[];
  tags: string[];
  verified: boolean;
  featured: boolean;
  installCmd: string | null;
  downloadsCount: number;
  /**
   * AI-generated Korean usage guide, stored as a JSON string (`@db.Text`).
   * Parse with `parseAiGuide()` from `@/types/aiGuide`. Null until generated.
   */
  aiGuide?: string | null;
  /** ISO timestamp of when `aiGuide` was last generated. Null until generated. */
  aiGuideGeneratedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  benchmarks?: Benchmark[];
  _count?: { reviews: number; bookmarks: number };
}

export type HarnessCategory =
  | 'CODING_AGENT'
  | 'EVAL_HARNESS'
  | 'RAG_FRAMEWORK'
  | 'RESEARCH_AGENT'
  | 'TOOL_USE'
  | 'MULTI_AGENT'
  | 'BROWSER_AGENT'
  | 'DATA_PIPELINE'
  | 'OTHER';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

export interface HarnessListResponse {
  items: Harness[];
  pagination: Pagination;
}

export interface QueryParams {
  category?: HarnessCategory | string;
  modelCompat?: string;
  languages?: string;
  licenseTier?: 'GREEN' | 'YELLOW' | 'RED';
  verified?: 'true' | 'false';
  featured?: 'true' | 'false';
  search?: string;
  sort?: 'stars' | 'downloads' | 'recent' | 'name';
  page?: number;
  limit?: number;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  curator?: { username: string; name: string | null; avatarUrl: string | null };
  items?: { harness: Harness }[];
}

export interface SuggestHit {
  id: string;
  slug: string;
  name: string;
  orgName: string;
  category: HarnessCategory;
}

export interface SuggestResponse {
  harnesses: SuggestHit[];
}

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : '';
}

async function safeFetch<T>(
  url: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
  fallback: T,
): Promise<T> {
  try {
    const { next, ...rest } = init;
    const res = await fetch(url, {
      ...rest,
      ...(next ? { next } : {}),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    if (!res.ok) return fallback;
    const body = await res.json();
    // Handle standard response envelope from TransformInterceptor
    if (body && typeof body === 'object' && 'statusCode' in body && 'data' in body) {
      return body.data as T;
    }
    return body as T;
  } catch {
    return fallback;
  }
}

export async function apiFetch(
  url: string,
  init: RequestInit & { next?: object } = {},
): Promise<Response> {
  const { next, ...rest } = init as RequestInit & { next?: object };
  return fetch(url, {
    ...rest,
    ...(next ? { next } : {}),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
}

export async function getHarnesses(params?: QueryParams): Promise<HarnessListResponse> {
  return safeFetch<HarnessListResponse>(
    `${API_BASE}/harnesses${buildQuery(params as Record<string, unknown>)}`,
    { next: { revalidate: 60 } },
    { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false } },
  );
}

/**
 * Returns the subset of harnesses that have at least one benchmark entry.
 * The backend `GET /harnesses` endpoint already includes a (capped) `benchmarks`
 * array on each item, so we just fetch a large page and filter client-side.
 */
export async function getHarnessesWithBenchmarks(): Promise<Harness[]> {
  const res = await getHarnesses({ limit: 100, sort: 'stars' });
  return res.items.filter((h) => Array.isArray(h.benchmarks) && h.benchmarks.length > 0);
}

export async function getFeaturedHarnesses(): Promise<Harness[]> {
  return safeFetch<Harness[]>(
    `${API_BASE}/harnesses/featured`,
    { next: { revalidate: 300 } },
    [],
  );
}

export async function getHarness(org: string, name: string): Promise<Harness | null> {
  return safeFetch<Harness | null>(
    `${API_BASE}/harnesses/${org}/${name}`,
    { next: { revalidate: 60 } },
    null,
  );
}

export async function searchHarnesses(q: string): Promise<{ harnesses: Harness[] }> {
  return safeFetch(
    `${API_BASE}/search?q=${encodeURIComponent(q)}`,
    { next: { revalidate: 30 } },
    { harnesses: [] },
  );
}

export async function suggestHarnesses(q: string): Promise<SuggestResponse> {
  return safeFetch(
    `${API_BASE}/search/suggest?q=${encodeURIComponent(q)}`,
    {},
    { harnesses: [] },
  );
}

export async function getCollections(): Promise<Collection[]> {
  return safeFetch<Collection[]>(
    `${API_BASE}/collections`,
    { next: { revalidate: 300 } },
    [],
  );
}

export async function getCollection(slug: string): Promise<Collection | null> {
  return safeFetch<Collection | null>(
    `${API_BASE}/collections/${slug}`,
    { next: { revalidate: 120 } },
    null,
  );
}

// ── Authenticated helpers ─────────────────────────────────────────────────────

export interface MeUser {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  bio?: string | null;
  createdAt?: string;
}

export function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function getMe(token: string): Promise<MeUser | null> {
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'GET',
      headers: authHeaders(token),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as MeUser;
  } catch {
    return null;
  }
}

// ── Bookmarks module (`/api/bookmarks/*`) ─────────────────────────────────────
// All endpoints require `Authorization: Bearer <supabase access_token>` and
// return the global `{ statusCode, message, data }` envelope. The helpers below
// unwrap `.data`. `harnessId` is the Harness UUID (Harness.id), NOT the slug.

/** Unwrap the `{ statusCode, message, data }` envelope. */
function unwrap<T>(body: ApiResponse<T>): T {
  return body.data;
}

/**
 * POST /api/bookmarks/:harnessId — add a bookmark.
 * The backend responds 409 if it is already bookmarked; we normalize that to a
 * successful `{ bookmarked: true }` so the UI stays idempotent.
 */
export async function addBookmark(
  harnessId: string,
  token: string,
): Promise<BookmarkAddResult> {
  const res = await fetch(`${API_BASE}/bookmarks/${harnessId}`, {
    method: 'POST',
    headers: authHeaders(token),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
  if (res.status === 409) {
    return { bookmarked: true, id: '' };
  }
  if (!res.ok) {
    throw new Error(`Failed to add bookmark (${res.status})`);
  }
  return unwrap((await res.json()) as ApiResponse<BookmarkAddResult>);
}

/**
 * DELETE /api/bookmarks/:harnessId — remove a bookmark.
 * The backend responds 404 if it was not bookmarked; we normalize that to a
 * successful `{ bookmarked: false }`.
 */
export async function removeBookmark(
  harnessId: string,
  token: string,
): Promise<BookmarkRemoveResult> {
  const res = await fetch(`${API_BASE}/bookmarks/${harnessId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
  if (res.status === 404) {
    return { bookmarked: false };
  }
  if (!res.ok) {
    throw new Error(`Failed to remove bookmark (${res.status})`);
  }
  return unwrap((await res.json()) as ApiResponse<BookmarkRemoveResult>);
}

/** GET /api/bookmarks/check/:harnessId — is this harness bookmarked by me? */
export async function checkBookmark(
  harnessId: string,
  token: string,
): Promise<BookmarkStatus> {
  const res = await fetch(`${API_BASE}/bookmarks/check/${harnessId}`, {
    method: 'GET',
    headers: authHeaders(token),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to check bookmark (${res.status})`);
  }
  return unwrap((await res.json()) as ApiResponse<BookmarkStatus>);
}

/** GET /api/bookmarks/my — list of the current user's bookmarks (harness included). */
export async function getMyBookmarks(token: string): Promise<BookmarkMyList> {
  const res = await fetch(`${API_BASE}/bookmarks/my`, {
    method: 'GET',
    headers: authHeaders(token),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to load bookmarks (${res.status})`);
  }
  return unwrap((await res.json()) as ApiResponse<BookmarkMyList>);
}

export interface SubmitHarnessPayload {
  repoUrl: string;
  name?: string;
  orgName?: string;
  description?: string;
  license?: string;
  languages?: string[];
  tags?: string[];
  stars?: number;
  category?: HarnessCategory;
  installCmd?: string;
  modelCompat?: string[];
}

export interface SubmitHarnessResult {
  ok: boolean;
  status: number;
  message?: string;
  slug?: string;
}

export async function submitHarness(
  payload: SubmitHarnessPayload,
): Promise<SubmitHarnessResult> {
  try {
    const res = await fetch(`${API_BASE}/harnesses/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    if (!res.ok) {
      let message: string | undefined;
      try {
        const body = (await res.json()) as { message?: string | string[] };
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      } catch {
        /* ignore */
      }
      return { ok: false, status: res.status, message };
    }
    // Backend returns { success: boolean, slug: string, message: string }
    try {
      const body = (await res.json()) as {
        success?: boolean;
        slug?: string;
        message?: string;
      };
      return {
        ok: body.success !== false,
        status: res.status,
        slug: body.slug,
        message: body.message,
      };
    } catch {
      return { ok: true, status: res.status };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { ok: false, status: 0, message };
  }
}

export const CATEGORY_META: Record<HarnessCategory, { label: string; icon: string }> = {
  CODING_AGENT: { label: 'Coding Agents', icon: 'code' },
  EVAL_HARNESS: { label: 'Eval Harnesses', icon: 'analytics' },
  RAG_FRAMEWORK: { label: 'RAG Frameworks', icon: 'travel_explore' },
  RESEARCH_AGENT: { label: 'Research Agents', icon: 'biotech' },
  TOOL_USE: { label: 'Tool-Use Wrappers', icon: 'build' },
  MULTI_AGENT: { label: 'Multi-Agent', icon: 'hub' },
  BROWSER_AGENT: { label: 'Browser Agents', icon: 'public' },
  DATA_PIPELINE: { label: 'Data Pipeline', icon: 'account_tree' },
  OTHER: { label: 'Other', icon: 'extension' },
};

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function relativeTime(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export interface SiteStats {
  totalHarnesses: number;
  verifiedHarnesses: number;
  totalBenchmarks: number;
  totalDownloads: number;
}

export async function getStats(): Promise<SiteStats> {
  return safeFetch<SiteStats>(
    `${API_BASE}/harnesses/stats`,
    { next: { revalidate: 300 } },
    { totalHarnesses: 0, verifiedHarnesses: 0, totalBenchmarks: 0, totalDownloads: 0 },
  );
}
