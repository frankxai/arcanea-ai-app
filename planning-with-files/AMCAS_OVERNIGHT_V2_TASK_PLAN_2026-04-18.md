# AMCAS Overnight V2 Task Plan — 2026-04-18 (22:00+)

**Goal:** Ship v1.2.0 with Phase 8 adaptive routing, workflow templates, /arco Claude Code skill, QUICKSTART doc, and arcanea.ai/orchestrator landing page. No cowardice.

**Starting state:** v1.1.0 live on npm. 29 tests passing. Planner + reasoning bank live. 3.3GB RAM free.

## Sprints (commit after each)

### 1. Phase 8 — Adaptive routing (45 min)
- `src/adaptive.ts` — score(candidates, history) → re-ranked list
- Hook into `run.ts` after preference reorder
- Config: `adaptiveRouting: auto | on | off` (default: `auto` = on when ≥10 events)
- New command: `learn` — show what adaptive picks vs baseline

### 2. Workflow templates (30 min)
- `packages/orchestrator/workflows/*.yml` — 3 starter compositions
- `workflow list` / `workflow run <name>` commands
- Workflows are reusable plan.json artifacts

### 3. `/arco` Claude Code skill (30 min)
- `.claude/skills/arco/SKILL.md`
- Keeps `/ao` skill intact (different purpose: promotion workflow)
- Documents: delegate-to-codex, delegate-to-gemini via Bash within Claude Code
- Subcommands for common orchestrator operations

### 4. QUICKSTART doc (30 min)
- `docs/orchestrator/QUICKSTART.md`
- 5-minute install → first run → plan a goal → see stats
- Troubleshooting section

### 5. `arcanea.ai/orchestrator` landing page (45 min)
- `apps/web/app/orchestrator/page.tsx`
- Install command, live example, routing viz, links
- No Next build overnight — ship as committed code

### 6. Release v1.2.0 (15 min)
- Bump version, CHANGELOG, publish, verify live

### 7. External repo refresh (15 min)
- install.sh → v1.2.0 reference
- `frankxai/arcanea-orchestrator` README: link to QUICKSTART

### 8. Handover (15 min)
- `planning-with-files/HANDOVER_2026-04-18_PM.md`

## Guardrails

- Commit after every sprint.
- RAM check; if < 2GB, stop.
- Every error → findings log.
- 3-strike rule; escalate to findings + skip.
- No changes to `.arcanea/`, `book/`, production `apps/web/app/*` pages outside `/orchestrator/`.
- Keep `/ao` skill alive — don't touch.

## Non-goals (explicit)

- `arcanea-code` TUI fork: still needs strategy call
- Overlay internals (Phase 2c): 4 external PRs — next session
- Agent inventory (Phase 7): spec-level change, needs user design
