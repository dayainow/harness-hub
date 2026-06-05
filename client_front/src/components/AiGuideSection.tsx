import { getTranslations } from 'next-intl/server';
import { parseAiGuide } from '@/types/aiGuide';

interface Props {
  /** Raw `Harness.aiGuide` JSON string (or null until generated). */
  aiGuide: string | null | undefined;
}

/**
 * AI 가이드 섹션. `aiGuide` 원본 JSON 문자열을 받아 `parseAiGuide()` 로 파싱한 뒤
 * 요약/목적/사용법/장점/한계/사용 시나리오를 카드 형태로 렌더링한다.
 * 파싱 결과가 null 이면 (미생성/파싱 실패) 아무것도 렌더하지 않는다.
 */
export async function AiGuideSection({ aiGuide }: Props) {
  const guide = parseAiGuide(aiGuide);
  if (!guide) return null;

  const t = await getTranslations('Detail');

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
        <span aria-hidden>📖</span>
        {t('aiGuide')}
      </h2>

      <div className="space-y-4">
        {/* 한 줄 요약 */}
        {guide.summary && (
          <div
            className="rounded-xl border p-4"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <p
              className="font-mono-code text-[10px] uppercase tracking-widest mb-2"
              style={{ color: 'var(--text-4)' }}
            >
              {t('aiGuideSummary')}
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
              {guide.summary}
            </p>
          </div>
        )}

        {/* 목적 / 사용 방법 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.purpose && (
            <TextCard icon="📌" title={t('aiGuidePurpose')} body={guide.purpose} />
          )}
          {guide.howToUse && (
            <TextCard icon="⚡" title={t('aiGuideHowTo')} body={guide.howToUse} />
          )}
        </div>

        {/* 장점 */}
        {Array.isArray(guide.pros) && guide.pros.length > 0 && (
          <ListCard icon="✅" title={t('aiGuidePros')} items={guide.pros} dotColor="#4ade80" />
        )}

        {/* 한계 */}
        {Array.isArray(guide.cons) && guide.cons.length > 0 && (
          <ListCard icon="⚠️" title={t('aiGuideCons')} items={guide.cons} dotColor="#fbbf24" />
        )}

        {/* 이럴 때 써라 */}
        {Array.isArray(guide.useCases) && guide.useCases.length > 0 && (
          <ListCard icon="💡" title={t('aiGuideUseCases')} items={guide.useCases} dotColor="#38bdf8" />
        )}
      </div>
    </section>
  );
}

function TextCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <p className="font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
        <span aria-hidden>{icon}</span>
        {title}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
        {body}
      </p>
    </div>
  );
}

function ListCard({
  icon,
  title,
  items,
  dotColor,
}: {
  icon: string;
  title: string;
  items: string[];
  dotColor: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <p className="font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
        <span aria-hidden>{icon}</span>
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
            <span
              className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: dotColor }}
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
