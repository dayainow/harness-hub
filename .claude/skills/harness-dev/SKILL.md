---
name: harness-dev
description: "Ola 프로젝트(Next.js 16 + NestJS 11 풀스택)의 모든 개발 작업을 조율하는 오케스트레이터. 기능 구현, 버그 수정, UI 개선, API 추가, DB 스키마 변경, AI 기능, 성능 최적화, 실시간 기능, 다크모드, 리팩토링 등 코드 변경을 수반하는 모든 요청 시 반드시 이 스킬을 사용하라. 다시 실행, 재실행, 업데이트, 수정, 보완, 이전 결과 기반으로, 이어서 등 후속 작업도 이 스킬로 처리하라. 단순 질문이나 코드 설명 요청에는 직접 응답 가능."
---

# Ola Dev Orchestrator

Ola 프로젝트 개발 작업을 `harness-backend`, `harness-frontend`, `harness-integrator`, `harness-qa` 4명의 전문 에이전트로 분배하고 조율한다.

## Phase 0: 컨텍스트 확인

작업 시작 전 기존 산출물 존재 여부로 실행 모드를 결정한다:

- `_workspace/` 미존재 → **초기 실행**
- `_workspace/` 존재 + 사용자가 부분 수정 요청 → **부분 재실행** (해당 에이전트만 재호출)
- `_workspace/` 존재 + 사용자가 새 기능 제공 → **새 실행** (기존 `_workspace/`를 `_workspace_prev/`로 이동)

## Phase 1: 태스크 분석 및 실행 모드 결정

### 태스크 유형 분류

| 유형 | 특성 | 실행 모드 |
|------|------|----------|
| **풀스택 기능** | API 신규 + 프론트 연동 모두 필요 | 에이전트 팀 (backend → integrator → frontend → qa) |
| **백엔드 전용** | API/DB/스키마 변경만 | 서브 에이전트 (harness-backend → harness-qa) |
| **프론트 전용** | UI/컴포넌트/페이지만 | 서브 에이전트 (harness-frontend → harness-qa) |
| **버그 디버깅** | 연동 오류, 타입 불일치 등 | 서브 에이전트 (harness-integrator 또는 관련 에이전트) |
| **AI 기능** | Vercel AI SDK + 백엔드 통합 | 하이브리드 (backend → frontend 병렬 → qa) |

### 실행 모드별 오케스트레이션

#### 에이전트 팀 (풀스택 기능)
```
오케스트레이터
├── harness-backend: API 구현 → _workspace/backend_spec.md 저장
│   ↓ (SendMessage: API 스펙 전달)
├── harness-integrator: 타입 매핑 확인 → _workspace/integration_types.md 저장
│   ↓ (SendMessage: 확정 타입 전달)
├── harness-frontend: UI 구현 (backend_spec + integration_types 참조)
│   ↓ (SendMessage: 구현 완료 알림)
└── harness-qa: 통합 검증 → _workspace/qa_report.md 저장
```

#### 서브 에이전트 (단일 도메인)
```
오케스트레이터
├── Agent(harness-backend 또는 harness-frontend, run_in_background=false)
└── Agent(harness-qa, 검증 요청)
```

#### 하이브리드 (AI 기능 등)
```
오케스트레이터
Phase 1 — 서브 에이전트 (병렬 조사):
  ├── Agent(harness-backend, run_in_background=true): API route 설계
  └── Agent(harness-frontend, run_in_background=true): AI SDK 컴포넌트 설계
Phase 2 — 에이전트 팀 (통합 구현):
  ├── TeamCreate: backend + integrator + frontend
  └── 구현 → QA
```

## Phase 2: 에이전트 작업 할당

### 작업 할당 원칙

- **harness-backend**: `back/src/` 하위 모든 파일. NestJS 모듈, Prisma 스키마, DTO, 서비스, 컨트롤러
- **harness-frontend**: `client_front/src/` 하위 모든 파일. 페이지, 컴포넌트, 훅, 스타일
- **harness-integrator**: 타입 정의, 환경변수 검증, API shape 매핑. 비즈니스 로직 직접 구현 금지
- **harness-qa**: 읽기 + 검증 스크립트만. 코드 수정 금지

### 데이터 흐름 (파일 기반)

중간 산출물은 `_workspace/` 에 저장:
```
_workspace/
├── backend_api_spec.md     # 백엔드가 작성한 API 스펙
├── integration_types.md    # 인테그레이터가 정의한 공용 타입
├── frontend_components.md  # 프론트엔드 컴포넌트 구조
└── qa_report.md            # QA 검증 결과
```

파일명 컨벤션: `{phase}_{agent}_{artifact}.md`

## Phase 3: 결과 수집 및 통합

1. 각 에이전트 작업 완료 후 산출물 확인
2. `harness-qa`의 `qa_report.md` 검토
3. 실패 항목이 있으면 해당 에이전트에게 수정 요청 (1회)
4. 최종 결과를 사용자에게 요약 보고

## Ola 프로젝트 공통 규칙 (모든 에이전트 준수)

### 절대 금지
- Vercel에서 WebSocket 직접 사용 — 반드시 조건부 패턴 사용
- `bg-gradient-to-*`, `flex-shrink-0`, `flex-grow` Tailwind 클래스 사용
- `NEXT_PUBLIC_API_URL`에 `/api` suffix 누락
- Supabase user ID와 Prisma User ID 혼동

### 브랜치 규칙
- 작업 시작 전 `main` 최신본 pull
- 브랜치명: `feature/harness-{기능명}` 또는 `fix/harness-{버그명}`
- 완료 후 `main`으로 merge

### 커밋 메시지 형식
```
feat: {기능 설명}   # 새 기능
fix: {버그 설명}    # 버그 수정
chore: {작업 설명}  # 빌드/설정 변경
style: {UI 설명}    # 스타일 변경만
```

## 에러 핸들링

- 에이전트 1회 실패 시 재시도, 2회 실패 시 결과 없이 진행하고 보고서에 명시
- 상충 데이터는 삭제하지 않고 출처 병기
- QA에서 치명적 버그(WebSocket/타입 불일치) 발견 시 즉시 해당 에이전트에 수정 요청

## 테스트 시나리오

### 정상 흐름 — 풀스택 기능 구현
1. 사용자: "AI 도구 추천 API + 프론트엔드 챗봇 UI 추가해줘"
2. Phase 1: 태스크 분석 → 풀스택 기능 → 에이전트 팀 모드
3. harness-backend: `POST /api/recommend` 엔드포인트 구현
4. harness-integrator: 요청/응답 타입 정의
5. harness-frontend: 챗봇 컴포넌트 구현 (`"use client"`, Vercel AI SDK)
6. harness-qa: API shape 매핑 검증, 다크모드 클래스 검증
7. 결과 보고

### 에러 흐름 — 백엔드 API 실패
1. harness-backend 구현 완료 → harness-qa 검증
2. qa_report: WebSocket 조건부 설정 누락 발견
3. harness-backend에 수정 요청 → 재구현
4. harness-qa 재검증 → 통과 → 보고
