/**
 * Arcanea Creative Agent Registry
 *
 * Defines the creative agent types that can be spawned within the
 * Arcanea Intelligence OS. These are NOT just code agents — they span
 * the full creative spectrum: lore, art, music, publishing, and meta-orchestration.
 *
 * Each agent has a Guardian assignment, element affinity, and prompt template
 * that shapes their behavior when spawned as Luminor workers.
 */
import type { GuardianName, Element, LuminorId, AgentRole } from '@arcanea/core';
export type CreativeAgentType = 'lorekeeper' | 'visualist' | 'composer' | 'publisher' | 'council' | 'architect' | 'worldbuilder' | 'chronicler' | 'ritualist' | 'oracle';
export interface CreativeAgentConfig {
    type: CreativeAgentType;
    displayName: string;
    role: AgentRole;
    guardian: GuardianName;
    element: Element;
    luminor?: LuminorId;
    description: string;
    capabilities: string[];
    promptTemplate: string;
    swarmRole: 'leader' | 'specialist' | 'worker';
    modelTier: 'opus' | 'sonnet' | 'haiku';
}
export declare const CREATIVE_AGENTS: Record<CreativeAgentType, CreativeAgentConfig>;
/**
 * Get a creative agent configuration by type.
 */
export declare function getCreativeAgent(type: CreativeAgentType): CreativeAgentConfig;
/**
 * Get all creative agents assigned to a specific Guardian.
 */
export declare function getAgentsByGuardian(guardian: GuardianName): CreativeAgentConfig[];
/**
 * Get all creative agents for a given element affinity.
 */
export declare function getAgentsByElement(element: Element): CreativeAgentConfig[];
/**
 * Get all creative agents suitable for a given model tier.
 */
export declare function getAgentsByTier(tier: 'opus' | 'sonnet' | 'haiku'): CreativeAgentConfig[];
/**
 * Get the prompt template for spawning a creative agent.
 */
export declare function getAgentPrompt(type: CreativeAgentType): string;
/**
 * List all available creative agent types with summary info.
 */
export declare function listCreativeAgents(): Array<{
    type: CreativeAgentType;
    displayName: string;
    guardian: string;
    element: string;
    tier: string;
    description: string;
}>;
/**
 * Suggest creative agents for a given task description.
 * Returns agents ranked by relevance.
 */
export declare function suggestAgentsForTask(taskDescription: string): CreativeAgentConfig[];
//# sourceMappingURL=creative-agents.d.ts.map