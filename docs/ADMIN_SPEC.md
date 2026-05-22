# HarnessHub Admin-Side Specification (관리자 명세서)

## 1. 아키텍처 개요 (Architecture Overview)
**HarnessHub Admin**은 서비스 운영진이 AI 도구, 커뮤니티 게시글, 사용자 정보 등을 효율적으로 검수하고 관리하기 위해 사용하는 **백오피스(Back-Office)** 싱글 페이지 애플리케이션(SPA)입니다.

* **Framework:** React 18
* **Build Product:** Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Routing:** React Router DOM
* **Deployment:** Vercel (정적 SPA 배포)

## 2. 핵심 디자인 원칙
1. **생산성 극대화:** 운영자가 빠르게 데이터를 확인하고 승인/반려 등의 액션을 취할 수 있도록 모달(Modal)과 퀵뷰(Quick View) 기반의 UI를 설계합니다.
2. **권한 기반 제어:** 클라이언트와 분리된 완전한 관리자 전용 포트로 구축하여, 추후 어드민 전용 세션 및 IP 화이트리스트 접근 제어를 용이하게 합니다.
3. **가시성:** 대량의 데이터를 효과적으로 보여주기 위한 고성능 테이블 뷰(Table View) 및 대시보드 위젯을 적용합니다.

## 3. 디렉토리 구조 및 기능 구성
어드민 앱은 `src/` 하위에서 다음과 같이 역할별로 분리되어 있습니다.

```text
admin_front/src/
├── components/               # 재사용 가능한 UI 요소 (버튼, 카드, 테이블 등)
│   ├── ContentDetailModal.tsx # 아이템 상세 검수 모달
│   └── TopNavBar.tsx         # 관리자 전용 네비게이션
├── pages/                    # 라우트별 실제 렌더링 뷰
│   ├── DashboardPage.tsx     # 플랫폼 운영 통계 및 현황 요약
│   ├── ToolsListPage.tsx     # 전체 AI 도구 목록 및 승인(Pending) 대기열
│   ├── CommunityPage.tsx     # 유저 게시글 모니터링 및 삭제
│   └── UsersPage.tsx         # 가입자 목록 및 권한 관리
├── App.tsx                   # 라우팅 진입점
└── index.css                 # 글로벌 스타일링 (Tailwind 지시어)
```

## 4. 핵심 모듈 상세

### 4.1. 승인/반려 (Pending & Approval) 워크플로우
신규 도구가 등록되었을 때 무작정 라이브에 노출되지 않도록 `status` 필드를 `PENDING`으로 관리합니다. 관리자는 `ToolsListPage`에서 대기열을 확인하고, `ContentDetailModal`을 띄워 도구 정보를 검수한 뒤 `approve` 혹은 `reject` API 콜을 호출하여 라이브 반영을 결정합니다.

### 4.2. 통계 대시보드 (Dashboard)
운영자가 서비스 활성화 상태를 쉽게 파악할 수 있도록 등록된 도구 수, 이번 주 커뮤니티 작성 수, 신규 사용자 수 등을 카드 형태의 위젯으로 묶어 보여줍니다.

## 5. 향후 확장 계획 (Phase 2)
- 에디터(WYSIWYG)를 연동한 플랫폼 공식 블로그/공지사항 작성 기능
- 악성 유저 차단(Ban) 및 커뮤니티 리포트(신고) 내역 실시간 모니터링
- 플랫폼 트래픽 추이 그래프 (Google Analytics 연동)
