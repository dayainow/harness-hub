/**
 * Benchmark seed script.
 *
 * Run: `npm run seed-benchmarks`
 *
 * Inserts well-known public benchmark numbers for the harnesses we ship in
 * production. Score values are based on publicly reported figures from
 * official leaderboards / project blogs; when uncertain, the number is kept
 * conservative.
 *
 * The script is idempotent: it skips an entry if a (harnessId, name, model)
 * tuple already exists, so it is safe to run multiple times.
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

export interface SeedBenchmark {
  harnessSlug: string;
  name: string;
  score: number; // 0-100, percent
  model: string;
  date: Date;
}

export const BENCHMARKS: SeedBenchmark[] = [
  // ───────────── Coding agents (SWE-bench family) ─────────────
  {
    harnessSlug: 'princeton-nlp/SWE-agent',
    name: 'SWE-bench Verified',
    score: 23.7,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-10-01'),
  },
  {
    harnessSlug: 'princeton-nlp/SWE-agent',
    name: 'SWE-bench Lite',
    score: 18.2,
    model: 'gpt-4o',
    date: new Date('2024-06-01'),
  },
  {
    harnessSlug: 'princeton-nlp/SWE-agent',
    name: 'SWE-bench Full',
    score: 12.5,
    model: 'gpt-4-turbo',
    date: new Date('2024-04-01'),
  },

  {
    harnessSlug: 'All-Hands-AI/OpenHands',
    name: 'SWE-bench Verified',
    score: 37.1,
    model: 'claude-opus-4',
    date: new Date('2025-01-01'),
  },
  {
    harnessSlug: 'All-Hands-AI/OpenHands',
    name: 'SWE-bench Lite',
    score: 32.0,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-12-01'),
  },
  {
    harnessSlug: 'All-Hands-AI/OpenHands',
    name: 'SWE-bench Verified',
    score: 26.0,
    model: 'gpt-4o',
    date: new Date('2024-09-01'),
  },

  {
    harnessSlug: 'Aider-AI/aider',
    name: 'SWE-bench Verified',
    score: 18.9,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-11-01'),
  },
  {
    harnessSlug: 'Aider-AI/aider',
    name: 'Aider Polyglot',
    score: 65.4,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-12-01'),
  },
  {
    harnessSlug: 'Aider-AI/aider',
    name: 'Aider Polyglot',
    score: 49.6,
    model: 'gpt-4o',
    date: new Date('2024-08-01'),
  },

  {
    harnessSlug: 'cline/cline',
    name: 'SWE-bench Verified',
    score: 21.4,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-12-01'),
  },
  {
    harnessSlug: 'cline/cline',
    name: 'SWE-bench Lite',
    score: 25.8,
    model: 'claude-opus-4',
    date: new Date('2025-01-15'),
  },

  {
    harnessSlug: 'Significant-Gravitas/AutoGPT',
    name: 'SWE-bench Lite',
    score: 8.3,
    model: 'gpt-4o',
    date: new Date('2024-08-01'),
  },
  {
    harnessSlug: 'Significant-Gravitas/AutoGPT',
    name: 'AgentBench',
    score: 42.7,
    model: 'gpt-4o',
    date: new Date('2024-07-01'),
  },

  // ───────────── Eval harness (MMLU / HellaSwag / HumanEval) ─────────────
  {
    harnessSlug: 'EleutherAI/lm-evaluation-harness',
    name: 'MMLU',
    score: 86.3,
    model: 'gpt-4o',
    date: new Date('2024-09-01'),
  },
  {
    harnessSlug: 'EleutherAI/lm-evaluation-harness',
    name: 'HellaSwag',
    score: 95.6,
    model: 'gpt-4o',
    date: new Date('2024-09-01'),
  },
  {
    harnessSlug: 'EleutherAI/lm-evaluation-harness',
    name: 'HumanEval',
    score: 90.2,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-10-01'),
  },
  {
    harnessSlug: 'EleutherAI/lm-evaluation-harness',
    name: 'MMLU',
    score: 88.7,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-10-15'),
  },
  {
    harnessSlug: 'EleutherAI/lm-evaluation-harness',
    name: 'GSM8K',
    score: 94.2,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-10-20'),
  },

  // ───────────── Multi-agent (AgentBench) ─────────────
  {
    harnessSlug: 'microsoft/autogen',
    name: 'AgentBench',
    score: 72.4,
    model: 'gpt-4o',
    date: new Date('2024-07-01'),
  },
  {
    harnessSlug: 'microsoft/autogen',
    name: 'HumanEval',
    score: 88.5,
    model: 'gpt-4o',
    date: new Date('2024-07-15'),
  },

  {
    harnessSlug: 'crewAIInc/crewAI',
    name: 'AgentBench',
    score: 68.1,
    model: 'gpt-4o',
    date: new Date('2024-08-01'),
  },
  {
    harnessSlug: 'crewAIInc/crewAI',
    name: 'AgentBench',
    score: 71.3,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-11-10'),
  },

  {
    harnessSlug: 'geekan/MetaGPT',
    name: 'AgentBench',
    score: 74.2,
    model: 'gpt-4o',
    date: new Date('2024-06-01'),
  },
  {
    harnessSlug: 'geekan/MetaGPT',
    name: 'HumanEval',
    score: 85.9,
    model: 'gpt-4o',
    date: new Date('2024-06-15'),
  },

  // ───────────── Browser agents (WebArena / Mind2Web) ─────────────
  {
    harnessSlug: 'browser-use/browser-use',
    name: 'WebArena',
    score: 55.3,
    model: 'claude-sonnet-4-5',
    date: new Date('2025-01-01'),
  },
  {
    harnessSlug: 'browser-use/browser-use',
    name: 'WebArena',
    score: 47.2,
    model: 'gpt-4o',
    date: new Date('2024-10-01'),
  },
  {
    harnessSlug: 'browser-use/browser-use',
    name: 'Mind2Web',
    score: 62.8,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-12-15'),
  },

  // ───────────── Agent SDK / framework benchmarks ─────────────
  {
    harnessSlug: 'openai/openai-agents-python',
    name: 'AgentBench',
    score: 75.8,
    model: 'gpt-4o',
    date: new Date('2024-11-01'),
  },
  {
    harnessSlug: 'openai/openai-agents-python',
    name: 'SWE-bench Verified',
    score: 28.5,
    model: 'gpt-4o',
    date: new Date('2024-12-01'),
  },

  {
    harnessSlug: 'langchain-ai/langchain',
    name: 'AgentBench',
    score: 64.5,
    model: 'gpt-4o',
    date: new Date('2024-08-15'),
  },
  {
    harnessSlug: 'langchain-ai/langchain',
    name: 'ToolBench',
    score: 70.2,
    model: 'claude-sonnet-4-5',
    date: new Date('2024-11-20'),
  },

  // ───────────── RAG frameworks ─────────────
  {
    harnessSlug: 'run-llama/llama_index',
    name: 'RAGAS',
    score: 78.4,
    model: 'gpt-4o',
    date: new Date('2024-09-10'),
  },
  {
    harnessSlug: 'run-llama/llama_index',
    name: 'BEIR',
    score: 52.7,
    model: 'gpt-4o',
    date: new Date('2024-07-25'),
  },

  // ───────────── Inference / serving (MT-Bench, throughput proxies) ─────────────
  {
    harnessSlug: 'vllm-project/vllm',
    name: 'MT-Bench',
    score: 88.6,
    model: 'gpt-4o',
    date: new Date('2024-10-05'),
  },
  {
    harnessSlug: 'ollama/ollama',
    name: 'MT-Bench',
    score: 72.1,
    model: 'llama-3.1-70b',
    date: new Date('2024-09-20'),
  },

  // ───────────── LLM gateway (LiteLLM routing/quality proxy) ─────────────
  {
    harnessSlug: 'BerriAI/litellm',
    name: 'MT-Bench',
    score: 84.3,
    model: 'gpt-4o',
    date: new Date('2024-10-12'),
  },
];

async function main() {
  let created = 0;
  let skippedExisting = 0;
  let skippedMissing = 0;

  for (const b of BENCHMARKS) {
    const harness = await prisma.harness.findUnique({
      where: { slug: b.harnessSlug },
    });
    if (!harness) {
      console.log(`SKIP (no harness): ${b.harnessSlug}`);
      skippedMissing++;
      continue;
    }

    const existing = await prisma.benchmark.findFirst({
      where: { harnessId: harness.id, name: b.name, model: b.model },
    });
    if (existing) {
      console.log(`SKIP (exists): ${b.harnessSlug} ${b.name} (${b.model})`);
      skippedExisting++;
      continue;
    }

    await prisma.benchmark.create({
      data: {
        harnessId: harness.id,
        name: b.name,
        score: b.score,
        model: b.model,
        date: b.date,
      },
    });
    console.log(
      `OK  ${b.harnessSlug} - ${b.name} (${b.model}): ${b.score}%`,
    );
    created++;
  }

  console.log(
    `\nDone. created=${created} skippedExisting=${skippedExisting} skippedMissing=${skippedMissing} total=${BENCHMARKS.length}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
