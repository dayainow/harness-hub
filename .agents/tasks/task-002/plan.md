# Spec

## Analysis
6개 페이지(Community, Prompts, Store, Products, Profile, Ranking)에 다크모드 클래스가 전혀 없다.
Market 페이지(dark: 클래스 21개)와 Search 페이지가 기준 레퍼런스.
ThemeToggle 컴포넌트와 ThemeProvider가 이미 존재하므로 인프라는 완비된 상태.
Tailwind CSS v4 환경: `dark:` variant는 `.dark` 클래스 기반으로 작동.

## Approach
각 페이지의 주요 색상 토큰을 Market 패턴에 맞춰 다크모드 variant 추가.
- 배경: `bg-white` → `dark:bg-slate-900`, `bg-surface-container-low` → `dark:bg-slate-800`
- 텍스트: `text-on-surface` → `dark:text-white`, `text-on-surface-variant` → `dark:text-slate-400`
- 보더: `border-outline-variant/20` → `dark:border-slate-700`
- 카드: `bg-white` → `dark:bg-slate-800/50`

## Impact
- `client_front/src/app/community/page.tsx`
- `client_front/src/app/prompts/page.tsx`
- `client_front/src/app/store/page.tsx`
- `client_front/src/app/products/page.tsx`
- `client_front/src/app/profile/page.tsx`
- `client_front/src/app/ranking/page.tsx`
- 관련 컴포넌트(PostFeed, PromptFeed, RsvpButton)는 scope 밖

## Risks
- Tailwind v4의 커스텀 색상 토큰(`on-surface`, `surface-container-low` 등)이 다크모드에서 자동 전환 안 될 수 있음 → `dark:` 명시 필요
- 일부 gradient 클래스(`bg-gradient-to-*`)는 Tailwind v4에서 `bg-linear-to-*`로 변경 필요

---

# Contract

## Deliverables
- [ ] D1: community/page.tsx 다크모드 클래스 적용 (배경, 텍스트, 카드, 보더)
- [ ] D2: prompts/page.tsx 다크모드 클래스 적용
- [ ] D3: store/page.tsx 다크모드 클래스 적용 (SuggestTopicModal은 이미 완료)
- [ ] D4: products/page.tsx 다크모드 클래스 적용
- [ ] D5: profile/page.tsx 다크모드 클래스 적용
- [ ] D6: ranking/page.tsx 다크모드 클래스 적용
- [ ] D7: `npm run build` CI 통과

## Acceptance Criteria
- 각 페이지에서 다크모드 토글 시 배경/텍스트/카드가 어두운 색으로 전환
- 화이트 배경이 다크모드에서 그대로 남아있지 않을 것
- 빌드 에러 없음
- Market 페이지 다크모드 수준(시각적 일관성)과 동일

## Out of Scope
- PostFeed, PromptFeed, RsvpButton 등 공용 컴포넌트 수정
- 새 기능 추가
- 모바일 반응형 개선

## Decision Audit Trail
| # | Phase | Decision | Classification | Principle | Rationale | Rejected Alternative |
|---|-------|----------|---------------|-----------|-----------|---------------------|
| 1 | Approach | Market 패턴을 기준으로 통일 | Mechanical | DRY | 이미 검증된 패턴 재사용 | 커스텀 다크모드 컬러 신규 정의 |
| 2 | Scope | 공용 컴포넌트 제외 | Taste | Scope discipline | 별도 task로 분리 가능, 리스크 최소화 | 한번에 전체 수정 |
