/**
 * HarnessHub seed
 * - Wipes Harness/Benchmark/Review/Collection/CollectionItem/HarnessBookmark.
 * - Creates a curator user.
 * - Inserts 40 well-known AI agent harnesses + benchmarks.
 * - Creates one starter collection.
 *
 * Run via: `npx prisma db seed` (configured in package.json -> "prisma.seed").
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
// Load .env.local with override so real credentials win over placeholder .env values
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });
import {
  HarnessCategory,
  LicenseTier,
  PrismaClient,
  UserRole,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type SeedBenchmark = {
  name: string;
  score: number;
  model: string;
  date: Date;
};

type SeedHarness = {
  slug: string;
  name: string;
  orgName: string;
  repoUrl: string;
  description: string;
  readmeExcerpt: string;
  stars: number;
  forks: number;
  issuesOpen: number;
  latestVersion: string;
  license: string;
  licenseTier: LicenseTier;
  languages: string[];
  category: HarnessCategory;
  modelCompat: string[];
  tags: string[];
  verified: boolean;
  featured: boolean;
  installCmd: string;
  downloadsCount: number;
  benchmarks: SeedBenchmark[];
};

const harnesses: SeedHarness[] = [
  {
    slug: 'princeton-nlp/SWE-agent',
    name: 'SWE-agent',
    orgName: 'princeton-nlp',
    repoUrl: 'https://github.com/princeton-nlp/SWE-agent',
    description:
      'GitHub 이슈를 자동으로 해결하는 AI 소프트웨어 엔지니어링 에이전트',
    readmeExcerpt: `SWE-agent는 소프트웨어 엔지니어링 역량을 갖춘 자율 AI 에이전트입니다. 주어진 GitHub 이슈나 로컬 작업 지시를 스스로 파악하고, 코드를 분석한 뒤 필요한 수정 사항을 직접 작성합니다.

### 🎯 어디에 쓰나요? (Use Cases)
- **GitHub 이슈 자동 해결**: 버그 리포트나 기능 추가 요청이 들어오면 스스로 PR을 생성합니다.
- **코드베이스 대규모 리팩토링**: 프로젝트 전체에 걸친 반복적인 변경 사항을 안전하게 처리합니다.
- **레거시 코드 분석**: 복잡한 레거시 코드를 읽고 이해하여 주석을 달거나 문서를 생성합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- ACI (Agent-Computer Interface)를 통한 터미널 명령어 자율 실행
- 파일 시스템 탐색, 코드 검색 및 심층 분석
- Claude 3.5 Sonnet 및 GPT-4o 등 최상위 LLM 네이티브 지원
- SWE-bench 기준 현존 최고 수준의 문제 해결률(Resolution Rate) 달성

### 👍 장점 (Pros)
- 사람 개입 없이 처음부터 끝까지 문제를 해결하고 PR까지 올릴 수 있습니다.
- 환경 격리(Docker)를 통해 로컬 환경을 오염시키지 않고 안전하게 실행됩니다.
- 연구 목적으로 개발되어 학술적으로 성능이 검증된 강력한 벤치마크 점수를 가집니다.

### 👎 단점 및 한계 (Cons)
- 실행 환경(Docker 등)을 초기에 세팅하는 과정이 다소 번거로울 수 있습니다.
- 복잡한 아키텍처 결정을 내리기엔 아직 한계가 있으며, 비용(API Token) 소모가 클 수 있습니다.`,
    stars: 14200,
    forks: 1600,
    issuesOpen: 42,
    latestVersion: 'v0.7.2',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['claude-sonnet-4-6', 'gpt-4o', 'gpt-4'],
    tags: ['swe-bench', 'github', 'research-grade', 'coding'],
    verified: true,
    featured: true,
    installCmd: 'pip install sweagent',
    downloadsCount: 8400,
    benchmarks: [
      {
        name: 'SWE-bench Verified',
        score: 0.678,
        model: 'claude-sonnet-4-6',
        date: new Date('2026-04-01'),
      },
      {
        name: 'SWE-bench Lite',
        score: 0.416,
        model: 'claude-sonnet-4-6',
        date: new Date('2026-04-01'),
      },
    ],
  },
  {
    slug: 'Aider-AI/aider',
    name: 'aider',
    orgName: 'Aider-AI',
    repoUrl: 'https://github.com/Aider-AI/aider',
    description: '터미널 기반 AI 페어 프로그래밍 도구. Git과 통합되어 자동 커밋.',
    readmeExcerpt: `aider는 터미널에 상주하며 개발자와 함께 코딩하는 AI 페어 프로그래머입니다. IDE를 벗어나지 않고 터미널에서 즉각적으로 코드를 편집하고 Git 커밋까지 자동화해 줍니다.

### 🎯 어디에 쓰나요? (Use Cases)
- **빠른 프로토타이핑**: 스크립트 작성이나 보일러플레이트 코드를 순식간에 생성합니다.
- **TDD (테스트 주도 개발)**: 에러 로그나 실패한 테스트 결과를 그대로 넘겨주면 알아서 코드를 수정합니다.
- **터미널 환경 선호자**: VIM/Neovim 등 터미널 기반 개발 환경을 사용하는 개발자에게 완벽합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 터미널 텍스트 인터페이스(TUI)를 통해 LLM과 대화하며 코드베이스 수정
- 변경 사항을 알아서 판단해 의미 있는 커밋 메시지와 함께 Git Commit 자동화
- 파일간의 컨텍스트를 스스로 읽어오는 Repo-map 기능 내장
- 브라우저나 외부 IDE 확장이 필요 없는 완벽한 독립 실행 환경

### 👍 장점 (Pros)
- 설정이 거의 필요 없이 \`pip install aider-chat\` 한 줄로 즉시 사용 가능합니다.
- Git 워크플로우와 완벽하게 통합되어 있어 생산성이 폭발적으로 증가합니다.
- 로컬 파일 시스템에 직접 접근하므로 복사/붙여넣기 할 필요가 없습니다.

### 👎 단점 및 한계 (Cons)
- GUI 환경에 익숙한 개발자에게는 터미널 인터페이스가 낯설 수 있습니다.
- 대규모 코드베이스에서는 컨텍스트 윈도우 한계로 엉뚱한 파일을 수정할 위험이 존재합니다.`,
    stars: 22100,
    forks: 2100,
    issuesOpen: 78,
    latestVersion: 'v0.45.1',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['claude-sonnet-4-6', 'gpt-4o', 'claude-opus-4-7'],
    tags: ['cli', 'git', 'pair-programming', 'terminal'],
    verified: true,
    featured: true,
    installCmd: 'pip install aider-chat',
    downloadsCount: 12800,
    benchmarks: [
      {
        name: 'SWE-bench Verified',
        score: 0.491,
        model: 'claude-sonnet-4-6',
        date: new Date('2026-03-15'),
      },
    ],
  },
  {
    slug: 'cline/cline',
    name: 'cline',
    orgName: 'cline',
    repoUrl: 'https://github.com/cline/cline',
    description:
      'VS Code 통합 자율 코딩 에이전트. 파일·터미널·브라우저를 직접 제어.',
    readmeExcerpt: `Cline은 VS Code 환경 내에서 직접 동작하는 강력한 자율 코딩 확장 프로그램입니다. 터미널 명령어를 실행하고, 브라우저를 띄워 확인하고, 파일을 생성 및 수정하는 모든 과정을 편집기 안에서 수행합니다.

### 🎯 어디에 쓰나요? (Use Cases)
- **웹 서비스 엔드투엔드 개발**: 프론트엔드부터 백엔드까지 복잡한 풀스택 프로젝트 구축
- **GUI 기반 자율 코딩**: VScode 사이드바에서 지시만 내리고 AI가 일하는 과정을 실시간 모니터링
- **실시간 디버깅**: 로컬 서버를 띄우고 브라우저 콘솔 에러를 스스로 읽어 고치도록 지시

### ✨ 무엇을 할 수 있나요? (Features)
- 파일 시스템 제어 (읽기, 쓰기, 생성, 삭제)
- VS Code 내장 터미널에 직접 접근해 명령어 실행 (npm install, 빌드 등)
- 브라우저 자동화 도구를 띄워 시각적인 UI 버그나 런타임 에러를 스스로 파악
- Human-in-the-loop: 위험한 작업(파일 삭제, 명령어 실행) 전 사용자 승인 요청

### 👍 장점 (Pros)
- VS Code 확장이기 때문에 기존 개발 환경을 전혀 바꿀 필요가 없습니다.
- AI가 터미널 명령어의 결과값을 읽고 다음 행동을 결정하는 능력이 탁월합니다.
- 다양한 API 제공자(Anthropic, OpenAI, OpenRouter, 로컬 Ollama 등)를 유연하게 지원합니다.

### 👎 단점 및 한계 (Cons)
- 승인(Approve) 프로세스가 안전하긴 하지만, 긴 작업 시 계속 버튼을 눌러줘야 해서 피곤할 수 있습니다.
- VS Code 외부 환경(타 IDE 등)에서는 사용할 수 없습니다.`,
    stars: 18500,
    forks: 1900,
    issuesOpen: 156,
    latestVersion: 'v3.12.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['typescript'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: [
      'claude-sonnet-4-6',
      'claude-opus-4-7',
      'gpt-4o',
      'gemini',
    ],
    tags: ['vscode', 'extension', 'browser-use', 'autonomous'],
    verified: true,
    featured: true,
    installCmd: 'vsix install cline',
    downloadsCount: 9700,
    benchmarks: [],
  },
  {
    slug: 'All-Hands-AI/OpenHands',
    name: 'OpenHands',
    orgName: 'All-Hands-AI',
    repoUrl: 'https://github.com/All-Hands-AI/OpenHands',
    description: '멀티모달 AI 개발자 에이전트. Sandbox 환경에서 코드를 직접 실행.',
    readmeExcerpt: `멀티모달 AI 개발자 에이전트. Sandbox 환경에서 코드를 직접 실행.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 9800,
    forks: 1100,
    issuesOpen: 203,
    latestVersion: 'v0.21.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['claude-sonnet-4-6', 'gpt-4o', 'llama', 'gemini'],
    tags: ['docker', 'sandbox', 'multi-modal', 'autonomous'],
    verified: true,
    featured: false,
    installCmd: 'docker run -it openhandsai/openhands',
    downloadsCount: 4200,
    benchmarks: [
      {
        name: 'SWE-bench Verified',
        score: 0.384,
        model: 'claude-sonnet-4-6',
        date: new Date('2026-02-20'),
      },
    ],
  },
  {
    slug: 'block/goose',
    name: 'goose',
    orgName: 'block',
    repoUrl: 'https://github.com/block/goose',
    description: '로컬 머신에서 자율적으로 작업을 수행하는 AI 에이전트. MCP 통합.',
    readmeExcerpt: `로컬 머신에서 자율적으로 작업을 수행하는 AI 에이전트. MCP 통합.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 로컬 머신에서 자율적으로 작업을 수행하는 AI 에이전트. MCP 통합.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 7400,
    forks: 680,
    issuesOpen: 91,
    latestVersion: 'v1.0.8',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['rust'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['claude-sonnet-4-6', 'gpt-4o', 'llama'],
    tags: ['mcp', 'local', 'rust', 'autonomous'],
    verified: true,
    featured: false,
    installCmd: 'brew install goose',
    downloadsCount: 3100,
    benchmarks: [],
  },
  {
    slug: 'microsoft/autogen',
    name: 'AutoGen',
    orgName: 'microsoft',
    repoUrl: 'https://github.com/microsoft/autogen',
    description:
      '멀티 에이전트 대화 프레임워크. 복잡한 태스크를 여러 AI 에이전트가 협업으로 해결.',
    readmeExcerpt: `AutoGen은 마이크로소프트가 개발한 오픈소스 멀티 에이전트 대화 프레임워크입니다. 하나의 거대한 AI가 모든 것을 처리하는 대신, 서로 다른 역할을 가진 여러 AI 에이전트들이 서로 대화하고 협력하며 문제를 해결하도록 설계되었습니다.

### 🎯 어디에 쓰나요? (Use Cases)
- **복잡한 코딩 및 검증 시스템**: 코드 작성 에이전트, 코드 리뷰 에이전트, 실행 및 테스터 에이전트가 협업하는 파이프라인
- **데이터 분석 및 시각화**: 데이터를 추출하는 에이전트와 이를 그래프로 그리는 에이전트 간의 자동화된 협업
- **시뮬레이션 및 토론**: 서로 다른 성향(Persona)을 가진 AI들을 모아놓고 특정 주제에 대해 토론시키는 시스템

### ✨ 무엇을 할 수 있나요? (Features)
- 커스터마이징 가능한 에이전트 역할(프로그래머, 리뷰어, 매니저 등) 부여
- 사람(Human-in-the-loop)이 대화 중간에 개입하여 피드백을 주고 방향을 수정 가능
- 에이전트 간의 자동화된 대화 라우팅 및 상태 관리
- 로컬 LLM 환경(Ollama 등)과의 원활한 연동 지원

### 👍 장점 (Pros)
- 단일 LLM이 해결하지 못하는 복잡하고 논리적인 태스크를 에이전트 간의 분업(Divide & Conquer)으로 훌륭히 풀어냅니다.
- 코드를 스스로 실행하고 에러가 나면 다른 에이전트에게 피드백을 주는 자가 치유(Self-healing) 기능이 뛰어납니다.
- 마이크로소프트의 지속적인 지원을 받아 엔터프라이즈 환경 적용이 용이합니다.

### 👎 단점 및 한계 (Cons)
- 에이전트끼리 대화가 무한 루프(Infinite loop)에 빠지거나 엉뚱한 결론으로 흘러갈 위험이 존재합니다.
- 토큰(Token) 사용량이 기하급수적으로 늘어날 수 있어 API 비용 관리에 주의해야 합니다.`,
    stars: 38200,
    forks: 5500,
    issuesOpen: 312,
    latestVersion: 'v0.4.7',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['claude-sonnet-4-6', 'gpt-4o', 'gpt-4', 'llama', 'gemini'],
    tags: ['multi-agent', 'conversation', 'framework', 'microsoft'],
    verified: true,
    featured: true,
    installCmd: 'pip install pyautogen',
    downloadsCount: 25600,
    benchmarks: [],
  },
  {
    slug: 'langchain-ai/langgraph',
    name: 'LangGraph',
    orgName: 'langchain-ai',
    repoUrl: 'https://github.com/langchain-ai/langgraph',
    description:
      '상태 기반 멀티 에이전트 워크플로우 프레임워크. 복잡한 에이전트 그래프 구성.',
    readmeExcerpt: `상태 기반 멀티 에이전트 워크플로우 프레임워크. 복잡한 에이전트 그래프 구성.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 상태 기반 멀티 에이전트 워크플로우 프레임워크. 복잡한 에이전트 그래프 구성.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 11200,
    forks: 1800,
    issuesOpen: 178,
    latestVersion: 'v0.2.38',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'typescript'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['claude-sonnet-4-6', 'gpt-4o', 'llama', 'gemini'],
    tags: ['graph', 'workflow', 'stateful', 'langchain'],
    verified: true,
    featured: false,
    installCmd: 'pip install langgraph',
    downloadsCount: 18900,
    benchmarks: [],
  },
  {
    slug: 'BerriAI/litellm',
    name: 'LiteLLM',
    orgName: 'BerriAI',
    repoUrl: 'https://github.com/BerriAI/litellm',
    description: '100+ LLM API를 OpenAI 호환 형식으로 통합하는 프록시 프레임워크.',
    readmeExcerpt: `100+ LLM API를 OpenAI 호환 형식으로 통합하는 프록시 프레임워크.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 100+ LLM API를 OpenAI 호환 형식으로 통합하는 프록시 프레임워크.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 16800,
    forks: 1950,
    issuesOpen: 445,
    latestVersion: 'v1.40.14',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['claude-sonnet-4-6', 'gpt-4o', 'llama', 'gemini', 'mistral'],
    tags: ['proxy', 'gateway', 'multi-model', 'openai-compatible'],
    verified: true,
    featured: false,
    installCmd: 'pip install litellm',
    downloadsCount: 32400,
    benchmarks: [],
  },
  // ===== CODING_AGENT (5 additions) =====
  {
    slug: 'continuedev/continue',
    name: 'continue',
    orgName: 'continuedev',
    repoUrl: 'https://github.com/continuedev/continue',
    description:
      'VS Code와 JetBrains에서 사용하는 오픈소스 AI 코드 어시스턴트. 자체 모델 연결 가능.',
    readmeExcerpt: `VS Code와 JetBrains에서 사용하는 오픈소스 AI 코드 어시스턴트. 자체 모델 연결 가능.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 19400,
    forks: 1700,
    issuesOpen: 287,
    latestVersion: 'v0.9.245',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['typescript'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['claude-sonnet-4-6', 'gpt-4o', 'llama', 'mistral'],
    tags: ['vscode', 'jetbrains', 'autocomplete', 'open-source'],
    verified: true,
    featured: true,
    installCmd: 'vsix install continue',
    downloadsCount: 14500,
    benchmarks: [
      {
        name: 'HumanEval',
        score: 0.812,
        model: 'claude-sonnet-4-6',
        date: new Date('2025-03-10'),
      },
    ],
  },
  {
    slug: 'sourcegraph/cody',
    name: 'cody',
    orgName: 'sourcegraph',
    repoUrl: 'https://github.com/sourcegraph/cody',
    description:
      'Sourcegraph의 코드베이스 인식 AI 코딩 어시스턴트. 엔터프라이즈 코드 검색과 통합.',
    readmeExcerpt: `Sourcegraph의 코드베이스 인식 AI 코딩 어시스턴트. 엔터프라이즈 코드 검색과 통합.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 3200,
    forks: 410,
    issuesOpen: 124,
    latestVersion: 'v1.40.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['typescript'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['claude-sonnet-4-6', 'claude-opus-4-7', 'gpt-4o'],
    tags: ['codebase-aware', 'enterprise', 'vscode', 'jetbrains'],
    verified: true,
    featured: false,
    installCmd: 'vsix install sourcegraph.cody-ai',
    downloadsCount: 6700,
    benchmarks: [],
  },
  {
    slug: 'smol-ai/developer',
    name: 'developer',
    orgName: 'smol-ai',
    repoUrl: 'https://github.com/smol-ai/developer',
    description:
      '간결한 prompt로 전체 코드베이스를 생성하는 미니멀 AI 개발자 에이전트.',
    readmeExcerpt: `간결한 prompt로 전체 코드베이스를 생성하는 미니멀 AI 개발자 에이전트.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 11900,
    forks: 1050,
    issuesOpen: 38,
    latestVersion: 'v0.4.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['minimal', 'bootstrap', 'python', 'prompt-engineering'],
    verified: true,
    featured: false,
    installCmd: 'pip install smol-dev',
    downloadsCount: 2400,
    benchmarks: [],
  },
  {
    slug: 'TabbyML/tabby',
    name: 'tabby',
    orgName: 'TabbyML',
    repoUrl: 'https://github.com/TabbyML/tabby',
    description:
      'GitHub Copilot의 자체 호스팅 오픈소스 대안. 온프레미스 AI 코딩 어시스턴트.',
    readmeExcerpt: `GitHub Copilot의 자체 호스팅 오픈소스 대안. 온프레미스 AI 코딩 어시스턴트.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 22800,
    forks: 1080,
    issuesOpen: 196,
    latestVersion: 'v0.18.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['rust'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['llama', 'mistral'],
    tags: ['self-hosted', 'copilot-alternative', 'on-premise', 'rust'],
    verified: true,
    featured: true,
    installCmd: 'docker run -it tabbyml/tabby',
    downloadsCount: 5800,
    benchmarks: [],
  },
  {
    slug: 'gpt-engineer-org/gpt-engineer',
    name: 'gpt-engineer',
    orgName: 'gpt-engineer-org',
    repoUrl: 'https://github.com/gpt-engineer-org/gpt-engineer',
    description:
      '자연어 명세에서 전체 코드베이스를 생성하는 자율 코드 에이전트.',
    readmeExcerpt: `자연어 명세에서 전체 코드베이스를 생성하는 자율 코드 에이전트.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 53400,
    forks: 6900,
    issuesOpen: 102,
    latestVersion: 'v0.3.1',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['autonomous', 'codegen', 'cli', 'classic'],
    verified: true,
    featured: false,
    installCmd: 'pip install gpt-engineer',
    downloadsCount: 18600,
    benchmarks: [
      {
        name: 'HumanEval',
        score: 0.674,
        model: 'gpt-4o',
        date: new Date('2025-02-15'),
      },
    ],
  },
  // ===== EVAL_HARNESS (5 additions) =====
  {
    slug: 'openai/evals',
    name: 'evals',
    orgName: 'openai',
    repoUrl: 'https://github.com/openai/evals',
    description:
      'OpenAI 공식 LLM 평가 프레임워크. 모델 성능을 표준화된 벤치마크로 측정.',
    readmeExcerpt: `OpenAI 공식 LLM 평가 프레임워크. 모델 성능을 표준화된 벤치마크로 측정.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 16200,
    forks: 2700,
    issuesOpen: 89,
    latestVersion: 'v1.0.3',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['gpt-4o', 'gpt-4', 'claude-sonnet-4-6'],
    tags: ['evaluation', 'benchmark', 'openai', 'standard'],
    verified: true,
    featured: true,
    installCmd: 'pip install evals',
    downloadsCount: 9400,
    benchmarks: [
      {
        name: 'MMLU',
        score: 0.864,
        model: 'gpt-4o',
        date: new Date('2025-01-20'),
      },
    ],
  },
  {
    slug: 'EleutherAI/lm-evaluation-harness',
    name: 'lm-evaluation-harness',
    orgName: 'EleutherAI',
    repoUrl: 'https://github.com/EleutherAI/lm-evaluation-harness',
    description:
      'EleutherAI의 LLM 평가 표준 프레임워크. 60+ 학술 벤치마크 통합.',
    readmeExcerpt: `EleutherAI의 LLM 평가 표준 프레임워크. 60+ 학술 벤치마크 통합.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 8900,
    forks: 2400,
    issuesOpen: 311,
    latestVersion: 'v0.4.5',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['llama', 'mistral', 'gpt-4o', 'claude-sonnet-4-6'],
    tags: ['academic', 'leaderboard', 'huggingface', 'mmlu'],
    verified: true,
    featured: true,
    installCmd: 'pip install lm-eval',
    downloadsCount: 15700,
    benchmarks: [
      {
        name: 'MMLU',
        score: 0.792,
        model: 'llama-3-70b',
        date: new Date('2025-02-01'),
      },
      {
        name: 'HellaSwag',
        score: 0.873,
        model: 'llama-3-70b',
        date: new Date('2025-02-01'),
      },
    ],
  },
  {
    slug: 'microsoft/promptflow',
    name: 'promptflow',
    orgName: 'microsoft',
    repoUrl: 'https://github.com/microsoft/promptflow',
    description:
      'LLM 앱의 prompt 흐름을 시각적으로 설계·평가·배포하는 Microsoft 도구.',
    readmeExcerpt: `LLM 앱의 prompt 흐름을 시각적으로 설계·평가·배포하는 Microsoft 도구.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 9700,
    forks: 880,
    issuesOpen: 167,
    latestVersion: 'v1.16.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['azure', 'workflow', 'visual', 'enterprise'],
    verified: true,
    featured: false,
    installCmd: 'pip install promptflow',
    downloadsCount: 7300,
    benchmarks: [],
  },
  {
    slug: 'confident-ai/deepeval',
    name: 'deepeval',
    orgName: 'confident-ai',
    repoUrl: 'https://github.com/confident-ai/deepeval',
    description:
      'LLM 출력에 대한 단위 테스트 프레임워크. pytest 스타일의 평가 어설션.',
    readmeExcerpt: `LLM 출력에 대한 단위 테스트 프레임워크. pytest 스타일의 평가 어설션.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 4800,
    forks: 410,
    issuesOpen: 84,
    latestVersion: 'v2.0.9',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['testing', 'pytest', 'metrics', 'hallucination'],
    verified: true,
    featured: false,
    installCmd: 'pip install deepeval',
    downloadsCount: 11200,
    benchmarks: [],
  },
  {
    slug: 'truera/trulens',
    name: 'trulens',
    orgName: 'truera',
    repoUrl: 'https://github.com/truera/trulens',
    description:
      'LLM 앱의 품질·정확도·관련성을 정량화하는 평가·트레이싱 라이브러리.',
    readmeExcerpt: `LLM 앱의 품질·정확도·관련성을 정량화하는 평가·트레이싱 라이브러리.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 2400,
    forks: 220,
    issuesOpen: 56,
    latestVersion: 'v1.2.5',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['observability', 'tracing', 'rag-evaluation', 'metrics'],
    verified: true,
    featured: false,
    installCmd: 'pip install trulens',
    downloadsCount: 4100,
    benchmarks: [],
  },
  // ===== RAG_FRAMEWORK (5 additions) =====
  {
    slug: 'run-llama/llama_index',
    name: 'llama_index',
    orgName: 'run-llama',
    repoUrl: 'https://github.com/run-llama/llama_index',
    description:
      'LLM을 외부 데이터에 연결하는 대표 RAG 프레임워크. 데이터 인덱싱·쿼리 추상화.',
    readmeExcerpt: `LlamaIndex는 다양한 형태의 외부 데이터(PDF, Notion, SQL, API 등)를 LLM과 매끄럽게 연결해 주는 데이터 프레임워크이자 RAG(Retrieval-Augmented Generation) 구축의 사실상 표준 도구입니다.

### 🎯 어디에 쓰나요? (Use Cases)
- **사내 문서 기반 Q&A 봇**: 기업 내부의 정책 문서, 매뉴얼 등을 기반으로 정확히 답변하는 챗봇 구축
- **복잡한 데이터 분석**: SQL DB와 비정형 데이터를 결합해 사용자 질의에 답하는 분석 시스템
- **개인화된 AI 비서**: 내 캘린더, 이메일, 슬랙 메시지를 연동한 맞춤형 AI 구축

### ✨ 무엇을 할 수 있나요? (Features)
- 200개가 넘는 데이터 커넥터 (LlamaHub) 지원
- 다양한 청킹(Chunking), 임베딩, 벡터 스토어 통합 기능
- 단순 검색을 넘어서는 라우터(Router), 에이전트(Agentic RAG) 기반 고급 쿼리 엔진 제공
- 파이썬(Python) 및 타입스크립트(TypeScript) 공식 생태계 지원

### 👍 장점 (Pros)
- 데이터를 로드하고 인덱싱하는 과정이 놀랍도록 직관적이며 추상화가 잘 되어 있습니다.
- 단순히 문서를 검색하는 것을 넘어, 어떤 문서를 볼지 AI가 결정하는 에이전틱(Agentic) RAG 구현이 쉽습니다.
- 커뮤니티가 거대하여 막히는 부분이 있을 때 해결책을 찾기 쉽습니다.

### 👎 단점 및 한계 (Cons)
- 고도화된 커스텀 로직을 작성하려고 할 때 내부 추상화 레이어를 뚫고 들어가기가 까다로울 수 있습니다.
- 너무 빠르게 업데이트되어 이전 버전의 코드가 작동하지 않는 브레이킹 체인지(Breaking Changes)가 잦은 편입니다.`,
    stars: 38900,
    forks: 5600,
    issuesOpen: 612,
    latestVersion: 'v0.12.10',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'typescript'],
    category: HarnessCategory.RAG_FRAMEWORK,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama', 'gemini'],
    tags: ['rag', 'vector-search', 'data-connectors', 'indexing'],
    verified: true,
    featured: true,
    installCmd: 'pip install llama-index',
    downloadsCount: 41200,
    benchmarks: [],
  },
  {
    slug: 'langchain-ai/langchain',
    name: 'langchain',
    orgName: 'langchain-ai',
    repoUrl: 'https://github.com/langchain-ai/langchain',
    description:
      'LLM 애플리케이션 개발을 위한 가장 인기있는 프레임워크. Chain·Agent·RAG 추상화.',
    readmeExcerpt: `LangChain은 LLM을 활용한 애플리케이션 개발을 위한 가장 포괄적이고 인기 있는 프레임워크입니다. 텍스트 생성부터 외부 툴 연동, 에이전트 워크플로우까지 AI 개발의 모든 요소를 블록처럼 조립할 수 있습니다.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 서비스 백엔드 통합**: 다양한 LLM(OpenAI, Anthropic 등)을 쉽게 교체하고 테스트할 수 있는 서버 구축
- **멀티스텝 워크플로우(Chain)**: 번역 후 요약, 프롬프트 전처리 등 순차적인 AI 작업 체인 생성
- **도구 사용(Tool-use) 에이전트**: 날씨 API, 검색 엔진, 계산기 등을 활용하는 챗봇 제작

### ✨ 무엇을 할 수 있나요? (Features)
- 프롬프트 템플릿 관리 및 출력 파싱(Output Parser)
- LCEL (LangChain Expression Language)을 통한 선언적 파이프라인 구성
- 대화 기록(Memory) 관리 및 벡터 스토어 연동 지원
- LangGraph를 활용한 상태 기반 멀티 에이전트 런타임 제공

### 👍 장점 (Pros)
- 거의 모든 AI 관련 라이브러리 및 DB와의 통합(Integrations)이 기본 제공됩니다.
- 초기 프로토타입을 극도로 빠르게(며칠 내로) 개발하여 시연할 수 있습니다.
- 생태계가 압도적으로 커서 튜토리얼과 레퍼런스가 넘쳐납니다.

### 👎 단점 및 한계 (Cons)
- 거대한 모놀리식 구조로 인해 프레임워크 자체가 무겁고, 때로는 오버엔지니어링(Over-engineering)으로 느껴집니다.
- 내부 디버깅이 어렵고 에러 트레이스가 매우 길어 원인을 찾기 힘든 경우가 있습니다.`,
    stars: 95400,
    forks: 15400,
    issuesOpen: 894,
    latestVersion: 'v0.3.13',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'typescript'],
    category: HarnessCategory.RAG_FRAMEWORK,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama', 'gemini', 'mistral'],
    tags: ['rag', 'agent', 'chain', 'standard'],
    verified: true,
    featured: true,
    installCmd: 'pip install langchain',
    downloadsCount: 89400,
    benchmarks: [],
  },
  {
    slug: 'chroma-core/chroma',
    name: 'chroma',
    orgName: 'chroma-core',
    repoUrl: 'https://github.com/chroma-core/chroma',
    description:
      'AI 네이티브 오픈소스 임베딩 벡터 데이터베이스. RAG에 최적화.',
    readmeExcerpt: `Chroma는 AI 애플리케이션 구축을 위해 특별히 설계된 오픈소스 벡터 데이터베이스(Vector DB)입니다. 설치와 사용이 매우 간단하여 RAG 생태계에서 가장 널리 사용되는 기본 스토리지 엔진 중 하나입니다.

### 🎯 어디에 쓰나요? (Use Cases)
- **RAG 시스템 백엔드**: LLM 프레임워크(Llangchain, LlamaIndex 등)와 결합하여 문서의 임베딩 값을 저장하고 검색
- **시맨틱 검색 엔진**: 키워드 매칭이 아닌 문맥과 의미(Semantic) 기반의 추천 및 검색 서비스 구현
- **로컬 AI 프로토타이핑**: 별도의 무거운 DB 서버 구축 없이 인메모리 또는 로컬 파일 형태로 빠르게 개발

### ✨ 무엇을 할 수 있나요? (Features)
- 문서(텍스트)와 메타데이터의 임베딩 자동 생성 및 저장
- 수십 밀리초 이내의 초고속 벡터 유사도 검색 (K-NN)
- 서버-클라이언트 모드와 로컬 내장(Embedded) 모드 완벽 지원
- 오픈소스 생태계와의 완벽한 플러그 앤 플레이 호환성

### 👍 장점 (Pros)
- 파이썬 환경에서 \`pip install chromadb\` 한 줄로 설치되고 설정 파일이 거의 필요 없어 진입 장벽이 매우 낮습니다.
- 로컬 SQLite 기반으로 동작하여 개발 및 테스트 목적으로는 최고의 생산성을 자랑합니다.
- 복잡한 임베딩 모델 연결 과정을 내장 모듈로 추상화하여 사용이 간편합니다.

### 👎 단점 및 한계 (Cons)
- Pinecone이나 Milvus 같은 거대한 엔터프라이즈급 분산 벡터 DB에 비해서는 대규모 트래픽 처리 능력이 떨어질 수 있습니다.
- 백업 및 복제, 고가용성(HA) 아키텍처 구성 기능이 상대적으로 부족합니다.`,
    stars: 16400,
    forks: 1380,
    issuesOpen: 218,
    latestVersion: 'v0.5.23',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'rust'],
    category: HarnessCategory.RAG_FRAMEWORK,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['vector-db', 'embeddings', 'rag', 'storage'],
    verified: true,
    featured: true,
    installCmd: 'pip install chromadb',
    downloadsCount: 28700,
    benchmarks: [],
  },
  {
    slug: 'milvus-io/pymilvus',
    name: 'pymilvus',
    orgName: 'milvus-io',
    repoUrl: 'https://github.com/milvus-io/pymilvus',
    description:
      'Milvus 벡터 데이터베이스의 공식 Python SDK. 대규모 임베딩 검색.',
    readmeExcerpt: `Milvus 벡터 데이터베이스의 공식 Python SDK. 대규모 임베딩 검색.

### 🎯 어디에 쓰나요? (Use Cases)
- **엔터프라이즈 지식 검색망**: 방대한 사내 문서나 외부 데이터를 LLM과 결합하여 환각 현상을 줄인 정확한 챗봇/분석기 생성.

### ✨ 무엇을 할 수 있나요? (Features)
- 문서 청킹, 임베딩, 벡터 스토어 통합 기능\n- 멀티모달 데이터 파이프라인 구성

### 👍 장점 (Pros)
- 복잡한 데이터 연결 작업을 추상화하여 개발 리소스 절약\n- 뛰어난 확장성 및 모듈식 아키텍처

### 👎 단점 및 한계 (Cons)
- 성능 튜닝(청크 사이즈, 임베딩 모델 선택)에 상당한 노하우 필요`,
    stars: 1100,
    forks: 340,
    issuesOpen: 73,
    latestVersion: 'v2.5.1',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.RAG_FRAMEWORK,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['vector-db', 'milvus', 'sdk', 'distributed'],
    verified: true,
    featured: false,
    installCmd: 'pip install pymilvus',
    downloadsCount: 17800,
    benchmarks: [],
  },
  {
    slug: 'weaviate/weaviate-python-client',
    name: 'weaviate-python-client',
    orgName: 'weaviate',
    repoUrl: 'https://github.com/weaviate/weaviate-python-client',
    description:
      'Weaviate 벡터 검색 엔진의 공식 Python 클라이언트. 시맨틱 검색 SDK.',
    readmeExcerpt: `Weaviate 벡터 검색 엔진의 공식 Python 클라이언트. 시맨틱 검색 SDK.

### 🎯 어디에 쓰나요? (Use Cases)
- **엔터프라이즈 지식 검색망**: 방대한 사내 문서나 외부 데이터를 LLM과 결합하여 환각 현상을 줄인 정확한 챗봇/분석기 생성.

### ✨ 무엇을 할 수 있나요? (Features)
- 문서 청킹, 임베딩, 벡터 스토어 통합 기능\n- 멀티모달 데이터 파이프라인 구성

### 👍 장점 (Pros)
- 복잡한 데이터 연결 작업을 추상화하여 개발 리소스 절약\n- 뛰어난 확장성 및 모듈식 아키텍처

### 👎 단점 및 한계 (Cons)
- 성능 튜닝(청크 사이즈, 임베딩 모델 선택)에 상당한 노하우 필요`,
    stars: 180,
    forks: 80,
    issuesOpen: 24,
    latestVersion: 'v4.10.2',
    license: 'BSD-3-Clause',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.RAG_FRAMEWORK,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['vector-db', 'weaviate', 'semantic-search', 'sdk'],
    verified: true,
    featured: false,
    installCmd: 'pip install weaviate-client',
    downloadsCount: 9800,
    benchmarks: [],
  },
  // ===== RESEARCH_AGENT (4 additions) =====
  {
    slug: 'assafelovic/gpt-researcher',
    name: 'gpt-researcher',
    orgName: 'assafelovic',
    repoUrl: 'https://github.com/assafelovic/gpt-researcher',
    description:
      '심층 리서치를 자율 수행하는 AI 에이전트. 웹 검색·요약·보고서 생성.',
    readmeExcerpt: `GPT Researcher는 주어진 주제에 대해 인간보다 수십 배 빠르게 심층 리서치를 수행하는 전문 AI 에이전트입니다. 단순히 검색 결과를 요약하는 것을 넘어, 종합적인 보고서를 인용구(Citation)와 함께 작성합니다.

### 🎯 어디에 쓰나요? (Use Cases)
- **학술 연구 및 시장 조사**: 트렌드 분석, 경쟁사 조사, 최신 논문 동향 파악
- **콘텐츠 크리에이션**: 블로그 포스트, 기사, 뉴스레터 작성을 위한 방대한 기초 자료 수집
- **투자 분석 (Due Diligence)**: 특정 기업이나 산업에 대한 포괄적인 백서 형태의 보고서 추출

### ✨ 무엇을 할 수 있나요? (Features)
- 검색어 자동 최적화 및 20개 이상의 출처 동시 크롤링
- 할루시네이션(환각) 방지를 위한 엄격한 교차 검증 및 인용(Reference) 시스템
- 연구/분석/요약 등 목적에 맞게 에이전트의 페르소나 설정 가능
- PDF, Word, Markdown 등 다양한 포맷으로 최종 보고서 Export 기능

### 👍 장점 (Pros)
- 단순 챗봇의 "검색 후 요약" 수준을 넘어, 목차를 짜고 논리적으로 서술하는 퀄리티가 뛰어납니다.
- 팩트 체크가 필수적인 환경에서 출처를 명확히 달아주어 신뢰성이 높습니다.
- Tavily, Searxng 등 다양한 검색 엔진 API와 결합 가능합니다.

### 👎 단점 및 한계 (Cons)
- 하나의 보고서를 완성하기 위해 수많은 검색 API 호출과 LLM 토큰을 사용하므로 비용이 많이 듭니다.
- 실시간성이 극도로 중요한 초단기 뉴스나 소셜 미디어 트렌드 파악에는 다소 느릴 수 있습니다.`,
    stars: 15700,
    forks: 2000,
    issuesOpen: 142,
    latestVersion: 'v0.10.7',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.RESEARCH_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['research', 'web-search', 'report-generation', 'citations'],
    verified: true,
    featured: true,
    installCmd: 'pip install gpt-researcher',
    downloadsCount: 6400,
    benchmarks: [
      {
        name: 'GAIA',
        score: 0.421,
        model: 'gpt-4o',
        date: new Date('2025-03-20'),
      },
    ],
  },
  {
    slug: 'Significant-Gravitas/AutoGPT',
    name: 'AutoGPT',
    orgName: 'Significant-Gravitas',
    repoUrl: 'https://github.com/Significant-Gravitas/AutoGPT',
    description:
      '목표 지향 자율 AI 에이전트 플랫폼. 작업을 분해하고 도구를 사용해 실행.',
    readmeExcerpt: `목표 지향 자율 AI 에이전트 플랫폼. 작업을 분해하고 도구를 사용해 실행.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 목표 지향 자율 AI 에이전트 플랫폼. 작업을 분해하고 도구를 사용해 실행.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 172000,
    forks: 45200,
    issuesOpen: 198,
    latestVersion: 'v0.5.1',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'typescript'],
    category: HarnessCategory.RESEARCH_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['autonomous', 'platform', 'goal-oriented', 'classic'],
    verified: true,
    featured: true,
    installCmd: 'docker run -it autogpt/autogpt',
    downloadsCount: 31000,
    benchmarks: [
      {
        name: 'AgentBench',
        score: 0.343,
        model: 'gpt-4o',
        date: new Date('2025-01-25'),
      },
    ],
  },
  {
    slug: 'yoheinakajima/babyagi',
    name: 'babyagi',
    orgName: 'yoheinakajima',
    repoUrl: 'https://github.com/yoheinakajima/babyagi',
    description:
      '작업 생성·우선순위·실행 루프로 동작하는 미니멀 AGI 에이전트 프로토타입.',
    readmeExcerpt: `작업 생성·우선순위·실행 루프로 동작하는 미니멀 AGI 에이전트 프로토타입.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 작업 생성·우선순위·실행 루프로 동작하는 미니멀 AGI 에이전트 프로토타입.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 21100,
    forks: 2800,
    issuesOpen: 49,
    latestVersion: 'v0.2.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.RESEARCH_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['agi', 'task-loop', 'minimal', 'classic'],
    verified: true,
    featured: false,
    installCmd: 'pip install babyagi',
    downloadsCount: 4900,
    benchmarks: [],
  },
  {
    slug: 'OpenBMB/XAgent',
    name: 'XAgent',
    orgName: 'OpenBMB',
    repoUrl: 'https://github.com/OpenBMB/XAgent',
    description:
      '복잡한 태스크를 자율적으로 해결하는 자가 평가형 LLM 에이전트.',
    readmeExcerpt: `복잡한 태스크를 자율적으로 해결하는 자가 평가형 LLM 에이전트.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 복잡한 태스크를 자율적으로 해결하는 자가 평가형 LLM 에이전트.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 8200,
    forks: 870,
    issuesOpen: 67,
    latestVersion: 'v1.1.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.RESEARCH_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['research', 'planning', 'self-evaluation', 'autonomous'],
    verified: true,
    featured: false,
    installCmd: 'pip install xagent',
    downloadsCount: 2100,
    benchmarks: [
      {
        name: 'AgentBench',
        score: 0.298,
        model: 'gpt-4o',
        date: new Date('2025-02-10'),
      },
    ],
  },
  // ===== TOOL_USE (4 additions) =====
  {
    slug: 'microsoft/semantic-kernel',
    name: 'semantic-kernel',
    orgName: 'microsoft',
    repoUrl: 'https://github.com/microsoft/semantic-kernel',
    description:
      'Microsoft의 멀티 언어 AI 오케스트레이션 SDK. C#·Python·Java 지원.',
    readmeExcerpt: `Microsoft의 멀티 언어 AI 오케스트레이션 SDK. C#·Python·Java 지원.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- Microsoft의 멀티 언어 AI 오케스트레이션 SDK. C#·Python·Java 지원.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 22600,
    forks: 3400,
    issuesOpen: 421,
    latestVersion: 'v1.30.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'typescript'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['microsoft', 'orchestration', 'plugins', 'enterprise'],
    verified: true,
    featured: true,
    installCmd: 'pip install semantic-kernel',
    downloadsCount: 19400,
    benchmarks: [],
  },
  {
    slug: 'jxnl/instructor',
    name: 'instructor',
    orgName: 'jxnl',
    repoUrl: 'https://github.com/jxnl/instructor',
    description:
      'Pydantic 모델로 LLM 출력을 구조화하는 라이브러리. Function calling 표준화.',
    readmeExcerpt: `Pydantic 모델로 LLM 출력을 구조화하는 라이브러리. Function calling 표준화.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- Pydantic 모델로 LLM 출력을 구조화하는 라이브러리. Function calling 표준화.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 8400,
    forks: 670,
    issuesOpen: 91,
    latestVersion: 'v1.7.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama', 'gemini'],
    tags: ['pydantic', 'structured-output', 'function-calling', 'typed'],
    verified: true,
    featured: false,
    installCmd: 'pip install instructor',
    downloadsCount: 24300,
    benchmarks: [],
  },
  {
    slug: 'prefecthq/marvin',
    name: 'marvin',
    orgName: 'prefecthq',
    repoUrl: 'https://github.com/prefecthq/marvin',
    description:
      'Python 함수처럼 LLM을 호출하는 미니멀 AI 엔지니어링 툴킷. AI-네이티브 API.',
    readmeExcerpt: `Python 함수처럼 LLM을 호출하는 미니멀 AI 엔지니어링 툴킷. AI-네이티브 API.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- Python 함수처럼 LLM을 호출하는 미니멀 AI 엔지니어링 툴킷. AI-네이티브 API.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 5400,
    forks: 350,
    issuesOpen: 64,
    latestVersion: 'v2.3.7',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['decorator', 'minimal', 'ai-functions', 'pythonic'],
    verified: true,
    featured: false,
    installCmd: 'pip install marvin',
    downloadsCount: 3700,
    benchmarks: [],
  },
  {
    slug: 'guidance-ai/guidance',
    name: 'guidance',
    orgName: 'guidance-ai',
    repoUrl: 'https://github.com/guidance-ai/guidance',
    description:
      'LLM 출력을 정규식·문법·CFG로 제약하는 구조화 생성 라이브러리.',
    readmeExcerpt: `LLM 출력을 정규식·문법·CFG로 제약하는 구조화 생성 라이브러리.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- LLM 출력을 정규식·문법·CFG로 제약하는 구조화 생성 라이브러리.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 19200,
    forks: 1080,
    issuesOpen: 132,
    latestVersion: 'v0.2.1',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['structured-generation', 'grammar', 'constraints', 'token-level'],
    verified: true,
    featured: false,
    installCmd: 'pip install guidance',
    downloadsCount: 8900,
    benchmarks: [],
  },
  // ===== MULTI_AGENT (4 additions) =====
  {
    slug: 'joaomdmoura/crewAI',
    name: 'crewAI',
    orgName: 'joaomdmoura',
    repoUrl: 'https://github.com/joaomdmoura/crewAI',
    description:
      '역할 기반 자율 AI 에이전트 협업 프레임워크. 다양한 역할의 에이전트가 팀을 구성.',
    readmeExcerpt: `역할 기반 자율 AI 에이전트 협업 프레임워크. 다양한 역할의 에이전트가 팀을 구성.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 역할 기반 자율 AI 에이전트 협업 프레임워크. 다양한 역할의 에이전트가 팀을 구성.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 26800,
    forks: 3700,
    issuesOpen: 156,
    latestVersion: 'v0.86.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['multi-agent', 'role-based', 'collaboration', 'crew'],
    verified: true,
    featured: true,
    installCmd: 'pip install crewai',
    downloadsCount: 22700,
    benchmarks: [],
  },
  {
    slug: 'microsoft/JARVIS',
    name: 'JARVIS',
    orgName: 'microsoft',
    repoUrl: 'https://github.com/microsoft/JARVIS',
    description:
      'HuggingFace 모델들을 오케스트레이션하는 ChatGPT 제어형 멀티모델 에이전트.',
    readmeExcerpt: `HuggingFace 모델들을 오케스트레이션하는 ChatGPT 제어형 멀티모델 에이전트.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- HuggingFace 모델들을 오케스트레이션하는 ChatGPT 제어형 멀티모델 에이전트.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 23800,
    forks: 1990,
    issuesOpen: 73,
    latestVersion: 'v1.1.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['huggingface', 'multi-model', 'orchestration', 'microsoft'],
    verified: true,
    featured: false,
    installCmd: 'pip install jarvis-ai',
    downloadsCount: 3400,
    benchmarks: [],
  },
  {
    slug: 'AgentOps-AI/agentops',
    name: 'agentops',
    orgName: 'AgentOps-AI',
    repoUrl: 'https://github.com/AgentOps-AI/agentops',
    description:
      'AI 에이전트 옵저버빌리티·디버깅·세션 리플레이 SDK. 멀티 에이전트 모니터링.',
    readmeExcerpt: `AI 에이전트 옵저버빌리티·디버깅·세션 리플레이 SDK. 멀티 에이전트 모니터링.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- AI 에이전트 옵저버빌리티·디버깅·세션 리플레이 SDK. 멀티 에이전트 모니터링.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 3200,
    forks: 270,
    issuesOpen: 48,
    latestVersion: 'v0.3.21',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama'],
    tags: ['observability', 'monitoring', 'tracing', 'devops'],
    verified: true,
    featured: false,
    installCmd: 'pip install agentops',
    downloadsCount: 5600,
    benchmarks: [],
  },
  {
    slug: 'reworkd/AgentGPT',
    name: 'AgentGPT',
    orgName: 'reworkd',
    repoUrl: 'https://github.com/reworkd/AgentGPT',
    description:
      '브라우저에서 자율 AI 에이전트를 구성·배포하는 노코드 웹 플랫폼.',
    readmeExcerpt: `브라우저에서 자율 AI 에이전트를 구성·배포하는 노코드 웹 플랫폼.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 브라우저에서 자율 AI 에이전트를 구성·배포하는 노코드 웹 플랫폼.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 32500,
    forks: 9300,
    issuesOpen: 124,
    latestVersion: 'v1.2.0',
    license: 'GPL-3.0',
    licenseTier: LicenseTier.YELLOW,
    languages: ['typescript'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['web', 'no-code', 'autonomous', 'browser-based'],
    verified: true,
    featured: false,
    installCmd: 'docker run -it reworkd/agentgpt',
    downloadsCount: 7800,
    benchmarks: [],
  },
  // ===== BROWSER_AGENT (3 additions) =====
  {
    slug: 'microsoft/playwright',
    name: 'playwright',
    orgName: 'microsoft',
    repoUrl: 'https://github.com/microsoft/playwright',
    description:
      '신뢰성 높은 엔드투엔드 웹 자동화 프레임워크. AI 에이전트의 브라우저 제어 백본.',
    readmeExcerpt: `신뢰성 높은 엔드투엔드 웹 자동화 프레임워크. AI 에이전트의 브라우저 제어 백본.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 신뢰성 높은 엔드투엔드 웹 자동화 프레임워크. AI 에이전트의 브라우저 제어 백본.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 68200,
    forks: 3800,
    issuesOpen: 728,
    latestVersion: 'v1.49.1',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['typescript', 'python'],
    category: HarnessCategory.BROWSER_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['browser-automation', 'testing', 'e2e', 'microsoft'],
    verified: true,
    featured: true,
    installCmd: 'npm install playwright',
    downloadsCount: 91000,
    benchmarks: [],
  },
  {
    slug: 'lavague-ai/LaVague',
    name: 'LaVague',
    orgName: 'lavague-ai',
    repoUrl: 'https://github.com/lavague-ai/LaVague',
    description:
      '자연어 명령을 브라우저 액션으로 변환하는 대규모 액션 모델(LAM) 프레임워크.',
    readmeExcerpt: `자연어 명령을 브라우저 액션으로 변환하는 대규모 액션 모델(LAM) 프레임워크.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자연어 명령을 브라우저 액션으로 변환하는 대규모 액션 모델(LAM) 프레임워크.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 5900,
    forks: 540,
    issuesOpen: 38,
    latestVersion: 'v1.3.2',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.BROWSER_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['web-automation', 'lam', 'natural-language', 'selenium'],
    verified: true,
    featured: false,
    installCmd: 'pip install lavague',
    downloadsCount: 3400,
    benchmarks: [
      {
        name: 'WebArena',
        score: 0.218,
        model: 'gpt-4o',
        date: new Date('2025-04-12'),
      },
    ],
  },
  {
    slug: 'web-infra-dev/midscene',
    name: 'midscene',
    orgName: 'web-infra-dev',
    repoUrl: 'https://github.com/web-infra-dev/midscene',
    description:
      'AI 비전 기반 UI 자동화 도구. 스크린샷을 보고 액션을 수행하는 브라우저 에이전트.',
    readmeExcerpt: `AI 비전 기반 UI 자동화 도구. 스크린샷을 보고 액션을 수행하는 브라우저 에이전트.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- AI 비전 기반 UI 자동화 도구. 스크린샷을 보고 액션을 수행하는 브라우저 에이전트.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 5300,
    forks: 320,
    issuesOpen: 41,
    latestVersion: 'v0.10.5',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['typescript'],
    category: HarnessCategory.BROWSER_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini'],
    tags: ['vision', 'ui-automation', 'multimodal', 'puppeteer'],
    verified: true,
    featured: false,
    installCmd: 'npm install @midscene/web',
    downloadsCount: 2100,
    benchmarks: [],
  },
  // ===== DATA_PIPELINE (2 additions) =====
  {
    slug: 'prefecthq/prefect',
    name: 'prefect',
    orgName: 'prefecthq',
    repoUrl: 'https://github.com/prefecthq/prefect',
    description:
      '현대적 데이터 워크플로우 오케스트레이션 도구. AI/ML 파이프라인 자동화.',
    readmeExcerpt: `현대적 데이터 워크플로우 오케스트레이션 도구. AI/ML 파이프라인 자동화.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 현대적 데이터 워크플로우 오케스트레이션 도구. AI/ML 파이프라인 자동화.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 18100,
    forks: 1700,
    issuesOpen: 632,
    latestVersion: 'v3.1.10',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.DATA_PIPELINE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['orchestration', 'workflow', 'mlops', 'scheduler'],
    verified: true,
    featured: false,
    installCmd: 'pip install prefect',
    downloadsCount: 47200,
    benchmarks: [],
  },
  {
    slug: 'dagster-io/dagster',
    name: 'dagster',
    orgName: 'dagster-io',
    repoUrl: 'https://github.com/dagster-io/dagster',
    description:
      '데이터 자산 중심의 ML/AI 파이프라인 오케스트레이터. 타입 안전 워크플로우.',
    readmeExcerpt: `데이터 자산 중심의 ML/AI 파이프라인 오케스트레이터. 타입 안전 워크플로우.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 데이터 자산 중심의 ML/AI 파이프라인 오케스트레이터. 타입 안전 워크플로우.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 12200,
    forks: 1530,
    issuesOpen: 1480,
    latestVersion: 'v1.9.8',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.DATA_PIPELINE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['orchestration', 'data-assets', 'mlops', 'typed'],
    verified: true,
    featured: false,
    installCmd: 'pip install dagster',
    downloadsCount: 28400,
    benchmarks: [],
  },

  // ===== CODING_AGENT (추가) =====
  {
    slug: 'stitionai/devika',
    name: 'devika',
    orgName: 'stitionai',
    repoUrl: 'https://github.com/stitionai/devika',
    description: 'AI 소프트웨어 엔지니어. 자연어 명령으로 코드를 설계·작성·디버그.',
    readmeExcerpt: `AI 소프트웨어 엔지니어. 자연어 명령으로 코드를 설계·작성·디버그.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 18400,
    forks: 2100,
    issuesOpen: 320,
    latestVersion: 'v0.1.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['gpt-4o', 'claude-opus-4-7', 'gemini-pro'],
    tags: ['ai-engineer', 'code-generation', 'planning', 'browser'],
    verified: true,
    featured: false,
    installCmd: 'git clone https://github.com/stitionai/devika && pip install -r requirements.txt',
    downloadsCount: 8900,
    benchmarks: [],
  },
  {
    slug: 'e2b-dev/E2B',
    name: 'E2B',
    orgName: 'e2b-dev',
    repoUrl: 'https://github.com/e2b-dev/E2B',
    description: 'AI 에이전트를 위한 클라우드 코드 실행 샌드박스. 안전한 격리 환경에서 코드 실행.',
    readmeExcerpt: `AI 에이전트를 위한 클라우드 코드 실행 샌드박스. 안전한 격리 환경에서 코드 실행.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 7800,
    forks: 560,
    issuesOpen: 98,
    latestVersion: 'v1.0.5',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'typescript'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro'],
    tags: ['sandbox', 'code-execution', 'cloud', 'isolation'],
    verified: true,
    featured: true,
    installCmd: 'pip install e2b',
    downloadsCount: 21000,
    benchmarks: [],
  },
  {
    slug: 'entropy-research/Devon',
    name: 'Devon',
    orgName: 'entropy-research',
    repoUrl: 'https://github.com/entropy-research/Devon',
    description: '오픈소스 AI 소프트웨어 엔지니어. 실제 코드베이스를 이해하고 복잡한 태스크 처리.',
    readmeExcerpt: `오픈소스 AI 소프트웨어 엔지니어. 실제 코드베이스를 이해하고 복잡한 태스크 처리.

### 🎯 어디에 쓰나요? (Use Cases)
- **코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 자율적인 코드 생성 및 파일 시스템 조작\n- 다양한 프로그래밍 언어 지원 및 IDE 통합

### 👍 장점 (Pros)
- 개발자 생산성 극대화 및 단순 반복 작업 제거\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스

### 👎 단점 및 한계 (Cons)
- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\n- 자율 실행 코드의 보안 및 무결성 검토 필수`,
    stars: 13200,
    forks: 890,
    issuesOpen: 145,
    latestVersion: 'v0.2.1',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.CODING_AGENT,
    modelCompat: ['claude-opus-4-7', 'gpt-4o'],
    tags: ['ai-engineer', 'swe', 'autonomous', 'terminal'],
    verified: true,
    featured: false,
    installCmd: 'pip install devon-agent',
    downloadsCount: 5600,
    benchmarks: [],
  },

  // ===== EVAL_HARNESS (추가) =====
  {
    slug: 'openai/human-eval',
    name: 'human-eval',
    orgName: 'openai',
    repoUrl: 'https://github.com/openai/human-eval',
    description: 'LLM 코드 생성 능력 평가를 위한 OpenAI 공식 HumanEval 벤치마크.',
    readmeExcerpt: `LLM 코드 생성 능력 평가를 위한 OpenAI 공식 HumanEval 벤치마크.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 2800,
    forks: 620,
    issuesOpen: 45,
    latestVersion: 'v1.0.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['gpt-4o', 'claude-opus-4-7', 'gemini-pro'],
    tags: ['benchmark', 'code-generation', 'humaneval', 'evaluation'],
    verified: true,
    featured: false,
    installCmd: 'pip install human-eval',
    downloadsCount: 15200,
    benchmarks: [],
  },
  {
    slug: 'evalplus/evalplus',
    name: 'EvalPlus',
    orgName: 'evalplus',
    repoUrl: 'https://github.com/evalplus/evalplus',
    description: 'HumanEval+·MBPP+ 강화 코드 생성 벤치마크. 10배 많은 테스트케이스.',
    readmeExcerpt: `HumanEval+·MBPP+ 강화 코드 생성 벤치마크. 10배 많은 테스트케이스.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 1600,
    forks: 180,
    issuesOpen: 32,
    latestVersion: 'v0.3.1',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['gpt-4o', 'claude-opus-4-7', 'gemini-pro'],
    tags: ['benchmark', 'humaneval', 'mbpp', 'code-eval'],
    verified: true,
    featured: false,
    installCmd: 'pip install evalplus',
    downloadsCount: 6800,
    benchmarks: [],
  },
  {
    slug: 'stanford-crfm/helm',
    name: 'HELM',
    orgName: 'stanford-crfm',
    repoUrl: 'https://github.com/stanford-crfm/helm',
    description: 'Stanford의 종합 LLM 평가 프레임워크. 42개 시나리오, 59개 지표.',
    readmeExcerpt: `Stanford의 종합 LLM 평가 프레임워크. 42개 시나리오, 59개 지표.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 1900,
    forks: 380,
    issuesOpen: 210,
    latestVersion: 'v0.5.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['gpt-4o', 'claude-opus-4-7', 'gemini-pro', 'llama-3'],
    tags: ['benchmark', 'holistic', 'stanford', 'multi-scenario'],
    verified: true,
    featured: false,
    installCmd: 'pip install crfm-helm',
    downloadsCount: 9400,
    benchmarks: [],
  },
  {
    slug: 'explodinggradients/ragas',
    name: 'ragas',
    orgName: 'explodinggradients',
    repoUrl: 'https://github.com/explodinggradients/ragas',
    description: 'RAG 파이프라인 품질 평가 프레임워크. 충실도·관련성·컨텍스트 정밀도 측정.',
    readmeExcerpt: `RAG 파이프라인 품질 평가 프레임워크. 충실도·관련성·컨텍스트 정밀도 측정.

### 🎯 어디에 쓰나요? (Use Cases)
- **LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 다양한 학술 및 실무 벤치마크 데이터셋 통합\n- 일관되고 재현 가능한 평가 스크립트 제공

### 👍 장점 (Pros)
- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\n- CI/CD 파이프라인 연동에 최적화

### 👎 단점 및 한계 (Cons)
- 평가 자체에 소모되는 LLM API 비용 발생\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계`,
    stars: 7200,
    forks: 720,
    issuesOpen: 188,
    latestVersion: 'v0.2.6',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.EVAL_HARNESS,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['rag', 'evaluation', 'faithfulness', 'relevance'],
    verified: true,
    featured: true,
    installCmd: 'pip install ragas',
    downloadsCount: 34500,
    benchmarks: [],
  },

  // ===== RAG_FRAMEWORK (추가) =====
  {
    slug: 'deepset-ai/haystack',
    name: 'Haystack',
    orgName: 'deepset-ai',
    repoUrl: 'https://github.com/deepset-ai/haystack',
    description: '프로덕션급 LLM 앱·RAG 파이프라인 구축 프레임워크. 모듈형 컴포넌트.',
    readmeExcerpt: `프로덕션급 LLM 앱·RAG 파이프라인 구축 프레임워크. 모듈형 컴포넌트.

### 🎯 어디에 쓰나요? (Use Cases)
- **엔터프라이즈 지식 검색망**: 방대한 사내 문서나 외부 데이터를 LLM과 결합하여 환각 현상을 줄인 정확한 챗봇/분석기 생성.

### ✨ 무엇을 할 수 있나요? (Features)
- 문서 청킹, 임베딩, 벡터 스토어 통합 기능\n- 멀티모달 데이터 파이프라인 구성

### 👍 장점 (Pros)
- 복잡한 데이터 연결 작업을 추상화하여 개발 리소스 절약\n- 뛰어난 확장성 및 모듈식 아키텍처

### 👎 단점 및 한계 (Cons)
- 성능 튜닝(청크 사이즈, 임베딩 모델 선택)에 상당한 노하우 필요`,
    stars: 18600,
    forks: 2100,
    issuesOpen: 312,
    latestVersion: 'v2.8.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.RAG_FRAMEWORK,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro', 'llama-3'],
    tags: ['rag', 'pipeline', 'production', 'modular'],
    verified: true,
    featured: true,
    installCmd: 'pip install haystack-ai',
    downloadsCount: 58000,
    benchmarks: [],
  },
  {
    slug: 'mem0ai/mem0',
    name: 'mem0',
    orgName: 'mem0ai',
    repoUrl: 'https://github.com/mem0ai/mem0',
    description: 'AI 에이전트를 위한 지능형 메모리 레이어. 개인화된 장기 기억 관리.',
    readmeExcerpt: `AI 에이전트를 위한 지능형 메모리 레이어. 개인화된 장기 기억 관리.

### 🎯 어디에 쓰나요? (Use Cases)
- **엔터프라이즈 지식 검색망**: 방대한 사내 문서나 외부 데이터를 LLM과 결합하여 환각 현상을 줄인 정확한 챗봇/분석기 생성.

### ✨ 무엇을 할 수 있나요? (Features)
- 문서 청킹, 임베딩, 벡터 스토어 통합 기능\n- 멀티모달 데이터 파이프라인 구성

### 👍 장점 (Pros)
- 복잡한 데이터 연결 작업을 추상화하여 개발 리소스 절약\n- 뛰어난 확장성 및 모듈식 아키텍처

### 👎 단점 및 한계 (Cons)
- 성능 튜닝(청크 사이즈, 임베딩 모델 선택)에 상당한 노하우 필요`,
    stars: 24800,
    forks: 2400,
    issuesOpen: 267,
    latestVersion: 'v0.1.29',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.RAG_FRAMEWORK,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro'],
    tags: ['memory', 'personalization', 'long-term', 'agents'],
    verified: true,
    featured: true,
    installCmd: 'pip install mem0ai',
    downloadsCount: 67000,
    benchmarks: [],
  },
  {
    slug: 'qdrant/qdrant',
    name: 'qdrant',
    orgName: 'qdrant',
    repoUrl: 'https://github.com/qdrant/qdrant',
    description: '고성능 벡터 유사도 검색 엔진. AI 에이전트 RAG의 핵심 벡터 스토어.',
    readmeExcerpt: `고성능 벡터 유사도 검색 엔진. AI 에이전트 RAG의 핵심 벡터 스토어.

### 🎯 어디에 쓰나요? (Use Cases)
- **엔터프라이즈 지식 검색망**: 방대한 사내 문서나 외부 데이터를 LLM과 결합하여 환각 현상을 줄인 정확한 챗봇/분석기 생성.

### ✨ 무엇을 할 수 있나요? (Features)
- 문서 청킹, 임베딩, 벡터 스토어 통합 기능\n- 멀티모달 데이터 파이프라인 구성

### 👍 장점 (Pros)
- 복잡한 데이터 연결 작업을 추상화하여 개발 리소스 절약\n- 뛰어난 확장성 및 모듈식 아키텍처

### 👎 단점 및 한계 (Cons)
- 성능 튜닝(청크 사이즈, 임베딩 모델 선택)에 상당한 노하우 필요`,
    stars: 21300,
    forks: 1480,
    issuesOpen: 245,
    latestVersion: 'v1.13.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['rust', 'python'],
    category: HarnessCategory.RAG_FRAMEWORK,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'text-embedding-3-large'],
    tags: ['vector-db', 'similarity-search', 'rust', 'embeddings'],
    verified: true,
    featured: false,
    installCmd: 'pip install qdrant-client',
    downloadsCount: 89000,
    benchmarks: [],
  },

  // ===== RESEARCH_AGENT (추가) =====
  {
    slug: 'noahshinn/reflexion',
    name: 'Reflexion',
    orgName: 'noahshinn',
    repoUrl: 'https://github.com/noahshinn/reflexion',
    description: '언어적 강화학습으로 자기 성찰하는 에이전트. 실패에서 배우는 루프 구조.',
    readmeExcerpt: `언어적 강화학습으로 자기 성찰하는 에이전트. 실패에서 배우는 루프 구조.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 언어적 강화학습으로 자기 성찰하는 에이전트. 실패에서 배우는 루프 구조.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 2400,
    forks: 310,
    issuesOpen: 28,
    latestVersion: 'v1.0.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.RESEARCH_AGENT,
    modelCompat: ['gpt-4o', 'claude-opus-4-7'],
    tags: ['reflexion', 'self-reflection', 'reinforcement', 'reasoning'],
    verified: true,
    featured: false,
    installCmd: 'git clone https://github.com/noahshinn/reflexion',
    downloadsCount: 3200,
    benchmarks: [],
  },
  {
    slug: 'MineDojo/Voyager',
    name: 'Voyager',
    orgName: 'MineDojo',
    repoUrl: 'https://github.com/MineDojo/Voyager',
    description: 'Minecraft 환경에서 지식을 자동 습득하는 LLM 기반 평생학습 에이전트.',
    readmeExcerpt: `Minecraft 환경에서 지식을 자동 습득하는 LLM 기반 평생학습 에이전트.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- Minecraft 환경에서 지식을 자동 습득하는 LLM 기반 평생학습 에이전트.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 5600,
    forks: 620,
    issuesOpen: 74,
    latestVersion: 'v1.0.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'javascript'],
    category: HarnessCategory.RESEARCH_AGENT,
    modelCompat: ['gpt-4o'],
    tags: ['minecraft', 'lifelong-learning', 'skill-library', 'autonomous'],
    verified: true,
    featured: false,
    installCmd: 'pip install voyager',
    downloadsCount: 4100,
    benchmarks: [],
  },

  // ===== TOOL_USE (추가) =====
  {
    slug: 'pydantic/pydantic-ai',
    name: 'PydanticAI',
    orgName: 'pydantic',
    repoUrl: 'https://github.com/pydantic/pydantic-ai',
    description: '타입 안전 AI 에이전트 프레임워크. Pydantic 기반 구조화 출력·의존성 주입.',
    readmeExcerpt: `타입 안전 AI 에이전트 프레임워크. Pydantic 기반 구조화 출력·의존성 주입.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 타입 안전 AI 에이전트 프레임워크. Pydantic 기반 구조화 출력·의존성 주입.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 8900,
    forks: 680,
    issuesOpen: 156,
    latestVersion: 'v0.0.36',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro', 'llama-3'],
    tags: ['pydantic', 'type-safe', 'structured-output', 'dependency-injection'],
    verified: true,
    featured: true,
    installCmd: 'pip install pydantic-ai',
    downloadsCount: 43000,
    benchmarks: [],
  },
  {
    slug: 'openai/swarm',
    name: 'Swarm',
    orgName: 'openai',
    repoUrl: 'https://github.com/openai/swarm',
    description: 'OpenAI 공식 경량 멀티에이전트 오케스트레이션 실험 프레임워크.',
    readmeExcerpt: `OpenAI 공식 경량 멀티에이전트 오케스트레이션 실험 프레임워크.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- OpenAI 공식 경량 멀티에이전트 오케스트레이션 실험 프레임워크.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 18200,
    forks: 1800,
    issuesOpen: 89,
    latestVersion: 'v0.1.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['gpt-4o', 'gpt-4o-mini'],
    tags: ['openai', 'handoff', 'orchestration', 'lightweight'],
    verified: true,
    featured: false,
    installCmd: 'pip install git+https://github.com/openai/swarm.git',
    downloadsCount: 29000,
    benchmarks: [],
  },

  // ===== MULTI_AGENT (추가) =====
  {
    slug: 'camel-ai/camel',
    name: 'CAMEL',
    orgName: 'camel-ai',
    repoUrl: 'https://github.com/camel-ai/camel',
    description: '역할극 기반 LLM 멀티에이전트 협업 프레임워크. 자율 협력 탐구.',
    readmeExcerpt: `역할극 기반 LLM 멀티에이전트 협업 프레임워크. 자율 협력 탐구.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 역할극 기반 LLM 멀티에이전트 협업 프레임워크. 자율 협력 탐구.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 6400,
    forks: 780,
    issuesOpen: 123,
    latestVersion: 'v0.2.16',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro'],
    tags: ['role-playing', 'cooperation', 'society', 'autonomous'],
    verified: true,
    featured: false,
    installCmd: 'pip install camel-ai',
    downloadsCount: 18000,
    benchmarks: [],
  },
  {
    slug: 'agno-agi/agno',
    name: 'Agno',
    orgName: 'agno-agi',
    repoUrl: 'https://github.com/agno-agi/agno',
    description: '멀티모달 에이전트 구축을 위한 고성능 프레임워크. 메모리·지식·도구 내장.',
    readmeExcerpt: `멀티모달 에이전트 구축을 위한 고성능 프레임워크. 메모리·지식·도구 내장.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 멀티모달 에이전트 구축을 위한 고성능 프레임워크. 메모리·지식·도구 내장.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 17400,
    forks: 1650,
    issuesOpen: 198,
    latestVersion: 'v1.2.4',
    license: 'MPL-2.0',
    licenseTier: LicenseTier.YELLOW,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro', 'llama-3'],
    tags: ['multimodal', 'memory', 'knowledge-base', 'tools'],
    verified: true,
    featured: true,
    installCmd: 'pip install agno',
    downloadsCount: 52000,
    benchmarks: [],
  },
  {
    slug: 'microsoft/TaskWeaver',
    name: 'TaskWeaver',
    orgName: 'microsoft',
    repoUrl: 'https://github.com/microsoft/TaskWeaver',
    description: '데이터 분석 중심 LLM 에이전트 프레임워크. 코드 스니펫을 실행 가능한 플러그인으로.',
    readmeExcerpt: `데이터 분석 중심 LLM 에이전트 프레임워크. 코드 스니펫을 실행 가능한 플러그인으로.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 데이터 분석 중심 LLM 에이전트 프레임워크. 코드 스니펫을 실행 가능한 플러그인으로.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 5200,
    forks: 620,
    issuesOpen: 87,
    latestVersion: 'v0.3.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['data-analytics', 'code-execution', 'plugins', 'microsoft'],
    verified: true,
    featured: false,
    installCmd: 'pip install taskweaver',
    downloadsCount: 11000,
    benchmarks: [],
  },

  // ===== BROWSER_AGENT (추가) =====
  {
    slug: 'browser-use/browser-use',
    name: 'browser-use',
    orgName: 'browser-use',
    repoUrl: 'https://github.com/browser-use/browser-use',
    description: 'AI 에이전트가 웹 브라우저를 직접 제어하는 라이브러리. 가장 빠른 성장세.',
    readmeExcerpt: `AI 에이전트가 웹 브라우저를 직접 제어하는 라이브러리. 가장 빠른 성장세.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- AI 에이전트가 웹 브라우저를 직접 제어하는 라이브러리. 가장 빠른 성장세.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 52000,
    forks: 5600,
    issuesOpen: 420,
    latestVersion: 'v0.1.45',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.BROWSER_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro'],
    tags: ['browser-automation', 'web-agent', 'playwright', 'vision'],
    verified: true,
    featured: true,
    installCmd: 'pip install browser-use',
    downloadsCount: 187000,
    benchmarks: [],
  },
  {
    slug: 'browserbase/stagehand',
    name: 'Stagehand',
    orgName: 'browserbase',
    repoUrl: 'https://github.com/browserbase/stagehand',
    description: 'AI 기반 웹 자동화 SDK. act·extract·observe로 브라우저를 자연어로 제어.',
    readmeExcerpt: `AI 기반 웹 자동화 SDK. act·extract·observe로 브라우저를 자연어로 제어.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- AI 기반 웹 자동화 SDK. act·extract·observe로 브라우저를 자연어로 제어.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 7300,
    forks: 490,
    issuesOpen: 64,
    latestVersion: 'v1.12.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['typescript'],
    category: HarnessCategory.BROWSER_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['browser', 'natural-language', 'typescript', 'extraction'],
    verified: true,
    featured: false,
    installCmd: 'npm install @browserbasehq/stagehand',
    downloadsCount: 24000,
    benchmarks: [],
  },

  // ===== TRENDING / HIGH-STAR (2025-26) =====
  {
    slug: 'ollama/ollama',
    name: 'Ollama',
    orgName: 'ollama',
    repoUrl: 'https://github.com/ollama/ollama',
    description: '로컬에서 LLM을 한 줄 명령으로 실행. Llama·Mistral·Gemma 등 지원. GitHub 9만 스타.',
    readmeExcerpt: `로컬에서 LLM을 한 줄 명령으로 실행. Llama·Mistral·Gemma 등 지원. GitHub 9만 스타.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 로컬에서 LLM을 한 줄 명령으로 실행. Llama·Mistral·Gemma 등 지원. GitHub 9만 스타.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 95000,
    forks: 7800,
    issuesOpen: 1240,
    latestVersion: 'v0.5.7',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['go'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['llama-3', 'mistral', 'gemma', 'phi-3', 'qwen'],
    tags: ['local-llm', 'inference', 'self-hosted', 'cli'],
    verified: true,
    featured: true,
    installCmd: 'curl -fsSL https://ollama.com/install.sh | sh',
    downloadsCount: 520000,
    benchmarks: [],
  },
  {
    slug: 'langgenius/dify',
    name: 'Dify',
    orgName: 'langgenius',
    repoUrl: 'https://github.com/langgenius/dify',
    description: 'LLM 앱·RAG·에이전트 워크플로우를 노코드로 구축하는 오픈소스 플랫폼. 7만 스타.',
    readmeExcerpt: `LLM 앱·RAG·에이전트 워크플로우를 노코드로 구축하는 오픈소스 플랫폼. 7만 스타.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- LLM 앱·RAG·에이전트 워크플로우를 노코드로 구축하는 오픈소스 플랫폼. 7만 스타.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 78000,
    forks: 11200,
    issuesOpen: 980,
    latestVersion: 'v0.15.3',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python', 'typescript'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro', 'llama-3'],
    tags: ['no-code', 'workflow', 'rag', 'platform'],
    verified: true,
    featured: true,
    installCmd: 'docker compose up -d',
    downloadsCount: 340000,
    benchmarks: [],
  },
  {
    slug: 'microsoft/markitdown',
    name: 'MarkItDown',
    orgName: 'microsoft',
    repoUrl: 'https://github.com/microsoft/markitdown',
    description: 'PDF·Word·Excel·이미지 등 모든 파일을 LLM 친화적 Markdown으로 변환. 4만 스타.',
    readmeExcerpt: `PDF·Word·Excel·이미지 등 모든 파일을 LLM 친화적 Markdown으로 변환. 4만 스타.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- PDF·Word·Excel·이미지 등 모든 파일을 LLM 친화적 Markdown으로 변환. 4만 스타.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 43000,
    forks: 2100,
    issuesOpen: 178,
    latestVersion: 'v0.1.1',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'gemini-pro'],
    tags: ['document-parsing', 'markdown', 'pdf', 'preprocessing'],
    verified: true,
    featured: true,
    installCmd: 'pip install markitdown',
    downloadsCount: 195000,
    benchmarks: [],
  },
  {
    slug: 'unclecode/crawl4ai',
    name: 'Crawl4AI',
    orgName: 'unclecode',
    repoUrl: 'https://github.com/unclecode/crawl4ai',
    description: 'LLM·AI 에이전트를 위한 고성능 웹 크롤러. 비동기·스마트 추출. 3.5만 스타.',
    readmeExcerpt: `LLM·AI 에이전트를 위한 고성능 웹 크롤러. 비동기·스마트 추출. 3.5만 스타.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- LLM·AI 에이전트를 위한 고성능 웹 크롤러. 비동기·스마트 추출. 3.5만 스타.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 38000,
    forks: 2900,
    issuesOpen: 312,
    latestVersion: 'v0.4.247',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.TOOL_USE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['web-crawling', 'scraping', 'async', 'extraction'],
    verified: true,
    featured: true,
    installCmd: 'pip install crawl4ai',
    downloadsCount: 167000,
    benchmarks: [],
  },
  {
    slug: 'huggingface/smolagents',
    name: 'smolagents',
    orgName: 'huggingface',
    repoUrl: 'https://github.com/huggingface/smolagents',
    description: 'HuggingFace 공식 경량 에이전트 프레임워크. CodeAgent·ToolCallingAgent 내장.',
    readmeExcerpt: `HuggingFace 공식 경량 에이전트 프레임워크. CodeAgent·ToolCallingAgent 내장.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- HuggingFace 공식 경량 에이전트 프레임워크. CodeAgent·ToolCallingAgent 내장.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 16500,
    forks: 1600,
    issuesOpen: 234,
    latestVersion: 'v1.10.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6', 'llama-3', 'qwen'],
    tags: ['huggingface', 'lightweight', 'code-agent', 'tools'],
    verified: true,
    featured: true,
    installCmd: 'pip install smolagents',
    downloadsCount: 78000,
    benchmarks: [],
  },
  {
    slug: 'openai/openai-agents-python',
    name: 'OpenAI Agents SDK',
    orgName: 'openai',
    repoUrl: 'https://github.com/openai/openai-agents-python',
    description: 'OpenAI 공식 에이전트 SDK. 핸드오프·가드레일·트레이싱 내장. 2025년 출시.',
    readmeExcerpt: `OpenAI 공식 에이전트 SDK. 핸드오프·가드레일·트레이싱 내장. 2025년 출시.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- OpenAI 공식 에이전트 SDK. 핸드오프·가드레일·트레이싱 내장. 2025년 출시.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 6800,
    forks: 720,
    issuesOpen: 145,
    latestVersion: 'v0.0.13',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'gpt-4o-mini', 'o3'],
    tags: ['openai', 'handoff', 'guardrails', 'tracing'],
    verified: true,
    featured: true,
    installCmd: 'pip install openai-agents',
    downloadsCount: 52000,
    benchmarks: [],
  },
  {
    slug: 'google/adk-python',
    name: 'Google ADK',
    orgName: 'google',
    repoUrl: 'https://github.com/google/adk-python',
    description: 'Google 공식 Agent Development Kit. Gemini 기반 멀티에이전트 오케스트레이션.',
    readmeExcerpt: `Google 공식 Agent Development Kit. Gemini 기반 멀티에이전트 오케스트레이션.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- Google 공식 Agent Development Kit. Gemini 기반 멀티에이전트 오케스트레이션.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 9200,
    forks: 890,
    issuesOpen: 267,
    latestVersion: 'v1.1.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gemini-pro', 'gemini-2.0-flash', 'claude-sonnet-4-6'],
    tags: ['google', 'gemini', 'adk', 'orchestration'],
    verified: true,
    featured: true,
    installCmd: 'pip install google-adk',
    downloadsCount: 41000,
    benchmarks: [],
  },
  {
    slug: 'microsoft/OmniParser',
    name: 'OmniParser',
    orgName: 'microsoft',
    repoUrl: 'https://github.com/microsoft/OmniParser',
    description: 'GUI 화면을 파싱해 UI 요소를 감지하는 에이전트용 스크린 파서. 1만 스타.',
    readmeExcerpt: `GUI 화면을 파싱해 UI 요소를 감지하는 에이전트용 스크린 파서. 1만 스타.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- GUI 화면을 파싱해 UI 요소를 감지하는 에이전트용 스크린 파서. 1만 스타.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 11800,
    forks: 890,
    issuesOpen: 143,
    latestVersion: 'v0.2.0',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.BROWSER_AGENT,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['gui', 'screen-parsing', 'ui-detection', 'vision'],
    verified: true,
    featured: false,
    installCmd: 'pip install omniparser',
    downloadsCount: 23000,
    benchmarks: [],
  },
  {
    slug: 'Skyvern-AI/skyvern',
    name: 'Skyvern',
    orgName: 'Skyvern-AI',
    repoUrl: 'https://github.com/Skyvern-AI/skyvern',
    description: '브라우저 워크플로우를 LLM+비전으로 자동화. XPath 없이 실제 화면 인식.',
    readmeExcerpt: `브라우저 워크플로우를 LLM+비전으로 자동화. XPath 없이 실제 화면 인식.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 브라우저 워크플로우를 LLM+비전으로 자동화. XPath 없이 실제 화면 인식.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 8100,
    forks: 620,
    issuesOpen: 98,
    latestVersion: 'v0.1.51',
    license: 'AGPL-3.0',
    licenseTier: LicenseTier.YELLOW,
    languages: ['python'],
    category: HarnessCategory.BROWSER_AGENT,
    modelCompat: ['gpt-4o', 'claude-opus-4-7'],
    tags: ['browser-automation', 'vision', 'no-xpath', 'workflow'],
    verified: true,
    featured: false,
    installCmd: 'pip install skyvern',
    downloadsCount: 18000,
    benchmarks: [],
  },
  {
    slug: 'vllm-project/vllm',
    name: 'vLLM',
    orgName: 'vllm-project',
    repoUrl: 'https://github.com/vllm-project/vllm',
    description: '고처리량 LLM 서빙 엔진. PagedAttention으로 기존 대비 24x 처리량. 3만 스타.',
    readmeExcerpt: `고처리량 LLM 서빙 엔진. PagedAttention으로 기존 대비 24x 처리량. 3만 스타.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 고처리량 LLM 서빙 엔진. PagedAttention으로 기존 대비 24x 처리량. 3만 스타.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 34000,
    forks: 5200,
    issuesOpen: 1840,
    latestVersion: 'v0.7.3',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.DATA_PIPELINE,
    modelCompat: ['llama-3', 'mistral', 'qwen', 'gemma', 'deepseek'],
    tags: ['inference', 'serving', 'pagedattention', 'throughput'],
    verified: true,
    featured: true,
    installCmd: 'pip install vllm',
    downloadsCount: 234000,
    benchmarks: [],
  },
  {
    slug: 'strands-agents/sdk-python',
    name: 'Strands Agents',
    orgName: 'strands-agents',
    repoUrl: 'https://github.com/strands-agents/sdk-python',
    description: 'AWS 공식 에이전트 SDK. 모델·도구·메모리를 루프로 연결하는 경량 프레임워크. 2025 출시.',
    readmeExcerpt: `AWS 공식 에이전트 SDK. 모델·도구·메모리를 루프로 연결하는 경량 프레임워크. 2025 출시.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- AWS 공식 에이전트 SDK. 모델·도구·메모리를 루프로 연결하는 경량 프레임워크. 2025 출시.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 4200,
    forks: 380,
    issuesOpen: 89,
    latestVersion: 'v0.1.6',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['claude-sonnet-4-6', 'claude-opus-4-7', 'llama-3'],
    tags: ['aws', 'bedrock', 'tools', 'memory'],
    verified: true,
    featured: false,
    installCmd: 'pip install strands-agents',
    downloadsCount: 19000,
    benchmarks: [],
  },
  {
    slug: 'frdel/agent-zero',
    name: 'Agent Zero',
    orgName: 'frdel',
    repoUrl: 'https://github.com/frdel/agent-zero',
    description: '유기적으로 성장하는 범용 AI 에이전트 프레임워크. 도구·서브에이전트 자율 생성.',
    readmeExcerpt: `유기적으로 성장하는 범용 AI 에이전트 프레임워크. 도구·서브에이전트 자율 생성.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- 유기적으로 성장하는 범용 AI 에이전트 프레임워크. 도구·서브에이전트 자율 생성.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 9400,
    forks: 1100,
    issuesOpen: 156,
    latestVersion: 'v0.8.5',
    license: 'MIT',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.MULTI_AGENT,
    modelCompat: ['gpt-4o', 'claude-opus-4-7', 'gemini-pro'],
    tags: ['general-purpose', 'self-growing', 'sub-agents', 'tools'],
    verified: true,
    featured: false,
    installCmd: 'git clone https://github.com/frdel/agent-zero && pip install -r requirements.txt',
    downloadsCount: 31000,
    benchmarks: [],
  },

  // ===== DATA_PIPELINE (추가) =====
  {
    slug: 'zenml-io/zenml',
    name: 'ZenML',
    orgName: 'zenml-io',
    repoUrl: 'https://github.com/zenml-io/zenml',
    description: 'ML/AI 파이프라인을 코드로 정의하는 MLOps 프레임워크. 클라우드 무관.',
    readmeExcerpt: `ML/AI 파이프라인을 코드로 정의하는 MLOps 프레임워크. 클라우드 무관.

### 🎯 어디에 쓰나요? (Use Cases)
- 이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.

### ✨ 무엇을 할 수 있나요? (Features)
- ML/AI 파이프라인을 코드로 정의하는 MLOps 프레임워크. 클라우드 무관.\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\n- 활성화된 커뮤니티 및 릴리즈 업데이트

### 👍 장점 (Pros)
- 오픈소스 생태계의 풍부한 레퍼런스\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)

### 👎 단점 및 한계 (Cons)
- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.`,
    stars: 4100,
    forks: 470,
    issuesOpen: 148,
    latestVersion: 'v0.70.0',
    license: 'Apache-2.0',
    licenseTier: LicenseTier.GREEN,
    languages: ['python'],
    category: HarnessCategory.DATA_PIPELINE,
    modelCompat: ['gpt-4o', 'claude-sonnet-4-6'],
    tags: ['mlops', 'pipeline', 'reproducibility', 'cloud-agnostic'],
    verified: true,
    featured: false,
    installCmd: 'pip install zenml',
    downloadsCount: 28000,
    benchmarks: [],
  },
];

async function main() {
  console.log('Resetting HarnessHub data...');
  // Order matters due to FK cascades.
  await prisma.collectionItem.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.harnessBookmark.deleteMany();
  await prisma.review.deleteMany();
  await prisma.benchmark.deleteMany();
  await prisma.harness.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding curator user...');
  const curator = await prisma.user.create({
    data: {
      email: 'curator@harnesshub.dev',
      username: 'harnesshub-curator',
      name: 'HarnessHub Curator',
      role: UserRole.CURATOR,
    },
  });

  console.log(`Seeding ${harnesses.length} harnesses with benchmarks...`);
  const createdHarnesses: { id: string; slug: string }[] = [];
  for (const h of harnesses) {
    const created = await prisma.harness.create({
      data: {
        slug: h.slug,
        name: h.name,
        orgName: h.orgName,
        repoUrl: h.repoUrl,
        description: h.description,
        readmeExcerpt: h.readmeExcerpt,
        stars: h.stars,
        forks: h.forks,
        issuesOpen: h.issuesOpen,
        latestVersion: h.latestVersion,
        lastUpdated: new Date(),
        license: h.license,
        licenseTier: h.licenseTier,
        languages: h.languages,
        category: h.category,
        modelCompat: h.modelCompat,
        tags: h.tags,
        verified: h.verified,
        featured: h.featured,
        installCmd: h.installCmd,
        downloadsCount: h.downloadsCount,
        benchmarks: h.benchmarks.length
          ? { create: h.benchmarks }
          : undefined,
      },
      select: { id: true, slug: true },
    });
    createdHarnesses.push(created);
    console.log(`  - seeded ${created.slug}`);
  }

  console.log('Seeding collections...');

  type SeedCollection = {
    slug: string;
    title: string;
    description: string;
    harnessSlugs: string[];
  };

  const collections: SeedCollection[] = [
    {
      slug: 'top-coding-agents-2026',
      title: 'Top Coding Agents (2026)',
      description:
        '실제 GitHub 이슈를 자동으로 풀어내는 검증된 코딩 에이전트 모음',
      harnessSlugs: [
        'princeton-nlp/SWE-agent',
        'Aider-AI/aider',
        'cline/cline',
        'All-Hands-AI/OpenHands',
      ],
    },
    {
      slug: 'rag-starter-pack',
      title: 'RAG Starter Pack',
      description:
        '검색 증강 생성(RAG) 파이프라인 구축에 필요한 핵심 프레임워크와 벡터 DB 모음',
      harnessSlugs: [
        'run-llama/llama_index',
        'langchain-ai/langchain',
        'chroma-core/chroma',
        'milvus-io/pymilvus',
        'weaviate/weaviate-python-client',
      ],
    },
    {
      slug: 'multi-agent-frameworks',
      title: 'Multi-Agent Frameworks',
      description:
        '여러 AI 에이전트가 협력해 복잡한 태스크를 처리하는 프레임워크 큐레이션',
      harnessSlugs: [
        'microsoft/autogen',
        'joaomdmoura/crewAI',
        'langchain-ai/langgraph',
        'reworkd/AgentGPT',
        'microsoft/JARVIS',
      ],
    },
    {
      slug: 'eval-and-benchmark-tools',
      title: 'Eval & Benchmark Tools',
      description: 'LLM 성능을 측정하고 비교하는 평가 프레임워크 모음',
      harnessSlugs: [
        'openai/evals',
        'EleutherAI/lm-evaluation-harness',
        'microsoft/promptflow',
        'confident-ai/deepeval',
        'truera/trulens',
      ],
    },
    {
      slug: 'autonomous-research-agents',
      title: 'Autonomous Research Agents',
      description:
        '인터넷 검색과 자율적 계획으로 리서치 태스크를 수행하는 에이전트들',
      harnessSlugs: [
        'assafelovic/gpt-researcher',
        'Significant-Gravitas/AutoGPT',
        'gpt-engineer-org/gpt-engineer',
        'yoheinakajima/babyagi',
      ],
    },
    {
      slug: 'browser-and-web-automation',
      title: 'Browser & Web Automation',
      description:
        '웹 브라우저를 자동화하거나 UI를 조작하는 에이전트와 도구 모음',
      harnessSlugs: [
        'microsoft/playwright',
        'lavague-ai/LaVague',
        'web-infra-dev/midscene',
      ],
    },
  ];

  for (const col of collections) {
    const itemIds = createdHarnesses
      .filter((h) => col.harnessSlugs.includes(h.slug))
      .map((h) => ({ harnessId: h.id }));

    if (itemIds.length !== col.harnessSlugs.length) {
      const found = createdHarnesses
        .filter((h) => col.harnessSlugs.includes(h.slug))
        .map((h) => h.slug);
      const missing = col.harnessSlugs.filter((s) => !found.includes(s));
      console.warn(
        `  ! collection "${col.slug}" missing harnesses: ${missing.join(', ')}`,
      );
    }

    await prisma.collection.create({
      data: {
        slug: col.slug,
        title: col.title,
        description: col.description,
        curatorId: curator.id,
        isPublic: true,
        items: { create: itemIds },
      },
    });
    console.log(
      `  - seeded collection ${col.slug} (${itemIds.length} items)`,
    );
  }

  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
