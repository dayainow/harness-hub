import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getCollections, type Collection } from '@/lib/api';
import { CollectionCard } from './CollectionCard';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Collections' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Collections' });
  const collections = await getCollections();

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 36, color: 'var(--accent)' }}
            >
              collections_bookmark
            </span>
            <h1
              className="text-3xl md:text-4xl font-black tracking-tight"
              style={{
                background:
                  'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('title')}
            </h1>
          </div>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl"
            style={{ color: 'var(--text-2)' }}
          >
            {t('subtitle')}
          </p>
        </header>

        {/* Grid */}
        {collections.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-3)',
            }}
          >
            {t('empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {collections.map((c) => (
              <CollectionCard
                key={c.id}
                collection={c}
                harnessesLabel={t('harnesses', {
                  count: getItemCount(c),
                })}
                curatedByLabel={t('curatedBy')}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function getItemCount(c: Collection): number {
  const maybeCount = (c as unknown as { _count?: { items?: number } })._count;
  if (maybeCount && typeof maybeCount.items === 'number') return maybeCount.items;
  if (Array.isArray(c.items)) return c.items.length;
  return 0;
}
