# Spec

## Analysis
task-002에서 공용 컴포넌트는 scope 밖으로 제외되었다.
현재 다크모드 미적용 컴포넌트:
- **PostFeed.tsx**: 포스트 카드 bg-white, 텍스트 text-slate-900/500/600, 보더 border-slate-200
- **PromptFeed.tsx**: 프롬프트 카드 bg-white, 내용 박스 bg-slate-50, 텍스트 text-slate-900/600/500
- **LikeBookmarkButtons.tsx**: 북마크 버튼 비활성 bg-sky-50 (light-mode only)
- **WriteFAB.tsx / RsvpButton.tsx**: 이미 dark-safe (semantic tokens, white-on-color)

Market/Search 다크모드가 기준 레퍼런스.

## Approach
task-002 동일 패턴 적용:
- 카드 배경: `bg-white` → `dark:bg-slate-900`
- 보더: `border-slate-200` → `dark:border-slate-700`, `border-slate-100` → `dark:border-slate-700`
- 타이틀: `text-slate-900` → `dark:text-white`
- 본문 텍스트: `text-slate-500/600` → `dark:text-slate-400/300`
- 내용 박스(PromptFeed): `bg-slate-50 border-slate-100` → `dark:bg-slate-800 dark:border-slate-700`
- 그라데이션 오버레이: `from-slate-50` → `dark:from-slate-800`
- `bg-gradient-to-br` → `bg-linear-to-br` (canonical)
- `flex-shrink-0` → `shrink-0` (canonical)

## Impact
- `client_front/src/components/PostFeed.tsx`
- `client_front/src/components/PromptFeed.tsx`
- `client_front/src/components/LikeBookmarkButtons.tsx`
- WriteFAB, RsvpButton — no changes needed (이미 dark-safe)

---

# Contract

## Deliverables
- [ ] D1: PostFeed.tsx 다크모드 클래스 적용 (카드, 타이틀, 본문, 작성자, 보더)
- [ ] D2: PromptFeed.tsx 다크모드 클래스 적용 (카드, 제목, 내용 박스, 오버레이, 보더)
- [ ] D3: LikeBookmarkButtons.tsx 북마크 버튼 비활성 상태 다크모드 적용
- [ ] D4: canonical class 정리 (bg-gradient-to-br → bg-linear-to-br, flex-shrink-0 → shrink-0)
- [ ] D5: `npm run build` CI 통과

## Acceptance Criteria
- Community 피드 카드가 다크모드에서 slate-900 배경으로 전환
- Prompts 피드 카드 및 내용 박스가 다크모드에서 어두운 색으로 전환
- 북마크 버튼 비활성 상태가 다크모드에서 가독성 유지
- 빌드 에러 없음

## Out of Scope
- ChatWidget, NotificationBell, ShareButton 다크모드 (별도 task)
- 새 기능 추가

## 5-Role Review

| Role | Score | Notes |
|------|-------|-------|
| Architect | 8 | task-002 검증 패턴 재사용, 일관성 유지 |
| Product Owner | 9 | Community/Prompts 피드가 페이지의 핵심 콘텐츠 — 체감 효과 큼 |
| Engineer | 8 | 로직 변경 없음, className only |
| QA | 7 | LikeBookmarkButtons 좋아요 버튼 bg-slate-900 이미 다크 → 라이트모드에서 contrast 확인 필요 |
| PM | 9 | task-002 연속, 빠른 완성 가능 |
| **Average** | **8.2** | **✅ gate ≥ 7.0** |
