<div align="center">
  <img src="https://ui-avatars.com/api/?name=HarnessHub&background=0284c7&color=fff&size=150&rounded=true" alt="HarnessHub Logo" width="120" />
  <h1>HarnessHub (올라랩)</h1>
  <p><strong>일상을 더 창의롭게 만드는 실전형 AI 커뮤니티 플랫폼</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-10-ea2845?style=flat-square&logo=nestjs)](https://nestjs.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)](https://prisma.io/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
</div>

<br />

## 📖 서비스 개요 (Service Overview)

**HarnessHub(올라랩)**은 누구나 쉽게 AI를 일상에 적용하고 실험해 볼 수 있도록 돕는 **AI 도구 큐레이션 및 커뮤니티 플랫폼**입니다. 수많은 AI 도구들이 쏟아지는 환경 속에서, 사용자들은 올라랩을 통해 자신에게 필요한 도구를 찾고 활용 노하우를 공유하며 오프라인 모임(Market)을 통해 실전 경험을 쌓을 수 있습니다.

### ✨ 주요 기능 (Core Features)

1. **🚀 100+ AI 도구 탐색망 (AI Products Directory)**
   - 101개의 최신 실 데이터가 반영된 방대한 AI 도구 데이터베이스 구축
   - **영상/음성/개발/마케팅** 등 세분화된 카테고리 필터링
   - 무료/유료(Pricing) 필터링 및 실시간 평점 기반 인기 도구 랭킹 제공

2. **💬 생동감 넘치는 커뮤니티 (Vibrant Community)**
   - 글자 수 제한 없는 유연한 핑퐁 대화가 가능한 커뮤니티 피드
   - `프롬프트장인`, `코딩하는고양이` 등 친숙한 닉네임 기반의 사용자 간 소통 
   - 실시간 조회수, 좋아요, 랭킹 시스템을 통한 능동적 참여 유도

3. **🧪 AI 실험실 (Market & Store)**
   - 단순 정보 전달을 넘어선 **2시간 실습형 오프라인/온라인 모임** 큐레이션
   - 나만의 팟캐스트 만들기, 노코드 챗봇 구축 등 최신 AI 트렌드(26년 5월 기준) 반영 콘텐츠

4. **⚡ 직관적이고 트렌디한 모바일 UI/UX**
   - 모바일 사용자를 위한 메인 화면 트렌딩 뷰 최적화
   - Framer Motion을 활용한 부드러운 스크롤 액션 및 인터랙티브 카드 디자인

---

## 🛠 기술 아키텍처 (Technical Architecture)

본 프로젝트는 프론트엔드(Client/Admin)와 백엔드(API)를 분리하되 하나의 Repository에서 관리하는 Monorepo-like 구조로 설계되어 있습니다.

### 💻 기술 스택 (Tech Stack)

| 구분 | 기술 스택 | 설명 |
|---|---|---|
| **Client** | Next.js 15 (App Router), React, Tailwind CSS | 서버 사이드 렌더링(SSR), 검색 엔진 최적화(SEO) 및 빠른 초기 로딩 달성 |
| **Admin** | React, Vite | 관리자용 대시보드 및 콘텐츠 검수/관리용 SPA |
| **Backend** | NestJS, TypeScript | 안정적이고 확장 가능한 모듈형 REST API 서버 |
| **Database** | PostgreSQL (Supabase), Prisma ORM | 높은 성능의 RDBMS 및 타입 안정성이 보장된 쿼리 빌딩 |
| **Animation**| Framer Motion | 자연스러운 마이크로 인터랙션 및 화면 전환 효과 |

### 🔧 기술적 주요 성과 (Technical Highlights)

- **안정성 (Zero Error Build):** 세 가지 환경(Client, Back, Admin) 모두 엄격한 TypeScript 환경에서 빌드 에러 없이 컴파일 통과(Exit code 0).
- **데이터 시딩 시스템 구축:** 초기 오픈 시 텅 빈 사이트 문제를 해결하기 위해, 100여 개의 도구와 200여 개의 커뮤니티 활동 로그를 한 번에 주입하는 강력한 Prisma Seeding 스크립트 구축.
- **최적화된 UI/UX:** `HomeClient.tsx` 분리를 통해 SSR의 장점과 클라이언트 애니메이션의 부드러움을 동시에 확보.

---

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하는 방법입니다. (`Node.js v18+` 권장)

### 1. 환경 변수 설정
`back` 및 `client_front` 폴더에 각각 `.env` 파일을 생성하고 Supabase Database URL 및 API URL을 설정합니다. (자세한 내용은 각 디렉토리의 가이드 참조)

### 2. 패키지 설치 및 실행

**Backend (NestJS)**
```bash
cd back
npm install
npx prisma generate
npm run start:dev
```

**Client (Next.js)**
```bash
cd client_front
npm install
npm run dev
```

**Admin (Vite)**
```bash
cd admin_front
npm install
npm run dev
```

접속 환경:
- 클라이언트: `http://localhost:3000`
- 백엔드 API: `http://localhost:3001`
- 관리자 패널: `http://localhost:3002`

---

<div align="center">
  <p>🛠 Built with passion for the AI Era. <b>Phase 1 MVP Completed.</b></p>
</div>
