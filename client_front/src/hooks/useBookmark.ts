'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addBookmark, checkBookmark, removeBookmark } from '@/lib/api';

interface UseBookmarkOptions {
  /** Called when `toggle()` runs while the user is signed out. */
  onLoginRequired?: () => void;
  /** Seeds the initial bookmarked state (e.g. from SSR) before the check fetch. */
  initialBookmarked?: boolean;
}

interface UseBookmarkResult {
  bookmarked: boolean;
  toggle: () => Promise<void>;
  /** True while the initial status fetch or a mutation is in flight. */
  loading: boolean;
}

/**
 * Manages the bookmark state of a single harness (by Harness UUID).
 *
 * - On mount (and whenever the token/harnessId changes) it calls
 *   `GET /api/bookmarks/check/:harnessId` to seed `bookmarked`.
 * - `toggle()` adds when not bookmarked, removes when bookmarked, with an
 *   optimistic update and rollback on failure.
 * - If the user is signed out, `toggle()` invokes `onLoginRequired` instead.
 */
export function useBookmark(
  harnessId: string,
  { onLoginRequired, initialBookmarked = false }: UseBookmarkOptions = {},
): UseBookmarkResult {
  const { session } = useAuth();
  const token = session?.access_token;

  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const mutatingRef = useRef(false);

  // Sync the real bookmark status once a token is available.
  useEffect(() => {
    if (!token || !harnessId) return;
    let cancelled = false;
    setLoading(true);
    checkBookmark(harnessId, token)
      .then((status) => {
        if (!cancelled) setBookmarked(status.bookmarked);
      })
      .catch(() => {
        /* keep current state on error */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [harnessId, token]);

  const toggle = useCallback(async () => {
    if (!token) {
      onLoginRequired?.();
      return;
    }
    if (mutatingRef.current) return;

    const prev = bookmarked;
    const next = !prev;
    mutatingRef.current = true;
    setBookmarked(next); // optimistic
    setLoading(true);
    try {
      if (next) {
        await addBookmark(harnessId, token);
      } else {
        await removeBookmark(harnessId, token);
      }
    } catch (err) {
      console.warn('[useBookmark] toggle failed:', err);
      setBookmarked(prev); // rollback
    } finally {
      mutatingRef.current = false;
      setLoading(false);
    }
  }, [bookmarked, harnessId, onLoginRequired, token]);

  return { bookmarked, toggle, loading };
}
