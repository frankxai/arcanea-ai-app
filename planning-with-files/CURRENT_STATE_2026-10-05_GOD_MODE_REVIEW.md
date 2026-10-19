# CURRENT STATE — 2026-10-05 (god-mode review)

Truth of disk, database and deployment as verified in this session. Supersedes
`CURRENT_STATE_2026-10-02_NEXT_SECURITY_PATCH.md` as the newest state file. Pair with
`CURRENT_BACKLOG_2026-10-05.md` and `docs/strategy/ARCANEA_REVENUE_ARCHITECTURE_2026-10-05.md`.

## Verified live state

- **Production:** Vercel project `arcanea-ai-app` (team Starlight Intelligence). `main` at
  `93eb7cc` (PR #409, provider-key boundary) was BUILDING at 19:5x UTC; the previous READY
  production build was `79f3fb2`.
- **Database:** Supabase `Arcanea` (`hcfhyssdzphudaqatxbk`, eu-central-1, Postgres 17.6, healthy).
  78 public tables, all RLS-enabled. Row counts that matter: `profiles` 28, `worlds` 0,
  `creations` 0, `user_credits` 0, `credits` 0, `credit_transactions` 0, `waitlists` 2,
  `subscribers` 1, `books` 3, `ingested_documents` 3, `notifications` 16, `analytics_snapshots` 25.
  Reading: 28 sign-ups, no one has built a world or made a creation that persisted.
- **Payments:** Polar org `arcanea` (`08868176…`), status `created`, details not submitted,
  `checkout_payments: false`, default currency EUR, one draft one-time product
  "Agentic Creator OS" €47. No Stripe account was inspected.
- **Pricing page on main:** three cards ($0, $12, $39 "Cloud Bench credits") with no purchase
  action; one waitlist form posting to `/api/waitlist`.
- **Credits on main:** `api/credits/spend` reads columns (`purchased`, `daily_used`, `is_forge`)
  that exist in no migration, swallows DB errors and returns success. Metering is not enforced.
  Second (`credits`) and third (`user_credits`) tables exist with different shapes. PR #449
  documents the same finding.
- **Webhooks on main:** `/api/webhook/polar` verifies signatures then does nothing; middleware
  returns 401 to it before it runs. Two Stripe webhooks write to two different models.
- **Generation on main:** image works (OpenRouter → Grok → Gemini, server keys only). Video route
  returns a hard-coded stub. Audio and music studios are simulated UIs. Voice (TTS/STT) works.
- **BYOK:** browser `localStorage` only; chat routes accept a client key; image routes do not.
- **Repos:** `arcanea` (public mirror, 38 publishable packages, release-plan guard, no
  `release-plan.json` on disk); `arcanea-agent-skills` (private, 9-skill V1 pack, UNLICENSED,
  not published); `arcanea-academy` (World Proof Lab, Next 16.3.5, no DB, Apache-2.0).
- **PRs:** 45 open on `arcanea-ai-app` (18 drafts), five authors (Codex, Claude, Grok, Gemini,
  Copilot, Dependabot). Branch sprawl is the top operational risk. Triage in the backlog file.

## What landed on `claude/admiring-heisenberg-besi86` this session

- Billing kernel migration `supabase/migrations/20261005000001_billing_kernel.sql`
  (`billing_accounts`, `credit_ledger`, `billing_events`, nine security-definer functions,
  owner-read RLS, service-role write).
- `apps/web/lib/billing/{catalog,ledger,polar}.ts` — one catalog, atomic reserve/settle/release,
  Polar checkout/portal, pure webhook mapper.
- Routes: `api/billing/{checkout,portal,balance}`, real `api/webhook/polar`, middleware exemption
  for the webhook POST, `api/imagine/generate` metered through the ledger (401 anonymous,
  402 insufficient, 503 ledger down).
- `/pricing` rewritten from the catalog with live checkout when configured and the Founding
  Circle waitlist otherwise. `/settings/billing` added (plan, balance, portal, top-ups).
- 14 unit tests (`pnpm --dir apps/web test:billing`), all passing. ESLint clean on changed files.
- Docs: revenue architecture, billing runbook, this state file, backlog with PR triage.

## Not done, by design

- Migration is **not applied** to production. Polar onboarding is **not** completed. Both are
  Frank-only actions (see runbook).
- Chat, video, music are not metered yet. Seats, API keys, hosted MCP write are catalog
  entitlements without enforcement.
- Old credit tables and Stripe routes remain in the tree, unlinked.
- No merges or PR closures were performed. Merge authority stays with Frank per
  `AGENT_EXECUTION_PROTOCOL_2026-05-27.md`.
