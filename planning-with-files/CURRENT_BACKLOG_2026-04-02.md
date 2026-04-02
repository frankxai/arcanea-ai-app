# Current Backlog - 2026-04-02

## P0

### 1. Review Claude docs-system slice
Scope: audit local notes/docs implementation for schema quality, route design, and promotion readiness
Owner: integration
Files:
- `supabase/migrations/20260402000001_project_docs.sql`
- `apps/web/app/api/projects/[id]/docs/**`
- `apps/web/app/projects/[id]/docs/**`
- `apps/web/lib/docs/**`
- `apps/web/package.json`
Non-goals:
- full docs MVP polish
- DB activation
Acceptance criteria:
- clear merge recommendation
- concrete blocking findings if any
Verification:
- route/file review and app verification if promoted

### 2. Live Supabase activation
Scope: apply project graph migrations and regenerate real Supabase types
Owner: platform
Files:
- `supabase/migrations/20260329000001_chat_projects_graph.sql`
- `supabase/migrations/20260329000002_project_graph_enrichment.sql`
- `apps/web/lib/database/types/supabase-generated.ts`
Non-goals:
- docs schema activation
Acceptance criteria:
- migrations applied
- real generated types committed
Verification:
- `pnpm run verify:project-workspaces`

### 3. Review remaining agent-system integration branch
Scope: classify the remaining `integration/agent-control-plane-unification` commits into promotable, experimental, or archive-only
Owner: integration
Files:
- `integration/agent-control-plane-unification` commit range after `1b6031a7b`
- `.arcanea/voice/**`
- `.arcanea/projects/LUMINOR_AGENT_SYSTEM_PLAN.md`
- `.arcanea/prompts/luminor-*.md`
Non-goals:
- blind merge of the remaining branch
Acceptance criteria:
- commit-by-commit recommendation
- next safe promotion branch identified
Verification:
- git review + scoped verification

## P1

### 4. Project-aware retrieval on live DB data
### 5. Async graph enrichment with real queueing
### 6. Provider routing and usage tracing
