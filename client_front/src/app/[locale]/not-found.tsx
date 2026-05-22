import { Link } from '@/i18n/routing';

export const revalidate = 300;

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md w-full text-center">
        <div
          className="text-8xl font-black mb-4 select-none font-mono-code"
          style={{ color: 'var(--bg-raised)' }}
        >
          404
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
