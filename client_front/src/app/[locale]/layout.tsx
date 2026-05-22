import type { Metadata } from 'next';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    template: '%s | HarnessHub',
    default: 'HarnessHub - The npm of AI Agent Harnesses',
  },
  description:
    'Discover, install, and share every AI agent harness on GitHub — in one place. The npm of AI agent harnesses.',
  openGraph: {
    title: 'HarnessHub - The npm of AI Agent Harnesses',
    description: 'Discover, install, and share every AI agent harness on GitHub.',
    siteName: 'HarnessHub',
    type: 'website',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <TopNavBar />
        <div className="grow">{children}</div>
        <Footer />
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
