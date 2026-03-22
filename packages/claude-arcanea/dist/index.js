/**
 * claude-arcanea
 *
 * Arcanea Intelligence OS integration for Claude Code.
 * Provides mythology-infused AI agent orchestration with
 * superintelligence prompting, multi-AGI routing, and
 * creative domain expertise across code, lore, art, music, and publishing.
 */
// Re-export core types and constants
export * from '@arcanea/core';
// Export skills
export * from './skills/index.js';
// Export Intelligence OS
export { buildIntelligenceOSPrompt, buildCompactPrompt, detectTaskRoute, INTELLIGENCE_HIERARCHY, MODEL_ROUTING, CREATIVE_DOMAINS, TASK_PATTERNS, } from './intelligence-os.js';
// Export Creative Agents
export { CREATIVE_AGENTS, getCreativeAgent, getAgentsByGuardian, getAgentsByElement, getAgentsByTier, getAgentPrompt, listCreativeAgents, suggestAgentsForTask, } from './creative-agents.js';
// Export Guardian-Swarm Coordination (Intelligence Layer)
export { GUARDIAN_LUMINOR_MAP, LUMINOR_HINTS, resolveSwarm, buildLuminorLayer, classifyCoordinationMode, } from './intelligence.js';
// Version
export const VERSION = '2.0.0';
export const PLATFORM = 'claude';
//# sourceMappingURL=index.js.map