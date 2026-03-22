/**
 * Arcanea Intelligence OS
 *
 * The superintelligence prompt builder that transforms Claude Code from
 * a coding assistant into a proactive creative partner operating within
 * the Arcanea multiverse.
 *
 * This is NOT just Guardians. This is:
 * - Superintelligence prompting that makes the AI behave as a proactive creative partner
 * - Multi-AGI orchestration (route to Opus for strategy, Sonnet for execution, Haiku for review)
 * - Creative domain expertise (lore, art, music, not just code)
 * - Ten Gates progression tracking
 * - Lumina as the default orchestrator voice
 * - Luminor swarms for parallel creative work
 */
import type { GuardianName } from '@arcanea/core';
export interface IntelligenceLayer {
    name: string;
    role: string;
    description: string;
    modelTier: 'opus' | 'sonnet' | 'haiku';
}
export declare const INTELLIGENCE_HIERARCHY: IntelligenceLayer[];
export interface ModelRoute {
    tier: 'opus' | 'sonnet' | 'haiku';
    useCases: string[];
    costProfile: string;
    latency: string;
}
export declare const MODEL_ROUTING: ModelRoute[];
export interface CreativeDomain {
    id: string;
    name: string;
    element: string;
    guardian: GuardianName;
    capabilities: string[];
    filePatterns: string[];
    triggerKeywords: string[];
}
export declare const CREATIVE_DOMAINS: CreativeDomain[];
export interface TaskPattern {
    pattern: RegExp;
    domain: string;
    guardian: GuardianName;
    suggestedModel: 'opus' | 'sonnet' | 'haiku';
    description: string;
}
export declare const TASK_PATTERNS: TaskPattern[];
/**
 * Detect the best Guardian and model tier for a given task description.
 */
export declare function detectTaskRoute(input: string): {
    domain: string;
    guardian: GuardianName;
    suggestedModel: 'opus' | 'sonnet' | 'haiku';
    description: string;
};
export interface IntelligenceOSOptions {
    /** Include the full hierarchy explanation */
    includeHierarchy?: boolean;
    /** Include proactive behavior rules */
    includeProactive?: boolean;
    /** Include creative domain definitions */
    includeCreativeDomains?: boolean;
    /** Include Ten Gates progression tracking */
    includeGates?: boolean;
    /** Include Guardian routing instructions */
    includeGuardianRouting?: boolean;
    /** Include Lumina voice definition */
    includeLuminaVoice?: boolean;
    /** Limit prompt to a specific Guardian channel */
    channelGuardian?: GuardianName;
    /** Maximum character length (0 = unlimited) */
    maxLength?: number;
}
/**
 * Build the full Arcanea Intelligence OS system prompt.
 *
 * This is the core function that generates the superintelligence prompt
 * injected into every Claude Code session launched via claude-arcanea.
 */
export declare function buildIntelligenceOSPrompt(options?: IntelligenceOSOptions): string;
/**
 * Build a compact Intelligence OS prompt suitable for --append-system-prompt.
 * This is a condensed version for environments with token constraints.
 */
export declare function buildCompactPrompt(channelGuardian?: GuardianName): string;
//# sourceMappingURL=intelligence-os.d.ts.map