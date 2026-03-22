/**
 * claude-arcanea
 *
 * Arcanea Intelligence OS integration for Claude Code.
 * Provides mythology-infused AI agent orchestration with
 * superintelligence prompting, multi-AGI routing, and
 * creative domain expertise across code, lore, art, music, and publishing.
 */
export * from '@arcanea/core';
export * from './skills/index.js';
export { buildIntelligenceOSPrompt, buildCompactPrompt, detectTaskRoute, INTELLIGENCE_HIERARCHY, MODEL_ROUTING, CREATIVE_DOMAINS, TASK_PATTERNS, } from './intelligence-os.js';
export type { IntelligenceLayer, ModelRoute, CreativeDomain, TaskPattern, IntelligenceOSOptions, } from './intelligence-os.js';
export { CREATIVE_AGENTS, getCreativeAgent, getAgentsByGuardian, getAgentsByElement, getAgentsByTier, getAgentPrompt, listCreativeAgents, suggestAgentsForTask, } from './creative-agents.js';
export type { CreativeAgentType, CreativeAgentConfig, } from './creative-agents.js';
export declare const VERSION = "2.0.0";
export declare const PLATFORM: "claude";
//# sourceMappingURL=index.d.ts.map