'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/context/AuthContext';
import { getMyBookmarks } from '@/lib/api';
import type { BookmarkMyItem } from '@/types/bookmark';
import { HarnessCard } from '@/components/HarnessCard';

export default function MyToolboxPage() {
  const t = useTranslations('MyToolbox');
  const { session, user, loading } = useAuth();
  const router = useRouter();

  const [bookmarks, setBookmarks] = useState<BookmarkMyItem[]>([]);
  const [fetched, setFetched] = useState(false);

  // Redirect to home when not authenticated.
  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  // Load bookmarks once the access token is available.
  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;
    let cancelled = false;
    getMyBookmarks(token)
      .then((items) => {
        if (!cancelled) setBookmarks(items);
      })
      .catch(() => {
        if (!cancelled) setBookmarks([]);
      })
      .finally(() => {
        if (!cancelled) setFetched(true);
      });
    return () => {
      cancelled = true;
    };
  }, [session?.access_token]);

  const fetching = !fetched && !!session?.access_token;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{
            borderTop: '2px solid var(--accent)',
            borderRight: '2px solid transparent',
            borderBottom: '2px solid transparent',
            borderLeft: '2px solid transparent',
          }}
        />
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 28, color: 'var(--accent)' }}
          >
            bookmark
          </span>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {t('title')}
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          {t('subtitle')}
        </p>
        {fetched && bookmarks.length > 0 && (
          <p
            className="font-mono-code text-xs mt-2"
            style={{ color: 'var(--text-3)' }}
          >
            {t('count', { count: bookmarks.length })}
          </p>
        )}
      </div>

      {/* Body */}
      {fetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-2xl border animate-pulse"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div
          className="rounded-2xl border p-16 text-center flex flex-col items-center gap-3"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 40, color: 'var(--text-4)' }}
          >
            bookmark_border
          </span>
          <p className="text-base font-medium" style={{ color: 'var(--text-2)' }}>
            {t('empty')}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            {t('emptyHint')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookmarks.map((b) => (
            <HarnessCard key={b.id} harness={b.harness} />
          ))}
        </div>
      )}
    </main>
  );
}
