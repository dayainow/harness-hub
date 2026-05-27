import { Link } from '@/i18n/routing';
import { Telescope } from 'lucide-react';

export const revalidate = 300;

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md w-full text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-3)' }}
        >
          <Telescope size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
          Page not found
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-3)' }}>
          The harness you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
              color: '#0A0E14',
            }}
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="px-6 py-3 rounded-lg font-bold border transition-colors"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          >
            Explore catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
