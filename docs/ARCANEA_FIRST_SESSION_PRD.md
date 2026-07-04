# Arcanea First Session PRD

Status: product specification. This document converts Chosen Responsibility and Right Use into the first user activation flow.

Updated: 2026-06-26

## Product Thesis

The first Arcanea session should not ask the creator to browse a platform. It should create a proof artifact.

The user arrives with a crisis, longing, story seed, or creative pressure. Arcanea names the pressure, issues a bounded Gift Object, creates a world seed, assigns one proof-sized trial, and records the result for continuity and rights.

## Target User

Primary:

- Creator with a world, story, game, book, character, or media project they cannot yet structure.
- Builder who likes agents but needs an emotionally coherent creative product.
- Pro creator who wants to package IP into assets, books, games, prompts, or licenses.

Not primary for this flow:

- Passive browsing.
- General AI chat without world creation.
- Crypto-first users looking for minting as the central event.

## User Promise

```text
In one session, turn what you care about into a living world seed and a usable first proof.
```

## Activation Definition

A session is activated when all are true:

1. User submitted intent.
2. Arcanea generated a Gift Object.
3. User accepted or edited the Gift.
4. World Seed exists.
5. User completed or saved one proof-sized Trial.
6. SIS memory record is created.

## First Session Flow

| Step | Screen | User action | System output | Event |
|---|---|---|---|---|
| 1 | The Call | Names crisis, longing, world, or mission. | Drift face and intent summary. | `first_session_started`, `call_submitted` |
| 2 | The Gift | Reviews name, power, cost, right use, first trial. | Gift Object. | `gift_generated`, `gift_accepted` |
| 3 | The World Seed | Chooses or edits premise, laws, visual DNA, tone. | World Bible seed. | `world_seed_generated`, `world_seed_edited` |
| 4 | The Trial | Creates one scene, image brief, character, law, map, or publishing plan. | Proof artifact. | `trial_started`, `proof_created` |
| 5 | The Stewardship Record | Confirms ownership, rights, canon status, next step. | SIS memory and next mission. | `sis_record_created`, `next_mission_selected` |

## Gift Object Contract

Use the `GiftObject` type in `packages/world-engine/src/types.ts` as the implementation anchor.

Required fields:

| Field | Purpose |
|---|---|
| `id` | Stable reference for SIS and analytics. |
| `name` | Makes the Gift memorable and revisable. |
| `type` | Key, Mirror, Compass, Seed, Oath, Instrument, Map, Ember, Lens, or Thread. |
| `driftFace` | The condition the creator is answering. |
| `missionLane` | Worldbuilding, publishing, media, game, education, community, rights, or personal practice. |
| `power` | What the Gift enables. |
| `cost` | The constraint that prevents weightless fantasy. |
| `rightUse` | Ethical usage instruction. |
| `firstTrial` | The proof-sized next action. |
| `canonStatus` | Private, staged, public, licensed, or locked. |
| `sourcePermissions` | References and allowed usage. |
| `commercialPermissions` | Whether money can be made from this artifact. |

## World Seed Contract

Minimum viable world:

```text
name
one_sentence_premise
three_laws
central_tension
visual_dna
tone
two_characters
first_location
proof_artifact
rights_summary
next_mission
```

The World Seed must be exportable into the repo-canonical world format when that pipeline is ready.

## Proof Artifact Types

| Artifact | Good for | Acceptance test |
|---|---|---|
| Scene | Authors and game writers. | Has conflict, cost, and changed relation. |
| Character diamond | Story, game, companion. | Has desire, contradiction, wound, limitation. |
| World law | Worldbuilding. | Creates story pressure and limits future output. |
| Visual brief | Image/video pipeline. | Includes visual DNA and negative constraints. |
| Prompt pack seed | Creator products. | Reusable, rights-aware, and documented. |
| Publishing plan | Books/licensing. | Includes format, audience, rights, next asset. |
| Agent workflow | Pro builders. | Has inputs, tools, output, eval, stop rule. |

## UX Requirements

- First screen must be the working experience, not a marketing hero.
- The user should never face an empty textarea without structured affordances.
- Every generated result must be editable before being saved.
- The Gift must feel personal but not manipulative.
- The flow must explain ownership and export in plain language.
- The system must invite return through next proof, not streak pressure.

## Copy Rules

Use:

- "chosen by responsibility"
- "answer The Drift"
- "create proof"
- "right use"
- "world memory"
- "creator-owned world"
- "source-grounded"

Avoid:

- "addicted"
- "brainwashed"
- "elite chosen few"
- "enemy" for any group of people
- "unlimited power"
- "fully autonomous canon"
- "mint" as the emotional center

## Analytics Events

| Event | Properties | Decision it enables |
|---|---|---|
| `first_session_started` | source, route, variant | Which entry points work. |
| `call_submitted` | drift_face, mission_lane, length_bucket | Which user intents dominate. |
| `gift_generated` | gift_type, model, latency_ms | Model quality/cost tuning. |
| `gift_regenerated` | reason | Prompt and UX friction. |
| `gift_accepted` | edited, gift_type | Gift usefulness. |
| `world_seed_generated` | laws_count, characters_count, latency_ms | Generation reliability. |
| `proof_created` | artifact_type, time_to_proof_sec | Activation health. |
| `sis_record_created` | canon_status, rights_state | Memory/provenance coverage. |
| `export_clicked` | format | Ownership demand. |
| `next_mission_selected` | mission_lane | Retention path. |

## Implementation Tickets

1. Create `/genesis` or promote the existing V3 route into a focused Genesis entry.
2. Build `FirstSessionOrchestrator` with the five steps above.
3. Add `GiftObject` generation endpoint using the world-engine contract.
4. Add `WorldSeed` generation and edit surface.
5. Add `ProofArtifact` save flow and SIS memory stub.
6. Add analytics events behind a privacy-conscious event helper.
7. Add right-use review fields before any publish/export action.
8. Add Playwright smoke path: create Gift -> generate world seed -> save proof.

## Existing Surface Gaps

| Surface | Current risk | Required change |
|---|---|---|
| Homepage/V3 | Stronger copy exists, but it still routes into broad chat/product sprawl. | Make Genesis the dominant next action. |
| Onboarding | Opens with older awakening/guardian language instead of The Call. | Rebuild around Call -> Gift -> Trial -> Proof -> Stewardship. |
| Dashboard | Reads as a general library/workspace rather than proof ledger. | Show active Gift, world seed, proof artifacts, rights status, and next mission. |
| World generation API | Does not yet persist Gift Object, source/rights, proof, and right-use fields. | Extend generation data path before claiming durable world ownership. |
| Media workflow | Image/provider strategy is uneven and not tied to visual QA. | Attach prompt, source, usage tier, and QA score to generated assets. |
| World graph schema | Migrations, generated Supabase types, route inserts, and preview fields may not agree. | Align `worlds`, `world_characters`, `world_lore`, `world_assets`, and `world_events` before production. |
| Chat world mode | Existing world generation responses may not match link expectations. | Normalize API return shape before routing users to created worlds. |
| Proof ledger | Project/memory surfaces exist, but Genesis does not yet seed them. | On save, create project and memory records for intent, Gift, trial, rights, and canon effect. |

## Implementation Bridge Added

`/genesis` now exists as a deterministic front-end prototype of the flow. It is intentionally not yet the durable backend system.

Prototype scope:

- Call intake.
- Drift face selection.
- Mission lane selection.
- Gift Object generation.
- World Seed preview.
- First Trial.
- Stewardship record stub.

Still required before product claims:

- Backend generation endpoint.
- Persistence into world graph and SIS/project memory.
- Right Use Gate save/review path.
- Export to the repo-canonical World Repo Standard.
- Analytics events.
- Playwright smoke test.

## Non-Goals

- Full 3D world generation.
- Marketplace checkout.
- Voice chat.
- Multiplayer.
- On-chain proof UX.
- Canon-locking user drafts.

## Acceptance Criteria

- A new user can complete the flow in under five minutes.
- The fast path produces a Gift, World Seed, and Proof Artifact.
- The user can edit generated output before saving.
- Source, rights, and canon status fields exist in the data path.
- Typecheck and build pass.
- Analytics names are documented and stable.

## Risk Register

| Risk | Mitigation |
|---|---|
| Output feels like generic fantasy. | Canon Director eval and visual DNA constraints. |
| Flow feels manipulative. | Responsibility framing, no shame/streak pressure, editable outputs. |
| Cost/latency too high. | Fast seed first; premium multimodal outputs later. |
| Rights unclear. | Right Use Gate before export or commercialization. |
| Route sprawl hides the product. | Make Genesis the dominant entry point; demote secondary routes. |
