/**
 * World Intelligence Engine
 *
 * The brain of Arcanea MCP. Analyzes world state, detects narrative gaps,
 * generates conflicts, weaves story arcs, and tells the creator what to build next.
 *
 * This is what makes arcanea-mcp genius — not just generation tools,
 * but an intelligence that UNDERSTANDS your world and guides creation.
 */
import { type CreationNode, type CreationEdge } from "./creation-graph.js";
interface WorldGap {
    type: "missing_role" | "missing_element" | "missing_location" | "orphan" | "dead_end" | "narrative_gap" | "power_imbalance" | "faction_void";
    severity: "critical" | "important" | "nice_to_have";
    description: string;
    suggestion: string;
    toolToUse: string;
    toolArgs?: Record<string, any>;
}
interface NarrativeArc {
    title: string;
    type: "origin" | "conflict" | "quest" | "transformation" | "revelation" | "war" | "redemption";
    acts: Array<{
        act: number;
        title: string;
        summary: string;
        involvedCreations: string[];
        keyEvent: string;
    }>;
    stakes: string;
    theme: string;
    estimatedChapters: number;
}
interface ConflictSeed {
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
interface WorldReport {
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
declare function analyzeElementalBalance(nodes: CreationNode[]): {
    distribution: Record<string, number>;
    dominant: string | null;
    missing: string[];
    balanced: boolean;
};
declare function detectRoles(nodes: CreationNode[]): {
    filled: string[];
    missing: string[];
    duplicates: string[];
};
declare function detectGaps(nodes: CreationNode[], edges: CreationEdge[]): WorldGap[];
export declare function generateConflict(sessionId: string): ConflictSeed | null;
export declare function weaveNarrative(sessionId: string): NarrativeArc | null;
export declare function generateWorldReport(sessionId: string): WorldReport;
interface Quest {
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
export declare function generateQuest(sessionId: string): Quest | null;
interface FactionReport {
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
export declare function analyzeFactions(sessionId: string): FactionReport;
export { detectGaps, analyzeElementalBalance, detectRoles };
//# sourceMappingURL=world-intelligence.d.ts.map