# AMCAS Overnight Task Plan — 2026-04-18

**Goal:** Ship v1.1.0 of `@arcanea/orchestrator` with Planner + Reasoning Bank (Phases 5 + 6 from roadmap). Tests. Docs. Clean handover by morning.

**Constraint:** Autonomous. No user input. Commit + push after each phase for safety. If any phase fails 3× (3-strike rule), escalate via findings doc and skip.

**Start state:** `@arcanea/orchestrator@1.0.0` live on npm. Router spec v1.0.1. Dispatcher working end-to-end. 6 commits pushed to main today. RAM 3.4 GB free.

---

## Phases

### A. Unit + smoke tests (45 min)

**Why:** Zero tests today. Dispatcher has 3 pure functions that deserve coverage (`applyPreference`, `runtimeFor`, spec validator). Builds trust for v1.1 claims.

**Deliverables:**
- `packages/orchestrator/tests/config.test.ts` — applyPreference (sub/free/byok/cheapest ordering)
- `packages/orchestrator/tests/runtimes.test.ts` — runtimeFor mapping
- `packages/orchestrator/tests/cli-smoke.test.ts` — spawn `arcanea-orchestrator list-tasks` + assert exit 0
- `packages/orchestrator/package.json` — add `test` script using node's built-in test runner (no new deps)
- `packages/router-spec/tests/validate.test.ts` — make sure validator still passes

**Acceptance:** `pnpm --filter @arcanea/orchestrator test` passes. CI-ready shape.

**Verification:** run it. Exit code 0.

---

### B. Phase 5 — Planner command (60 min)

**Why:** User asked for "deploys claude + codex + gemini in parallel for perfect task" and "ruflow-style learning". Planner = decomposition half.

**Deliverables:**
- `packages/orchestrator/src/commands/plan.ts` — takes a goal string, calls `claude -p` with a structured prompt to emit JSON of task-class tuples, writes to stdout + optional file
- `packages/orchestrator/src/commands/cli.ts` — register `plan` subcommand
- Output shape:
  ```json
  { "goal": "...", "tasks": [ { "id": 1, "task": "code.frontend", "prompt": "...", "why": "..." } ] }
  ```
- Supports `--execute` to feed planned tasks directly to `swarm` (Phase C composability)
- Falls back gracefully if `claude` CLI not available (print plan template + exit 0)

**Acceptance:** `arcanea-orchestrator plan "build a landing page for Arcanea"` returns 3-7 task tuples with sensible task-class assignments. Prompt tokens are bounded (<2k input).

**Verification:** live call + eyeball output + assert JSON parses.

**Risk:** `claude -p` call costs sub tokens. Bounded to ~$0.01/invocation with caching in place.

---

### C. Phase 6 — Reasoning Bank + history + stats (60 min)

**Why:** Learning over time. Without history, router-spec preferences are just defaults — never improve.

**Deliverables:**
- `packages/orchestrator/src/history.ts` — append-only JSONL at `~/.arcanea/history.jsonl`:
  ```json
  { "ts": "...", "task": "code.debug", "surface": "...", "model": "...", "runtime": "...", "durationMs": 2341, "exitCode": 0 }
  ```
- `run.ts` — wrap exec, log the event
- `src/commands/history.ts` — print last N events
- `src/commands/stats.ts` — aggregate by task → model → success-rate + avg duration
- Export `HistoryEvent` type

**Acceptance:**
- Every `arcanea-orchestrator run` writes an event (enabled by default, `--no-history` opt-out)
- `arcanea-orchestrator history` tails last 10
- `arcanea-orchestrator stats` shows per-task success rates
- File never exceeds reasonable size (rotate >10MB or 10K lines to `history.jsonl.N`)

**Verification:** run 3 dispatches, confirm 3 lines in JSONL. history + stats read back correctly.

---

### D. Publish v1.1.0 (15 min)

**Why:** Get the new commands to the public registry + deprecation bridge.

**Deliverables:**
- `packages/orchestrator/package.json` — bump to `1.1.0`
- `packages/orchestrator/CHANGELOG.md` — new + migration note
- `pnpm --filter @arcanea/orchestrator publish --access public --no-git-checks`
- Verify `npm install -g @arcanea/orchestrator@1.1.0` works

**Acceptance:** `arcanea-orchestrator --version` returns `1.1.0`. All new commands reachable.

---

### E. Docs + handover (30 min)

**Deliverables:**
- Update `packages/orchestrator/README.md` — document `plan`, `history`, `stats`
- Update `planning-with-files/CURRENT_STATE_2026-04-17_AMCAS.md` → rename to `_2026-04-18` + new state
- Update `planning-with-files/AMCAS_PROGRESS_2026-04-18.md` — what changed overnight
- Write `planning-with-files/HANDOVER_2026-04-18_AM.md` — user-facing summary they read first thing

**Acceptance:** user opens handover doc, knows exactly what's new, what works, what's still TBD.

---

### F. Final commit + push (15 min)

**Acceptance:** working tree clean on `main`, `origin/main` has the v1.1 commit, npm has `@arcanea/orchestrator@1.1.0`.

---

## Guardrails

1. **Commit after every phase.** Never carry uncommitted changes across phases.
2. **RAM check before spawning anything.** If MemFree < 2 GB, skip agent spawning, work sequentially.
3. **Every error goes in findings.md.** If any single action fails 3×, note it, skip, move on.
4. **No external repo changes** this session — only monorepo + npm. External overlay repos already updated this afternoon.
5. **No changes to apps/web** — avoid Next.js build RAM. Web dashboard scaffolded is enough; don't iterate on it overnight.
6. **No deletions of existing files** without explicit corresponding `git mv` rename.
7. **No changes to `.arcanea/`**, `book/`, other domains outside packages/orchestrator + planning-with-files.

## Non-goals (explicit)

- Phase 7 (agent inventory) — defer, needs spec change
- Overlay internals rewire (Phase 2c) — requires 4 external PRs, not overnight-safe
- arcanea-code TUI fork — requires OpenCode base decision
- Windows PowerShell install.sh — minor feature, no signal it's blocking anyone
- Web `/ops/agents` polish — avoid Next.js build RAM
