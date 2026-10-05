# Myth Studio: creator workflow and business contract

Status: implementation candidate, not a production or commercial launch.
Owner: Frank Riemer; maker: Codex; independent architecture/security reviewer: ownership_review.
Owning issue: #510. Reuse draft PR #512 rather than a competing workbench branch.
Base: main `79f3fb25ca8d34c22eae1210c7c92ae2ebe8ea0b`; starting candidate `401294ce83f78c0598e4ae511a7c0c50a52f8daf`.
Portfolio authority: `frankxai/agentic-ops` default revision `304b2285674338d0de734d132741e67d3b6af385`; STRATEGY, ROADMAP, QUALITY and registry/products.yaml reviewed together. This is a module serving existing Arcanea World Seed validation, not another admitted revenue release.
Skills: Software Studio, World-Class Web Release, Supabase, Vercel deployments and AI persistence. Canon/TASTE reviewed; no lore elevation.

## Task contract

Scope: expose the deterministic myth compiler as an editable workbench; compile, save private snapshots, reopen and export research/production handoffs.
Files: creator-starters typed exports/controller/tests; apps/web myth-studio page/client/styles and API; CI command; this contract. Existing creation gallery only changes where necessary to avoid inappropriate packet actions.
Non-goals: manuscript generation, source ingestion, all-myth coverage, trademark clearance, project schema activation, paid inference, checkout, new identity system, NFTs, merge or production promotion.
Acceptance: input remains editable after failures; changed brief invalidates old exports; readable evidence and unresolved decisions; integer-micro cost model including every planned attempt and review; save receipts only after verified durable response; exact retries recover existing content; cross-owner access denied; recoverable portable exports; no rights/job/payment completion implied.
Verification: compiler and controller adversarial tests; strict TypeScript/lint/build; independent diff review; actual desktop and responsive-content browser checks with stated environment limits; native CI bound to candidate SHA.
Rollback: revert the candidate code commit; disable /myth-studio route. No live DDL or provider spend is needed. Saved rows remain ordinary private drafts owned by users; exports remain portable.
Budget: zero paid model, asset, checkout or blockchain calls. One local dependency install and one coherent native CI revision; reserve time for verification. Stop before merge, production promotion or commercial price activation. Node 22 vendor binaries crash on this host; local diagnostic commands use host Node 24 with pinned pnpm 8.15.0; native CI must establish Node 22 compatibility.

## Who receives value

| Person                   | Starting problem                                                  | Outcome we provide                                            | What they do                                                                      | First proof                                                |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Independent writer       | Myth ideas, scattered references, no concrete production boundary | A traceable source selection and reusable brief               | Compare source anchors, define audience/setting, export to their writing tools    | Reopen a private saved brief and recover identical exports |
| Parent or educator       | Wants age-appropriate stories and discussion                      | Adult-operated planning for family/ages 8–12 material         | Human reviews reading level, frightening content and learning prompts             | An editor accepts one complete story/discussion pack       |
| Small creative studio    | Many assets, unstable costs, unclear handoffs                     | Attempt and review budgets tied to specific deliverables      | Assign editorial work, approve budget separately, record accepted outputs         | Accepted asset cost stays inside the authorized ceiling    |
| Frank / Arcanea operator | Multiple brands and disconnected tools                            | Shared compiler, ownership, provenance and workflow contracts | Curate source witnesses, choose original direction, track release and fulfillment | One actual customer activates the delivered product        |

Family content is an audience choice, not permission for child accounts, chat collection or open-ended interactions. The initial operator is an adult. Child-facing accounts require a separate age/privacy design before launch.

## Product thesis and design decision

Observed: the current Arcanea homepage uses a dark Geist-led interface, teal primary action, source cards and creation shortcuts. The connected database contains creations with owner RLS but none of chat_projects/project_docs. A durable save must use a real deployed boundary.
Recipient: a writer making their first original mythology-based story plan. Promise: turn a selected source set into a costed, recoverable research brief. Primary action: compile research packet. Signature proof: visible evidence, cost calculation and a saved snapshot receipt.

Three directions considered:

1. Research desk: compact labeled inputs beside a packet preview; Geist UI, mono fingerprints; no hero image; clear compile/save/export actions; static interactions. Best for repeated author work.
2. Journey map: geographic source journey and episodic destinations; editorial serif; requires reviewed geographic evidence and accessible map alternatives. Defer: current geography includes unresolved identifications.
3. Production board: staged deliverables with dependencies and operator assignment; Geist operational density; no decorative assets; status transitions. Defer until real jobs and human approvals exist.

Choose research desk. The map would overstate source certainty; the board would imply execution we do not yet provide. No motion is necessary to understand the form. Use host tokens and fonts, keyboard-native controls and mobile stacking.

## Seven connected engineering layers

| Layer                   | Durable record                                                                   | User capability                                                                             | Boundary / verification                                                                                |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1. Evidence             | tradition → myth variant → witness → edition → anchor → claim                    | Compare conflicting tellings and distinguish sources from interpretations                   | Current 12 seeds are metadata, not verified readings or complete coverage                              |
| 2. Creative direction   | brief version, audience, setting, original characters/rules                      | Build contemporary-world stories without importing a modern franchise's specific expression | Human direction, age suitability and Arcanea canon review remain separate                              |
| 3. Production planning  | deliverable, attempt cap, rate, review effort, acceptance rubric                 | Estimate the cost of accepted output rather than the cheapest API call                      | User-supplied rates; provider prices, tax, fees, hosting and distribution excluded                     |
| 4. Durable ownership    | session owner, creation ID, recoverable brief+atlas+packet, fingerprint          | Save privately, reopen, revise into a new snapshot, export                                  | Session-only authorization, owner queries, RLS; direct owner edits are possible and detected on reload |
| 5. Execution            | future work order, lease, idempotency key, authorization, job receipt            | Run bounded writing/image/audio tasks with chosen models                                    | Present export is planning only; no worker, queue or paid action is enabled                            |
| 6. Release              | future rights receipts, human contribution log, asset versions, release manifest | Select accepted material and publish exact approved versions                                | Hashes establish reproducibility, never legal clearance; compiler cannot approve a release             |
| 7. Revenue and learning | future offer/version, order, entitlement, delivery, refund, outcome cohort       | Sell owned work, access updates, export purchases; operator reconciles revenue              | Existing issue #511 tracks atomic credit fulfillment prerequisite; no live sales claim                 |

The frontier capability is selective change propagation: when one witness, budget assumption or accepted asset changes, identify dependent scenes, prompts and renditions; regenerate only the affected outputs after approval. This requires typed dependency edges and evaluation fixtures before agents can act. A generic vector search does not establish that relationship or its permissions.

## Current flow versus future jobs

The implemented candidate accepts a bounded brief and bundled atlas. Anonymous compilation has no inference cost. Authenticated save writes a private research-stage creation; same owner and packet fingerprint derive the snapshot identity. Saving a revised brief creates a distinct version. Exports include brief JSON, research Markdown, packet JSON and a task handoff.

Handoffs are inspectable data. They carry source fingerprints, a specific packet ID, accepted-unit target, maximum planned attempts, estimated cost, human acceptance and executionAuthorized=false. A downstream editor can use them manually. No tool connection, model selection or job completion is simulated.

Future execution states: planned → awaiting_authorization → queued → leased → running → review_pending → accepted/rejected/cancelled. Budget must be reserved atomically before enqueue; retries use a stable idempotency key; leases expire; failed tasks preserve output and incurred cost. A rejected attempt consumes money. Cancellation stops future work, not already-incurred cost. Workers cannot elevate rights or publish outputs.

## Connections and interfaces

| System                        | Owns                                                | Implementation now                                            | Next tested boundary                                                                 |
| ----------------------------- | --------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| GitHub                        | Versioned sources, compiler, code, canon and review | Existing draft #512 and exact-head CI                         | Approved release manifest bound to deployed commit                                   |
| Vercel                        | User experience and HTTP runtime                    | New page and Node API candidate                               | Inspect a real preview, then authorized promotion and production smoke               |
| Supabase                      | Session ownership and transactional data            | Deployed creations columns and existing RLS; no schema writes | Two real test accounts: save, reload, owner denial, database error recovery          |
| Writing/image/audio workflows | Downstream creative work                            | Portable handoff with no execution authority                  | Adapter per provider; cost reservation and durable job/asset receipts                |
| Commerce                      | Order-to-access-to-delivery                         | Proposed shared rail; existing credit defect tracked #511     | Duplicate webhooks, simultaneous credits, failed delivery, refund and reconciliation |
| Asset delivery                | Private masters and approved public renditions      | No new media assets in this increment                         | Private ACLs, signed delivery, content hashes, rendition and rollback receipts       |

No duplicate backends for Arcanea, independent brands or partner editions. A later branded workspace needs a server-enforced tenant/role model and a branding manifest; changing a logo does not provide tenancy. Private prompts, personal manuscripts and paid outputs must never enter a shared cross-user model cache.

## Commercial experiment, not published pricing

First validate one complete original story kit: story, discussion/activity PDF, source notes and original artwork. Sell the useful finished outcome or a bounded assisted creation service before charging for an unproven broad library. The workbench is free activation proof; paid production, reviewed kits, studio/team seats and specific licensing become distinct offers only after evidence.

Test sequence:

1. Recruit 5 adult creators; observe source selection → compile → export. Activation is a usable brief, not a page view.
2. Have 3 complete an original story using the handoff; record time, accepted drafts, editor effort, source misunderstandings and support requests.
3. Seek 2 paid pilot commitments for a clearly specified kit/service. Record actual willingness to pay, not hypothetical subscription interest. Price bands remain proposals.
4. Offer one exact version with scope, license, merchant/tax responsibility, refund/support terms and delivery receipt. Test fulfillment and refund first.
5. Expand only after positive contribution margin and repeated customer outcomes. Park if fewer than 3/5 reach a useful brief or support effort outweighs plausible margin.

Contribution margin per order = cash collected − tax liability − payment/merchant fees − refunds − model/asset costs − human review/production − attributable hosting/delivery/support. Show margins including founder labor; distinguish projected from observed amounts.

Choose the existing shared commerce rail based on merchant-of-record needs, supported jurisdiction and a tested entitlement loop. Do not run Polar and Stripe in parallel merely to offer choices. Blockchain is an optional later collector format, not required for ownership, provenance, downloads or recurring access.

## Research atlas and franchise intelligence expansion

A myth has witnesses and variants, not one guaranteed true story. Track entities, motifs, witness relationships and places with confidence/uncertainty. Never equate a Greek monster with a South American living tradition because of superficial visual similarity.

Adaptation records should connect original source motifs to modern book, film and series changes, with rights owner, release date, audience, distribution and evidence. Commercial observations need metric type, territory, date window, currency, source, methodology and confidence. Box-office gross, production budget, book copies and streaming minutes cannot be collapsed into one success score. Distinguish franchise awareness, execution, marketing and distribution; a successful adaptation does not prove that myth choice caused success.

Ancient source material, a particular modern translation, character expression, artwork and brand/trademark are separate rights questions. Jurisdiction and intended use matter. Do not use Percy Jackson names, distinctive institutions, designs or branding as our original IP. Source-inspired new expression still needs editorial and territory-specific rights review. Community readers are structural for living-tradition material, not an optional AI confidence score.

## Verification and remaining gates

Controller tests cover anonymous compile, session-only save, duplicate and lost-confirmation retry, new versions, owner isolation, tampering, private-stage checks, storage/auth failure, actual byte cap, malformed input and over-budget/living-tradition handoffs.

Remaining before customer release: inspected preview and independent exact-head checks; real two-account Supabase integration; bounded telemetry and support path; project schema migration if project linking is promised; reviewed content and rights; tested commercial fulfillment. No observed revenue, paid execution, production merge or production promotion is claimed by this document.

### Candidate verification update

44 compiler/controller/starter tests passed locally; export check reported zero drift. Local scoped ESLint and full web TypeScript passed after dependency builds. The local Next production build completed successfully with existing tracing/deprecation warnings; exact final revision is still subject to native Node 22 CI. The package manager remains pinned at 8.15.0 and the lockfile is unchanged.

Independent review found no session-ownership or idempotency blocker. Two P2 observations were addressed: pasted setting line breaks normalize to spaces; lookup queries now select by session owner and ID before verification so changed stage/type/visibility produces a conflict. List queries retain the reserved tag and owner, then count invalid classified rows; removing the tag can still make a snapshot absent from the list, while direct lookup detects it. Fingerprints check stored brief/atlas/packet consistency, not all possible owner metadata edits or legal authenticity.

Browser evidence currently covers the existing desktop host. The browser blocks localhost and file URLs and exposes no viewport resize; no mobile capture or new rendered workbench proof is claimed at this stage. A public HTTPS preview is the next permitted inspection surface. Source-read and API tests cannot substitute for that visual evidence. Frontend remains an unapproved interface candidate.

### Sources checked on 2026-10-05

- Supabase [getUser](https://supabase.com/docs/reference/javascript/auth-getuser), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), and [current changelog](https://supabase.com/changelog.md). Reviewed recent middleware, database minor-version and logging changes; this increment introduces no new middleware package, extension, log API, table or migration.
- USPTO [trademark basics](https://www.uspto.gov/trademarks/basics/what-trademark) and [scope](https://www.uspto.gov/trademarks/basics/scope-protection). Specific brand clearance has not been performed.
- U.S. Copyright Office [derivative works, Circular 14](https://copyright.gov/circs/circ14.pdf). Public-domain source status and new expressive material remain separate; this is general U.S. source guidance, not territory-specific clearance.
- Polar [merchant of record](https://polar.sh/features/merchant-of-record) and [buyer terms](https://polar.sh/legal/checkout-buyer-terms). Merchant/tax allocation must be evaluated for the actual offer and seller; no provider is activated by this contract.
