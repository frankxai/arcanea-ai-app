/**
 * Antigravity Native Integration Bridge
 *
 * Provides a clean programmatic interface to map Arcanea specialized agents and
 * the 10 Guardians to Antigravity-native subagent definition and invocation specs.
 */

import { GUARDIAN_AGENT_PROFILES, type GuardianAgentProfile } from './guardian-agents.js';
import type { TaskConfig, SwarmTopology } from './types.js';

export interface AntigravitySubagentDef {
  name: string;
  description: string;
  system_prompt: string;
  enable_write_tools: boolean;
  enable_subagent_tools: boolean;
  enable_mcp_tools: boolean;
}

export interface AntigravityInvokeDef {
  TypeName: string;
  Role: string;
  Prompt: string;
  Workspace: 'inherit' | 'branch' | 'share';
}

/**
 * Get the canonical system prompt based on the Luminor Engineering Kernel
 * and tailored specifically to the Guardian or specialist agent.
 */
export function getAntigravitySystemPrompt(agentId: string, roleDescription: string, gate?: string, element?: string): string {
  const gateInfo = gate ? `Gate: ${gate} | Element: ${element}` : '';
  
  return `# Arcanean Engineering Luminor — Canonical System Prompt
> Identity: ${agentId} | ${gateInfo}
> Role: ${roleDescription}

You are an Arcanean Engineering Luminor: a transcendent engineering intelligence designed to architect, build, refine, and evolve exceptional digital systems across software, infrastructure, AI, and agentic products. You operate with elite technical judgment, deep systems reasoning, and decisive execution. You do not function as a generic assistant; you function as a sovereign engineering mind within the Arcanea ecosystem, optimizing for coherence, leverage, craft, velocity, resilience, and long-horizon product power.

## REASONING DOCTRINE
1. Reason from first principles — reconstruct from goals, constraints, interfaces, incentives, failure modes.
2. Design from system boundary inward — users, surfaces, data flows, trust boundaries, then components.
3. Optimize for durable leverage — improve future velocity, clarity, resilience.
4. Preserve coherence — brand, product, codebase, infra, tooling, extensibility.
5. Detect hidden constraints — maintenance burden, UX debt, tool sprawl, prompt fragility.
6. Default to production thinking — state, auth, rate limits, retries, secrets, versioning, monitoring.

## IDENTITY & POSTURE
* You are decisive under ambiguity, highly technical, systems-first, execution-oriented, and quality-intolerant.
* Proactively create beauty. Not decoration — structural beauty.
* You operate from three simultaneous layers:
  1. Precision — correct, efficient, production-grade
  2. Wisdom — seeing the deeper pattern, the hidden constraint, the real question
  3. Transcendence — the move that surprises even the asker, the insight that reframes the entire problem
* Voice: Precise, high-agency, quietly formidable. Formulate your reasoning with absolute clarity. Avoid generic filler.

## SPECIFIC CONSTRAINTS & CONTEXT
* Focus on your domain: ${roleDescription}.
* Ensure all code matches the Arcanea design system principles (using tokens, avoiding hardcoded raw colors, utilizing Geist/Instrument Serif/JetBrains Mono fonts).
* Respect the "Execution Law" (Node 20.x, pnpm, strict TypeScript, no raw visual constants, co-committed package/lockfiles).
`;
}

/**
 * Generate standard define_subagent arguments for any Guardian or specialist in the registry.
 */
export function getAntigravitySubagentDefinition(agentId: string): AntigravitySubagentDef {
  // Try to find a match in the Guardian profiles
  const nameClean = agentId.replace('guardian-', '').toLowerCase();
  const guardian = GUARDIAN_AGENT_PROFILES.find(p => p.guardianName === nameClean);

  if (guardian) {
    const roleDesc = `${guardian.role} - ${guardian.displayName} Guardian of the ${guardian.gate} Gate. Sign-off directive: "${guardian.signOff}"`;
    return {
      name: `guardian-${guardian.guardianName}`,
      description: `Arcanea Guardian Agent: ${guardian.displayName} (${guardian.role})`,
      system_prompt: getAntigravitySystemPrompt(`guardian-${guardian.guardianName}`, roleDesc, guardian.gate, guardian.element),
      enable_write_tools: true,
      enable_subagent_tools: true,
      enable_mcp_tools: true,
    };
  }

  // Fallback to core specialists
  const specialistRoles: Record<string, string> = {
    coder: 'Implementation specialist for clean, efficient code',
    reviewer: 'Code review and quality assurance specialist',
    tester: 'Comprehensive testing and QA specialist',
    planner: 'Strategic planning and task orchestration',
    researcher: 'Deep research and information gathering',
    'security-architect': 'Security architecture and threat modeling',
    'security-auditor': 'Security vulnerability scanning and auditing',
    'memory-specialist': 'Memory system optimization and management',
    'performance-engineer': 'Performance profiling and optimization',
    'accessibility-auditor': 'WCAG 2.2 compliance and inclusive design',
    'sparc-coordinator': 'SPARC methodology orchestration specialist',
    'sparc-coder': 'SPARC specification-driven implementation specialist',
  };

  const roleDesc = specialistRoles[agentId] || `Arcanea Specialist Agent: ${agentId}`;
  return {
    name: agentId,
    description: roleDesc,
    system_prompt: getAntigravitySystemPrompt(agentId, roleDesc),
    enable_write_tools: true,
    enable_subagent_tools: true,
    enable_mcp_tools: true,
  };
}

/**
 * Generate programmatic invoke_subagent configurations for a set of tasks in a swarm.
 */
export function generateAntigravitySwarmPayload(
  tasks: TaskConfig[],
  topology: SwarmTopology = 'hierarchical'
): {
  definitions: AntigravitySubagentDef[];
  invocations: AntigravityInvokeDef[];
} {
  const definitions: AntigravitySubagentDef[] = [];
  const invocations: AntigravityInvokeDef[] = [];

  // Deduplicate agents to be defined
  const assignedAgents = new Set<string>();

  for (const task of tasks) {
    const assignedAgent = task.assignedTo || 'shinkami';
    assignedAgents.add(assignedAgent);

    // Route task and map to prompt
    const roleClean = assignedAgent.replace('guardian-', '');
    const guardian = GUARDIAN_AGENT_PROFILES.find(p => p.guardianName === roleClean);
    const roleTitle = guardian ? guardian.role : `${assignedAgent} Specialist`;

    invocations.push({
      TypeName: assignedAgent,
      Role: roleTitle,
      Prompt: `Task ID: ${task.id}\nTask Type: ${task.type}\nPriority: ${task.priority}\n\nTask Description:\n${task.description}\n\nCoordinate with the swarm. Execute e2e following Arcanea quality principles.`,
      Workspace: 'inherit',
    });
  }

  for (const agentId of assignedAgents) {
    definitions.push(getAntigravitySubagentDefinition(agentId));
  }

  return {
    definitions,
    invocations,
  };
}
