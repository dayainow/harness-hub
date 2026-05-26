'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { getBookmarkStatus, toggleBookmark, type Harness } from '@/lib/api';

interface Props {
  harness: Harness;
  initialBookmarked?: boolean;
}

export function InstallBox({ harness, initialBookmarked = false }: Props) {
  const t = useTranslations('Detail');
  const tCommon = useTranslations('Common');
  const { session } = useAuth();

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState<boolean>(initialBookmarked);
  const [bookmarking, setBookmarking] = useState(false);

  // 마운트 후 실제 북마크 상태 동기화
  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;
    getBookmarkStatus(harness.slug, token)
      .then((status) => setBookmarked(status))
      .catch(() => { /* 실패 시 initialBookmarked 유지 */ });
  }, [harness.slug, session?.access_token]);

  const installCmd = harness.installCmd ?? `pip install ${harness.name.toLowerCase()}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const onBookmark = async () => {
    const token = session?.access_token;
    if (!token) {
      window.alert(t('bookmarkLoginRequired'));
      return;
    }
    if (bookmarking) return;

    // Optimistic update
    const prev = bookmarked;
    setBookmarked(!prev);
    setBookmarking(true);
    try {
      const result = await toggleBookmark(harness.slug, token);
      setBookmarked(result.bookmarked);
    } catch (err) {
      // Roll back on failure
      console.warn('[InstallBox] Failed to toggle bookmark:', err);
      setBookmarked(prev);
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <p
        className="font-mono-code text-xs mb-3 truncate"
        style={{ color: 'var(--text-3)' }}
      >
        {harness.slug}
      </p>
      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2.5 mb-3"
        style={{
          backgroundColor: 'var(--bg)',
          borderColor: 'var(--border-sub)',
        }}
      >
        <span className="font-mono-code text-sm" style={{ color: 'var(--accent)' }}>
          $
        </span>
        <code
          className="font-mono-code text-sm flex-1 truncate"
          style={{ color: 'var(--text)' }}
        >
          {installCmd}
        </code>
        <button
          onClick={copy}
          className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-2)' }}
          aria-label={tCommon('copy')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {copied ? 'check' : 'content_copy'}
          </span>
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBookmark}
          disabled={bookmarking}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? t('bookmarked') : t('bookmark')}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60"
          style={{
            backgroundColor: bookmarked ? 'rgba(0, 229, 255, 0.12)' : 'var(--bg-raised)',
            borderColor: bookmarked ? 'var(--accent)' : 'var(--border)',
            color: bookmarked ? 'var(--accent)' : 'var(--text)',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 16,
              fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {bookmarked ? 'bookmark' : 'bookmark_add'}
          </span>
          {bookmarked ? t('bookmarked') : t('bookmark')}
        </button>
        <a
          href={harness.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
            color: '#0A0E14',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            open_in_new
          </span>
          GitHub
        </a>
      </div>
    </div>
  );
}
