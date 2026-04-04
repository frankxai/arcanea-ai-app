/**
 * Guardian-Swarm Coordination Data
 *
 * Standalone copy of the essential guardian→luminor mapping for the MCP server.
 * Mirrors the canonical data from apps/web/lib/ai/guardian-swarm.ts.
 *
 * Four-layer hive-mind:
 *   Arcanea (model) → Lumina (meta-orchestrator) → Guardians (domain coordinators) → Luminors (specialists)
 */
/** How Lumina coordinates the response */
export type CoordinationMode = 'solo' | 'council' | 'convergence';
export interface LuminorSpec {
    /** Short expertise hint for prompt injection */
    hint: string;
    /** Team: development | creative | writing | research */
    team: string;
}
export interface LuminorActivation {
    id: string;
    team: string;
    relevance: number;
    parentGuardian: string;
    hint: string;
}
export interface GuardianInfo {
    slug: string;
    displayName: string;
    gate: number;
    domain: string;
    element: string;
    godbeast: string | null;
    luminors: string[];
}
export interface SwarmResult {
    coordinationMode: CoordinationMode;
    leadGuardian: string | null;
    activeGuardians: string[];
    activeLuminors: LuminorActivation[];
}
export declare const GUARDIAN_LUMINOR_MAP: Record<string, string[]>;
export declare const LUMINOR_HINTS: Record<string, LuminorSpec>;
export declare const GUARDIANS: GuardianInfo[];
/**
 * Maps MCP agent roles to their primary Guardian affinity.
 * Each agent "serves under" a Guardian whose domain aligns with their function.
 */
export declare const AGENT_GUARDIAN_MAP: Record<string, {
    primaryGuardian: string;
    secondaryGuardians: string[];
}>;
/**
 * Determine coordination mode based on weight distribution.
 * - solo: one dominant Guardian (>0.8)
 * - council: 2-3 Guardians collaborate (0.4-0.8 range)
 * - convergence: no dominant domain — Shinkami mode
 */
export declare function classifyCoordinationMode(weights: Record<string, number>): CoordinationMode;
/**
 * Resolve which Guardians and Luminors activate for given weights.
 */
export declare function resolveSwarm(weights: Record<string, number>): SwarmResult;
export declare function getGuardianBySlug(slug: string): GuardianInfo | undefined;
export declare function getGuardianByGate(gate: number): GuardianInfo | undefined;
/**
 * Get the full swarm info for an agent (for agent_info responses).
 */
export declare function getAgentSwarmInfo(agentId: string): {
    primaryGuardian: GuardianInfo | undefined;
    secondaryGuardians: GuardianInfo[];
    luminorTeam: Array<{
        id: string;
        hint: string;
        team: string;
    }>;
    coordinationModes: CoordinationMode[];
};
/**
 * Given a coordination mode, resolve which Guardians and Luminors would activate.
 * Used by the orchestrate tool.
 */
export declare function resolveForMode(mode: CoordinationMode, primaryGuardianSlug?: string): SwarmResult;
//# sourceMappingURL=index.d.ts.map