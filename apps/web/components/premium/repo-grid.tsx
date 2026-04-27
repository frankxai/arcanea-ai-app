"use client";

import { m } from "framer-motion";
import {
  brand,
  guardianAccents,
  semantic,
  competitorAccent,
} from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// RepoGrid — Visualize the Arcanea monorepo / multi-repo landscape.
// Groups repos by function (core, packages, tools, experiments) with
// activity indicators.
// ---------------------------------------------------------------------------

export interface Repo {
  name: string;
  group: "core" | "packages" | "tools" | "protocol" | "experiments";
  description: string;
  language: string;
  stars?: number;
  status: "active" | "stable" | "beta" | "archived";
  url?: string;
}

export const REPOS: Repo[] = [
  // Core
  { name: "arcanea-ai-app", group: "core", description: "The main arcanea.ai product. Next.js 16 + React 19 + Supabase.", language: "TypeScript", status: "active" },
  { name: "arcanea", group: "core", description: "Public OSS mirror. Tool-agnostic intelligence substrate.", language: "TypeScript", status: "active" },
  { name: "arcanea-intelligence-os", group: "core", description: "The Luminor runtime. CLI orchestrator.", language: "TypeScript", status: "active" },

  // Packages
  { name: "@arcanea/luminor-compiler", group: "packages", description: "Compile the Luminor Standard to Claude Code, GPT, Cursor, Gemini.", language: "TypeScript", status: "stable" },
  { name: "@arcanea/arcanea-mcp", group: "packages", description: "MCP server with 42 creative tools. World engine + visual bridge.", language: "TypeScript", status: "active" },
  { name: "@arcanea/arcanea-flow", group: "packages", description: "Swarm executor. Multi-Luminor orchestration.", language: "TypeScript", status: "active" },
  { name: "@arcanea/arcanea-memory", group: "packages", description: "AgentDB bindings. HNSW vector search. ReasoningBank.", language: "TypeScript", status: "active" },
  { name: "@arcanea/arcanea-cli", group: "packages", description: "CLI for Luminor + World commands.", language: "TypeScript", status: "beta" },
  { name: "@arcanea/publishing-house", group: "packages", description: "Book production pipeline. TASTE scorer + Pandoc.", language: "TypeScript", status: "active" },
  { name: "@arcanea/presence", group: "packages", description: "Avatar + voice presence layer. Simli + Hedra integration.", language: "TypeScript", status: "beta" },
  { name: "@arcanea/peak-performance", group: "packages", description: "10-gate audit CLI + MCP for creator performance.", language: "TypeScript", status: "stable" },

  // Tools
  { name: "oh-my-arcanea", group: "tools", description: "Zsh-style harness overlay. Installer + config.", language: "Shell", status: "active" },
  { name: "arcanea-code", group: "tools", description: "Claude Code fork with Luminor preload.", language: "TypeScript", status: "beta" },
  { name: "claude-arcanea", group: "tools", description: "Claude Code skill pack. 80+ skills + agents.", language: "Markdown", status: "active" },
  { name: "arcanea-author", group: "tools", description: "AI-native book production system. Semantic chapter graph.", language: "TypeScript", status: "active" },
  { name: "arcanea-claw", group: "tools", description: "Python daemon for media pipeline. ArcaneaClaw v0.3.0.", language: "Python", status: "beta" },

  // Protocol
  { name: "luminor-kernel-spec", group: "protocol", description: "The Luminor Standard v1.0 — CC BY 4.0.", language: "Markdown", status: "stable" },
  { name: "arcanean-protocol", group: "protocol", description: "AIPs (Arcanean Improvement Proposals). Open governance.", language: "Markdown", status: "beta" },
  { name: "agent-registry-protocol", group: "protocol", description: "A2A-compatible agent card spec. On-chain anchoring.", language: "Solidity + TS", status: "beta" },

  // Experiments
  { name: "arcanea-onchain", group: "experiments", description: "Smart contracts, NFT engines, Story Protocol licensing.", language: "Solidity", status: "active" },
  { name: "arcanea-nft-forge", group: "experiments", description: "AI-native PFP collection engine. 10K+ at scale.", language: "TypeScript", status: "beta" },
  { name: "arcanea-presence-lab", group: "experiments", description: "Avatar / voice / GPU pipeline research.", language: "TypeScript", status: "active" },
];

const GROUP_META: Record<Repo["group"], { label: string; color: string; description: string }> = {
  core: {
    label: "Core",
    color: brand.aquamarine,
    description: "The main products — web app, CLI, intelligence runtime",
  },
  packages: {
    label: "Packages",
    color: brand.atlanteanTeal,
    description: "npm-published libraries the community can depend on",
  },
  tools: {
    label: "Tools",
    color: guardianAccents.lyria,
    description: "Developer tooling, CLIs, harnesses, extensions",
  },
  protocol: {
    label: "Protocol",
    color: brand.arcaneanGold,
    description: "Open specs, AIPs, on-chain protocols",
  },
  experiments: {
    label: "Experiments",
    color: semantic.error,
    description: "Research branches, early-stage projects",
  },
};

const STATUS_LABEL: Record<Repo["status"], string> = {
  active: "ACTIVE",
  stable: "STABLE",
  beta: "BETA",
  archived: "ARCHIVED",
};

const STATUS_COLOR: Record<Repo["status"], string> = {
  active: brand.aquamarine,
  stable: brand.atlanteanTeal,
  beta: brand.arcaneanGold,
  archived: competitorAccent,
};

export function RepoGrid() {
  const groups = (Object.keys(GROUP_META) as Repo["group"][]).map((g) => ({
    key: g,
    meta: GROUP_META[g],
    repos: REPOS.filter((r) => r.group === g),
  }));

  return (
    <div className="space-y-8">
      {groups.map((group, groupIdx) => (
        <m.div
          key={group.key}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: groupIdx * 0.08 }}
        >
          {/* Group header */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: group.meta.color,
                boxShadow: `0 0 8px ${group.meta.color}`,
              }}
            />
            <h3
              className="text-base font-display font-bold"
              style={{ color: group.meta.color }}
            >
              {group.meta.label}
            </h3>
            <span className="text-[11px] font-mono tracking-wider uppercase text-white/30">
              {group.meta.description}
            </span>
            <span className="text-[10px] font-mono text-white/20 ml-auto">
              {group.repos.length} {group.repos.length === 1 ? "repo" : "repos"}
            </span>
          </div>

          {/* Repo cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {group.repos.map((repo, i) => (
              <m.a
                key={repo.name}
                href={repo.url || `https://github.com/frankxai/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group block p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[13px] font-mono font-semibold text-white/85 truncate">
                    <span style={{ color: `${group.meta.color}dd` }}>◉</span>
                    <span className="truncate">{repo.name}</span>
                  </div>
                  <span
                    className="shrink-0 text-[8px] font-mono tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      background: `${STATUS_COLOR[repo.status]}12`,
                      color: STATUS_COLOR[repo.status],
                    }}
                  >
                    {STATUS_LABEL[repo.status]}
                  </span>
                </div>
                <p className="text-[12px] text-white/45 leading-relaxed mb-3 line-clamp-2">
                  {repo.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/35 font-mono">
                    {repo.language}
                  </span>
                  <span className="text-[10px] text-white/15">·</span>
                  <span className="text-[10px] text-white/25 group-hover:text-white/50 transition-colors inline-flex items-center gap-0.5">
                    github.com/frankxai/{repo.name.replace("@arcanea/", "")}
                    <span className="text-[9px]">↗</span>
                  </span>
                </div>
              </m.a>
            ))}
          </div>
        </m.div>
      ))}
    </div>
  );
}
