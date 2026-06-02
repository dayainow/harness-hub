'use client';

import { useTranslations } from 'next-intl';
import { useBookmark } from '@/hooks/useBookmark';

interface Props {
  /** Harness UUID (Harness.id), NOT the slug. */
  harnessId: string;
  /** Called when an unauthenticated user attempts to bookmark. */
  onLoginRequired?: () => void;
  /** Seeds the initial bookmarked state before the check fetch resolves. */
  initialBookmarked?: boolean;
  /** Render the label text next to the icon (default: icon only). */
  showLabel?: boolean;
  className?: string;
}

/**
 * Bookmark (찜하기) toggle button. Filled icon when bookmarked, outlined when not.
 * Uses the `useBookmark` hook for state + optimistic mutations.
 */
export function BookmarkButton({
  harnessId,
  onLoginRequired,
  initialBookmarked = false,
  showLabel = false,
  className = '',
}: Props) {
  const t = useTranslations('Detail');
  const { bookmarked, toggle, loading } = useBookmark(harnessId, {
    onLoginRequired,
    initialBookmarked,
  });

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? t('bookmarked') : t('bookmark')}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60 ${className}`}
      style={{
        backgroundColor: bookmarked ? 'rgba(0, 229, 255, 0.12)' : 'var(--bg-raised)',
        borderColor: bookmarked ? 'var(--accent)' : 'var(--border)',
        color: bookmarked ? 'var(--accent)' : 'var(--text-3)',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 18,
          fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        bookmark
      </span>
      {showLabel && (bookmarked ? t('bookmarked') : t('bookmark'))}
    </button>
  );
}
