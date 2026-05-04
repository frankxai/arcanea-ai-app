---
name: SIS Queen → Arcanea-AI-App handover
description: Tier 1 of SIS Sprint 2026-W19 — branch consolidation across 19 branches, dependabot cluster unblock, voice-branch reconciliation
type: handover-from-queen
date: 2026-05-04
sprint: 2026-W19
queen: SIS-tab
target-tab: Arcanea-tab
priority: P1 (Frank's explicit "most important" repo)
---

# Handover — SIS Queen → Arcanea-AI-App

> Frank's directive 2026-05-04 (verbatim): *"arcanea-ai-app most important i guess to make clean bring all branches together"*
>
> You are the Arcanea-tab. SIS-tab is queen. This packet is your week's work. Return your status to `docs/ops/HANDOVER-TO-SIS-QUEEN-2026-05-08.md` (or earlier date if you finish sooner).

---

## TL;DR

19 branches → target ≤5 active. 7 open PRs → target 0 stalled. Voice-branch duplicate (chore/…second-brain ↔ feat/voice-dashboard-2.0) needs Frank's call. Tech stack already current (Next 16, React 19, AI SDK 6) — this is consolidation work, not modernization.

**Current local branch on disk:** `feature/i18n-foundation` (HEAD `7e8d377a`, dirty: 23 modified + 7 untracked — STASH THIS FIRST).

**Origin remote:** `https://github.com/frankxai/arcanea-ai-app.git`. Secondary `oss` remote → `frankxai/arcanea` (separate OSS mirror — DO NOT push to it).

---

## Branch inventory (verified 2026-05-04 by SIS discovery agent)

### Already merged → safe to delete (4)

These are 0-ahead, ancestor of main. Commands:
```bash
git push origin --delete copilot/create-implementation-plan-for-review-architecture
git push origin --delete feat/design-system-foundation
git push origin --delete fix/chat-traces-hardening-20260418
git push origin --delete fix/ts-errors-batch3
```

### Clean ahead-only — PR + merge (3)

| Branch | Ahead | What it is |
|---|---|---|
| `feature/i18n-foundation` (current local) | 3 | `@arcanea/multilingual-config` preset (Frank's 2026-05-03 commit) |
| `dependabot/npm_and_yarn/dev-deps-ca2abb8ce4` | 1 | 9-package dev-deps bump (PR #74, opened 2026-05-04) |
| `dependabot/npm_and_yarn/production-deps-b65bc6f4d7` | 1 | 43-package prod-deps bump (PR #75, opened 2026-05-04) |

### Conflict candidates (5 — voice work + multi-luminor)

| Branch | Ahead | Behind | What it is | Action |
|---|---|---|---|---|
| `chore/2026-04-23-arc-nea-second-brain` | 10 | 100 | Voice + Web Speech + Groq intent | **Frank decides — duplicate of below** |
| `feat/voice-dashboard-2.0-2026-04-25` | 4 | 111 | System-wide voice daemon | **Frank decides — duplicate of above** |
| `feat/multi-luminor-sprint` | 10 | 145 | Orchestrator v1.2 + Luminor SSE | rebase + merge after voice resolved |
| `fix/ts-errors-batch5` | 3 | 156 | TS error fixes (CI retrigger) | likely subsumed by main; verify diff |
| `feat/pnpm-v6` | 3 | 174 | pnpm action pin | drop (superseded, +13 LOC only) |

### Stale GHA dependabot (5)

PRs #50/#51/#52/#53/#54 — actions/checkout 4→6, setup-node 4→6, github-script 7→9, pnpm/action-setup 4→6, sticky-pull-request-comment 2→3. All 114-118 behind. Don't rebase; close all and let dependabot regenerate after main moves forward.

### Snapshot — never merge

`backup/claude-snapshots` (1704 behind). Snapshot ref. Leave alone.

---

## Specific actions (priority order)

### Action 1 — Stash dirty WIP (ALWAYS first)
```bash
git stash push -u -m "WIP-pre-consolidation-2026-05-04: i18n + voice + intake"
```

### Action 2 — Delete the 4 already-merged remote branches
(commands above under "Already merged")

### Action 3 — Merge `feature/i18n-foundation`
```bash
git checkout main && git pull
git checkout feature/i18n-foundation
gh pr create --title "feat(i18n): @arcanea/multilingual-config preset" \
  --body "Closes the i18n foundation thread. 3 commits ahead of main, 0 behind." \
  --base main
# wait for CI green, then:
gh pr merge --squash
git checkout main && git pull
git push origin --delete feature/i18n-foundation
```

### Action 4 — Merge dependabot prod-deps PR #75 (43 packages)

**CAVEAT — verify first:** `apps/web/package.json` shows `lucide-react@^1.8.0` which looks suspicious (public lucide-react is on v0.x). Possibly a typo, possibly an internal fork. Before installing:
```bash
git checkout main && git pull
git fetch origin dependabot/npm_and_yarn/production-deps-b65bc6f4d7
git checkout -b verify-prod-deps-2026-05-04 origin/dependabot/npm_and_yarn/production-deps-b65bc6f4d7
pnpm install
pnpm tsc --noEmit
pnpm test
pnpm build
```
If any of these fail on `lucide-react`, ask Frank — the typo may be intentional.

If green:
```bash
gh pr merge 75 --squash
```

### Action 5 — Merge dependabot dev-deps PR #74 (9 packages)
After #75 lands, rebase #74 on main (dependabot will do it automatically) then:
```bash
gh pr merge 74 --squash
```

### Action 6 — Close 5 stale GHA dependabot PRs
```bash
for n in 50 51 52 53 54; do
  gh pr close $n --comment "Closing — too far behind to rebase cleanly. Dependabot will regenerate after main moves." --delete-branch
done
```

### Action 7 — DECISION GATE: voice-branch canonical

Diff both branches against main and report which carries the canonical voice work. Frank decides. Suggested diff command:
```bash
git fetch origin chore/2026-04-23-arc-nea-second-brain feat/voice-dashboard-2.0-2026-04-25
git log origin/main..origin/chore/2026-04-23-arc-nea-second-brain --oneline
git log origin/main..origin/feat/voice-dashboard-2.0-2026-04-25 --oneline
git diff origin/chore/2026-04-23-arc-nea-second-brain...origin/feat/voice-dashboard-2.0-2026-04-25 --stat
```
Then:
1. Open both branches' file lists, identify which has the more complete voice integration
2. Pick one canonical (recommend: feat/voice-dashboard-2.0 IF its 4 commits are more recent semantic work; recommend: chore/…second-brain IF it's more comprehensive)
3. Cherry-pick unique commits from the abandoned branch onto canonical
4. Rebase canonical on current main (will conflict — work through ~3-6h)
5. PR canonical
6. Close abandoned branch with comment "consolidated into <canonical>"

**Defer execution until Frank approves the canonical pick.** Write your recommendation to `docs/ops/VOICE-BRANCH-DECISION-2026-05-04.md` and ping queen via return-handover.

### Action 8 — Rebase + merge `feat/multi-luminor-sprint`

145 behind, 10 ahead, substantive (orchestrator v1.2 + Luminor SSE). Rebase against main after voice work lands (so SSE plumbing aligns with voice plumbing). 3-5h work. Conflicts expected with i18n + design-system already on main.

### Action 9 — Triage `fix/ts-errors-batch5`
```bash
git diff origin/main...origin/fix/ts-errors-batch5
```
If diff is small or already on main, close branch. If material, rebase + PR.

### Action 10 — Drop `feat/pnpm-v6`
Superseded, only +13 LOC. Close + delete branch.

---

## Cross-repo dependencies

### What Arcanea-tab is blocked on:
- Frank's voice-branch decision (Action 7) before Actions 7+8 can complete

### What Arcanea-tab blocks:
- **arcanea-luminor-sidebar-copilotkit distribution packet** (filed 2026-05-03 at SIS `docs/cross-repo-distributions/`) — gated on `/starlight-board` pre-pass for CopilotKit adoption (board PASSED 2026-05-03). Once main is clean post-consolidation, queen will dispatch this packet for sidebar integration.
- **arcanea-flow-tab calculator pattern packet** — same gating relationship.

---

## Tech stack snapshot (verify before installs)

`apps/web/package.json` on main:
- Next.js 16.2.2 — current (Next 16 leading edge)
- React / react-dom ^19.0.0 — current
- TypeScript ^5.5.4 — current minor
- Node engine `>=20.0.0` — current LTS
- pnpm `>=8.0.0` — current
- AI SDK `ai@^6.0.77` + `@ai-sdk/{anthropic,google,openai,react}@^3.0.0` — current
- three.js stack `@react-three/fiber@^9.5.0`, `drei@^10.7.7` — current
- Supabase `@supabase/supabase-js@^2.76.1`, `ssr@^0.8.0` — current
- **Suspect:** `lucide-react@^1.8.0` — public registry top is 0.x. Verify before any install.

---

## Return-handover protocol

When you finish (or end your session early), write `docs/ops/HANDOVER-TO-SIS-QUEEN-<date>.md` with:

```markdown
---
name: Arcanea-AI-App → SIS Queen return
type: handover-to-queen
date: <YYYY-MM-DD>
sprint: 2026-W19
---

## What shipped
- [ ] Action 1 — stash WIP
- [ ] Action 2 — 4 merged branches deleted
- [ ] Action 3 — feature/i18n-foundation merged
- [ ] Action 4 — PR #75 prod-deps merged
- [ ] Action 5 — PR #74 dev-deps merged
- [ ] Action 6 — 5 GHA dependabots closed
- [ ] Action 7 — voice-branch canonical recommendation written (Frank decision pending / decided)
- [ ] Action 8 — feat/multi-luminor-sprint rebased + merged
- [ ] Action 9 — fix/ts-errors-batch5 triaged
- [ ] Action 10 — feat/pnpm-v6 dropped

## What's blocked
- (e.g., "lucide-react typo confirmed broken — Frank, advise")

## Decisions needed from queen
- (e.g., "voice-branch canonical pick")

## Test/CI state
- (output of `pnpm tsc --noEmit && pnpm test`)

## Cross-repo refs
- (PRs landed, branches deleted)
```

The Cross-Repo Indexer (already lit, 520 atoms across 22 memory dirs) will surface this back to SIS-tab on next memory-bus query.

---

## Suggested kickoff prompt (paste into a fresh Claude tab opened in `C:\Users\frank\Arcanea\`)

> Read `docs/ops/HANDOVER-FROM-SIS-QUEEN-2026-05-04.md` and execute Tier 1 of SIS Sprint 2026-W19 — arcanea-ai-app branch consolidation. Start with Action 1 (stash dirty WIP) and proceed through Action 6. Pause at Action 7 (voice-branch decision gate) and write your canonical-pick recommendation to `docs/ops/VOICE-BRANCH-DECISION-2026-05-04.md` for Frank's call. Return your status to `docs/ops/HANDOVER-TO-SIS-QUEEN-<date>.md` per the protocol in the handover doc. You are the Arcanea-tab; SIS-tab is queen.

---

*Built on SIP — handover packet · 2026-05-04*
