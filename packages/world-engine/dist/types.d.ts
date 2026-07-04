/**
 * Shared types for the Arcanea World Engine.
 *
 * All public interfaces are defined here so callers can import types
 * without pulling in any generation logic.
 */
export type CreationNodeType = "character" | "location" | "creature" | "artifact" | "ability" | "story";
export interface CreationNode {
    id: string;
    type: CreationNodeType;
    name: string;
    element?: string;
    gate?: number;
    createdAt: string;
    metadata: Record<string, unknown>;
}
export type RelationshipType = "created_by" | "mentored_by" | "located_at" | "wields" | "inhabits" | "guards" | "opposes" | "allies_with" | "transforms_into" | "derived_from" | "part_of" | "same_element" | "same_house" | "same_gate";
export interface CreationEdge {
    id: string;
    sourceId: string;
    targetId: string;
    relationship: RelationshipType;
    /** Relationship strength, 0–1 */
    strength: number;
    metadata?: Record<string, unknown>;
}
export type Element = "Fire" | "Water" | "Earth" | "Wind" | "Void" | "Spirit";
export type House = "Lumina" | "Nero" | "Pyros" | "Aqualis" | "Terra" | "Ventus" | "Synthesis";
export type MagicRank = "Apprentice" | "Mage" | "Master" | "Archmage" | "Luminor";
export type NameGender = "masculine" | "feminine" | "neutral";
export interface Guardian {
    name: string;
    gate: number;
    domain: string;
    element: string;
}
export interface Godbeast {
    name: string;
    gate: number;
    form: string;
}
export interface GenerateCharacterOptions {
    archetype?: string;
    primaryElement?: string;
    gatesOpen?: number;
    house?: string;
    nameGender?: NameGender;
}
export interface GenerateMagicAbilityOptions {
    element: string;
    gateLevel: number;
    purpose?: string;
}
export interface GenerateLocationOptions {
    type?: string;
    dominantElement?: string;
    alignment?: "light" | "dark" | "balanced";
}
export interface GenerateCreatureOptions {
    element?: string;
    size?: "tiny" | "small" | "medium" | "large" | "massive";
    temperament?: "hostile" | "neutral" | "friendly" | "sacred";
}
export interface GenerateArtifactOptions {
    type?: string;
    element?: string;
    power?: "minor" | "moderate" | "major" | "legendary";
}
export interface GenerateNameOptions {
    element?: string;
    gender?: NameGender;
    type?: "character" | "place" | "artifact" | "creature";
    count?: number;
}
export interface GenerateStoryPromptOptions {
    theme?: string;
    gate?: number;
    includeConflict?: boolean;
}
export interface WorldGap {
    type: "missing_role" | "missing_element" | "missing_location" | "orphan" | "dead_end" | "narrative_gap" | "power_imbalance" | "faction_void";
    severity: "critical" | "important" | "nice_to_have";
    description: string;
    suggestion: string;
    toolToUse: string;
    toolArgs?: Record<string, unknown>;
}
export interface NarrativeAct {
    act: number;
    title: string;
    summary: string;
    involvedCreations: string[];
    keyEvent: string;
}
export interface NarrativeArc {
    title: string;
    type: "origin" | "conflict" | "quest" | "transformation" | "revelation" | "war" | "redemption";
    acts: NarrativeAct[];
    stakes: string;
    theme: string;
    estimatedChapters: number;
}
export interface ConflictSeed {
    title: string;
    type: "personal" | "political" | "elemental" | "cosmic" | "moral" | "survival";
    aggressors: string[];
    defenders: string[];
    stakes: string;
    rootCause: string;
    escalation: string[];
    possibleResolutions: string[];
    moralComplexity: string;
}
export interface WorldReport {
    /** Health score 0–100 */
    health: number;
    grade: string;
    strengths: string[];
    gaps: WorldGap[];
    nextActions: Array<{
        priority: number;
        action: string;
        tool: string;
    }>;
    narrativePotential: string;
    worldPersonality: string;
}
export interface Quest {
    title: string;
    type: "fetch" | "escort" | "investigate" | "defend" | "discover" | "negotiate" | "survive";
    hook: string;
    objective: string;
    stakes: string;
    complications: string[];
    rewards: {
        tangible: string;
        intangible: string;
    };
    involvedCreations: string[];
    estimatedDifficulty: "apprentice" | "mage" | "master" | "archmage" | "luminor";
}
export type DriftFace = "attention_collapse" | "synthetic_confusion" | "creative_amnesia" | "isolation" | "rights_fog" | "tool_dependency";
export type MissionLane = "media_literacy" | "local_resilience" | "regenerative_worlds" | "creator_sovereignty" | "social_connection" | "agent_stewardship";
export type GiftType = "key" | "mirror" | "compass" | "seed" | "oath" | "instrument" | "map" | "ember" | "lens" | "thread";
export type CanonStatus = "private_draft" | "staged_lore" | "public_canon" | "licensed_derivative" | "locked_canon";
export type ReviewVerdict = "pass" | "revise" | "block";
export interface GiftObject {
    id: string;
    name: string;
    type: GiftType;
    missionLane: MissionLane;
    driftFace: DriftFace;
    gateAlignment?: number;
    power: string;
    cost: string;
    rightUse: string;
    firstTrial: string;
    sourcePermissions: string;
    canonStatus: CanonStatus;
    commercialPermissions: string;
    sisMemoryKey?: string;
    createdAt: string;
}
export interface RightUseReview {
    giftId?: string;
    consent: string;
    cost: string;
    consequence: string;
    continuity: string;
    credit: string;
    commercialPermission: string;
    culturalSafety: string;
    canonBoundary: string;
    verdict: ReviewVerdict;
    notes?: string;
    reviewedAt: string;
}
export interface ProgressionEvent {
    id: string;
    actorId: string;
    gate?: number;
    missionLane: MissionLane;
    action: string;
    artifactId?: string;
    xp: number;
    proofUrl?: string;
    sourceSurface: string;
    createdAt: string;
}
export interface SISMemoryRecord {
    id: string;
    creatorIntent: string;
    giftIssued?: GiftObject;
    constraint: string;
    trialResult: string;
    sourceAndAttribution: string[];
    licenseState: string;
    canonEffect: string;
    evalNotes: string[];
    createdAt: string;
}
export interface FactionReport {
    factions: Array<{
        name: string;
        element: string;
        members: string[];
        strength: number;
        alignment: "light" | "dark" | "neutral";
    }>;
    tensions: Array<{
        between: [string, string];
        reason: string;
        severity: "low" | "medium" | "high" | "war";
    }>;
    powerBalance: string;
    prediction: string;
}
export interface ElementAesthetics {
    colors: string;
    atmosphere: string;
    materials: string;
    lighting: string;
}
export interface RankVisual {
    complexity: string;
    aura: string;
    attire: string;
}
export interface CharacterBlueprint {
    name: string;
    primaryElement: string;
    secondaryElement?: string;
    house: string;
    rank: string;
    gatesOpen: number;
    patronGuardian?: {
        name: string;
        domain: string;
    };
    godbeast?: {
        name: string;
        form: string;
        bond?: string;
    };
    personality?: {
        traits: string[];
        flaw?: string;
    };
}
export interface LocationBlueprint {
    name: string;
    dominantElement: string;
    type: string;
    alignment: string;
}
export interface CreatureBlueprint {
    name: string;
    element: string;
    size: string;
    temperament: string;
    species?: string;
}
export type CreatureRightsTier = "original_arcanea" | "public_domain" | "licensed" | "factual_reference_only" | "blocked";
export type CreatureReferenceMode = "original" | "public_domain_adaptation" | "factual_reference";
export type CreatureAtlasStatus = "seed" | "draft" | "review" | "approved" | "blocked";
export type CreatureImageGenerationPolicy = "allowed_original_variant" | "prompt_only" | "licensed_only" | "blocked";
export type CreatureRelationshipType = "source_archetype" | "same_source_world" | "ecological_neighbor" | "rival" | "symbiotic_with" | "guardian_of" | "mount_of" | "variant_of";
export interface CreatureCitation {
    label: string;
    url?: string;
    note?: string;
    accessedAt?: string;
}
export interface CreatureSourceReference {
    sourceWorld: string;
    sourceWork: string;
    creatureName?: string;
    franchiseOwner?: string;
    referenceMode: CreatureReferenceMode;
}
export interface CreatureRelationship {
    targetSlug: string;
    type: CreatureRelationshipType;
    label: string;
    strength: number;
    citationLabel?: string;
}
export interface CreaturePromptPack {
    prompt: string;
    negativePrompt: string;
    aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
    suggestedModels: string[];
    safetyNotes: string[];
    tags: string[];
}
export interface ReferenceCreatureSpec {
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    source: CreatureSourceReference;
    rightsTier: CreatureRightsTier;
    taxonomy: string[];
    habitats: string[];
    abilities: string[];
    temperament: string;
    scale: string;
    citations: CreatureCitation[];
    relationships: CreatureRelationship[];
}
export interface ArcaneaCreatureVariantSpec {
    name: string;
    arcaneaWorld: string;
    archetype: string;
    element: Element;
    visualDna: string[];
    behavior: string[];
    canonBoundary: string;
    generationPolicy: CreatureImageGenerationPolicy;
    promptFocus: string;
    negativeConstraints: string[];
}
export interface CreatureAtlasMedia {
    id: string;
    status: "prompt_ready" | "generated" | "approved" | "rejected";
    provider?: string;
    model?: string;
    url?: string;
    prompt?: string;
    qaScore?: number;
    evidencePath?: string;
}
export interface CreatureAtlasEntry extends ReferenceCreatureSpec {
    arcaneaVariant: ArcaneaCreatureVariantSpec;
    promptPack?: CreaturePromptPack;
    media: CreatureAtlasMedia[];
    status: CreatureAtlasStatus;
    steward: string;
    updatedAt: string;
}
export type DungeonRightsTier = "original_arcanea" | "public_domain" | "open_rules" | "licensed" | "factual_reference_only" | "blocked";
export type DungeonReferenceMode = "original" | "public_domain_adaptation" | "open_rules_reference" | "factual_reference";
export type DungeonAtlasStatus = "seed" | "draft" | "review" | "approved" | "blocked";
export type DungeonGenerationPolicy = "allowed_original_variant" | "prompt_only" | "licensed_only" | "blocked";
export type DungeonRankBand = "apprentice" | "mage" | "master" | "archmage" | "luminor";
export type DungeonFormatTarget = "game" | "anime" | "fantasy_book" | "author_toolkit" | "agentic_mission";
export type DungeonObjectiveType = "scout" | "solve" | "survive" | "gather" | "rescue" | "purify" | "negotiate" | "defeat" | "create";
export type DungeonMaterialClass = "vael_crystal" | "luminor_metal" | "nero_shard" | "memory_relic" | "story_seed" | "agentic_artifact";
export type DungeonRunVerdict = "in_progress" | "boss_locked" | "victory" | "partial_extract" | "collapse_failure";
export interface DungeonCitation {
    label: string;
    url?: string;
    note?: string;
    accessedAt?: string;
}
export interface DungeonSourceReference {
    sourceWorld: string;
    sourceWork: string;
    dungeonName?: string;
    franchiseOwner?: string;
    referenceMode: DungeonReferenceMode;
}
export interface DungeonBenchmarkPattern {
    label: string;
    pattern: "timer_pressure" | "hidden_depth" | "rank_mismatch" | "ecology" | "boss_phase" | "loot_crafting" | "social_spectacle" | "class_progression" | "nonlinear_map" | "agentic_workflow";
    whyItWorks: string;
    arcaneaUse: string;
}
export interface DungeonObjective {
    id: string;
    label: string;
    type: DungeonObjectiveType;
    required: boolean;
    estimatedMinutes: number;
    proofArtifact?: string;
    gate?: number;
}
export interface DungeonCollapseStage {
    id: string;
    startsAtMinute: number;
    name: string;
    pressure: string;
    hazard: string;
    consequence: string;
}
export interface DungeonTimerSpec {
    resonanceWindowMinutes: number;
    warningAtMinutesRemaining: number[];
    collapseStages: DungeonCollapseStage[];
    bossDeadlineBehavior: string;
}
export interface DungeonBossPhase {
    id: string;
    name: string;
    trigger: string;
    mechanic: string;
    counterplay: string;
    failureRisk: string;
}
export interface DungeonBossSpec {
    name: string;
    archetype: string;
    unlockCondition: string;
    phases: DungeonBossPhase[];
    victoryCondition: string;
    proofArtifact: string;
}
export interface DungeonMaterialReward {
    name: string;
    materialClass: DungeonMaterialClass;
    gateAffinity?: number;
    useCases: string[];
    rightsNotes: string;
}
export interface DungeonPromptPack {
    keyArtPrompt: string;
    bossPrompt: string;
    roomPrompt: string;
    materialPrompt: string;
    negativePrompt: string;
    aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
    suggestedModels: string[];
    safetyNotes: string[];
    tags: string[];
}
export interface DungeonRelationship {
    targetSlug: string;
    type: "same_source_world" | "same_gate" | "same_rank_band" | "boss_echo" | "material_lineage" | "story_parallel" | "variant_of";
    label: string;
    strength: number;
    citationLabel?: string;
}
export interface ReferenceDungeonSpec {
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    source: DungeonSourceReference;
    rightsTier: DungeonRightsTier;
    taxonomy: string[];
    mechanics: DungeonBenchmarkPattern[];
    progressionPattern: string;
    communitySignal: string;
    citations: DungeonCitation[];
    relationships: DungeonRelationship[];
}
export interface ArcaneaDungeonVariantSpec {
    name: string;
    publicName: string;
    arcaneaWorld: string;
    vaultType: string;
    gateAlignment: number[];
    godbeastResonance?: string;
    rankBand: DungeonRankBand;
    partySize: {
        min: number;
        max: number;
    };
    storyFunction: string;
    gameLoop: string;
    animeBeats: string[];
    bookBeats: string[];
    authorUse: string;
    agenticMission: string;
    laws: string[];
    costs: string[];
    rooms: DungeonObjective[];
    hazards: string[];
    creatures: string[];
    materials: DungeonMaterialReward[];
    boss: DungeonBossSpec;
    timer: DungeonTimerSpec;
    canonBoundary: string;
    generationPolicy: DungeonGenerationPolicy;
    promptFocus: string;
    negativeConstraints: string[];
}
export interface DungeonAtlasEntry extends ReferenceDungeonSpec {
    arcaneaVariant: ArcaneaDungeonVariantSpec;
    promptPack?: DungeonPromptPack;
    status: DungeonAtlasStatus;
    steward: string;
    updatedAt: string;
}
export interface DungeonRunState {
    elapsedMinutes: number;
    completedObjectiveIds: string[];
    bossAttempted?: boolean;
    bossDefeated?: boolean;
    partyIntegrity?: number;
}
export interface DungeonRunResult {
    verdict: DungeonRunVerdict;
    minutesRemaining: number;
    bossUnlocked: boolean;
    activeCollapseStage?: DungeonCollapseStage;
    rewardsUnlocked: DungeonMaterialReward[];
    xp: number;
    notes: string[];
}
export interface ImagePromptResult {
    prompt: string;
    negativePrompt: string;
    suggestedModels: string[];
    suggestedSize: string;
    suggestedSteps: number;
    tags: string[];
}
//# sourceMappingURL=types.d.ts.map