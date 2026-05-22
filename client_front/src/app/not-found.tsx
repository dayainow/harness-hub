import Link from 'next/link';
import './globals.css';

export const revalidate = 300;

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body style={{ background: '#0A0E14', color: '#F0F6FC' }}>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div
              className="text-8xl font-black mb-4 select-none"
              style={{ color: '#232A3D', fontFamily: 'JetBrains Mono, monospace' }}
            >
              404
            </div>
            <h1 className="text-2xl font-bold mb-3">Page not found</h1>
            <p style={{ color: '#7A8290' }} className="mb-8">
              The harness you are looking for does not exist.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                color: '#0A0E14',
              }}
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
