# Arcanea Genesis — Reference Architecture and Bounded Plan (Phases 1–2)

Date: 2026-11-06. Companion to the Reality Audit (what exists) and the Frontier Research (what the market is doing). This document is the thin layer between them: how the mission's architecture maps onto the code that already exists, what the business-model scoring says, and a bounded backlog proposed as issues — **not created**, because programme-level issues are Frank's to open (#276 is the programme).

It does not restate TRUTH.md doctrine. Where a decision is Frank's, it is listed under Open Decisions and nothing downstream assumes an answer.

---

## 1. Reference architecture, reconciled with the monorepo

```
                    ┌──────────────────────────────────────────────┐
                    │  Human authority (Frank; counsel for licences) │
                    │  approval receipts (#277), canon rulings (#283) │
                    └───────────────┬──────────────────────────────┘
                                    │ signed receipts
┌───────────────┐   ┌───────────────▼───────────────┐   ┌────────────────────────┐
│ Creation      │   │ Canonical Asset Registry      │   │ Rights Engine          │
│ product-kernel│──▶│ creation_engine_assets (+ id) │◀──│ @arcanea/rights-manifest│
│ ProvenanceEvt │   │ world graph / Realm Graph     │   │ schema · templates ·    │
│ RunReceipt    │   │ asset ↔ manifest ↔ edition    │   │ validator · isReleaseReady│
└───────────────┘   └───────────────┬───────────────┘   └───────────┬────────────┘
                                    │                               │
                    ┌───────────────▼───────────────────────────────▼────────────┐
                    │ Release gate: catalog.ts (priceState==='approved' &&        │
                    │ rightsApproved) ← rightsApproved := isReleaseReady(manifest)│
                    └───────────────┬────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────────┐
          ▼                         ▼                             ▼
   First-party shop           Marketplaces (later)         Optional registration
   Polar MoR (fail-closed)    Roblox/Unity/Etsy/Gumroad    C2PA manifest ref;
   simulated checkout only    via marketplace template     chain pointer with
   until gate PASS            + mandatory AI disclosure    ONCHAIN_DISCLAIMER
```

Mapping notes:

- **Registry = existing tables, not a new service.** `creation_engine_assets` already carries `sha256`, `model_id`, `prompt`, `seed`. Phase 1 adds a nullable `rights_manifest_id` (and a `rights_manifests` table or Blob-stored JSON keyed by `manifestId`). Historical corpus assets (428 images, 845 tracks) get imported as registry rows with `draft` manifests whose `aiTools[].commercialUseAllowed` is `unknown` until evidence is attached.
- **Rights engine = `@arcanea/rights-manifest`.** It never decides; it reports. An `approved` manifest with commercial grants requires `review.counselReviewed` and `review.humanApprovalReceiptRef` (RM001); `official-canon` requires the same receipt reference plus a verified creator (RM012); grants must sit inside a template's ceiling (RM009). Agents can produce `draft`/`review` manifests and nothing above.
- **Release gate = one boolean swap.** `rightsApproved` in `catalog.ts` is hard-coded `false` today; the plan sets it from `isReleaseReady(manifest)`. `priceState` remains Frank-only (#277).
- **Provenance = ProvenanceEvent → manifest.** `outputHash` ↔ `asset.contentHash`, `promptHash` ↔ `authorship.aiTools[].generation.promptHash`, `syntheticContentMark` ↔ `authorship.disclosure.machineReadableMark`. C2PA is an export target (`authorship.disclosure.c2paManifestRef`), not a dependency.
- **On-chain = optional projection, gated by P-ARC-19.** If a token ever ships, its metadata is a projection of `arcanea.token-holder-benefits.v0` plus the disclaimer; `arcanea-onchain`'s trait list becomes a view, not the source of truth.
- **Fleet = roles over existing agents** (Reality Audit §6). No new deployed agents in Phases 1–2.

## 2. Business-model scoring

Scored 1–5 on the mission's own criterion, "accepted user value per unit of complexity, cost, and risk", using the research evidence. Scores are judgement, not measurement.

| Model                                                                    | Value evidence                                                                                          | Complexity            | Cost                           | Risk                                      | Score   | Verdict                                                                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------ | ----------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| First-party digital editions (Living Cosmos, Worldbuilder) via Polar MoR | Catalog exists; Art Basel: 51% of HNW collectors bought digital art; USD 2,500 editions sold at Zero 10 | Low (gate + manifest) | Near zero (BYOK, Polar % only) | Low; counsel review of templates          | **4.5** | Phase 2 target. Simulated checkout until gate PASS.                                                                  |
| Worldbuilder licences (production / studio)                              | Creator-tooling demand; Roblox pays 100% net; Whop median $74/mo shows how thin unfocused products are  | Low–medium            | Low                            | Medium (licence drafting)                 | **4**   | Phase 2b, after counsel reviews `arcanea.commercial.v0` (and a studio tier, which does not exist as a template yet). |
| World licensing to other media (Pudgy pattern)                           | 5M-fan franchise took years; requires canon first                                                       | Medium                | Low                            | Low                                       | **3**   | Later; depends on canon lock (#534).                                                                                 |
| Paid community / membership                                              | 88% of creators sell memberships; TRUTH §2 forbids subscriptions pre-gate                               | Medium                | Low (Discourse Free)           | Medium (support load)                     | **2.5** | Deferred until a product gate passes.                                                                                |
| Hosted credits platform                                                  | Live `/pricing` copy; #511/#529 ledger gaps; TRUTH §2 forbids Frank paying for customer compute         | High                  | Variable, unbounded            | High                                      | **1.5** | Blocked pending Frank's ruling.                                                                                      |
| NFT collection / token                                                   | Market −97%; Blur, Abstract, fxhash closing; royalties unenforced                                       | High                  | Medium (audit, gas, ops)       | High (securities, consumer, reputational) | **1**   | Not before first paid licence (P-ARC-19), and only as benefits pointer.                                              |
| Cross-brand token                                                        | No user need identified; mission forbids speculative tokens                                             | Very high             | High                           | Very high                                 | **0.5** | No.                                                                                                                  |

## 3. Bounded backlog — PROPOSED issues (not created)

Each item is sized for one agent cycle, reversible, and inside the mission's autonomy envelope unless marked **[Frank]**.

### Phase 1 — Rights foundation

| #    | Proposed issue                                                                                                                                                        | Done when                                                                                                                           | Owner                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| P1-1 | **Land `@arcanea/rights-manifest`** (this cycle's draft PR)                                                                                                           | PR reviewed, CI green, merged.                                                                                                      | Agent → Frank review                       |
| P1-2 | **Add `rights_manifest_id` to `creation_engine_assets`** + `rights_manifests` table (jsonb, `schema_id`, `status`, `updated_at`), RLS owner-only                      | Migration lints clean, no data rewrite, down-migration present.                                                                     | Agent; second-family review (touches data) |
| P1-3 | **Historical corpus import script** (read-only over the curated 428 images / 845 tracks): produce `draft` manifests with hashes and `commercialUseAllowed: 'unknown'` | Dry-run report lists every asset and its missing evidence; no writes until Frank says go.                                           | Agent                                      |
| P1-4 | **Wire `isReleaseReady()` into `catalog.ts`** behind the existing gate; keep `priceState` manual                                                                      | `/shop` renders identical output today (all editions still unapproved); unit test proves gate flips only with an approved manifest. | Agent                                      |
| P1-5 | **Tool-terms evidence attachments**: field for plan/tier snapshot and date (Suno plan at download, Midjourney tier)                                                   | RM004 passes for assets with evidence; fixtures updated.                                                                            | Agent                                      |
| P1-6 | **Counsel review of nine licence templates**                                                                                                                          | Each template flipped to `counsel-reviewed` with reviewer and date, or redrafted.                                                   | **[Frank + counsel]**                      |
| P1-7 | **Approval-receipt bridge** (#277): resolve `review.humanApprovalReceiptRef` against real receipts instead of accepting any string                                    | A receipt created by Frank validates a manifest; an absent or unknown one fails RM001/RM012.                                        | Agent, after #277 ships                    |
| P1-8 | **C2PA export spike**: produce a Content Credential for one image using an open-source signer in a scratch branch; measure effort                                     | A memo with the measured steps; no production change.                                                                               | Agent                                      |

### Phase 2 — First collector release (simulated)

| #    | Proposed issue                                                                                                   | Done when                                                                        | Owner                               |
| ---- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------- |
| P2-1 | **Living Cosmos manifest → `review`**: attach six artworks' hashes, Midjourney plan evidence, booklet authorship | `validateRightsManifest` returns zero errors; warnings only on counsel/approval. | Agent + Frank evidence              |
| P2-2 | **Simulated checkout path**: Polar sandbox product, test-mode only, no live token                                | A test purchase completes in sandbox; production still fail-closed.              | Agent; second-family review (money) |
| P2-3 | **Edition page shows the rights summary** (`summarizeRights`) and AI disclosure block                            | Rendered on `/shop/living-cosmos-first-edition` with `data-ai-generated`.        | Agent                               |
| P2-4 | **Canon ruling for Living Cosmos** (#534 / #283)                                                                 | `canonStatus` set by signed receipt.                                             | **[Frank]**                         |
| P2-5 | **Price approval**                                                                                               | `priceState: 'approved'` via receipt; any change is Frank-only.                  | **[Frank]**                         |
| P2-6 | **Go/no-go for live checkout**                                                                                   | TRUTH product gate PASS recorded; Polar live token installed by Frank.           | **[Frank]**                         |

Explicitly **not** in the backlog: token contracts, chain selection, arcanea.nft resolver work, a community platform, hosted credits expansion, new agent deployments, any marketplace listing.

## 4. Threat model (what the rights layer must survive)

| Threat                                                         | Mitigation in place / proposed                                                                                                                                                                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Agent self-approves a manifest or promotes canon               | RM001/RM012 require `review.humanApprovalReceiptRef`; today the validator only checks presence, so P1-7 must resolve it against receipts issued by the human path (#277).                                                                                                |
| Commercial licence sold on an asset whose tool terms forbid it | RM004 hard-fails commercial grants when `commercialUseAllowed !== 'yes'`; P1-5 makes evidence a field, not a memory.                                                                                                                                                     |
| Copyright claimed on fully AI-generated material               | RM002: a `copyrightClaim` of `claimed` is an error when `humanContribution` is none and AI involvement is full; the Living Cosmos draft claims only the booklet text, selection and arrangement.                                                                         |
| Token marketed as ownership                                    | RM007: the `onchain.disclaimer` must equal `ONCHAIN_DISCLAIMER` verbatim, a mainnet registration on an unapproved manifest is an error, and `royaltyBps` without an enforcement note is a warning; `summarizeRights` prints the disclaimer whenever registrations exist. |
| Manufactured scarcity                                          | **Not enforced yet.** v0 has no edition-supply field; TRUTH §4 "honest scarcity" is policy only. Proposed for v0.2: `edition.supply` with a stated `scarcityBasis`, failing closed when a release claims a limit without one.                                            |
| Manifest tampering after approval                              | RM011 requires `asset.contentHash` and at least one master file once a manifest leaves draft; proposed `rights_manifests` rows are append-only by status transition (P1-2).                                                                                              |
| Secret or token leakage via PR                                 | This PR adds no env vars; CI secrets untouched; Vercel token invalid and should be rotated by Frank anyway.                                                                                                                                                              |
| EU AI Act Art. 50 non-disclosure                               | RM003: any AI involvement requires `authorship.disclosure.required: true` with a label; `data-ai-generated` markup is already live on content surfaces. RM013 separately forces `aiTraining` to be a deliberate permission, never a default.                             |
| Legal exposure from unreviewed templates                       | Every template is `draft-requires-counsel-review`; the validator refuses `active` commercial grants until flipped.                                                                                                                                                       |

## 5. Open decisions for Frank (nothing below proceeds without a ruling)

1. **Credits vs BYOK**: is TRUTH §2 (no SaaS, Frank never pays for customer compute) still binding over the live `/pricing` credits page and #276's "bounded managed option"?
2. **Legal entity text**: correct AGENTS.md from "Arcanea BV" to the Eenmanszaak, or confirm a BV is planned.
3. **Counsel**: who reviews the nine templates, and in what order (suggest `arcanea.personal.v0` and `arcanea.commercial.v0` first).
4. **sanctum.arcanea.ai**: create DNS or drop the name from the mission.
5. **arcanea.nft**: keep as Web3-only vanity name, or ignore.
6. **Vercel access**: reauthorize the token so deployment verification is possible.
7. **Chain stance**: record "no chain selected; Story defunct for IP; Base/Solana unproven for this use" so older docs stop implying one.
8. **#661 code licence**: the rights manifest covers creative assets; code licensing is still unresolved.
9. **Repo hygiene**: archive `arcanea-records` and `arcanea-marketplace`?

## 6. What a failed next cycle looks like

Per the estate's craft rule, a cycle that produces another plan and no artifact has failed. The next cycle's artifact is P1-2 + P1-4 (registry join and gate wiring), or P1-3's dry-run report if Frank prefers evidence before schema. Either is reversible and needs no approval.
