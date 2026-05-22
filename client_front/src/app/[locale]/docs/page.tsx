import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);

  const t = await getTranslations('Docs');

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[var(--text)]">
          {t('title')}
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] rounded"></div>
      </div>

      <div className="space-y-12">
        <section className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text)] border-b border-[var(--border-sub)] pb-4">
            {t('introTitle')}
          </h2>
          <p className="text-[var(--text-2)] leading-relaxed text-lg">
            {t('introText')}
          </p>
        </section>

        <section className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text)] border-b border-[var(--border-sub)] pb-4">
            {t('historyTitle')}
          </h2>
          <p className="text-[var(--text-2)] leading-relaxed text-lg">
            {t('historyText')}
          </p>
        </section>

        <section className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text)] border-b border-[var(--border-sub)] pb-4">
            {t('policyTitle')}
          </h2>
          <div className="text-[var(--text-2)] leading-relaxed text-lg space-y-4">
            <p>{t('policyText1')}</p>
            <p>{t('policyText2')}</p>
            
            <ul className="space-y-3 mt-6">
              <li className="flex items-start gap-3">
                <span className="shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 text-xs">G</span>
                <span className="text-[var(--text)]">{t('policyGreen')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 font-bold border border-yellow-500/20 text-xs">Y</span>
                <span className="text-[var(--text)]">{t('policyYellow')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-bold border border-red-500/20 text-xs">R</span>
                <span className="text-[var(--text)]">{t('policyRed')}</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
