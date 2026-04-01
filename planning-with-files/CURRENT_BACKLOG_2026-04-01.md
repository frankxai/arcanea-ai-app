# Current Backlog — 2026-04-01

## 1. Promote Project Workspace Slice To Main

Scope:
- merge verified promotion branch into `main`

Owner:
- Codex / release operator

Files:
- all files in `promote/project-workspaces`

Non-goals:
- broad lint cleanup
- unrelated trunk stabilization

Acceptance criteria:
- `main` contains project workspace + media cleanup slice
- branch history is reviewable

Verification:
- `pnpm run verify:project-workspaces`

## 2. Live Supabase Activation

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

## 3. Project-Aware Retrieval

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

## 4. Async Graph Enrichment

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

## 5. Provider Routing And Usage Tracing

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

## 6. Creator Social Compounding Layer

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
