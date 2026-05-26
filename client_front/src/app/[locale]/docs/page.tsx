import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

const CHANGELOG = [
  {
    version: 'v0.4.0',
    date: '2026-05',
    tag: 'latest',
    tagColor: '#00E5FF',
    items: [
      'HarnessHub CLI 툴 출시 (npx harnesshub install)',
      'GitHub 12시간 주기 자동 크롤링 엔진 구축',
      'SPDX 3-Tier (Green/Yellow/Red) 라이선스 자동 판별 파이프라인 적용',
      'Vercel(프론트) 및 Railway(백엔드) 프로덕션 자동 배포 파이프라인 구성',
      '신규 네온-블루 로고 및 사이버네틱 UI 브랜딩 적용',
    ],
    itemsEn: [
      'HarnessHub CLI Tool released (npx harnesshub install)',
      '12-hour GitHub auto-crawler engine implemented',
      'SPDX 3-Tier (Green/Yellow/Red) license classification pipeline added',
      'Vercel (frontend) & Railway (backend) automated production deployment',
      'New neon-blue logo and cybernetic UI branding applied',
    ],
  },
  {
    version: 'v0.3.0',
    date: '2026-05',
    tag: 'stable',
    tagColor: '#A78BFA',
    items: [
      'GitHub OAuth 로그인 · 프로필 페이지',
      'Submit 페이지 — GitHub URL → 메타 자동 추출 후 등록 신청',
      'Supabase Auth 연동 완료',
    ],
    itemsEn: [
      'GitHub OAuth login · Profile page',
      'Submit page — GitHub URL → auto-extract metadata & request listing',
      'Supabase Auth integration complete',
    ],
  },
  {
    version: 'v0.2.0',
    date: '2026-05',
    tag: 'stable',
    tagColor: '#64748B',
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

  const isKo = locale === 'ko';

  return (
    <main className="min-h-screen pt-24 pb-32 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6" style={{ color: 'var(--text)' }}>
          {isKo ? 'HarnessHub 소개 및 문서' : 'HarnessHub Documentation'}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-2)' }}>
          {isKo 
            ? 'AI 에이전트 생태계의 중앙 디스커버리 플랫폼이자 패키지 매니저.' 
            : 'The central discovery platform and package manager for the AI Agent ecosystem.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Significance & How to Use (Span 7) */}
        <div className="lg:col-span-7 space-y-8 lg:space-y-10">
          
          {/* 1. Significance */}
          <section className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-3xl p-6 lg:p-8 hover:border-[var(--accent)] transition-colors duration-300 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[var(--accent)] text-3xl">public</span>
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text)]">
                {isKo ? 'HarnessHub의 의의 (Why HarnessHub?)' : 'Significance of HarnessHub'}
              </h2>
            </div>
            <div className="space-y-4 text-[var(--text-2)] leading-relaxed text-base md:text-lg">
              <p>
                {isKo 
                  ? '생성형 AI 생태계가 챗봇에서 자율 에이전트(Autonomous Agent) 중심으로 진화하면서 수많은 코딩 에이전트, 리서치 툴, RAG 프레임워크가 깃허브에 쏟아지고 있습니다.' 
                  : 'As the generative AI ecosystem evolves from chatbots to Autonomous Agents, countless tools are flooding GitHub.'}
              </p>
              <p>
                {isKo 
                  ? '하지만 기존에는 내가 원하는 에이전트를 찾기 위해 깃허브를 떠돌며 파편화된 README를 일일이 확인해야 했고, 특히 기업 환경에서 치명적인 라이선스 문제(GPL 등)를 사전에 파악하기 어려웠습니다.' 
                  : 'Finding the right agent required wandering through fragmented READMEs, making it difficult to identify critical license risks (like GPL) in enterprise environments.'}
              </p>
              <p className="font-semibold text-[var(--text)]">
                {isKo 
                  ? 'HarnessHub는 이 복잡한 에이전트들을 카테고리별로 분류하고, 벤치마크 성능표를 제공하며, 라이선스 위험도를 원천 차단하여 안전하게 배포(Install)할 수 있도록 돕는 "AI 에이전트계의 npm" 역할을 수행합니다.' 
                  : 'HarnessHub acts as the "npm for AI agents," classifying tools, providing benchmark tables, and mitigating license risks for safe deployment.'}
              </p>
            </div>
          </section>

          {/* 2. How to Use */}
          <section className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-3xl p-6 lg:p-8 hover:border-[var(--accent)] transition-colors duration-300 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[var(--accent)] text-3xl">rocket_launch</span>
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text)]">
                {isKo ? '어떻게 이용하나요? (How to Use)' : 'How to Use'}
              </h2>
            </div>
            
            <div className="space-y-8">
              {/* Feature 1 */}
              <div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                  <span className="text-[var(--accent)]">01.</span> 
                  {isKo ? '탐색기(Explore)로 최적의 도구 찾기' : 'Find tools via Explore'}
                </h3>
                <p className="text-[var(--text-2)] mb-3 leading-relaxed">
                  {isKo 
                    ? '좌측 필터를 이용해 코딩 에이전트, RAG 프레임워크 등의 카테고리와 지원하는 LLM 모델(Claude, GPT-4)을 조합하여 가장 적합한 툴을 탐색하세요.' 
                    : 'Use filters to combine categories and supported LLMs to find the best tools.'}
                </p>
                <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline font-mono-code bg-[var(--accent)]/10 px-3 py-1.5 rounded-lg">
                  {isKo ? '탐색기로 이동 →' : 'Go to Explore →'}
                </Link>
              </div>

              {/* Feature 2 */}
              <div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                  <span className="text-[var(--accent)]">02.</span> 
                  {isKo ? '3-Tier 라이선스 정책 이해하기' : 'Understand the 3-Tier License'}
                </h3>
                <p className="text-[var(--text-2)] mb-3 leading-relaxed">
                  {isKo 
                    ? '기업의 법적 리스크를 방지하기 위해, 모든 하네스는 자동 크롤링되어 3단계 라이선스 뱃지를 부여받습니다.' 
                    : 'To prevent legal risks, all harnesses are automatically crawled and given a 3-tier license badge.'}
                </p>
                <ul className="space-y-3 p-4 bg-[var(--bg-raised)] rounded-xl border border-[var(--border-sub)]">
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 text-[10px]">G</span>
                    <span className="text-[var(--text)] text-sm">{isKo ? 'GREEN: 상업적 이용이 자유로운 허용적 라이선스 (MIT, Apache-2.0)' : 'GREEN: Permissive licenses (MIT, Apache-2.0)'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 font-bold border border-yellow-500/20 text-[10px]">Y</span>
                    <span className="text-[var(--text)] text-sm">{isKo ? 'YELLOW: 파생 작업 공개 의무가 있는 카피레프트 (GPL 계열)' : 'YELLOW: Copyleft licenses with source-disclosure requirements (GPL)'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-bold border border-red-500/20 text-[10px]">R</span>
                    <span className="text-[var(--text)] text-sm">{isKo ? 'RED: 비상업적 이용만 가능하거나 라이선스 불명확 (관리자 승인 대기)' : 'RED: Non-commercial only or unclear licenses'}</span>
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2 flex items-center gap-2">
                  <span className="text-[var(--accent)]">03.</span> 
                  {isKo ? '터미널에서 한 줄로 설치하기 (CLI)' : 'One-line install via CLI'}
                </h3>
                <p className="text-[var(--text-2)] mb-3 leading-relaxed">
                  {isKo 
                    ? '원하는 에이전트를 찾았다면 터미널에 아래 명령어를 입력하세요. 하네스허브가 안전하게 설치 명령어를 찾아 실행해 줍니다.' 
                    : 'Found what you need? Type this in your terminal. HarnessHub will securely fetch and execute the install command.'}
                </p>
                <div className="bg-[#0f111a] border border-[var(--border-sub)] rounded-lg p-4 font-mono-code text-[var(--accent)] text-sm">
                  npx harnesshub install princeton-nlp/SWE-agent
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Version History (Span 5) */}
        <div className="lg:col-span-5">
          <section className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-3xl p-6 lg:p-8 shadow-lg sticky top-24">
            <div className="flex items-center gap-3 mb-8 border-b border-[var(--border-sub)] pb-4">
              <span className="material-symbols-outlined text-[var(--text)] text-2xl">history</span>
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text)]">
                {isKo ? '버전 히스토리' : 'Version History'}
              </h2>
            </div>

            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border-sub)]" />

              <div className="space-y-10">
                {CHANGELOG.map((entry) => (
                  <div key={entry.version} className="relative pl-8 group">
                    {/* dot */}
                    <div
                      className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-elev)] transition-transform duration-300 group-hover:scale-150"
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
                        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                          <span className="mt-2 shrink-0 w-1 h-1 rounded-full opacity-50" style={{ backgroundColor: entry.tagColor }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
