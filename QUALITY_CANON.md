# QUALITY_CANON.md — Arcanea Enforcement Layer

> Companion to [`TASTE.md`](./TASTE.md), [`DESIGN.md`](./DESIGN.md), and [`AGENTS.md`](./AGENTS.md).
>
> TASTE.md is **what excellent looks like.** DESIGN.md is **what tokens it uses.**
> This file is **how much, where it's measured, and what blocks the merge.**
>
> Every rule below is one of four states:
>
> - `BLOCKING` — CI fails the PR. No merge.
> - `WARN` — CI flags it; reviewer decides.
> - `MANUAL` — Reviewer checklist; no automation today.
> - `ASPIRATIONAL` — Target state; not yet implemented. Listed for transparency.
>
> Authority: this file > convention; this file < TASTE.md (taste wins ties); this file < direct user instruction.

---

## §0 — Meta

| Field | Value |
|---|---|
| Authored | 2026-05-18 |
| Author | Shinkami (Source Gate Guardian) |
| Replaces | Scattered quality rules in TASTE.md / AGENTS.md / CLAUDE.md / memory feedback |
| Companion of | [`GROUND_TRUTHS.md`](./GROUND_TRUTHS.md) §2.1 (this closes that gap) |
| Status | **v0.1.0** — initial canon. Many rules are BLOCKING-on-paper but unverified-in-CI; see §10. |
| Scope | Arcanea monorepo `apps/web` + `packages/*`; extends to satellite repos opt-in via §11. |

---

## §1 — Code Quality

### §1.1 — TypeScript & types

| # | Rule | State | Check |
|---|---|---|---|
| 1.1.1 | TS strict mode on all packages | `BLOCKING` | `tsconfig.json` `"strict": true` (already enabled per AGENTS.md). |
| 1.1.2 | No `any` in new code | `BLOCKING` | ESLint `@typescript-eslint/no-explicit-any: error`. Existing `any` grandfathered behind `// @canon-grandfathered <YYYY-MM-DD>` with a Linear ticket. |
| 1.1.3 | No `@ts-ignore` without a `// reason: ...` comment | `WARN` | ESLint `@typescript-eslint/ban-ts-comment` configured to require description ≥10 chars. |
| 1.1.4 | No `as unknown as X` double-cast | `WARN` | Manual review; suggests broken typing upstream. |
| 1.1.5 | Public package exports have explicit return types | `WARN` | `@typescript-eslint/explicit-module-boundary-types`. |
| 1.1.6 | Zod (or equivalent) validation at every system boundary | `BLOCKING` | New API route, MCP tool, or extension bridge: payload validated. Existing routes grandfathered with §9 ticket. |
| 1.1.7 | Every data shape has a TypeScript type + (when external) a Zod schema + ≥1 example | `MANUAL` | Reviewer checklist. Schemas live in `@arcanea/schemas` (planned — see GROUND_TRUTHS §2.6). |

### §1.2 — Structure & size

| # | Rule | State | Check |
|---|---|---|---|
| 1.2.1 | React component file ≤ 300 lines | `WARN` | ESLint `max-lines: 300` for `*.tsx`. Split into subcomponents past the limit. |
| 1.2.2 | Server/API route file ≤ 250 lines | `WARN` | Same lint, scoped to `app/**/route.ts`. |
| 1.2.3 | Utility/lib file ≤ 400 lines | `WARN` | Same lint, scoped to `lib/` and `packages/*/src/`. |
| 1.2.4 | One default export per file (or zero — prefer named) | `WARN` | ESLint `import/prefer-default-export: off`, `import/no-default-export: warn`. |
| 1.2.5 | No barrel re-exports past 2 levels deep | `MANUAL` | Reviewer judgment. Three-level barrels are usually code smell. |
| 1.2.6 | No commented-out code in commits | `BLOCKING` | Pre-commit hook + reviewer check. Per TASTE.md Gate 6. |
| 1.2.7 | No `// TODO: refactor` without a Linear ticket reference | `WARN` | ESLint custom rule (pending — see §10). |

### §1.3 — Naming

| # | Rule | State | Check |
|---|---|---|---|
| 1.3.1 | Files: `kebab-case.tsx` for components, `kebab-case.ts` for everything else | `WARN` | Filename lint via `unicorn/filename-case`. |
| 1.3.2 | Components: `PascalCase` | `BLOCKING` | React lint default. |
| 1.3.3 | Hooks: `useThing` | `BLOCKING` | `react-hooks/rules-of-hooks` enforces. |
| 1.3.4 | Booleans: prefixed `is`/`has`/`should`/`can` | `MANUAL` | Reviewer checklist. |
| 1.3.5 | Constants: `SCREAMING_SNAKE` for module-scope; `camelCase` for in-function | `MANUAL` | Reviewer. |
| 1.3.6 | No generic names (`data`, `info`, `helper`, `utils`) for non-utility surfaces | `MANUAL` | Reviewer judgment. |
| 1.3.7 | Luminor names preserved — never replace with generic agent labels | `BLOCKING` | Manual + grep PR-diff for `Agent\d`, `Worker\d`, etc. Per memory `feedback_luminor_naming_depth.md`. |

### §1.4 — Error handling

| # | Rule | State | Check |
|---|---|---|---|
| 1.4.1 | No empty `catch` blocks | `BLOCKING` | ESLint `no-empty: { allowEmptyCatch: false }`. |
| 1.4.2 | No silent fallback (`catch (e) { return null }`) without a logged reason | `WARN` | Pattern lint; reviewer enforces. |
| 1.4.3 | API routes return typed error responses (Zod-validated error shapes) | `WARN` | Reviewer. |
| 1.4.4 | Production errors flow to Sentry (no swallow) | `WARN` | Per memory `feedback_observability_silent_in_prod.md`. Verify wiring. |
| 1.4.5 | User-facing error messages are honest (never "Something went wrong") | `MANUAL` | Reviewer + TASTE Gate 2 voice. |

---

## §2 — Design

The design rules are owned by [`TASTE.md`](./TASTE.md) and [`DESIGN.md`](./DESIGN.md). This section is the **enforcement contract**: which TASTE gates can be lint-checked vs which require reviewer judgment.

### §2.1 — Token discipline (TASTE Gate 3 + Gate 6)

| # | Rule | State | Check |
|---|---|---|---|
| 2.1.1 | No raw hex in `apps/web/app/**` or `apps/web/components/**` | `ASPIRATIONAL` → target `BLOCKING` | ESLint custom rule blocking `/#[0-9a-f]{3,8}\b/i` outside `tokens.ts`. **Not yet shipped** per TASTE.md line 72 — depends on token migration completion. |
| 2.1.2 | No banned fonts: Inter, Cinzel, Space Grotesk, Arial, Roboto | `BLOCKING` | Lint scan in `apps/web/**`. Per TASTE.md Gate 3. |
| 2.1.3 | Glass-card recipe uses canonical opacity values only | `WARN` | Manual + grep `bg-white/\[0\.\d+\]` outside the canonical pair. |
| 2.1.4 | Framer Motion uses `domAnimation`, never `domMax` | `BLOCKING` | Lint scan: import-from `framer-motion` named-import `domMax`. |
| 2.1.5 | No emoji or Unicode glyphs as UI icons | `WARN` | Manual + regex hint for `✦◈⌥✶⎈` in JSX text. Phosphor SVG only. |
| 2.1.6 | Logo uses `arcanea-mark.jpg`, never `ArcaneanMark.svg` | `BLOCKING` | Lint scan for the SVG path. Per memory `feedback_logo_never_svg.md`. |
| 2.1.7 | Hz frequencies do not appear in user-facing copy | `WARN` | Manual scan for `\d+\s?Hz` in `.tsx` text nodes. Per memory `feedback_hz_identity.md`. |

### §2.2 — Voice (TASTE Gate 2)

| # | Rule | State | Check |
|---|---|---|---|
| 2.2.1 | Banned phrases: elevate, unlock, harness, leverage, "in this digital age", "we believe", "imagine if you could", "powered by AI" | `WARN` | `/voice-check` skill or grep at review time. |
| 2.2.2 | No marketing exclamation marks, no *italicized hype words*, no ALL-CAPS shouting | `MANUAL` | Reviewer. |
| 2.2.3 | Verbs over adjectives; specific numbers over vague claims; present tense | `MANUAL` | Reviewer. |

### §2.3 — Motion (TASTE Gate 3 + memory `feedback_design_tier.md`)

| # | Rule | State | Check |
|---|---|---|---|
| 2.3.1 | Default easing `[0.22, 1, 0.36, 1]` or named: `expoOut`, Apple `[0.16, 1, 0.3, 1]` | `MANUAL` | Reviewer. Never default `easeOut`. |
| 2.3.2 | Stagger children 60ms (≈ 0.06s) for sibling reveals | `MANUAL` | Reviewer. |
| 2.3.3 | One hero motion moment per page; never scattered micro-interactions | `MANUAL` | Reviewer. |
| 2.3.4 | `whileHover={{ scale: 1.05 }}` reserved for ≤1 card per page | `MANUAL` | Reviewer. |
| 2.3.5 | Reduced-motion (`useReducedMotion`) honored for non-essential animation | `WARN` | Lint hint; manual confirm. |

### §2.4 — Layout (TASTE Gate 5)

| # | Rule | State | Check |
|---|---|---|---|
| 2.4.1 | Works at 375px wide before it works at 1920px | `MANUAL` | Reviewer; Playwright viewport test (planned, §10). |
| 2.4.2 | Above-fold = brand mark + one-line value + chat input + trust pills. Nothing else. | `MANUAL` | Reviewer. |
| 2.4.3 | Every page has primary action + secondary action + exit ramp (no dead ends) | `MANUAL` | Reviewer. |

---

## §3 — Performance (TASTE Gate 4)

| # | Rule | State | Threshold | Check |
|---|---|---|---|---|
| 3.1 | Lighthouse mobile Performance | `WARN` → `BLOCKING` for production | ≥ 90 | Lighthouse CI on PR preview deploy. |
| 3.2 | Largest Contentful Paint (LCP) | `WARN` | < 2.5s mobile | Vercel Analytics + Lighthouse. |
| 3.3 | Interaction to Next Paint (INP) | `WARN` | < 200ms | Vercel Analytics. |
| 3.4 | Cumulative Layout Shift (CLS) | `WARN` | < 0.1 | Vercel Analytics. |
| 3.5 | First-load JS for `/` (apps/web) | `WARN` | ≤ 250 KB compressed | Next bundle analyzer in CI. |
| 3.6 | Above-fold interactive elements ≤ 1 (the chat box) | `MANUAL` | — | Per TASTE.md Gate 4. |
| 3.7 | All hero imagery uses `next/image` with `sizes` set | `BLOCKING` | — | Lint: ban `<img>` in `apps/web/app/**` and `apps/web/components/landing/**`. |
| 3.8 | No `pnpm dev` left running during build | `MANUAL` | — | Resource discipline per CLAUDE.md (16GB machine). |
| 3.9 | Production HTML serves analytics + Sentry | `BLOCKING` → currently `WARN` | — | Per memory `feedback_observability_silent_in_prod.md`. Verify post-deploy. |

---

## §4 — Testing

### §4.1 — Coverage targets

| # | Surface | State | Target | Check |
|---|---|---|---|---|
| 4.1.1 | New `@arcanea/*` package code | `WARN` → `BLOCKING` 90 days post-canon | ≥ 80% lines | Vitest + `--coverage`. |
| 4.1.2 | Existing `apps/web` code | `ASPIRATIONAL` | ≥ 60% (then raise) | Tracked, not blocking. |
| 4.1.3 | API routes that take user input | `BLOCKING` | Each route has ≥1 happy + ≥1 invalid-input test | Vitest + Zod fixture. |
| 4.1.4 | New MCP tools | `BLOCKING` | Each tool has ≥1 contract test | MCP-CLI smoke. |
| 4.1.5 | Critical user paths (chat send, library browse, world fork) | `BLOCKING` | Playwright E2E | `pnpm test:e2e`. |
| 4.1.6 | Chrome extension capture | `BLOCKING` | Playwright extension test green | Per Kura `tests/extension.spec.ts`. |

### §4.2 — Test discipline

| # | Rule | State | Check |
|---|---|---|---|
| 4.2.1 | No tests skipped (`.skip`) without a Linear ticket + date in the comment | `BLOCKING` | Lint scan. |
| 4.2.2 | No `console.log` in tests | `WARN` | Lint. |
| 4.2.3 | Test names describe behavior, not implementation (`"returns 401 on missing token"` not `"checks the if statement"`) | `MANUAL` | Reviewer. |
| 4.2.4 | Mocks scoped per-test, never global | `MANUAL` | Reviewer. |
| 4.2.5 | Integration tests prefer real DB over mocks | `MANUAL` | Per memory `feedback_no_mock_db.md` if present (rule pattern). |

---

## §5 — Documentation

### §5.1 — README schema

Every package in `packages/*` and every Arcanea-family repo must have a README with these sections (others optional):

| Section | Purpose | Required? |
|---|---|---|
| Title + one-line description | "What is this?" answer in <80 chars | yes |
| Install | Exact command (`pnpm add @arcanea/foo`) | yes |
| Usage | One minimum working example, copy-pasteable | yes |
| API surface | Public exports, with type signatures | yes for libraries |
| Why | One paragraph: why this package exists vs alternatives | yes |
| License | MIT default unless otherwise noted | yes |
| Status | `BLOCKING` table: production / beta / experimental / archived | yes |

| # | Rule | State | Check |
|---|---|---|---|
| 5.1.1 | Every `packages/*` has a `README.md` matching schema above | `BLOCKING` | CI script: existence + section headings. |
| 5.1.2 | README updated in same PR that changes public API | `BLOCKING` | Reviewer + diff check. |
| 5.1.3 | No `Coming soon` without a date and a Linear ticket | `BLOCKING` | Lint scan; honest-status rule per TASTE Gate 7. |

### §5.2 — `ARCHITECTURE.md` requirement

`ARCHITECTURE.md` is required when:
- The package or app composes 3+ subsystems
- The package implements a non-obvious algorithm (consensus, scheduling, planner)
- The package boundary needs explaining to a new contributor

`ARCHITECTURE.md` is NOT required for:
- Single-purpose libraries (one file, one job)
- Pure utility packages (`@arcanea/utils`, `@arcanea/types`)
- Generated-code packages

| # | Rule | State | Check |
|---|---|---|---|
| 5.2.1 | When required, `ARCHITECTURE.md` covers: what (subsystems), why (rationale), how (data flow), invariants, gotchas | `MANUAL` | Reviewer judgment. |
| 5.2.2 | Diagrams use ASCII or `mermaid` (Markdown-renderable); never PNG-only | `WARN` | Reviewer. |

### §5.3 — In-code comments

| # | Rule | State | Check |
|---|---|---|---|
| 5.3.1 | Default to no comments. Names carry the load. | `MANUAL` | Reviewer per root CLAUDE.md. |
| 5.3.2 | Comment when WHY is non-obvious (hidden constraint, subtle invariant, workaround for known bug) | `MANUAL` | Reviewer. |
| 5.3.3 | Never comment WHAT the code does | `MANUAL` | Reviewer. |
| 5.3.4 | Public package exports have JSDoc (one line minimum; mark `@deprecated` when relevant) | `WARN` | Lint via `eslint-plugin-jsdoc` (planned). |

### §5.4 — Decision logs

| # | Rule | State | Check |
|---|---|---|---|
| 5.4.1 | Major decisions (architecture, brand split, dep upgrade, deprecation) recorded in `docs/decisions/` or `planning-with-files/` | `MANUAL` | Reviewer judgment. |
| 5.4.2 | Decision logs explain WHAT was decided + WHY + WHAT alternatives were rejected | `MANUAL` | Same. |

---

## §6 — API Design

| # | Rule | State | Check |
|---|---|---|---|
| 6.1 | Every public package export is versioned via semver (no breaking changes in patches) | `BLOCKING` | Changesets-style or manual review. |
| 6.2 | Breaking change = major bump + migration note in CHANGELOG | `BLOCKING` | Reviewer + lint of CHANGELOG. |
| 6.3 | Internal APIs marked `@internal` or behind `_*` naming | `WARN` | JSDoc + reviewer. |
| 6.4 | HTTP route shape includes a versioned schema header (`X-Schema-Version` or path `/v1/`) | `WARN` | Reviewer; pattern verified in Kura `/api/kura/import`. |
| 6.5 | Deprecations live for ≥1 minor release before removal; deprecation marked in JSDoc | `MANUAL` | Reviewer. |
| 6.6 | Public API surface area is documented in README §API and tested in §4 | `BLOCKING` | Reviewer. |

---

## §7 — Git Practice (extends CLAUDE.md §Git Discipline)

| # | Rule | State | Check |
|---|---|---|---|
| 7.1 | Commit messages: `type(scope): description` | `BLOCKING` | Husky + commitlint (verify wiring; per CLAUDE.md). |
| 7.2 | Allowed types: feat, fix, docs, refactor, test, chore, perf, ci, build | `BLOCKING` | Commitlint config. |
| 7.3 | Branches: short-lived; prefer worktree over long-lived branch | `MANUAL` | Per memory `feedback_ops_workflow.md` (max 2 worktrees). |
| 7.4 | Never `git add .` — stage specific files | `MANUAL` | Per CLAUDE.md; reviewer scans diffs for unrelated files. |
| 7.5 | Never commit `.env`, secrets, generated dist, large binaries | `BLOCKING` | Pre-commit hook + `.gitignore` correctness + reviewer. |
| 7.6 | Never push to `records` (music studio remote); push to `origin` (arcanea-ai-app) | `BLOCKING` | Manual + CLAUDE.md rule. |
| 7.7 | PRs that change `package.json` MUST update `pnpm-lock.yaml` in same PR | `BLOCKING` | CI: `pnpm install --frozen-lockfile` fails the build. Per memory `feedback_lockfile_drift_pattern.md` (twice broken main in 2 days). |
| 7.8 | Never `--no-verify` on commit, never `--no-gpg-sign` without explicit user permission | `BLOCKING` | Reviewer + harness rule. |
| 7.9 | No mass reverts without diff-scope check (>500 files changed = pause + review) | `MANUAL` | Per memory `feedback_mass_revert_protection.md` (2026-03-11 incident: revert nuked 4,517 files). |
| 7.10 | No `Co-Authored-By: claude-flow/ruvnet` (or similar) in commit messages | `BLOCKING` | Reviewer + lint. Per memory `feedback_no_coauthor_contamination.md` — Arcanea is sovereign. |

---

## §8 — Resource Discipline (16GB machine, extends CLAUDE.md)

| # | Rule | State | Check |
|---|---|---|---|
| 8.1 | Max 4-5 concurrent Claude Code instances | `MANUAL` | Operator awareness. |
| 8.2 | Free RAM < 2 GB → work sequentially, no agent dispatch | `MANUAL` | Check `cat /proc/meminfo` before parallel spawn. |
| 8.3 | Never `pnpm dev` + `pnpm build` simultaneously | `MANUAL` | Operator. |
| 8.4 | No `pnpm dev` left running after UI work ends | `MANUAL` | Operator; kill server. |
| 8.5 | Prefer `model: haiku` for background agents | `MANUAL` | Per CLAUDE.md. |
| 8.6 | Pre-flight `git fetch` before any destructive op in shared worktree | `BLOCKING` | Per memory `feedback_cross_tab_race.md`. |

---

## §9 — Grandfathering

Existing code that violates a `BLOCKING` rule in this canon is grandfathered IFF:
- A `// @canon-grandfathered <YYYY-MM-DD> <linear-ticket>` comment is present, OR
- The file is listed in `.quality-canon-grandfathered.json` at repo root with the same metadata, OR
- The file is in `_archive/`, `legacy/`, or `wiki/` (auto-excluded)

Grandfathered entries expire 180 days after the date stamp. After expiry, CI promotes the rule to `BLOCKING` for that file.

This is honest: we cannot retrofit 198 repos overnight. We can prevent new violations and timebox old ones.

---

## §10 — CI Rule Mapping (what to wire next)

Most rules above mark a target state that **does not yet exist in CI**. This section names what to wire and in what order.

### §10.1 — Tier 1 (highest ROI, lowest effort)

| # | Rule | Wire as | Estimated effort |
|---|---|---|---|
| 1 | 2.1.2 Banned fonts | ESLint `no-restricted-syntax` against literal strings | 30 min |
| 2 | 2.1.4 `domMax` ban | ESLint `no-restricted-imports` | 15 min |
| 3 | 2.1.6 SVG logo ban | ESLint `no-restricted-imports` + pattern | 15 min |
| 4 | 7.7 Lockfile drift | GitHub Action: fail PR if `package.json` changed but lockfile unchanged | 20 min |
| 5 | 7.10 No claude-flow co-author | Husky commit-msg hook | 15 min |
| 6 | 1.4.1 Empty catch blocks | ESLint default | 5 min |
| 7 | 1.2.6 Commented-out code | Reviewer + pre-commit grep | manual |

### §10.2 — Tier 2 (medium ROI, medium effort)

| # | Rule | Wire as | Estimated effort |
|---|---|---|---|
| 8 | 5.1.1 README schema enforcement | GitHub Action: per-package README existence + section headings | 1 hr |
| 9 | 3.1 Lighthouse ≥90 | Lighthouse CI on Vercel preview URL | 2 hr |
| 10 | 4.1.3 API route coverage | Vitest per-file coverage gate | 1 hr |
| 11 | 2.1.1 Raw hex ban (after token migration) | ESLint custom rule | 2 hr |
| 12 | 5.3.4 JSDoc on public exports | `eslint-plugin-jsdoc` | 1 hr |

### §10.3 — Tier 3 (longer-term, foundational)

| # | Rule | Wire as | Estimated effort |
|---|---|---|---|
| 13 | 4.1.5 Critical E2E paths | Playwright workspace + per-surface specs | 1-2 days |
| 14 | 2.4.1 375px viewport check | Playwright mobile viewport test in canary | 1 day |
| 15 | 1.1.6 Zod-at-boundary for all routes | Codemod + manual; per-route migration | 1 week |
| 16 | §9 Grandfathering registry | JSON schema + CI lint that checks expiry | 1 day |

---

## §11 — Application to Satellite Repos

Other Arcanea-family repos (per GROUND_TRUTHS §5) opt into this canon at one of three levels:

| Level | What it means | Repo declares via |
|---|---|---|
| **Full** | All BLOCKING rules apply; CI wired | `package.json` field `"arcaneaCanon": "full"` |
| **Partial** | §7 git + §5 docs + §2.1 banned-tokens apply; rest opt-in | `"arcaneaCanon": "partial"` |
| **None** | Repo is exempt (legacy, experimental, archived) | `"arcaneaCanon": "none"` or unset |

Current targets (proposed; defer until §10.1 tier-1 is wired):
- **Full:** `arcanea-ai-app` (production, blast radius high)
- **Partial:** `arcanea-vault` (Kura), `agentic-creator-os`, `frankx.ai-vercel-website`, `Starlight-Intelligence-System`
- **None:** the 65 stale-not-archived repos (after archive policy decision per GROUND_TRUTHS §2.4)

---

## §12 — Review Checklist (printable)

For any PR review, walk this list. Every "no" gets a comment.

```
[ ]  Branch matches branch discipline (CLAUDE.md, §7.3)
[ ]  Files staged are the only files needed (§7.4)
[ ]  Commit message is type(scope): description (§7.1)
[ ]  No secrets, .env, generated dist (§7.5)
[ ]  package.json + pnpm-lock.yaml moved together (§7.7)
[ ]  Tests added for new behavior (§4.1)
[ ]  Existing tests still pass (CI)
[ ]  TS strict + no new any (§1.1)
[ ]  No banned fonts, no domMax, no SVG logo (§2.1)
[ ]  Glass-card recipe canonical (§2.1.3)
[ ]  Voice passes TASTE Gate 2 (§2.2)
[ ]  Motion follows easing + stagger rules (§2.3)
[ ]  Layout works at 375px (§2.4.1)
[ ]  README updated if public API moved (§5.1.2)
[ ]  ARCHITECTURE.md added/updated if required (§5.2)
[ ]  Decision logged if architecturally material (§5.4)
[ ]  No mass file changes without §7.9 review
[ ]  No Co-Authored-By contamination (§7.10)
```

---

## §13 — Provenance & Authority

- **Authored:** 2026-05-18 by Shinkami (Source Gate Guardian).
- **Synthesizes:** TASTE.md, DESIGN.md, AGENTS.md, root CLAUDE.md, 11 memory feedback files (quality_standard, design_tier, ops_workflow, observability_silent_in_prod, lockfile_drift_pattern, mass_revert_protection, cross_tab_race, no_coauthor_contamination, logo_never_svg, hz_identity, luminor_naming_depth).
- **Authority order:** Direct user instruction > TASTE.md (taste-wins-ties) > DESIGN.md (token truth) > **QUALITY_CANON.md** > AGENTS.md (execution law) > convention.
- **Living document.** Update when a rule promotes from `ASPIRATIONAL` → `WARN` → `BLOCKING`, or when a new failure class is observed.
- **Honesty clause:** Most `BLOCKING` rules above are *intended to block*. As of v0.1.0, only a subset has CI wiring (see §10). The list is honest about gap-between-intent-and-enforcement.

### §13.1 — Re-grade cadence

Quarterly: walk §1-§7 rules. For each:
- Confirm state (ASPIRATIONAL / WARN / MANUAL / BLOCKING)
- Promote when CI wiring catches up
- Demote if a rule proves unenforceable or wrong
- Record promotions/demotions in §14 changelog

### §14 — Changelog

| Date | Change |
|---|---|
| 2026-05-18 | v0.1.0 — Initial canon. ~70 rules across 7 sections. Tier-1 CI wiring (§10.1) is the immediate next step. |
