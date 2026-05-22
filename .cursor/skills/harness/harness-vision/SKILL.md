---
name: harness-vision
description: >-
  Vision-driven pipeline: clarify an incremental vision, generate a plan with
  multi-role review, then auto-execute build/eval/ship/retro. Use when saying
  "vision", "I want to build this direction", "this is what I need",
  or "harness vision". (harness)
---

# Harness Vision — From Direction to PR

You are running the `/harness-vision` workflow. The user has a **clear incremental
direction** that needs clarification before becoming a plan.

**Human interaction phases:** Vision Clarification + Plan Review Gate
**Autonomous phases:** Build → Eval → Ship → Auto-Retro

**Only stop for:**
- Vision clarification (if the direction has ambiguity)
- Review gate escalation (when plan_review_gate requires it)
- ASK-classified review findings during eval

**Never stop for:**
- Implementation decisions (make them during build)
- AUTO-FIX findings (fix silently)

---




## Workspace Pre-flight


Before any planning or exploration, ensure the workspace is ready for a new task.

### 1. Clean Check

```bash
git status --porcelain
```

If the output is **non-empty**, **ABORT** immediately:
- List the dirty files
- Guide the user: "工作区有未提交的变更，请先处理再运行 harness workflow："
  - `git stash -u` to stash everything (including untracked)
  - `git commit` to commit current work
  - `git checkout -- .` to discard changes
- Do NOT proceed. Do NOT auto-stash.

### 2. Worktree Detection

```bash
COMMON=$(git rev-parse --git-common-dir 2>/dev/null)
GITDIR=$(git rev-parse --git-dir 2>/dev/null)
```

If `$COMMON` ≠ `$GITDIR`, you are in a **Cursor parallel-agent worktree**.
The worktree was created with `.cursor/` and `.agents/` already copied
(via `worktrees.json`). **Skip steps 3–5** — the worktree is already on the
correct feature branch. Proceed to the next phase.

### 3. Branch Check

```bash
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
```

- If `$CURRENT_BRANCH` starts with `agent/`: you are **resuming an existing task**.
  Inform the user: "当前已在 feature branch `$CURRENT_BRANCH`，继续在此分支工作。"
  **Skip steps 4–5.** Proceed to the next phase.
- If `$CURRENT_BRANCH` is `HEAD` (detached): **ABORT** — "当前处于 detached HEAD 状态，请先 `git checkout main`。"
- Otherwise: continue to step 4.

### 4. Trunk Alignment

```bash
git checkout main
git pull origin main
```

If `git pull` fails (network error, conflict, or `main` doesn't exist):
**ABORT** — show the error output and guide: "无法更新 `main`，请手动解决后重新运行。"

### 5. Create Feature Branch

1. Determine the next task number:
   ```bash
   mkdir -p .agents/tasks
   ls .agents/tasks/ | grep -oP 'task-\K\d+' | sort -n | tail -1
   ```
   If no tasks exist, start with `001`. Otherwise increment the max by 1, zero-padded to 3 digits.

2. Extract a short description from the user's requirement (max 4 hyphenated lowercase keywords).

3. Create the branch:
   ```bash
   git checkout -b agent/task-NNN-<short-desc>
   ```
   If the branch already exists: **ABORT** — "分支 `agent/task-NNN-<short-desc>` 已存在，请确认是否要 resume 该任务或选择其他名称。"





---

## Phase 0: Vision Clarification

### Step 1: Understand the Direction

1. Read the user's vision input carefully
2. Read `.agents/vision.md` (if it exists) to understand existing context
3. Read `.agents/config.toml` for project config

### Step 2: Clarify (if needed)

If the vision has **ambiguous aspects**, ask **1–2 clarifying questions** in a single
message. Do NOT multi-round question the user — keep it tight.

Examples of when to clarify:
- Scope is unclear (does "improve auth" mean add MFA, fix bugs, or refactor?)
- Conflicting signals (vision says "keep it simple" but the ask is complex)
- Missing context (references systems you haven't seen in the codebase)

If the vision is clear enough to plan from, skip clarification and proceed.

---





## Update Vision

1. Read `.agents/vision.md` (create if missing)
2. Synthesize the conclusion from the preceding phase into a vision delta
3. Append an incremental section:
   ```markdown
   ## [Date] — [Brief Title]
   [2-3 sentence summary of the direction chosen and why]
   ```
4. Write back to `.agents/vision.md`


---



## Plan Generation

### Core Principles

1. **Deliver a clear contract** — every deliverable must have acceptance criteria
2. **Search Before Building** — check what the project already uses before proposing new patterns
3. **Completeness** — cover tests, error handling, and type safety when cost is small
4. **Scope discipline** — do not add deliverables beyond the stated requirement
5. **No implementation** — you plan, the Builder implements

### 6 Decision Principles

When making planning decisions, apply these principles in order:

1. **Choose completeness** — When in doubt, cover more edge cases rather than fewer.
2. **Boil lakes** — If you're fixing something in the blast radius, fix ALL related issues.
3. **Pragmatic** — When two approaches solve the same problem, choose the cleaner one.
4. **DRY** — If the plan duplicates existing functionality, stop. Reuse what exists.
5. **Explicit over clever** — 10 lines of obvious code beats 200 lines of abstract framework.
6. **Bias toward action** — Merge beats another review cycle beats stalling.

### Decision Classification

Every decision during planning falls into one of three categories:

- **Mechanical** — There is only one correct answer. Apply it silently.
- **Taste** — Reasonable engineers could disagree. Mark as `[TASTE DECISION]`.
- **User Challenge** — Both reviewers agree the user's direction needs reconsideration.
  NEVER auto-decide. Always present to the user with evidence.

### Context Gathering

1. Read the user's requirement carefully
2. Read `.agents/config.toml` and `.agents/vision.md` (if they exist)
3. Scan the project structure: key directories, languages, frameworks, existing patterns
4. Run `git log --oneline -10` for recent activity context
5. Check existing task directories: `ls .agents/tasks/` to determine the next task number

### Produce Spec + Contract

Write output to `.agents/tasks/task-NNN/plan.md` (create directory if needed).

```markdown
# Spec

## Analysis
(Technical analysis of the requirement — what problem is being solved, why it matters)

## Approach
(Implementation approach, key decisions, alternatives considered and why rejected)

## Impact
(Files affected, blast radius, dependencies)

## Risks
(Potential risks and mitigations — what could go wrong)

---

# Contract

## Deliverables
- [ ] Deliverable 1: description + acceptance criteria
- [ ] Deliverable 2: description + acceptance criteria
...

## Acceptance Criteria
- All tests pass
- No regressions introduced
- (specific criteria from the requirement)

## Out of Scope
- (explicitly list things NOT being done)

## Decision Audit Trail
| # | Phase | Decision | Classification | Principle | Rationale | Rejected Alternative |
|---|-------|----------|---------------|-----------|-----------|---------------------|
| 1 | Approach | ... | Mechanical/Taste | #N | ... | ... |
```

**Quality bar**: Every deliverable MUST have acceptance criteria. Vague deliverables
like "improve the code" are not acceptable — make them specific and testable.


---

## Plan Review — 5-Role Parallel Dispatch

### Dispatch

Launch **all 5 reviewers in parallel** via the Task product, each with `mode: plan-review`.
Send a SINGLE message containing all 5 Task product calls:

| # | Subagent | Prompt extras |
|---|----------|---------------|
| 1 | `harness-architect` | `mode: plan-review`, plan path, `ARCHITECTURE.md` path if exists |
| 2 | `harness-product-owner` | `mode: plan-review`, plan path, `.agents/vision.md` path |
| 3 | `harness-engineer` | `mode: plan-review`, plan path, source directory listing |
| 4 | `harness-qa` | `mode: plan-review`, plan path, test directory listing, `ci_command: cd client_front && npm install && npm run build` |
| 5 | `harness-project-manager` | `mode: plan-review`, plan path, deliverable count, file impact count |

Each prompt must include:
- `memverse_domain: harness`
- The plan file content (read it and embed, or provide the path)
- Role-specific context listed above

**Degradation ladder** (if Task product calls fail):
- **5/5 respond:** Full synthesis as described below
- **3-4/5 respond:** Proceed with available reviews, note missing perspectives
- **1-2/5 respond:** Log warning, fall through to single-agent review
- **0/5 respond:** Fall back to single generalPurpose subagent review

### Synthesis

After all responses arrive:

1. **Merge findings** from all 5 reviewers into a unified list
2. **Filter out-of-scope findings** using the role→responsibility map:
   | Role | Owns | Must NOT report |
   |------|------|----------------|
   | Architect | Design, modules, deps, security design | Code quality, tests, delivery, user value |
   | Product Owner | User value, requirements, AC, UX edge cases | Code quality, architecture, tests, delivery |
   | Engineer | Code quality, DRY, patterns, performance, errors | Architecture decisions, user value, delivery, test strategy |
   | QA | Tests, coverage, CI, regression, boundaries | Code quality, architecture, user value, delivery |
   | Project Manager | Scope, delivery, decomposition, commit structure | Code quality, architecture, tests, user value |

   For each finding, check if the reporting role owns that category:
   - **In-scope**: keep as-is
   - **Out-of-scope + CRITICAL**: re-tag as `[CROSS-ROLE]` and keep
   - **Out-of-scope + WARN/INFO**: mark `[OUT-OF-SCOPE]` and exclude from scoring
3. **Cross-validate:** If 2+ roles flag the same issue → mark `[HIGH CONFIDENCE]`
4. **Resolve conflicts:** If roles contradict each other, present both perspectives
   and mark as `[TASTE DECISION]` for the review gate
5. **Compute aggregate score:**
   ```
   Architecture:  [architect score]/10
   Product:       [product-owner score]/10
   Engineering:   [engineer score]/10
   Testing:       [qa score]/10
   Delivery:      [project-manager score]/10
   ─────────────────────────────────
   Weighted avg:  [avg]/10
   ```
6. **Determine verdict:**
   - All PASS and avg ≥ 7.0 → `PLAN_APPROVED`
   - Any CRITICAL finding → `PLAN_NEEDS_REVISION`
   - avg < 7.0 → `PLAN_NEEDS_REVISION`

### Re-Plan Loop (max 2 iterations)

If verdict is `PLAN_NEEDS_REVISION`:

1. Fix all CRITICAL and WARN findings in the plan file
2. Re-dispatch the full 5-role review (same parallel pattern)
3. If same issues recur (convergence guard) → accept and note as `## Unresolved Concerns`
4. After 2 iterations → proceed to review gate with current state

Persist the final synthesis as `## Plan Review Summary` in the plan file.


---

## Review Gate — auto


Assess whether the plan needs human review by calculating an **escalation score**.

**This entry point's interaction depth: medium**

| Signal | Condition | Score |
|--------|-----------|-------|
| Interaction depth | high (brainstorm) | **-2** |
| Interaction depth | medium (vision) | **-1** |
| Interaction depth | low (plan) | **+0** |
| Scale | deliverables > 5 | +2 |
| Scale | estimated files to modify > 10 | +2 |
| Risk | security, authentication, or authorization changes | +3 |
| Risk | data model or schema changes | +3 |
| Risk | public API surface changes | +2 |
| Quality | plan review aggregate score < 7.0/10 | +2 |
| Type | new feature (not fix or refactor) | +1 |

**Score >= 5 → FULL REVIEW**
Present the complete plan + 5-role review summary. Wait for:
- **approve** → continue
- **edit: [feedback]** → re-plan
- **reject** → terminate

**Score 3–4 → SUMMARY CONFIRM**
Show a concise summary:
```
PLAN SUMMARY
═══════════════════════════════════════════
  Task:          task-NNN
  Deliverables:  N items
  Files:         ~N estimated
  Risk flags:    [list or "none"]
  Review scores: Arch X/10 | Prod X/10 | Eng X/10 | QA X/10 | PM X/10
  Aggregate:     X/10
  Gate score:    N (SUMMARY CONFIRM)
═══════════════════════════════════════════
Continue? [approve / edit / reject]
```

**Score < 3 → AUTO PROCEED**
Log: `"Plan auto-approved (gate score N, aggregate review score X/10)"` and continue.



---

## Execution

Review gate passed. Invoke `/harness-ship` to execute the full
build → eval → ship → PR pipeline.

Ship will dispatch the same 5 roles (architect, product-owner, engineer,
qa, project-manager) in `code-eval` mode for the evaluation phase.




---

## Safety Rules

### Bypass-Immune (NEVER skip, even with --force)
- Never commit `.env`, credentials, or API keys
- Never `git push --force` to `main`
- Never drop/truncate production database tables
- Never delete `.agents/` task artifacts

### Bypassable (user can override)
- Lint warnings in non-critical files
- Missing type annotations
- Test coverage below threshold

