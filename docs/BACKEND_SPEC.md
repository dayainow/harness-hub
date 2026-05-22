# HarnessHub Backend Specification (백엔드 명세서)

## 1. 아키텍처 개요 (Architecture Overview)
**HarnessHub Backend**는 올라랩의 핵심 비즈니스 로직을 처리하고 데이터베이스를 안전하게 관리하며, 클라이언트와 관리자 앱 모두에 RESTful API를 제공하는 **중앙 통합 서버**입니다.

* **Framework:** NestJS 10
* **Language:** TypeScript
* **ORM:** Prisma
* **Database:** PostgreSQL (Supabase Hosting)
* **Deployment:** Render 또는 Vercel Serverless

## 2. 핵심 디자인 원칙
1. **견고한 모듈형 구조:** 도구(Products), 커뮤니티(Posts), 실험실(Experiments), 인증(Auth) 등 도메인별로 완벽히 분리된 `Module-Controller-Service` 패턴을 준수합니다.
2. **타입 안정성 (Type-safety):** Prisma 스키마를 통해 DB 계층부터 API 응답 계층까지 TypeScript의 타입 체계를 엔드투엔드로 유지합니다.
3. **효율적인 시딩 (Data Seeding):** 텅 빈 DB로 시작하지 않도록, `prisma/seed` 스크립트를 통해 초기 더미 유저, AI 도구 100선, 모임 콘텐츠 등을 자동화하여 주입합니다.

## 3. 디렉토리 구조 및 역할
백엔드 앱은 도메인 기반의 폴더 구조를 갖추어 유지보수성을 극대화했습니다.

```text
back/
├── prisma/
│   ├── schema.prisma       # 전체 데이터베이스 스키마 정의 모델
│   ├── seed-100-products.ts   # 101개 AI 도구 실데이터 자동 주입 스크립트
│   └── add-market-may2026.ts # 오프라인 모임 데이터 주입 스크립트
├── src/
│   ├── products/              # AI 도구 탐색 도메인 (필터링, 랭킹 로직)
│   ├── posts/              # 커뮤니티 게시글 및 댓글 로직 (조회수/좋아요 처리)
│   ├── experiments/        # 2시간 실습형 AI 모임(Market) 콘텐츠 관리
│   ├── users/              # 사용자 정보 및 프로필 처리
│   └── app.module.ts       # 루트 모듈 통합
└── package.json
```

## 4. 데이터베이스 모델링 (Prisma Schema)
주요 데이터 모델은 상호 유기적으로 연결되어 있습니다.

- `Product`: 이름, 설명, 평점, 가격정책, 태그, 상태(PENDING/PUBLISHED) 필드를 포함합니다.
- `Post` & `Comment`: 유저가 작성하는 커뮤니티 엔티티이며 `Author`와 Relation(1:N)을 맺습니다. 조회수(views) 및 추천수(likes) 필드를 갖습니다.
- `Experiment`: 실험실 모임 객체로, 난이도, 소요시간(metric), 사용 스택(stack[]) 속성을 가집니다.

## 5. 핵심 비즈니스 로직 상세

### 5.1. 실시간 랭킹 산출 (Ranking System)
`/products/ranking` 및 `/posts/ranking` 엔드포인트는 단순 시간순 정렬이 아닌, **조회수와 좋아요 수의 가중치 합산**을 통해 인기 있는 콘텐츠를 동적으로 반환합니다. 

### 5.2. 트래픽 분산 및 페이지네이션
커뮤니티 글이 많아질 것을 대비하여 모든 리스트 API(예: `GET /posts`)는 기본적으로 Pagination(limit, offset 파라미터)을 지원하며 DB 조회를 최적화합니다.

## 6. 향후 확장 계획 (Phase 2)
- Redis를 도입하여 조회수 어뷰징 방지 및 인기 랭킹 캐싱 처리
- JWT 기반 권한 인증 가드(`AuthGuard`) 활성화 및 관리자 검증 로직 추가
- 전문 검색(Full-text Search) 쿼리 최적화
