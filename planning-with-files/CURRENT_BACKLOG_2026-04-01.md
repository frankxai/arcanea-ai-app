# Current Backlog — 2026-04-01

## 1. Live Supabase Activation

Scope:
- apply project graph migrations and regenerate Supabase types

Owner:
- Frank or authenticated operator with Supabase CLI/project access

Files:
- `supabase/migrations/20260329000001_chat_projects_graph.sql`
- `supabase/migrations/20260329000002_project_graph_enrichment.sql`
- `apps/web/lib/database/types/supabase-generated.ts`

Non-goals:
- schema redesign

Acceptance criteria:
- migrations applied to live project
- generated types updated from actual DB

Verification:
- `pnpm run supabase:project-graph:apply`
- regenerate types from live DB
- `pnpm run verify:project-workspaces`

## 2. Project-Aware Retrieval On Live Data

Scope:
- use live project graph data during retrieval for active project sessions after DB activation

Owner:
- next feature slice

Files:
- `apps/web/app/api/ai/chat/route.ts`
- `apps/web/lib/projects/server.ts`
- retrieval/memory helpers

Non-goals:
- provider pricing redesign

Acceptance criteria:
- active project pulls relevant graph summary, sessions, creations, and memories from the migrated DB-backed graph

Verification:
- route tests
- browser smoke for project continuity

## 3. Async Graph Enrichment

Scope:
- use project graph data during retrieval for active project sessions

Owner:
- next feature slice

Files:
- `apps/web/app/api/ai/chat/route.ts`
- `apps/web/lib/projects/server.ts`
- retrieval/memory helpers

Non-goals:
- provider pricing redesign

Acceptance criteria:
- active project pulls relevant sessions, creations, and memories

Verification:
- route tests
- browser smoke for project continuity

## 4. Provider Routing And Usage Tracing

Scope:
- post-save/post-chat background extraction of facts, summaries, and edges

Owner:
- next feature slice

Files:
- `apps/web/lib/projects/enrichment.ts`
- background job hooks / task runner

Non-goals:
- full agent system rewrite

Acceptance criteria:
- projects accumulate derived knowledge over time

Verification:
- deterministic enrichment tests
- trace assertions

## 5. Creator Social Compounding Layer

Scope:
- track provider/model/latency/useful retrieval on important flows

Owner:
- next feature slice

Files:
- chat/imagine/research routing layers
- analytics / trace utilities

Non-goals:
- managed-default rollout

Acceptance criteria:
- BYOK-first remains intact
- provider usage becomes observable and optimizable

Verification:
- route tests
- trace payload assertions

## 6. Repo And Agent Control Plane Hygiene

Scope:
- keep `planning-with-files` current and make promotion/runtime state explicit for all agents

Owner:
- Codex / release operator

Files:
- `planning-with-files/README.md`
- `planning-with-files/CURRENT_STATE_2026-04-01.md`
- `planning-with-files/CURRENT_BACKLOG_2026-04-01.md`
- `planning-with-files/CURRENT_CHANGELOG_2026-04-01.md`
- `planning-with-files/AGENT_EXECUTION_PROTOCOL_2026-04-01.md`

Non-goals:
- replacing durable product docs in `docs/ops`

Acceptance criteria:
- agents do not treat already-merged work as pending
- current branch/runtime state is visible from one read

Verification:
- manual audit before each major agent handoff

## 7. Creator Social Compounding Layer

Scope:
- strengthen collections, follows, prompt books, challenge reputation, provenance

Owner:
- product/social slice

Files:
- `apps/web/app/community`
- `apps/web/app/prompt-books`
- `apps/web/app/challenges`
- social APIs

Non-goals:
- generic feed cloning

Acceptance criteria:
- creator identity and artifact graph become more compounding

Verification:
- route tests
- browser flows for create/save/follow/collect
