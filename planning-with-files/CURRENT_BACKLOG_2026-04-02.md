# Current Backlog - 2026-04-02

## P0

### 1. Normalize agent control plane
Scope: make Claude, Codex, Cursor, Gemini, opencode, and Arcanea agents resolve to the same source-of-truth order
Owner: control-plane
Files:
- `AGENTS.md`
- `CLAUDE.md`
- `.claude/CLAUDE.md`
- `.arcanea/CLAUDE.md`
- `.cursorrules`
- `.codex/instructions.md`
- `.gemini/instructions.md`
Non-goals:
- full lore rewrite
- product UI changes
Acceptance criteria:
- all major agent entrypoints point to `AGENTS.md` -> `planning-with-files` -> `.arcanea`
- dirty-main prohibition is explicit
Verification:
- manual file review

### 2. Review Claude docs-system slice
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

### 3. Live Supabase activation
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

## P1

### 4. Promote docs MVP on a scoped branch
### 5. Project-aware retrieval on live DB data
### 6. Async graph enrichment with real queueing
### 7. Provider routing and usage tracing
