'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/context/AuthContext';
import {
  getMe,
  getMyBookmarks,
  type MeUser,
  type BookmarkItem,
} from '@/lib/api';
import { HarnessCard } from '@/components/HarnessCard';

export default function ProfilePage() {
  const { session, user, loading, signOut } = useAuth();
  const router = useRouter();

  const [me, setMe] = useState<MeUser | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [fetched, setFetched] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  // Load profile + bookmarks once session is available
  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;
    let cancelled = false;
    Promise.all([getMe(token), getMyBookmarks(token)])
      .then(([profile, items]) => {
        if (cancelled) return;
        setMe(profile);
        setBookmarks(items);
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

  // Prefer DB user fields, fall back to Supabase metadata
  const avatarUrl =
    me?.avatarUrl ??
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null;
  const displayName =
    me?.name ??
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    'User';
  const username =
    me?.username ??
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.preferred_username as string | undefined) ??
    null;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Profile header */}
      <div
        className="rounded-2xl border overflow-hidden mb-8"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div
          className="h-28"
          style={{ background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)' }}
        />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between gap-4 flex-wrap">
            <div
              className="w-20 h-20 rounded-full border-4 overflow-hidden flex items-center justify-center text-2xl font-bold shrink-0"
              style={{
                borderColor: 'var(--bg-card)',
                background: avatarUrl
                  ? 'transparent'
                  : 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                color: '#0A0E14',
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <button
              onClick={signOut}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-2)',
              }}
            >
              Sign out
            </button>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {displayName}
          </h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap text-xs" style={{ color: 'var(--text-3)' }}>
            {username && (
              <span className="font-mono-code" style={{ color: 'var(--accent)' }}>
                @{username}
              </span>
            )}
            <span style={{ color: 'var(--text-4)' }}>·</span>
            <span>{user.email}</span>
          </div>
          {me?.bio && (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
              {me.bio}
            </p>
          )}
        </div>
      </div>

      {/* Bookmarks */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Bookmarks
            </h2>
            <p
              className="font-mono-code text-xs mt-0.5"
              style={{ color: 'var(--text-3)' }}
            >
              {bookmarks.length} saved
            </p>
          </div>
        </div>

        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl border animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <p style={{ color: 'var(--text-3)' }}>
              You haven&apos;t bookmarked any harnesses yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookmarks.map((b) => (
              <HarnessCard key={b.id} harness={b.harness} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
