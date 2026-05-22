import { setRequestLocale } from 'next-intl/server';
import { getHarnessesWithBenchmarks } from '@/lib/api';
import BenchmarksClient from './BenchmarksClient';

export const revalidate = 300;

export default async function BenchmarksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const harnesses = await getHarnessesWithBenchmarks();

  return <BenchmarksClient harnesses={harnesses} />;
}
