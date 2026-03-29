/**
 * Arcanea Ops — Repository Registry
 *
 * Canonical list of frankxai GitHub repos grouped by category.
 * This is the source of truth for which repos appear on the dashboard.
 */

import type { RepoRegistryEntry } from "./types";

export const REPO_REGISTRY: RepoRegistryEntry[] = [
  // ─── Platform ───────────────────────────────────────────────────────────
  {
    name: "arcanea-ai-app",
    category: "Platform",
    description: "Main web platform monorepo (arcanea.ai)",
  },
  {
    name: "arcanea-code",
    category: "Platform",
    description: "Flagship CLI (OpenCode fork)",
  },
  {
    name: "oh-my-arcanea",
    category: "Platform",
    description: "OpenCode harness overlay",
  },
  {
    name: "claude-arcanea",
    category: "Platform",
    description: "Claude Code harness",
  },
  {
    name: "arcanea-orchestrator",
    category: "Platform",
    description: "Multi-agent orchestrator",
  },
  {
    name: "arcanea",
    category: "Platform",
    description: "OSS monorepo (skills, agents, lore)",
  },
  {
    name: "arcanea-records",
    category: "Platform",
    description: "Music studio assets",
  },

  // ─── Intelligence ───────────────────────────────────────────────────────
  {
    name: "Starlight-Intelligence-System",
    category: "Intelligence",
    description: "5-layer cognitive architecture, 6 vaults, 7 agents",
  },
  {
    name: "acos-intelligence-system",
    category: "Intelligence",
    description: "ACOS v10 — Autonomous Creative OS",
  },
  {
    name: "agentic-creator-os",
    category: "Intelligence",
    description: "90+ skills, 65+ commands, 38 agents",
  },
  {
    name: "arcanea-intelligence-os",
    category: "Intelligence",
    description: "Mythology-infused agent orchestration",
  },
  {
    name: "arcanea-flow",
    category: "Intelligence",
    description: "Multi-agent orchestration (claude-flow fork)",
  },

  // ─── Content ────────────────────────────────────────────────────────────
  {
    name: "arcanea-claw",
    category: "Content",
    description: "AI media engine (NanoClaw fork)",
  },
  {
    name: "arcanea-author",
    category: "Content",
    description: "Book production system",
  },
  {
    name: "author-os",
    category: "Content",
    description: "AI-native author operating system",
  },
  {
    name: "author-os-skills",
    category: "Content",
    description: "Portable author skills",
  },
  {
    name: "arcanea-infogenius",
    category: "Content",
    description: "Knowledge-first visual intelligence MCP",
  },
  {
    name: "suno-mcp-server",
    category: "Content",
    description: "Suno AI music MCP",
  },
  {
    name: "arcanea-video-pipeline",
    category: "Content",
    description: "Short-form video automation",
  },

  // ─── Extensions ─────────────────────────────────────────────────────────
  {
    name: "arcanea-vscode",
    category: "Extensions",
    description: "VS Code extension (Kilo Code fork)",
  },
  {
    name: "arcanea-openclaw",
    category: "Extensions",
    description: "OpenClaw fork — personal AI assistant",
  },
  {
    name: "arcanean-open-webui",
    category: "Extensions",
    description: "Open WebUI fork",
  },
  {
    name: "arcanea-lobechat-labs",
    category: "Extensions",
    description: "LobeChat deployment",
  },
  {
    name: "arcanea-vault",
    category: "Extensions",
    description: "Cross-AI capture (ChatGPT, Claude, Gemini)",
  },
  {
    name: "arcanea-plugins",
    category: "Extensions",
    description: "Plugin registry (LobeHub fork)",
  },
  {
    name: "arcanea-onchain",
    category: "Extensions",
    description: "Economic layer, Guardian assets",
  },
  {
    name: "arcanea-marketplace",
    category: "Extensions",
    description: "AI plugins marketplace",
  },

  // ─── Skills ─────────────────────────────────────────────────────────────
  {
    name: "agentic-creator-skills",
    category: "Skills",
    description: "Public skill packages",
  },
  {
    name: "claude-code-hooks",
    category: "Skills",
    description: "15 production hooks",
  },
  {
    name: "claude-code-config",
    category: "Skills",
    description: "Personal Claude Code config",
  },
  {
    name: "context-engineering-for-creators",
    category: "Skills",
    description: "Context engineering patterns",
  },
  {
    name: "claude-scientific-skills",
    category: "Skills",
    description: "Research/science skills",
  },
  {
    name: "arcanean-prompt-language",
    category: "Skills",
    description: "SPARK.SHAPE.SHARPEN prompting",
  },

  // ─── Archive ────────────────────────────────────────────────────────────
  {
    name: "arcanea-opencode",
    category: "Archive",
    description: "Superseded by oh-my-arcanea",
  },
  {
    name: "arcanea-platform",
    category: "Archive",
    description: "Superseded by arcanea-ai-app",
  },
  {
    name: "arcanea-ecosystem",
    category: "Archive",
    description: "Now managed via main monorepo",
  },
  {
    name: "gemini-arcanea",
    category: "Archive",
    description: "Superseded by arcanea-code",
  },
  {
    name: "codex-arcanea",
    category: "Archive",
    description: "Superseded by arcanea-code",
  },
];

export const GITHUB_ORG = "frankxai";

export const CATEGORY_ORDER: readonly string[] = [
  "Platform",
  "Intelligence",
  "Content",
  "Extensions",
  "Skills",
  "Archive",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  Platform: "tower",
  Intelligence: "brain",
  Content: "scroll",
  Extensions: "puzzle",
  Skills: "wand",
  Archive: "archive",
};
