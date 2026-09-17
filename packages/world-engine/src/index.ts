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
  DriftFace,
  MissionLane,
  GiftType,
  CanonStatus,
  ReviewVerdict,
  GiftObject,
  RightUseReview,
  ProgressionEvent,
  SISMemoryRecord,
  FactionReport,
  ElementAesthetics,
  RankVisual,
  CharacterBlueprint,
  LocationBlueprint,
  CreatureBlueprint,
  CreatureRightsTier,
  CreatureReferenceMode,
  CreatureAtlasStatus,
  CreatureImageGenerationPolicy,
  CreatureRelationshipType,
  CreatureCitation,
  CreatureSourceReference,
  CreatureRelationship,
  CreaturePromptPack,
  ReferenceCreatureSpec,
  ArcaneaCreatureVariantSpec,
  CreatureAtlasMedia,
  CreatureAtlasEntry,
  DungeonRightsTier,
  DungeonReferenceMode,
  DungeonAtlasStatus,
  DungeonGenerationPolicy,
  DungeonRankBand,
  DungeonFormatTarget,
  DungeonObjectiveType,
  DungeonMaterialClass,
  DungeonRunVerdict,
  DungeonCitation,
  DungeonSourceReference,
  DungeonBenchmarkPattern,
  DungeonObjective,
  DungeonCollapseStage,
  DungeonTimerSpec,
  DungeonBossPhase,
  DungeonBossSpec,
  DungeonMaterialReward,
  DungeonPromptPack,
  DungeonRelationship,
  ReferenceDungeonSpec,
  ArcaneaDungeonVariantSpec,
  DungeonAtlasEntry,
  DungeonRunState,
  DungeonRunResult,
  ImagePromptResult,
} from "./types.js";

// Canon data and helpers
export {
  ELEMENTS,
  HOUSES,
  GUARDIANS,
  GODBEASTS,
  ORIGIN_CLASSES,
  SEVEN_WISDOMS,
  FACTIONS,
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
  canGenerateCreatureImage,
  getCreatureAtlasSafetyNotes,
  creatureAtlasEntryToPromptPack,
} from "./visual.js";

// Dungeon Atlas and Resonance Vault helpers
export {
  canGenerateDungeonArt,
  getDungeonAtlasSafetyNotes,
  dungeonAtlasEntryToPromptPack,
  getDungeonMinutesRemaining,
  getDungeonCollapseStage,
  canChallengeDungeonBoss,
  evaluateDungeonRun,
} from "./dungeons.js";

// Ontology and Knowledge Graph Engine
export type {
  CosmicStratum,
  OntologicalClass,
  OntologicalRelationshipType,
  OntologyNode,
  OntologyEdge,
  OntologyKnowledgeGraph,
  HarmonicAlloySpec,
  WorldDragonSpec,
} from "./ontology.js";

export {
  CANONICAL_HARMONIC_ALLOYS,
  CANONICAL_WORLD_DRAGONS,
  calculateHarmonicAlloy,
  createOntologyGraph,
  addOntologyNode,
  addOntologyEdge,
  validateHarmonicSafety,
  queryTransmediaLineage,
} from "./ontology.js";

