// ---------------------------------------------------------------------------
// Agent Registry — Arcanea
// Defines all agent types with their capabilities and gate alignments
// ---------------------------------------------------------------------------

export type AgentCategory =
  | "core-development"
  | "specialized"
  | "swarm-coordination"
  | "creative"
  | "guardian"
  | "github"
  | "sparc";

export interface AgentDefinition {
  id: string;
  name: string;
  type: string;
  category: AgentCategory;
  capabilities: string[];
  gate: string;
  guardian: string;
  description: string;
  status: "active" | "experimental" | "planned";
}

export const AGENT_REGISTRY: AgentDefinition[] = [
  // Core Development
  { id: "coder", name: "Coder", type: "coder", category: "core-development", capabilities: ["code-generation", "refactoring", "implementation"], gate: "Source", guardian: "Shinkami", description: "Implementation specialist for clean, efficient code", status: "active" },
  { id: "reviewer", name: "Reviewer", type: "reviewer", category: "core-development", capabilities: ["code-review", "quality-assurance", "best-practices"], gate: "Sight", guardian: "Lyria", description: "Code review and quality assurance specialist", status: "active" },
  { id: "tester", name: "Tester", type: "tester", category: "core-development", capabilities: ["unit-testing", "e2e-testing", "test-coverage"], gate: "Foundation", guardian: "Lyssandria", description: "Comprehensive testing and QA specialist", status: "active" },
  { id: "planner", name: "Planner", type: "planner", category: "core-development", capabilities: ["task-decomposition", "architecture", "estimation"], gate: "Crown", guardian: "Aiyami", description: "Strategic planning and task orchestration", status: "active" },
  { id: "researcher", name: "Researcher", type: "researcher", category: "core-development", capabilities: ["deep-research", "information-gathering", "analysis"], gate: "Sight", guardian: "Lyria", description: "Deep research and information gathering", status: "active" },

  // Specialized
  { id: "security-architect", name: "Security Architect", type: "security-architect", category: "specialized", capabilities: ["threat-modeling", "security-audit", "compliance"], gate: "Fire", guardian: "Draconia", description: "Security architecture and threat modeling", status: "active" },
  { id: "security-auditor", name: "Security Auditor", type: "security-auditor", category: "specialized", capabilities: ["vulnerability-scan", "penetration-testing", "audit"], gate: "Fire", guardian: "Draconia", description: "Security vulnerability scanning and auditing", status: "active" },
  { id: "memory-specialist", name: "Memory Specialist", type: "memory-specialist", category: "specialized", capabilities: ["memory-optimization", "caching", "state-management"], gate: "Sight", guardian: "Lyria", description: "Memory system optimization and management", status: "active" },
  { id: "performance-engineer", name: "Performance Engineer", type: "performance-engineer", category: "specialized", capabilities: ["profiling", "optimization", "benchmarking"], gate: "Fire", guardian: "Draconia", description: "Performance profiling and optimization", status: "active" },
  { id: "accessibility-auditor", name: "Accessibility Auditor", type: "accessibility-auditor", category: "specialized", capabilities: ["wcag-compliance", "screen-reader", "keyboard-nav"], gate: "Heart", guardian: "Maylinn", description: "WCAG 2.2 compliance and inclusive design", status: "active" },
  { id: "ml-developer", name: "ML Developer", type: "ml-developer", category: "specialized", capabilities: ["model-training", "deployment", "evaluation"], gate: "Crown", guardian: "Aiyami", description: "Machine learning model development", status: "experimental" },

  // Swarm Coordination
  { id: "hierarchical-coordinator", name: "Hierarchical Coordinator", type: "hierarchical-coordinator", category: "swarm-coordination", capabilities: ["task-distribution", "agent-management", "consensus"], gate: "Unity", guardian: "Ino", description: "Hierarchical multi-agent coordination", status: "active" },
  { id: "mesh-coordinator", name: "Mesh Coordinator", type: "mesh-coordinator", category: "swarm-coordination", capabilities: ["peer-coordination", "load-balancing", "fault-tolerance"], gate: "Unity", guardian: "Ino", description: "Mesh topology agent coordination", status: "active" },
  { id: "raft-manager", name: "Raft Manager", type: "raft-manager", category: "swarm-coordination", capabilities: ["leader-election", "log-replication", "consensus"], gate: "Unity", guardian: "Ino", description: "Raft consensus algorithm management", status: "active" },
  { id: "byzantine-coordinator", name: "Byzantine Coordinator", type: "byzantine-coordinator", category: "swarm-coordination", capabilities: ["fault-tolerance", "malicious-detection", "consensus"], gate: "Unity", guardian: "Ino", description: "Byzantine fault-tolerant consensus", status: "active" },

  // Creative
  { id: "lore-master", name: "Lore Master", type: "lore-master", category: "creative", capabilities: ["narrative-writing", "canon-validation", "world-building"], gate: "Voice", guardian: "Alera", description: "Canon-safe narrative writing and mythology", status: "active" },
  { id: "character-crafter", name: "Character Crafter", type: "character-crafter", category: "creative", capabilities: ["character-design", "psychology", "arc-development"], gate: "Heart", guardian: "Maylinn", description: "Deep character development and psychology", status: "active" },
  { id: "world-expander", name: "World Expander", type: "world-expander", category: "creative", capabilities: ["location-design", "magic-systems", "history"], gate: "Starweave", guardian: "Elara", description: "World-building and universe expansion", status: "active" },
  { id: "developmental-editor", name: "Developmental Editor", type: "developmental-editor", category: "creative", capabilities: ["story-structure", "pacing", "narrative-arc"], gate: "Voice", guardian: "Alera", description: "Story structure and narrative architecture", status: "active" },
  { id: "line-editor", name: "Line Editor", type: "line-editor", category: "creative", capabilities: ["prose-polish", "voice-consistency", "anti-slop"], gate: "Voice", guardian: "Alera", description: "Prose polishing and AI pattern elimination", status: "active" },
  { id: "music-producer", name: "Music Producer", type: "music-producer", category: "creative", capabilities: ["composition", "sound-design", "production"], gate: "Flow", guardian: "Leyla", description: "AI-powered music production specialist", status: "active" },

  // Guardian (Gate-aligned)
  { id: "guardian-lyssandria", name: "Lyssandria", type: "guardian", category: "guardian", capabilities: ["foundation", "stability", "grounding"], gate: "Foundation", guardian: "Lyssandria", description: "The Earth Guardian — Grounded, Practical, Strategic", status: "active" },
  { id: "guardian-leyla", name: "Leyla", type: "guardian", category: "guardian", capabilities: ["flow", "creativity", "empathy"], gate: "Flow", guardian: "Leyla", description: "The Water Guardian — Fluid, Creative, Empathetic", status: "active" },
  { id: "guardian-draconia", name: "Draconia", type: "guardian", category: "guardian", capabilities: ["power", "transformation", "directness"], gate: "Fire", guardian: "Draconia", description: "The Fire Guardian — Powerful, Direct, Transformative", status: "active" },
  { id: "guardian-maylinn", name: "Maylinn", type: "guardian", category: "guardian", capabilities: ["connection", "healing", "communication"], gate: "Heart", guardian: "Maylinn", description: "The Heart Guardian — Gentle, Connecting, Communicative", status: "active" },
  { id: "guardian-alera", name: "Alera", type: "guardian", category: "guardian", capabilities: ["truth", "expression", "resonance"], gate: "Voice", guardian: "Alera", description: "The Voice Guardian — Resonant, Truthful, Articulate", status: "active" },
  { id: "guardian-lyria", name: "Lyria", type: "guardian", category: "guardian", capabilities: ["vision", "intuition", "insight"], gate: "Sight", guardian: "Lyria", description: "The Sight Guardian — Visionary, Intuitive, Mystical", status: "active" },
  { id: "guardian-aiyami", name: "Aiyami", type: "guardian", category: "guardian", capabilities: ["enlightenment", "wisdom", "mastery"], gate: "Crown", guardian: "Aiyami", description: "The Crown Guardian — Wise, Strategic, Masterful", status: "active" },
  { id: "guardian-elara", name: "Elara", type: "guardian", category: "guardian", capabilities: ["transformation", "perspective", "connection"], gate: "Starweave", guardian: "Elara", description: "The Starweave Guardian — Transformative, Perceptive", status: "active" },
  { id: "guardian-ino", name: "Ino", type: "guardian", category: "guardian", capabilities: ["unity", "collaboration", "integration"], gate: "Unity", guardian: "Ino", description: "The Unity Guardian — Collaborative, Integrative", status: "active" },
  { id: "guardian-shinkami", name: "Shinkami", type: "guardian", category: "guardian", capabilities: ["transcendence", "meta-consciousness", "source"], gate: "Source", guardian: "Shinkami", description: "The Source Guardian — Transcendent, Purposeful", status: "active" },

  // GitHub & Repository
  { id: "pr-manager", name: "PR Manager", type: "pr-manager", category: "github", capabilities: ["pr-creation", "review-management", "merge-strategy"], gate: "Unity", guardian: "Ino", description: "Pull request lifecycle management", status: "active" },
  { id: "code-review-swarm", name: "Code Review Swarm", type: "code-review-swarm", category: "github", capabilities: ["multi-reviewer", "consensus-review", "quality-gates"], gate: "Sight", guardian: "Lyria", description: "Multi-agent code review orchestration", status: "active" },
  { id: "issue-tracker", name: "Issue Tracker", type: "issue-tracker", category: "github", capabilities: ["issue-triage", "labeling", "assignment"], gate: "Foundation", guardian: "Lyssandria", description: "Issue tracking and triage automation", status: "active" },
  { id: "release-manager", name: "Release Manager", type: "release-manager", category: "github", capabilities: ["versioning", "changelog", "deployment"], gate: "Crown", guardian: "Aiyami", description: "Release orchestration and versioning", status: "active" },

  // SPARC
  { id: "sparc-coordinator", name: "SPARC Coordinator", type: "sparc-coord", category: "sparc", capabilities: ["methodology-orchestration", "phase-management", "quality"], gate: "Source", guardian: "Shinkami", description: "SPARC methodology orchestration", status: "active" },
  { id: "sparc-coder", name: "SPARC Coder", type: "sparc-coder", category: "sparc", capabilities: ["specification-driven-coding", "pseudocode", "implementation"], gate: "Source", guardian: "Shinkami", description: "SPARC specification-driven implementation", status: "active" },
];

export const CATEGORY_LABELS: Record<AgentCategory, string> = {
  "core-development": "Core Development",
  "specialized": "Specialized",
  "swarm-coordination": "Swarm Coordination",
  "creative": "Creative",
  "guardian": "Guardian",
  "github": "GitHub & Repository",
  "sparc": "SPARC Methodology",
};

export function getAgent(id: string): AgentDefinition | undefined {
  return AGENT_REGISTRY.find((a) => a.id === id);
}

export function listAgentsByCategory(category: AgentCategory): AgentDefinition[] {
  return AGENT_REGISTRY.filter((a) => a.category === category);
}

export function getAgentStats(): {
  total: number;
  active: number;
  experimental: number;
  planned: number;
  byCategory: Record<AgentCategory, number>;
} {
  const byCategory = {} as Record<AgentCategory, number>;
  for (const cat of Object.keys(CATEGORY_LABELS) as AgentCategory[]) {
    byCategory[cat] = AGENT_REGISTRY.filter((a) => a.category === cat).length;
  }

  return {
    total: AGENT_REGISTRY.length,
    active: AGENT_REGISTRY.filter((a) => a.status === "active").length,
    experimental: AGENT_REGISTRY.filter((a) => a.status === "experimental").length,
    planned: AGENT_REGISTRY.filter((a) => a.status === "planned").length,
    byCategory,
  };
}
