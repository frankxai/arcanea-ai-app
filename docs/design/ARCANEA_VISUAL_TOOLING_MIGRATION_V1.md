# Arcanea Visual Tooling Migration v1

Status: internal operating proposal  
Audit date: 2026-08-25  
Machine-readable registry: `docs/design/arcanea-visual-tooling-surface-registry.v1.json`

## Decision

Arcanea has one canonical lane for identity-bearing campaign media: the manifest-bound Visual Director workflow. Existing product routes, book forges, evaluation runners, and legacy scripts remain separate code surfaces until each is explicitly migrated or retired. Their existence is not permission to bypass canon, spend, provenance, evaluation, or release gates.

The automated audit currently detects 26 provider-adjacent code surfaces and classifies 42 paths across 13 boundaries. It fails when a newly introduced provider-call surface is not registered, when a registered path disappears, when ownership is duplicated, or when the registry no longer names exactly one canonical campaign lane.

## Why this boundary matters

The new campaign system controls the full evidence chain:

`source contract → provider packet → immutable manifest → machine preflight → one-job human grant → one call → decoded-byte receipt → reconstruct readiness → next one-job grant or blind review → human decision → identity qualification → release`

Several earlier callers stop after `prompt → provider → file or response`. That is adequate for an experiment only when clearly labeled and bounded; it is insufficient for a visual identity, book character, public gallery artifact, or claim of continuity.

Product image generation is not automatically the same problem as an internal art-direction campaign. A user-facing runtime needs durable authentication and abuse controls, explicit credit or public-budget policy, provider and model provenance, safety and rights handling, retention rules, and a user-visible save/release state. It should reuse contract and receipt primitives where appropriate without inheriting a human campaign grant that was never intended to authorize public traffic.

The audited Worlds route now follows the current [Gemini API authentication contract](https://ai.google.dev/api) by sending the server key in `x-goog-api-key` instead of placing it in the URL query. This narrows avoidable key exposure in URL logs and intermediaries; it does not solve the route's separate access, spend, abuse, or provenance decisions.

The repository tooling audit now scans active web image-provider callers for `key` and `api_key` URL-query markers, including direct query strings and `URLSearchParams` mutation, and fails verification if one is introduced. Legacy evidence remains inventoried without granting it runtime authority.

## Current surface decisions

| Boundary                                       | Current state                                                                | Required decision                                                                                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Governed Visual Director campaign              | Canonical; execution waiting on current machine preflight and a narrow grant | Run Round 01 only after both receipts exist                                                                                                |
| Authenticated `/api/ai/generate-image`         | Product-separated; auth, credits, and in-process rate limit exist            | Add durable provenance and release receipts before identity claims                                                                         |
| `/api/imagine/generate` and Luminor image tool | Review required                                                              | Remove the unauthenticated credit bypass, or approve a documented public budget with durable rate/abuse controls and per-result provenance |
| `/api/worlds/generate-image`                   | Review required                                                              | Add access/spend controls and receipts; revalidate its hard-coded preview model before promotion; observable art direction and header-based Gemini authentication are regression-tested |
| Studio image route                             | Placeholder demo                                                             | Keep visibly demo-only or replace it through an approved product-runtime design                                                            |
| Book forge and Mila callers                    | Project-specific migration                                                   | Import useful prompts and source passages into versioned contracts before the next identity-bearing generation                             |
| Legacy brand/banner/NFT callers                | Inventory-only hold                                                          | Extract any unique reusable intent, then retire or quarantine the direct caller                                                            |
| Provider evaluation callers                    | Experiment migration                                                         | Require an experiment manifest, call cap, output boundary, and comparable scorecard                                                        |
| Prompt enhancement routes                      | Separate preprocessing                                                       | Record before/after prompt lineage when used upstream of generated media                                                                   |

## Migration order

### Wave 0 — prevent new drift

1. Run `pnpm arcanea:visual:tooling` in every visual-system verification.
2. Register any legitimate new surface before it can merge; registration describes ownership and risk but does not authorize execution.
3. Route all new Arcanea identity work through `arcanea-visual-director`.

### Wave 1 — harden product runtime

1. Choose the product access model for Imagine: authenticated credits, or an explicitly funded public allowance with durable per-user/IP controls.
2. Define `arcanea.product_image_request.v1` and `arcanea.product_image_receipt.v1` as smaller siblings of the campaign contracts.
3. Bind each result to user/request identity, provider-exposed model, processed prompt hash, dimensions, bytes or durable asset URL, moderation state, rights acknowledgment, cost class, and retention state.
4. Make generated suggestions drafts by default. Saving, publishing, and claiming an Arcanea identity are separate decisions.
5. Route the Luminor tool through the same product service rather than granting it an independent provider boundary.

### Wave 2 — migrate book production

1. Convert each forge scene into a source-cited book-character or world contract.
2. Qualify recurring character references through the eight-view identity protocol.
3. Use separate composition families for cover, spread, vignette, and marketing crop while preserving the same identity lock.
4. Record cultural or sensitivity review evidence before eligible publication.

### Wave 3 — reduce the estate

1. Extract unique prompt knowledge from legacy scripts into the prompt knowledge base.
2. Mark the direct caller retired after a replacement produces equivalent or better evidence.
3. Keep historical prompts and result hashes as provenance; do not keep callable duplicates merely as convenience.

## Non-negotiable release test

A visual may enter the public Constellation only when the exact bytes can answer all of these questions:

- Which source contract and immutable provider packet produced it?
- Who or what authorized the call, and within which spend/call boundary?
- Which provider-exposed model, parameters, prompt hash, and reference hashes were used?
- Do decoded dimensions match the declared surface geometry?
- Which two independent scorecards and human decision govern its status?
- Is the identity merely a study, approved for one bounded use, regression-qualified, or actually published?
- What supersedes or rolls back the artifact?

If any answer is missing, the image can still teach internally, but it cannot serve as Arcanea's public visual truth.
