import { AgentConfig } from "./types.js";
/**
 * CREATOR - The Master Orchestrator
 * Like Sisyphus, but for creative worldbuilding
 * "Every creation begins with intention. Every world deserves a thoughtful architect."
 */
export declare const CREATOR: AgentConfig;
/**
 * WORLDSMITH - The Generation Engine
 * Rapid, creative content generation
 * "From the forge of imagination, worlds are born."
 */
export declare const WORLDSMITH: AgentConfig;
/**
 * LUMINOR COUNCIL - Creative Coaching Collective
 * Multiple wisdom perspectives for guidance
 * "Five voices, one purpose: to illuminate your creative path."
 */
export declare const LUMINOR_COUNCIL: AgentConfig;
/**
 * SCRIBE - The Narrative Voice
 * Story development and documentation
 * "Every world has a story. I help you tell it."
 */
export declare const SCRIBE: AgentConfig;
/**
 * SEER - The Research Eye
 * Fast analysis and connection discovery
 * "I see the threads that connect all things."
 */
export declare const SEER: AgentConfig;
export declare const AGENTS: Record<string, AgentConfig>;
export declare function getAgent(id: string): AgentConfig | undefined;
export declare function getAgentsByRole(role: string): AgentConfig[];
export declare function getAgentsByCapability(capability: string): AgentConfig[];
//# sourceMappingURL=definitions.d.ts.map