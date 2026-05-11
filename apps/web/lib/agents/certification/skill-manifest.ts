/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// ---------------------------------------------------------------------------
// Skill Manifest Schema — Arcanea Marketplace
// Defines the package format for distributable skills
// ---------------------------------------------------------------------------

export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  author: SkillAuthor;
  category: SkillCategory;
  gate: number;
  gateName: string;
  triggers: string[];
  capabilities: string[];
  dependencies: SkillDependency[];
  compatibility: SkillCompatibility;
  evaluation: SkillEvaluation;
  pricing: SkillPricing;
  metadata: Record<string, string>;
}

export interface SkillAuthor {
  name: string;
  github?: string;
  certified: boolean;
  certificationLevel?: string;
}

export type SkillCategory =
  | "coding"
  | "writing"
  | "design"
  | "music"
  | "world-building"
  | "productivity"
  | "research"
  | "devops"
  | "security"
  | "testing";

export interface SkillDependency {
  name: string;
  version: string;
  optional: boolean;
}

export interface SkillCompatibility {
  tools: ("claude-code" | "cursor" | "codex" | "gemini" | "arcanea-code")[];
  minVersion?: string;
  mcpRequired: boolean;
}

export interface SkillEvaluation {
  rubric: string[];
  passingScore: number;
  testCases: number;
}

export type SkillPricingTier = "free" | "premium" | "enterprise";

export interface SkillPricing {
  tier: SkillPricingTier;
  monthlyPrice?: number;
  revenueShare?: number;
}

export const SKILL_CATEGORIES: Record<SkillCategory, { label: string; color: string; icon: string }> = {
  coding: { label: "Coding", color: "var(--arc-brand-arcanean-gold)", icon: "code" },
  writing: { label: "Writing", color: "var(--arc-wind)", icon: "pen" },
  design: { label: "Design", color: "var(--arc-void)", icon: "palette" },
  music: { label: "Music", color: "var(--arc-brand-cosmic-blue)", icon: "music" },
  "world-building": { label: "World Building", color: "var(--arc-fire)", icon: "globe" },
  productivity: { label: "Productivity", color: "var(--arc-brand-arcanean-gold)", icon: "lightning" },
  research: { label: "Research", color: "var(--arc-brand-atlantean-teal)", icon: "search" },
  devops: { label: "DevOps", color: "var(--arc-void)", icon: "server" },
  security: { label: "Security", color: "var(--arc-fire)", icon: "shield" },
  testing: { label: "Testing", color: "var(--arc-wind)", icon: "check" },
};

export function validateManifest(manifest: Partial<SkillManifest>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!manifest.name) errors.push("name is required");
  if (!manifest.version) errors.push("version is required");
  if (!manifest.description) errors.push("description is required");
  if (!manifest.author?.name) errors.push("author.name is required");
  if (!manifest.category) errors.push("category is required");
  if (!manifest.triggers || manifest.triggers.length === 0) errors.push("at least one trigger is required");
  if (!manifest.compatibility?.tools || manifest.compatibility.tools.length === 0) {
    errors.push("at least one compatible tool is required");
  }

  if (manifest.version && !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    errors.push("version must follow semver (e.g. 1.0.0)");
  }

  if (manifest.pricing?.tier === "premium" && !manifest.pricing.monthlyPrice) {
    errors.push("premium skills require a monthlyPrice");
  }

  return { valid: errors.length === 0, errors };
}

export function createExampleManifest(): SkillManifest {
  return {
    name: "arcanea-tdd-master",
    version: "1.0.0",
    description: "Test-driven development skill with red-green-refactor cycles and coverage tracking.",
    author: {
      name: "Arcanea",
      github: "frankxai",
      certified: true,
      certificationLevel: "Fire Gate Coder",
    },
    category: "coding",
    gate: 3,
    gateName: "Fire",
    triggers: ["/tdd", "test-driven", "write tests first"],
    capabilities: ["test-generation", "coverage-analysis", "refactoring"],
    dependencies: [
      { name: "@arcanea/core", version: "^1.0.0", optional: false },
    ],
    compatibility: {
      tools: ["claude-code", "cursor", "codex"],
      minVersion: "1.0.0",
      mcpRequired: false,
    },
    evaluation: {
      rubric: ["Tests pass", "Coverage > 80%", "Clean refactor cycle"],
      passingScore: 7.5,
      testCases: 5,
    },
    pricing: {
      tier: "free",
      revenueShare: 0,
    },
    metadata: {
      arcaneanCode: "true",
      gateAlignment: "Fire",
    },
  };
}
