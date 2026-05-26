'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CATEGORY_META, type Benchmark, type Harness } from '@/lib/api';

interface Props {
  harnesses: Harness[];
}

interface LeaderboardRow {
  harness: Harness;
  benchmark: Benchmark;
  org: string;
  name: string;
}

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function formatScore(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export default function BenchmarksClient({ harnesses }: Props) {
  const t = useTranslations('Benchmarks');

  // Flatten every (harness × benchmark) pair into individual rows.
  const allRows = useMemo<LeaderboardRow[]>(() => {
    const rows: LeaderboardRow[] = [];
    for (const h of harnesses) {
      const [org, name] = h.slug.split('/');
      for (const b of h.benchmarks ?? []) {
        rows.push({ harness: h, benchmark: b, org, name });
      }
    }
    return rows;
  }, [harnesses]);

  // Collect distinct benchmark names for the tab filter.
  const benchmarkNames = useMemo(() => {
    const set = new Set<string>();
    for (const row of allRows) set.add(row.benchmark.name);
    return Array.from(set).sort();
  }, [allRows]);

  const [activeTab, setActiveTab] = useState<string>('ALL');

  const filteredRows = useMemo(() => {
    const rows = activeTab === 'ALL'
      ? allRows
      : allRows.filter((r) => r.benchmark.name === activeTab);
    return [...rows].sort((a, b) => b.benchmark.score - a.benchmark.score);
  }, [allRows, activeTab]);

  const maxScore = useMemo(() => {
    if (!filteredRows.length) return 1;
    return Math.max(0.01, ...filteredRows.map((r) => r.benchmark.score));
  }, [filteredRows]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 32, color: '#FFD700' }}
              aria-hidden
            >
              trophy
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              {t('title')}
            </h1>
          </div>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-2)' }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Benchmark tab filter */}
        {benchmarkNames.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <TabButton
              label={t('allBenchmarks')}
              active={activeTab === 'ALL'}
              onClick={() => setActiveTab('ALL')}
            />
            {benchmarkNames.map((name) => (
              <TabButton
                key={name}
                label={name}
                active={activeTab === name}
                onClick={() => setActiveTab(name)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredRows.length === 0 ? (
          <div
            className="rounded-2xl border py-20 px-6 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-3)',
            }}
          >
            <span
              className="material-symbols-outlined block mb-3"
              style={{ fontSize: 40, color: 'var(--text-4)' }}
              aria-hidden
            >
              analytics
            </span>
            <p className="text-sm">{t('empty')}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div
              className="hidden md:block rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-left text-[11px] uppercase tracking-widest font-mono-code"
                    style={{
                      backgroundColor: 'var(--bg-raised)',
                      color: 'var(--text-4)',
                    }}
                  >
                    <th className="px-5 py-3 w-16">{t('rank')}</th>
                    <th className="px-5 py-3">{t('harness')}</th>
                    <th className="px-5 py-3">{t('category')}</th>
                    <th className="px-5 py-3 w-[26%]">{t('score')}</th>
                    <th className="px-5 py-3">{t('model')}</th>
                    <th className="px-5 py-3">{t('date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, index) => (
                    <LeaderboardTableRow
                      key={`${row.harness.id}-${row.benchmark.id}`}
                      row={row}
                      rank={index + 1}
                      maxScore={maxScore}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden flex flex-col gap-3">
              {filteredRows.map((row, index) => (
                <LeaderboardCard
                  key={`${row.harness.id}-${row.benchmark.id}`}
                  row={row}
                  rank={index + 1}
                  maxScore={maxScore}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-mono-code uppercase tracking-widest px-3.5 py-2 rounded-lg border transition-all cursor-pointer"
      style={{
        backgroundColor: active ? 'rgba(0, 229, 255, 0.12)' : 'var(--bg-card)',
        borderColor: active ? 'var(--accent)' : 'var(--border)',
        color: active ? 'var(--accent)' : 'var(--text-2)',
      }}
    >
      {label}
    </button>
  );
}

function RankCell({ rank }: { rank: number }) {
  const medalColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : null;
  if (medalColor) {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
        style={{
          backgroundColor: `${medalColor}22`,
          color: medalColor,
          border: `1px solid ${medalColor}66`,
        }}
      >
        {rank}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 font-mono-code text-sm"
      style={{ color: 'var(--text-3)' }}
    >
      {rank}
    </span>
  );
}

function ScoreBar({
  score,
  maxScore,
  highlight,
}: {
  score: number;
  maxScore: number;
  highlight?: string | null;
}) {
  const widthPct = Math.max(2, Math.min(100, (score / maxScore) * 100));
  const barColor = highlight ?? 'var(--accent)';
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-bold text-base font-mono-code shrink-0"
        style={{ color: highlight ?? 'var(--text)', minWidth: 64 }}
      >
        {formatScore(score)}
      </span>
      <div
        className="relative h-2 grow rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--bg-raised)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{
            width: `${widthPct}%`,
            background: highlight
              ? `linear-gradient(90deg, ${barColor} 0%, ${barColor}aa 100%)`
              : 'linear-gradient(90deg, #00E5FF 0%, #A78BFA 100%)',
          }}
        />
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: Harness['category'] }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-mono-code px-2 py-0.5 rounded-md whitespace-nowrap"
      style={{
        backgroundColor: 'var(--bg-raised)',
        color: 'var(--text-2)',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 11 }}>
        {meta.icon}
      </span>
      {meta.label}
    </span>
  );
}

function LeaderboardTableRow({
  row,
  rank,
  maxScore,
}: {
  row: LeaderboardRow;
  rank: number;
  maxScore: number;
}) {
  const medalColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : null;
  return (
    <tr
      className="border-t transition-colors hover:bg-[var(--bg-raised)]"
      style={{ borderColor: 'var(--border-sub)' }}
    >
      <td className="px-5 py-4 align-middle">
        <RankCell rank={rank} />
      </td>
      <td className="px-5 py-4 align-middle">
        <Link
          href={`/h/${row.org}/${row.name}`}
          className="group inline-flex flex-col gap-0.5"
        >
          <span
            className="text-[11px] font-mono-code"
            style={{ color: 'var(--text-3)' }}
          >
            {row.harness.orgName}
          </span>
          <span
            className="text-sm font-semibold transition-colors group-hover:text-[var(--accent)]"
            style={{ color: 'var(--text)' }}
          >
            {row.harness.name}
            <span
              className="ml-2 text-[11px] font-mono-code"
              style={{ color: 'var(--text-3)' }}
            >
              · {row.benchmark.name}
            </span>
          </span>
        </Link>
      </td>
      <td className="px-5 py-4 align-middle">
        <CategoryBadge category={row.harness.category} />
      </td>
      <td className="px-5 py-4 align-middle">
        <ScoreBar
          score={row.benchmark.score}
          maxScore={maxScore}
          highlight={medalColor}
        />
      </td>
      <td
        className="px-5 py-4 align-middle text-[12px] font-mono-code"
        style={{ color: 'var(--text-2)' }}
      >
        {row.benchmark.model}
      </td>
      <td
        className="px-5 py-4 align-middle text-[12px] font-mono-code"
        style={{ color: 'var(--text-3)' }}
      >
        {formatDate(row.benchmark.date)}
      </td>
    </tr>
  );
}

function LeaderboardCard({
  row,
  rank,
  maxScore,
}: {
  row: LeaderboardRow;
  rank: number;
  maxScore: number;
}) {
  const medalColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : null;
  const t = useTranslations('Benchmarks');
  return (
    <Link
      href={`/h/${row.org}/${row.name}`}
      className="block rounded-2xl border p-4 transition-colors"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: medalColor ?? 'var(--border)',
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <RankCell rank={rank} />
        <div className="grow min-w-0">
          <p
            className="text-[11px] font-mono-code mb-0.5"
            style={{ color: 'var(--text-3)' }}
          >
            {row.harness.orgName}
          </p>
          <p
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--text)' }}
          >
            {row.harness.name}
          </p>
          <p
            className="text-[11px] font-mono-code mt-0.5"
            style={{ color: 'var(--text-3)' }}
          >
            {row.benchmark.name}
          </p>
        </div>
      </div>

      <ScoreBar
        score={row.benchmark.score}
        maxScore={maxScore}
        highlight={medalColor}
      />

      <div
        className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t text-[11px] font-mono-code"
        style={{ borderColor: 'var(--border-sub)', color: 'var(--text-3)' }}
      >
        <CategoryBadge category={row.harness.category} />
        <span>·</span>
        <span>{row.benchmark.model}</span>
        <span>·</span>
        <span>{formatDate(row.benchmark.date)}</span>
        <span className="ml-auto" style={{ color: 'var(--accent)' }}>
          {t('viewHarness')} →
        </span>
      </div>
    </Link>
  );
}
