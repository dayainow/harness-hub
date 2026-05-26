'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LicenseBadge } from '@/components/LicenseBadge';
import { CATEGORY_META, formatNumber, type Harness } from '@/lib/api';

interface Props {
  harness: Harness;
  compact?: boolean;
}

export function HarnessCard({ harness, compact = false }: Props) {
  const tCommon = useTranslations('Common');
  const [org, name] = harness.slug.split('/');
  const meta = CATEGORY_META[harness.category];

  return (
    <Link
      href={`/h/${org}/${name}`}
      className="group block rounded-2xl p-5 transition-all duration-200 border hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Header line: org + verified + license */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[11px] font-mono-code" style={{ color: 'var(--text-3)' }}>
          {harness.orgName}
        </span>
        {harness.verified && (
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              color: 'var(--accent)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 11 }}>verified</span>
            {tCommon('verified')}
          </span>
        )}
        <LicenseBadge tier={harness.licenseTier} license={harness.license} className="ml-auto" />
      </div>

      {/* Name */}
      <h3
        className="text-lg font-bold mb-1.5 leading-tight truncate group-hover:text-[var(--accent)] transition-colors"
        style={{ color: 'var(--text)' }}
      >
        {harness.name}
      </h3>

      {/* Description */}
      <p
        className={`text-sm leading-relaxed mb-4 ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}
        style={{ color: 'var(--text-2)' }}
      >
        {harness.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-mono-code px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: 'var(--bg-raised)',
            color: 'var(--text-2)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 11 }}>{meta.icon}</span>
          {meta.label}
        </span>
        {harness.languages.slice(0, 2).map((lang) => (
          <span
            key={lang}
            className="text-[10px] font-mono-code px-2 py-0.5 rounded-md"
            style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-2)' }}
          >
            {lang}
          </span>
        ))}
        {harness.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono-code px-2 py-0.5 rounded-md"
            style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-3)' }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex flex-wrap items-center justify-between gap-y-2 text-[11px] font-mono-code pt-3 border-t"
        style={{ borderColor: 'var(--border-sub)', color: 'var(--text-3)' }}
      >
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>star</span>
            {formatNumber(harness.stars)}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>download</span>
            {formatNumber(harness.downloadsCount)}
          </span>
          {harness.latestVersion && (
            <span style={{ color: 'var(--text-3)' }}>{harness.latestVersion}</span>
          )}
        </div>
        {harness.installCmd && (
          <span
            className="truncate flex-1 min-w-[50px] text-right opacity-80 group-hover:opacity-100 ml-2"
            style={{ color: 'var(--accent)' }}
          >
            ↓ install
          </span>
        )}
      </div>
    </Link>
  );
}
