# Arcanea Dungeon System Spec

Status: v0 implementation spec  
Updated: 2026-07-01  
Canon posture: Staging. Does not modify `.arcanea/lore/CANON_LOCKED.md`.

## Task Contract

Scope:
Implement the first slice of the Arcanea dungeon system as research, schema, timer/boss logic, and author/game/anime architecture.

Owner:
Arcanea World Engine + Canon Council.

Files:
`packages/world-engine/src/types.ts`, `packages/world-engine/src/dungeons.ts`, research docs, and focused tests.

Non-goals:
No public UI, no Supabase dungeon migration, no generated final art, no locked-canon edits, no protected franchise content copying.

Acceptance criteria:
Dungeon entries can model rights-clean source references, original Arcanea Resonance Vault variants, timed objectives, boss unlocks, collapse stages, rewards, prompt packs, and run evaluation.

Verification:
Run world-engine build and dungeon tests.

Rollback:
Remove `src/dungeons.ts`, the dungeon exports/types, docs, and tests added for this slice.

## Core Concept

Public term: Dungeon.  
Arcanea canon term: **Resonance Vault**.

A Resonance Vault is a temporary trial-space created when Gate resonance, Godbeast memory, Luminor fragments, Nero potential, and unresolved world pressure compress into a navigable challenge. The vault must be worked, understood, and defeated before its resonance window closes.

The primary loop:

```text
Creator intent -> Vault entry -> timed objectives -> boss unlock -> boss victory -> material reward -> proof artifact -> world memory
```

## Product Shape

The system is transmedia by design, but game logic is the spine.

| Surface | Rendered from the same contract |
| --- | --- |
| Game | Rooms, objectives, hazards, timer, boss phases, XP, materials. |
| Anime | Episode beats, rank mismatch, reveal, collapse clock, boss set piece. |
| Fantasy book | Chapter arc, POV pressure, moral cost, material consequence. |
| Author toolkit | Dungeon bible, material index, prompt pack, rights notes. |
| Agentic system | Bounded swarm mission, objective IDs, review gates, score, evidence. |

## Required Dungeon Contract

Every public dungeon entry must include:

- source reference and rights tier
- taxonomy and benchmark mechanics
- original Arcanea variant
- Gate alignment and rank band
- party size
- timed resonance window
- collapse stages
- objective rooms
- boss unlock condition
- boss phases and victory condition
- material rewards
- story/game/anime/book/author/agentic render notes
- canon boundary
- generation policy and negative constraints

## Timer And Boss Rules

- `resonanceWindowMinutes` is the maximum available time.
- `collapseStages` escalate hazards as elapsed time increases.
- Required objectives must be completed before the boss can be challenged.
- If time expires before victory, the vault collapses.
- If the boss falls exactly at collapse, the result is partial extraction.
- Full victory grants all material rewards.
- Partial progress can grant limited materials, but never the boss proof artifact.

## Rights-Clean Source Model

Use the same posture as Creature Atlas:

- protected source: factual metadata and pattern analysis only
- public prompt: original Arcanea variant only
- open rules source: preserve attribution and avoid protected setting text
- generated art: no official maps, logos, boss likenesses, creature likenesses, franchise UI, or copied visual staging

## Agentic Swarm Mapping

Each dungeon can become a bounded Queen/AO mission.

| Role | Dungeon equivalent | Output |
| --- | --- | --- |
| Scout | Entry room | Source/canon packet. |
| Cartographer | Map rooms | Objective graph and route options. |
| Beastwright | Creature ecology | Monster/boss mechanics. |
| Forger | Rewards | Materials, artifacts, usage rights. |
| Chronicler | Story renderer | Anime/book/game beats. |
| Art Director | Visual renderer | Prompt pack and QA plan. |
| Right Use Reviewer | Exit gate | Rights/canon verdict. |
| QA Critic | Boss threshold | Tests and release decision. |

## Generative Art Policy

Generated art is a production layer, not a source of truth.

Allowed outputs after L99 loop:

- key art
- boss silhouettes
- room plates
- material swatches
- beat boards
- book cover studies

Blocked outputs:

- official franchise art imitation
- copied dungeon maps
- recognizable boss designs
- protected logos or UI
- prompts that include protected source names as visual targets

## Next Slice

1. Add a reviewed seed corpus: 20 benchmark records and 10 original Resonance Vault records.
2. Add `/atlas/dungeons` only after the corpus passes rights and canon review.
3. Add a Supabase derived index mirroring Creature Atlas if persistence is needed.
4. Run L99 visual loop before any public dungeon hero or generated media.

