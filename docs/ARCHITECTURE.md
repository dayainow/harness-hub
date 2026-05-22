# Ola Architecture & System Integrations

이 문서는 Ola(올라) 프로젝트 전체의 시스템 아키텍처 및 외부 API 연동 스펙을 정의합니다.

## 시스템 아키텍처 개요
Ola 프로세스는 크게 3개의 독립된 애플리케이션 저장소(모노레포 형태)로 구성되어 동작합니다.

1. **Client Frontend (`/client_front`)**: 전 세계 사용자들에게 노출되는 실제 커뮤니티 UI 서비스
2. **Admin Frontend (`/admin_front`)**: 사내 운영 및 콘텐츠 통합 관리를 위한 백오피스 대시보드
3. **Backend API (`/back`)**: 데이터베이스 연산 및 API 비즈니스 로직 처리 중앙 서버

---

## 핵심 기술 스택 명세 (Tech Stack)

### 1. 프론트엔드 (Client & Admin)
- **프레임워크:** Next.js 15 (Client), React 19 + Vite (Admin)
- **스타일링:** Tailwind CSS v4, Vanilla CSS
- **컴포넌트/애니메이션:** Framer Motion, Radix UI (추정)
- **상태 및 데이터 패칭:** React Query, fetch API
- **다국어 처리:** `next-intl` (en, ko 등)

### 2. 백엔드 (Backend)
- **프레임워크:** NestJS
- **데이터베이스 ORM:** Prisma
- **언어:** TypeScript
- **보안 설정:** Throttle, Guards, Supabase Auth

---

## 서드파티 통합 스펙 (3rd Party Integrations)

Ola 플랫폼의 비즈니스 안정성을 유지하기 위해 운영/개발 전반에 연동된 핵심 외부 서비스 인프라입니다.

### 1. 데이터 베이스 및 인증: Supabase
- **역할**: 주력 PostgreSQL 데이터베이스 엔진 및 사용자 세션 생성기.
- **연계 지점**: 
  - 백엔드 (`back/prisma`): AWS ap-northeast-2 (서울) 리전에 배포된 Pooler 주소를 통해 쿼리를 전송합니다.
  - 프론트엔드 (`client_front/lib/supabase/client.ts`): 브라우저단에서 구글 소셜로그인 및 토큰 처리를 전담합니다.

### 2. 프론트엔드 및 백엔드 등 클라우드 배포: Vercel & Render
- **Vercel**: Next.js로 구성된 `client_front`의 초고속 엣지 네트워크 배포 및 최적화를 담당합니다.
- **Render**: `harness-backend-9f03.onrender.com` 주소로 NestJS 서버의 API 호스팅 및 로드밸런싱을 전담합니다. 

### 3. 알림/관제 연동: Discord Webhook
- **역할**: Ola의 주요 운영 이벤트(실험실 글 업로드, 사용자 도구 제보 등)에 대한 슬랙/디스코드 포워딩.
- **연계 지점**: 백엔드의 환경변수(`DISCORD_WEBHOOK_URL`)에 채널 알림봇이 할당되어 상시 관리자가 데이터를 모니터링할 수 있습니다.

### 4. 생성형 AI 도구: Google Generative AI (Gemini)
- **역할**: 실험실 번역, 프롬프트 생성 등 플랫폼 내부의 자동화 서비스 로직 처리.
- **연계 지점**: 프론트엔드/백엔드에 API 키(`GOOGLE_GENERATIVE_AI_API_KEY`)를 두어 사용자에게 실시간 텍스트 생성 피드백을 제공할 수 있도록 대기 중입니다.

### 5. 외부 CDN & 에셋: Clearbit / Dicebear
- **역할**: 브랜드 공식 로고 추출 및 유저 랜덤 아바타 공급.
- **연계 지점**: `next.config.ts`의 Webp 캐시 화이트리스트에 허용되어 있으며, 도구 탐색이나 프로필 페이지 진입 시 해당 서드파티 CDN 서버에서 실시간으로 이미지를 물고 옵니다.
