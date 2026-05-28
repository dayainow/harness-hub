"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTIONS = void 0;
exports.COLLECTIONS = [
    {
        slug: 'top-coding-agents-2025',
        title: 'Top Coding Agents 2025',
        description: 'The most capable AI agents for automated code generation, debugging, and pull request creation.',
        harnessSlugs: [
            'princeton-nlp/SWE-agent',
            'Aider-AI/aider',
            'cline/cline',
            'gpt-engineer-org/gpt-engineer',
            'continuedev/continue',
        ],
    },
    {
        slug: 'rag-starter-pack',
        title: 'RAG Starter Pack',
        description: 'Essential frameworks for building production-grade Retrieval-Augmented Generation pipelines.',
        harnessSlugs: [
            'run-llama/llama_index',
            'langchain-ai/langchain',
            'chroma-core/chroma',
            'weaviate/weaviate-python-client',
            'milvus-io/pymilvus',
        ],
    },
    {
        slug: 'multi-agent-frameworks',
        title: 'Multi-Agent Frameworks',
        description: 'Orchestrate multiple AI agents to tackle complex, multi-step tasks collaboratively.',
        harnessSlugs: [
            'microsoft/autogen',
            'joaomdmoura/crewAI',
            'langchain-ai/langgraph',
            'reworkd/AgentGPT',
            'camel-ai/camel',
        ],
    },
    {
        slug: 'eval-and-benchmarks',
        title: 'Eval & Benchmark Tools',
        description: 'Measure and compare LLM capabilities with standardized evaluation frameworks.',
        harnessSlugs: [
            'EleutherAI/lm-evaluation-harness',
            'confident-ai/deepeval',
            'microsoft/promptflow',
            'truera/trulens',
            'stanford-crfm/helm',
        ],
    },
    {
        slug: 'browser-and-web-automation',
        title: 'Browser & Web Automation',
        description: 'Autonomous agents that control web browsers for research, scraping, and UI automation.',
        harnessSlugs: [
            'browser-use/browser-use',
            'microsoft/playwright',
            'unclecode/crawl4ai',
        ],
    },
    {
        slug: 'production-llm-infrastructure',
        title: 'Production LLM Infrastructure',
        description: 'Battle-tested tools for deploying, scaling, and managing LLMs in production.',
        harnessSlugs: ['vllm-project/vllm', 'ollama/ollama'],
    },
    {
        slug: 'claude-compatible-agents',
        title: 'Claude-Compatible Agents',
        description: 'AI agent frameworks with first-class support for Anthropic Claude models.',
        harnessSlugs: [
            'princeton-nlp/SWE-agent',
            'Aider-AI/aider',
            'cline/cline',
            'browser-use/browser-use',
            'openai/openai-agents-python',
        ],
    },
    {
        slug: 'getting-started',
        title: 'Getting Started with AI Agents',
        description: 'The best entry points for developers new to AI agent development.',
        harnessSlugs: [
            'langchain-ai/langchain',
            'run-llama/llama_index',
            'microsoft/autogen',
            'ollama/ollama',
        ],
    },
];
async function runCli() {
    const dotenv = await import('dotenv');
    const path = await import('path');
    dotenv.config({
        path: path.resolve(__dirname, '../.env.local'),
        override: true,
    });
    const { PrismaClient } = await import('@prisma/client');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    try {
        const curator = await prisma.user.findFirst({
            where: { username: 'harnesshub-curator' },
        });
        if (!curator) {
            throw new Error('Curator user "harnesshub-curator" not found. Run `npm run seed` first.');
        }
        let created = 0;
        let skipped = 0;
        for (const col of exports.COLLECTIONS) {
            const existing = await prisma.collection.findUnique({
                where: { slug: col.slug },
            });
            if (existing) {
                console.log(`SKIP: ${col.slug} (already exists)`);
                skipped += 1;
                continue;
            }
            const harnesses = await prisma.harness.findMany({
                where: { slug: { in: col.harnessSlugs } },
                select: { id: true, slug: true },
            });
            const slugToId = new Map(harnesses.map((h) => [h.slug, h.id]));
            const orderedHarnessIds = col.harnessSlugs
                .map((slug) => slugToId.get(slug))
                .filter((id) => Boolean(id));
            await prisma.collection.create({
                data: {
                    slug: col.slug,
                    title: col.title,
                    description: col.description,
                    curatorId: curator.id,
                    isPublic: true,
                    items: {
                        create: orderedHarnessIds.map((harnessId) => ({ harnessId })),
                    },
                },
            });
            console.log(`OK: ${col.slug} (${orderedHarnessIds.length} harnesses)`);
            created += 1;
        }
        console.log(`Done. created=${created} skipped=${skipped}`);
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
if (require.main === module) {
    runCli().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=seed-collections.js.map