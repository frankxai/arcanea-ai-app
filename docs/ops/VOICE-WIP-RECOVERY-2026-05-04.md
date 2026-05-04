---
name: Voice WIP recovery — 2026-05-04
description: How to recover the 884+729 lines of voice work stashed during SIS Sprint 2026-W19 consolidation, and which canonical voice branch should absorb it
type: recovery-doc
date: 2026-05-04
sprint: 2026-W19
related:
  - docs/ops/HANDOVER-FROM-SIS-QUEEN-2026-05-04.md (SIS Queen handover that triggered consolidation)
  - docs/ops/VOICE-BRANCH-DECISION-2026-05-04.md (canonical-pick recommendation, Frank decides)
---

# Voice WIP Recovery

During SIS Sprint 2026-W19 consolidation on `feature/i18n-foundation`, the working tree had ~1,600 lines of uncommitted voice work that did **not** belong to PR #77 (multilingual-config). That work was stashed — not lost — pending a Frank decision on which of three voice branches becomes canonical.

## What is in the stash

Stash name: `voice-wip-2026-05-04-from-i18n-foundation`

Files (all under `packages/arcanea-voice/`):

| File | Status | Lines |
|---|---|---|
| `bin/voice.mjs` | modified | +5 / -1 |
| `package.json` | modified | +3 / -1 (adds `test:workflows` script + workflows.test to test chain) |
| `src/persona.mjs` | modified | +79 / -0 (new persona modes) |
| `src/server.mjs` | modified | +611 / -0 (substantive server expansion) |
| `src/tools.mjs` | modified | +26 / -0 |
| `src/workflows.mjs` | **new** | 445 lines (named workflow recipes — solves "Jarvis tried to install before checking" by routing model intent → deterministic workflow rather than per-tool keyword association) |
| `test/tools.test.mjs` | modified | +5 / -0 |
| `test/workflows.test.mjs` | **new** | 284 lines |
| `web/client.mjs` | modified | +134 / -0 |
| `web/index.html` | modified | +19 / -0 |
| `web/style.css` | modified | +79 / -0 |

Total: **+1,613 lines, -2 lines** across 11 files. Substantive feature work, not WIP scraps.

## How to recover

```bash
# Inspect without applying
git stash show -p stash@{0} | less

# List all stashes (look for the named one)
git stash list | grep voice-wip-2026-05-04

# Apply on top of CURRENT branch (keeps stash entry)
git stash apply stash@{N}   # where N is index of named stash

# Apply and drop stash (one-shot)
git stash pop stash@{N}
```

> **Do not `git stash apply` onto the wrong base.** This stash was taken with `feature/i18n-foundation` HEAD `7e8d377a` as base. Applying to a stale `chore/2026-04-23-arc-nea-second-brain` (10 ahead, 100 behind main) will conflict heavily.

## Which branch should absorb this work?

There are three candidate voice branches:

| Branch | Ahead | Behind | What it has |
|---|---|---|---|
| `chore/2026-04-23-arc-nea-second-brain` | 10 | 100 | "real voice control — Web Speech + Groq Llama intent classifier", "Dashboard 2.0 — multi-agent visualizer + workflows + ⌘K + adaptive clap", premium-tier motion polish |
| `feat/voice-dashboard-2.0-2026-04-25` | 4 | 111 | "system-wide daemon — clap anytime, even with browser closed", + the same voice-control + premium-tier polish commits as above |
| `feat/voice-daemon-2026-04-25` | 1 | (smaller) | system-wide daemon only |

The two larger branches **share commits** (`feat(voice): real voice control` and `polish(voice): premium-tier motion`), so they're not fully orthogonal — likely a fork/rebase pair.

The stashed WIP introduces `src/workflows.mjs` (named recipes for ops). The `chore/...second-brain` branch's commit message mentions "workflows" as part of Dashboard 2.0 — there may be conflicts. The `feat/voice-dashboard-2.0` branch has a `voice-daemon.bat`/`voice-daemon.mjs` that the dirty WIP appears to delete (-22, -92 lines) — almost certainly a refactor.

Frank's decision needed (see `VOICE-BRANCH-DECISION-2026-05-04.md` for the recommendation).

Once a canonical branch is chosen:
1. `git checkout <canonical>`
2. `git stash apply` the named stash
3. Resolve conflicts (file-by-file; the workflows.mjs file is most likely to be net-new there)
4. Commit + rebase against `main` if behind
5. PR

## Why this work was salvaged separately

The dirty 884+729 lines were not in any of the open PRs (#76 cost-hygiene, #77 multilingual-config). They appeared on this disk as uncommitted overlay on `feature/i18n-foundation` HEAD — almost certainly a prior session's voice work that never reached a branch before the next session pivoted to i18n.

Stashing (rather than committing-to-i18n-foundation or losing-via-checkout) preserves the work while letting the i18n PR land cleanly. The CI fix + e2e fixes that were also dirty WIP went onto `chore/ci-and-e2e-fixes-2026-05-04` (separate concern, cleaner PR boundary).

---

*Built on SIP — recovery doc · 2026-05-04*
