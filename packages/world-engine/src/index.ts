/**
 * @arcanea/world-engine
 *
 * Pure worldbuilding logic shared between the Arcanea MCP server and web app.
 * Zero runtime dependencies — import anywhere.
 */

// Types (import first for clean dependency order)
export type {
  Element,
  House,
  MagicRank,
  NameGender,
  Guardian,
  Godbeast,
  CreationNodeType,
  CreationNode,
  CreationEdge,
  RelationshipType,
  GenerateCharacterOptions,
  GenerateMagicAbilityOptions,
  GenerateLocationOptions,
  GenerateCreatureOptions,
  GenerateArtifactOptions,
  GenerateNameOptions,
  GenerateStoryPromptOptions,
  WorldGap,
  NarrativeArc,
  NarrativeAct,
  ConflictSeed,
  WorldReport,
  Quest,
  FactionReport,
  ElementAesthetics,
  RankVisual,
  CharacterBlueprint,
  LocationBlueprint,
  CreatureBlueprint,
  ImagePromptResult,
} from "./types.js";

// Canon data and helpers
export {
  ELEMENTS,
  HOUSES,
  GUARDIANS,
  GODBEASTS,
  NAME_ROOTS,
  NAME_SUFFIXES,
  GATE_FREQUENCIES,
  getRankFromGates,
} from "./canon.js";

// Generators (return plain objects, no MCP wrapping)
export {
  pick,
  pickMultiple,
  generateCharacter,
  generateMagicAbility,
  generateLocation,
  generateCreature,
  generateArtifact,
  generateName,
  generateStoryPrompt,
} from "./generators.js";

// World intelligence (pure, takes arrays not sessionId)
export {
  analyzeElementalBalance,
  detectRoles,
  detectGaps,
  generateConflict,
  weaveNarrative,
  generateWorldReport,
  generateQuest,
  analyzeFactions,
} from "./intelligence.js";

// Visual prompt generators
export {
  ELEMENT_AESTHETICS,
  RANK_VISUAL,
  ART_DIRECTION,
  characterToImagePrompt,
  locationToImagePrompt,
  creatureToImagePrompt,
} from "./visual.js";
