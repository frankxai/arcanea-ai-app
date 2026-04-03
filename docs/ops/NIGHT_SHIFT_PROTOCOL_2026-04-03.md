# Night Shift Protocol - 2026-04-03

This file defines how Arcanea overnight execution should run when multiple agents are active and the goal is sustained, high-quality progress rather than shallow 3-5 minute bursts.

## Intent

Use this when:

- multiple agents are running at once
- the operator is sleeping or unavailable
- work should continue for hours
- the goal is product-compounding execution, not chat-only advice

## Source Of Truth Order

Every agent should resolve context in this order:

1. `AGENTS.md`
2. latest `planning-with-files/*`
3. latest `docs/ops/*` handoff / status / action-log docs
4. `.arcanea/`

Do not start work from stale chat context alone.

## Minimum Startup Reads

Before any substantial overnight work, read:

- `AGENTS.md`
- `planning-with-files/CURRENT_STATE_2026-04-02.md` or latest available
- `planning-with-files/CURRENT_BACKLOG_2026-04-02.md` or latest available
- `planning-with-files/CURRENT_CHANGELOG_2026-04-02.md` or latest available
- `docs/ops/MASSIVE_ACTION_LOG_2026-04-03.md`

If working on project graph or docs:

- `docs/ops/PROJECT_GRAPH_ACTIVATION.md`
- `planning-with-files/NOTES_DOCS_SYSTEM_ARCHITECTURE_2026-04-02.md`

## Overnight Execution Rules

1. Work from clean branches or worktrees only.
2. Never keep active feature work on dirty local `main`.
3. If a branch is mixed, split it before promoting anything.
4. Favor one high-leverage slice at a time.
5. Verify before promotion.
6. Update shared state when repo reality changes.
7. Do not pad with more planning if code or verification can advance.

## What Counts As A Good Overnight Slice

A good slice has all of:

- narrow scope
- high leverage
- clean file ownership
- verification path
- promotion path to `main`

Examples:

- docs MVP hardening
- project-aware retrieval improvements
- SIS/runtime hardening
- test and CI quality gates
- project graph enrichment prep

Bad overnight slices:

- homepage redesign drift
- broad lore expansion
- random cross-repo edits
- large mixed branch dumping

## How To Prevent “4-Minute Stop” Behavior

No prompt can guarantee long execution by itself.

The only reliable way is:

- clear backlog order
- one bounded slice
- explicit acceptance criteria
- explicit verification command
- explicit next slice after completion
- shared state update before stopping

Agents should keep working until they hit one of these stopping conditions:

1. the scoped slice is implemented and verified
2. a real external blocker is reached
3. promotion requires human approval or credentials
4. the next slice would overlap unsafe dirty work

If one slice finishes, the agent should immediately pick the next highest-priority non-overlapping slice from the shared backlog.

## Default Overnight Priority Order

Unless newer docs supersede this, use:

1. live DB activation if credentials are available
2. real type regeneration
3. docs/notes MVP
4. project-aware retrieval on live graph data
5. async graph enrichment prep
6. provider routing / usage tracing
7. review and split remaining integration branches

## Required End-Of-Slice Output

Before an agent stops, it should leave:

- what branch/worktree it used
- what changed
- what verified
- what remains
- what the next best slice is

If repo state changed materially, update:

- `planning-with-files/CURRENT_STATE_*`
- `planning-with-files/CURRENT_CHANGELOG_*`
- `planning-with-files/CURRENT_BACKLOG_*`

or, when durability matters more than ignored local planning files:

- `docs/ops/*`

## Recommended Kickoff Prompt

Use this to start an overnight Codex or Claude run:

> Read `AGENTS.md`, the latest `planning-with-files/*`, and `docs/ops/MASSIVE_ACTION_LOG_2026-04-03.md`. Work from a clean worktree or promotion branch, not dirty `main`. Pick the highest-leverage non-overlapping slice from the backlog, implement it, verify it, update shared state if repo reality changes, and then continue to the next highest-value slice instead of stopping after the first small win. Preserve branch discipline and do not merge mixed work wholesale.

## Current Practical Interpretation

Based on the current repo state, the highest-confidence overnight tracks are:

- docs/notes MVP on top of the project graph
- review/splitting of remaining integration-branch work
- retrieval and enrichment improvements
- operator/runtime hardening

The broad voice/buddy/Luminor tranche should stay out of `main` until it is reviewed commit-by-commit.
