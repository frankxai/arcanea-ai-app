# Short Status Log - 2026-04-03 - Run Graph

## Status

- Branch: `feat/run-graph-control-plane`
- Repo: [Arcanea](C:/Users/frank/Arcanea-run-graph)
- Commit: `d5d3bd7d7`
- Remote: `origin/feat/run-graph-control-plane`
- PR URL:
  - `https://github.com/frankxai/arcanea-ai-app/pull/new/feat/run-graph-control-plane`

## What landed

- Durable project run schema:
  - [supabase/migrations/20260403000001_project_runs_graph.sql](C:/Users/frank/Arcanea-run-graph/supabase/migrations/20260403000001_project_runs_graph.sql)
- Run APIs:
  - [apps/web/app/api/projects/[id]/runs/route.ts](C:/Users/frank/Arcanea-run-graph/apps/web/app/api/projects/[id]/runs/route.ts)
  - [apps/web/app/api/projects/[id]/runs/[runId]/route.ts](C:/Users/frank/Arcanea-run-graph/apps/web/app/api/projects/[id]/runs/[runId]/route.ts)
  - [apps/web/app/api/projects/[id]/runs/preflight/route.ts](C:/Users/frank/Arcanea-run-graph/apps/web/app/api/projects/[id]/runs/preflight/route.ts)
- Run UI:
  - [apps/web/app/projects/[id]/runs/page.tsx](C:/Users/frank/Arcanea-run-graph/apps/web/app/projects/[id]/runs/page.tsx)
  - [apps/web/app/projects/[id]/runs/[runId]/page.tsx](C:/Users/frank/Arcanea-run-graph/apps/web/app/projects/[id]/runs/[runId]/page.tsx)
- Shared server helpers:
  - [apps/web/lib/projects/server.ts](C:/Users/frank/Arcanea-run-graph/apps/web/lib/projects/server.ts)
  - [apps/web/lib/projects/trace.ts](C:/Users/frank/Arcanea-run-graph/apps/web/lib/projects/trace.ts)
- Project workspace navigation into runs:
  - [apps/web/app/projects/[id]/page.tsx](C:/Users/frank/Arcanea-run-graph/apps/web/app/projects/[id]/page.tsx)
- Test coverage:
  - [apps/web/lib/projects/__tests__/run-api-contracts.test.ts](C:/Users/frank/Arcanea-run-graph/apps/web/lib/projects/__tests__/run-api-contracts.test.ts)

## Verification

- `pnpm install --frozen-lockfile`
- `pnpm --dir apps/web test:projects`

## Connected systems

- `arcanea-flow`
  - produces machine-readable run envelopes and local trace files
- project workspace graph
  - projects, docs, sessions, creations, memories
- Supabase
  - durable run records, run events, graph edges, RLS
- internal/user control surfaces
  - project pages and later premium execution views

## Current recommendation

1. Merge this branch after review.
2. Apply the Supabase migration.
3. Wire `arcanea-flow` trace ingestion into the new run APIs.
4. Then build richer timeline, artifacts, and cost UX.
