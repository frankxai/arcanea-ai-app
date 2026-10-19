/**
 * @arcanea/world-engine
 *
 * Pure worldbuilding logic shared between the Arcanea MCP server and web app.
 * Zero runtime dependencies — import anywhere.
 */
// Canon data and helpers
export { ELEMENTS, HOUSES, GUARDIANS, GODBEASTS, NAME_ROOTS, NAME_SUFFIXES, GATE_FREQUENCIES, getRankFromGates, } from "./canon.js";
// Generators (return plain objects, no MCP wrapping)
export { pick, pickMultiple, generateCharacter, generateMagicAbility, generateLocation, generateCreature, generateArtifact, generateName, generateStoryPrompt, } from "./generators.js";
// World intelligence (pure, takes arrays not sessionId)
export { analyzeElementalBalance, detectRoles, detectGaps, generateConflict, weaveNarrative, generateWorldReport, generateQuest, analyzeFactions, } from "./intelligence.js";
// Visual prompt generators
export { ELEMENT_AESTHETICS, RANK_VISUAL, ART_DIRECTION, characterToImagePrompt, locationToImagePrompt, creatureToImagePrompt, } from "./visual.js";
// Temporal Multiverse Engine (Realms, Corridors, Linguistics, Chronology, Sandersonian Toll, Monomyth)
export { LINGUISTIC_FAMILIES, CANONICAL_REALMS, CANONICAL_EPOCHS, CANONICAL_GUARDIANS, GATE_TOLL_REGISTRY, MONOMYTH_STAGES, getCanonicalRealms, getLinguisticFamilies, getCanonicalEpochs, getCanonicalGuardians, getMonomythStages, getMonomythStage, calculateCorridorResonance, calculateSandersonianMagicToll, generateRealmName, traceEntityProvenance, } from "./temporal-multiverse-engine.js";
//# sourceMappingURL=index.js.map