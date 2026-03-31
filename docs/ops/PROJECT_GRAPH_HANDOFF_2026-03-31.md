# Project Graph Handoff — 2026-03-31

## User directives captured

- Take massive action and deliver massive value.
- Keep building real functionality, not just architecture.
- Focus on project workspaces becoming first-class and useful.
- Stay on `BYOK-first` for now.
- Do not pretend blocked external steps are done.
- Keep verification real.

## Active worktree and branch

- Main repo cwd: `C:\Users\frank\Arcanea`
- Active implementation worktree: `C:\Users\frank\Arcanea-integration-review`
- Active branch: `testing/chat-project-workspaces`
- Latest pushed commit at handoff: `106670a62`

## What was built

### Project graph foundation

- Supabase migrations for project graph and enrichment:
  - `supabase/migrations/20260329000001_chat_projects_graph.sql`
  - `supabase/migrations/20260329000002_project_graph_enrichment.sql`
- Project APIs and graph APIs:
  - `apps/web/app/api/projects/route.ts`
  - `apps/web/app/api/projects/[id]/route.ts`
  - `apps/web/app/api/projects/[id]/graph/route.ts`
  - `apps/web/app/api/projects/[id]/step/route.ts`
  - `apps/web/app/api/projects/[id]/complete/route.ts`
- Project graph backend support:
  - `apps/web/lib/projects/server.ts`
  - `apps/web/lib/projects/enrichment.ts`
  - `apps/web/lib/projects/progress.ts`
  - `apps/web/lib/projects/trace.ts`

### Product surfaces

- Dedicated projects index:
  - `apps/web/app/projects/page.tsx`
  - `apps/web/app/projects/projects-index-shell.tsx`
- Dedicated project workspace:
  - `apps/web/app/projects/[id]/page.tsx`
  - `apps/web/app/projects/[id]/open-project-chat-button.tsx`
  - `apps/web/app/projects/[id]/project-workspace-controls.tsx`
  - `apps/web/app/projects/[id]/project-session-panel.tsx`
  - `apps/web/app/projects/[id]/project-creation-panel.tsx`

### Writable project actions

- Session attach/detach routes:
  - `apps/web/app/api/projects/[id]/sessions/[sessionId]/route.ts`
- Creation attach/detach and provenance update routes:
  - `apps/web/app/api/projects/[id]/creations/[creationId]/route.ts`

### Browser and contract verification

- Playwright config and browser tests:
  - `apps/web/playwright.config.ts`
  - `apps/web/e2e/project-graph.spec.ts`
  - `apps/web/e2e/project-workspace.spec.ts`
- Project contract/unit coverage:
  - `apps/web/lib/projects/__tests__/enrichment.test.ts`
  - `apps/web/lib/projects/__tests__/progress.test.ts`
  - `apps/web/lib/projects/__tests__/trace.test.ts`
  - `apps/web/lib/projects/__tests__/api-contracts.test.ts`
  - `apps/web/lib/chat/__tests__/local-store-projects.test.ts`
  - `apps/web/lib/analytics/__tests__/events-projects.test.ts`

## What is verified

Run successfully on `C:\Users\frank\Arcanea-integration-review`:

```powershell
pnpm --dir apps/web type-check
pnpm --dir apps/web test:projects
$env:NEXT_PUBLIC_SUPABASE_URL='https://example.supabase.co'
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY='example-anon-key'
pnpm --dir apps/web build
Set-Location apps/web
pnpm exec playwright test
```

## What is still blocked externally

Live Supabase activation is not complete from this machine/session because:

- `supabase` CLI was not available in the environment when checked.
- `SUPABASE_PROJECT_REF` was not set.
- Real Supabase credentials were not available in shell env.

That means these are still pending:

1. Apply the two project graph migrations to the real project.
2. Regenerate `apps/web/lib/database/types/supabase-generated.ts` from the live DB.
3. Re-run verification against the live graph-backed database.

## Highest-value next steps

1. Finish live Supabase activation once credentials/CLI are available.
2. Add project-aware artifact browsing polish on `/projects/[id]` if needed:
   - browsing links to dedicated artifact destinations
   - richer provenance labels
   - better empty/recovery states
3. Promote to `main` in slices, not as one dump:
   - activation-safe docs/scripts
   - project graph/runtime changes
   - browser harness after final review

## Resume commands on this machine

### Codex

```powershell
Set-Location C:\Users\frank\Arcanea-integration-review
git checkout testing/chat-project-workspaces
cda
```

### Claude Code

```powershell
wsl -e bash -lc "cd /mnt/c/Users/frank/Arcanea-integration-review && git checkout testing/chat-project-workspaces && claude"
```

If Claude startup is still flaky on this machine, diagnose first with:

```powershell
Set-Location C:\Users\frank\Arcanea
cla -Diag
```

## Paste-ready continuation prompt

```text
Read docs/ops/PROJECT_GRAPH_HANDOFF_2026-03-31.md.
Continue on C:\Users\frank\Arcanea-integration-review, branch testing/chat-project-workspaces.
Do not touch homepage, /chat, /imagine, or middleware unless strictly required.
Priority order:
1. finish live Supabase activation if credentials/CLI are available
2. keep project workspace functionality real and verified
3. preserve merge discipline onto main
Run type-check, test:projects, build, and Playwright before closing.
```
