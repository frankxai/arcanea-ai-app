# Handover — 2026-04-18 morning

**Read this first.** Summary of what shipped overnight while you slept.

## TL;DR

`@arcanea/orchestrator@1.1.0` live on npm. Planner + reasoning bank shipped. 29 tests, 100% green. Everything committed + pushed.

## What's new since you went to sleep

### npm (public)
- **`@arcanea/orchestrator@1.1.0`** — published, installable anywhere via `npm i -g @arcanea/orchestrator@latest`
  - New: `plan <goal>` — decomposes a high-level goal into 3-7 sub-tasks via `claude -p`
  - New: `history` — reads recent runs from `~/.arcanea/history.jsonl`
  - New: `stats` — aggregates success rates per task→model
  - Every `run` now logs to `~/.arcanea/history.jsonl` (opt out with `--no-history`)

### Git (main)
- `d9ccc2d9 release(orchestrator): v1.1.0 — Planner + Reasoning Bank live on npm`
- `7fac6ef0 feat(orchestrator): plan command decomposes goals via claude -p (Phase 5)`
- (commits between: Phase C reasoning bank, tests)
- `8b68101c refactor(amcas): rename @arcanea/arcanea-code → @arcanea/orchestrator (v1.0.0)` — from before sleep

### Tests
- **29 tests, 100% passing** (zero new deps — uses node's built-in test runner via tsx):
  - `@arcanea/router-spec` — 8 tests (loadSpec, resolveTask, pickModel, deprecated handling, unknown task/surface)
  - `@arcanea/orchestrator` — 21 tests (applyPreference per tier, runtimeFor provider mapping, argv shapes, cli-smoke on version/list-tasks/list-models/explain/run --dry-run)
- Run locally: `pnpm --filter @arcanea/orchestrator test`

## Try it live (1 minute)

```bash
# You're already on v1.1.0 globally — just use it
arcanea-orchestrator plan "add a /pricing page to arcanea.ai with 3 tiers"
# → Real JSON plan with 3-7 tasks, each with task-class + prompt + rationale

arcanea-orchestrator history
# → Shows any recent runs (you'll see at least the phase-C test run)

arcanea-orchestrator stats
# → Aggregated success rates per task→model

# Short alias also works:
arco plan "write chapter 5 of Forge of Ruin"
```

## What's NOT done (deferred from overnight plan)

### Skipped (explicitly)
- **Overlay internals rewire (Phase 2c)** — needs 4 external PRs with runtime logic changes. Too risky for autonomous overnight.
- **`arcanea-code` TUI fork of OpenCode** — requires OpenCode base checkout + strategy decision (do we vendor OpenCode or submodule it?).
- **Windows PowerShell `install.sh` variant** — no signal this is blocking anyone yet.
- **Web `/ops/agents` polish** — avoid Next.js build RAM; page is scaffolded + committed.
- **Agent inventory (Phase 7)** — spec-level change, needs your design input.
- **Adaptive routing (Phase 8)** — history-weighted re-ranking; requires data before it's useful.

### Blocked
- Nothing's blocked. Everything that was possible autonomously, shipped.

## What to do next (your call)

In priority order (pick what excites you):

1. **Rotate the npm token.** You pasted one yesterday. Revoke + issue fresh at https://www.npmjs.com/settings/frankxai/tokens.
2. **Populate stats.** Run ~10 real tasks via `arcanea-orchestrator run ...` to get meaningful `stats` output.
3. **Let someone else try it.** The orchestrator is public. Tell one developer friend: `npm i -g @arcanea/orchestrator && arcanea-orchestrator doctor`. Watch them install it in <60s.
4. **Phase 7 design.** Decide: should overlay manifests enumerate agents at the capability level (e.g. `storyteller can do world.canon + world.character`)? That's what unlocks "pick the best *agent*, not just model."
5. **`arcanea-code` TUI start.** Clone OpenCode, fork it, integrate @arcanea/orchestrator + overlays. Probably needs a weekend, not an overnight.
6. **Blog the launch.** `@arcanea/orchestrator` is a genuinely novel thing. A 600-word post on `arcanea.ai/blog/orchestrator-launch` + cross-post to X/Reddit/HN = free developer awareness.

## Files to read if curious

| File | What it is |
|---|---|
| `planning-with-files/AMCAS_OVERNIGHT_TASK_PLAN_2026-04-18.md` | The plan I executed against |
| `planning-with-files/AMCAS_FINDINGS_2026-04-18.md` | Decisions + gotchas encountered |
| `planning-with-files/AMCAS_PROGRESS_2026-04-18.md` | Phase-by-phase status (will update on final commit) |
| `packages/orchestrator/CHANGELOG.md` | v1.1.0 release notes |
| `packages/orchestrator/README.md` | User-facing docs |
| `packages/orchestrator/tests/` | 21 test cases |

## Stats

- **Session duration:** ~3 hours autonomous
- **Commits:** 5 (Phase A tests, Phase B planner, Phase C reasoning bank, v1.1.0 release, final docs)
- **Lines added:** ~900 across source + tests + docs
- **npm publishes:** 1 (v1.1.0)
- **Failed attempts:** 2 (tsx glob on Windows — resolved by explicit filenames; claude -p stdin timeout — resolved by `stdin: 'ignore'`)
- **3-strike escalations:** 0

Everything green. Sleep well earned on your end — this is shipped.

— orchestrator autonomous session
