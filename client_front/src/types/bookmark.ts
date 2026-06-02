/**
 * Bookmark integration types for the NestJS `bookmarks` module.
 *
 * Backend source of truth:
 *   - back/src/bookmarks/bookmarks.service.ts
 *   - back/src/bookmarks/bookmarks.controller.ts
 *
 * Exposed routes (global prefix `/api`):
 *   POST   /api/bookmarks/:harnessId        -> add
 *   DELETE /api/bookmarks/:harnessId        -> remove
 *   GET    /api/bookmarks/my                -> list mine (harness included)
 *   GET    /api/bookmarks/check/:harnessId  -> check status
 *
 * NOTE: `:harnessId` is the Harness UUID (Harness.id), NOT the org/name slug.
 * All endpoints require `Authorization: Bearer <supabase_access_token>`.
 *
 * The `Harness` / `Benchmark` / `HarnessCategory` shapes are reused from
 * `@/lib/api` so we keep a single source of truth on the frontend.
 */
import type { Harness } from '@/lib/api';

/**
 * Global TransformInterceptor envelope. Every backend response is wrapped as
 * `{ statusCode, message, data }`; the typed payloads below describe `data`.
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Result of GET /api/bookmarks/check/:harnessId (data field).
 * `id` is only present on the POST /api/bookmarks/:harnessId add response.
 */
export interface BookmarkStatus {
  bookmarked: boolean;
  id?: string;
}

/** POST /api/bookmarks/:harnessId (data field) — always `bookmarked: true`. */
export interface BookmarkAddResult {
  bookmarked: true;
  id: string;
}

/** DELETE /api/bookmarks/:harnessId (data field) — always `bookmarked: false`. */
export interface BookmarkRemoveResult {
  bookmarked: false;
}

/**
 * The harness shape embedded in GET /api/bookmarks/my items.
 *
 * Backend `listMine` uses:
 *   include: {
 *     harness: {
 *       include: {
 *         _count: { select: { reviews: true, bookmarks: true } },
 *         benchmarks: { orderBy: { date: 'desc' }, take: 2 },
 *       },
 *     },
 *   }
 *
 * So `benchmarks` (max 2, newest first) and `_count` are always present here.
 */
export interface BookmarkedHarness extends Harness {
  benchmarks: NonNullable<Harness['benchmarks']>;
  _count: NonNullable<Harness['_count']>;
}

/**
 * One item of GET /api/bookmarks/my (data field is `BookmarkMyItem[]`).
 * `createdAt` is an ISO string; parse with `new Date(item.createdAt)` for dates.
 */
export interface BookmarkMyItem {
  id: string;
  userId: string;
  harnessId: string;
  createdAt: string;
  harness: BookmarkedHarness;
}

/** GET /api/bookmarks/my (data field). */
export type BookmarkMyList = BookmarkMyItem[];
