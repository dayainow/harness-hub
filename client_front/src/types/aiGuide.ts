/**
 * AI Guide types for HarnessHub.
 *
 * The backend (`back/src/ai-guide/ai-guide.service.ts`) generates a Korean usage
 * guide from a harness README via Claude Haiku and persists it on the `Harness`
 * model as a JSON **string** (`Harness.aiGuide`, `@db.Text`). The shape below is
 * the parsed object — use `parseAiGuide()` to turn the stored string into it.
 *
 * Source of truth: `_workspace/backend_ai_guide_spec.md` + the service's
 * `parseGuideJson()` validator (which only guarantees `summary` is a string).
 */

/** Parsed `Harness.aiGuide` JSON. Backend `JSON.stringify`s exactly this shape. */
export interface AiGuideData {
  /** 한 줄 핵심 설명 */
  summary: string;
  /** 어떤 목적으로 사용하는가 */
  purpose: string;
  /** 어떻게 사용하는가 (설치~실행 흐름) */
  howToUse: string;
  /** 장점 목록 */
  pros: string[];
  /** 단점/한계 목록 */
  cons: string[];
  /** 이럴 때 써라 (사용 시나리오) 목록 */
  useCases: string[];
}

/**
 * Parse a stored `Harness.aiGuide` JSON string into `AiGuideData`.
 *
 * Returns `null` when the input is missing/empty or not valid JSON, so callers
 * can branch on a single nullish check. Never throws.
 */
export function parseAiGuide(raw: string | null | undefined): AiGuideData | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AiGuideData;
  } catch {
    return null;
  }
}
