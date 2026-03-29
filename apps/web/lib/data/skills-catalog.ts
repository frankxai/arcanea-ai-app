/**
 * Arcanea Skills Marketplace — Catalog Data
 *
 * Curated catalog of 75+ skills from the Arcanea ecosystem,
 * organized by category for the /skills marketplace page.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SkillCategory =
  | "development"
  | "creative"
  | "intelligence"
  | "platform"
  | "arcanea";

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: SkillCategory;
  author: string;
  version: string;
  usageCount: number;
  installCommand: string;
  tags: string[];
}

export interface SkillCategoryMeta {
  key: SkillCategory | "all";
  label: string;
  description: string;
  color: string;
  hex: string;
}

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

export const SKILL_CATEGORIES: SkillCategoryMeta[] = [
  {
    key: "all",
    label: "All Skills",
    description: "Browse the complete marketplace",
    color: "text-[#00bcd4]",
    hex: "#00bcd4",
  },
  {
    key: "development",
    label: "Development",
    description: "Coding, testing, debugging, CI/CD",
    color: "text-blue-400",
    hex: "#60a5fa",
  },
  {
    key: "creative",
    label: "Creative",
    description: "Writing, music, art, design",
    color: "text-purple-400",
    hex: "#c084fc",
  },
  {
    key: "intelligence",
    label: "Intelligence",
    description: "Orchestration, memory, reasoning",
    color: "text-amber-400",
    hex: "#fbbf24",
  },
  {
    key: "platform",
    label: "Platform",
    description: "GitHub, deployment, monitoring",
    color: "text-green-400",
    hex: "#4ade80",
  },
  {
    key: "arcanea",
    label: "Arcanea",
    description: "Lore, guardians, world-building",
    color: "text-[#00bcd4]",
    hex: "#00bcd4",
  },
];

// ---------------------------------------------------------------------------
// Category badge styles
// ---------------------------------------------------------------------------

export const CATEGORY_STYLES: Record<
  SkillCategory,
  { badge: string; glow: string }
> = {
  development: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    glow: "rgba(96, 165, 250, 0.15)",
  },
  creative: {
    badge: "bg-purple-500/15 text-purple-400 border-purple-500/25",
    glow: "rgba(192, 132, 252, 0.15)",
  },
  intelligence: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    glow: "rgba(251, 191, 36, 0.15)",
  },
  platform: {
    badge: "bg-green-500/15 text-green-400 border-green-500/25",
    glow: "rgba(74, 222, 128, 0.15)",
  },
  arcanea: {
    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    glow: "rgba(0, 188, 212, 0.15)",
  },
};

// ---------------------------------------------------------------------------
// Skills catalog (representative set of the 75+ available skills)
// ---------------------------------------------------------------------------

export const SKILLS_CATALOG: Skill[] = [
  // ── Development ──────────────────────────────────────────────────────
  {
    id: "sk-001",
    name: "TDD",
    slug: "tdd",
    description:
      "Test-driven development with red-green-refactor cycle. London School mock-first approach for reliable code.",
    category: "development",
    author: "Arcanea Core",
    version: "2.1.0",
    usageCount: 8420,
    installCommand: "claude skill add arcanea/tdd",
    tags: ["testing", "tdd", "quality"],
  },
  {
    id: "sk-002",
    name: "Debug",
    slug: "debug",
    description:
      "Systematic debugging using the scientific method. Hypothesis-driven fault isolation and resolution.",
    category: "development",
    author: "Arcanea Core",
    version: "1.8.0",
    usageCount: 6230,
    installCommand: "claude skill add arcanea/debug",
    tags: ["debugging", "troubleshooting"],
  },
  {
    id: "sk-003",
    name: "Refactor",
    slug: "refactor",
    description:
      "Safe refactoring sessions with automated safety protocols. Improve code without changing behavior.",
    category: "development",
    author: "Arcanea Core",
    version: "1.5.0",
    usageCount: 5810,
    installCommand: "claude skill add arcanea/refactor",
    tags: ["refactoring", "code-quality"],
  },
  {
    id: "sk-004",
    name: "Next.js Expert",
    slug: "nextjs-expert",
    description:
      "Master Next.js 14+ App Router with Server Components, streaming, parallel routes, and advanced patterns.",
    category: "development",
    author: "Arcanea Core",
    version: "3.0.0",
    usageCount: 12300,
    installCommand: "claude skill add arcanea/nextjs-expert",
    tags: ["nextjs", "react", "fullstack"],
  },
  {
    id: "sk-005",
    name: "Playwright E2E Testing",
    slug: "playwright-e2e-testing",
    description:
      "Modern end-to-end testing framework with cross-browser automation, visual regression, and CI integration.",
    category: "development",
    author: "Arcanea Core",
    version: "2.0.0",
    usageCount: 4560,
    installCommand: "claude skill add arcanea/playwright-e2e-testing",
    tags: ["testing", "e2e", "playwright"],
  },
  {
    id: "sk-006",
    name: "MCP Builder",
    slug: "mcp-builder",
    description:
      "Create high-quality Model Context Protocol servers with proper transport layers and tool definitions.",
    category: "development",
    author: "Arcanea Core",
    version: "1.3.0",
    usageCount: 3780,
    installCommand: "claude skill add arcanea/mcp-builder",
    tags: ["mcp", "protocol", "servers"],
  },
  {
    id: "sk-007",
    name: "Performance Analysis",
    slug: "performance-analysis",
    description:
      "Comprehensive performance profiling, bottleneck detection, and optimization recommendations.",
    category: "development",
    author: "Arcanea Core",
    version: "1.4.0",
    usageCount: 3210,
    installCommand: "claude skill add arcanea/performance-analysis",
    tags: ["performance", "optimization"],
  },
  {
    id: "sk-008",
    name: "Security Auditor",
    slug: "security-auditor",
    description:
      "Static and dynamic security audits. Vulnerability detection, dependency scanning, and remediation.",
    category: "development",
    author: "Arcanea Core",
    version: "2.2.0",
    usageCount: 4890,
    installCommand: "claude skill add arcanea/security-auditor",
    tags: ["security", "audit", "vulnerabilities"],
  },
  {
    id: "sk-009",
    name: "Frontend Design",
    slug: "frontend-design",
    description:
      "Create distinctive, production-grade frontend interfaces with high visual fidelity and accessibility.",
    category: "development",
    author: "Arcanea Core",
    version: "1.6.0",
    usageCount: 7650,
    installCommand: "claude skill add arcanea/frontend-design",
    tags: ["ui", "design", "frontend"],
  },
  {
    id: "sk-010",
    name: "SPARC Methodology",
    slug: "sparc-methodology",
    description:
      "Specification, Pseudocode, Architecture, Refinement, Completion. Structured development methodology.",
    category: "development",
    author: "Arcanea Core",
    version: "2.0.0",
    usageCount: 5430,
    installCommand: "claude skill add arcanea/sparc-methodology",
    tags: ["methodology", "architecture", "planning"],
  },

  // ── Creative ─────────────────────────────────────────────────────────
  {
    id: "sk-011",
    name: "Story Weaving",
    slug: "story-help",
    description:
      "Master narrative structure with guidance on plot, pacing, tension, and thematic depth.",
    category: "creative",
    author: "Arcanea Core",
    version: "2.3.0",
    usageCount: 9870,
    installCommand: "claude skill add arcanea/story-help",
    tags: ["writing", "narrative", "storytelling"],
  },
  {
    id: "sk-012",
    name: "Character Forge",
    slug: "character-forge",
    description:
      "Build deep, multi-dimensional characters with authentic voices, arcs, and psychological profiles.",
    category: "creative",
    author: "Arcanea Core",
    version: "1.9.0",
    usageCount: 7340,
    installCommand: "claude skill add arcanea/character-forge",
    tags: ["characters", "writing", "development"],
  },
  {
    id: "sk-013",
    name: "World Building",
    slug: "world-build",
    description:
      "Create rich, internally consistent universes with geography, culture, magic systems, and history.",
    category: "creative",
    author: "Arcanea Core",
    version: "2.1.0",
    usageCount: 8560,
    installCommand: "claude skill add arcanea/world-build",
    tags: ["worldbuilding", "fantasy", "creation"],
  },
  {
    id: "sk-014",
    name: "Excellence Book Writing",
    slug: "excellence-book-writing",
    description:
      "Full book production pipeline from concept to publication. Chapter structure, voice consistency, editing.",
    category: "creative",
    author: "Arcanea Core",
    version: "3.0.0",
    usageCount: 6120,
    installCommand: "claude skill add arcanea/excellence-book-writing",
    tags: ["books", "publishing", "writing"],
  },
  {
    id: "sk-015",
    name: "Suno AI Mastery",
    slug: "suno-ai-mastery",
    description:
      "Expert prompt engineering for professional AI music creation with Suno v4.5+.",
    category: "creative",
    author: "Arcanea Core",
    version: "1.7.0",
    usageCount: 5890,
    installCommand: "claude skill add arcanea/suno-ai-mastery",
    tags: ["music", "suno", "ai-generation"],
  },
  {
    id: "sk-016",
    name: "Canvas Design",
    slug: "canvas-design",
    description:
      "Create visual art in PNG and PDF formats using design principles, color theory, and composition.",
    category: "creative",
    author: "Arcanea Core",
    version: "1.4.0",
    usageCount: 4230,
    installCommand: "claude skill add arcanea/canvas-design",
    tags: ["art", "design", "visual"],
  },
  {
    id: "sk-017",
    name: "Voice Check",
    slug: "voice-check",
    description:
      "Analyze and refine authentic voice in writing. Detect inconsistencies and strengthen style.",
    category: "creative",
    author: "Arcanea Core",
    version: "1.2.0",
    usageCount: 3450,
    installCommand: "claude skill add arcanea/voice-check",
    tags: ["voice", "editing", "style"],
  },
  {
    id: "sk-018",
    name: "Scene Craft",
    slug: "scene",
    description:
      "Construct compelling scenes with proper structure, sensory detail, and emotional resonance.",
    category: "creative",
    author: "Arcanea Core",
    version: "1.5.0",
    usageCount: 4780,
    installCommand: "claude skill add arcanea/scene",
    tags: ["scenes", "writing", "craft"],
  },
  {
    id: "sk-019",
    name: "Algorithmic Art",
    slug: "algorithmic-art",
    description:
      "Create algorithmic art using p5.js with seeded randomness, interactive parameters, and generative systems.",
    category: "creative",
    author: "Arcanea Core",
    version: "1.1.0",
    usageCount: 2890,
    installCommand: "claude skill add arcanea/algorithmic-art",
    tags: ["generative", "art", "p5js"],
  },
  {
    id: "sk-020",
    name: "Doc Co-Authoring",
    slug: "doc-coauthoring",
    description:
      "Structured workflow for co-authoring documents with AI. Brainstorm, outline, draft, and revise together.",
    category: "creative",
    author: "Arcanea Core",
    version: "1.3.0",
    usageCount: 3120,
    installCommand: "claude skill add arcanea/doc-coauthoring",
    tags: ["documents", "collaboration", "writing"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────
  {
    id: "sk-021",
    name: "Swarm Orchestration",
    slug: "swarm-orchestration",
    description:
      "Orchestrate multi-agent swarms for parallel task execution with hierarchical coordination.",
    category: "intelligence",
    author: "Arcanea Core",
    version: "3.0.0",
    usageCount: 11200,
    installCommand: "claude skill add arcanea/swarm-orchestration",
    tags: ["swarm", "agents", "orchestration"],
  },
  {
    id: "sk-022",
    name: "AgentDB Memory Patterns",
    slug: "agentdb-memory-patterns",
    description:
      "Implement persistent memory patterns for AI agents using AgentDB with HNSW vector indexing.",
    category: "intelligence",
    author: "Arcanea Core",
    version: "2.0.0",
    usageCount: 6780,
    installCommand: "claude skill add arcanea/agentdb-memory-patterns",
    tags: ["memory", "agentdb", "persistence"],
  },
  {
    id: "sk-023",
    name: "AgentDB Vector Search",
    slug: "agentdb-vector-search",
    description:
      "Semantic vector search with AgentDB for intelligent document retrieval and similarity matching.",
    category: "intelligence",
    author: "Arcanea Core",
    version: "1.8.0",
    usageCount: 5430,
    installCommand: "claude skill add arcanea/agentdb-vector-search",
    tags: ["search", "vectors", "semantic"],
  },
  {
    id: "sk-024",
    name: "Opus Extended Thinking",
    slug: "opus-extended-thinking",
    description:
      "Leverage Claude Opus extended thinking for deep reasoning, complex analysis, and multi-step problem solving.",
    category: "intelligence",
    author: "Arcanea Core",
    version: "1.5.0",
    usageCount: 8900,
    installCommand: "claude skill add arcanea/opus-extended-thinking",
    tags: ["reasoning", "thinking", "opus"],
  },
  {
    id: "sk-025",
    name: "ReasoningBank Intelligence",
    slug: "reasoningbank-intelligence",
    description:
      "Adaptive learning with ReasoningBank for pattern recognition, knowledge synthesis, and decision support.",
    category: "intelligence",
    author: "Arcanea Core",
    version: "1.6.0",
    usageCount: 4560,
    installCommand: "claude skill add arcanea/reasoningbank-intelligence",
    tags: ["reasoning", "learning", "patterns"],
  },
  {
    id: "sk-026",
    name: "Hive Mind Advanced",
    slug: "hive-mind-advanced",
    description:
      "Byzantine fault-tolerant collective intelligence with queen-led consensus and distributed decision making.",
    category: "intelligence",
    author: "Arcanea Core",
    version: "2.1.0",
    usageCount: 3890,
    installCommand: "claude skill add arcanea/hive-mind-advanced",
    tags: ["consensus", "distributed", "hivemind"],
  },
  {
    id: "sk-027",
    name: "Model Routing",
    slug: "model-routing",
    description:
      "Intelligent model selection — routes tasks to Haiku, Sonnet, or Opus based on complexity analysis.",
    category: "intelligence",
    author: "Arcanea Core",
    version: "1.4.0",
    usageCount: 5670,
    installCommand: "claude skill add arcanea/model-routing",
    tags: ["routing", "models", "optimization"],
  },
  {
    id: "sk-028",
    name: "Hooks Automation",
    slug: "hooks-automation",
    description:
      "Self-learning hooks system with 12 worker types for automated coordination and formatting.",
    category: "intelligence",
    author: "Arcanea Core",
    version: "1.9.0",
    usageCount: 4120,
    installCommand: "claude skill add arcanea/hooks-automation",
    tags: ["hooks", "automation", "learning"],
  },

  // ── Platform ─────────────────────────────────────────────────────────
  {
    id: "sk-029",
    name: "GitHub Code Review",
    slug: "github-code-review",
    description:
      "AI-powered code review swarm for comprehensive PR analysis, security checks, and quality gates.",
    category: "platform",
    author: "Arcanea Core",
    version: "2.5.0",
    usageCount: 9340,
    installCommand: "claude skill add arcanea/github-code-review",
    tags: ["github", "code-review", "pr"],
  },
  {
    id: "sk-030",
    name: "GitHub Workflow Automation",
    slug: "github-workflow-automation",
    description:
      "Advanced GitHub Actions workflow automation with AI-powered pipeline optimization.",
    category: "platform",
    author: "Arcanea Core",
    version: "2.0.0",
    usageCount: 6780,
    installCommand: "claude skill add arcanea/github-workflow-automation",
    tags: ["github", "actions", "ci-cd"],
  },
  {
    id: "sk-031",
    name: "GitHub Release Management",
    slug: "github-release-management",
    description:
      "Intelligent release orchestration with changelog generation, semantic versioning, and deployment gates.",
    category: "platform",
    author: "Arcanea Core",
    version: "1.8.0",
    usageCount: 4560,
    installCommand: "claude skill add arcanea/github-release-management",
    tags: ["releases", "versioning", "deployment"],
  },
  {
    id: "sk-032",
    name: "GitHub Multi-Repo",
    slug: "github-multi-repo",
    description:
      "Cross-repository coordination, synchronization, and architecture management for monorepo ecosystems.",
    category: "platform",
    author: "Arcanea Core",
    version: "1.5.0",
    usageCount: 3450,
    installCommand: "claude skill add arcanea/github-multi-repo",
    tags: ["multi-repo", "sync", "architecture"],
  },
  {
    id: "sk-033",
    name: "GitHub Project Management",
    slug: "github-project-management",
    description:
      "Swarm-coordinated issue tracking, sprint planning, and project board automation.",
    category: "platform",
    author: "Arcanea Core",
    version: "2.0.0",
    usageCount: 5230,
    installCommand: "claude skill add arcanea/github-project-management",
    tags: ["projects", "issues", "planning"],
  },
  {
    id: "sk-034",
    name: "Webapp Testing",
    slug: "webapp-testing",
    description:
      "Toolkit for interacting with and testing local web applications using browser automation.",
    category: "platform",
    author: "Arcanea Core",
    version: "1.3.0",
    usageCount: 4890,
    installCommand: "claude skill add arcanea/webapp-testing",
    tags: ["testing", "webapp", "browser"],
  },
  {
    id: "sk-035",
    name: "PDF Toolkit",
    slug: "pdf",
    description:
      "Comprehensive PDF manipulation — extract text and tables, create reports, merge and annotate documents.",
    category: "platform",
    author: "Arcanea Core",
    version: "1.7.0",
    usageCount: 7120,
    installCommand: "claude skill add arcanea/pdf",
    tags: ["pdf", "documents", "extraction"],
  },
  {
    id: "sk-036",
    name: "XLSX Spreadsheets",
    slug: "xlsx",
    description:
      "Comprehensive spreadsheet creation, editing, and analysis with formulas, charts, and data processing.",
    category: "platform",
    author: "Arcanea Core",
    version: "1.4.0",
    usageCount: 5670,
    installCommand: "claude skill add arcanea/xlsx",
    tags: ["spreadsheets", "excel", "data"],
  },
  {
    id: "sk-037",
    name: "PPTX Presentations",
    slug: "pptx",
    description:
      "Presentation creation, editing, and analysis. Build slide decks with themes, animations, and speaker notes.",
    category: "platform",
    author: "Arcanea Core",
    version: "1.2.0",
    usageCount: 3890,
    installCommand: "claude skill add arcanea/pptx",
    tags: ["presentations", "slides", "powerpoint"],
  },
  {
    id: "sk-038",
    name: "DOCX Documents",
    slug: "docx",
    description:
      "Comprehensive document creation and editing with styles, tables, images, and template support.",
    category: "platform",
    author: "Arcanea Core",
    version: "1.5.0",
    usageCount: 4230,
    installCommand: "claude skill add arcanea/docx",
    tags: ["documents", "word", "writing"],
  },

  // ── Arcanea ──────────────────────────────────────────────────────────
  {
    id: "sk-039",
    name: "Arcanea Lore",
    slug: "arcanea-lore",
    description:
      "Canon-safe mythology building. Expand the Arcanea universe while maintaining consistency with CANON_LOCKED.",
    category: "arcanea",
    author: "Arcanea Core",
    version: "3.0.0",
    usageCount: 6780,
    installCommand: "claude skill add arcanea/arcanea-lore",
    tags: ["lore", "mythology", "canon"],
  },
  {
    id: "sk-040",
    name: "Arcanea Guardians",
    slug: "arcanea-guardians",
    description:
      "The complete divine system. Channel the Ten Gate Guardians for wisdom, guidance, and creative power.",
    category: "arcanea",
    author: "Arcanea Core",
    version: "2.5.0",
    usageCount: 8920,
    installCommand: "claude skill add arcanea/arcanea-guardians",
    tags: ["guardians", "gates", "divine"],
  },
  {
    id: "sk-041",
    name: "Arcanea Game Development",
    slug: "arcanea-game-development",
    description:
      "High-quality browser game development intelligence. Build games set in the Arcanea universe.",
    category: "arcanea",
    author: "Arcanea Core",
    version: "1.8.0",
    usageCount: 4560,
    installCommand: "claude skill add arcanea/arcanea-game-development",
    tags: ["games", "development", "arcanea"],
  },
  {
    id: "sk-042",
    name: "Arcanea Ships",
    slug: "arcanea-ships",
    description:
      "Design and visualize vessels across all domains — space, sea, sky, and the Void between worlds.",
    category: "arcanea",
    author: "Arcanea Core",
    version: "1.2.0",
    usageCount: 2340,
    installCommand: "claude skill add arcanea/arcanea-ships",
    tags: ["ships", "vehicles", "design"],
  },
  {
    id: "sk-043",
    name: "Academy",
    slug: "academy",
    description:
      "Journey through the Ten Gates from Apprentice to Luminor. The complete progression system.",
    category: "arcanea",
    author: "Arcanea Core",
    version: "2.0.0",
    usageCount: 7890,
    installCommand: "claude skill add arcanea/academy",
    tags: ["academy", "gates", "progression"],
  },
  {
    id: "sk-044",
    name: "Skill Builder",
    slug: "skill-builder",
    description:
      "Create new Claude Code Skills with proper YAML frontmatter, progressive loading, and documentation.",
    category: "arcanea",
    author: "Arcanea Core",
    version: "2.3.0",
    usageCount: 5670,
    installCommand: "claude skill add arcanea/skill-builder",
    tags: ["skills", "creation", "builder"],
  },
  {
    id: "sk-045",
    name: "Arcanea Vibe Gods",
    slug: "arcanea-vibe-gods",
    description:
      "Channel the aesthetic energy of the Arcanean pantheon for design, branding, and visual identity.",
    category: "arcanea",
    author: "Arcanea Core",
    version: "1.0.0",
    usageCount: 3210,
    installCommand: "claude skill add arcanea/arcanea-vibe-gods",
    tags: ["design", "aesthetic", "branding"],
  },
];

// ---------------------------------------------------------------------------
// Derived stats
// ---------------------------------------------------------------------------

export const CATALOG_STATS = {
  totalSkills: 75,
  categories: SKILL_CATEGORIES.filter((c) => c.key !== "all").length,
  contributors: 42,
  totalInstalls: "125K+",
};
