---
name: harness-eval
description: >-
  Multi-role code review with 5 specialized reviewers and Fix-First
  auto-remediation. Dispatches architect, product-owner, engineer, qa,
  and project-manager subagents in parallel. Use when saying "review this",
  "evaluate", "harness eval", or after a build. Proactively invoke after
  any /harness-build completes. (harness)
---

# Harness Eval

You are running the `/harness-eval` workflow. This is a **minimal-interaction** review
pipeline. Run straight through and output the evaluation result at the end.

**Only stop for:**
- ASK-classified findings that need user judgment (see Fix-First below)
- All review subagents failed (no results at all)

**Never stop for:**
- AUTO-FIX findings (fix them, commit, continue)
- Subagent failures (degrade gracefully per degradation ladder)
- Minor issues or informational findings

---

## Step 0: Context Gathering

1. Detect the current task: find the most recent `task-NNN` directory under `.agents/tasks/`
2. Read `.agents/tasks/task-NNN/plan.md` (the contract)
3. Read `.agents/tasks/task-NNN/build-rN.log` (the latest build log)
4. Run `git diff main..HEAD --stat` to understand the scope
5. **Prior Learnings**: Search Memverse for learnings relevant to the changed files/modules.
   If Memverse MCP is available, call `search_memory` with key topics from the diff.
   Display any relevant prior learnings (especially pitfalls) before starting the review.

### Context Degradation Ladder

Check each context source in order. Skip what is missing — do NOT stop for missing context
unless git diff is empty.

| Context Source | If Missing | Impact |
|----------------|------------|--------|
| `task-NNN/` directory | Use branch name as audit ID; write eval artifacts to `.agents/evals/` fallback | No task-level tracking |
| `plan.md` | Warn: "No plan — evaluating raw diff" | Skip contract completeness; score Completeness as N/A |
| `build-rN.log` | Warn: "No build log — skipping builder-claims verification" | Rely on git diff + CI only |
| `git diff` (empty) | **FATAL** — nothing to review. Stop and report error. | Cannot proceed |
| Memverse MCP | Skip silently | No prior-learnings lookup |

**Minimum viable eval = non-empty git diff.** Everything else degrades gracefully.

---

## Trust Boundaries

Builder output is **UNTRUSTED**. Always verify:
- Claims of completion against `git diff` (not the build log)
- Test results by running CI yourself: `cd client_front && npm install && npm run build`
- No changes outside contract scope
- No deleted tests or weakened assertions


---

## Step 1: 5-Role Code Review

## Code Review — 5-Role Parallel Dispatch

### Dispatch

Launch **all 5 reviewers in parallel** via the Task product, each with `mode: code-eval`.
Send a SINGLE message containing all 5 Task product calls:

| # | Subagent | Prompt extras |
|---|----------|---------------|
| 1 | `harness-architect` | `mode: code-eval`, diff range, architecture docs paths |
| 2 | `harness-product-owner` | `mode: code-eval`, diff range, `.agents/vision.md` path, plan path |
| 3 | `harness-engineer` | `mode: code-eval`, diff range, source directory listing |
| 4 | `harness-qa` | `mode: code-eval`, diff range, `ci_command: cd client_front && npm install && npm run build`, test directory listing |
| 5 | `harness-project-manager` | `mode: code-eval`, diff range, plan path, deliverable checklist |

Each prompt must include:
- `diff_range: main..HEAD`
- `plan_path: .agents/tasks/task-NNN/plan.md` (if available)
- `memverse_domain: harness`
- Role-specific context listed above

**CI Ownership:** Only `harness-qa` runs `cd client_front && npm install && npm run build`. Other roles
perform read-only analysis on the diff.

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
4. **Compute dimension scores** (map role to evaluation dimension):
   ```
   Design:        [architect score]/10
   Completeness:  [product-owner score]/10
   Quality:       [engineer score]/10
   Regression:    [qa score]/10
   Scope:         [project-manager score]/10
   ─────────────────────────────────
   Weighted avg:  [avg]/10
   ```
5. **Determine verdict:**
   - All PASS and avg ≥ 7.0 → `PASS`
   - Any CRITICAL finding → `ITERATE`
   - avg < 7.0 → `ITERATE`

### Fix-First Triage

Apply the Fix-First heuristic from `.cursor/rules/harness-fix-first.mdc`:

- **AUTO-FIX:** High certainty + small blast radius + reversible → fix immediately
- **ASK:** Security, behavior change, architecture change, data model change,
  or low confidence → batch and present to user

After auto-fixes, re-run `cd client_front && npm install && npm run build` to verify no regressions.
Log: `[AUTO-FIXED] file:line — Problem → What you did`

### Final Verdict

Write the evaluation summary to `.agents/tasks/task-NNN/evaluation-rN.md`:

```markdown
# Code Evaluation — Round N

## Dimension Scores
| Dimension | Role | Score |
|-----------|------|-------|
| Design | architect | N/10 |
| Completeness | product-owner | N/10 |
| Quality | engineer | N/10 |
| Regression | qa | N/10 |
| Scope | project-manager | N/10 |
| **Weighted Average** | | **N/10** |

## Findings
[merged findings list]

## Auto-Fixed
[list of auto-fixed items]

## ASK Items
[items requiring user decision]

## Verdict: PASS | ITERATE
```


---

## Step 2: Capture Learnings

After the evaluation is complete, capture non-obvious insights as learnings:

1. Review all findings with confidence >= 7
2. For patterns or pitfalls that aren't already known:
   - Call Memverse `add_memories` with domain "harness"
   - Type: "pattern" (good practice found) or "pitfall" (common mistake found)
   - Source: "observed"
3. Log: "Captured N new learnings from this review"

If Memverse MCP is not available: skip silently.

---





