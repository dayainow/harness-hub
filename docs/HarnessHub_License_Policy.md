# HarnessHub License & Compliance Policy

**Version 1.0 · 2026.05**
**Public URL (planned):** `harnesshub.dev/legal/license-policy`

---

## 0. Document Purpose

This document is the binding operational policy for how HarnessHub indexes, displays, and references open source AI agent harnesses hosted on GitHub. Its purpose is fourfold:

1. **Protect HarnessHub** from copyright takedown notices and legal disputes.
2. **Respect maintainer rights** at every stage of the product lifecycle.
3. **Inform users** of license obligations *before* they install a harness.
4. **Provide unambiguous procedures** for disputes, takedowns, and edge cases.

This document is referenced from the public-facing service proposal (Chapter 11) and is the source of truth where the proposal and this document conflict.

> **Disclaimer:** This is HarnessHub's operating policy, not legal advice. Maintainers and users with specific concerns should consult qualified counsel.

---

## 1. The Three-Tier License Classification

Every harness in our index is assigned exactly one of three tiers based on its declared license. The tier determines whether it is auto-indexed, indexed with warnings, or excluded entirely.

### 1.1 GREEN — Auto-Indexed (Permissive Open Source)

The following SPDX-identified licenses are eligible for fully automated indexing. No prior maintainer contact is required, although Phase 1 of our rollout still uses manual outreach (see §4).

| License | SPDX ID | Notes |
|---|---|---|
| MIT License | `MIT` | Most permissive; recommended baseline |
| Apache License 2.0 | `Apache-2.0` | Permissive + explicit patent grant |
| BSD 2-Clause | `BSD-2-Clause` | Permissive |
| BSD 3-Clause | `BSD-3-Clause` | Permissive (no endorsement clause) |
| ISC License | `ISC` | Functionally similar to MIT |
| The Unlicense | `Unlicense` | Public domain dedication |
| Creative Commons Zero | `CC0-1.0` | Public domain dedication |
| Mozilla Public License 2.0 | `MPL-2.0` | File-level copyleft |

**What we may do with GREEN-tier harnesses:**
- Display all metadata
- Include in search and discovery
- Quote up to 200 characters from README (with attribution)
- Hot-link to README images
- Reference in collections and recipes

### 1.2 YELLOW — Indexed with Prominent Warning

Copyleft and attribution licenses are indexed, but a clear warning label is shown so users understand integration obligations *before* installing.

| License | SPDX ID | Warning Label Shown |
|---|---|---|
| GNU GPL 2.0 / 3.0 | `GPL-2.0-only`, `GPL-3.0-only` | "Copyleft — derivative works must be GPL" |
| GNU AGPL 3.0 | `AGPL-3.0-only` | "Network Copyleft — SaaS use requires source disclosure" |
| GNU LGPL 2.1 / 3.0 | `LGPL-2.1-only`, `LGPL-3.0-only` | "Library Copyleft — dynamic linking allowed" |
| Creative Commons BY 4.0 | `CC-BY-4.0` | "Attribution required" |

**Operational difference from GREEN:** identical handling, except YELLOW cards display a yellow-bordered warning chip ("⚠ Copyleft") inline.

### 1.3 RED — Auto-Excluded

The following are automatically excluded from our index. Manual review is required, and indexing requires explicit written consent from the maintainer.

| Case | Reason |
|---|---|
| **No LICENSE file present** | Default copyright applies — assumed restricted |
| **CC BY-NC** (`CC-BY-NC-*`) | Non-commercial only; conflicts with Pro/Enterprise tier |
| **CC BY-ND** (`CC-BY-ND-*`) | No derivatives permitted |
| **BUSL** (Business Source License) | Not OSI-approved; "source-available" |
| **Elastic License 2.0** | Not OSI-approved; usage restrictions |
| **Commons Clause** | Adds restrictions to permissive base licenses |
| **Custom / proprietary** | Requires legal review |
| **README declares "Do not redistribute"** | Explicit refusal |
| **README declares "All rights reserved"** without OSS license | Restrictive default |
| **Dual-licensed with one RED component** | Treated as RED |

**What happens to RED candidates:** they enter a manual-review queue. If a maintainer reaches out and provides explicit written consent for a specific custom arrangement, the listing may be added with a clear "Custom License" badge linking to terms.

---

## 2. Automated Detection Pipeline

The crawler classifies each candidate repository through a five-step sequence. If any step yields a definitive result, subsequent steps are skipped.

```
Step 1 — GitHub License API
  GET /repos/{owner}/{repo}/license
  → Returns SPDX identifier if GitHub detects one

Step 2 — SPDX Mapping
  Match against canonical lists
  GREEN list match  → tier = GREEN
  YELLOW list match → tier = YELLOW
  no match returned → continue to step 3

Step 3 — Filesystem Probe
  Look for: LICENSE, LICENSE.md, LICENSE.txt, COPYING, COPYING.md
  Run go-license-detector on file contents
  Confidence > 0.9 + GREEN match → GREEN
  Confidence > 0.9 + YELLOW match → YELLOW
  Confidence ≤ 0.9 or RED match → RED

Step 4 — Text Heuristics (RED candidates only)
  Scan README and CONTRIBUTING for trigger phrases:
    "do not redistribute"
    "all rights reserved"
    "no commercial"
    "proprietary"
    "internal use only"
  Any match → confirm RED

Step 5 — Final Decision
  GREEN  → indexed automatically
  YELLOW → indexed with warning badge
  RED    → excluded; logged to manual-review queue
```

**Re-classification trigger:** the pipeline runs again on any of:
- New release published (GitHub webhook)
- 24-hour periodic refresh
- Maintainer-triggered re-scan via `/dashboard`
- Third-party report received

If a license downgrade is detected (e.g., MIT → BUSL), the listing is delisted within 1 hour and the maintainer is notified.

---

## 3. Maintainer Opt-In Signals (Gold Standard)

Even when license classification permits auto-indexing, explicit maintainer opt-in is the strongest legal posture. We support two methods.

### 3.1 GitHub Topic Method

The maintainer adds the topic `harnesshub` to their repository through GitHub's repository settings. Our crawler treats topic-tagged repos as having opted in and prioritizes them for indexing.

**Pros:** lightweight, no commit required.
**Cons:** less rich metadata than method 3.2.

### 3.2 harness.yaml Manifest Method

The maintainer commits a `harness.yaml` file to the repository root with at minimum:

```yaml
# Required fields
name: my-agent
license: MIT
maintainer: "@username"
opted_in: true

# Optional but recommended
version: 0.1.0
category: coding-agent          # see /docs/categories for full list
description: "One-line summary"

runtime:
  language: python
  version: ">=3.11"

models:
  - claude-sonnet-4-6
  - gpt-4o

install:
  npm: "npx my-agent"
  pip: "pip install my-agent"
  docker: "myorg/my-agent:latest"

benchmarks:
  - name: swe-bench-verified
    score: 0.678
    model: claude-sonnet-4-6
    date: 2026-04-01

tags:
  - coding
  - cli
```

**Pros:** richest metadata, signed commit history, unambiguous opt-in.
**Cons:** requires a PR to the maintainer's repo.

### 3.3 Verified Author Badge

Repositories using either opt-in method receive a "Verified Author" badge on their listing card and detail page.

---

## 4. Phased Rollout Strategy

To minimize risk while building trust, indexing automation is rolled out in three phases. Each phase requires the prior phase to be stable for at least 60 days.

### Phase 1 — MVP · Manual Curation Only

- **Targets:** ~500 hand-picked harnesses
- **Method:** operator emails each maintainer asking permission before listing
- **Threshold:** explicit "yes" reply required
- **Goal:** establish trust, demonstrate quality bar, learn maintainer concerns

### Phase 2 — Opt-In Auto

- **Targets:** estimated 1,500–3,000 candidate repos
- **Method:** crawler indexes only repos with `harnesshub` topic OR `harness.yaml`
- **Threshold:** explicit opt-in signal required
- **Goal:** zero unconsented listings while scaling

### Phase 3 — Notify-First Auto

- **Targets:** all GREEN-licensed repos matching agent-harness keywords
- **Method:** crawler indexes any qualifying repo. Maintainer receives notification email: "Your repo was added to HarnessHub. Click here to review or remove."
- **Threshold:** GREEN license + agent keyword match. Default opt-in unless they click remove.
- **Goal:** comprehensive index after Phase 2 community is established

**Phase advancement criteria:** advancing requires (a) zero unresolved maintainer complaints in the prior 60 days, (b) <0.5% takedown rate of the prior phase's listings, (c) operator review.

---

## 5. Five Safe Operating Principles

These principles govern operational behavior independent of license tier. They apply uniformly to GREEN and YELLOW listings.

### 5.1 Metadata-Only Hosting

We never store the source code, complete README, or large media assets of any harness on our servers. We store only:

- Public metadata (name, owner, URL, stars, license SPDX, topics, GitHub description)
- Short README excerpt (≤200 characters)
- Pointers (URLs) to GitHub raw assets

When a user runs `npx harnesshub install <name>`, the CLI clones from GitHub directly. **Our service is a directory, not a registry of code.**

### 5.2 License Transparency

Every harness card displays the SPDX license badge prominently. Users see the license before they click into details. YELLOW-tier licenses get an additional warning chip inline. RED-tier listings (manual exceptions) display the custom terms link.

### 5.3 Opt-In as Default Posture

We start with the most conservative posture (manual curation) and graduate slowly. At every phase, maintainers can opt out within 24 hours of contact. Default-on automation only at Phase 3 with mandatory notification.

### 5.4 Maintainer-First Takedown SLA

A maintainer (verified via GitHub OAuth) can remove their listing immediately, no questions asked, via the dashboard. Third-party reports are reviewed within 24-48 hours, with notice to the maintainer where appropriate.

### 5.5 Quote, Don't Copy

- **README excerpts:** ≤200 characters, with "Source: github.com/..." attribution
- **Images:** hot-linked from GitHub raw URLs, never cached on our CDN
- **Code blocks:** not displayed in our UI; users click through to the source repo
- **Demo videos:** embedded from YouTube/Vimeo, never re-hosted

---

## 6. Storage Policy

Concrete table of what we store versus what we don't.

| Field | Stored? | Source | Why |
|---|---|---|---|
| `name`, `owner`, `repo_url` | ✅ | GitHub | Public metadata, used for display and links |
| `stars`, `forks`, `last_updated`, `issues_open` | ✅ | GitHub API | Objective public facts |
| `license` (SPDX ID) | ✅ | GitHub License API | Required for compliance display |
| `topics`, `tags` | ✅ | GitHub | Public metadata |
| `description` (1 line) | ✅ | GitHub | GitHub's official description |
| `readme_excerpt` (≤200 chars) | ✅ | GitHub | Fair-use teaser |
| `install_cmd` | ✅ | manifest or inferred | Required for CLI |
| `benchmark_scores` | ✅ | manifest or community | Public claims |
| `model_compatibility` | ✅ | manifest or inferred | Public metadata |
| **Source code (any portion)** | ❌ | — | Avoids redistribution claims |
| **Full README** | ❌ | use GitHub link | License compliance |
| **Screenshots / images / GIFs** | ❌ | hot-link from GitHub | Avoids reproduction |
| **Demo videos** | ❌ | embed external | Avoids reproduction |
| **User credentials / API keys** | ❌ | n/a | Security policy |

---

## 7. Takedown & Reporting Procedure

### 7.1 Reporting Form

Located at `/report`. Users submit:
- Repository URL
- Reason (copyright violation / wrong license / maintainer request / spam / other)
- Contact info (optional)
- Supporting evidence (links, screenshots)

### 7.2 Maintainer Self-Service

A logged-in maintainer (GitHub OAuth verified, owner role on the repo) can remove their own listing instantly via the dashboard. No review is required. The listing is delisted in real-time.

### 7.3 Third-Party Reports

The standard process:
1. Receipt acknowledged within 24 hours
2. Maintainer notified within 7 days (unless emergency)
3. Maintainer given 14 days to respond
4. Listing removed if no response in 14 days, OR sooner if evidence is clear-cut

For clear-cut violations (e.g., proven non-OSS license, explicit "do not list" message from maintainer), removal happens within 48 hours.

### 7.4 DMCA Compliance

We comply with the Digital Millennium Copyright Act (DMCA) in the US and equivalent procedures under Korean copyright law (저작권법). Designated DMCA agent contact published at `/legal/dmca`.

DMCA notices must include:
- Identification of the copyrighted work claimed to have been infringed
- Identification of the material claimed to be infringing
- Contact information for the complaining party
- A statement that the use is not authorized
- A statement under penalty of perjury that the information is accurate
- Physical or electronic signature

### 7.5 Repeat Offenders

Repositories repeatedly removed for the same reason are blocklisted from re-listing. The blocklist is reviewed quarterly.

### 7.6 Counter-Notice

Listed maintainers who believe their listing was incorrectly removed may submit a counter-notice at `/counter-notice` following standard DMCA counter-notification format.

---

## 8. Edge Cases & Special Situations

### 8.1 Dual-Licensed Repositories

Display both licenses in the listing. Tier classification uses the **more permissive** of the two.

Example: `MIT OR GPL-3.0` → classify as GREEN (MIT), but display "MIT or GPL-3.0" with a tooltip.

### 8.2 License Changes Mid-Lifecycle

When the crawler detects a license change:
- **Permissive → permissive:** silently update
- **Permissive → copyleft:** update tier, send maintainer email
- **Permissive/copyleft → restrictive (e.g., BUSL):** immediate delist, maintainer email, watchers email

Subscribers (users who saved the harness) receive notification on any tier change.

### 8.3 Forks

We index forks **only if** they have substantive new contribution and a different name than the upstream. Pure mirrors are not indexed. Forks declaring a different license than upstream are reviewed manually.

### 8.4 Submodules / Vendored Code

We treat the top-level repo's license as authoritative for our indexing purposes. Users are responsible for inspecting submodule licenses before integration.

### 8.5 License File Without SPDX Identifier

If LICENSE file exists but no SPDX identifier is matched (e.g., custom MIT-like text):
- Run `go-license-detector` for ML-based identification
- If confidence ≥0.9 → use detected license
- If confidence <0.9 → RED (manual review)

### 8.6 Trademark in Names / Logos

We do not display logos or branded marks of harnesses unless explicitly opted in via `harness.yaml`. Repository name and owner are factual metadata and may be displayed.

### 8.7 Personal Data in Repos

If a maintainer's repo contains personal data (e.g., email addresses in commit history, names in CODEOWNERS), we display only what GitHub itself displays publicly. We do not aggregate or further surface this data.

---

## 9. Operational Roles

| Role | Responsibility |
|---|---|
| **License Reviewer** | Manual review of RED candidates. Quarterly audit of GREEN/YELLOW assignments. |
| **Takedown Officer** | Process reports within SLA. Handle DMCA notices. |
| **Pipeline Engineer** | Maintain crawler, detection logic, SPDX mapping accuracy. |
| **Community Liaison** | Maintainer outreach (Phase 1), opt-in support, dispute mediation. |

For MVP, all four roles may be held by the founder. Roles must be split before Phase 3.

---

## 10. Policy Updates & Versioning

This policy may be updated as:
- New license types emerge
- Court decisions clarify obligations (US, Korea, EU)
- Community feedback indicates needed clarifications
- Operational practice reveals gaps

Material changes are announced on the public changelog at `/legal/changelog` and to subscribed maintainers via email at least 30 days before taking effect (where practicable).

Each version is cryptographically anchored: SHA-256 of the published policy is stored in our public Git repository.

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026.05 | Initial policy |

---

## 11. Contact

| Purpose | Email |
|---|---|
| General inquiries | hello@harnesshub.dev |
| Legal / DMCA | legal@harnesshub.dev |
| Maintainer concerns | maintainers@harnesshub.dev |
| Security disclosure | security@harnesshub.dev |

DMCA agent designated address (USA): published at `/legal/dmca` once domain is acquired.

---

## Appendix A — License Quick Reference

For maintainers choosing a license for a new harness, this table summarizes operational impact on HarnessHub:

| Want to... | Choose |
|---|---|
| Maximum adoption, minimum constraints | **MIT** |
| Permissive + patent protection | **Apache-2.0** |
| Public domain | **CC0** or **Unlicense** |
| Require derivative works to remain open | **GPL-3.0** |
| Require open source even when used as SaaS | **AGPL-3.0** |
| Allow library linking only | **LGPL-3.0** |
| Document/data only (not code) | **CC-BY-4.0** |

**Avoid for HarnessHub indexing:**
- BUSL, Elastic, Commons Clause (not auto-indexed)
- CC-BY-NC, CC-BY-ND (commercial conflict)
- Custom / homegrown licenses (manual review required)

---

## Appendix B — Reference Operating Models

We modeled this policy on established precedents:

- **npm registry** — metadata + redirect to npm CLI for code download
- **PyPI** — metadata + Python Package Index
- **crates.io** — Rust package directory
- **awesome-lists pattern** — links and short descriptions only
- **Vercel Templates** — opt-in, license required, GitHub-sourced

We diverge from these by adding:
- Three-tier license traffic light (more transparency)
- CI-based "Verified" badge (npm has none equivalent)
- Benchmark integration (domain-specific)
- Phased opt-in rollout (lower risk)

---

**End of Policy.**

*HarnessHub Studio · 2026 · License & Compliance Policy v1.0*
