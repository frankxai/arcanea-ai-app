# Arcanea Project Graph Activation

Date: 2026-03-30
Status: Operational runbook
Scope: Supabase migrations, type generation, and verification for the Arcanea project graph rollout

## Purpose

The project graph exists in the repo, but it only becomes authoritative after the database migrations are applied and the generated types are refreshed from the real Supabase project.

This runbook is the lowest-risk activation path that stays outside `/chat`, `/imagine`, homepage, and `middleware.ts`.

## Files In Scope

- `supabase/migrations/20260329000001_chat_projects_graph.sql`
- `supabase/migrations/20260329000002_project_graph_enrichment.sql`
- `apps/web/lib/database/types/supabase-generated.ts`
- `scripts/project-graph-activate.ts`
- `package.json`

## Preconditions

- Supabase CLI is installed
- Supabase CLI is authenticated
- `SUPABASE_PROJECT_REF` is set
- The target Supabase project already exists
- The repository checkout matches the branch you intend to activate

If you do not have the CLI or project credentials yet, stop here. The script will not guess them.

## Recommended Commands

Plan only:

```bash
pnpm supabase:project-graph:plan
```

Apply against the linked remote project:

```bash
pnpm supabase:project-graph:apply
```

If you need to run the raw CLI manually, use:

```bash
supabase link --project-ref "$SUPABASE_PROJECT_REF"
supabase db push
supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > apps/web/lib/database/types/supabase-generated.ts
```

Local development fallback, only if Docker and a local Supabase stack are available:

```bash
supabase start
supabase db reset
supabase gen types typescript --local --schema public > apps/web/lib/database/types/supabase-generated.ts
```

## What The Activation Step Does

1. Verifies the two project-graph migrations exist in the repo.
2. Links the Supabase CLI to the target project when `SUPABASE_PROJECT_REF` is available.
3. Applies outstanding migrations.
4. Regenerates `apps/web/lib/database/types/supabase-generated.ts`.
5. Leaves the hand-maintained wrapper types in place for the app to consume.

## What It Does Not Do

- It does not change `/chat`, `/imagine`, homepage, or `middleware.ts`.
- It does not invent a project ref.
- It does not run the live database migration without a real Supabase target.
- It does not rewrite application runtime code.

## Verification After Apply

Run these checks after the migration lands:

```bash
pnpm --dir apps/web type-check
pnpm --dir apps/web build
pnpm --dir apps/web test:projects
```

If the database schema and generated types are aligned, all three should pass.

## Failure Modes

- Missing CLI or authentication: install/login before apply.
- Missing `SUPABASE_PROJECT_REF`: the script exits before making changes.
- Migration drift in the real project: resolve that in Supabase before regenerating types.
- Generated file mismatch: re-run type generation from the actual target project.

## Owner Rule

Only one agent should own activation at a time. If multiple agents are working, they should only share the runbook and not race on the same Supabase project.
