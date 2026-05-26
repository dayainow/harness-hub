const fs = require('fs');

const seedPath = './seed.ts';
let content = fs.readFileSync(seedPath, 'utf8');

const TOP_HARNESSES = {
  'princeton-nlp/SWE-agent': `SWE-agent는 소프트웨어 엔지니어링 역량을 갖춘 자율 AI 에이전트입니다. 주어진 GitHub 이슈나 로컬 작업 지시를 스스로 파악하고, 코드를 분석한 뒤 필요한 수정 사항을 직접 작성합니다.

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

  'Aider-AI/aider': `aider는 터미널에 상주하며 개발자와 함께 코딩하는 AI 페어 프로그래머입니다. IDE를 벗어나지 않고 터미널에서 즉각적으로 코드를 편집하고 Git 커밋까지 자동화해 줍니다.

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

  'cline/cline': `Cline은 VS Code 환경 내에서 직접 동작하는 강력한 자율 코딩 확장 프로그램입니다. 터미널 명령어를 실행하고, 브라우저를 띄워 확인하고, 파일을 생성 및 수정하는 모든 과정을 편집기 안에서 수행합니다.

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

  'assafelovic/gpt-researcher': `GPT Researcher는 주어진 주제에 대해 인간보다 수십 배 빠르게 심층 리서치를 수행하는 전문 AI 에이전트입니다. 단순히 검색 결과를 요약하는 것을 넘어, 종합적인 보고서를 인용구(Citation)와 함께 작성합니다.

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

  'run-llama/llama_index': `LlamaIndex는 다양한 형태의 외부 데이터(PDF, Notion, SQL, API 등)를 LLM과 매끄럽게 연결해 주는 데이터 프레임워크이자 RAG(Retrieval-Augmented Generation) 구축의 사실상 표준 도구입니다.

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

  'langchain-ai/langchain': `LangChain은 LLM을 활용한 애플리케이션 개발을 위한 가장 포괄적이고 인기 있는 프레임워크입니다. 텍스트 생성부터 외부 툴 연동, 에이전트 워크플로우까지 AI 개발의 모든 요소를 블록처럼 조립할 수 있습니다.

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

  'microsoft/autogen': `AutoGen은 마이크로소프트가 개발한 오픈소스 멀티 에이전트 대화 프레임워크입니다. 하나의 거대한 AI가 모든 것을 처리하는 대신, 서로 다른 역할을 가진 여러 AI 에이전트들이 서로 대화하고 협력하며 문제를 해결하도록 설계되었습니다.

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

  'chroma-core/chroma': `Chroma는 AI 애플리케이션 구축을 위해 특별히 설계된 오픈소스 벡터 데이터베이스(Vector DB)입니다. 설치와 사용이 매우 간단하여 RAG 생태계에서 가장 널리 사용되는 기본 스토리지 엔진 중 하나입니다.

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
};

function getGenericDescription(harness) {
  const isKo = true; // For Korean localized generation

  let useCaseText = "이 도구의 목적에 부합하는 다양한 개발 및 자동화 환경에 활용할 수 있습니다.";
  let featuresText = "- " + harness.description + "\\n- 공식 리포지토리의 가이드에 따라 다양한 환경 설정 지원\\n- 활성화된 커뮤니티 및 릴리즈 업데이트";
  let prosText = "- 오픈소스 생태계의 풍부한 레퍼런스\\n- 지속적으로 유지보수되는 신뢰성 (Stars/Forks 지표 참고)";
  let consText = "- 최신 버전의 브레이킹 체인지에 주의해야 할 수 있습니다.\\n- 특정 환경에서는 추가적인 세팅이 요구될 수 있습니다.";

  if (harness.category === 'CODING_AGENT') {
    useCaseText = "**코드베이스 분석 및 자동화**: 복잡한 버그 수정이나 보일러플레이트 코드 작성 시 시간을 획기적으로 단축합니다.";
    featuresText = "- 자율적인 코드 생성 및 파일 시스템 조작\\n- 다양한 프로그래밍 언어 지원 및 IDE 통합";
    prosText = "- 개발자 생산성 극대화 및 단순 반복 작업 제거\\n- 최신 LLM 아키텍처에 대응하는 유연한 인터페이스";
    consText = "- 코드베이스가 너무 방대할 경우 컨텍스트 한계 발생 가능성\\n- 자율 실행 코드의 보안 및 무결성 검토 필수";
  } else if (harness.category === 'RAG_FRAMEWORK') {
    useCaseText = "**엔터프라이즈 지식 검색망**: 방대한 사내 문서나 외부 데이터를 LLM과 결합하여 환각 현상을 줄인 정확한 챗봇/분석기 생성.";
    featuresText = "- 문서 청킹, 임베딩, 벡터 스토어 통합 기능\\n- 멀티모달 데이터 파이프라인 구성";
    prosText = "- 복잡한 데이터 연결 작업을 추상화하여 개발 리소스 절약\\n- 뛰어난 확장성 및 모듈식 아키텍처";
    consText = "- 성능 튜닝(청크 사이즈, 임베딩 모델 선택)에 상당한 노하우 필요";
  } else if (harness.category === 'EVAL_HARNESS') {
    useCaseText = "**LLM 신뢰성 및 안전성 검증**: 자체 파인튜닝한 모델이나 RAG 시스템의 답변 퀄리티를 정량적으로 측정하고 벤치마킹합니다.";
    featuresText = "- 다양한 학술 및 실무 벤치마크 데이터셋 통합\\n- 일관되고 재현 가능한 평가 스크립트 제공";
    prosText = "- 객관적인 지표 기반의 모델 선택 및 업그레이드 의사결정 가능\\n- CI/CD 파이프라인 연동에 최적화";
    consText = "- 평가 자체에 소모되는 LLM API 비용 발생\\n- '정답'이 모호한 태스크에 대한 주관적 평가 한계";
  }

  return `${harness.description}

### 🎯 어디에 쓰나요? (Use Cases)
- ${useCaseText}

### ✨ 무엇을 할 수 있나요? (Features)
${featuresText}

### 👍 장점 (Pros)
${prosText}

### 👎 단점 및 한계 (Cons)
${consText}`;
}

// We'll use a regex replacement strategy for the readmeExcerpt fields.
let updatedContent = content;

// A regex that captures: slug: 'org/repo', ... readmeExcerpt: 'old_text',
// Since readmeExcerpt can span lines or be single/double quoted, we must be careful.
// A simpler way: we evaluate the array using an evil eval or construct a TS parser?
// Since it's typescript, eval won't work well without compiling.
// We will simply regex match each object block.

// We will split the file content by \`slug: '\` to process each block.
const blocks = updatedContent.split(/slug: /);

let finalContent = blocks[0]; // Header part

for (let i = 1; i < blocks.length; i++) {
  let block = blocks[i];
  // extract slug name
  const slugMatch = block.match(/^(['"])(.+?)\\1/);
  if (!slugMatch) {
    finalContent += 'slug: ' + block;
    continue;
  }
  const slug = slugMatch[2];
  
  // Also extract description to generate generic
  const descMatch = block.match(/description:\\s*(['"\`])(.*?)\\1/s);
  const catMatch = block.match(/category:\\s*HarnessCategory\\.(.+?),/);
  
  const harness = {
    description: descMatch ? descMatch[2].replace(/\\n/g, '').trim() : "AI 에이전트 도구",
    category: catMatch ? catMatch[1] : "OTHER"
  };

  let newReadme = TOP_HARNESSES[slug] || getGenericDescription(harness);
  
  // Escape backticks and internal variables in newReadme
  newReadme = newReadme.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  // Replace the readmeExcerpt field
  // The regex finds readmeExcerpt: '...', or "...", or `...`,
  block = block.replace(/readmeExcerpt:\s*(['"`])(.*?)\1,/s, `readmeExcerpt: \`${newReadme}\`,`);
  
  finalContent += 'slug: ' + block;
}

fs.writeFileSync(seedPath, finalContent, 'utf8');
console.log('Successfully enriched seed.ts');
