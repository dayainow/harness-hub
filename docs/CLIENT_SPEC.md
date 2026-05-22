# HarnessHub Client-Side Specification (클라이언트 명세서)

## 1. 아키텍처 개요 (Architecture Overview)
**HarnessHub Client**는 일반 사용자가 AI 도구를 탐색하고 커뮤니티에 참여하며, 실험실 콘텐츠를 소비하는 **프론트엔드 웹 애플리케이션**입니다.

* **Framework:** Next.js 15 (App Router 기반)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Animation:** Framer Motion
* **i18n:** `next-intl` 기반 다국어 라우팅 (`/[locale]/...`)
* **Deployment:** Vercel (Edge Network)

## 2. 핵심 디자인 원칙
1. **서버 사이드 렌더링(SSR) 최적화:** AI 도구 목록, 랭킹, 커뮤니티 게시글 등은 크롤러 봇에 의해 원활히 수집되어야 하므로 SSR 환경에서 데이터를 페칭(`fetch`)하여 제공합니다.
2. **동적 사용자 경험:** 페이지 전환 및 스크롤 이벤트 시 Framer Motion을 활용하여 매끄러운 뷰어 스크롤링과 마이크로 인터랙션을 제공합니다.
3. **모바일 퍼스트 (Mobile-First):** 반응형 그리드 시스템을 사용하여 스마트폰에서의 카드 레이아웃과 네비게이션이 완벽하게 동작하도록 구성합니다.

## 3. 디렉토리 구조 및 라우팅 (App Router)
클라이언트 앱은 `src/app/[locale]` 하위에서 다국어를 지원하는 라우팅 시스템을 따릅니다.

```text
client_front/src/
├── app/
│   └── [locale]/
│       ├── page.tsx          # 메인 홈 (트렌딩, 공지, 도구 랭킹)
│       ├── products/            # AI 도구 탐색 목록 및 상세 뷰
│       ├── community/        # 커뮤니티 피드 및 게시글 작성 뷰
│       ├── market/             # 실험실(모임) 리스트 및 상세 뷰
│       ├── search/           # 도구 통합 검색 결과 뷰
│       └── layout.tsx        # 글로벌 네비게이션 및 푸터 (TopNavBar)
├── components/               # 재사용 가능한 UI 컴포넌트 모음
│   ├── HomeClient.tsx        # 메인 홈 UI (애니메이션, 탭 포함)
│   ├── motion.tsx            # Framer motion 래퍼 컴포넌트
│   └── TopNavBar.tsx         # 상단 GNB
└── lib/                      # 유틸리티 및 API 통신 모듈 (api.ts)
```

## 4. 핵심 모듈 상세

### 4.1. 데이터 페칭 (Data Fetching)
`Next.js`의 네이티브 `fetch` API를 사용하여 백엔드(`harness-backend`)와 통신합니다. 빠른 응답 속도를 위해 `next: { revalidate: 300 }` (ISR, 5분 캐싱) 설정을 적극적으로 활용합니다.

### 4.2. 애니메이션 및 UI 상호작용
* `StaggerContainer` / `StaggerItem`: 그리드 아이템들이 순차적으로 나타나는 효과를 부여합니다.
* `ScrollReveal`: 스크롤 시 화면 하단이나 측면에서 요소가 부드럽게 등장하도록 제어합니다.
* 다크모드 대응: `next-themes`를 활용하여 사용자 OS 환경에 맞춘 자동 다크모드를 지원합니다.

## 5. 향후 확장 계획 (Phase 2)
- 유저 세션 기반 개인화 추천 뷰 추가 (Supabase Auth 연동)
- 사용자 직접 업로드(S3) 기능 통합
- 실시간 알림 기능 추가
