# Recent Agent Work Review - 2026-04-02

## Scope Reviewed

- Claude local notes/docs work
- local agent-ops/control-plane drift
- current branch posture versus remote `main`

## What Looks Good

- Project docs under `/projects/[id]/docs` are directionally aligned with the workspace-first product strategy.
- The local migration `supabase/migrations/20260402000001_project_docs.sql` is a reasonable MVP starting point.
- `apps/web/package.json` adding `novel` and `lowlight` supports a practical Tiptap/Novel-based editor path instead of rebuilding a rich-text editor from scratch.
- The billing execution plan in `docs/ops/BILLING_PROJECT_GRAPH_EXECUTION_PLAN_2026-04-02.md` is aligned with provider-neutral billing and Supabase-as-product-truth.
- The SIS bridge and local MCP server scripts are useful and worth keeping, because they let Claude/Codex/opencode read the same canonical Starlight vault context without depending on one UI.

## Main Risks

### 1. Branch discipline risk

Claude was landing product work directly into the local trunk worktree. This is now structurally contained by moving the work onto `integration/agent-control-plane-unification`, but the notes/docs slice still needs scoped promotion discipline.

### 2. Type and schema drift risk

The docs API currently uses type escapes (`supabase as any`) until the migration is applied and real types are regenerated. This is acceptable only as a short-lived bridge.

### 3. MVP schema is still narrower than the intended product

The docs schema covers:
- docs
- content
- versions

It does not yet cover richer future needs like:
- retrieval chunks
- comments/discussion
- stronger provenance
- richer graph links
- style/agent annotations

That is acceptable for MVP, but it should be treated as Phase 1, not final architecture.

### 4. App Router implementation can be improved

The current client editor page loads data on first render with client state orchestration. It is workable, but a cleaner split between server loading and client editing would be a better long-term Next.js shape.

## Recommendation

1. Keep the docs direction.
2. Do not promote the docs slice straight from local branch state.
3. Review it as a scoped notes/docs branch after live Supabase activation.
4. Align it with `planning-with-files/NOTES_DOCS_SYSTEM_ARCHITECTURE_2026-04-02.md` before promotion.

## Immediate Next Actions

- finish agent control-plane unification
- commit and push the new branch
- keep local docs work on this branch until reviewed and verified
