/**
 * Arcanea Skill-Rules Runtime Engine
 *
 * Loads skill-rules.json and provides real-time intent matching,
 * Guardian routing, and execution tracking. This is the bridge
 * between the declarative skill-rules metadata and the live
 * orchestrator pipeline.
 *
 * Activation Protocol (from skill-rules.json):
 * 1. Scan input for keyword matches (case-insensitive)
 * 2. Check active file paths against filePatterns (glob matching)
 * 3. Check if any registered command was invoked
 * 4. Collect matches, deduplicate by skill name
 * 5. Sort by priority: critical > high > medium > low
 * 6. Enforce maxConcurrent limit
 * 7. Always include alwaysActive skills
 * 8. Apply cascade rules
 * 9. Log activation with Guardian name
 */
export interface SkillRule {
    id: string;
    skill: string;
    skillPath: string;
    guardian: string;
    gate: string;
    frequency: string;
    priority: "critical" | "high" | "medium" | "low";
    description: string;
    triggers: {
        keywords: string[];
        filePatterns: string[];
        commands: string[];
    };
    activationMessage: string;
}
export interface GuardianEntry {
    gate: string;
    frequency: string;
    godbeast: string;
    domain: string;
    rules: string[];
}
export interface CascadeRule {
    when: string;
    also: string;
    reason: string;
}
export interface SkillRulesConfig {
    maxConcurrent: number;
    priorityOrder: string[];
    alwaysActive: string[];
    defaultGuardian: string;
    defaultGate: string;
    conflictResolution: string;
    cascadeEnabled: boolean;
}
export interface SkillRulesFile {
    version: string;
    schema: string;
    config: SkillRulesConfig;
    rules: SkillRule[];
    guardianIndex: Record<string, GuardianEntry>;
    activationProtocol: {
        steps: string[];
        cascadeRules: CascadeRule[];
    };
}
export interface MatchResult {
    rule: SkillRule;
    matchType: "keyword" | "filePattern" | "command";
    matchedOn: string;
    score: number;
}
export interface ActivationResult {
    activated: SkillRule[];
    guardian: string;
    gate: string;
    frequency: string;
    cascaded: string[];
    reasoning: string;
    timestamp: Date;
}
export interface ExecutionLog {
    id: string;
    activation: ActivationResult;
    startedAt: Date;
    completedAt?: Date;
    success?: boolean;
    feedback?: "positive" | "negative" | "neutral";
}
export declare class SkillRulesEngine {
    private rulesPath?;
    private rules;
    private config;
    private guardianIndex;
    private cascadeRules;
    private executionLog;
    private loaded;
    constructor(rulesPath?: string | undefined);
    /**
     * Load skill-rules.json from disk
     */
    load(path?: string): void;
    /**
     * Step 1-3: Match input against all rules
     */
    matchRules(input: string, context?: {
        filePaths?: string[];
        command?: string;
    }): MatchResult[];
    /**
     * Steps 4-9: Full activation pipeline
     */
    activate(input: string, context?: {
        filePaths?: string[];
        command?: string;
    }): ActivationResult;
    /**
     * Check if a cascade rule should fire
     */
    private shouldCascade;
    /**
     * Log an execution for RL feedback
     */
    logExecution(activation: ActivationResult): string;
    /**
     * Record feedback on an execution (for RL training)
     */
    recordFeedback(executionId: string, feedback: "positive" | "negative" | "neutral"): void;
    /**
     * Get execution history for a Guardian (for RL analysis)
     */
    getGuardianHistory(guardian: string): ExecutionLog[];
    /**
     * Get all execution logs (for ReasoningBank integration)
     */
    getExecutionLogs(): ExecutionLog[];
    /**
     * Get Guardian info
     */
    getGuardian(name: string): GuardianEntry | undefined;
    /**
     * Get all rules for a Guardian
     */
    getRulesForGuardian(guardian: string): SkillRule[];
    /**
     * Get stats
     */
    getStats(): {
        totalRules: number;
        guardians: number;
        loaded: boolean;
        executions: number;
        positiveRate: number;
    };
}
export declare function getSkillRulesEngine(): SkillRulesEngine;
//# sourceMappingURL=skill-rules-engine.d.ts.map