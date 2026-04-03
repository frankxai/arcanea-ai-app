/**
 * World Intelligence Engine
 *
 * Analyzes world state, detects narrative gaps, generates conflicts, weaves
 * story arcs, and produces world health reports.
 *
 * All functions are pure — they accept graph data as arguments rather than
 * reading from session-scoped in-memory state. This makes the module usable
 * in any context (MCP server, web app, CLI, tests).
 */
import type { CreationNode, CreationEdge, WorldGap, NarrativeArc, ConflictSeed, WorldReport } from "./types.js";
export declare function analyzeElementalBalance(nodes: CreationNode[]): {
    distribution: Record<string, number>;
    dominant: string | null;
    missing: string[];
    balanced: boolean;
};
export declare function detectRoles(nodes: CreationNode[]): {
    filled: string[];
    missing: string[];
    duplicates: string[];
};
export declare function detectGaps(nodes: CreationNode[], edges: CreationEdge[]): WorldGap[];
export declare function generateConflict(nodes: CreationNode[], _edges: CreationEdge[]): ConflictSeed | null;
export declare function weaveNarrative(nodes: CreationNode[], edges: CreationEdge[]): NarrativeArc | null;
export declare function generateWorldReport(nodes: CreationNode[], edges: CreationEdge[]): WorldReport;
//# sourceMappingURL=intelligence.d.ts.map