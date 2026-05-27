'use client';

import { Link } from '@/i18n/routing';
import { ServerCrash } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(248, 113, 113, 0.12)', color: 'var(--danger)' }}
        >
          <ServerCrash size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
          Something went wrong
        </h1>
        <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-2)' }}>
          We hit an error while loading the page.
        </p>
        <p
          className="text-xs mb-8 font-mono-code px-3 py-2 rounded inline-block"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-3)' }}
        >
          {error.message || 'Unknown error'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
              color: '#0A0E14',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-bold border transition-colors"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
