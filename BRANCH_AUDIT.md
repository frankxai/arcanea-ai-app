# Branch Audit — arcanea-ai-app

**As of:** 2026-08-30
**Baseline:** `main` @ 41b76f90
**Method:** every branch diffed against `main`, then cross-referenced against its pull-request outcome. "Unlanded" = files the branch touched that still differ from `main` today. Counts are per-file, not per-date.

This file is new. It exists because 19 pull requests were closed in this repo in a single batch on 2026-08-09, on staleness alone, without anyone checking whether the work had landed. Most of it had not. This is the canonical protection list for the repo; it mirrors the conventions of `BRANCH_AUDIT.md` in `frankx.ai-vercel-website`.

Deletion is reversible until GitHub garbage-collects the ref (typically weeks). Revive with `git checkout origin/<branch>`.

## DO-NOT-DELETE — protected branches

**This section outranks any other cleanup list, in this repo or outside it.**

If you are an automated prune, a cleanup agent, or a human running a batch: read these four rules before you close or delete anything. They are not advisory.

1. **Never close a pull request or delete a branch on age alone.** A date filter cannot tell the difference between work that landed and work that was forgotten. Both look stale. Only one is safe to remove.
2. **Check whether the idea is in `main` first.** The test is per-file, not per-date: for every file the branch touched, is the branch's version already byte-identical to `main`'s? If any file still differs, the branch holds the only copy of that work and you may not delete it. `git cherry main <branch>` marking every commit `+` means nothing landed.
3. **A human KEEP comment is an absolute veto.** If Frank has commented KEEP, or anything meaning KEEP, on a pull request or a branch, that decision stands until Frank himself reverses it. No staleness rule, no batch job, and no agent overrides it. This rule exists because it was broken twice in the sibling repo — `frankx.ai-vercel-website` PRs #243 and #473 both carried an explicit "KEEP. Unique work stays on this branch." and both were closed anyway.
4. **Every branch in the table below is off-limits.** Do not delete it and do not close its pull request. If you believe one should go, say so and stop — the decision is Frank's.

A closed pull request is not permission to delete its branch. Closing is a review outcome; deleting destroys the work.

All 17 branches below were verified present on the remote on 2026-08-30.

| Branch | PR | Last commit | Unlanded | Why it is protected |
|---|---|---|---|---|
| `codex/arcanea-cinematic-book` | 314 (open) | 2026-08-30 | 133 | **The Last Free Path** — a complete, unpublished 32-chapter novel plus its storefront. 133 files exist only here. Deleting this branch destroys the manuscript. |
| `agent/meridian-world-entry` | 231 (open) | 2026-08-20 | 27 | Saga: entry into the Meridian. Open pull request; 27 files exist only here. |
| `integrate/agent-native-main-2026-06-12` | — | 2026-07-11 | 704 | Agent-native integration line. **Shares no merge base with `main`** — an unrelated history, so a merge-base diff reports 0 and looks empty. It is not empty: 704 files differ. Any tool that measures this branch by merge-base will misread it as safe. |
| `agent/hermes/living-codex-forge` | — | 2026-07-17 | 16 | Living Codex forge. Never opened as a pull request; every touched file still differs from `main`. |
| `agent/claude/arcanea-linkfix` | 184 | 2026-07-02 | 44 | Repairs **111 broken internal links**, dead externals, metrics truth, subscriber capture. Closed unmerged — the site still has the broken links. |
| `claude/arcanea-lore-worldbuilding-ic9exp` | 177 | 2026-06-26 | 24 | **Lost canon: "The Convergent"** — Arcanea's keeper-of-balance, plus lore vector ingestion. Closed unmerged; this character exists nowhere else. |
| `claude/design-skills-management-q19b59` | 186 | 2026-07-06 | 29 | Design-system primitives: `ShaderGradientBackground`, `LiquidGlassButton`. Closed unmerged. |
| `claude/arcanea-web3-marketplace-op4qnl` | 175 | 2026-06-23 | 33 | Web3 agent-swarm marketplace, Wave 0+1 — protocol plus EVM contracts. Closed unmerged. |
| `claude/arcanea-crowd-machine-qd4f85` | 185 | 2026-07-02 | 13 | Season 0 Worldsmith Trials — crowd strategy, spec, ledger, judge pipeline. Closed unmerged. |
| `claude/arcanea-kraken-monster-system-t24p73` | 173 | 2026-07-01 | 14 | Nethyssa DAM and Creature Atlas foundation. Closed unmerged. |
| `agent/hermes/music-dna-academy` | 199 | 2026-07-17 | 6 | Music DNA track quests for Gates 1–2. Closed unmerged. |
| `claude/premium-web-os-system-vfsfgh` | 180 | 2026-06-30 | 11 | Design Lab flagship route and its Arcanea binding. Closed unmerged. |
| `claude/arcanea-motion-system-gsap` | 176 | 2026-06-26 | 4 | GSAP foundation — the reduced-motion-safe scroll-cinematic layer. Closed unmerged. |
| `claude/arcanea-redesign-6pages` | 161 | 2026-06-22 | 11 | Mobile, motion and copy elevation across all six core pages. Closed unmerged. |
| `agent/guardian-fail-closed-20260725` | 209 | 2026-07-25 | 4 | Isolates guardian review behind trusted execution — a CI safety change. Closed unmerged. |
| `claude/arcanea-mobile-e2e-refinements` | 178 | 2026-06-26 | 4 | E2E-verified mobile refinements plus a guardians Image fix. Closed unmerged; 4 of 6 touched files still differ from `main`. |
| `agent/hermes/owl-academy-scroll-preview` | 197 | 2026-07-16 | 13 | Design Lab: Owl Flight immersive scroll. Closed unmerged. |

## Safe to delete — verified 2026-08-30

Nothing here is queued. This repo has no branch-deletion workflow; deletion is a manual act and it is Frank's call.

| Branch | Last commit | Unlanded | Verdict |
|---|---|---|---|
| `chore/ecosystem-weekly-refresh` | 2026-08-17 | 1 | **Safe.** Its single commit is an automated weekly regeneration of `apps/web/lib/ecosystem/derived.ts`. The one differing file is generated output that the refresh workflow rebuilds on demand, so nothing original is lost. |

### Rejected safe-delete candidate

| Candidate | Verdict | Evidence |
|---|---|---|
| `staging/madrid-2026-05-25` | **Not safe — do not delete** | Shares no merge base with `main`. 1,773 commits and 782 files differ, including `.arcanea/lore/` canon documents — godbeast and scene staging files among them. The GitHub compare view reports a misleadingly small "34 ahead" because the histories are unrelated. This is a full independent save-point, not a stale topic branch. |

## Keeping this file true

Regenerate whenever branches are deleted or a batch of pull requests lands. The three measurements that matter, in order: pull-request outcome per branch, per-file unlanded count against `main`, and — for any branch with no merge base — a direct `git diff main <branch>`, because merge-base arithmetic reports zero on unrelated histories and will hide real work.
