/**
 * @arcanea/world-engine
 *
 * Pure worldbuilding logic shared between the Arcanea MCP server and web app.
 * Zero runtime dependencies — import anywhere.
 */
export type { Element, House, MagicRank, NameGender, Guardian, Godbeast, CreationNodeType, CreationNode, CreationEdge, RelationshipType, GenerateCharacterOptions, GenerateMagicAbilityOptions, GenerateLocationOptions, GenerateCreatureOptions, GenerateArtifactOptions, GenerateNameOptions, GenerateStoryPromptOptions, WorldGap, NarrativeArc, NarrativeAct, ConflictSeed, WorldReport, Quest, FactionReport, ElementAesthetics, RankVisual, CharacterBlueprint, LocationBlueprint, CreatureBlueprint, ImagePromptResult, } from "./types.js";
export { ELEMENTS, HOUSES, GUARDIANS, GODBEASTS, NAME_ROOTS, NAME_SUFFIXES, GATE_FREQUENCIES, getRankFromGates, } from "./canon.js";
export { pick, pickMultiple, generateCharacter, generateMagicAbility, generateLocation, generateCreature, generateArtifact, generateName, generateStoryPrompt, } from "./generators.js";
export { analyzeElementalBalance, detectRoles, detectGaps, generateConflict, weaveNarrative, generateWorldReport, generateQuest, analyzeFactions, } from "./intelligence.js";
export { ELEMENT_AESTHETICS, RANK_VISUAL, ART_DIRECTION, characterToImagePrompt, locationToImagePrompt, creatureToImagePrompt, } from "./visual.js";
//# sourceMappingURL=index.d.ts.map