# CURRENT BACKLOG — 2026-10-05

Ordered by revenue leverage. Each slice has an owner class (Frank-only, agent, or either),
acceptance, and verification. Supersedes `CURRENT_BACKLOG_2026-09-12_AUTH_PRODUCT.md` as the
newest backlog; the auth slices there that are still open are carried in §2.

## 1. Turn checkout on (Frank-only, ~1 hour of hands)

1. Complete Polar onboarding for org `arcanea`: identity, payout account, submit details. Until
   `capabilities.checkout_payments` is true no money can move.
2. Create five products in Polar (sandbox first) matching `apps/web/lib/billing/catalog.ts`:
   Creator €19/month, Studio €79/month, Pack 500 €5, Pack 2,500 €19, Pack 8,000 €49.
3. Set Vercel env for the `arcanea-ai-app` project: `POLAR_ACCESS_TOKEN`, `POLAR_SERVER`,
   `POLAR_WEBHOOK_SECRET`, five `POLAR_PRODUCT_*`, `NEXT_PUBLIC_SITE_URL`. Register the webhook at
   `https://www.arcanea.ai/api/webhook/polar` for `order.paid` and all `subscription.*` events.
4. Apply `supabase/migrations/20261005000001_billing_kernel.sql` to project `hcfhyssdzphudaqatxbk`.
5. Buy one sandbox Pack 500 with a test account; confirm `credit_ledger` shows a `purchase` row and
   `/settings/billing` shows 525 credits (500 + welcome 25). Then flip `POLAR_SERVER=production`.

Full procedure: `docs/ops/BILLING_RUNBOOK_2026-10-05.md`.

## 2. Next engineering slices (agent, in order)

| # | Slice | Acceptance | Verify |
| --- | --- | --- | --- |
| 2.1 | Meter chat on Arcanea keys: `api/ai/chat` and `api/chat` call `withReservation` when `providerApiKeySource === 'server-env'`; BYOK costs 0 | anonymous server-key chat → 401; signed-in with 0 credits → 402; BYOK unaffected | tsx tests on the admission branch; manual curl |
| 2.2 | BYOK images: thread `clientApiKey` into `lib/imagine/generate.ts`; cost 0 when present | image on own key debits nothing | test:billing + route test |
| 2.3 | Private billing boundary cleanup: revoke `authenticated` UPDATE on `profiles.subscription_tier`, `stripe_customer_id`, `subscription_ends_at`; read plan from `billing_accounts` everywhere (`feature-gates`, `UpgradeGate`) | a user cannot promote their own tier via PostgREST | SQL grant check + Supabase advisors |
| 2.4 | Enforce entitlements: published sites per plan on `/p/[slug]` publish; seats on `world_collaborators`; API keys only for Studio | Creator with 1 site cannot publish a second | route tests |
| 2.5 | Remove dead commerce: `api/stripe/*`, `api/credits/*`, `lib/types/credits.ts`, `credit_balances`/`forge_subscriptions` tables, `lib/features/feature-gates` 'pro' tier | no references remain | type-check, grep |
| 2.6 | Hosted MCP write tool `save_world_to_arcanea` behind Studio entitlement + API key (`platform_api_keys`) | key-less call rejected; Studio key succeeds | mcp tests |
| 2.7 | Real video provider behind `video.clip` (fal Kling exists in `imagine/animate`; route `/api/ai/generate-video` is a stub) | stub removed; metered | test |
| 2.8 | Homepage: one promise, three doors, one live world proof, pricing link; footer pruned to owned routes | web-release-gate audit + 375/768/1440 screenshots | visual-proof |

## 3. Carried from 2026-09-12 (still open)

- Correct Supabase redirect allowlist after dashboard access (Frank-only).
- Second-provider buyer critique before commercial release (either).
- Data rights: export/delete, retention policy (agent, after 2.3).

## 4. PR triage — 45 open PRs (recommendation; merges are Frank-only)

Principle: merge what is small and true, consolidate what overlaps, close what this branch
supersedes, and stop opening proof drafts until §1 is done.

### Merge now (green, small, aligned)
#445 mobile nav fix · #464 /create title fail-open · #470 feedback durable insert · #447 chat
history account-bound · #466 per-product waitlist + real 404 · #333 public Supabase binding ·
#331 academy living system (doc) · #443 AGENTS bands (doc) · #519 #520 #521 dependabot (after CI).

### Merge after rebase and one review (medium, core product)
#472 owner-scoped media library → #448 media APL boundary → #454 reader canvas (depends on 472).
#403 world drafts recoverable → #505 reading + drafts + creator entry (integration candidate;
close #490, #493, #496, #497 into it or rebase them on it).
MCP lane in order: #388 core registrations → #421 WorldPack canon audit (`@arcanea/mcp-server`
1.1.0) → #393 library search → #498 reader setup and tool limits.
#513 prompt-books actor isolation. #372 Selene & Brío (content; lint first). #512 Myth Studio
(review scope against TASTE before merge).

### Superseded by this branch — close
#449 imagine credit admission (replaced by ledger-backed admission).
#494 pricing honesty + interest signup (replaced by catalog-driven pricing with real checkout).

### CI and ops plumbing — merge if green, else close
#451 preview decision · #491 preview binding · #488 fewer duplicate workflows · #509 release
manifest validator · #506 craft check. Close #508 (Copilot, self-declared blocked).

### Proof drafts — hold as one batch for a content decision
#487 source consolidation · #501 plugin isolation · #499 world SDK hashes · #500 continuity
repairs · #502 Before the Road encounter · #492 music/Suno fundamentals · #378 Selene process.
Decision needed: which of these ship as Library content versus stay as internal process.

### Large UI — review against TASTE.md before anything
#486 LiquidGlassZoom + WorldPack v1 + model arena.

## 5. Cross-repo alignment

- `arcanea` (OSS): generate `.changeset/release-plan.json` and publish `@arcanea/mcp-server` and
  `@arcanea/cli` so `npx -y @arcanea/mcp-server` resolves to the current tool set. The README of
  the production repo already advertises that command.
- `arcanea-agent-skills`: pick the community license (FSL-1.1-ALv2 per `LICENSING.md`) and
  publish the 9-skill pack to skills.sh; it is the free top of funnel for Creator.
- `arcanea-academy`: keep as the free "World Proof" door; link its download packet to
  `/worlds/create?import=proof` once 2.4 lands.
