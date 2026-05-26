import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

const CHANGELOG = [
  {
    version: 'v0.3.0',
    date: '2026-05',
    tag: 'latest',
    tagColor: '#00E5FF',
    items: [
      'GitHub OAuth 로그인 · 프로필 페이지',
      'Submit 페이지 — GitHub URL → 메타 자동 추출 후 등록 신청',
      'Vercel(프론트) + Railway(백엔드) 프로덕션 배포',
      'Supabase Auth 연동 완료',
    ],
    itemsEn: [
      'GitHub OAuth login · Profile page',
      'Submit page — GitHub URL → auto-extract metadata & request listing',
      'Production deployment: Vercel (frontend) + Railway (backend)',
      'Supabase Auth integration complete',
    ],
  },
  {
    version: 'v0.2.0',
    date: '2026-05',
    tag: 'stable',
    tagColor: '#A78BFA',
    items: [
      'Benchmark Leaderboard — 탭 필터, 점수 바, 메달 뱃지',
      'Collections 목록 · 상세 페이지',
      '시드 데이터 확장: 하네스 40개, 컬렉션 6개, 벤치마크 10종',
      'Docs 페이지 신설',
    ],
    itemsEn: [
      'Benchmark Leaderboard — tab filters, score bars, medal badges',
      'Collections list & detail pages',
      'Seed data expanded: 40 harnesses, 6 collections, 10 benchmarks',
      'Docs page added',
    ],
  },
  {
    version: 'v0.1.0',
    date: '2026-04',
    tag: 'initial',
    tagColor: '#64748B',
    items: [
      '하네스 카탈로그 (Explore) — 카테고리·모델 필터, 정렬',
      '하네스 상세 페이지 — README, 벤치마크, 설치 명령어',
      'i18n 다국어 지원 (한국어 · English)',
      '다크모드 디자인 시스템 구축',
      'NestJS + Prisma + PostgreSQL(Supabase) 백엔드 초기 구축',
    ],
    itemsEn: [
      'Harness catalog (Explore) — category & model filters, sorting',
      'Harness detail page — README, benchmarks, install command',
      'i18n multilingual support (Korean · English)',
      'Dark mode design system',
      'NestJS + Prisma + PostgreSQL (Supabase) backend foundation',
    ],
  },
];

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);

  const t = await getTranslations('Docs');
  const isKo = locale === 'ko';

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[var(--text)]">
          {t('title')}
        </h1>
        <div className="h-1 w-20 rounded" style={{ background: 'linear-gradient(90deg, var(--accent), var(--secondary))' }} />
      </div>

      <div className="space-y-12">
        {/* What is HarnessHub */}
        <section className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text)] border-b border-[var(--border-sub)] pb-4">
            {t('introTitle')}
          </h2>
          <p className="text-[var(--text-2)] leading-relaxed text-lg">
            {t('introText')}
          </p>
        </section>

        {/* Version History */}
        <section className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-8 text-[var(--text)] border-b border-[var(--border-sub)] pb-4">
            {isKo ? '버전 히스토리' : 'Version History'}
          </h2>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)]" />

            <div className="space-y-10">
              {CHANGELOG.map((entry) => (
                <div key={entry.version} className="relative pl-8">
                  {/* dot */}
                  <div
                    className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-elev)]"
                    style={{ backgroundColor: entry.tagColor }}
                  />

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-lg font-black font-mono-code" style={{ color: entry.tagColor }}>
                      {entry.version}
                    </span>
                    <span
                      className="text-[10px] font-mono-code uppercase tracking-widest px-2 py-0.5 rounded-md border"
                      style={{
                        color: entry.tagColor,
                        borderColor: `${entry.tagColor}44`,
                        backgroundColor: `${entry.tagColor}11`,
                      }}
                    >
                      {entry.tag}
                    </span>
                    <span className="text-[12px] font-mono-code" style={{ color: 'var(--text-4)' }}>
                      {entry.date}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {(isKo ? entry.items : entry.itemsEn).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                        <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.tagColor }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Submission Policy */}
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
