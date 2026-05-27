'use client';

import { useState, type FormEvent } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  CATEGORY_META,
  formatNumber,
  type Harness,
  type HarnessCategory,
} from '@/lib/api';
import { HarnessCard } from '@/components/HarnessCard';

interface Props {
  featured: Harness[];
  totalIndexed: number;
  totalVerified: number;
  totalBenchmarks: number;
  totalInstalls: number;
  categoryCounts: Record<HarnessCategory, number>;
}

const TRENDING = ['SWE-agent', 'aider', 'cline', 'claude-code', 'openhands'];

const CATEGORY_ORDER: HarnessCategory[] = [
  'CODING_AGENT',
  'EVAL_HARNESS',
  'RAG_FRAMEWORK',
  'RESEARCH_AGENT',
  'TOOL_USE',
  'MULTI_AGENT',
  'BROWSER_AGENT',
  'DATA_PIPELINE',
];

import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
});

export default function HomeClient({
  featured,
  totalIndexed,
  totalVerified,
  totalBenchmarks,
  totalInstalls,
  categoryCounts,
}: Props) {
  const tHero = useTranslations('Hero');
  const tStats = useTranslations('Stats');
  const tFeat = useTranslations('Featured');
  const tCats = useTranslations('Categories');
  const [q, setQ] = useState('');
  const router = useRouter();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    router.push(`/explore?search=${encodeURIComponent(v)}`);
  };

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[600px] flex flex-col justify-center">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0 hero-radial" aria-hidden />
        
        {/* Interactive 3D Background */}
        <ThreeBackground />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 pt-24 pb-20 w-full pointer-events-none">
          <div className="pointer-events-auto">
            <p
            className="font-mono-code text-xs tracking-[0.3em] mb-6"
            style={{ color: 'var(--accent)' }}
          >
            {tHero('tagline')}
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-balance mb-6"
            style={{ color: 'var(--text)' }}
          >
            {tHero('titleA')}
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {tHero('titleB')}
            </span>
            <br />
            {tHero('titleC')}
          </motion.h1>

          <p
            className="text-lg max-w-2xl mb-10 leading-relaxed"
            style={{ color: 'var(--text-2)' }}
          >
            {tHero('subtitle')}
          </p>

          {/* Search bar */}
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl">
            <div
              className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, color: 'var(--text-3)' }}
              >
                search
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={tHero('searchPlaceholder')}
                className="flex-1 bg-transparent outline-none text-base"
                style={{ color: 'var(--text)' }}
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                color: '#0A0E14',
              }}
            >
              {tHero('search')}
            </button>
          </form>

          {/* Trending */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <span
              className="font-mono-code text-xs uppercase tracking-widest mr-1"
              style={{ color: 'var(--text-4)' }}
            >
              {tHero('trending')}
            </span>
            {TRENDING.map((t) => (
              <button
                key={t}
                onClick={() => router.push(`/explore?search=${encodeURIComponent(t)}`)}
                className="text-xs font-mono-code px-2.5 py-1 rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-2)',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Terminal box */}
          <div
            className="rounded-xl border overflow-hidden max-w-2xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              boxShadow: '0 20px 60px -20px rgba(0, 229, 255, 0.15)',
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b"
              style={{ borderColor: 'var(--border-sub)' }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F87171' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FBBF24' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#4ADE80' }} />
              <span
                className="ml-3 text-[11px] font-mono-code"
                style={{ color: 'var(--text-4)' }}
              >
                ~/harnesshub
              </span>
            </div>
            <div className="px-5 py-4 font-mono-code text-sm leading-relaxed">
              <p style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--accent)' }}>$</span> npx harnesshub install swe-agent
              </p>
              <p style={{ color: 'var(--text-2)' }}>
                → Pulling from github.com/princeton-nlp/SWE-agent ...
              </p>
              <p style={{ color: 'var(--text-2)' }}>
                → Resolved 14 dependencies · ready in 3.2s{' '}
                <span style={{ color: 'var(--success)' }}>✓</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* STATS BAR */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="border-y"
        style={{
          backgroundColor: 'var(--bg-elev)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: tStats('indexed'), value: formatNumber(totalIndexed) },
            { label: tStats('verified'), value: formatNumber(totalVerified) },
            { label: tStats('benchmarks'), value: formatNumber(totalBenchmarks) },
            { label: tStats('installs'), value: formatNumber(totalInstalls) },
          ].map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p
                className="font-mono-code text-2xl md:text-3xl font-bold"
                style={{ color: 'var(--accent)' }}
              >
                {s.value}
              </p>
              <p
                className="text-xs font-mono-code uppercase tracking-widest mt-1"
                style={{ color: 'var(--text-3)' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* FEATURED */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-[1200px] mx-auto px-4 md:px-6 py-20"
      >
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--accent)' }}>⚡</span> {tFeat('title')}
              </h2>
              <span
                className="text-[10px] font-mono-code uppercase tracking-widest px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: 'rgba(0, 229, 255, 0.08)',
                  borderColor: 'rgba(0, 229, 255, 0.3)',
                  color: 'var(--accent)',
                }}
              >
                {tFeat('badge')}
              </span>
            </div>
          </div>
          <Link
            href="/explore?featured=true"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {tFeat('viewAll')} →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <p style={{ color: 'var(--text-3)' }}>No featured harnesses available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.slice(0, 6).map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <HarnessCard harness={h} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* BY CATEGORY */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-[1200px] mx-auto px-4 md:px-6 py-20"
      >
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            {tCats('title')}
          </h2>
          <p style={{ color: 'var(--text-3)' }}>{tCats('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORY_ORDER.map((cat, i) => {
            const meta = CATEGORY_META[cat];
            const count = categoryCounts[cat] ?? 0;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/explore?category=${cat}`}
                className="group flex flex-col rounded-2xl p-6 border transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 26, color: 'var(--accent)' }}
                  >
                    {meta.icon}
                  </span>
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                  {tCats(cat)}
                </p>
                <p className="text-xs font-mono-code" style={{ color: 'var(--text-3)' }}>
                  {tCats('count', { count })}
                </p>
              </Link>
            </motion.div>
            );
          })}
        </div>
      </motion.section>
    </main>
  );
}
