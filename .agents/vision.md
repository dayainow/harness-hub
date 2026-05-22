# Project Vision — harness

## Project Goals

AI 개발자 커뮤니티 플랫폼. 개발자들이 AI 툴·프롬프트·실험을 공유하고 함께 배우고 성장하는 공간.

## Key Features

1. **커뮤니티** — 게시글/댓글/좋아요, 이미지 업로드 (Supabase Storage)
2. **실험실(Market)** — AI 자동화 실험 공유 (Make × Gemini × 티스토리 등)
3. **프롬프트** — 유용한 AI 프롬프트 모음 및 공유
4. **리소스** — AI 관련 도구·서비스 큐레이션
5. **밋업** — 오프라인/온라인 모임 등록 및 참여
6. **실시간 알림** — WebSocket / socket.io
7. **AI 챗봇** — Gemini 1.5 Flash 플로팅 위젯
8. **검색** — 키워드 하이라이팅, 다크모드

## Tech Stack

- Frontend: Next.js 15 (App Router), Tailwind CSS, TypeScript
- Backend: NestJS, Prisma, PostgreSQL (Supabase)
- AI: Vercel AI SDK + Google Gemini 1.5 Flash
- Realtime: socket.io
- Storage: Supabase Storage
- Deploy: Vercel (frontend), Railway/Render (backend)

## Technical Constraints

- 단일 루트 `/harness` 에서만 작업 (worktree 분리 금지, Git Worktrees는 예외 상황만)
- 브랜치 컨벤션: `agent/<task-id>-<short-desc>`
- main 직접 커밋 금지 — 브랜치 → merge
- 커밋: `feat/fix/chore/refactor/docs(scope): description`

## Non-Goals

- 모바일 네이티브 앱
- 유료 결제 기능
- 영어 다국어 지원 (한국어 전용)