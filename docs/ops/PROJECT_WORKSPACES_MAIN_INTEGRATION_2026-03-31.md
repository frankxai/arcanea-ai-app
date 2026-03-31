# Project Workspaces Mainline Integration - 2026-03-31

## Branch

- Worktree: `C:\Users\frank\Arcanea-main-project-integration`
- Branch: `integration/project-workspaces-mainline`
- Base: current `origin/main`

## What was integrated

Cherry-picked from `testing/chat-project-workspaces`:

1. `91833fd74` - project workspace graph surface expansion
2. `dec20f0d7` - writable project surfaces
3. `106670a62` - linking actions and route contracts

## Additional fixes required on top of current main

These were not project-branch regressions. They were current-`main` drift exposed by replaying the branch onto the newer trunk.

- `apps/web/app/api/forge/route.ts`
  - lazily creates the Supabase client
  - returns `503` when forge backend env is not configured
- `apps/web/app/api/forge/[id]/route.ts`
  - same lazy client and `503` behavior
- `apps/web/components/chat/agent-header.tsx`
  - removed invalid `PhRobot` import
- `apps/web/hooks/use-conversation.ts`
  - added missing `detectToolIntent` field to `ConversationState`
- `apps/web/lib/agents/store.ts`
  - bypasses stale generated Supabase table typing only for `agents` and `reputation_events`
- `apps/web/lib/living-lore/crew-data.ts`
  - supplies required `loreName` in `LuminorConfig`
- `pnpm-lock.yaml`
  - updated because current `main` lock state was out of sync with `apps/web/package.json`

## Verification run on this integration branch

Executed successfully:

```powershell
pnpm install --no-frozen-lockfile
pnpm --dir apps/web type-check
pnpm --dir apps/web test:projects
$env:NEXT_PUBLIC_SUPABASE_URL='https://example.supabase.co'
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY='example-anon-key'
pnpm --dir apps/web build
Set-Location apps/web
pnpm exec playwright test
```

Additional hardening completed after the initial replay:

- route contract coverage now includes:
  - `GET/POST /api/projects`
  - `PATCH/DELETE /api/projects/[id]/sessions/[sessionId]`
  - `PATCH/DELETE /api/projects/[id]/creations/[creationId]`
- `apps/web/package.json` now runs `next typegen` before `tsc --noEmit`, so a fresh worktree no longer fails type-check before `.next/types` exists

## Result

The project-workspace slice is promotable on top of current `main`.

The meaningful blocker was not merge conflict. It was trunk drift:

- stale type/schema coupling in agent store
- eager env-dependent forge routes
- a small chat icon/type mismatch
- a missing `loreName`
- lockfile/package drift on `main`

## Promotion recommendation

Promote from this branch, not directly from `testing/chat-project-workspaces`.

Recommended order:

1. current integration fixes + updated lockfile
2. project graph/runtime changes
3. `/projects` UI surfaces
4. browser harness

## Remaining external blocker

Live Supabase activation is still external:

- real Supabase CLI
- `SUPABASE_PROJECT_REF`
- actual project credentials

That work should happen after this branch is promoted or in a dedicated follow-up branch.

## Remaining non-blocking warnings

- Next middleware deprecation warning because the app still uses the older `middleware` convention

The previous Turbopack workspace-root warning was eliminated on this branch by setting `turbopack.root` explicitly in `apps/web/next.config.js`.
