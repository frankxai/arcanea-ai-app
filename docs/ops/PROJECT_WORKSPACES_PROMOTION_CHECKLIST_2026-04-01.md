# Project Workspaces Promotion Checklist - 2026-04-01

## Branch

- Source branch: `integration/project-workspaces-mainline`
- Base branch: `main`
- Current source HEAD: `9e057c61e435c1bbd1215085ec9de99761d5d8bd`

## Included commit stack

1. `bbd4ce3d0` - project graph workspace surface expansion
2. `9aaf1d6f5` - writable project surfaces
3. `3f62d36d0` - linking actions and route contracts
4. `6ac8d3e85` - integration fixes required on current `main`
5. `bf53cae6b` - verification hardening for the promoted slice
6. `6e18a5fdb` - project action route test coverage
7. `9e057c61e` - verification stabilization and Turbopack root cleanup

## Promotion scope

Promote:

- project graph APIs
- `/projects` and `/projects/[id]` surfaces
- project session and creation linking actions
- project graph server/enrichment/progress/trace support
- project-focused unit and browser verification
- narrow integration fixes needed to make the slice build on top of current `main`

Do not broaden this promotion to include unrelated trunk cleanup.

## Verification gate

From the repo root:

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL='https://example.supabase.co'
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY='example-anon-key'
pnpm run verify:project-workspaces
```

Expected:

- `apps/web` type-check passes
- `test:projects` passes
- `apps/web` production build passes
- Playwright project workspace/browser smoke passes

## External activation gate

Still pending after merge:

1. install/auth Supabase CLI
2. set `SUPABASE_PROJECT_REF`
3. run:

```powershell
pnpm run supabase:project-graph:plan
pnpm run supabase:project-graph:apply
```

4. regenerate live DB types into `apps/web/lib/database/types/supabase-generated.ts`
5. rerun `pnpm run verify:project-workspaces`

## Known non-blocking warning

- Next middleware deprecation warning remains because the app still uses the older `middleware` convention

## Merge recommendation

Preferred:

1. fast-forward or merge `integration/project-workspaces-mainline` into a fresh, clean `main`
2. rerun `pnpm run verify:project-workspaces`
3. only then apply live Supabase activation

Fallback if `main` moves again first:

1. create a fresh integration branch from updated `main`
2. replay this exact commit stack
3. rerun `pnpm run verify:project-workspaces`
