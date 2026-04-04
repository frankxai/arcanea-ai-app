/**
 * Skill-Rules ↔ ReasoningBank Feedback Bridge
 *
 * Converts SkillRulesEngine execution logs into ReasoningBank trajectories,
 * enabling the RL learning pipeline to improve Guardian routing over time.
 *
 * Flow:
 * 1. SkillRulesEngine activates skills → logs execution
 * 2. User/system provides feedback (positive/negative/neutral)
 * 3. FeedbackBridge converts execution → Trajectory
 * 4. ReasoningBank judges → distills → consolidates
 * 5. Learned patterns feed back into future routing decisions
 *
 * @module feedback-bridge
 */
import type { ExecutionLog } from "./skill-rules-engine.js";
interface Trajectory {
    trajectoryId: string;
    context: string;
    domain: "code" | "creative" | "reasoning" | "chat" | "math" | "general";
    steps: TrajectoryStep[];
    qualityScore: number;
    isComplete: boolean;
    startTime: number;
    endTime?: number;
}
interface TrajectoryStep {
    stepId: string;
    timestamp: number;
    action: string;
    stateBefore: Float32Array;
    stateAfter: Float32Array;
    reward: number;
    metadata?: Record<string, unknown>;
}
export interface FeedbackEvent {
    executionId: string;
    feedback: "positive" | "negative" | "neutral";
    guardian: string;
    gate: string;
    skills: string[];
    timestamp: Date;
}
export interface BridgeStats {
    totalBridged: number;
    positiveRate: number;
    negativeRate: number;
    guardianAccuracy: Record<string, {
        total: number;
        positive: number;
        rate: number;
    }>;
}
export declare class FeedbackBridge {
    private events;
    private trajectories;
    private vectorDim;
    private reasoningBank;
    constructor(options?: {
        vectorDimension?: number;
    });
    /**
     * Connect to a ReasoningBank instance for automatic trajectory processing
     */
    connectReasoningBank(bank: any): void;
    /**
     * Convert a completed execution log into a Trajectory and optionally
     * feed it into the ReasoningBank pipeline.
     */
    bridgeExecution(executionLog: ExecutionLog): Promise<Trajectory>;
    /**
     * Batch-process all unprocessed execution logs from a SkillRulesEngine
     */
    bridgeAll(logs: ExecutionLog[]): Promise<Trajectory[]>;
    /**
     * Get per-Guardian routing accuracy stats
     */
    getStats(): BridgeStats;
    /**
     * Get all recorded trajectories
     */
    getTrajectories(): Trajectory[];
    /**
     * Get all feedback events
     */
    getEvents(): FeedbackEvent[];
    /**
     * Simple text-to-embedding using character-level hashing.
     * In production, this would use a real embedding model.
     */
    private textToEmbedding;
}
export declare function getFeedbackBridge(): FeedbackBridge;
export {};
//# sourceMappingURL=feedback-bridge.d.ts.map