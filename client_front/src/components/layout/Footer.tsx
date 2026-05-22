import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer
      className="mt-32 border-t"
      style={{
        backgroundColor: 'var(--bg-elev)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[15px]"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                color: '#0A0E14',
              }}
            >
              H
            </span>
            <span className="font-bold text-base" style={{ color: 'var(--text)' }}>
              HarnessHub
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
            {t('tagline')}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-mono-code mb-3" style={{ color: 'var(--text-4)' }}>
            Discover
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/explore" style={{ color: 'var(--text-2)' }}>{t('explore')}</Link></li>
            <li><Link href="/collections" style={{ color: 'var(--text-2)' }}>{t('collections')}</Link></li>
            <li><Link href="/benchmarks" style={{ color: 'var(--text-2)' }}>{t('benchmarks')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-mono-code mb-3" style={{ color: 'var(--text-4)' }}>
            Build
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/submit" style={{ color: 'var(--text-2)' }}>{t('submit')}</Link></li>
            <li><Link href="/docs" style={{ color: 'var(--text-2)' }}>{t('docs')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-mono-code mb-3" style={{ color: 'var(--text-4)' }}>
            Company
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" style={{ color: 'var(--text-2)' }}>{t('privacy')}</Link></li>
            <li><Link href="#" style={{ color: 'var(--text-2)' }}>{t('terms')}</Link></li>
            <li><Link href="#" style={{ color: 'var(--text-2)' }}>{t('contact')}</Link></li>
          </ul>
        </div>
      </div>

      <div
        className="border-t py-5 text-center text-[11px] font-mono-code"
        style={{ borderColor: 'var(--border-sub)', color: 'var(--text-4)' }}
      >
        © 2026 HarnessHub · Built for the AI agent community.
      </div>
    </footer>
  );
}
