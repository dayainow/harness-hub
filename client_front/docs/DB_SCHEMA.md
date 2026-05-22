# 💾 데이터베이스 스키마 및 관계 명세서 (DB Schema / ERD)

이 문서는 Ola 플랫폼의 `Prisma ORM`을 바탕으로 한 PostgresSQL 관계형 데이터베이스 아키텍처 스펙을 기술합니다. 데이터의 무결성과 퍼포먼스(다이내믹 필터 구조 등)를 중점으로 설계되었습니다.

---

## 1. 전역 아키텍처 관점 (Global DB Architecture)
- **Engine**: PostgreSQL 호환 (Supabase Hosted)
- **Connection**: Connection Pooling (PgBouncer) 모드 사용 시 트랜잭션 이슈를 막기 위해 Prisma `driverAdapters` 프리뷰 로직 적용 권장.
- **Foreign Key Action**: 불필요한 고아(Orphan) 데이터를 남기지 않기 위해 유저 탈퇴나 글 삭제 시 연관 로직들이 자동 폭파되도록 `onDelete: Cascade` 정책을 일관되게 규정함.

---

## 2. 주요 모델별 엔터티 관계 (Core Entities)

### 👤 2.1 User (사용자 모델)
서비스의 모든 상호작용 주체입니다. Supabase Auth(`auth.users`)와 매핑되는 어플리케이션 전용 사용자 테이블입니다.
- **Fields**: 
  - `email`, `username` (Unique 속성 유지)
  - `role`: Enum 타입 도입 (`USER`, `ADMIN`, `CREATOR`로 분리하여 권한 모델링)
- **Relations**: Store(N:M 구조 참석 모델), Experiment(1:N 작성), Prompt(1:N 작성), Post/Comment (1:N), Notification(1:N)

### 🧰 2.2 Product (핵심 AI 도구 메타데이터)
전 세계의 AI 도구를 조회하고 필터링하기 위한 "중앙 디렉토리 정보" 엔티티입니다.
- **Fields**:
  - `name`, `description`, `shortDesc`, `iconUrl` 등 (외부 서비스 렌더링 포함)
  - `pricingModel`: `Freemium`, `Paid` 등의 스트링 속성
  - `category`: 대분류 스트링 매핑
  - `tags: String[]`: 최적화된 다중 필터 검색(`hasSome` 연산용)을 위해 배열(Array) 자체 지원 컬럼 사용
  - `isFeatured`: boolean 타입으로 인기 순/추천 순 노출 관리

### 🔥 2.3 Experiment (실험실/레시피)
유저가 특정 AI 도구 스택을 조합해 얻어낸 통찰이나 레시피 과정 등을 올리는 "핵심 커뮤니티 데이터"입니다.
- **Fields**:
  - `title`, `description`, `metric` (결과 지표 달성 요약)
  - `thumbnailUrl`, `emoji`, `difficulty`
  - `stack: String[]`: 작성 시 사용한 AI 도구 이름을 맵핑하여 필터링 용이화

### 📝 2.4 Prompt & Post & Comment (커뮤니티 활동 데이터)
일반 자유게시판/프롬프트 뷰어 및 사용자 간의 커뮤니케이션 기능을 담고 있습니다.
- `authorId`를 강제 FK 제약조건(`Cascade`)으로 걸어 보안성을 높임.
- 공통적으로 `views(조회수)`, `likes(좋아요수)` 집계 컬럼 지원.

### 👥 2.5 Store & MeetupAttendee (N:M 이벤트 맵핑)
오프라인 또는 가상 웨비나 행사를 관리하는 이벤트 모듈입니다.
- 다대다(N:M) 릴레이션 매핑을 해결하기 위해 중간 테이블인 `MeetupAttendee`를 설계.
- 브릿지(중간) 테이블 안에서 `@@unique([meetupId, userId])` 복합 유니크 제약 조건을 걸어 **한 사람이 동일 행사에 두 번 신청되는 버그를 DB 레벨에서 원천 차단**시켰음.

---

## 3. 확장 모델 및 상호작용 (Engagement & Notification)

### ❤️ 3.1 Like & Bookmark (폴리모픽 유사 구조)
다양한 게시물(Product, Prompt, Post, Lab)에 두루 쓰일 수 있는 상호작용 맵핑 테이블입니다.
- **Fields**:
  - `userId` (Supabase 연결)
  - `targetType`: "PRODUCT" | "PROMPT" | "POST" | "LAB" 중 하나로 매핑되는 마커
  - `targetId`: 대상 글의 고유 UUID
- 복합 유니크 강제(`@@unique([userId, targetType, targetId])`)를 통해 하트(좋아요)를 두 번 누르지 못하도록 DB 수준에서 막음. (무결성 최적화)

### 🔔 3.2 Notification (알림 전용 스냅샷)
다른 사용자가 댓글을 달거나 좋아요를 누르면 생기는 알람 체이닝 구조입니다.
- `targetTitle`과 같은 부분 텍스트를 미리 테이블에 굽고 넣어 나중에 조인 퍼포먼스 저하(Read 연산 부하)를 방지하는 **비정규화(Snap-shot) 테크닉** 이 반영되었습니다.
