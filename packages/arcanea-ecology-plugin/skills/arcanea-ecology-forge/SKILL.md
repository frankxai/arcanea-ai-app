---
name: arcanea-ecology-forge
description: Design canon-safe Arcanean flora, fauna, fungi, and symbiotic ecosystems with biological causality, magical costs, APL visual direction, and publication-ready provenance.
metadata:
  short-description: Forge living Arcanean ecosystems
---

# Arcanea Ecology Forge

Create organisms that could survive, reproduce, alter their habitats, and matter to a story. Use this skill for Arcanean species, ecological networks, and their visual briefs. Do not use it for ordinary creature concepts that lack ecological relationships.

## Authority and canon state

When working inside the Arcanea repository, read only the sources needed for the requested world. Apply visual authority in this order:

1. The direct brief
2. `TASTE.md`
3. `DESIGN.md`
4. The runtime design system

Apply lore and prompt authority separately:

1. `.arcanea/lore/CANON_LOCKED.md`
2. The relevant world, realm, material-science, and bestiary files
3. `packages/world-engine/src/ecology/` for the canonical EcologyEntry, Gate, provenance, review, and canon-state contracts
4. `prompts/ARCANEA-PROMPT-LANGUAGE.md` and `apps/web/lib/apl/` for the current Spark / Shape / Sharpen grammar
5. `prompts/templates/visual-style.md` for the visual extension

`.arcanea/lore/VISUAL_DOCTRINE.md` is staging reference. Borrow compatible material or light vocabulary only; its faction-poster equation is not a requirement for botanical imagery.

Treat existing staging lore as reference, not permission to promote it. Every new organism and every inferred relationship starts as `proposal`. Only Frank Riemer may explicitly authorize promotion to `locked`. Never rewrite locked canon to make a proposal fit.

For the flora-and-fauna atlas lane, every enriched botanical record remains `proposal`, even when its name or one trait comes from staging lore. Record the sourced trait in `sourceClaims`; record every invented biological, magical, ecological, or visual mechanism in `proposalMechanics`. Do not mark any botanical record `locked` during generation or visualization.

If the canonical files are unavailable, ask for the minimum necessary anchors or proceed as an explicitly labeled Arcanea-compatible proposal. Do not invent an approval, citation, world, Guardian, Godbeast, or canon source.

## Covenant Ecology

Arcanean life is defined by a covenant: what it gives, what it takes, what keeps the exchange in balance, and what breaks when the covenant is violated. Visual spectacle must reveal this system.

For every organism, establish:

- **Body:** substrate, silhouette, structural support, scale, senses, and locomotion or growth behavior.
- **Life:** energy source, storage, expenditure, recovery, reproduction, dispersal, aging, and death.
- **Signal:** what color, heat, sound, scent, movement, or radiance communicates to other life.
- **Network:** at least three consequential relationships, including a producer, consumer or pollinator, and recycler or habitat function where appropriate.
- **Covenant:** gift, cost, steward, taboo, and the observable consequence of exploitation.
- **Arcanean anchor:** world, realm, biome, Gate, one or two of the five canonical elements, and cited lore anchors.
- **Story pressure:** who depends on it, what choice it forces, and what changes if it disappears.

Do not start with a list of magical powers. Start with a survival problem and an exchange.

## Provenance firewall

Never blend what a source says with what the Forge proposes.

- `sources` identifies the exact file, URL, research paper, inspiration, or generated operation.
- `sourceClaims` contains only concrete paraphrases supported by non-generated sources. Each claim cites source IDs and the exact entry field paths it supports.
- A fully original proposal still records its creative brief or generation receipt in `sources`, but may keep `sourceClaims` empty because it inherits no factual botanical claims. Staging and locked records may not.
- `proposalMechanics` contains every inferred or invented mechanism and the exact fields it changes. Its `state` is always `proposal`, even when the mechanism is inspired by a locked fact.
- A generated image or generated text may document a proposal but may never serve as evidence for a source claim.
- If a proposal gives a sourced plant a new lifecycle, anatomy, radiance mechanism, relationship, name expansion, or cultural use, list each addition under `proposalMechanics`.
- Accepted mechanics move out of `proposalMechanics` only after an explicit human approval artifact is recorded as a source; the approval, not the generated draft, supports the new claim.

If a sentence contains both sourced and proposed information, split it into two records. This separation survives publication and later canon review.

## Biological and magical causality

Magic does not replace mechanism. It adds a second metabolism.

- Name the physical or magical input, carrier, storage tissue or organ, trigger, expenditure, recovery path, and failure mode.
- Distinguish bioluminescence, fluorescence, phosphorescence, structural color, reflected light, heat, and Vael resonance. Do not call every bright surface "glowing."
- Radiance must transmit information such as fertility, injury, debt, warning, navigation, predation, or collective state. State its energetic cost.
- Gigantic flora requires load-bearing anatomy, fluid transport, anchoring, wind strategy, and a growth timescale. Enlarging an ordinary flower is insufficient.
- A beneficial exchange may become conditional or exploitative under scarcity. Perfect mutualism is less credible than negotiated dependence.
- Death and decomposition belong to the design. Specify what inherits stored matter, memory, or magic.

Use primary or authoritative biological research when scientific grounding materially affects the concept. Record the mechanism as a paraphrased source note; never copy a real species or another franchise's signature traits wholesale.

## Forge modes

### Audit an existing world

Build a source ledger before synthesis. Preserve exact names and canon state. Separate explicit facts from inference. Report ecological gaps such as missing decomposers, pollinators, juvenile stages, seasonal pressures, or energy inputs.

### Create a species

1. Write one sentence for the survival problem.
2. Define one silhouette thesis and one signature behavior.
3. Complete the body, lifecycle, energy, network, covenant, narrative, visual, provenance, and canon fields in the `EcologyEntry` contract.
4. Run the removal test: describe the first, second, and cultural consequences of extinction or removal.
5. Validate before visualization. Repair errors; disclose unresolved warnings.

### Weave an ecosystem

Prefer a small causal network over a large catalog. Give every proposed species at least three typed edges. Check energy entry, nutrient return, reproductive closure, population control, habitat engineering, and cultural stewardship. Identify keystone organisms and single points of failure.

Do not manufacture a relationship solely to meet the edge count. If a valid relationship is unknown, leave the entry in draft and state what research or design decision is missing.

### Direct imagery

Generate the visual prompt from the accepted entry rather than rewriting the organism during image generation.

Use Arcanean Prompt Language:

```text
[WORLD]
WORLD SPARK: the Arcanea truth this life demonstrates
WORLD SHAPE: the world-level sensory field
WORLD SHARPEN: the world defaults to refuse

SPARK: the single behavior or detail that makes the organism unforgettable
SHAPE: one or two sensory palettes — Forge, Tide, Root, Drift, or Void
SHARPEN: the obvious visual defaults and franchise similarities to remove

@form visual
@tone cinematic | intimate | surreal | documentary | iconic | raw
@render cinematic | concept-art | premium-photo | editorial | painterly
@anchor the single biological event that owns the frame
@exclude visual failure territory
@element the dominant sensory palette
```

Then specify organism anatomy, scale evidence, ecological action, environment, material behavior, light logic, camera, depth, and finish. Use one coherent scene per image. No labels, typography, collage, UI, watermark, collectible-monster framing, decorative neon, plastic surfaces, copied franchise traits, or generic fantasy ornament.

The minimum useful image set is:

- **Habitat hero:** the organism performing its covenant at environmental scale.
- **Specimen portrait:** anatomy and material behavior legible without losing life.
- **Relationship moment:** one dependency made visually causal.

Do not generate imagery for an entry that fails validation or has unresolved canon conflicts.

## Output contract

Inside `arcanea-ai-app`, conform to `packages/world-engine/src/ecology/ecology-entry.schema.json` and use the exported validator. Keep prose fields concrete enough to be tested or visualized.

When the Arcanea MCP server is available:

- `plan_ecology_entry` establishes the proposal constraints and provenance firewall.
- `validate_ecology_entry` checks a draft or publication candidate.
- `analyze_ecosystem` finds dangling relationships and missing ecosystem functions.
- `build_ecology_visual_prompt` compiles a validated entry into APL without changing its content or canon state.

These deterministic tools do not replace authorship. The skill performs synthesis; the tools preserve contracts and catch drift.

Return, in order:

1. A concise concept thesis
2. The complete `EcologyEntry`
3. Validation errors and warnings
4. An interaction summary or graph-ready edge list
5. The APL visual prompt and negative prompt when imagery is requested
6. A canon decision request only if promotion beyond `proposal` is needed

## Release gates

An entry is not ready for review unless all are true:

- Its silhouette remains identifiable at thumbnail scale.
- Its radiance, magic, and gigantism have mechanism and cost.
- Its lifecycle closes and its death feeds a credible sink or successor.
- It has at least three meaningful ecological relationships.
- The removal test produces concrete ecological and cultural consequences.
- Arcanean Gate and element usage does not contradict locked canon.
- The Spark is specific; Shape is sensory; Sharpen removes generic defaults.
- Provenance distinguishes canon, research, inspiration, and generated material.
- Source claims and proposal mechanics are separate and cross-referenced; generated output never substantiates canon.
- New lore remains `proposal` until explicit human acceptance.

Score review candidates from 0–5 on biological coherence, ecological closure, covenant logic, originality, canon alignment, and visual readiness. Totals of 26–30 may ship to human review, 22–25 require one explicit revision pass, and anything below 22 restarts from the concept rather than receiving cosmetic polish.
