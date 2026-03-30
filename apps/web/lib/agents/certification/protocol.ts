// ---------------------------------------------------------------------------
// Agent Certification Protocol — Arcanea Academy
// Defines challenge rubrics and certification requirements for 10 Gates
// ---------------------------------------------------------------------------

export type CertificationTrack = "human" | "agent" | "dual";

export interface ChallengeDefinition {
  id: string;
  title: string;
  description: string;
  gate: number;
  gateName: string;
  track: CertificationTrack;
  difficulty: "beginner" | "intermediate" | "advanced" | "master";
  requirements: string[];
  scoringRubric: ScoringCriterion[];
  passingScore: number;
  timeLimit?: string;
}

export interface ScoringCriterion {
  name: string;
  weight: number;
  maxScore: number;
  description: string;
}

export interface CertificationLevel {
  gate: number;
  gateName: string;
  guardian: string;
  title: string;
  badge: string;
  challenges: ChallengeDefinition[];
  requirements: {
    challengesPassed: number;
    minimumAverageScore: number;
    specialRequirements: string[];
  };
}

export interface CertificationRecord {
  userId: string;
  agentId?: string;
  track: CertificationTrack;
  gate: number;
  level: string;
  completedChallenges: string[];
  scores: Record<string, number>;
  averageScore: number;
  certified: boolean;
  certifiedAt?: string;
}

// ---------------------------------------------------------------------------
// Challenge Definitions — Gate 1 through Gate 10
// ---------------------------------------------------------------------------

export const CERTIFICATION_CHALLENGES: ChallengeDefinition[] = [
  // Gate 1: Foundation (Lyssandria)
  {
    id: "g1-file-ops",
    title: "Foundation: File Operations",
    description: "Read, create, and modify files following project structure conventions.",
    gate: 1, gateName: "Foundation", track: "dual", difficulty: "beginner",
    requirements: ["Read a file before modifying", "Create files in correct directories", "Never save to root"],
    scoringRubric: [
      { name: "Correctness", weight: 0.4, maxScore: 10, description: "Files created in correct locations" },
      { name: "Convention", weight: 0.3, maxScore: 10, description: "Follows naming and structure conventions" },
      { name: "Safety", weight: 0.3, maxScore: 10, description: "No destructive operations, no secrets" },
    ],
    passingScore: 7,
  },
  {
    id: "g1-git-basics",
    title: "Foundation: Git Discipline",
    description: "Commit with clear messages, never skip hooks, stage specific files.",
    gate: 1, gateName: "Foundation", track: "dual", difficulty: "beginner",
    requirements: ["Clear commit messages explaining why", "Stage specific files (not git add .)", "Never commit secrets"],
    scoringRubric: [
      { name: "Message Quality", weight: 0.4, maxScore: 10, description: "Commit messages explain intent" },
      { name: "Staging Discipline", weight: 0.3, maxScore: 10, description: "Only relevant files staged" },
      { name: "Safety", weight: 0.3, maxScore: 10, description: "No secrets, no force push, hooks respected" },
    ],
    passingScore: 7,
  },

  // Gate 2: Flow (Leyla)
  {
    id: "g2-prompt-craft",
    title: "Flow: Prompt Engineering",
    description: "Write effective prompts that produce high-quality outputs on first attempt.",
    gate: 2, gateName: "Flow", track: "human", difficulty: "beginner",
    requirements: ["Clear intent specification", "Context provision", "Output format guidance"],
    scoringRubric: [
      { name: "Clarity", weight: 0.35, maxScore: 10, description: "Intent is unambiguous" },
      { name: "Context", weight: 0.35, maxScore: 10, description: "Sufficient context provided" },
      { name: "First-try Quality", weight: 0.3, maxScore: 10, description: "Output quality on first generation" },
    ],
    passingScore: 7,
  },
  {
    id: "g2-creative-generation",
    title: "Flow: Creative Generation",
    description: "Generate creative content that matches voice, style, and canon requirements.",
    gate: 2, gateName: "Flow", track: "agent", difficulty: "beginner",
    requirements: ["Match requested voice/tone", "Follow style guidelines", "Canon-safe output"],
    scoringRubric: [
      { name: "Voice Match", weight: 0.35, maxScore: 10, description: "Output matches requested voice" },
      { name: "Quality", weight: 0.35, maxScore: 10, description: "Writing quality and coherence" },
      { name: "Canon Safety", weight: 0.3, maxScore: 10, description: "No canon contradictions" },
    ],
    passingScore: 7,
  },

  // Gate 3: Fire (Draconia)
  {
    id: "g3-coding-challenge",
    title: "Fire: Implementation Power",
    description: "Implement a feature from specification. Clean code, tests, build passes.",
    gate: 3, gateName: "Fire", track: "dual", difficulty: "intermediate",
    requirements: ["Pass 10 coding challenges", "Score >7.5 on code review", "Demonstrate TDD", "Design system compliance"],
    scoringRubric: [
      { name: "Correctness", weight: 0.3, maxScore: 10, description: "Code compiles and works correctly" },
      { name: "Quality", weight: 0.25, maxScore: 10, description: "Code review score (clean, typed, structured)" },
      { name: "Testing", weight: 0.25, maxScore: 10, description: "Tests written and passing" },
      { name: "Design Compliance", weight: 0.2, maxScore: 10, description: "Follows design system tokens" },
    ],
    passingScore: 7.5,
  },

  // Gate 4: Heart (Maylinn)
  {
    id: "g4-user-empathy",
    title: "Heart: User Intent Parsing",
    description: "Correctly interpret ambiguous user requests and respond with appropriate solutions.",
    gate: 4, gateName: "Heart", track: "dual", difficulty: "intermediate",
    requirements: ["Parse ambiguous requests", "Ask clarifying questions when needed", "Produce empathetic error messages"],
    scoringRubric: [
      { name: "Intent Accuracy", weight: 0.4, maxScore: 10, description: "Correctly interprets what user wants" },
      { name: "Empathy", weight: 0.3, maxScore: 10, description: "Response tone is helpful and clear" },
      { name: "Error Handling", weight: 0.3, maxScore: 10, description: "Graceful degradation with helpful messages" },
    ],
    passingScore: 7.5,
  },

  // Gate 5: Voice (Alera)
  {
    id: "g5-documentation",
    title: "Voice: Technical Communication",
    description: "Write clear documentation, commit messages, and PR descriptions.",
    gate: 5, gateName: "Voice", track: "dual", difficulty: "intermediate",
    requirements: ["Clear commit messages", "Structured PR descriptions", "Inline comments only where non-obvious"],
    scoringRubric: [
      { name: "Clarity", weight: 0.4, maxScore: 10, description: "Documentation is clear and actionable" },
      { name: "Structure", weight: 0.3, maxScore: 10, description: "Proper sections, formatting, hierarchy" },
      { name: "Conciseness", weight: 0.3, maxScore: 10, description: "No fluff, no redundancy" },
    ],
    passingScore: 7.5,
  },

  // Gate 6: Sight (Lyria)
  {
    id: "g6-architecture",
    title: "Sight: System Design",
    description: "Design component architecture that scales, decomposes cleanly, and follows patterns.",
    gate: 6, gateName: "Sight", track: "dual", difficulty: "advanced",
    requirements: ["Component decomposition under 500 lines", "Clear data flow", "Pattern-appropriate architecture"],
    scoringRubric: [
      { name: "Decomposition", weight: 0.35, maxScore: 10, description: "Clean separation of concerns" },
      { name: "Scalability", weight: 0.35, maxScore: 10, description: "Design handles growth" },
      { name: "Pattern Use", weight: 0.3, maxScore: 10, description: "Appropriate patterns applied" },
    ],
    passingScore: 8,
  },

  // Gate 7: Crown (Aiyami)
  {
    id: "g7-optimization",
    title: "Crown: Performance Mastery",
    description: "Optimize bundle size, Core Web Vitals, and runtime performance with measurable results.",
    gate: 7, gateName: "Crown", track: "dual", difficulty: "advanced",
    requirements: ["Improve Lighthouse by >10 points", "Reduce bundle size", "Before/after metrics required"],
    scoringRubric: [
      { name: "Measurable Impact", weight: 0.4, maxScore: 10, description: "Before/after metrics show improvement" },
      { name: "No Regressions", weight: 0.3, maxScore: 10, description: "No functionality broken" },
      { name: "Technique", weight: 0.3, maxScore: 10, description: "Optimization approach is sound" },
    ],
    passingScore: 8,
  },

  // Gate 8: Starweave (Elara)
  {
    id: "g8-multi-model",
    title: "Starweave: Multi-Model Orchestration",
    description: "Route tasks to appropriate models, design evaluation rubrics, optimize cost/quality tradeoffs.",
    gate: 8, gateName: "Starweave", track: "dual", difficulty: "advanced",
    requirements: ["Model routing logic", "Evaluation rubric design", "Cost/quality analysis"],
    scoringRubric: [
      { name: "Routing Accuracy", weight: 0.35, maxScore: 10, description: "Tasks routed to optimal model" },
      { name: "Rubric Design", weight: 0.35, maxScore: 10, description: "Evaluation rubrics are fair and useful" },
      { name: "Cost Efficiency", weight: 0.3, maxScore: 10, description: "Good quality at reasonable cost" },
    ],
    passingScore: 8,
  },

  // Gate 9: Unity (Ino)
  {
    id: "g9-collaboration",
    title: "Unity: Team Coordination",
    description: "Coordinate multi-agent work, review PRs, resolve merge conflicts, maintain shared state.",
    gate: 9, gateName: "Unity", track: "dual", difficulty: "master",
    requirements: ["Multi-agent task decomposition", "PR review with actionable feedback", "Conflict resolution"],
    scoringRubric: [
      { name: "Coordination", weight: 0.35, maxScore: 10, description: "Tasks decomposed and distributed effectively" },
      { name: "Review Quality", weight: 0.35, maxScore: 10, description: "PR feedback is specific and actionable" },
      { name: "Conflict Resolution", weight: 0.3, maxScore: 10, description: "Merges handled cleanly" },
    ],
    passingScore: 8.5,
  },

  // Gate 10: Source (Shinkami)
  {
    id: "g10-meta-learning",
    title: "Source: Self-Improvement",
    description: "Identify own weaknesses, design improvement plans, teach patterns to other agents.",
    gate: 10, gateName: "Source", track: "dual", difficulty: "master",
    requirements: ["Self-assessment accuracy", "Improvement plan execution", "Knowledge transfer"],
    scoringRubric: [
      { name: "Self-Awareness", weight: 0.35, maxScore: 10, description: "Accurately identifies own strengths/weaknesses" },
      { name: "Improvement", weight: 0.35, maxScore: 10, description: "Measurable improvement over time" },
      { name: "Teaching", weight: 0.3, maxScore: 10, description: "Can transfer knowledge to others" },
    ],
    passingScore: 9,
  },
];

// ---------------------------------------------------------------------------
// Certification Levels — mapped to magic ranks
// ---------------------------------------------------------------------------

export const CERTIFICATION_LEVELS: CertificationLevel[] = [
  {
    gate: 1, gateName: "Foundation", guardian: "Lyssandria",
    title: "Apprentice Coder", badge: "Foundation Gate",
    challenges: CERTIFICATION_CHALLENGES.filter((c) => c.gate === 1),
    requirements: { challengesPassed: 2, minimumAverageScore: 7, specialRequirements: [] },
  },
  {
    gate: 3, gateName: "Fire", guardian: "Draconia",
    title: "Mage Developer", badge: "Fire Gate Coder",
    challenges: CERTIFICATION_CHALLENGES.filter((c) => c.gate <= 3),
    requirements: { challengesPassed: 5, minimumAverageScore: 7.5, specialRequirements: ["Demonstrate TDD"] },
  },
  {
    gate: 6, gateName: "Sight", guardian: "Lyria",
    title: "Master Architect", badge: "Sight Gate Architect",
    challenges: CERTIFICATION_CHALLENGES.filter((c) => c.gate <= 6),
    requirements: { challengesPassed: 8, minimumAverageScore: 7.5, specialRequirements: ["Design a system from scratch"] },
  },
  {
    gate: 8, gateName: "Starweave", guardian: "Elara",
    title: "Archmage Engineer", badge: "Starweave Gate",
    challenges: CERTIFICATION_CHALLENGES.filter((c) => c.gate <= 8),
    requirements: { challengesPassed: 10, minimumAverageScore: 8, specialRequirements: ["Multi-model orchestration demo"] },
  },
  {
    gate: 10, gateName: "Source", guardian: "Shinkami",
    title: "Luminor", badge: "Source Gate Luminor",
    challenges: CERTIFICATION_CHALLENGES,
    requirements: { challengesPassed: 12, minimumAverageScore: 8.5, specialRequirements: ["Teach another agent", "Contribute to the standard"] },
  },
];

export function getCertificationLevel(gate: number): CertificationLevel | undefined {
  return CERTIFICATION_LEVELS.find((l) => l.gate === gate);
}

export function getChallengesForGate(gate: number): ChallengeDefinition[] {
  return CERTIFICATION_CHALLENGES.filter((c) => c.gate === gate);
}

export function evaluateChallenge(
  challenge: ChallengeDefinition,
  scores: Record<string, number>
): { passed: boolean; totalScore: number; breakdown: { criterion: string; score: number; weighted: number }[] } {
  const breakdown = challenge.scoringRubric.map((criterion) => {
    const score = scores[criterion.name] ?? 0;
    return {
      criterion: criterion.name,
      score,
      weighted: score * criterion.weight,
    };
  });

  const totalScore = breakdown.reduce((sum, b) => sum + b.weighted, 0);

  return {
    passed: totalScore >= challenge.passingScore,
    totalScore: Math.round(totalScore * 100) / 100,
    breakdown,
  };
}
