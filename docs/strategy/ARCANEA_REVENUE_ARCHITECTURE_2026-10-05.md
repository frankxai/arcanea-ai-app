# Arcanea Revenue Architecture — 2026-10-05

Status: proposed for ratification by Frank. Supersedes the seven pricing models written between
2026-02 and 2026-09 (see §8). Everything in §1 to §5 is implemented in code on branch
`claude/admiring-heisenberg-besi86`; nothing is live until the runbook in
`docs/ops/BILLING_RUNBOOK_2026-10-05.md` is executed and the migration is applied.

## 0. Ground truth on 2026-10-05 (verified this session)

| Fact | Source |
| --- | --- |
| 28 profiles, 0 worlds, 0 creations, 0 credit rows, 2 waitlist emails, 1 subscriber | Supabase `hcfhyssdzphudaqatxbk`, `list_tables` |
| Polar org `arcanea` exists, `checkout_payments: false`, onboarding not submitted, 1 draft product | Polar `organizations_list`, `products_list` |
| Pricing page shows $0 / $12 / $39 with no checkout button; only a waitlist form | `apps/web/app/pricing/pricing-client.tsx` on `main` |
| Three disjoint credit systems; the one the image route calls has column names that match no migration | `lib/types/credits.ts`, `api/credits/spend`, `20260324000001_credits_system.sql`, PR #449 |
| Polar webhook handler was two `TODO` branches and was 401-blocked by middleware | `api/webhook/polar/route.ts`, `middleware.ts` |
| 45 open PRs, 18 of them drafts, authored by five different agents | GitHub `list_pull_requests` |
| Production homepage hero: "Build living worlds with AI agents." Footer: 40 links. Video studio returns a stub; audio studio is simulated | Vercel deployment `dpl_EsnqcP39…`, explorer report |

The company has shipped a great deal of surface and zero revenue. The constraint is not features.
It is that no single path from "visitor" to "paid" exists end to end, and seven documents disagree
about what that path should be.

## 1. The thesis, stated once

**Arcanea sells continuity.** A creator's world, canon, characters, chapters and media stay
connected across sessions, tools and years. Everything that is knowledge (the Library, the canon,
the MCP server, the skills) is free and open. Everything that is capability on our infrastructure
(hosted memory, publishing, team seats, managed generation) is paid.

Three consequences:

1. **BYOK is free, forever.** It is the funnel, the trust signal and the moat against "just another
   wrapper". Nothing on the free plan is throttled when the creator brings a key.
2. **A plan buys continuity, not compute.** Hosted world graph with memory, a published world site,
   seats, API key. The monthly credit grant inside a plan is a convenience, sized so the plan is
   never a loss.
3. **Credits buy compute, metered, never unlimited.** One credit is about one cent of provider list
   cost. Image, video, music, voice and frontier chat on Arcanea keys all draw from the same ledger.
   "Unlimited" anywhere in the catalog is a bug.

## 2. The catalog (single source of truth: `apps/web/lib/billing/catalog.ts`)

| SKU | Price (EUR, VAT incl.) | Includes |
| --- | --- | --- |
| Spark | €0 | BYOK everywhere, Library, MCP, local exports, 25 welcome credits |
| Creator | €19 / month | Hosted world graph + memory, 1 published world site, 1,500 credits/month, priority queue |
| Studio | €79 / month | 5 seats, unlimited published sites, 8,000 credits/month, API key, hosted MCP write tools |
| Pack 500 | €5 | 500 credits |
| Pack 2,500 | €19 | 2,500 credits |
| Pack 8,000 | €49 | 8,000 credits |

Action costs: chat standard 1, chat frontier 5, image standard 10, image premium 25, video clip 150,
music track 60, voice minute 2, export 0. Set with roughly 2x headroom over provider list price, so
credit gross margin stays above 50% even at the premium model.

Unit economics at the ratified Polar fee (5% + €0.50, +1.5% non-EU cards), using the existing
`scripts/model-creator-economics.mjs` model: Creator contribution ≈ €10 per member per month after
VAT, fees, refund reserve and infra; Studio ≈ €50. Break-even on fixed cost is 10 Creator members.

## 3. One payment path: Polar

Decision: **Polar is the only payment provider.** Reasons, in order:

1. Merchant of record. Polar collects and remits EU VAT. The seller has no BV yet and is in the
   Netherlands; Stripe Billing would make Frank the merchant and the VAT filer. This alone decides it.
2. One org already exists, the SDK is already in `apps/web/package.json`, the webhook route exists.
3. Fee delta versus Stripe (about 2 points) is irrelevant below €10K MRR.

The Stripe routes (`api/stripe/*`, `api/credits/*`) stay in the tree, unlinked, until a later slice
deletes them. They are not called by any UI after this change.

## 4. The kernel (what landed)

```
supabase/migrations/20261005000001_billing_kernel.sql
  billing_accounts      plan, status, Polar ids, balance, reserved   (owner read, service write)
  credit_ledger         append-only, unique (kind, reference)          (owner read, service write)
  billing_events        webhook inbox keyed by delivery id
  billing_* functions   ensure/grant/reserve/settle/release/set_plan/record_event, security definer

apps/web/lib/billing/catalog.ts   prices, packs, action costs, entitlements, readiness
apps/web/lib/billing/ledger.ts    typed RPC wrappers + withReservation(reserve → work → settle | release)
apps/web/lib/billing/polar.ts     checkout, portal, pure mapPolarEvent(event) → ledger intents

apps/web/app/api/billing/{checkout,portal,balance}
apps/web/app/api/webhook/polar    verified → recorded once → intents applied → marked
apps/web/app/api/imagine/generate reserve(count × cost) → generate → settle(actual) | release
apps/web/app/pricing              catalog-driven, real checkout when configured, waitlist otherwise
apps/web/app/settings/billing     plan, balance, portal, top-ups
```

Invariants live in Postgres, not in route handlers: balances cannot go negative, every change is a
ledger row, every reference is unique, every webhook delivery is applied once. Retrying anything is
safe.

## 5. What is deliberately not in this slice

- Monthly credit grants on subscription renewal are driven by Polar `order.paid` with
  `billing_reason = subscription_cycle`. No cron is needed. Credits from a plan do roll over; a cap
  (for example 3× monthly grant) is a one-line follow-up in `billing_grant_credits` if abuse shows.
- Chat, video and music routes are not yet metered. `withReservation` is the one call they need.
  Video and music cannot be metered until a real provider replaces the stub.
- BYOK on image routes: the image routes use server keys only. Adding `clientApiKey` passthrough
  makes BYOK images cost 0 credits. Backlog item.
- Seats, API keys and hosted MCP write tools are entitlements in the catalog but not enforced yet.
- No removal of the old credit tables. Drop them in a later approved slice once no code reads them.

## 6. Distribution and funnel (how a stranger becomes a member)

1. **MCP and skills are the top of funnel.** `npx -y @arcanea/mcp-server` and the nine creator
   skills in `arcanea-agent-skills` run inside Claude Code, Codex, Cursor. The free, read-only tools
   (canon, Library search, world context) carry the brand into agent workflows. The first hosted
   write tool (save a world to arcanea.ai) is the moment an account is needed.
2. **The Library is the SEO asset.** 20 public collections, 57 texts, plus books. Every text page
   should end with the same two doors: read more, or open this in your world.
3. **Worlds are the product.** `/worlds/create` → hosted graph → `/p/[slug]` publication. The
   Creator plan is bought at the moment a creator wants their world to persist and be seen.
4. **Credits are the impulse purchase** inside Imagine and, later, Cinema and Music.
5. **Studio is sold by hand** to the first ten teams, from the Founding Circle list.

Homepage consequence: one promise ("Your world keeps its memory"), three doors (Read, Build,
Install), one proof (a live world), one price link. The forty-link footer is a liability; prune to
the routes that have an owner and a revenue role.

## 7. Moat

Not features. (a) Canon depth: 415 markdown files, a locked vault, ten Gates, a naming registry.
(b) Continuity data: the world graph plus memory becomes more valuable to its owner every session.
(c) Agent-native distribution: the same canon is callable from every coding agent through MCP.
(d) Taste: `TASTE.md` and `DESIGN.md` as enforced constraints, not vibes.

## 8. Documents this supersedes

`docs/strategy/ARCANEA_PLATFORM_STRATEGY.md` (Feb), `docs/plans/ARCANEA_REVENUE_MODEL_V2.md`,
`docs/plans/ARCANEA_REVENUE_MODEL_FINAL.md`, `docs/strategy/MONETIZATION_PLAYBOOK.md` (Mar),
`.arcanea/strategy/MCP_PRODUCT_STRATEGY.md`, `.arcanea/strategy/MONETIZATION_2026.md`,
`.arcanea/strategy/THE_REAL_PLAY.md` (Apr), the price hypotheses in
`docs/superpowers/specs/2026-09-12-arcanea-product-foundation.md` (Sep). Their research stays
useful; their prices and provider choices do not. Where any of them disagrees with
`apps/web/lib/billing/catalog.ts`, the catalog wins.

## 9. Decisions requested from Frank

1. Ratify Polar as sole provider and complete Polar onboarding (identity, payout account).
2. Ratify the catalog prices in §2, or edit `catalog.ts` and let the page follow.
3. Approve applying `20261005000001_billing_kernel.sql` to production Supabase.
4. Approve the PR merge order in `planning-with-files/CURRENT_BACKLOG_2026-10-05.md`.
