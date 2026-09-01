# Arcanea public Supabase binding runbook

## Authority

The public Luminor path is:

`Vercel arcanea-ai-app -> Supabase Data API -> public.luminors -> RLS -> JSON`

The active Arcanea project recorded by issue #307 is
`hcfhyssdzphudaqatxbk`. The project reference is an identifier, not a
credential. GitHub and Vercel must never contain a key value in logs, issues,
pull requests, build output, or client-authored diagnostics.

Public discovery uses only a publishable/anon credential and row-level
security. It must not use `SUPABASE_SERVICE_ROLE_KEY`.

## Required Vercel contract

Configure one complete pair for both Preview and Production:

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`; or
- `SUPABASE_URL` + `SUPABASE_ANON_KEY`.

Do not mix variables across pairs. The expected project URL is
`https://hcfhyssdzphudaqatxbk.supabase.co`.

The route rejects missing, partial, non-HTTPS, example, and placeholder
bindings before opening a network request. The app records only a request ID,
duration, outcome, and stable error code. It never records a URL or key.

## Protected activation

1. In the Vercel project `arcanea-ai-app`, compare the Preview and Production
   bindings to the active Supabase project. Do not copy values into GitHub.
2. Replace a stale pair through the Vercel/Supabase integration or protected
   Vercel environment settings.
3. Redeploy the reviewed exact head through the normal release gate.
4. Probe `GET /api/luminors?limit=1`.
5. Match the response `X-Request-Id` and `Server-Timing` to the Vercel log.
6. Confirm the Supabase API log received the same probe and returned the one
   published row.
7. Observe the production route for the agreed window. No
   `SUPABASE_PUBLIC_*` error and no 503/504 recurrence may remain.

Expected success:

- HTTP 200;
- one published row;
- `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`;
- no service-role use;
- no request beyond the 4.5-second application deadline.

## Query posture

The public path executes one bounded query:

- `published = true`;
- optional `domain` and `element` filters;
- `usage_count DESC`;
- maximum 100 rows;
- maximum offset 10,000.

Do not add an index from repository assumptions. Capture `EXPLAIN (ANALYZE,
BUFFERS)` against the active schema after the binding works, then add the
smallest reviewed partial/composite index only when the plan proves it is
needed.

## Rollback

Rollback is the prior reviewed deployment plus restoration of the last known
good Vercel integration binding. Never roll back by hardcoding a project URL,
committing a key, disabling RLS, or switching public reads to service role.
