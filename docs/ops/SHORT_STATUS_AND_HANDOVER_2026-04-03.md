# Short Status And Handover - 2026-04-03

This is the short operator and agent handover for the current Arcanea product layer.

## What Landed

`origin/main` now contains a stronger BYOK-first workspace spine:

- project workspaces
- project graph APIs
- project-aware chat retrieval
- project docs integrated into the workspace graph
- local memory backend via Starlight/agentdb
- provider/runtime metadata surfaced in chat
- trace and enrichment scaffolding
- media cleanup and safer guardian/gallery handling
- repo-level agent control plane and overnight execution docs

Latest promoted trunk commit at the time of this handover:

- `7332c9a2f`

## Why It Matters

Arcanea is no longer just a chat shell with saves.

It is becoming a creative intelligence workspace where:

- work belongs to projects
- chats, docs, creations, and memories accumulate
- retrieval uses prior project context
- provenance is preserved
- agents share one operating contract

That is the beginning of a real moat:

- continuity
- memory
- provenance
- creator workflow
- later social/creator compounding

## What Is Connected To What

### Product objects

- `project`
  - contains sessions, docs, creations, memories
  - is the continuity container

- `chat session`
  - can belong to a project
  - can source creations
  - contributes retrieval context

- `project doc`
  - belongs to a project
  - is visible in project workspace
  - is included in project retrieval

- `creation`
  - can belong to a project
  - can preserve `sourceSessionId`
  - contributes retrieval and provenance

- `memory`
  - can be stored locally through agentdb/Starlight
  - can later connect to richer project graph retrieval

### Runtime layer

- chat route
  - builds project retrieval context
  - resolves provider/model path
  - emits runtime metadata and trace metadata

- retrieval layer
  - selects the most relevant sessions, docs, creations, and memories
  - produces a retrieval block for chat
  - emits deterministic trace shape

- enrichment layer
  - derives graph tags, summary, edges, and checks
  - prepares later queue-based background enrichment

### Agent/operator layer

- `AGENTS.md`
  - top-level repo contract

- `planning-with-files/*`
  - current state, backlog, changelog, execution protocol

- `docs/ops/*`
  - branch matrix
  - overnight queue
  - massive action log
  - handoff docs

- SIS/Starlight scripts
  - shared context and local memory compatibility for agent surfaces

## Key Dependencies And Why They Exist

### Current stack

- `Next.js`
  - product shell
  - routes, pages, SSR/streaming
  - chat, project, docs, gallery, ops surfaces

- `Supabase/Postgres`
  - source of truth for project graph, docs, creations, memories, provenance
  - still needs live migration activation from you

- `AI SDK`
  - streaming chat pipeline
  - message metadata support
  - provider routing integration

- `Starlight / SIS`
  - local memory and shared agent context
  - useful for operator/agent continuity

- `Playwright`
  - browser smoke for project workspace continuity

- `gray-matter + js-yaml`
  - markdown/frontmatter content loading for lore/book systems

### Why these dependencies provide value

- they let Arcanea move fast without rebuilding commodity infrastructure
- they keep custom engineering focused on the moat:
  - graph
  - retrieval
  - provenance
  - creator workflow
  - agent coordination

## What Value This Provides

### For you

- stronger product core on `main`
- less branch chaos
- cleaner promotion discipline
- more visible runtime behavior
- better operator tooling
- stronger base for docs, retrieval, and enrichment

### For users

- better continuity across work
- project-aware chat instead of stateless chat
- docs integrated into projects
- clearer workspace organization
- better retrieval of prior context
- safer and cleaner media experience

### For community and Arcanea

- more durable creator identity over time
- stronger provenance and reusable artifacts
- foundation for collections, prompt books, follows, challenge reputation, and social layering later
- a more credible BYOK-first platform story

## What Still Depends On Manual Supabase Work

These parts are code-ready but still need real DB activation:

- project graph migrations
- project docs migration
- real generated Supabase types

Manual steps still required:

1. Apply:
   - `supabase/migrations/20260329000001_chat_projects_graph.sql`
   - `supabase/migrations/20260329000002_project_graph_enrichment.sql`
   - `supabase/migrations/20260402000001_project_docs.sql`
2. Regenerate:
   - `apps/web/lib/database/types/supabase-generated.ts`
3. Re-run:
   - `pnpm --filter @arcanea/web type-check`
   - `pnpm --filter @arcanea/web test:projects`
   - `pnpm --filter @arcanea/web build`
   - `pnpm --filter @arcanea/web exec playwright test`

## Recommended Next Stack

After DB activation:

1. make retrieval fully live-data-first from the real project graph
2. turn enrichment into queued background execution
3. extend provider tracing into image/video/research paths
4. deepen docs system on real DB-backed types
5. then build social/creator compounding on top

## Practical Summary

Arcanea now has a real product spine:

- projects
- docs
- retrieval
- memory
- provenance
- runtime observability
- agent operating discipline

The next jump is not a new random feature.
It is activating the DB-backed graph fully and then making the intelligence layer deeper.
