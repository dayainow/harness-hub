import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { HarnessCard } from '@/components/HarnessCard';
import { getCollection, type Harness } from '@/lib/api';

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: 'Collection not found' };
  const t = await getTranslations({ locale, namespace: 'Collections' });
  return {
    title: collection.title,
    description: collection.description || t('subtitle'),
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const collection = await getCollection(slug);
  if (!collection) notFound();

  const t = await getTranslations({ locale, namespace: 'Collections' });

  const items: { harness: Harness }[] = Array.isArray(collection.items)
    ? collection.items
    : [];
  const itemCount = items.length;

  const curatorName =
    collection.curator?.name ?? collection.curator?.username ?? null;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        {/* Breadcrumb + back link */}
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <nav
            aria-label="Breadcrumb"
            className="text-[12px] font-mono-code flex items-center gap-1.5"
            style={{ color: 'var(--text-3)' }}
          >
            <Link
              href="/collections"
              className="transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--text-3)' }}
            >
              collections
            </Link>
            <span style={{ color: 'var(--text-4)' }}>/</span>
            <span style={{ color: 'var(--text-2)' }}>{collection.slug}</span>
          </nav>
          <Link
            href="/collections"
            className="text-[13px] font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--text-2)' }}
          >
            {t('backToCollections')}
          </Link>
        </div>

        {/* Header */}
        <header
          className="rounded-2xl border p-8 mb-10"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-mono-code uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: 'rgba(0, 229, 255, 0.10)',
                color: 'var(--accent)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 12 }}
              >
                collections_bookmark
              </span>
              Collection
            </span>
            <span
              className="text-[11px] font-mono-code px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: 'var(--bg-raised)',
                color: 'var(--text-2)',
              }}
            >
              {t('harnesses', { count: itemCount })}
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl font-black tracking-tight mb-3 leading-tight"
            style={{ color: 'var(--text)' }}
          >
            {collection.title}
          </h1>

          {collection.description && (
            <p
              className="text-base md:text-lg leading-relaxed max-w-3xl mb-6"
              style={{ color: 'var(--text-2)' }}
            >
              {collection.description}
            </p>
          )}

          {curatorName && (
            <div
              className="flex items-center gap-3 pt-5 border-t"
              style={{ borderColor: 'var(--border-sub)' }}
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                  color: '#0A0E14',
                }}
              >
                {collection.curator?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={collection.curator.avatarUrl}
                    alt={curatorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  curatorName.charAt(0).toUpperCase()
                )}
              </span>
              <div className="flex flex-col">
                <span
                  className="text-[10px] font-mono-code uppercase tracking-wider"
                  style={{ color: 'var(--text-4)' }}
                >
                  {t('curatedBy')}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {curatorName}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Items grid */}
        {itemCount === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-3)',
            }}
          >
            {t('emptyItems')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <HarnessCard key={item.harness.id} harness={item.harness} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
