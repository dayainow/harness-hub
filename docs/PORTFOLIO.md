# 🚀 Ola (올라) - 올인원 AI 크리에이터 & 도구 허브

> 파편화된 전 세계의 AI 도구를 탐색하고, 자신만의 활용 레시피를 커뮤니티와 공유하는 풀스택 AI 플랫폼

![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white) 
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📌 1. 프로젝트 개요 (Overview)
- **개발 인원**: 1인 (개인 프로젝트 | 기획, 디자인, 프론트엔드, 백엔드 전체 구현)
- **개발 기간**: 2026.04 ~ 진행 중
- **핵심 목표**: 매일 폭발적으로 쏟아지는 수많은 AI 툴 중에서 내게 필요한 도구를 직관적인 다중 조건으로 찾고, 다른 유저들이 해당 툴을 어떻게 활용했는지(Market 레시피)를 즉각적으로 학습할 수 있는 **'선순환형 AI 지식 커뮤니티'** 구축

## 🎯 2. 기획 배경 (Background & Vision)
> **문제 정의:** "AI 도구는 많은데, 정작 사람들은 뭘 어떻게 써야 할지 모른다."
- 기존 서비스들(TAAFT 등)은 단순한 툴 디렉토리에 불과하여, 유저가 툴을 클릭한 이후 **실제로 결과물을 내기까지의 과정(Prompt/Recipe)**을 배울 수 없었습니다.
- 이를 해결하기 위해 Product Hunt의 치열한 **랭킹 및 투표(Upvote) 시스템**과 Civitai의 **갤러리형 지식 공유 뷰**를 혼합한 "All-in-one" 플랫폼을 기획했습니다.

## ⚙️ 3. 시스템 아키텍처 및 기술 스택 (Architecture)
코드베이스를 세 개의 레이어로 완벽하게 분리한 **모노레포(Monorepo)** 구조를 채택하여 유지보수성과 확장성을 극대화했습니다.

| 분류 | 스택 & 인프라 | 상세 설계 방향 |
| :-- | :-- | :-- |
| **Frontend (Client)** | **Next.js 15, React 19**, TailwindCSS | RSC(React Server Components)를 적극 활용하여 TTI 최적화. 다크 모드 및 Glassmorphism UI 채택 |
| **Backend (API)** | **NestJS 11**, Typescript | 비즈니스 로직과 API Gateway 분리, Throttle을 통한 무분별한 콜 제어 |
| **DB & Auth** | **Supabase**, Prisma ORM | 사용자 구글 소셜로그인 세션 유지 및 관계형 데이터베이스(Postgres) 설계 |
| **Deploy & CI/CD** | **Vercel** (Front), **Render** (Back) | Git Subtree 방식의 무중단 클라우드 호스팅 파이프라인 연계 |

## 💡 4. 핵심 구현 기능 (Key Features)

### 🎨 4.1. 정보 탐색 극대화를 위한 다중 선택 필터링(Faceted Search)
- **기존 문제**: 프라이싱, 카테고리 등 다양한 속성을 여러 번 클릭할 수 없는 단일 필터의 한계.
- **해결 방안**: URL `SearchParams`를 배열화하여, `?pricing=Freemium&category=개발,오디오&tags=노코드` 와 같은 중첩 필터링을 프론트엔드에서 구현.
- **백엔드 매핑**: NestJS 컨트롤러에서 콤마(,) 기준의 문자열을 파싱한 후, Prisma의 `{ in: [] }` 및 `{ hasSome: [] }` 쿼리 엔진으로 연결하여, 조합된 복잡한 쿼리도 10ms 내의 빠른 응답 속도를 보장하도록 최적화.
- **UX 개선**: 사용자가 누른 수많은 필터들을 사이트 상단에 **'알약(Pill) 형태의 뱃지'**로 시각화하여 현재 탐색 상황을 직관적으로 제공.

### 🔥 4.2. Product Hunt 스타일의 마이크로 인터랙션 (Market)
- 일반적인 게시판 형태가 아닌 글과 이미지가 강조되는 피드형 뷰 적용.
- 사용자가 리스트를 구경하다 즉각적으로 `투표(Upvote)`할 수 있도록 리스트 우측에 독립적인 버튼 박스 배치.
- 뷰 이동 없이 투표만 되도록 `e.stopPropagation()` 처리로 이벤트 버블링 완벽 방어.

### 🌎 4.3. Next-Intl 기반 i18n 글로벌 아키텍처
- 다양한 언어의 플랫폼 유입을 감안하여 경로(Path) 기반 자동 번역 라우팅을 설계함.

## 🛠 5. 트러블슈팅 및 성능 최적화 경험 (Troubleshooting)

### 이슈 1. 외부 CDN 이미지 로딩에 의한 Next.js 렌더링 블로킹 현상
- **상황:** AI 도구 시드 데이터의 수많은 로고 이미지(`logo.clearbit.com`)를 가져올 때, 프론트엔드쪽 엑스박스(Broken Image) 발생.
- **원인 분석:** Next.js 환경에서 외부 이미지를 `<Image />` 최적화 객체로 감쌀 경우 403 / 호스트 미검증 보안 에러 발생을 확인.
- **해결:** `next.config.ts`의 `images.remotePatterns` 배열에 해당 외부 CDN 도메인을 와일드카드 정책으로 등록하여 보안 터널을 확보. 렌더링 속도 향상과 이미지 안정성을 동시에 획득.

### 이슈 2. SSR과 CSR 컴포넌트의 병목 분리
- **원인 분석:** `onClick` 등 이벤트가 필요한 버튼과 정적 데이터를 리스팅하는 부모가 단일 컴포넌트에 묶여서, 필요치 않게 자바스크립트 번들 사이즈가 커지는 현상 발견.
- **해결:** 좋아요(Upvote/Bookmark) 버튼과 같은 인터랙티브 영역만 하위 분리하여 `'use client'` 선언을 하고, 리스트 컴포넌트 부모는 서버 컴포넌트로 분리 렌더링. -> **Zero-Bundle-Size 최적화 달성.**

## 💭 6. 회고 및 향후 계획
단순히 "구현했다"를 넘어, "어떻게 하면 유저가 버튼을 더 누르고 싶게 만들까?"라는 UX 관점에서 Framer Motion 애니메이션과 필터 뱃지(Pill) 시스템을 만들며 **'실사용자의 경험'**에 대해 치열하게 고민했던 프로젝트입니다. 향후 AI 자동 요약 봇(Gemini API 연동)과 Discord 실시간 유저 알림 시스템을 고도화할 예정입니다.
