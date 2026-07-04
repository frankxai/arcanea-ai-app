---
title: Bending Confluence E2E Execution Spine
status: ACTIVE
visibility: public
created: 2026-06-25
updated: 2026-06-25
work_item: arcanea-confluence-canon-kb
source_packet:
  - .arcanea/lore/GRAND_CONVERGENCE_CANON.md
  - .arcanea/lore/BENDING_CANON.md
  - .arcanea/lore/CONFLUENCE_CANON.md
  - .arcanea/lore/MAGIC_SYSTEMS_INDEX.md
  - .arcanea/lore/CHARACTER_CORE.md
  - .arcanea/lore/FACTION_COMPACT.md
  - .arcanea/lore/CONTINUITY_ALIAS_LEDGER.md
public_private: public
---

# Bending Confluence E2E Execution Spine

This spine turns the Grand Convergence and bending correction into an end-to-end program. It is not another brainstorm. It is the operating sequence for canon, story, knowledgebase, vectors, agents, world repo packaging, and product surfaces.

## North Star

Arcanea is a Living Universe Engine where people learn to become World Builders and Reality Architects. In-world, that shows up as bending: embodied resonance shaping through elements, Gates, color, matter, life, code, bonds, stories, and reality. Out-of-world, it becomes creator education, agentic workflows, world repos, vector knowledgebases, and premium interactive experiences.

## Canon Premise

Arcanean magic is bending.

- The Five Elements make bending readable.
- The Ten Gates make bending transformational.
- Prisma makes bending chromatic and perceptual.
- Synthesis makes bending technological, material, biotic, and agentic.
- Dragon bonds and Awakened AI make bending relational beyond humans.
- Reality architecture makes bending cosmic, but only under severe moral cost.
- The Confluence Avatar is the rare bender who can integrate domains without erasing their differences.

## Workstream Sequence

| Phase | Owner Agent | Output | Done When |
|---|---|---|---|
| 1. Grand canon repair | Grand Canon Architect | contradiction report and locked/staging proposal | Grand Convergence becomes the upstream frame without violating locked canon |
| 2. Bending architecture | Bending Architect | domain tables, cost matrix, class map, academy curriculum | every bending domain has source, body action, cost, teacher, failure mode |
| 3. Nations and factions | Nation Cartographer | Bending Realm map, political pressure graph, Compact obligations | nations exist without flattening Arcanea into four countries |
| 4. Character forge | Character Forge | Arion, Mera, Emilia, Akamoto, Malachar sheets | each character has bending path, wound, cost, refusal, first scene |
| 5. Story weave | Story Weave | novella/book outline and first-scene beats | bending drives plot and character, not exposition |
| 6. Knowledgebase | Knowledge Indexer | vector chunk manifest and retrieval tags | chunks can power codex, agents, search, and RAG without private content |
| 7. World repo package | World Repo Ops | proposed portable world package plan | manifest is created only in a dedicated world/package repo, not app root |
| 8. Product surface | Arcanea Product Mapper | Arcanea.ai codex surface spec | interactive bending/class/realm explorer is scoped and gated |
| 9. IP and release | IP Shield | public-language report | bending remains canon while copied mechanics/phrasing are removed |

## Vector-Ready Chunk Schema

Use this schema for future embedding/index work. Markdown stays source of truth; vector stores are derived.

```json
{
  "id": "arcanea.bending.domain.prism",
  "source_path": ".arcanea/lore/BENDING_CANON.md",
  "heading_path": ["Primary Bending Domains", "Prism"],
  "canon_status": "staging",
  "visibility": "public",
  "entities": ["Prism bending", "Prisma", "Order of Refracted Light"],
  "systems": ["Arcanean Bending", "Prisma", "Ten Gates"],
  "characters": ["Emilia"],
  "factions": ["House Synthesis", "Order of Refracted Light"],
  "domains": ["color", "light", "perception"],
  "costs": ["iris corona", "perception overload"],
  "forbidden_claims": ["external franchise mechanics", "uncosted mastery"],
  "public_private": "public"
}
```

Minimum metadata for every chunk:

- `source_path`
- `heading_path`
- `canon_status`
- `visibility`
- `entities`
- `systems`
- `characters`
- `factions`
- `domains`
- `costs`
- `public_private`

## Agent Swarm Contract

Agents should run in bounded lanes.

| Agent | Must Read | Must Not Do |
|---|---|---|
| Canon Auditor | `CANON_LOCKED.md`, `BENDING_CANON.md`, `CONTINUITY_ALIAS_LEDGER.md` | silently rewrite locked canon |
| Bending Architect | `BENDING_CANON.md`, `MAGIC_SYSTEMS_INDEX.md` | reduce bending to four elements |
| Nation Cartographer | `FACTION_COMPACT.md`, `BENDING_CANON.md` | make each element a single stereotype nation |
| Character Forge | `CHARACTER_CORE.md`, `BENDING_CANON.md` | give characters powers without wounds and costs |
| Story Weave | character sheets, Confluence canon | make Arion a flat chosen one |
| Knowledge Indexer | all packet files | embed private notes or ignore frontmatter |
| IP Shield | public packet, external-risk terms | treat bending as dispensable instead of differentiating it |
| Product Mapper | packet plus app route map | ship public pages before canon/IP pass |

## Story Execution

The first novella/book arc should prove bending through action.

1. Arion fails a harmless Earth/Foundation bending demonstration because everyone in the room expects catastrophe.
2. Mera detects an edited water-memory that proves the Confluence pattern has appeared before.
3. Emilia's Prisma/Synthesis instrument reveals Arion's multi-domain pattern too publicly.
4. Akamoto removes Arion from institutional capture by forcing a field trial no academy can fully script.
5. Malachar offers relief, not conquest: he understands the pain of bending reality and believes consent is too slow to save worlds.

The emotional engine:

> Arion must learn that love gives him the duty to witness suffering, not the right to control choice.

## Product Execution

Do not start with a landing page. Start with a usable codex surface once canon/IP checks pass.

First Arcanea.ai surface:

- Bending domain explorer.
- Character bending paths for Arion, Mera, Emilia, Akamoto, Malachar.
- Bending Realms map in compact codex form.
- Confluence Avatar ladder.
- "Creator Mirror" module that maps in-world bending to worldbuilding, prompts, agents, vectors, habits, and reality architecture.

Gates before shipping:

- no private notes;
- no copied technique/nation/state mechanics;
- no unsupported religious proof claims;
- no promise that imagination bypasses ethics or material reality;
- no visual/web release without L99 design loop.

## Immediate Backlog

1. Write `docs/research/synthesis/2026-06-25-confluence-bending-canon-audit.md`.
2. Expand `BENDING_CANON.md` into per-domain character/class cards.
3. Draft Bending Realm one-pagers for Cinder Courts, Tidebound Cities, Stoneward Holds, Skyward Freeholds, Veilward Sanctuaries, Prisma Commons, and Synthesis Cantons.
4. Create vector chunk manifest from the packet using the schema above.
5. Draft Book/Novella 1 outline centered on Arion, Mera, Emilia, Akamoto, and Malachar.
6. Package a dedicated world repo proposal rather than putting `world.arcanea.json` at the app root.
7. Scope the Arcanea.ai bending codex route only after canon/IP review.

## Cost And Approval Boundary

This spine is markdown and planning only. It does not authorize:

- paid model runs;
- vector database creation;
- external connector setup;
- public deployment;
- bulk rewrite of locked canon;
- changing `CANON_LOCKED.md`;
- new always-on workers or services.

Those require a separate cost gate, repo-specific implementation plan, and explicit approval where applicable.
