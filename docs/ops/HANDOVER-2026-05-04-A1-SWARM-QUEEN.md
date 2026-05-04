---
name: A1 Swarm Queen — Sprint W19 day 1 close-out
description: End of A1 session 2026-05-04 — cost+hygiene+CI+branch sweep+protection landed, voice Option C deferred per A3's decision doc, Frank carryovers listed
type: handover
date: 2026-05-04
session: A1
sprint: 2026-W19
related:
  - docs/ops/HANDOVER-FROM-SIS-QUEEN-2026-05-04.md
  - docs/ops/HANDOVER-TO-SIS-QUEEN-2026-05-04.md (A3's return)
  - docs/ops/FRANK-DECISIONS-2026-05-04.md
  - docs/ops/VOICE-BRANCH-DECISION-2026-05-04.md
  - planning-with-files/SPRINT_2026-W19_2026-05-04.md
---

# A1 Swarm Queen — close-out

Frank gave me total ownership ("you lead, total swarm queen, ensure excellence"). Tier-1 cost+hygiene+CI shipped. Voice Option C left for Frank's explicit go (high-risk rebase, A3's decision doc requires confirmation).

## Three PRs in flight (all my work, no overlap, mergeable in any order)

| PR | Title | Why merge in this order |
|---|---|---|
| **#78** | salvage CI fix + e2e + eslint pin + repos.json | Merge first → CI signal becomes honest |
| **#76** | cost-and-hygiene W19 — Vercel cache + Dependabot + sprint doc | Merge second → cost discipline before #77's bigger surface |
| **#77** | @starlight/multilingual foundation + Das Mädchen book | Merge third → large feature gets clean cost env |

## What landed today

- **Vercel cost leak fixed** in PR #76 — `VERCEL_FORCE_NO_BUILD_CACHE` removed (every preview was forced cold = primary cost driver), `scripts/vercel-ignore-build.sh` shipped (skips dependabot/backup/worktree/copilot/docs branches and docs-only commits)
- **Dependabot tightened** in PR #76 — groups split by dep-type × update-type, PR limit 5→3, `react`+`react-dom` major-blocked
- **CI accuracy salvaged** in PR #78 — workflows now use `pnpm --dir` instead of broken `npx`, build job correctly depends on `[install, lint]`, eslint 10→9 pinned (root + ai-core + content-api + database)
- **Branch graveyard:** 55 → 9 branches (auto-delete-on-merge already enabled — most cleanup was passive; A1 + A3 surgically removed stragglers)
- **Branch protection enabled** on `main`: linear history required, force-push blocked, deletions blocked, admin bypass allowed
- **Sprint W19 doc** committed to `planning-with-files/SPRINT_2026-W19_2026-05-04.md`
- **Dependabot triage:** PR #75 (43-deps mega) closed, PR #51 (pnpm/action-setup) closed, comment on PR #50 framing decision for #50/#52/#53/#54

## What's blocked on Frank (the 6 calls)

1. **Approve & merge PR #78 → #76 → #77** (in that order ideal but no hard dep)
2. **After #76 lands:** wire Vercel "Ignored Build Step" custom command (`bash scripts/vercel-ignore-build.sh`) in dashboard → Project Settings → Git
3. **Voice canonical pick** — A3's `VOICE-BRANCH-DECISION-2026-05-04.md` recommends Option C. One word from Frank → Option C, go (or A/B with reasoning) → next session executes ~4h rebase+stash apply
4. **GH Actions Dependabot batch decision** (#50/52/53/54 — 13d stale) — see comment on #50
5. **Apr 29 carryovers:** WSL compact admin run, `.npmrc` token rotate, `~/.claude` 18+ uncommitted review, drop concurrent Claude instances 21→≤5
6. **Phase B voice-operator boot** (~30min PowerShell, see FRANK-DECISIONS-2026-05-04.md §4) — independent of branch consolidation

## What's deferred (next session)

- **Voice Option C execution** — needs Frank's go. Will produce 3 PRs (voice / book / meta) and close 2 stale voice branches. ~4h with conflict resolution.
- **i18n Phase 2** — apps/web integration of `@starlight/multilingual` (en+de homepage+library+about). Spec ready at `PLAN_MULTILINGUAL_PHASE2_APPS_WEB_2026-05-03.md`. ~4-6h fresh worktree.
- **CI green (post-#78)** — even with the workflow fix, TS + ESLint will surface real errors that need separate triage. Will quantify after #78 merges and CI runs honest.
- **`feat/multi-luminor-sprint`** — orchestrator v1.2 + Luminor SSE plumbing. 10 ahead, 145 behind main. Per A3: rebase after voice work lands so SSE plumbing aligns. ~3-5h.
- **`fix/ts-errors-batch5`** — 156 behind main, likely small remaining diff. Triage post-voice.
- **PR #33 (`feat/pnpm-v6` draft)** — was blocked by action-setup v6 issue. Decision: revive or close. After #76 lands.

## Repo coordination model (locked, ship)

```
Frank (decisions, gate)
    ↓
Lumina/Opus session (swarm queen, orchestrator) — ONE active at a time
    ↓
Subagents (Sonnet/Haiku) in worktrees — parallel, isolated branches
```

State distribution:
- **`planning-with-files/SPRINT_*.md`** — engineering execution truth
- **Notion** — Gate status mirror only (pipeline cold 12+ days, restore P1)
- **Obsidian** — wisdom capture
- **`MEMORY.md`** — persistent preferences/rules

Latest May 2026 best practice: subagents inside one Claude Code instance > multiple full instances. RAM constraint enforced. Frank's `feedback_ops_workflow` rule: max 4-5 instances ever.

## Sprint W19 status (Mon evening)

| Tier | Item | Status |
|---|---|---|
| P0 | Vercel cost fix | PR #76 — awaiting merge |
| P0 | Dependabot tighten | PR #76 — awaiting merge |
| P0 | CI accuracy | PR #78 — awaiting merge |
| P0 | i18n Phase 2 | spec ready, blocked on #77 merge |
| P1 | Capture pipeline diagnose | not started |
| P1 | Gate 0 €1 decision | due Wed EOD — Frank only |
| P1 | WSL compact / token rotate / .claude commit | Frank only |
| P2 | arcanea-flow / arcanea-realm / frankx.ai-vercel-website / arcanea-platform triage | not started — needs Frank's archive-or-revive call |
| P2 | SIS GitHub Releases v7 metadata fix | not started |

## Cross-repo state (memory-verified, disk-checked)

- **arcanea-ai-app** — 8 active branches, 3 PRs awaiting Frank, branch protection live
- **Starlight-Intelligence-System** — v7.2.0 clean per Apr 23 audit, GitHub Releases stale at v3 (P2 fix)
- **oh-my-arcanea** — dev branch, 13 changed, untouched today
- **arcanea-vault / arcanea-orchestrator / arcanea-code** — minor dirty WIP per registry, untouched today
- **Messy four** (arcanea-flow, arcanea-realm, frankx.ai-vercel-website, arcanea-platform) — untouched, awaiting per-repo triage
- **arcanea-records** — clean per registry

## What I did NOT do (deliberate)

- **Voice Option C** — A3's decision doc explicitly requires Frank's "Option C, go" before execution. Honored.
- **Multi-luminor rebase** — 145 commits behind, Frank's strategic call needed (W19 vs W20)
- **Repo hygiene wave on the messy four** — needs Frank's archive-or-revive call per repo
- **Anything destructive on `~/.claude`** — Frank's pending work there, not mine to touch
- **Vercel project audit / cost dashboard** — needs Frank's Vercel access
- **i18n Phase 2 execution** — blocks on #77 merge first

## Memory updates this session

A3 created `feedback_audit_before_stash.md` — already in MEMORY.md. The rule was earned by this exact session: handover said "stash dirty WIP" and the WIP turned out to contain the CI fix. Lesson encoded.

No other memory updates needed. The decisions in this handover are tactical, not preference-shifting.

---

*A1 close · 2026-05-04 · Built on SIP*
