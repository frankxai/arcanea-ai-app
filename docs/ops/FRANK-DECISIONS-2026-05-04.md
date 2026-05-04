---
name: Frank-only items — 2026-05-04 end of session A3
description: Five decisions / actions blocked on Frank to unblock Sprint 2026-W19 consolidation
type: frank-only
date: 2026-05-04
sprint: 2026-W19
priority: P1
---

# Frank, your 5 items

Audit + safe consolidation done. The following 5 items only you can do. Listed shortest-first.

## 1. Approve push + PR of salvage branch (10 sec)

Local branch `chore/ci-and-e2e-fixes-2026-05-04` has 1 commit:
- CI fix (`needs: [install, lint]` on build job — closes silent-pass mode)
- 6 e2e LiquidGlass selector migrations
- eslint 10→9 pin (root + 3 sub-packages, ajv exact pin)
- `.arcanea/config/repos.json` registry refresh (oh-my-arcanea retitled per Ecosystem Canon)

13 files, +117/-54. Pre-commit passed. Not pushed yet.

**Say**: "push it" → I push + open PR.

## 2. Pick canonical voice branch (1 min read)

Read: `docs/ops/VOICE-BRANCH-DECISION-2026-05-04.md`

Three options. My recommendation: **Option C** (feat/voice-dashboard-2.0 canonical; salvage Las Tierras book + meta docs from chore/...second-brain to separate branches).

**Say**: "Option C, go" (or A/B with reasoning) → I execute the rebase + stash apply + book/meta extraction.

## 3. Merge PR #76 (cost-hygiene) — 30 sec + 1 min Vercel UI

[PR #76](https://github.com/frankxai/arcanea-ai-app/pull/76) is the gate that unblocks 5 dependabot PRs. Three things in one:
- Removes `VERCEL_FORCE_NO_BUILD_CACHE: 1` global → Vercel preview cache returns
- New `scripts/vercel-ignore-build.sh` skips preview builds for dependabot/backup/docs branches
- Dependabot config: groups split by patch/minor + production/dev, limit 5→3, react+react-dom locked

**Manual step after merge**: Vercel dashboard → Project Settings → Git → Ignored Build Step → custom command:

```
bash scripts/vercel-ignore-build.sh
```

This is project-config, can't be set from `vercel.json`.

After #76 lands, I close PR #74 + #50/#52/#53/#54 in one batch, drop `feat/pnpm-v6` (#33 draft).

## 4. Phase B voice-operator boot (~30 min PowerShell)

From `.intake/03.05 status and intake.txt` (A1 session). Still pending. Blocking Tier 1 #5 (streaming swarm trace UI in /chat) and the homepage demo video slot.

```powershell
cd C:\Users\frank\Starlight-Intelligence-System\private\voice-operator
copy .env.template .env
notepad .env                                  # paste OPENROUTER_API_KEY
.\install.ps1 -TextMode                       # skips Picovoice/Whisper
.\run.ps1                                     # boots :7373
curl http://127.0.0.1:7373/healthz            # verify 200

# Then in Arcanea repo:
echo COGNITION_BRIDGE_URL=http://127.0.0.1:7373/api/utterance >> apps\web\.env.local
```

Independent of branch consolidation. Can be tonight or this week.

## 5. Strategic call — multi-luminor-sprint priority (when ready)

Branch `feat/multi-luminor-sprint` is **10 commits ahead, 145 behind main**. Substantive: orchestrator v1.2 + Luminor SSE plumbing. SIS Queen handover §144 said "rebase against main after voice work lands (so SSE plumbing aligns with voice plumbing)." 3-5h work, conflicts expected with i18n + design-system already on main.

**Question**: Is this still a P1 for this sprint, or does it move to W20?

The Luminor SSE work would compound nicely with the voice canonical (item 2) — both are real-time streaming concerns. If you want them coupled, finish voice first, then rebase multi-luminor on the voice-merged main. If not, defer.

---

## Summary table

| # | Item | Time | Status |
|---|---|---|---|
| 1 | Push + PR salvage branch | 10 sec word | Branch ready locally |
| 2 | Pick voice canonical | 1 min read | Decision doc ready |
| 3 | Merge PR #76 + wire Vercel | 30 sec + 1 min | Already open |
| 4 | Boot voice-operator :7373 | ~30 min PowerShell | Independent |
| 5 | Multi-luminor priority call | 1 min thought | When you're ready |

Items 1-3 unblock the entire Sprint W19 cleanup. Items 4-5 are additive.

---

*Built on SIP — Frank decisions doc · 2026-05-04*
