# @arcanea/rights-manifest

Machine-readable rights, provenance and licensing record for Arcanea creative assets, plus a
licence-template registry and a fail-closed consistency validator.

Status: **v0, draft**. Every licence template in this package carries
`status: 'draft-requires-counsel-review'`. Nothing here is legal advice and nothing here
activates a sale. The package exists so that the shop, the release pipeline and future
marketplace or on-chain layers all read rights from one record instead of from copy.

## What it is for

The shop catalog (`apps/web/lib/shop/catalog.ts`) gates every edition on
`priceState === 'approved' && rightsApproved === true`, and the release manifest
(`schemas/release-manifest/arcanea.release_manifest.v1.schema.json`) only carries
`rights: { commercialCleared: true, licenseType }`. Both answer "may this ship?" with a boolean
but cannot say _why_: who made it, which AI tools touched it under which plan, what is claimed
and what is not, what a buyer may do, and what still has to happen before a human can flip the
flag.

A rights manifest is that record. The validator turns it into findings, and `isReleaseReady()`
is the single question the shop and release pipeline should ask.

```
asset ──► rights manifest (this package) ──► isReleaseReady()
            │                                   │
            ├─ authorship + AI disclosure        ├─ shop: rightsApproved
            ├─ ownership claim (what is NOT       ├─ release manifest: rights.commercialCleared
            │  claimed, too)                      └─ edition page: summarizeRights()
            ├─ licence grants (template + ceiling)
            ├─ review (counsel, approval receipt)
            └─ optional on-chain registrations (never ownership)
```

## Non-claims (read first)

These are encoded as rules, not just stated:

- A licence to sell AI output is not copyright in it. `aiInvolvement: 'fully-generated'` with
  `copyrightClaim: 'claimed'` is an error (RM002).
- Recording a work on-chain proves neither originality nor legal ownership. Every `onchain`
  block must carry the canonical `ONCHAIN_DISCLAIMER` verbatim, and token-holder grants are
  benefits attached to a token, never an IP assignment (RM007; ceiling of
  `arcanea.token-holder-benefits.v0` prohibits commercial use).
- A commercial grant cannot be `active` on a template counsel has not reviewed (RM009), and an
  `approved` manifest with commercial grants needs `review.counselReviewed: true` plus a human
  approval receipt reference (RM001).
- Canon promotion is a human ruling with a receipt. `official-canon` without
  `review.humanApprovalReceiptRef` is an error; `proposed-canon` cannot be approved (RM012).
- Provider terms are facts to verify, not assumptions. With any commercial grant, every AI tool
  must have `commercialUseAllowed: true`, ideally with `termsUrl` and `termsCheckedAt` (RM004).

## Install and use

Workspace package, Node ≥ 22 (the tests rely on native type stripping, as in
`@arcanea/product-kernel`).

```ts
import {
  validateRightsManifest,
  isReleaseReady,
  summarizeRights,
  getLicenseTemplate,
} from "@arcanea/rights-manifest";

const result = validateRightsManifest(json); // { ok, manifest?, findings[] }
const ready = isReleaseReady(json); // { ready, reasons[] }
const lines = summarizeRights(result.manifest!); // plain-language lines for an edition page
const template = getLicenseTemplate("arcanea.personal.v0");
```

Scripts: `npm test`, `npm run type-check`, `npm run build`, `npm run schema:generate`
(writes `schema/arcanea.rights_manifest.v0.schema.json` from the Zod source).

## Manifest shape (v0)

| Block                   | Purpose                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `asset`                 | id, kind, `contentHash` (sha256), `sourceFiles` (master/preview/…), version history, parents, `canonStatus`                                                                                |
| `creators`              | people and agents with roles, `verified`, optional `sharePercent`                                                                                                                          |
| `authorship`            | `humanContribution`, `aiInvolvement`, `aiTools[]` (provider, plan, `commercialUseAllowed`, terms check), `disclosure` (label, C2PA/SynthID mark)                                           |
| `sourceMaterial`        | what the work was built from and under which right (own, licensed, public domain, CC, fair use, unknown)                                                                                   |
| `thirdPartyPermissions` | model/property/music/trademark releases with evidence refs                                                                                                                                 |
| `ownership`             | `copyrightClaim` (claimed / partial / unclaimed / uncertain), basis, trademarks                                                                                                            |
| `licenses[]`            | grants referencing a template id and version, permission matrix, exclusivity, territories, duration, attribution, fee model, revenue share, revocation, agreement text ref, acceptance log |
| `onchain?`              | registrations (chain, standard, contract, token, deployment stage, EIP-2981 hint) and the mandatory disclaimer                                                                             |
| `disputes[]`            | takedowns, claims, DMCA, with status                                                                                                                                                       |
| `review`                | counsel review, approval receipt, notes                                                                                                                                                    |

Manifest `status` moves `draft → review → approved`, with `revoked` and `disputed` as exits.
Leaving `draft` requires a content hash and a master file (RM011).

## Licence templates

All nine are `draft-requires-counsel-review` and define a permission **ceiling** that a grant
may not exceed (RM009):

| id                                    | plain-language intent                                               |
| ------------------------------------- | ------------------------------------------------------------------- |
| `arcanea.personal.v0`                 | download, display and enjoy privately                               |
| `arcanea.commercial.v0`               | non-exclusive commercial use, no redistribution of the asset itself |
| `arcanea.game-interactive.v0`         | embed in games and interactive media                                |
| `arcanea.music-sync.v0`               | sync music to picture; per-project                                  |
| `arcanea.derivative-remix.v0`         | build on the work with attribution; optional revenue share          |
| `arcanea.collaborative-ip.v0`         | multi-creator ownership and share terms                             |
| `arcanea.exclusive-commission.v0`     | one named client, exclusive, creator keeps portfolio rights         |
| `arcanea.marketplace-distribution.v0` | what a marketplace may do with listings and previews                |
| `arcanea.token-holder-benefits.v0`    | benefits attached to a token; never an IP assignment                |

Agreement texts are referenced by `agreementText.uri` + hash and are authored by counsel; this
package stores structure, not contract prose.

## Validation rules

| Code  | Rule                                                                                                                                                 | Severity        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| RM000 | Structural (Zod) issues, one finding per path                                                                                                        | error           |
| RM001 | Approved + commercial grants ⇒ counsel reviewed + approval receipt                                                                                   | error           |
| RM002 | Fully generated ⇒ no copyright claim; contribution/involvement consistency                                                                           | error           |
| RM003 | AI involved ⇒ disclosure required, label, tools listed; machine-readable mark recommended                                                            | error / warning |
| RM004 | Commercial grants ⇒ every tool permits commercial use; unverified tools otherwise                                                                    | error / warning |
| RM005 | Exclusive grants name the licensee and cannot coexist with other live commercial grants                                                              | error           |
| RM006 | Creator shares and revenue shares ≤ 100                                                                                                              | error / warning |
| RM007 | Token-holder grants need a registration; `onchain.disclaimer` verbatim; mainnet only on an approved manifest; royalty hint needs an enforcement note | error / warning |
| RM008 | Unknown source material blocks commercial approval                                                                                                   | error           |
| RM009 | Grant within template ceiling; template exists; unreviewed template ⇒ no active commercial grant                                                     | error           |
| RM010 | Timestamps and durations are consistent                                                                                                              | error           |
| RM011 | Beyond draft ⇒ content hash + master file                                                                                                            | error           |
| RM012 | Official canon ⇒ receipt + verified creator; proposed canon cannot be approved                                                                       | error           |
| RM013 | `aiTraining: 'allowed'` outright is flagged                                                                                                          | warning         |
| RM014 | Duplicate creator or licence identifiers                                                                                                             | error           |
| RM015 | Open disputes block approval                                                                                                                         | error           |

## Examples

- `examples/living-cosmos-first-edition.draft.json` — the proposed shop edition as it really
  stands on 2026-11-06: no file manifest yet, provider plan unverified, counsel review pending,
  canon ruling pending. Validates clean in `draft` with one warning (RM004) and is not
  release-ready. Nothing in it authorises a sale.
- `examples/fixture-exclusive-commission.approved.json` — synthetic fixture showing a fully
  documented, counsel-reviewed exclusive commission that is release-ready.
- `examples/fixture-community-remix.review.json` — synthetic fixture: a community derivative in
  `review` with a 30% revenue share back to the original creator.

Fixtures use `example.invalid` URLs and `fixture:` identifiers on purpose.

## Relationship to existing code

- `@arcanea/product-kernel` `ProvenanceEvent` records a run's `outputHash`, `promptHash`,
  `sourceRefs` and `syntheticContentMark`. A rights manifest is the asset-level record those
  events roll up into: `asset.contentHash` ↔ `outputHash`, `aiTools[].generation.promptHash` ↔
  `promptHash`, `disclosure.machineReadableMark` ↔ `syntheticContentMark`.
- `creation_engine_assets` (Supabase) stores `model_id`, `prompt`, `seed`, `sha256` per
  generated asset but no rights fields. A later migration can add a `rights_manifest_id` and
  let the database keep the asset-to-manifest join.
- `schemas/release-manifest` can reference `rights_manifest_id` and derive
  `commercialCleared` from `isReleaseReady()` instead of a hand-set boolean.
- The shop guide at `/shop/guides/ai-disclosure-canon-provenance` is the human-readable policy
  this package operationalises.

## Out of scope (deliberately)

- No smart contracts, no minting, no marketplace integration, no payment flows.
- No contract prose. Templates are structure plus non-claims; counsel writes the text.
- No automatic approval. `status: 'approved'` is set by a human and carries a receipt reference.
