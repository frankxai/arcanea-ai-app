// ---------------------------------------------------------------------------
// Arcanea Agent OS Contract Package
// Shared contract layer for Codex, OpenCode, Gemini, Claude, and native
// Arcanea runtimes. This package defines the stable protocol above the
// harness-specific execution implementations.
// ---------------------------------------------------------------------------

export type AgentCategory =
  | 'core-development'
  | 'specialized'
  | 'swarm-coordination'
  | 'creative'
  | 'guardian'
  | 'github'
  | 'sparc';

export type AgentStatus = 'active' | 'experimental' | 'planned';
export type RuntimeId = 'codex' | 'opencode' | 'claude' | 'gemini' | 'arcanea-orchestrator';
export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';
export type VerificationMode = 'none' | 'smoke' | 'standard' | 'strict';

export interface AgentDefinition {
  id: string;
  name: string;
  type: string;
  category: AgentCategory;
  capabilities: string[];
  gate: string;
  guardian: string;
  description: string;
  status: AgentStatus;
}

export interface RuntimeDefinition {
  id: RuntimeId;
  name: string;
  harness: string;
  role: 'native' | 'adapter' | 'orchestrator';
  strengths: string[];
  memoryRead: 'mcp-starlight-sis' | 'compat-arcanea-memory' | 'repo-files';
  memoryWrite: 'mcp-starlight-sis' | 'compat-arcanea-memory' | 'none';
  invocation: {
    command: string;
    launcher?: string;
    notes?: string;
  };
}

export interface RepoRoute {
  repo: string;
  github: string;
  primaryRuntime: RuntimeId;
  allowedRuntimes: RuntimeId[];
  routingTags: string[];
  defaultVerification: string[];
}

export interface TaskContract {
  id: string;
  title: string;
  scope: string;
  ownerRuntime: RuntimeId;
  ownerAgent: string;
  files: string[];
  nonGoals: string[];
  acceptanceCriteria: string[];
  verification: string[];
  rollback: string[];
  priority: TaskPriority;
  verificationMode: VerificationMode;
  memoryReadBeforeWrite: boolean;
}

export interface HandoffPacket {
  contractId: string;
  fromRuntime: RuntimeId;
  toRuntime: RuntimeId;
  summary: string;
  changedFiles: string[];
  decisions: string[];
  blockers: string[];
  verificationRun: string[];
  nextAction: string;
  memoryWrites: Array<{
    vault: string;
    entryType: string;
    summary: string;
  }>;
}

export interface AgentOsConfig {
  version: string;
  canonicalMemoryHome: string;
  runtimes: RuntimeDefinition[];
  repoRoutes: RepoRoute[];
  memoryConventions: {
    canonicalRead: string;
    canonicalWrite: string;
    legacyCompatibility: string;
    requiredPreflight: string[];
  };
}

export const AGENT_REGISTRY: AgentDefinition[] = [
  { id: 'coder', name: 'Coder', type: 'coder', category: 'core-development', capabilities: ['code-generation', 'refactoring', 'implementation'], gate: 'Source', guardian: 'Shinkami', description: 'Implementation specialist for clean, efficient code', status: 'active' },
  { id: 'reviewer', name: 'Reviewer', type: 'reviewer', category: 'core-development', capabilities: ['code-review', 'quality-assurance', 'best-practices'], gate: 'Sight', guardian: 'Lyria', description: 'Code review and quality assurance specialist', status: 'active' },
  { id: 'tester', name: 'Tester', type: 'tester', category: 'core-development', capabilities: ['unit-testing', 'e2e-testing', 'test-coverage'], gate: 'Foundation', guardian: 'Lyssandria', description: 'Comprehensive testing and QA specialist', status: 'active' },
  { id: 'planner', name: 'Planner', type: 'planner', category: 'core-development', capabilities: ['task-decomposition', 'architecture', 'estimation'], gate: 'Crown', guardian: 'Aiyami', description: 'Strategic planning and task orchestration', status: 'active' },
  { id: 'researcher', name: 'Researcher', type: 'researcher', category: 'core-development', capabilities: ['deep-research', 'information-gathering', 'analysis'], gate: 'Sight', guardian: 'Lyria', description: 'Deep research and information gathering', status: 'active' },
  { id: 'security-architect', name: 'Security Architect', type: 'security-architect', category: 'specialized', capabilities: ['threat-modeling', 'security-audit', 'compliance'], gate: 'Fire', guardian: 'Draconia', description: 'Security architecture and threat modeling', status: 'active' },
  { id: 'security-auditor', name: 'Security Auditor', type: 'security-auditor', category: 'specialized', capabilities: ['vulnerability-scan', 'penetration-testing', 'audit'], gate: 'Fire', guardian: 'Draconia', description: 'Security vulnerability scanning and auditing', status: 'active' },
  { id: 'memory-specialist', name: 'Memory Specialist', type: 'memory-specialist', category: 'specialized', capabilities: ['memory-optimization', 'caching', 'state-management'], gate: 'Sight', guardian: 'Lyria', description: 'Memory system optimization and management', status: 'active' },
  { id: 'performance-engineer', name: 'Performance Engineer', type: 'performance-engineer', category: 'specialized', capabilities: ['profiling', 'optimization', 'benchmarking'], gate: 'Fire', guardian: 'Draconia', description: 'Performance profiling and optimization', status: 'active' },
  { id: 'accessibility-auditor', name: 'Accessibility Auditor', type: 'accessibility-auditor', category: 'specialized', capabilities: ['wcag-compliance', 'screen-reader', 'keyboard-nav'], gate: 'Heart', guardian: 'Maylinn', description: 'WCAG 2.2 compliance and inclusive design', status: 'active' },
  { id: 'ml-developer', name: 'ML Developer', type: 'ml-developer', category: 'specialized', capabilities: ['model-training', 'deployment', 'evaluation'], gate: 'Crown', guardian: 'Aiyami', description: 'Machine learning model development', status: 'experimental' },
  { id: 'hierarchical-coordinator', name: 'Hierarchical Coordinator', type: 'hierarchical-coordinator', category: 'swarm-coordination', capabilities: ['task-distribution', 'agent-management', 'consensus'], gate: 'Unity', guardian: 'Ino', description: 'Hierarchical multi-agent coordination', status: 'active' },
  { id: 'mesh-coordinator', name: 'Mesh Coordinator', type: 'mesh-coordinator', category: 'swarm-coordination', capabilities: ['peer-coordination', 'load-balancing', 'fault-tolerance'], gate: 'Unity', guardian: 'Ino', description: 'Mesh topology agent coordination', status: 'active' },
  { id: 'raft-manager', name: 'Raft Manager', type: 'raft-manager', category: 'swarm-coordination', capabilities: ['leader-election', 'log-replication', 'consensus'], gate: 'Unity', guardian: 'Ino', description: 'Raft consensus algorithm management', status: 'active' },
  { id: 'byzantine-coordinator', name: 'Byzantine Coordinator', type: 'byzantine-coordinator', category: 'swarm-coordination', capabilities: ['fault-tolerance', 'malicious-detection', 'consensus'], gate: 'Unity', guardian: 'Ino', description: 'Byzantine fault-tolerant consensus', status: 'active' },
  { id: 'lore-master', name: 'Lore Master', type: 'lore-master', category: 'creative', capabilities: ['narrative-writing', 'canon-validation', 'world-building'], gate: 'Voice', guardian: 'Alera', description: 'Canon-safe narrative writing and mythology', status: 'active' },
  { id: 'character-crafter', name: 'Character Crafter', type: 'character-crafter', category: 'creative', capabilities: ['character-design', 'psychology', 'arc-development'], gate: 'Heart', guardian: 'Maylinn', description: 'Deep character development and psychology', status: 'active' },
  { id: 'world-expander', name: 'World Expander', type: 'world-expander', category: 'creative', capabilities: ['location-design', 'magic-systems', 'history'], gate: 'Starweave', guardian: 'Elara', description: 'World-building and universe expansion', status: 'active' },
  { id: 'developmental-editor', name: 'Developmental Editor', type: 'developmental-editor', category: 'creative', capabilities: ['story-structure', 'pacing', 'narrative-arc'], gate: 'Voice', guardian: 'Alera', description: 'Story structure and narrative architecture', status: 'active' },
  { id: 'line-editor', name: 'Line Editor', type: 'line-editor', category: 'creative', capabilities: ['prose-polish', 'voice-consistency', 'anti-slop'], gate: 'Voice', guardian: 'Alera', description: 'Prose polishing and AI pattern elimination', status: 'active' },
  { id: 'music-producer', name: 'Music Producer', type: 'music-producer', category: 'creative', capabilities: ['composition', 'sound-design', 'production'], gate: 'Flow', guardian: 'Leyla', description: 'AI-powered music production specialist', status: 'active' },
  { id: 'guardian-lyssandria', name: 'Lyssandria', type: 'guardian', category: 'guardian', capabilities: ['foundation', 'stability', 'grounding'], gate: 'Foundation', guardian: 'Lyssandria', description: 'The Earth Guardian - Grounded, Practical, Strategic', status: 'active' },
  { id: 'guardian-leyla', name: 'Leyla', type: 'guardian', category: 'guardian', capabilities: ['flow', 'creativity', 'empathy'], gate: 'Flow', guardian: 'Leyla', description: 'The Water Guardian - Fluid, Creative, Empathetic', status: 'active' },
  { id: 'guardian-draconia', name: 'Draconia', type: 'guardian', category: 'guardian', capabilities: ['power', 'transformation', 'directness'], gate: 'Fire', guardian: 'Draconia', description: 'The Fire Guardian - Powerful, Direct, Transformative', status: 'active' },
  { id: 'guardian-maylinn', name: 'Maylinn', type: 'guardian', category: 'guardian', capabilities: ['connection', 'healing', 'communication'], gate: 'Heart', guardian: 'Maylinn', description: 'The Heart Guardian - Gentle, Connecting, Communicative', status: 'active' },
  { id: 'guardian-alera', name: 'Alera', type: 'guardian', category: 'guardian', capabilities: ['truth', 'expression', 'resonance'], gate: 'Voice', guardian: 'Alera', description: 'The Voice Guardian - Resonant, Truthful, Articulate', status: 'active' },
  { id: 'guardian-lyria', name: 'Lyria', type: 'guardian', category: 'guardian', capabilities: ['vision', 'intuition', 'insight'], gate: 'Sight', guardian: 'Lyria', description: 'The Sight Guardian - Visionary, Intuitive, Mystical', status: 'active' },
  { id: 'guardian-aiyami', name: 'Aiyami', type: 'guardian', category: 'guardian', capabilities: ['enlightenment', 'wisdom', 'mastery'], gate: 'Crown', guardian: 'Aiyami', description: 'The Crown Guardian - Wise, Strategic, Masterful', status: 'active' },
  { id: 'guardian-elara', name: 'Elara', type: 'guardian', category: 'guardian', capabilities: ['transformation', 'perspective', 'connection'], gate: 'Starweave', guardian: 'Elara', description: 'The Starweave Guardian - Transformative, Perceptive', status: 'active' },
  { id: 'guardian-ino', name: 'Ino', type: 'guardian', category: 'guardian', capabilities: ['unity', 'collaboration', 'integration'], gate: 'Unity', guardian: 'Ino', description: 'The Unity Guardian - Collaborative, Integrative', status: 'active' },
  { id: 'guardian-shinkami', name: 'Shinkami', type: 'guardian', category: 'guardian', capabilities: ['transcendence', 'meta-consciousness', 'source'], gate: 'Source', guardian: 'Shinkami', description: 'The Source Guardian - Transcendent, Purposeful', status: 'active' },
  { id: 'pr-manager', name: 'PR Manager', type: 'pr-manager', category: 'github', capabilities: ['pr-creation', 'review-management', 'merge-strategy'], gate: 'Unity', guardian: 'Ino', description: 'Pull request lifecycle management', status: 'active' },
  { id: 'code-review-swarm', name: 'Code Review Swarm', type: 'code-review-swarm', category: 'github', capabilities: ['multi-reviewer', 'consensus-review', 'quality-gates'], gate: 'Sight', guardian: 'Lyria', description: 'Multi-agent code review orchestration', status: 'active' },
  { id: 'issue-tracker', name: 'Issue Tracker', type: 'issue-tracker', category: 'github', capabilities: ['issue-triage', 'labeling', 'assignment'], gate: 'Foundation', guardian: 'Lyssandria', description: 'Issue tracking and triage automation', status: 'active' },
  { id: 'release-manager', name: 'Release Manager', type: 'release-manager', category: 'github', capabilities: ['versioning', 'changelog', 'deployment'], gate: 'Crown', guardian: 'Aiyami', description: 'Release orchestration and versioning', status: 'active' },
  { id: 'sparc-coordinator', name: 'SPARC Coordinator', type: 'sparc-coord', category: 'sparc', capabilities: ['methodology-orchestration', 'phase-management', 'quality'], gate: 'Source', guardian: 'Shinkami', description: 'SPARC methodology orchestration', status: 'active' },
  { id: 'sparc-coder', name: 'SPARC Coder', type: 'sparc-coder', category: 'sparc', capabilities: ['specification-driven-coding', 'pseudocode', 'implementation'], gate: 'Source', guardian: 'Shinkami', description: 'SPARC specification-driven implementation', status: 'active' },
];

export const CATEGORY_LABELS: Record<AgentCategory, string> = {
  'core-development': 'Core Development',
  specialized: 'Specialized',
  'swarm-coordination': 'Swarm Coordination',
  creative: 'Creative',
  guardian: 'Guardian',
  github: 'GitHub & Repository',
  sparc: 'SPARC Methodology',
};

export const ARCANEA_RUNTIMES: RuntimeDefinition[] = [
  {
    id: 'codex',
    name: 'Codex',
    harness: 'Codex native agent runtime',
    role: 'adapter',
    strengths: ['code execution', 'repo surgery', 'cross-tool integration'],
    memoryRead: 'mcp-starlight-sis',
    memoryWrite: 'mcp-starlight-sis',
    invocation: {
      command: 'codex',
      notes: 'Use repo AGENTS.md + MCP wiring; ideal for verified coding loops.',
    },
  },
  {
    id: 'opencode',
    name: 'OpenCode / Arcanea',
    harness: 'oh-my-arcanea',
    role: 'native',
    strengths: ['multi-model execution', 'worker agents', 'coding workflow'],
    memoryRead: 'mcp-starlight-sis',
    memoryWrite: 'mcp-starlight-sis',
    invocation: {
      command: 'opencode',
      launcher: '.arcanea/scripts/opencode.ps1',
      notes: 'Primary Arcanea coding shell for user-facing work and agent execution.',
    },
  },
  {
    id: 'claude',
    name: 'Claude / Arcanea Flow',
    harness: 'arcanea-flow',
    role: 'native',
    strengths: ['swarm coordination', 'hierarchical agent teams', 'long-form synthesis'],
    memoryRead: 'mcp-starlight-sis',
    memoryWrite: 'compat-arcanea-memory',
    invocation: {
      command: 'claude',
      launcher: '.arcanea/scripts/claude-launcher.ps1',
      notes: 'Use native Claude flow/swarm features; compatibility memory remains supported.',
    },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    harness: 'Arcanea Gemini adapter',
    role: 'adapter',
    strengths: ['large context synthesis', 'multimodal reasoning', 'Google model surfaces'],
    memoryRead: 'mcp-starlight-sis',
    memoryWrite: 'mcp-starlight-sis',
    invocation: {
      command: 'gemini',
      notes: 'Consume Arcanea instructions and shared SIS contract; avoid standalone memory assumptions.',
    },
  },
  {
    id: 'arcanea-orchestrator',
    name: 'Arcanea Orchestrator',
    harness: 'arcanea-orchestrator / Composio-derived conductor',
    role: 'orchestrator',
    strengths: ['worktree orchestration', 'cross-agent session control', 'swarm routing'],
    memoryRead: 'mcp-starlight-sis',
    memoryWrite: 'compat-arcanea-memory',
    invocation: {
      command: 'arcanea-orchestrator',
      launcher: '.arcanea/scripts/arcanea-orchestrator.ps1',
      notes: 'Use as coordination layer after contract adoption, not as canonical memory owner.',
    },
  },
];

export function getAgent(id: string): AgentDefinition | undefined {
  return AGENT_REGISTRY.find((agent) => agent.id === id);
}

export function getRuntime(id: RuntimeId): RuntimeDefinition | undefined {
  return ARCANEA_RUNTIMES.find((runtime) => runtime.id === id);
}

export function listAgentsByCategory(category: AgentCategory): AgentDefinition[] {
  return AGENT_REGISTRY.filter((agent) => agent.category === category);
}

export function getAgentStats(): {
  total: number;
  active: number;
  experimental: number;
  planned: number;
  byCategory: Record<AgentCategory, number>;
} {
  const byCategory = {} as Record<AgentCategory, number>;
  for (const category of Object.keys(CATEGORY_LABELS) as AgentCategory[]) {
    byCategory[category] = AGENT_REGISTRY.filter((agent) => agent.category === category).length;
  }

  return {
    total: AGENT_REGISTRY.length,
    active: AGENT_REGISTRY.filter((agent) => agent.status === 'active').length,
    experimental: AGENT_REGISTRY.filter((agent) => agent.status === 'experimental').length,
    planned: AGENT_REGISTRY.filter((agent) => agent.status === 'planned').length,
    byCategory,
  };
}

export function validateTaskContract(contract: Partial<TaskContract>): string[] {
  const errors: string[] = [];

  if (!contract.id) errors.push('task contract missing id');
  if (!contract.title) errors.push('task contract missing title');
  if (!contract.scope) errors.push('task contract missing scope');
  if (!contract.ownerRuntime) errors.push('task contract missing ownerRuntime');
  if (!contract.ownerAgent) errors.push('task contract missing ownerAgent');
  if (!Array.isArray(contract.files) || contract.files.length === 0) errors.push('task contract missing files');
  if (!Array.isArray(contract.nonGoals)) errors.push('task contract missing nonGoals');
  if (!Array.isArray(contract.acceptanceCriteria) || contract.acceptanceCriteria.length === 0) {
    errors.push('task contract missing acceptanceCriteria');
  }
  if (!Array.isArray(contract.verification) || contract.verification.length === 0) {
    errors.push('task contract missing verification commands');
  }
  if (!Array.isArray(contract.rollback) || contract.rollback.length === 0) {
    errors.push('task contract missing rollback instructions');
  }

  if (contract.ownerRuntime && !getRuntime(contract.ownerRuntime)) {
    errors.push(`unknown ownerRuntime: ${contract.ownerRuntime}`);
  }

  if (contract.ownerAgent && !getAgent(contract.ownerAgent)) {
    errors.push(`unknown ownerAgent: ${contract.ownerAgent}`);
  }

  return errors;
}

export function validateHandoffPacket(packet: Partial<HandoffPacket>): string[] {
  const errors: string[] = [];

  if (!packet.contractId) errors.push('handoff packet missing contractId');
  if (!packet.fromRuntime) errors.push('handoff packet missing fromRuntime');
  if (!packet.toRuntime) errors.push('handoff packet missing toRuntime');
  if (!packet.summary) errors.push('handoff packet missing summary');
  if (!Array.isArray(packet.changedFiles)) errors.push('handoff packet missing changedFiles');
  if (!Array.isArray(packet.decisions)) errors.push('handoff packet missing decisions');
  if (!Array.isArray(packet.blockers)) errors.push('handoff packet missing blockers');
  if (!Array.isArray(packet.verificationRun)) errors.push('handoff packet missing verificationRun');
  if (!packet.nextAction) errors.push('handoff packet missing nextAction');
  if (!Array.isArray(packet.memoryWrites)) errors.push('handoff packet missing memoryWrites');

  if (packet.fromRuntime && !getRuntime(packet.fromRuntime)) {
    errors.push(`unknown fromRuntime: ${packet.fromRuntime}`);
  }
  if (packet.toRuntime && !getRuntime(packet.toRuntime)) {
    errors.push(`unknown toRuntime: ${packet.toRuntime}`);
  }

  return errors;
}

export function validateRepoRoutes(routes: RepoRoute[]): string[] {
  const errors: string[] = [];

  for (const route of routes) {
    if (!route.repo) errors.push('repo route missing repo');
    if (!route.github) errors.push(`repo route ${route.repo || '<unknown>'} missing github`);
    if (!getRuntime(route.primaryRuntime)) {
      errors.push(`repo route ${route.repo || '<unknown>'} has unknown primaryRuntime ${route.primaryRuntime}`);
    }
    for (const runtime of route.allowedRuntimes) {
      if (!getRuntime(runtime)) {
        errors.push(`repo route ${route.repo || '<unknown>'} has unknown allowed runtime ${runtime}`);
      }
    }
    if (!Array.isArray(route.defaultVerification) || route.defaultVerification.length === 0) {
      errors.push(`repo route ${route.repo || '<unknown>'} missing defaultVerification`);
    }
  }

  return errors;
}

export function validateAgentOsConfig(config: AgentOsConfig): string[] {
  const errors: string[] = [];

  if (!config.version) errors.push('agent OS config missing version');
  if (!config.canonicalMemoryHome) errors.push('agent OS config missing canonicalMemoryHome');
  if (!Array.isArray(config.runtimes) || config.runtimes.length === 0) {
    errors.push('agent OS config missing runtimes');
  }
  if (!Array.isArray(config.repoRoutes) || config.repoRoutes.length === 0) {
    errors.push('agent OS config missing repoRoutes');
  } else {
    errors.push(...validateRepoRoutes(config.repoRoutes));
  }
  if (!config.memoryConventions?.canonicalRead) {
    errors.push('agent OS config missing memoryConventions.canonicalRead');
  }
  if (!config.memoryConventions?.canonicalWrite) {
    errors.push('agent OS config missing memoryConventions.canonicalWrite');
  }
  if (!Array.isArray(config.memoryConventions?.requiredPreflight) || config.memoryConventions.requiredPreflight.length === 0) {
    errors.push('agent OS config missing memoryConventions.requiredPreflight');
  }

  return errors;
}

// Registry Protocol types for multi-tenant agent discovery, deployment, and revenue
export * from './registry-protocol.js';
