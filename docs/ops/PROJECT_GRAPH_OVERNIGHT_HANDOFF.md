# Project Graph Overnight Handoff

Date: 2026-03-30
Owner: One agent at a time
Scope: Activate, verify, and back out the Arcanea project graph rollout

## Goal

Make the project graph authoritative in the real Supabase project, then verify the app still builds and the project continuity path still passes the branch tests.

## In Scope

- `supabase/migrations/20260329000001_chat_projects_graph.sql`
- `supabase/migrations/20260329000002_project_graph_enrichment.sql`
- `apps/web/lib/database/types/supabase-generated.ts`
- `scripts/project-graph-activate.ts`
- `package.json`
- `docs/ops/PROJECT_GRAPH_ACTIVATION.md`
- `supabase/VERIFICATION_CHECKLIST.md`
- `supabase/README.md`

## Out of Scope

- `/chat`
- `/imagine`
- homepage
- `middleware.ts`
- any app runtime refactor unrelated to project graph activation

## Preflight

1. Confirm `SUPABASE_PROJECT_REF` is set.
2. Confirm Supabase CLI is installed and authenticated.
3. Confirm the branch is the intended deployment branch.
4. Confirm no other agent is actively applying the same Supabase project changes.

If any of those are missing, stop and fix the environment first.

## Activation

Run:

```bash
pnpm supabase:project-graph:plan
pnpm supabase:project-graph:apply
```

Expected effect:
- migrations are applied to the linked Supabase project
- generated types are refreshed from the real schema
- the app’s project graph tables and foreign keys become authoritative

## Verification

Run these checks in order:

```bash
pnpm --dir apps/web test:projects
pnpm --dir apps/web type-check
pnpm --dir apps/web build
```

Pass criteria:
- project continuity tests pass
- type-check passes
- production build passes

If you have Supabase access available, also confirm the tables exist:

- `chat_projects`
- `project_memory_links`
- `project_graph_summaries`
- `project_graph_edges`
- `chat_sessions.project_id`
- `creations.project_id`
- `creations.source_session_id`

## Backout

If activation fails after migration application:

1. Stop the rollout.
2. Keep the branch code as-is.
3. Fix the Supabase-side drift or permissions issue.
4. Re-run `pnpm supabase:project-graph:plan`.
5. Re-apply only after the schema and generated types are aligned.

Important:
- Do not revert app runtime code as a reaction to a failed DB apply.
- Do not race multiple agents against the same Supabase project.

## Overnight Checklist

- [ ] `SUPABASE_PROJECT_REF` is set
- [ ] Supabase CLI works locally
- [ ] `pnpm supabase:project-graph:plan` prints the expected migration order
- [ ] `pnpm supabase:project-graph:apply` completes
- [ ] `pnpm --dir apps/web test:projects` passes
- [ ] `pnpm --dir apps/web type-check` passes
- [ ] `pnpm --dir apps/web build` passes
- [ ] Generated types are refreshed from the live project

## Handoff Note

If the next agent picks this up in the morning, the first thing to check is whether the Supabase project ref and CLI auth are still valid. If they are, continue from `pnpm supabase:project-graph:plan`; if not, do not guess.
