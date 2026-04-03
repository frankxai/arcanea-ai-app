# Overnight Execution Queue - 2026-04-03

This file is the concrete overnight queue for Arcanea when multiple agents are active and the operator is unavailable.

Use together with:

- `AGENTS.md`
- `docs/ops/NIGHT_SHIFT_PROTOCOL_2026-04-03.md`
- `docs/ops/AGENT_BRANCH_MATRIX_2026-04-03.md`
- `docs/ops/MASSIVE_ACTION_LOG_2026-04-03.md`

## Queue Order

### 1. Docs Graph Retrieval

Status:
- active
- high confidence
- best current product-compounding slice

Recommended branch/worktree:
- `feat/docs-graph-retrieval`
- `C:\Users\frank\Arcanea-docs-graph`

Scope:
- make docs first-class in project workspace
- include docs in retrieval selection
- include docs in graph enrichment/progress signals
- surface linked docs on the project workspace page

Files:
- `apps/web/app/api/ai/chat/route.ts`
- `apps/web/app/projects/[id]/page.tsx`
- `apps/web/app/projects/[id]/project-doc-panel.tsx`
- `apps/web/lib/projects/server.ts`
- `apps/web/lib/projects/retrieval.ts`
- `apps/web/lib/projects/enrichment.ts`
- `apps/web/lib/projects/progress.ts`
- `apps/web/lib/projects/__tests__/*`

Acceptance:
- docs appear as first-class project graph objects
- retrieval block includes docs
- tests updated and passing

Verification:
- `pnpm --dir apps/web exec next typegen`
- `pnpm --dir apps/web exec tsc --noEmit`
- `pnpm --dir apps/web test:projects`
- `pnpm --dir apps/web build`

### 2. Agentdb / Memory Tranche Review

Status:
- mixed
- review only until scoped

Recommended branch/worktree:
- `integration/agent-control-plane-unification`
- `C:\Users\frank\Arcanea`

Scope:
- inspect the new memory and `agentdb` work
- identify a safe subset for promotion
- keep mixed experimental work out of `main`

Files:
- `apps/web/app/api/memory/**`
- `apps/web/lib/agentdb/**`
- `packages/agent-registry/**`
- `scripts/agent-os-check.ts`
- package manifests as needed

Acceptance:
- written findings
- exact promotable files or commits identified
- exact hold/experimental files identified

Verification:
- status/diff/log review only unless a clean split branch is created

### 3. Live DB Activation

Status:
- external blocker
- highest-value step once credentials are available

Prerequisites:
- Supabase CLI working
- project credentials present

Scope:
- apply project graph migrations
- regenerate real Supabase types
- rerun verification on the live-backed state

### 4. Provider Routing / Usage Tracing

Status:
- hold until DB-backed graph is live

Scope:
- extend provider/model trace payloads
- make project retrieval and provider choice visible in traces
- prepare cost/routing instrumentation for BYOK-first execution

## Rules

1. Do not work on dirty `main`.
2. Promote only narrow, verified slices.
3. If a slice is blocked, move to the next non-overlapping queue item.
4. Before stopping, leave:
   - branch/worktree
   - files changed
   - verification
   - blocker
   - next best slice
