# Ola AI 플랫폼 — 에이전트 인계 가이드 (Agent Handover Guide)

> 이 문서는 Ola AI 플랫폼 개발을 이어받는 **모든 AI 에이전트**(Claude, Gemini, Cursor, ChatGPT 등)를 위한 통합 기술·협업 가이드입니다.
> 프로젝트를 처음 파악하거나 이어받는 에이전트는 반드시 이 가이드를 **처음부터 끝까지** 숙지해 주세요.

---

## 1. 프로젝트 개요

**Ola**는 AI 도구·튜토리얼·커뮤니티를 하나로 묶는 **AI 크리에이터 커뮤니티 플랫폼**입니다.

| 항목 | 내용 |
|------|------|
| 프로젝트 루트 | `./harness` (모노레포 단일 루트) |
| GitHub | `https://github.com/HONGDAEEUI-dev/harness` |
| 프로덕션 프론트엔드 | Vercel 배포 (Next.js) |
| 프로덕션 백엔드 API | `https://harness-backend-psi.vercel.app/api` |
| 데이터베이스 | Supabase (PostgreSQL) |

---

## 2. 기술 스택 (Tech Stack)

| 계층 | 기술 |
|------|------|
| **Frontend** | Next.js 16 (App Router), TailwindCSS, TypeScript |
| **Backend** | NestJS, Prisma ORM, Swagger (`/api/docs`) |
| **Database** | Supabase PostgreSQL (Connection Pooler + Direct URL) |
| **Hosting** | Vercel (Frontend & Backend Serverless) |
| **패키지 매니저** | npm, Node.js v24+ |

---

## 3. 디렉토리 구조

```
harness/
├── client_front/          # Next.js 프론트엔드 (포트 3000)
│   └── src/app/
│       ├── market/           # 실험실(튜토리얼) 목록 & 상세
│       ├── products/          # AI 도구 목록 & 상세
│       ├── prompts/        # 프롬프트 마켓플레이스
│       ├── store/        # 모임(Store) 목록 & 개설
│       ├── categories/     # 카테고리 필터
│       └── community/      # 커뮤니티 게시판
├── back/                   # NestJS 백엔드 (포트 3002)
│   ├── prisma/
│   │   ├── schema.prisma   # DB 스키마 정의
│   │   └── seed.ts         # 시드 데이터
│   └── src/
│       ├── market/           # 실험실 API (Experiment 모델)
│       ├── products/          # 도구 API (Product 모델)
│       ├── posts/          # 커뮤니티 게시글 API
│       ├── store/        # 모임 API
│       ├── prompts/        # 프롬프트 API
│       ├── notifications/  # 알림 서비스 (WebSocket — Vercel에서는 비활성)
│       └── prisma/         # PrismaModule (Global)
├── admin_front/            # Vite+React 관리자 대시보드
├── .claude/                # ★ Harness 팀-아키텍처 프레임워크
│   └── skills/harness/     # 하네스 메인 스킬 & 레퍼런스
└── AGENT_HANDOVER.md       # 협업 규칙 요약
```

---

## 4. 환경 변수 (Environment Variables)

### Backend (`back/.env`)
```
DATABASE_URL=postgresql://...@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres
```

### Frontend (`client_front/.env.local`)
```
NEXT_PUBLIC_API_URL=https://harness-backend-psi.vercel.app/api
```

---

## 5. 로컬 실행 방법

```bash
# Node 버전 설정
nvm use v24.11.0

# 백엔드 실행 (포트 3002)
cd back && npm run start:dev

# 프론트엔드 실행 (포트 3000) — 별도 터미널
cd client_front && npm run dev
```

---

## 6. 배포 방법

백엔드와 프론트엔드 각각 독립적으로 Vercel에 배포합니다.

```bash
# 백엔드 배포
cd back && npx vercel --prod --yes

# 프론트엔드 배포
cd client_front && npx vercel --prod --yes
```

> ⚠️ 백엔드 배포 시 `vercel.json`에 Prisma 엔진 파일 포함 설정(`includeFiles`)이 이미 적용되어 있습니다.
> `main` 브랜치에 Push하면 Vercel 자동 배포도 트리거됩니다.

---

## 7. 현재 구현 완료된 기능

| 기능 | 상태 | 핵심 파일 |
|------|------|-----------|
| Market(실험실) 목록 & 상세 | ✅ 완료 | `client_front/src/app/market/`, `back/src/market/` |
| Products(도구) 목록 & 상세 | ✅ 완료 | `client_front/src/app/products/`, `back/src/products/` |
| 도구 → 관련 실험실 자동 연동 | ✅ 완료 | `back/src/products/products.service.ts` (`relatedLabs`) |
| 실험실 발표 모드 (Workshop Mode) | ✅ 완료 | `client_front/src/components/WorkshopClient.tsx` |
| 실험실 → 원클릭 모임 개설 파이프라인 | ✅ 완료 | `client_front/src/app/store/new/` |
| 카테고리 페이지 (24개 세부 카테고리) | ✅ 완료 | `client_front/src/app/categories/page.tsx` |
| 커뮤니티 게시판 (CRUD) | ✅ 완료 | `back/src/posts/`, `client_front/src/app/community/` |
| 좋아요 & 북마크 | ✅ 완료 | `back/src/likes/`, `back/src/bookmarks/` |
| 다크모드 | ✅ 완료 | 헤더 및 전역 테마 토글 |
| DiceBear 일러스트 카드 | ✅ 완료 | 도구/실험실 카드 이미지 |
| Swagger API 문서 | ✅ 완료 | `/api/docs` |

---

## 8. 주요 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/products` | 전체 도구 목록 |
| GET | `/api/products/:id` | 도구 상세 (relatedLabs 포함) |
| GET | `/api/market` | 실험실(Experiment) 목록 |
| GET | `/api/market/:id` | 실험실 상세 |
| GET | `/api/prompts` | 프롬프트 목록 |
| GET | `/api/posts` | 커뮤니티 게시글 |
| POST | `/api/posts` | 게시글 작성 |
| GET | `/api/store` | 모임 목록 |
| GET | `/api/search/suggest?q=` | 통합 검색 |
| POST | `/api/likes` | 좋아요 토글 |
| POST | `/api/bookmarks` | 북마크 토글 |

---

## 9. 향후 작업 계획 (Upcoming Tasks)

우선순위 순으로 정리합니다:

1. **소셜 로그인 구현** — Supabase Auth (Google/GitHub Provider), `AuthContext`, 마이페이지
2. **모임 개설 백엔드 API 연동** — 현재 프론트엔드 폼 UI만 구현, POST API 연결 필요
3. **개인화 기능 (My AI Toolbox)** — 유저가 도구와 실험실을 찜하는 북마크 시스템
4. **도구 비교 페이지** — 여러 도구 선택하여 요금제·성능 Side-by-side 비교
5. **커뮤니티 활성화** — 주간 인기 도구 랭킹, 크리에이터 뱃지 시스템

---

## 10. Harness 팀-아키텍처 프레임워크

### 이게 뭔가요?
[revfactory/harness](https://github.com/revfactory/harness)는 **Claude Code용 팀 아키텍처 팩토리**입니다.
복잡한 작업을 여러 전문가 에이전트가 분담·협업하도록 설계해주는 도구입니다.

### 설치 위치
```
harness/.claude/skills/harness/
├── SKILL.md                        # 메인 스킬 (6 Phase 워크플로우)
└── references/
    ├── agent-design-patterns.md    # 6가지 아키텍처 패턴 설명
    ├── orchestrator-template.md    # 오케스트레이터 템플릿
    ├── team-examples.md            # 실전 팀 구성 예시 5종
    ├── skill-writing-guide.md      # 스킬 작성 가이드
    ├── skill-testing-guide.md      # 테스트/평가 방법론
    └── qa-agent-guide.md           # QA 에이전트 통합 가이드
```

### 사용법 (모든 에이전트 공통)
대규모 작업을 시작할 때, 다음 프롬프트를 입력하세요:

```
하네스 구성해줘
```
또는
```
이 프로젝트에 맞는 에이전트 팀 구축해줘
```

### 6가지 아키텍처 패턴
| 패턴 | 설명 | 적합한 상황 |
|------|------|-------------|
| **파이프라인** | 순차 의존 작업 | 단계별 순서가 중요한 빌드 플로우 |
| **팬아웃/팬인** | 병렬 독립 작업 | 여러 리서치를 동시에 수행 |
| **전문가 풀** | 상황별 선택 호출 | 도메인 전문가를 골라 쓰는 구조 |
| **생성-검증** | 생성 후 품질 검수 | 코드 생성 → QA 리뷰 |
| **감독자** | 중앙 에이전트가 동적 분배 | 실시간 조율이 필요한 복잡한 작업 |
| **계층적 위임** | 상위→하위 재귀적 위임 | 대규모 프로젝트를 분할 정복 |

### Ola 프로젝트에서의 활용 예시

```
풀스택 웹사이트 개발 하네스를 구성해줘. 디자인, 프론트엔드(React/Next.js),
백엔드(API), QA 테스트를 와이어프레임부터 배포까지 파이프라인으로 조율하는 팀.
```

### 요구사항 (Claude Code 전용)
하네스의 에이전트 팀 기능을 사용하려면 환경 변수가 필요합니다:
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

### 다른 에이전트(Gemini, ChatGPT 등)에서의 활용
하네스 팀 빌드 자체는 Claude Code 전용 기능이지만, `.claude/skills/harness/references/` 안의 **레퍼런스 문서들은 아키텍처 설계 교범으로서 어떤 에이전트든 활용 가능**합니다:

- `agent-design-patterns.md` — 6가지 팀 패턴 상세 비교표
- `team-examples.md` — 실전 팀 구성 예시 5종
- `skill-writing-guide.md` — 재사용 가능한 스킬 작성법

복잡한 개발 작업을 시작하기 전에 이 문서들을 참고하여 작업을 전문가별로 분할하고, 각 단계의 입출력을 명확히 정의한 뒤 순차적으로 진행하면 비슷한 효과를 얻을 수 있습니다.

---

## 11. 협업 규칙 (Working Agreement)

1. **단일 루트**: 모든 작업은 `./harness` 루트 디렉토리에서만 진행합니다.
2. **브랜치 전략**: 기능 작업 시 `feature/작업명` 브랜치를 만들고, 완료 후 `main`에 병합합니다.
3. **커밋 메시지**: 한국어, Conventional Commit 형식 (`feat:`, `fix:`, `chore:` 등) 으로 작성합니다.
4. **배포**: `main` 브랜치 Push 시 Vercel 자동 배포 + `npx vercel --prod` 수동 배포 병행 가능합니다.
5. **대규모 작업**: 반드시 하네스를 먼저 구동하여 에이전트 팀을 스폰한 뒤 위임합니다.

---

## 12. 알려진 이슈 & 주의사항

- **Vercel Serverless에서 WebSocket 미지원**: `NotificationsGateway`는 `process.env.VERCEL` 체크로 서버리스에서 자동 비활성화됨
- **Pollinations 이미지 API 레이트 리밋**: 익명 사용 시 IP당 동시 1건 제한 → DiceBear Shapes API로 대체 완료
- **PostsModule 의존성**: `NotificationsModule`을 반드시 import해야 함 (이미 수정 완료)
- **TypeScript `any` 타입**: 일부 페이지에 `any` 타입이 남아있어 인터페이스 정의 보강 필요

---

*이 문서를 읽었다면, 당신은 이미 Ola 플랫폼의 든든한 동료입니다. 함께 전 세계 최고의 AI 커뮤니티를 만들어 봅시다!* 🚀✨
