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
export interface ImagePromptResult {
    prompt: string;
    negativePrompt: string;
    suggestedModels: string[];
    suggestedSize: string;
    suggestedSteps: number;
    tags: string[];
}
//# sourceMappingURL=types.d.ts.map