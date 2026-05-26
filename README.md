<div align="center">
  <img src="https://raw.githubusercontent.com/dayainow/harness-hub/main/client_front/public/logo.png" alt="HarnessHub Logo" width="120" />
  <h1>HarnessHub</h1>
  <p><strong>The npm of AI Agent Harnesses</strong></p>
  <p>Discover, evaluate, and install the world's best AI autonomous agents and frameworks.</p>
</div>

---

## 🚀 What is HarnessHub?

As the AI ecosystem transitions from Chatbots to **Autonomous Agents**, the number of coding agents, research agents, and eval frameworks (harnesses) is exploding on GitHub. 

**HarnessHub** is the central discovery platform and package manager for this new ecosystem. Much like what `npm` did for JavaScript or `PyPI` for Python, HarnessHub categorizes, evaluates, and safely distributes AI agents.

### Why HarnessHub?
- **Fragmentation:** Currently, finding the right AI agent requires manually searching GitHub and reading disjointed READMEs.
- **License Risk:** AI agents often use copyleft (GPL) or non-commercial licenses. Developers blindly integrating them into proprietary enterprise apps risk massive legal liability.
- **Evaluation:** It's hard to know which agent is actually good. HarnessHub integrates benchmark scores (SWE-bench, MMLU) right into the catalog.

---

## ✨ Key Features

### 1. Automated GitHub Crawler Engine 🕷️
A cron-based NestJS background worker that synchronizes with the GitHub API every 12 hours. It fetches live data like Stars, Forks, Open Issues, and README excerpts to ensure the catalog is always up-to-date without hosting massive amounts of code.

### 2. 3-Tier License Classification Pipeline ⚖️
HarnessHub prioritizes enterprise safety through an automated SPDX license detection pipeline:
- 🟢 **GREEN Tier (Auto-Indexed):** Permissive open-source (MIT, Apache 2.0). Safe for enterprise.
- 🟡 **YELLOW Tier (Warning):** Copyleft (GPL). Requires open-sourcing derivative works.
- 🔴 **RED Tier (Auto-Excluded):** No license or non-commercial. Automatically blocked from public search and moved to a manual review queue (`PENDING` status).

### 3. Dynamic Explore Dashboard 🌐
A modern, dynamic Next.js 15 (App Router) interface featuring:
- **Multi-Filtering:** Filter by Agent Category (Coding, Research, RAG), LLM Compatibility (Claude, GPT-4o, Llama), Language, and License Tier.
- **Real-world Seed Data:** Comes pre-seeded with 40+ industry-leading tools like `SWE-agent`, `AutoGPT`, and `LangGraph`.

### 4. HarnessHub CLI Tool 💻
A dedicated Node.js command-line tool allowing developers to install agents directly from their terminal.
```bash
npx harnesshub install princeton-nlp/SWE-agent
```
The CLI automatically fetches metadata from the HarnessHub backend, warns you of license risks, and executes the appropriate installation command.

---

## 🏗️ Architecture & Tech Stack

This project is structured as a monorepo containing the Backend, Frontend, and CLI tool.

- **Frontend (`/client_front`)**: [Next.js 15](https://nextjs.org/) (App Router), React, TailwindCSS, `next-intl` (i18n).
- **Backend (`/back`)**: [NestJS](https://nestjs.com/), Node.js.
- **Database**: [PostgreSQL](https://www.postgresql.org/) managed via [Prisma ORM](https://www.prisma.io/).
- **CLI (`/cli`)**: Node.js, Commander.js, Chalk.

---

## 🛠️ Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- GitHub Personal Access Token (for the crawler)

### 1. Database Setup
```bash
cd back
npm install
# Set your DATABASE_URL and GITHUB_TOKEN in .env.local
npx prisma db push
npx prisma db seed  # Seeds the DB with 40+ agents and admin accounts
```

### 2. Start the Backend (NestJS)
```bash
cd back
npm run start:dev
# Backend runs on http://localhost:3002
```

### 3. Start the Frontend (Next.js)
```bash
cd client_front
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Test the CLI
```bash
cd cli
npm install
npm run build
npm link
# Test the CLI globally
harnesshub install princeton-nlp/SWE-agent
```

---

## 📜 License Policy & Compliance
HarnessHub operates as a **metadata-only directory**. We do not host, store, or distribute source code directly to avoid copyright infringement. All installations are securely routed directly to the original author's GitHub repository or official package manager.

For more details, see our full [License & Compliance Policy](./docs/HarnessHub_License_Policy.md).

---

<div align="center">
  Built with ❤️ for the AI Developer Community.
</div>
