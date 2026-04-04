import { AgentTask, WorldState, OrchestratorDecision, CreativeSession } from "./types.js";
/**
 * Assess the current state of the creative world
 * Used to determine how to handle requests
 */
export declare function assessWorldState(sessionId: string): WorldState;
/**
 * Phase 0: Intent Gate
 * Check if request matches a skill and should be routed immediately
 */
export declare function intentGate(request: string): OrchestratorDecision | null;
/**
 * Phase 1: Assessment
 * Evaluate request against world state
 */
export declare function assessRequest(request: string, worldState: WorldState): OrchestratorDecision;
/**
 * Phase 2: Delegation
 * Create tasks for agents to execute
 */
export declare function createAgentTasks(decision: OrchestratorDecision, request: string, sessionId: string): AgentTask[];
/**
 * Execute a single agent task
 * In a real implementation, this would call the actual model
 */
export declare function executeAgentTask(task: AgentTask): Promise<AgentTask>;
/**
 * Execute tasks in parallel when allowed
 */
export declare function executeTasks(tasks: AgentTask[], parallel: boolean): Promise<AgentTask[]>;
/**
 * Phase 3: Synthesis
 * Combine results from multiple agents
 */
export declare function synthesizeResults(tasks: AgentTask[], worldState: WorldState): {
    success: boolean;
    results: any[];
    synthesis: string;
    suggestions: string[];
};
/**
 * Main orchestration function
 * Runs the full creative session
 */
export declare function orchestrateCreativeSession(request: string, sessionId?: string): Promise<{
    session: CreativeSession;
    result: any;
}>;
/**
 * Get status of a running session
 */
export declare function getSessionStatus(sessionId: string): CreativeSession | undefined;
/**
 * Get all active sessions
 */
export declare function getActiveSessions(): CreativeSession[];
/**
 * Get task by ID
 */
export declare function getTask(taskId: string): AgentTask | undefined;
/**
 * Cancel a running task
 */
export declare function cancelTask(taskId: string): boolean;
//# sourceMappingURL=orchestrator.d.ts.map