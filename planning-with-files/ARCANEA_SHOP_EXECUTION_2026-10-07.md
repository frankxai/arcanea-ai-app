# Arcanea shop — implementation and commercial release contract

## Authority and ownership

- Owner: Frank / Arcanea. Implementation: Codex. Independent security/product reviewer: `shop_review`; read-only, 2026-10-07, no blocking preview finding.
- Owning issue: https://github.com/frankxai/arcanea-ai-app/issues/541
- Repository: `frankxai/arcanea-ai-app`; exact base `b1ca2313c820c0a2aaef906cf1e2765d872be7be`.
- Branch: `agent/codex/arcanea-shop-20261007`; draft PR before merge, exact revision evidence before production.
- Skills: Software Studio, Operate Arcanea Creative Worlds, Vercel Connect, Vercel Deployments/CICD. Root AGENTS, app CLAUDE, TASTE and DESIGN read. TASTE wins visual conflicts.
- Portfolio authority: current `frankxai/agentic-ops/STRATEGY.md` read via GitHub (blob `2cb421fa31421d529dfc97c9189313625c9f7b7b`). Shared rails, separate brand offers. This is a source blob, not a verified upstream commit pin.
- Budget: no new vendor subscriptions, ad spend, paid model generation, money movement or data migration in this change. Existing hosting build only.

## Task contract

Scope: deliver `/shop`, four versioned offer previews, creator/collector routes, an original free sample and editable downloads, two useful acquisition guides, canonical metadata and sitemap coverage, a narrow hosted checkout handoff, commercial economics and activation instructions.

Files: `apps/web/app/shop/**`, `app/api/shop/checkout/**`, `lib/shop/**`, `components/shop/**`, two `public/downloads/arcanea-world-starter.*` files, existing sitemap/proxy/navigation additions, and this record.

Non-goals: change canon, migrate subscriptions or credit balances, implement a marketplace, activate unverified products, expose paid production masters in a public repository, create accounts or purchase new services. Existing Stripe subscriptions remain the current separate app rail.

Acceptance: public pages and downloads work at desktop/375px; unknown editions/guides/collections return 404; pricing/content/license labels match preview state; no fictitious reviews, sales, scarcity, 4K or earnings claims; malformed/forged requests rejected; no money request when an edition/configuration is unavailable; exact HTTPS hosted provider origin; build/type/lint and independent review evidence recorded.

Rollback: revert the shop commit/PR. No schema or persistent data changes. Checkout activation is independently disabled by source release flags; remove its environment mapping to suspend a released offer without changing source. Roll back a production deployment only to an inspected earlier production deployment.

## What is delivered

The free World Starter is usable now: a complete original scene, a five-part world brief and editable Markdown/JSON. It is explicitly a new AI-assisted demonstration outside Arcanea canon. Its adaptation permission does not license official characters, trademarks, unrelated gallery artwork or guarantee exclusive copyright in AI output.

The paid catalog is a product specification, not a completed sale. Every edition currently has `priceState: proposed`, `state: preview` and all release approvals false. Checkout cannot be enabled by environment variables alone. The bundle additionally depends on both component editions being released. Product structured data intentionally has no Offer, availability, rating or review claim. Preview schema alone does not qualify for Google's product rich results.

The first paid release should be Worldbuilder, followed by the five-person license using the same owned production files and team worksheets. Living Cosmos and the bundle wait for accepted art masters and exact resolution manifests. No model credits or lifetime cloud cost are bundled into fixed-price files.

## Offer economics: worked scenario, not forecast

Proposed consumer-facing gross prices below use a **19% illustrative VAT rate**, not every buyer's actual rate. Production presentation must use verified tax-inclusive pricing where required. Studio pricing also uses the same conservative gross-price scenario; valid B2B tax treatment changes the result. No VAT exemption or refund restriction is inferred from the word 'license'.

Assumptions: Polar Starter 5% plus approximately €0.50 fixed (published fixed fee is USD; verify conversion), plus 1.5% international-card allowance, charged on the tax-inclusive transaction. Refund reserve is 3% of ex-VAT revenue; payment fees are not refunded. Delivery €0.10/order; allocated routine overhead €1/order; support €3/€8/€1/€4 respectively. Separate production recovery allocation €15/€15/€10/€25. These are planning assumptions and must be replaced with observed costs, fees, payout/FX and refunds. Income tax is not included.

Formula: `R = gross / 1.19`; `C = R × 0.97 − gross × 0.065 − 0.50 − support − 0.10 − 1.00`. `C` is contribution before customer acquisition and production recovery, not company net profit. 'CAC ceiling' below leaves 40% of ex-VAT revenue after the assumed production allocation and acquisition.

| Offer                   | Gross proposed | Ex-VAT revenue | C / order | C / ex-VAT revenue | After production allocation | CAC ceiling at 40% target |
| ----------------------- | -------------: | -------------: | --------: | -----------------: | --------------------------: | ------------------------: |
| Individual Worldbuilder |            €99 |         €83.19 |    €69.66 |              83.7% |                      €54.66 |                    €21.39 |
| Five-person studio      |           €299 |        €251.26 |   €214.69 |              85.4% |                     €199.69 |                    €99.18 |
| Living Cosmos           |            €29 |         €24.37 |    €19.15 |              78.6% |                       €9.15 |                        €0 |
| First Collection bundle |           €119 |        €100.00 |    €83.67 |              83.7% |                      €58.67 |                    €18.67 |

Implications: studio licensing is the strongest proposed acquisition budget; collector editions should initially acquire through owned content and existing audience. A cheap art edition is a weak paid-ad front door under this recovery assumption. Bundle discount (€9 against €128 separate proposed prices) only becomes a savings claim when standalone offers actually sell at those prices. Do not publish a crossed-out invented price. Production recovery per unit falls with volume but rises sharply with low sales; unit margins do not prove demand.

At €99, Starter versus Pro variable savings are approximately `0.012 × gross + €0.10/order`. With a $20/month Pro fee, do not upgrade blindly at a generic revenue threshold; compare actual USD transaction mix and FX, and preserve an existing Early Member rate if the organization has one. No paid plan purchased here.

Optimize contribution per **qualified visitor**, not headline margin: `conversion × (net contribution − acquisition/order)`, with refund/support/delivery failure as constraints. Keep one primary offer, a distinct studio license, and one collector collection. Avoid large SKU sprawl, perpetual couponing and custom support hidden inside a file price.

## Market evidence and validation

World Anvil's current official pricing page segments writers/worldbuilders/artists and professional studios, and sells templates, privacy, co-authoring and continuity tools. That supports the audience and job categories; it does **not** establish demand for Arcanea's proposed €99/€299 editions or a market-size estimate. Its rendered prices were unavailable in the retrieved page, so no competitor price comparison is asserted.

The differentiating job is 'finish a coherent, portable production packet': a worked original example, editable material, explicit costs and continuity checks. A folder of prompts alone does not justify this price. Collector demand is separately tested by the finished collection and previews, not by creator-kit clicks.

Validation sequence once the actual product and checkout are accepted:

1. Review the sample with 10 qualified adult writers/visual creators and 3 small studios using their real current project. Record task completion, missing contents, objections and alternatives. These are proposed counts, not completed interviews.
2. Run the €99 and €299 editions with exact scope and measured delivery. Record qualified sessions → sample download → product visit → provider checkout → confirmed paid order → first download, with no invented events.
3. Inspect at least 20 completed customer tasks and support cases before widening spend. A 'purchase conversion' must come from verified provider order data, not a thank-you page visit.
4. Set a spend cap only after observed contribution and conversion. Compare cohorts and pricing over fixed windows; do not change price daily or infer wins from tiny samples. Pause acquisition if refunds/delivery errors erase contribution. No traffic, conversion or revenue forecast is claimed now.

## Search and distribution

Implemented: server-rendered pages; individual canonical URLs; descriptive titles; internal links from global navigation and footer; accessible image text; original sample; two authored how-to articles; Product and Article JSON-LD reflecting actual page content; stable shop `lastModified`; sitemap entries. Existing robots allows these public pages.

Intent mapping:

| Search job                                       | Destination                             | Evidence on page                                      |
| ------------------------------------------------ | --------------------------------------- | ----------------------------------------------------- |
| Worldbuilding bible / world bible template       | `/shop/guides/worldbuilding-bible`      | Rule-cost-scene method and editable sample            |
| Character visual consistency / visual continuity | `/shop/guides/visual-continuity`        | Reference/version/review method                       |
| Worldbuilding production kit                     | `/shop/worldbuilder-production-edition` | Exact proposed contents, scope and free proof         |
| Small studio worldbuilding workflow              | `/shop/worldbuilder-studio-license`     | Team size, handoff and license boundaries             |
| Fantasy art collection                           | `/shop/living-cosmos-first-edition`     | Honest collection specification and gallery direction |

Next distribution work uses accepted assets: a worked before/after packet, a short scene-to-world demonstration, art-detail previews, and an opt-in owned newsletter. Publish to actual owned profiles only under explicit channel authorization. No email, social posts, ads or partner outreach sent by this change.

Search Console property access and sitemap submission remain unverified. No #1 ranking, search-volume number, indexing or algorithmic recommendation is promised. Useful additional pages must contain distinct finished examples and user tasks; do not mass-produce keyword variants, fabricate reviews or relabel preview offers as in stock.

Google's current Shopping policy excludes ebooks/digital books from Shopping **ads** and explicitly distinguishes free listings. Do not generalize this into 'all digital products are banned' or create a disguised physical-product feed. Recheck eligibility separately for the actual kit/art offer and destination. Organic Search is the initial channel. Product schema without offers/reviews is honest descriptive markup, not a guarantee of rich-result eligibility.

## Services and connectors

| Service                                    | Verified now                                                          | Required next                                                                                                                  | Reason                                           |
| ------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| GitHub plugin                              | Repo read/write; issue #541; isolated branch workflow                 | Exact-commit checks and PR evidence                                                                                            | Version control and review                       |
| Vercel plugin                              | Existing Arcanea project/team and deployments readable                | Successful exact-revision preview and production evidence                                                                      | Hosting, logs, rollback                          |
| Vercel environment access                  | Read inventory returned 403                                           | Project environment management permission or owner configuration                                                               | Server-only accepted checkout mappings           |
| Vercel Connect                             | Project connection listing returned 404 'Connector Project not found' | Confirm project eligibility/connector attachment if later needed                                                               | No connector installation is claimed             |
| Polar                                      | Existing SDK/signature-checking webhook in source                     | Approved merchant, accepted digital product, hosted checkout link and native file-download benefit, tested order/refund/access | Tax/payment/native file delivery                 |
| Stripe                                     | Existing app subscription/credits source                              | Leave separate unless an explicit migration is designed                                                                        | Avoid conflicting payment authority              |
| Supabase                                   | Existing auth/project infrastructure in source                        | Only needed later for verified order/customer entitlement mirror                                                               | No new schema needed for native hosted files     |
| Search Console                             | No verified account/property                                          | Property owner access, inspect canonical URLs and submit sitemap after production                                              | Real search performance                          |
| Existing Vercel Analytics/optional PostHog | Existing analytics code, not verified transaction attribution         | Privacy-appropriate configuration and observed events                                                                          | Measure funnel without pretending purchase truth |
| Email                                      | No sending service configured by this slice                           | Opt-in provider with suppression/unsubscribe controls                                                                          | Consent-based follow-up                          |
| Private file storage                       | Native Polar delivery proposed                                        | Upload accepted ZIP/manifest to private benefits; test access after refund/revoke                                              | Paid files must not live in public downloads     |

A hosted checkout link needs no app payment secret. Configure only the accepted one-time edition's native link; not a subscription link or arbitrary product. Exact `https://buy.polar.sh` origin enforced. URL alone cannot confirm product, price, tax or fulfillment: retain a provider product-ID/price/benefit acceptance record and test it before source approval. No generic 'payment connected' success claim based on packages or environment variable names.

## Lawful commercial structure and release evidence

Reduce complexity through owned digital editions, defined license scope, native delivery and an approved merchant of record. This is compliant structuring, not a method to bypass consumer, tax, IP or privacy law. Merchant of record covers its contracted tax/payment role; it does not supply ownership, human authorship, every seller obligation, local business registration, income-tax advice or a valid blanket 'all sales final' policy.

Before marking an edition released, preserve:

- Seller/provider legal identity, business/contact/complaint details and operating jurisdictions; total price/tax presentation and exact product-ID/price/checkout mapping.
- Exact ZIP version, file list/checksums, tested compatibility and real resolutions. For art: accepted masters, contributor/provider permissions and permitted use; no 4K interpolation masquerading as native detail.
- Accepted individual/studio/personal-display license, clear sublicensing/resale/AI-output limits, update/support terms and no promise of exclusive AI copyright. Each bundle component keeps its permissions.
- Required pre-contract disclosures, durable receipt/terms, applicable refund/remedy process. For qualifying EU immediate digital delivery, obtain explicit prior consent to start and acknowledgment of loss of withdrawal right plus required confirmation; preserve evidence. This does not remove defect remedies. Check current national implementation and the June 2026 online withdrawal-function requirements where the right applies.
- Privacy roles, retention and opt-in marketing consent separate from a transactional purchase; nonessential tracking under applicable consent rules. Accessibility obligations/exemptions need actual enterprise/jurisdiction facts, not an assumed small-business exception.
- Provider review of the actual goods (AI-generated ebooks/art may receive closer review); a verified checkout and file-benefit flow; test paid, failed, duplicate, refunded and revoked access. A signed but TODO-only webhook is not fulfillment.

Then approve price and all release booleans in `lib/shop/catalog.ts`, set the accepted server-only checkout environment mapping for the intended Vercel environment, test the exact deployed revision and publish. Do not enable the bundle until both component deliveries are accepted. Later in-app access must derive from authenticated verified provider events with idempotency and authorization; returning to the shop never grants an entitlement.

## Primary references checked 2026-10-07

- Polar fees: https://polar.sh/docs/merchant-of-record/fees (Starter and Early Member distinctions, international fees, refund/dispute/payout costs).
- Polar merchant of record: https://polar.sh/features/merchant-of-record
- Polar native file benefit: https://polar.sh/docs/features/benefits/file-downloads
- Polar acceptable use: https://polar.sh/docs/merchant-of-record/acceptable-use
- Google Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
- Google unsupported Shopping content: https://support.google.com/merchants/answer/6150006?hl=en
- World Anvil job/audience evidence: https://www.worldanvil.com/pricing
- EU B2C e-commerce guidance: https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/e-commerce-distance-selling/index_en.htm
- Current consolidated Consumer Rights Directive and 2023/2673 amendment: https://eur-lex.europa.eu/eli/dir/2011/83/2026-09-27/eng and https://eur-lex.europa.eu/eli/dir/2023/2673/oj

## Verification status

- Five meaningful checkout tests pass with Node24 + `node --import tsx --test`. The tsx CLI requires an IPC socket forbidden in this runtime; loader invocation succeeds without that socket.
- Changed-scope ESLint passed with zero warnings. Independent review re-ran all five tests and found no blocking security issue for the disabled preview. CSS split into semantic product/layout files after its file-size observation.
- Seven dependency builds passed. Local full Next build stopped only at unavailable external Google font fetches (Instrument Serif, JetBrains Mono); no font/network workaround committed. Vercel build remains the authoritative complete-build check.
- Full app type/lint, exact candidate build/preview, browser 375px/desktop, downloads and GitHub checks are recorded in the PR as they finish. Until then, do not describe this as production verified or payment ready.

### Execution evidence after the first preview

- GitHub PR: https://github.com/frankxai/arcanea-ai-app/pull/542. First candidate `8982f2c947d2cee53b7c7afad636525ea2fbfac7`: Vercel `dpl_6cp8VdAakG4AbdEYSF1RMuvpgEV3` READY; GitHub CI, estate guard and conflict checks passed. CodeQL skipped on the draft event; do not call that a CodeQL pass.
- Cloud-browser desktop verification at 1363px: hero art loaded; no horizontal overflow; free-sample navigation works; edition CTA is sample-only with visible preview state; canonical URLs and Product schema match; Product has no Offer/reviews. Markdown and JSON downloads return 200; sitemap contains 11 shop URLs. These are preview facts, not production or indexing evidence.
- Static guide and collection parameter limits produced HTTP404 for unknown values. The forced-dynamic product page still streamed an HTTP200 not-found response despite `dynamicParams=false`; removed its unnecessary dynamic render mode so the known catalog can use routing-level fallbacks. Display availability is built from accepted configuration; the dynamic checkout endpoint always revalidates source/configuration, so an old page can never bypass an unavailable checkout.
- Added `scripts/verify-shop-browser.cjs` to the existing built-app CI browser gate for desktop, 375px, reduced motion, downloaded content, canonical URLs, preview-only CTA/schema, unknown routes and HTTP checkout. Existing browser gates remain active. The checkout unit suite now runs explicitly in CI. Marking the independently reviewed PR ready triggers the repository's existing browser gates; no new vendor introduced.
- Private owner-review product candidate: `Arcanea-Worldbuilder-Product-Candidate-v0.1.zip`, 22 files, guide plus editable worksheets/CSV/JSON, worked noncanonical example, team handoff and draft license. ZIP integrity, JSON parsing and file checksum manifest validated. Kept outside the public repository; no paid release claimed. Final editorial/customer-task review, merchant/license acceptance and provider delivery remain open.
- Available callable service tools also include Supabase, Resend and PostHog. Availability is not verified account/project configuration. No contacts read or marketing sent. Polar has no callable connector exposed in this session; no account/session was probed.
