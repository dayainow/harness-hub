# CLAUDE.md — Ola AI Platform

## 하네스: Ola 풀스택 개발팀

**목표:** AI 커뮤니티 플랫폼의 기능 구현·버그 수정·UI 개선 등 모든 코드 작업을 전문 에이전트 팀이 안전하고 일관성 있게 처리한다.

**트리거:** Ola 코드 변경을 수반하는 모든 작업 요청 시 `harness-dev` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**에이전트:**
- `harness-backend` — NestJS/Prisma/PostgreSQL
- `harness-frontend` — Next.js 16/React 19/Tailwind CSS v4/Supabase
- `harness-integrator` — 프론트-백 연동/타입 매핑/환경변수
- `harness-qa` — 통합 정합성 검증

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-22 | 초기 구성 (harness-orchestrator) | 전체 | Ola 프로젝트 전용 하네스 신규 구축 |
| 2026-04-22 | harness-dev 오케스트레이터로 재구성 | 전체 | Harness v1.2 (revfactory/harness) 전면 도입, 에이전트 팀 아키텍처 적용 |
