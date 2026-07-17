# Arcanea Living Codex + Creature Forge

**Date:** 2026-07-17  
**Status:** IMPLEMENTED VERTICAL SLICE  
**Owner:** Arcanea creative-worlds team  
**Domain class:** D — fiction canon, with canon-first write gates

## Decision

Build one owned product spine instead of a Pokémon clone:

1. **Living Codex** — high-trust, indexable entity pages for Arcanea beings.
2. **Creature Forge** — a local-first tool that teaches ecology-first creature design and exports original drafts.
3. **Entity graph contract** — structured data that future agents, MCP tools, search engines, and generative pipelines can consume.
4. **Dual-rail media** — canon world media remains premium photoreal myth-tech; product chrome remains restrained AI-lab premium.

The best strategic move is not to reproduce a Pokédex. It is to own the operating system that lets a creator build a recognizable, searchable, agent-readable bestiary for an original world.

## Why this wins

### 1. It compounds Arcanea IP

Every Codex entity can become:

- an indexable search result;
- an AEO-readable definition;
- a cinematic still or motion subject;
- an Academy lesson;
- a story encounter;
- a creator prompt template;
- a future collectible, deck, print, or licensed artifact;
- context for Arcanea MCP and world agents.

The entity page is the atomic franchise unit. It is more valuable than a social image because it can continuously accumulate canon, provenance, relationships, media, and community history.

### 2. It turns inspiration into a method

The transferable patterns behind strong creature franchises are:

- ecology before statistics;
- silhouette before detail;
- one signature capability;
- a relationship or bond rule;
- power with consequence;
- visual material language;
- a repeatable progression and collection interface.

Creature Forge makes those principles executable without copying third-party species, cards, names, or layouts.

### 3. It creates an honest product funnel

```text
Search / social discovery
  -> Living Codex entity
  -> inspect design signals
  -> Creature Forge
  -> export original blueprint
  -> generate media in Studio
  -> save into a creator world
  -> publish / collect / collaborate
```

The first conversion is not “buy Arcanea.” It is “leave with a useful artifact you own.” That matches Arcanea’s sovereignty and exportability moat.

## Product architecture

### Surface 1 — `/codex`

- Search by being, form, Guardian, or Gate.
- Filter by Arcanean affinity.
- Use owned, tracked Godbeast media as the primary evidence.
- State canon boundaries in the interface.
- Link to individual entity pages and the Forge.

### Surface 2 — `/codex/[slug]`

- One stable URL per being.
- Metadata, Open Graph, and Schema.org `DefinedTerm` JSON-LD.
- Canon bond, affinities, signature capability, ecology, and recognition signals.
- Links to Guardian context and the original-creature workflow.

### Surface 3 — `/codex/forge`

- No account or API key required.
- Ecology-first inputs: purpose, habitat, fuel, motion, silhouette.
- System inputs: primary/secondary affinity, bond rule, capability, consequence.
- Produces:
  - visible blueprint;
  - deterministic image-generation prompt;
  - copy action;
  - downloadable `arcanea.creature-blueprint.v1` JSON.
- Every output is marked `private-draft` and `not-canon`.

## Entity contract v1

```yaml
schema: arcanea.creature-blueprint.v1
status: private-draft
name: string
thesis: string
ecology:
  habitat: string
  behavior: string
  dietOrFuel: string
design:
  silhouette: string
  motionVerb: string
  materialLanguage: string
systems:
  primaryAffinity: Earth | Water | Fire | Wind | Void | Spirit
  secondaryAffinity: affinity | null
  bondRule: string
  signatureCapability: string
  consequence: string
provenance:
  generatedBy: Arcanea Creature Forge
  canonStatus: not-canon
```

This JSON is deliberately portable. A future MCP server can accept it without coupling to React, Supabase, or a specific image provider.

## Agentic expansion

### Canon Guardian agent

- Reads `CANON_LOCKED.md` before reviewing a proposal.
- Differentiates locked anchors, approved evolving detail, staging proposals, and private drafts.
- Never promotes content automatically.

### Ecology Critic agent

Checks that body, habitat, diet/fuel, motion, and capability form one system rather than a random trait stack.

### Silhouette Director agent

Scores one-second recognizability, material coherence, and visual overlap with existing Arcanea beings.

### Technique Designer agent

Creates techniques only after ecology and capability are stable. Each technique needs:

- tactical job;
- visual read;
- condition;
- consequence;
- counterplay;
- story meaning.

### Media Director agent

Compiles blueprint + visual doctrine into model-specific prompts, stores prompt provenance, and routes approved stills to image-to-video.

### Collector Steward agent

Later manages creator-owned series, variants, provenance, duplicates, rights, print readiness, and completion goals. It should be multi-world and original-IP first—not a Pokémon card database clone.

## Business model

| Layer | Offer | Buyer | Model |
|---|---|---|---|
| Free | Living Codex + local Forge | Fans, creators, search traffic | Acquisition |
| Creator | Saved worlds, private bestiaries, media batches | Worldbuilders, authors, indie teams | Subscription / credits |
| Pro | Continuity agents, canon review, batch entity pipelines | Studios and serious creators | Higher subscription |
| Enterprise | White-label Living Codex + Fandom OS | Games, publishers, licensed IP owners | Setup + annual platform |
| Collectibles | Original Arcanea cards, prints, decks | Fans and collectors | Drops / print-on-demand |
| Open-core | Blueprint schema + MCP tools | Developers | Free core + hosted services |

## Pokémon-adjacent separated wedge

A separate community product may use public APIs for team analysis, collection workflows, and educational content, subject to legal review. It must remain visually and operationally separate from Arcanea canon.

Potential sequence:

1. Open-source data MCP for type/team queries without hosting official art.
2. Multi-TCG collection-goal agent using user-owned inventory exports.
3. Original-card studio for user-owned characters—not fake official cards.
4. Creature-design research content that funnels into Creature Forge.

Do not build an AI-restyled catalog of third-party creatures or a commercial clone of official cards.

## Success metrics

### Product

- Codex entity click-through to Forge.
- Forge completion rate.
- Blueprint downloads / prompt copies.
- Return visits to entity pages.
- Later: draft-to-saved-world and draft-to-media conversion.

### Search / AEO

- Indexed entity URLs.
- Branded entity query impressions.
- Citations/mentions for Arcanea entity definitions.
- Referrals landing on specific Codex entities instead of only the homepage.

### Franchise

- Recognizable silhouette rate in user tests.
- Number of approved beings with complete ecology + relationship + consequence.
- Media continuity pass rate.
- Percentage of outputs with traceable provenance.

## Roadmap

### Now — implemented

- Ten Godbeast anchors.
- Filterable Codex index.
- Individual entity routes.
- Structured data and sitemap coverage.
- Local-first Creature Forge.
- Exportable blueprint schema.

### Next

- Persist Forge drafts into a user world.
- Add blueprint import.
- Connect Forge output to Arcanea Studio media jobs.
- Build comparison view: silhouette, ecology, affinity, bond, consequence.
- Add canon-source references per field.
- Add an MCP tool: `create_creature_blueprint`.

### Later

- Community Apocrypha submissions with moderation.
- Technique/deck layer using original rules.
- Collectible print templates with deterministic text overlays.
- Licensed white-label fandom deployments.
- Optional premium stylized remix rail after canonical visual locks.

## Explicit non-goals

- No Pokémon names, art, card frames, or derivative species.
- No autonomous canon promotion.
- No fabricated AI generation call.
- No third-party collection-price promises.
- No new origin class.
- No replacement of the existing lore archive.

## Evidence used

- `.arcanea/lore/CANON_LOCKED.md`
- `.arcanea/lore/VISUAL_DOCTRINE.md`
- `TASTE.md`
- `DESIGN.md`
- `planning-with-files/ARCANEA_VISUAL_MEDIA_STRATEGY_COUNCIL_2026-07-16.md`
- Existing tracked Godbeast WebP assets under `apps/web/public/guardians/v2/`

Current web search was unavailable in the Hermes runtime, so no unsupported 2026 market claims were added to the implementation.
