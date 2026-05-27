# CURRENT CHANGELOG — 2026-05-27

> What landed during the L99 god-mode sweep. Use this as the canonical "what changed today" record.
> Supersedes `CURRENT_CHANGELOG_2026-05-21_AGENT_SURFACES.md` as the latest changelog reference.

---

## Sweep summary

| Stream | Status | Artifacts |
|---|---|---|
| FrankX Madrid demo prep | 🟢 Delivered via parallel session | 4 commits pushed origin, wake-up briefing written, deploy-fix landed |
| Arcanea ecosystem PR | 🟢 PR #134 opened | Supersedes PR #108 (converted to draft) |
| Planning-with-files refresh | 🟢 4 new docs | CURRENT_STATE, CURRENT_BACKLOG, CURRENT_CHANGELOG, AGENT_EXECUTION_PROTOCOL |
| Marketplace multi-runtime audit | 🟢 Gap mapped | Design proposal in BACKLOG |
| Models.yaml state | 🟢 Verified May-2026-current | Opus 4.6→4.7 upgrade flagged in BACKLOG |
| Live surface verification | 🟢 22/22 arcanea.ai + 3/3 sister sites + 8/8 Madrid demo tabs | All 200 |

---

## What landed — Arcanea repo

### PR #134 opened (draft)
**Title:** feat(ecosystem): orchestrator pipeline + 3 explorer views + design token enforcement (supersedes #108)
**Branch:** `fix/deploy-skip-without-vercel-token` (33 commits, will rename when accepted)
**URL:** https://github.com/frankxai/arcanea-ai-app/pull/134

Carries the same scope as the stale PR #108 plus the May follow-on work that accumulated locally:
- 10 new files in `packages/orchestrator/src/ecosystem/` (schema, scan-monorepo, scan-siblings, enrich-github, infer-status, merge, write, build, verify, cli)
- 3 explorer views on `/ecosystem` (Layered, Ten Gates, Arc⊕Nea) + UI primitives
- CI: ecosystem-verify gate + weekly-refresh cron
- Strict raw-hex design-token linting (warn → error)
- Agent surface telemetry (`pnpm agents:surface[:watch]`)
- Antigravity-aligned orchestrator runtime routing
- arcanea-cli adapter to derived.ts; duplicate repo-registry removed

### PR #108 superseded
- Commented with supersede notice + cross-link to #134
- Converted from "Ready" → "Draft" so reviewer focus single-tracks on #134
- Decision tree for #108: close after #134 merges, OR cherry-pick uniquely-valuable bits to #134 review thread

### Planning-with-files refresh
Four new docs written this sweep:
- `CURRENT_STATE_2026-05-27.md` — disk-verified Arcanea ecosystem state (replaces 5-week-stale CURRENT_STATE_2026-04-21_CORTEX.md)
- `CURRENT_BACKLOG_2026-05-27.md` — pending decisions + tasks (this sweep + carryover)
- `CURRENT_CHANGELOG_2026-05-27.md` — this doc
- `AGENT_EXECUTION_PROTOCOL_2026-05-27.md` — forward path for autonomous + interactive sessions

---

## What landed — FrankX repo (parallel session lane)

Five commits pushed to FrankX origin/main during this sweep (delivered by parallel autonomous session, surfaced and bundled in by L99 sweep):

| Commit | Title | Madrid impact |
|---|---|---|
| `6e5d0344` | docs(madrid): pivot Thursday demo for Google AI Live Madrid audience | Demo plan v2 — 22 min, 4 demos, Antigravity 20% of spine |
| `56cf2669` | feat(inner-circle): pricing decision implementation | June 1 launch unblocked |
| `4efec05e` | content(partnerships/google): add Antigravity as daily multi-model agentic surface | Google partner page reflects daily AG use |
| `d9d6aa7c` | content(newsletters): polish Issues 2-4 with live pricing + Google AI Live thread | Issue 2 send-ready |
| `b4d7db37` | fix(turbopack): serverExternalPackages += marked + isomorphic-dompurify + dompurify | **Fixes /workshops/ikigai-branding 500** |

Plus prod-repo deploy commit `770543d5` to `frankx.ai-vercel-website` triggering `dpl_3jbY...` build.

Wake-up briefing written at `~/FrankX/docs/ops/WEDNESDAY-2026-05-27-MORNING-BRIEFING.md` (~9 KB, post-corrections from parallel-session edits).

---

## What landed — disk artifacts (not in any repo)

| Artifact | Path | Purpose |
|---|---|---|
| 5 sites HTML snapshots | `~/madrid-demo-snapshots/` | 824 KB offline-insurance for Madrid Wi-Fi-flaky |
| Demo 3 staging folder | `~/FrankX/content/staging/visual/demo-batch/` | Awaits Frank's 5–8 PNGs |
| Demo 4 video README | `~/FrankX/_inbox/video/DEMO4-README.md` | Awaits Frank's raw.mp4 |

---

## Verified GO surfaces (all 200, disk-truth)

**arcanea.ai (22/22 sampled):** `/`, `/worlds`, `/imagine`, `/chat`, `/library`, `/ecosystem`, `/kura`, `/realms`, `/agents`, `/about`, `/manifesto`, `/showcase`, `/models`, `/cockpit`, `/companions`, `/forge`, `/academy`, `/books`, `/music`, `/intelligence`, `/dawn`, `/lumina`

**Sister sites (3/3):** animelegends.ai, vibeclubs.ai, starlightintelligence.org

**Madrid demo URLs (15/15) + GitHub repos (2/2):** all surfaces in MADRID-OPERATING-PLAN §3 verified, plus a `/workshops/ikigai-branding` 500-fix shipped to prod and building.

---

## Verified NO-GO / WATCH surfaces

| Surface | Status | Owner |
|---|---|---|
| arcanea.ai `/about` voice (`journey`, `unlock`) | 🟡 mythology-context ambiguous, needs Frank ratification | Frank decision in BACKLOG |
| PR #108 (stuck 16 days) | 🟡 marked superseded, converted draft, awaits explicit close | Frank close after #134 |
| PR #121 (Dependabot Lighthouse warn) | 🟡 mergeable but unstable | Frank merge/wait/close |
| Arcanea worktrees 6/2 over policy | 🟡 cleanup deferrable | Frank decision |
| `/workshops/ikigai-branding` 500 | 🟡 fix-deployed, awaiting Vercel build settle | parallel session verification |

---

## Decisions deferred (in BACKLOG)

- Branch + PR #108 close timing
- PR #121 Dependabot disposition
- `/about` voice ratification (Arcanea mythology vs FrankX rules)
- Worktree cleanup (6 → 2)
- models.yaml: Opus 4.6 → 4.7 upgrade (3-line edit)
- Multi-runtime marketplace design (proposal in BACKLOG)
- arcanea-realm 44-dirty + arcanea-flow 13-dirty (Madrid-stage, leave alone mid-trip)

---

*Generated 2026-05-27 ~04:45 CET by L99 god-mode sweep. All claims disk-verified or curl-verified within the same session.*
