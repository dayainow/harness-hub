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
    readmeExcerpt:
      'SWE-agent는 Claude 또는 GPT-4를 GitHub 이슈를 푸는 자율 소프트웨어 엔지니어로 변환합니다.',
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
    readmeExcerpt:
      'aider는 터미널에서 Claude 또는 GPT와 함께 실제 코드베이스를 편집하는 AI 페어 프로그래머입니다.',
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
    readmeExcerpt:
      'Cline은 VS Code 확장으로서 Claude를 통해 파일 생성·편집, 터미널 명령 실행, 브라우저 자동화를 수행합니다.',
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
    readmeExcerpt:
      'OpenHands는 Docker 기반 샌드박스에서 AI가 코드를 작성·실행·디버깅하는 플랫폼입니다.',
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
    readmeExcerpt:
      'goose는 MCP(Model Context Protocol)를 통해 다양한 도구와 통합되는 로컬 AI 에이전트입니다.',
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
    readmeExcerpt:
      'AutoGen은 여러 AI 에이전트가 서로 대화하며 복잡한 문제를 협력 해결하는 프레임워크입니다.',
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
    readmeExcerpt:
      'LangGraph는 복잡한 에이전트 워크플로우를 방향성 비순환 그래프(DAG)로 정의하는 프레임워크입니다.',
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
    readmeExcerpt:
      'LiteLLM은 Claude, GPT, Gemini, Llama 등 100개 이상의 LLM을 동일한 인터페이스로 호출하는 게이트웨이입니다.',
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
    readmeExcerpt:
      'Continue는 IDE 내에서 작동하는 오픈소스 AI 코딩 어시스턴트로 자체 모델·룰·도구를 커스텀합니다.',
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
    readmeExcerpt:
      'Cody는 전체 코드베이스를 컨텍스트로 활용해 정확한 코드 생성·리팩토링·설명을 제공합니다.',
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
    readmeExcerpt:
      'smol developer는 단일 prompt로 전체 애플리케이션을 부트스트랩하는 라이트웨이트 코딩 에이전트입니다.',
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
    readmeExcerpt:
      'Tabby는 GPU 가속 셀프 호스팅이 가능한 오픈소스 AI 코드 컴플리션 서버입니다.',
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
    readmeExcerpt:
      'gpt-engineer는 단일 prompt로부터 멀티 파일 코드베이스를 자율 생성·실행하는 에이전트입니다.',
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
    readmeExcerpt:
      'evals는 OpenAI가 공개한 LLM 평가 도구로 커스텀 eval과 모델 비교를 표준화합니다.',
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
    readmeExcerpt:
      'lm-evaluation-harness는 HuggingFace Open LLM Leaderboard의 백본인 학술 표준 평가 도구입니다.',
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
    readmeExcerpt:
      'PromptFlow는 LLM 워크플로우 개발·평가·배포를 위한 엔드투엔드 Azure 통합 프레임워크입니다.',
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
    readmeExcerpt:
      'DeepEval은 LLM 출력에 대한 14+ 평가 메트릭과 pytest 통합을 제공하는 테스트 프레임워크입니다.',
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
    readmeExcerpt:
      'TruLens는 LLM 앱 평가와 트레이싱을 통합한 오픈소스 옵저버빌리티 도구입니다.',
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
    readmeExcerpt:
      'LlamaIndex는 RAG 애플리케이션 구축을 위한 데이터 프레임워크로 200+ 데이터 커넥터를 제공합니다.',
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
    readmeExcerpt:
      'LangChain은 LLM 앱 개발의 사실상 표준 프레임워크로 광범위한 통합과 추상화를 제공합니다.',
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
    readmeExcerpt:
      'Chroma는 가볍고 임베디드 가능한 AI 네이티브 벡터 데이터베이스로 RAG의 사실상 표준입니다.',
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
    readmeExcerpt:
      'PyMilvus는 분산 벡터 데이터베이스 Milvus를 위한 Python 클라이언트 라이브러리입니다.',
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
    readmeExcerpt:
      'Weaviate Python Client는 모듈식 벡터 데이터베이스 Weaviate와 통신하는 공식 SDK입니다.',
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
    readmeExcerpt:
      'GPT Researcher는 주제에 대해 자율적으로 웹을 탐색하고 인용 기반 보고서를 생성하는 에이전트입니다.',
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
    readmeExcerpt:
      'AutoGPT는 모두가 AI를 활용해 자율 에이전트를 만들 수 있게 하는 오픈소스 플랫폼입니다.',
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
    readmeExcerpt:
      'BabyAGI는 작업 생성·우선순위·실행을 반복하는 자율 AI의 미니멀 구현체로 시초적 작품입니다.',
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
    readmeExcerpt:
      'XAgent는 외부 계획자·내부 실행자·반성 루프로 구성된 자율 LLM 에이전트입니다.',
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
    readmeExcerpt:
      'Semantic Kernel은 LLM과 전통적 프로그래밍 언어를 통합하는 Microsoft의 오케스트레이션 SDK입니다.',
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
    readmeExcerpt:
      'Instructor는 Pydantic을 사용해 LLM 출력에 타입 안전한 구조를 부여하는 라이브러리입니다.',
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
    readmeExcerpt:
      'Marvin은 Python 함수 시그니처에서 LLM 동작을 자동 생성하는 라이트웨이트 AI 툴킷입니다.',
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
    readmeExcerpt:
      'Guidance는 토큰 레벨에서 LLM 생성을 제약해 정형 출력을 강제하는 프로그래밍 모델입니다.',
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
    readmeExcerpt:
      'CrewAI는 역할·목표·도구를 정의해 자율 에이전트 팀을 구성하는 멀티 에이전트 프레임워크입니다.',
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
    readmeExcerpt:
      'JARVIS는 LLM을 컨트롤러로 사용해 HuggingFace의 전문 모델들을 협업 호출하는 시스템입니다.',
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
    readmeExcerpt:
      'AgentOps는 LLM 에이전트의 비용·지연·트레이스를 추적하는 옵저버빌리티 플랫폼입니다.',
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
    readmeExcerpt:
      'AgentGPT는 브라우저에서 목표만 입력하면 자율 AI 에이전트가 작업을 분해·실행하는 플랫폼입니다.',
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
    readmeExcerpt:
      'Playwright는 Chromium·Firefox·WebKit을 자동화하는 Microsoft의 크로스 브라우저 테스트 프레임워크입니다.',
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
    readmeExcerpt:
      'LaVague는 자연어로 웹 자동화 워크플로우를 작성·실행할 수 있는 오픈소스 LAM 프레임워크입니다.',
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
    readmeExcerpt:
      'Midscene.js는 멀티모달 LLM의 비전 능력으로 UI 자동화를 수행하는 JavaScript 라이브러리입니다.',
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
    readmeExcerpt:
      'Prefect는 Python 기반의 워크플로우 오케스트레이션 엔진으로 ML/AI 파이프라인을 견고하게 운영합니다.',
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
    readmeExcerpt:
      'Dagster는 데이터 자산을 일급 시민으로 다루는 ML/AI 파이프라인 오케스트레이션 플랫폼입니다.',
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
