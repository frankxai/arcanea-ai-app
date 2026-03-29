# Arcanea Preview Environment Checklist

Date: 2026-03-29
Status: Draft operating checklist
Use for: any preview or release candidate touching app, auth, billing, chat, imagine, or storage

## Purpose

Arcanea now has env-sensitive product surfaces that cannot be trusted based on local code shape alone.

This checklist is the minimum preview environment contract before calling a release candidate real.

## Gate 0: Install And Build Preconditions

- Node version matches repo expectation
  - target: `20.x`
  - note: current verification environment used `v24.14.0` and produced engine warnings
- `pnpm install --frozen-lockfile` succeeds
- `pnpm --dir apps/web type-check` succeeds
- `pnpm --dir apps/web build` succeeds

## Current Verified Blockers On March 29

Current `main` failed verification for these reasons:

- `apps/web/app/api/memories/route.ts`
  - `user_memories` is missing from generated Supabase types
  - `LIMIT_EXCEEDED` does not match current error-code typing
- `apps/web/hooks/use-chat-sessions.ts`
  - cloud-to-local session conversion still returns `unknown[]` where `ChatMessage[]` is expected
- `apps/web/lib/analytics/events.ts`
  - `posthog-js` dependency is imported but not installed
- `apps/web/lib/phosphor-icons.ts`
  - `Stop` is not exported from current `@phosphor-icons/react`

Interpretation:

- preview env readiness is currently blocked by both code-contract issues and missing dependency alignment

## Gate 1: Core App Runtime Env

Required:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SITE_URL`
- `VERCEL_ENV`

Verify:

- canonical domain resolves correctly
- sitemap and robots use correct host
- callbacks and redirects point to preview/stable target intentionally

## Gate 2: Supabase

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Verify:

- auth login/signup can initialize
- public data reads succeed
- service-role routes can execute
- schema-generated types are current with actual tables

Critical checks:

- `chat_sessions`
- `credit_balances`
- `credit_transactions`
- `forge_subscriptions`
- `user_memories` if memory routes are active

## Gate 3: Billing / Credits

Required:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_CREATOR`
- `STRIPE_PRICE_STUDIO`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Verify:

- checkout session creates successfully
- webhook signature validates
- one-time credit purchase lands in balance
- subscription create/update/delete paths reconcile state correctly
- fallback behavior is 503 or explicit degraded mode, not silent corruption

## Gate 4: AI Providers

Required for core product confidence:

- `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`

Optional by surface:

- image/video providers used by imagine
- OpenRouter keys if that path is enabled

Verify:

- chat has at least one healthy provider
- imagine has at least one healthy generation provider
- provider errors surface clearly
- no default model IDs are stale

## Gate 5: Storage / Blob / Media

Required when media uploads or gallery flows are active:

- `BLOB_READ_WRITE_TOKEN`
- any Supabase storage config required by gallery/media routes

Verify:

- upload route accepts file
- public URL resolves
- gallery/list route can read expected objects

## Gate 6: Observability

Recommended:

- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- analytics token such as PostHog if analytics are enabled

Verify:

- analytics dependency exists if imported
- client-side analytics do not break build when absent
- Sentry setup fails soft in preview if intentionally disabled

## Protected Surface Checks

### `/chat`

- sidebar renders
- send/stream path works
- session save/load works
- cloud sync degrades gracefully if unauthenticated

### `/imagine`

- provider selection resolves
- one image generation path works
- prompt input and history do not regress
- public access behavior is intentional

### homepage / `v3`

- hero loads without layout regressions
- deferred/lazy elements do not hide critical content
- analytics/perf integrations do not break build

### billing / credits

- balance route works with real data
- spend route does not corrupt balance on partial failure
- webhook behavior is idempotent

## Release Decision Rules

Ship preview when:

- all required env vars for affected surfaces are present
- build/type-check are green
- protected surface spot checks pass

Do not ship preview when:

- generated DB types lag schema
- payment env is partial
- analytics dependency is imported but absent
- type-check only passes by ignoring the affected surface

## Owner Checklist

Before saying “preview ready”, record:

- who verified
- which surfaces changed
- which env vars were present
- what still degrades intentionally
