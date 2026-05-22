# Spec

## Analysis
상세 페이지 및 댓글 영역이 다크모드 미적용 상태.
task-002/003 완료로 목록 페이지는 완성, 이제 상세 페이지 마무리.

대상:
- `community/[id]/page.tsx` — 포스트 카드, 본문, 액션바
- `community/[id]/CommentSection.tsx` — 댓글 카드, 입력 폼
- `prompts/[id]/page.tsx` — Hero 카드, 프롬프트 내용 박스, 사이드바
- `resources/page.tsx` — 사이드바 필터, 리소스 카드 그리드

부가: canonical 정리 (bg-gradient-to-* → bg-linear-to-*, flex-shrink-0 → shrink-0)

## Impact
4개 파일, className-only 변경, 로직 무변경

---

# Contract

## Deliverables
- [ ] D1: community/[id]/page.tsx 다크모드
- [ ] D2: CommentSection.tsx 다크모드
- [ ] D3: prompts/[id]/page.tsx 다크모드
- [ ] D4: resources/page.tsx 다크모드
- [ ] D5: npm run build CI 통과
