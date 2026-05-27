"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BENCHMARKS = void 0;
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const prisma = new client_1.PrismaClient();
exports.BENCHMARKS = [
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
    for (const b of exports.BENCHMARKS) {
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
        console.log(`OK  ${b.harnessSlug} - ${b.name} (${b.model}): ${b.score}%`);
        created++;
    }
    console.log(`\nDone. created=${created} skippedExisting=${skippedExisting} skippedMissing=${skippedMissing} total=${exports.BENCHMARKS.length}`);
}
main()
    .catch((err) => {
    console.error(err);
    process.exitCode = 1;
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-benchmarks.js.map