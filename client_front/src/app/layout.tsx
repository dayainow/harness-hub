import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    template: '%s | HarnessHub',
    default: 'HarnessHub - The npm of AI Agent Harnesses',
  },
  description:
    'Discover, install, and share AI agent harnesses. The npm of AI agent harnesses — curated from GitHub.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="dark sm:scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen antialiased flex flex-col"
        style={{ background: 'var(--bg)', color: 'var(--text)' }}
      >
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
