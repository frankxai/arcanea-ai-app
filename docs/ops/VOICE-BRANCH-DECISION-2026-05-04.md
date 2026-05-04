---
name: Voice-branch canonical decision (Frank-required)
description: Recommendation for which of three local voice branches becomes canonical, and what to do with the kitchen-sink content on chore/...second-brain
type: decision-doc
date: 2026-05-04
sprint: 2026-W19
status: AWAITING-FRANK
recommendation: Option C — feat/voice-dashboard-2.0 canonical, salvage book + meta docs separately
related:
  - docs/ops/HANDOVER-FROM-SIS-QUEEN-2026-05-04.md
  - docs/ops/VOICE-WIP-RECOVERY-2026-05-04.md
---

# Voice-branch canonical decision

SIS Queen Action 7 of Sprint 2026-W19. Three local branches contain overlapping voice work; one stash contains 1,613 more lines that need a home.

## What we have

| Branch | Ahead | Behind | LOC added | Scope |
|---|---|---|---|---|
| `chore/2026-04-23-arc-nea-second-brain` | **10** | 90 | **+6,112** | Voice (Web Speech + Groq Llama + Dashboard 2.0 + premium polish) **+ Las Tierras de Luz book (3 chapters, cover, BIBLE) + ecosystem map + ClawHub porter + audits** — kitchen-sink |
| `feat/voice-dashboard-2.0-2026-04-25` | 4 | 101 | +3,214 | Voice Dashboard 2.0 web UI + Web Speech + Groq + premium polish + system-wide daemon. Pure voice. |
| `feat/voice-daemon-2026-04-25` | 1 | 100 | +440 | System-wide daemon only. Subset of feat/voice-dashboard-2.0. |
| stash@{0} `voice-wip-2026-05-04-from-i18n-foundation` | — | — | +1,613 | New `workflows.mjs` (445 LOC, named recipes) + `workflows.test.mjs` (284) + 884 LOC server/persona/tools/web expansion |

## How they overlap

Voice commits are nested:

```
feat/voice-daemon-2026-04-25 (1)  ⊂  feat/voice-dashboard-2.0-2026-04-25 (4)  ⊂  chore/...second-brain voice subset (4 of 10)
```

The Web Speech + Groq Llama + premium polish commits appear on both `chore/...second-brain` (as `fa31f2b2`, `b5575cbc`) and `feat/voice-dashboard-2.0` (as `e96e8fc5`, `c07f8f71`) — same commit messages, different SHAs (cherry-picked, not shared history).

`chore/...second-brain` ALSO carries:
- `book/las-tierras-de-luz/` — 3 Spanish chapters + BIBLE + 777 KB cover (completely unrelated to voice; this is a children's book in the Veldoria realm)
- `wiki/meta/arcanea-ecosystem-map.md` (314 LOC)
- `wiki/meta/openclaw-integration.md` (317 LOC)
- `wiki/meta/openclaw-substrate-distribution.md` (370 LOC)
- `scripts/port-skill-to-clawhub.mjs` (248 LOC)
- 3 audit docs

`feat/voice-daemon-2026-04-25` is pure overlap with `feat/voice-dashboard-2.0` — its single unique commit (`ce861388`) is the same daemon feature also present on `feat/voice-dashboard-2.0`.

## Three options

### Option A — Surgical separation (cleanest, ~6h)

1. Create `feat/voice-canonical-2026-05-04` from main HEAD
2. Cherry-pick the four voice commits from `feat/voice-dashboard-2.0` (most recent SHAs)
3. `git stash apply stash@{0}` on top — resolve conflicts with `workflows.mjs` if any
4. Push, PR
5. Create `feat/las-tierras-book-2026-05-04` from main, cherry-pick the book commit (`eff705cd`), PR separately
6. Create `docs/ecosystem-meta-2026-05-04` from main, cherry-pick the wiki/meta + audit + porter commits, PR separately
7. Close all three voice branches with comment pointing to the new ones

**Pros**: clean PR boundaries, each concern reviewable on its own, no rebase conflicts on the way in.
**Cons**: 6+ hours, requires discipline on conflict resolution if voice WIP overlaps `workflows.mjs`-named files.

### Option B — Promote chore/...second-brain wholesale (fastest, ~3h, dirty)

1. Rename `chore/2026-04-23-arc-nea-second-brain` → `feat/voice-and-second-brain-2026-04-23`
2. `git rebase main` — expect heavy conflicts (90 commits behind, touches voice + book + meta)
3. `git stash apply stash@{0}` on top
4. Push, single PR with everything
5. Close the other two voice branches

**Pros**: one PR, one rebase, all the work survives.
**Cons**: PR is 7,700+ LOC across unrelated concerns (voice + book + meta); reviewer pain; if any one piece blocks, all blocked. Goes against PR-per-concern hygiene.

### Option C — Recommended: feat/voice-dashboard-2.0 canonical, others salvaged separately (~4h)

1. Make `feat/voice-dashboard-2.0-2026-04-25` the canonical voice branch
   - `git checkout feat/voice-dashboard-2.0-2026-04-25`
   - `git rebase main` (101 commits behind — moderate conflicts expected, mostly around the voice files since `chore/ci-and-e2e-fixes` already shipped repos.json)
   - `git stash apply stash@{0}` — apply 1,613-line voice WIP (workflows.mjs is net-new there)
   - Resolve conflicts (likely in `arcanea-voice/src/server.mjs`, `package.json`)
   - Push, PR
2. Salvage from `chore/...second-brain` ONLY the non-voice commits:
   - `eff705cd feat(book/legends): Las Tierras de Luz — Veldoria realm + 3 chapters + NB2 cover` → `feat/las-tierras-book-2026-05-04`
   - `054ca498 feat(ecosystem): Arcanea ecosystem map + ClawHub porter script` + meta + audit commits → `docs/ecosystem-meta-2026-05-04`
3. Close `chore/2026-04-23-arc-nea-second-brain` + `feat/voice-daemon-2026-04-25` with comment pointing to new branches.

**Pros**: clean PR boundaries (voice / book / meta) without 6h of cherry-pick choreography, voice canonical is the most recent + has the daemon. Las Tierras book reaches review faster (it's been sitting since 2026-04-25).
**Cons**: still requires rebasing 101 commits of voice on top of main; some conflict pain inevitable.

## Recommendation: Option C

Reasoning:
- `feat/voice-dashboard-2.0-2026-04-25` is the **most recent** voice branch (4 days newer than chore/...second-brain). Newer wins by default for active feature work unless older has unique substantive commits — it doesn't here.
- The system-wide daemon is the **most differentiating feature** in the voice work (clap anytime even browser-closed). It lives on this branch.
- The book and meta-docs on `chore/...second-brain` are **legitimately unrelated** to voice. Bundling them in a voice PR would be a hygiene violation (Frank's preference: "PR per concern").
- Las Tierras de Luz book has been sitting unmerged since 2026-04-25 — extracting it to its own PR is a win regardless of voice decision.

## What's needed from Frank

A single line: **"Option C, go"** (or A/B with reasoning).

Once chosen, I will:
1. Execute the rebase + stash apply for canonical voice branch
2. Resolve conflicts (will document any unrecoverable ones)
3. Salvage book + meta to their own branches
4. Open three PRs (voice / book / meta), close two voice branches
5. Update return handover to SIS Queen

**Before any push**, I'll show the rebase result + stash apply result for confirmation.

---

*Built on SIP — decision doc · 2026-05-04*
