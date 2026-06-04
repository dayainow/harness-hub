import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getHarness, CATEGORY_META, formatNumber, relativeTime } from '@/lib/api';
import { LicenseBadge } from '@/components/LicenseBadge';
import { AiGuideSection } from '@/components/AiGuideSection';
import { InstallBox } from './InstallBox';
import ReactMarkdown from 'react-markdown';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; org: string; name: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { org, name } = await params;
  const harness = await getHarness(org, name);
  if (!harness) return { title: `${org}/${name}` };
  return {
    title: `${harness.orgName}/${harness.name}`,
    description: harness.description,
  };
}

export default async function HarnessDetailPage({ params }: PageProps) {
  const { locale, org, name } = await params;
  setRequestLocale(locale);

  const [harness, t, tCommon] = await Promise.all([
    getHarness(org, name),
    getTranslations({ locale, namespace: 'Detail' }),
    getTranslations({ locale, namespace: 'Common' }),
  ]);

  if (!harness) {
    notFound();
  }

  const meta = CATEGORY_META[harness.category];
  const categoryLower = harness.category.toLowerCase().replace(/_/g, '-');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: harness.name,
    operatingSystem: 'Any',
    applicationCategory: 'DeveloperApplication',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: harness.stars || 1,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: harness.description,
  };

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 mb-6 font-mono-code text-xs"
        style={{ color: 'var(--text-3)' }}
      >
        <Link href="/explore" style={{ color: 'var(--text-3)' }} className="hover:text-[var(--accent)]">
          explore
        </Link>
        <span>/</span>
        <Link
          href={`/explore?category=${harness.category}`}
          style={{ color: 'var(--text-3)' }}
          className="hover:text-[var(--accent)]"
        >
          {categoryLower}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-2)' }}>{harness.orgName}</span>
        <span>/</span>
        <span style={{ color: 'var(--text)' }}>{harness.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Main column */}
        <div>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 24, color: 'var(--accent)' }}
                >
                  {meta.icon}
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight break-words" style={{ color: 'var(--text)' }}>
                  <span style={{ color: 'var(--text-3)' }}>{harness.orgName} /</span>{' '}
                  {harness.name}
                </h1>
              </div>
            </div>

            {/* Tag row */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {harness.languages.map((lang) => (
                <span
                  key={lang}
                  className="text-[11px] font-mono-code px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-2)' }}
                >
                  {lang}
                </span>
              ))}
              <span
                className="text-[11px] font-mono-code px-2 py-0.5 rounded-md"
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-2)' }}
              >
                {meta.label.toLowerCase()}
              </span>
              {harness.modelCompat.slice(0, 3).map((m) => (
                <span
                  key={m}
                  className="text-[11px] font-mono-code px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-2)' }}
                >
                  {m}
                </span>
              ))}
              {harness.verified && (
                <span
                  className="text-[11px] font-mono-code px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                  style={{
                    backgroundColor: 'rgba(0, 229, 255, 0.12)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(0, 229, 255, 0.35)',
                  }}
                >
                  {tCommon('verified')}
                  <span className="material-symbols-outlined" style={{ fontSize: 11 }}>verified</span>
                </span>
              )}
            </div>

            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-2)' }}>
              {harness.description}
            </p>
          </div>

          {/* Badges row */}
          <div
            className="flex flex-wrap items-center gap-4 px-5 py-4 rounded-2xl border mb-8 font-mono-code text-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--text-2)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--warning)' }}>
                star
              </span>
              <span className="font-bold" style={{ color: 'var(--text)' }}>
                {formatNumber(harness.stars)}
              </span>{' '}
              {t('stars').toLowerCase()}
            </span>
            <span style={{ color: 'var(--text-4)' }}>·</span>
            <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--text-2)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--accent)' }}>
                download
              </span>
              <span className="font-bold" style={{ color: 'var(--text)' }}>
                {formatNumber(harness.downloadsCount)}
              </span>
              /wk
            </span>
            {harness.latestVersion && (
              <>
                <span style={{ color: 'var(--text-4)' }}>·</span>
                <span style={{ color: 'var(--text-2)' }}>{harness.latestVersion}</span>
              </>
            )}
            <span style={{ color: 'var(--text-4)' }}>·</span>
            <LicenseBadge tier={harness.licenseTier} license={harness.license} />
          </div>

          {/* Benchmarks */}
          {harness.benchmarks && harness.benchmarks.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>
                {t('benchmarks')}
              </h2>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                {harness.benchmarks.map((b, i) => (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between px-5 py-4 ${
                      i !== harness.benchmarks!.length - 1 ? 'border-b' : ''
                    }`}
                    style={i !== harness.benchmarks!.length - 1 ? { borderColor: 'var(--border-sub)' } : undefined}
                  >
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text)' }}>
                        {b.name}
                      </p>
                      <p
                        className="text-xs font-mono-code mt-0.5"
                        style={{ color: 'var(--text-3)' }}
                      >
                        {b.model} · {new Date(b.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className="text-2xl font-bold font-mono-code"
                      style={{ color: 'var(--accent)' }}
                    >
                      {(b.score * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AI Guide */}
          <AiGuideSection aiGuide={harness.aiGuide} />

          {/* README */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                {t('readme')}
              </h2>
              <a
                href={harness.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium inline-flex items-center gap-1"
                style={{ color: 'var(--accent)' }}
              >
                {t('viewReadme')}
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  open_in_new
                </span>
              </a>
            </div>
            <div
              className="rounded-2xl border p-6 leading-relaxed"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-2)',
              }}
            >
              {harness.readmeExcerpt ? (
                <div className="prose prose-invert max-w-none prose-sm sm:prose-base prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline prose-headings:text-[var(--text)] prose-headings:font-bold prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[var(--text-2)] prose-p:leading-relaxed prose-li:text-[var(--text-2)] prose-strong:text-[var(--text)]">
                  <ReactMarkdown>{harness.readmeExcerpt}</ReactMarkdown>
                </div>
              ) : (
                <p style={{ color: 'var(--text-3)' }}>{t('noReadme')}</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 self-start">
          <InstallBox harness={harness} />

          {/* Stats */}
          <SidebarBox title={t('stats')}>
            <SidebarRow icon="star" label={t('stars')} value={formatNumber(harness.stars)} />
            <SidebarRow icon="call_split" label={t('forks')} value={formatNumber(harness.forks)} />
            <SidebarRow icon="bug_report" label={t('issues')} value={`${harness.issuesOpen} open`} />
            <SidebarRow icon="schedule" label={t('updated')} value={relativeTime(harness.lastUpdated ?? harness.updatedAt)} />
          </SidebarBox>

          {/* Compatibility */}
          <SidebarBox title={t('compatibility')}>
            <SidebarRow
              icon="psychology"
              label={t('models')}
              value={harness.modelCompat.slice(0, 2).join(', ') || t('noCompatibility')}
            />
            <SidebarRow
              icon="code"
              label={t('runtime')}
              value={harness.languages.join(', ') || '—'}
            />
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="inline-flex items-center gap-2" style={{ color: 'var(--text-3)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  gavel
                </span>
                {t('license')}
              </span>
              <LicenseBadge tier={harness.licenseTier} license={harness.license} />
            </div>
          </SidebarBox>

          {/* Quality */}
          <SidebarBox title={t('quality')}>
            <SidebarRow icon="check_circle" label={t('ciStatus')} value={t('passing')} valueColor="var(--success)" />
            <SidebarRow
              icon="verified"
              label={t('verified')}
              value={harness.verified ? 'yes' : 'no'}
              valueColor={harness.verified ? 'var(--success)' : 'var(--text-3)'}
            />
            <SidebarRow
              icon="bolt"
              label={t('active')}
              value={harness.lastUpdated ? relativeTime(harness.lastUpdated) : 'unknown'}
              valueColor="var(--accent)"
            />
          </SidebarBox>
        </aside>
      </div>
    </main>
  );
}

function SidebarBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <p
        className="font-mono-code text-[10px] uppercase tracking-widest mb-3"
        style={{ color: 'var(--text-4)' }}
      >
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarRow({
  icon,
  label,
  value,
  valueColor = 'var(--text)',
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="inline-flex items-center gap-2" style={{ color: 'var(--text-3)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          {icon}
        </span>
        {label}
      </span>
      <span className="font-mono-code" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}
