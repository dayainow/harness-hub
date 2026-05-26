# HarnessHub 배포 가이드

에이전트 및 개발자를 위한 현재 배포 시스템 레퍼런스.
코드 수정 후 어디에 영향이 가는지, 환경변수를 어디서 관리하는지 파악하기 위한 문서.

---

## 아키텍처 한눈에 보기

```
GitHub (dayainow/harness-hub)
  └─ push to main
        ├─ Vercel  → 프론트엔드  (client_front/)
        └─ Railway → 백엔드 API  (back/)
                          │
                    Supabase PostgreSQL (DB + Auth)
```

| 서비스 | 플랫폼 | URL | 루트 디렉토리 |
|--------|--------|-----|--------------|
| 프론트엔드 | Vercel (dayainow 계정) | `clientfront-ebon.vercel.app` | `client_front/` |
| 백엔드 API | Railway | `harness-hub-api-production.up.railway.app` | `back/` |
| 데이터베이스 | Supabase PostgreSQL | `jluzkhyhfqkfuxqmpsqe.supabase.co` | — |

---

## 프론트엔드 — Vercel

### 배포 트리거
`main` 브랜치에 push하면 Vercel이 자동 재배포. 수동 트리거는 불필요.

### Vercel 환경변수 (Production)
Vercel 대시보드 → Project Settings → Environment Variables에서 설정.

| 변수 | 값 | 비고 |
|------|-----|------|
| `NEXT_PUBLIC_API_URL` | `https://harness-hub-api-production.up.railway.app/api` | `/api` suffix 필수 |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jluzkhyhfqkfuxqmpsqe.supabase.co` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_YwMdtaRdjvkbz08lCoo7oA_roaoT4e-` | |

### 빌드 설정
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run start`
- **Framework**: Next.js 16 (App Router)
- **Node**: 20+

### 설정 파일
- `client_front/vercel.json` — Vercel 프레임워크 힌트
- `client_front/railway.toml` — Railway 대안 배포 설정 (현재 미사용)

---

## 백엔드 API — Railway

### 배포 트리거
`main` 브랜치에 push하면 Railway가 자동 재배포.

### Railway 대시보드 설정 (중요)
Railway 서비스 설정 → **Root Directory = `back`** 로 반드시 설정되어 있어야 한다.
이 설정이 없으면 빌드가 루트에서 실행되어 실패한다.

### Railway 환경변수
Railway 대시보드 → Service → Variables에서 설정.

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | Supabase connection pooler URL (포트 6543) |
| `DIRECT_URL` | Supabase direct connection URL (포트 5432, 마이그레이션용) |
| `GITHUB_TOKEN` | GitHub PAT — 크롤링 엔진용 (rate limit 해제) |
| `PORT` | Railway가 자동 주입 (기본 3002) |

### 빌드 파이프라인
```
npm install --omit=optional && npm run build
→ postinstall: prisma generate
→ nest build → dist/src/main.js
```

### 시작 명령
```
node dist/src/main.js
```

### 헬스체크
`GET /api/health` — Railway가 30초 타임아웃으로 확인.

### 핵심 주의사항: Prisma 7 pglite 버그
Prisma 7.7.0은 존재하지 않는 npm 패키지 `@electric-sql/pglite-products@0.3.1`에 의존한다.
`back/package.json`에 아래 overrides가 설정되어 있으며 **절대 제거 금지**.

```json
"overrides": {
  "@electric-sql/pglite-products": "npm:semver@7.6.0"
}
```

이 overrides가 없으면 Railway 빌드가 404 에러로 실패한다.

---

## 데이터베이스 — Supabase

- **Provider**: PostgreSQL (Supabase managed)
- **Project ID**: `jluzkhyhfqkfuxqmpsqe`
- **ORM**: Prisma 7 with `@prisma/adapter-pg` (driver adapters 사용)
- **Schema**: `back/prisma/schema.prisma`

### Prisma datasource 구조
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  // url 필드 없음 — 런타임에 driver adapter가 Pool 주입
}
```

`datasource db { url }` 필드가 없는 것이 정상이다 (Prisma 5와 다름).
`PrismaPg(new Pool({ connectionString: DATABASE_URL }))` 방식으로 연결.

### 마이그레이션
```bash
cd back
npx prisma migrate dev    # 로컬 개발
npx prisma migrate deploy  # 프로덕션 적용
npx prisma db seed         # 시드 데이터 재삽입
```

### 시드 데이터
`back/prisma/seed.ts` — 76개 AI agent harness, 벤치마크, 컬렉션 포함.
`HarnessStatus @default(ACTIVE)` 이므로 시드 harness는 모두 ACTIVE로 기본 설정됨.

---

## 인증 — Supabase Auth (GitHub OAuth)

### 흐름
```
사용자 클릭 → Supabase GitHub OAuth → GitHub 인증
→ Supabase /auth/v1/callback (콜백 URL)
→ Next.js /auth/callback (route handler)
→ exchangeCodeForSession → 홈 리다이렉트
```

### 중요: OAuth 콜백 URL 설정
GitHub OAuth App의 **Callback URL**은 Supabase URL이어야 한다:
```
https://jluzkhyhfqkfuxqmpsqe.supabase.co/auth/v1/callback
```
Next.js 앱 URL(`/auth/callback`)을 넣으면 안 된다.

### GitHub OAuth App 위치
GitHub → Settings → Developer settings → OAuth Apps → HarnessHub

---

## CORS 설정

`back/src/main.ts`의 `enableCors` origin 목록:

```typescript
origin: [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://olalab.kr',
  /\.olalab\.kr$/,
  /^https:\/\/harness-.*\.vercel\.app$/,
  /^https:\/\/clientfront.*\.vercel\.app$/,  // ← Vercel 프로덕션
  /^https:\/\/.*\.onrender\.com$/,
],
```

새 Vercel URL이 생기면 이 목록에 추가해야 한다.
추가 후 Railway에 재배포가 필요하다.

---

## Git 워크플로

```bash
# 로컬 개발
git checkout -b feature/harness-<기능명>
# ... 작업 ...
git push origin feature/harness-<기능명>

# 배포
git checkout main
git merge feature/harness-<기능명>
git push origin main  # → Vercel + Railway 자동 재배포
```

### 브랜치 규칙
- `feature/harness-{기능명}` — 신규 기능
- `fix/harness-{버그명}` — 버그 수정
- `main` 직접 push 가능 (소규모 수정)

### 주의: GitHub PAT
`origin` remote에 PAT가 포함되어 있다:
```
https://ghp_xxxx@github.com/dayainow/harness-hub.git
```
`.env*` 파일과 시크릿은 절대 커밋하지 않는다.

---

## 로컬 개발 환경

### 백엔드
```bash
cd back
cp .env.example .env.local   # DATABASE_URL, DIRECT_URL 입력
npm install
npm run start:dev            # 포트 3002
```

### 프론트엔드
```bash
cd client_front
cp .env.example .env.local   # NEXT_PUBLIC_* 입력
npm install
npm run dev                  # 포트 3000
```

### 환경변수 파일
| 파일 | 용도 |
|------|------|
| `back/.env.local` | 백엔드 로컬 시크릿 (gitignore) |
| `client_front/.env.local` | 프론트엔드 로컬 공개키 (gitignore) |
| `back/.env.example` | 템플릿 (커밋됨) |
| `client_front/.env.example` | 템플릿 (커밋됨) |

---

## 트러블슈팅 빠른 참조

| 증상 | 원인 | 해결 |
|------|------|------|
| Railway 빌드 `404 @electric-sql/pglite-products` | Prisma 7 버그 | `back/package.json` overrides 확인 |
| 프론트 API 호출 CORS 에러 | Vercel URL이 CORS 목록에 없음 | `back/src/main.ts` origin 추가 후 재배포 |
| GitHub OAuth `Unable to exchange external code` | GitHub Client Secret 만료/불일치 | GitHub OAuth App에서 새 Secret 생성 → Supabase에 업데이트 |
| OAuth 콜백 `no_code` | GitHub OAuth App 콜백 URL 오설정 | Supabase URL로 변경 |
| Explore 0건 | 카테고리 필터 파라미터 오류 | `ExploreClient.tsx` buildQuery 확인 |
| Prisma 스키마 `url 필드 없음` 에러 | Prisma 5 방식으로 수정 시도 | Prisma 7 driver adapter 방식 유지 |
