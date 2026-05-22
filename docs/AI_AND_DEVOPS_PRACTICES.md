# 🤖 AI 주도 개발(AIDD) 및 DevOps 인프라 엔지니어링 리포트

Ola 프로젝트는 전통적인 1인 코딩 방식을 넘어, **AI 에이전트 하네스(Harness) 시스템 구축과 고도화된 Git Subtree 배포 파이프라인을 융합**하여 "혼자서 엔터프라이즈 팀처럼 개발하는" 생산성 파이프라인을 증명하는 프로젝트입니다.

---

## 1. 하네스(Harness) 기반 AI 워크플로우 오케스트레이션

단순히 챗GPT에 코드를 복붙하는 수준을 뛰어넘어, 프로젝트 전용 **버추얼 개발팀(Virtual Dev Team)**을 구성하고 AI 에이전트들의 역할을 분리하여 오케스트레이션(Orchestration) 했습니다.

### 👥 에이전트 팀 구성 (Harness v1.2 설계)
프로젝트 루트의 `CLAUDE.md` 규칙을 시스템 프롬프트로 강제 마운트시켜, 각 에이전트가 본인의 역할만 수행하도록 권한을 격리했습니다.
- `harness-backend`: NestJS, Prisma 쿼리 등 백엔드 로직 전담. (다중 필터 쿼리 최적화 등을 지시)
- `harness-frontend`: Next.js 15 컴포넌트, Framer Motion UI 등 프론트 전담.
- `harness-integrator`: 에러 발생 시 프론트-백 엔드포인트를 매핑하고 트러블슈팅을 전담.
- `harness-qa`: 최종 배포 전 무결성 검증.

### 💡 오케스트레이션(PM)으로서의 성과
> **"제가 직접 100줄의 코드를 타이핑한 것이 아니라, 10,000줄의 코드가 생산될 수 있도록 아키텍처를 설계하고 AI에게 정확한 컨텍스트(Context)와 역할을 지시하는 PM 역할을 수행했습니다."**

- **작업 한도 최적화**: 복잡한 기능을 한 번에 지시하면 AI의 토큰 한계와 환각(Hallucination)이 발생합니다. 이를 막기 위해 "DB 스키마 먼저 짜줘 -> API 스펙 만들어 -> 프론트 UI 그려" 식으로 **[애자일(Agile) 스프린트 쪼개기]** 전략을 구사하여 AI의 코딩 정확도를 99% 퀄리티로 끌어올렸습니다.
- **코드 리뷰어 역할**: AI가 짠 프론트엔드 코드에서 "Event Bubbling" 현상 등의 결함을 발견하면, 제가 직접 수정 방향(`e.stopPropagation()` 적용 지시 등)을 역설계 피드백으로 던져주며 코드 리뷰어로서 시스템을 튜닝했습니다.

---

## 2. 모노레포 관리 및 Git Subtree 운영 전략

하나의 거대한 통합 폴더(Monorepo) 안에서 `admin_front`, `client_front`, `back` 세 개의 패키징 코드를 함께 관리하면서도 각각 다른 클라우드로 찢어서 무중단 배포를 달성하기 위해 **Git 전략 엔지니어링**을 도입했습니다.

### 🌳 Git Subtree를 활용한 분할 배포 파이프라인
일반적인 모노레포는 서버 전체를 다시 빌드해야 하지만, 저는 비용과 시간을 절약하기 위해 코드 베이스의 특정 서브 폴더만 타겟팅하여 배포시키는 파이프라인을 구축했습니다.

- **Frontend 배포 (Vercel) 통신망**
  ```bash
  # 'client_front' 폴더 내의 수정분만 발췌하여 harness-client 최신 브랜치로 격리 푸시
  # Vercel이 해당 브랜치를 감지하여 독립적인 엣지(Edge) 네트워크 배포 트리거 동작
  git subtree push --prefix client_front harness-client main
  ```

- **Backend 배포 (Render) 통신망**
  ```bash
  # 'back' 폴더 내 API/비즈니스 로직 수정분만 발췌하여 harness-backend 원격지로 이관
  # Render 클라우드가 변경 사항을 감지하고 Docker/Node 컨테이너를 무중단 재빌드
  git subtree push --prefix back harness-backend main
  ```

### ✨ 배포 아키텍처 성과
이러한 Subtree 설정을 통해 프론트엔드 쪽 UI만 수정했을 때는 백엔드 서버가 다운되거나 재부팅되는 부하를 100% 방지할 수 있었고, 혼자서도 대기업의 MSA(Micro-services Architecture) 배포 파이프라인과 유사한 결합도 낮은 생태계를 운영할 수 있게 되었습니다.

---

## 3. DevOps 및 환경 변수(.env) 보안 격리 아키텍처

AI를 활용해 코드를 짰다고 해서 보안을 간과하지 않았습니다. 개발망(Dev)과 운영망(Prod)의 엔드포인트를 시스템 환경 변수를 통해 철저하게 은닉하고 분리했습니다.

- **Next.js 보안 터널 (Frontend)**: 외부 AI 도구 이미지 엑세스 거부(403) 에러를 해결하기 위해, `next.config.ts`의 `images.remotePatterns` 옵션에 White-List 보안 도메인을 설정했습니다.
- **Supabase Pooler (Database)**: DB 통신 과부하 방지를 위해 PgBouncer 연결 풀(Pool) 접속 포트(`6543`)와 직접 마이그레이션 포트(`5432`)를 분리 설계하여 Prisma ORM에 연결했습니다.
- **디스코드 웹훅 분리 (Webhook)**: 백엔드 내부 깊은 곳에 디스코드 채널 전용 웹훅을 심어, 누군가 AI 서비스를 사용하거나 오류가 났을 때 저의 개인 스마트폰(슬랙/디스코드)으로 즉각 Alert가 오도록 모니터링 생태계를 관제화했습니다.
