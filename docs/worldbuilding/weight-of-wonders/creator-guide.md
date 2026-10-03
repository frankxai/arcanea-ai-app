# Use The Weight of Wonders in a story or session

These six works are experimental Arcanea proposals. The collection is a creative resource: three bosses, three linked places, nine encounter phases, nine possible outcomes, an opening fragment and a proposed trilogy. Choose one conflict before choosing a spectacle.

## A twenty-minute preparation pass

1. Open a boss and its related place. Decide which inhabitant the viewpoint character owes something to.
2. Read the entrance aloud. Establish one danger cue in a safe situation before asking anyone to react under pressure.
3. Choose the consequence you want to explore. Repair, disclosure and restored territory each redistribute a real cost; they do not make losses disappear.
4. Copy the dossier's session brief. Add one named witness, one physical object and one promise that cannot be kept for everyone.
5. End the scene with a changed obligation. Carry that obligation into the next place along the river.

For tabletop use, supply the rules, numbers, movement limits and accessible cues appropriate to your own system. The encounter phases describe intent; they have not been balanced or playtested as a game.

## Three community exercises

**The flood mark.** In 600 words, show two residents reading the same mark on a wall and reaching different conclusions. Let both interpretations come from something they have actually lost. Finish when the pressure changes, before either person wins the argument.

**A name offered freely.** Write a conversation between a refugee who wants their original name back and someone who still needs concealment. Give each one detail the registry cannot record. Do not solve the disagreement by revealing a secretly evil participant.

**Who pays for the rain?** Sketch an orchard agreement among an owner, a hired picker and a deprived downstream household. Give each a concession and a right they refuse to trade. Let Qorath's next flight test the agreement.

A useful critique names the exact object, action or sentence that made the world convincing, then identifies one consequence the scene forgot. “More epic” becomes actionable when it means a clearer scale cue, a more costly promise, or a danger that changes how people move through a place.

## Reuse by agents

The source of truth for this expansion is `apps/web/lib/visual-encyclopedia/weight-of-wonders.json`. Use stable IDs (`wow-b01` through `wow-b03`; `wow-d01` through `wow-d03`) and retain each record's `canonStatus`, related slug, image hash and art note. Never infer a locked identity from a generated image.

The corresponding public read-only endpoint is introduced by the runtime release at `/api/lore/weight-of-wonders`. Both `includeProposals=true` and `includeExperimental=true` are required to return the six records. A request without both flags returns no entries. Check the deployed endpoint before claiming availability. Private MCP authentication is independent of this opt-in public lore route.

A reusable instruction for a writing agent:

> Read the selected Weight of Wonders entry and its related place. Treat them as EXPERIMENTAL. Keep locked Arcanea identities unchanged. Begin with an observable action at human scale. Use the entry's danger cues and material history. Give every affected group a concrete stake. Preserve the selected outcome's cost in the next scene. Distinguish proposed lore from what the artwork visibly establishes. If a detail is absent, propose it explicitly instead of reporting it as canon. Return a scene, the continuity assumptions it uses, and one unresolved obligation.

The repository's MCP reader source is an integration deliverable, not evidence that an external npm package or installed plugin has been updated. Use the public JSON or run the reviewed source until a separate package release is verified.

## Continuity and growth

The six entries are separate from the 36-work Sovereign Depths collection. Optional crossovers in the creative packet—the Sundered Engine's bearing alloy and Blackwake blockade testimony—remain proposals linking two proposal collections. They should create competing obligations rather than cameo appearances.

Mara, the pressure keeper in the opening fragment, is provisional and separate from the Destellos heroine project. The three book premises are an outline, not a completed or published trilogy. Local claims that the giant breathes, the palace consumes a first life, or Qorath inherits the storm are beliefs held by inhabitants, not newly locked cosmology.
