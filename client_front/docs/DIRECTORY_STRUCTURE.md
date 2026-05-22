# 📁 모노레포 코드 아키텍처 및 폴더 구조 (Directory Structure)

Ola 프로젝트는 프론트엔드와 백엔드가 한 레포지토리에 모여 있지만(`Monorepo`), 서로의 물리적 결합도를 낮추고자 개별적인 패키지 세팅(package.json 분리)을 따른 훌륭한 클린 아키텍처 트리 구조를 채택했습니다.

## 🌟 최상위 분리 구성 (Monorepo Root)
```text
harness-workspace/
├── 📁 admin_front/   # 사내 관리자용 React + Vite 프론트 (내부 운영 툴)
├── 📁 client_front/  # 전 세계 유저가 엑세스하는 Next.js 메인 프로덕트
└── 📁 back/          # 컨트롤러와 비즈니스 로직을 서빙하는 NestJS 핵심 백엔드 API
```

---

## 💻 1. 프론트엔드 핵심 구조 (`client_front/`)
이 폴더는 Next.js App 라우터 아키텍처에 맞추어 레이아웃과 URL 뷰포트가 결정됩니다. 

```text
client_front/
├── next.config.ts        # Next.js 캐싱 엣지 프레임워크 및 외부 CDN 허가 세팅 (보안 허용)
├── 📁 src/
│   ├── 📁 app/
│   │   └── 📁 [locale]/  # ✨ i18n 라우팅! (/en/products, /ko/products 등 다국어 번역망 기초)
│   │       ├── 📁 products/ # AI 도구 다이내믹 탐색 목록 페이지
│   │       ├── 📁 market/  # 실험실 (Product Hunt 뷰) 메인 페이지
│   │       └── layout.tsx
│   ├── 📁 components/    # 'use client' 분리를 통한 Zero-Bundle-Size 최적화 컴포넌트 격리 공간
│   │   ├── LikeBookmarkButtons.tsx  # 이벤트 버블링(stopPropagation)을 방어해놓은 핵심 투표 UI 
│   │   └── ...
│   ├── 📁 context/       # Auth 및 Global State를 관리하는 최상단 Context Provider 구역
│   └── 📁 lib/           # Supabase 인스턴스 등 라이브러리 및 유틸리티화 연결 단
```

---

## 🛠 2. 백엔드 핵심 구조 (`back/`)
이 폴더는 NestJS의 강력한 Domain-Driven-Design(도메인 주도) 구조와 의존성 주입(DI) 아키텍처를 철저하게 준수하고 있습니다.

```text
back/
├── 📁 prisma/
│   ├── schema.prisma   # PostgreSQL DB 관계도가 그려진 중심 스키마. (Model, Enum, 1:N 구조 설정)
│   └── seed.ts         # 서비스 초기 구동 시 필요한 30여 개 글로벌 도구 초기 Seed 스크립트 모음
├── 📁 src/
│   ├── 📁 products/       # (핵심 도메인 예시: 도구 탐색) 
│   │   ├── products.controller.ts  # 외부 트래픽(URL params)을 수신 및 다이내믹 포맷을 파싱
│   │   ├── products.service.ts     # 실제로 DB에 { in: [] } 같은 병목 방지 검색 명령을 수립 (비즈니스 로직)
│   │   └── products.module.ts      # Products 도메인 인스턴스 주입 제어망
│   ├── 📁 notifications/ # 커뮤니티 투표 시 알림을 발생/구독하는 특수 모듈
│   └── main.ts         # NestAPP 구동 포트, Swagger API 마운트, CORS 제어 세팅
```

---

## 📝 설계의 장점 요약
1. **높은 도메인 독립성 격리**: 백엔드 코드와 프론트 코드끼리 라이브러리(Node modules)가 섞이거나 충돌 나지 않습니다.
2. **협업 시의 코드 트래킹 용이**: 어떤 페이지를 수정하고 싶으면 폴더 명만 봐도 `controller`를 만져야 할지 `page.tsx`를 만져야 할지 단 5초면 파악할 수 있는 직관적이고 깔끔한 구조를 만들어 두었습니다.
