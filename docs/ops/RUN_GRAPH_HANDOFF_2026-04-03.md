# Run Graph Handoff - 2026-04-03

## What this layer is

This branch adds the first durable execution-history layer for Arcanea projects.

Before this tranche:
- Arcanea had project workspaces, docs, sessions, creations, memories, and graph scaffolding.
- `arcanea-flow` could emit local orchestration traces.
- The ops surface could show internal traces.

After this tranche:
- a project can own durable run records
- a run can have timeline events
- a run can link back into the project graph
- the UI can show run lists and run detail pages
- cost preflight exists before execution

This is the bridge from:
- internal orchestration traces

to:
- product-grade project execution history

## Why this matters

### For Arcanea

- turns execution into durable product memory
- creates the foundation for premium control-plane features
- makes cost and trust visible
- gives `arcanea-flow` and future runtimes one stable product destination

### For users

- they can see what agents did
- they can inspect timing, provider, runtime, and cost posture
- they can connect runs back to docs, prompts, creations, and collections
- they get continuity instead of terminal residue

### For the community

- shared workflows become inspectable and teachable
- prompt books and project artifacts can later connect to real run history
- reputation and contribution can be grounded in actual execution, not just claims

### For Arcanea agents

- agents now have a durable run contract to target
- future Codex, Claude, OpenCode, and Gemini harnesses can all write into one run graph
- orchestration becomes machine-readable and auditable

## Core design decision

Do not force all orchestration state into Supabase.

Best split:
- `arcanea-flow`
  - keeps local-first runtime state and fast orchestration traces
- `Arcanea` + Supabase
  - store durable run graph, billing posture, graph linkage, and user-facing memory

Why this is better:
- local execution stays fast and resilient
- product state stays durable and cross-user
- billing and creator graph stay in the product control plane

## What is connected

### Direct dependencies

- [apps/web/lib/projects/server.ts](C:/Users/frank/Arcanea-run-graph/apps/web/lib/projects/server.ts)
  - shared project/run server helpers
- [apps/web/lib/projects/trace.ts](C:/Users/frank/Arcanea-run-graph/apps/web/lib/projects/trace.ts)
  - activity trace actions
- [scripts/project-graph-activate.ts](C:/Users/frank/Arcanea-run-graph/scripts/project-graph-activate.ts)
  - activation flow for graph migrations
- [apps/web/package.json](C:/Users/frank/Arcanea-run-graph/apps/web/package.json)
  - test entry updated to include run API contracts

### Database dependencies

- existing project workspace graph:
  - `chat_projects`
  - `project_graph_edges`
  - `project_graph_summaries`
  - `project_docs`
  - `project_doc_content`
- new tables:
  - `project_runs`
  - `project_run_events`

### Upstream orchestration dependency

- `arcanea-flow`
  - should emit envelopes that can be ingested here
  - already moved toward `--json` and local trace persistence

### Future integration points

- credits and subscription entitlements
- creator graph:
  - prompt books
  - follows
  - collections
  - challenges
- run artifacts and logs
- provider usage tracing

## What agents should know

If touching this layer, preserve these invariants:

1. A run is always project-scoped.
2. A run is always user-scoped.
3. A run can exist before completion.
4. Cost preflight is explicit, not inferred only in the UI.
5. A run can connect to docs, prompts, creations, and collections through `project_graph_edges`.
6. Route handlers should keep injectable dependency objects for testability.

## What is verified

- install in clean worktree:
  - `pnpm install --frozen-lockfile`
- project suite:
  - `pnpm --dir apps/web test:projects`
- new run API contract coverage is included in the project test suite

## What is not done yet

- live Supabase migration application
- automatic ingestion job from local `arcanea-flow` traces into `project_runs`
- richer run artifacts/log storage
- user-facing premium execution dashboard polish
- creator graph joins onto run records

## Next best actions

1. Review and merge `feat/run-graph-control-plane`.
2. Apply [20260403000001_project_runs_graph.sql](C:/Users/frank/Arcanea-run-graph/supabase/migrations/20260403000001_project_runs_graph.sql).
3. Add a small ingestion path from `arcanea-flow` local trace envelopes into `/api/projects/[id]/runs`.
4. Add richer run detail:
   - artifacts
   - provider traces
   - live status
   - clearer cost UX
5. Connect run records into the creator graph and monetization surfaces later.
