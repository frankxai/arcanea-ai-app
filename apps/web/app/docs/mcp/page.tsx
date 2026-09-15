/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Arcanea MCP — Developer Docs",
  description:
    "Audit a world against its canon from any MCP-compatible tool, plus Arcanea's production layer: 59 tools, 5 resources, 6 prompts. Works with Claude Code, Codex, Cursor, Windsurf, and Cline.",
  openGraph: {
    title: "Arcanea MCP — Model Context Protocol Server",
    description:
      "59 tools, 5 resources, 6 prompts. Audit worlds against canon and connect Claude Code, Codex, Cursor, or Windsurf to Arcanea production workflows.",
  },
  alternates: { canonical: "/docs/mcp" },
};

const FEATURES = [
  {
    count: "59",
    label: "Tools",
    description:
      "WorldPack canon audit and seal verification, worldbuilding, books, games, music, cinema, asset briefs, agent handoffs, creative coaching, memory, and APL.",
    href: "/docs/mcp/tools",
  },
  {
    count: "5",
    label: "Resources",
    description:
      "Live data surfaces: world graph, canon reference, journey progress, active sessions, and milestone tracker.",
    href: null,
  },
  {
    count: "6",
    label: "Prompts",
    description:
      "Ready-made prompt templates for common workflows: character creation, conflict generation, lore validation, and more.",
    href: null,
  },
  {
    count: "1",
    label: "World Intelligence",
    description:
      "Semantic graph of your world. Link creations, discover relationships, and generate narratively consistent content.",
    href: null,
  },
];

const TOOL_CATEGORIES = [
  {
    name: "WorldPack Audit",
    count: 3,
    tools: ["worldpack_check", "worldpack_verify", "worldpack_rules"],
  },
  {
    name: "Production Studios",
    count: 9,
    tools: [
      "plan_world",
      "plan_book",
      "plan_game",
      "plan_music_project",
      "plan_cinematic_scene",
      "generate_asset_brief",
      "export_project_context",
      "list_arcanea_studios",
      "get_workflow_recipe",
    ],
  },
  {
    name: "Worldbuilding Generators",
    count: 7,
    tools: [
      "generate_character",
      "generate_magic",
      "generate_creature",
      "generate_location",
      "generate_artifact",
      "generate_name",
      "generate_story_prompt",
    ],
  },
  {
    name: "Creative Coaching",
    count: 5,
    tools: [
      "diagnose_block",
      "invoke_luminor",
      "deep_diagnosis",
      "convene_council",
      "luminor_debate",
    ],
  },
  {
    name: "World Intelligence",
    count: 5,
    tools: [
      "world_report",
      "generate_conflict",
      "weave_narrative",
      "generate_quest",
      "analyze_factions",
    ],
  },
  {
    name: "World Persistence",
    count: 2,
    tools: ["save_world", "load_world"],
  },
  {
    name: "Creation Graph",
    count: 6,
    tools: [
      "link_creations",
      "get_related",
      "suggest_connections",
      "get_world_graph",
      "find_path",
      "export_world",
    ],
  },
  {
    name: "Agent Orchestration",
    count: 6,
    tools: [
      "orchestrate",
      "list_agents",
      "assess_world",
      "active_sessions",
      "agent_info",
      "match_skill",
    ],
  },
  {
    name: "Memory & Journey",
    count: 2,
    tools: ["get_journey", "check_milestones"],
  },
  {
    name: "Canon & Reference",
    count: 2,
    tools: ["validate_canon", "identify_gate"],
  },
  {
    name: "APL",
    count: 3,
    tools: ["apl_enhance", "apl_anti_slop", "apl_format"],
  },
  {
    name: "Visual Prompts",
    count: 3,
    tools: ["visualize_character", "visualize_location", "visualize_creature"],
  },
  {
    name: "Studio Vault",
    count: 4,
    tools: [
      "get_arcanea_bridge_status",
      "search_arcanea_vault",
      "save_to_arcanea_vault",
      "list_arcanea_worlds",
    ],
  },
  {
    name: "Lore Archives",
    count: 2,
    tools: ["search_sovereign_depths", "search_weight_of_wonders"],
  },
];

export default function McpOverviewPage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.07),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(127,255,212,0.03),transparent_50%)]" />
      </div>

      <main className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* ---- Breadcrumb ---- */}
        <nav className="pt-8 pb-2">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link
                href="/docs"
                className="hover:text-zinc-300 transition-colors"
              >
                Docs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--arc-brand-atlantean-teal)]">MCP</li>
          </ol>
        </nav>

        {/* ---- Hero ---- */}
        <section className="pb-12 pt-10 sm:pb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--arc-brand-atlantean-teal)]" />
            <span className="font-mono text-xs tracking-widest text-[var(--arc-brand-atlantean-teal)]">
              MODEL CONTEXT PROTOCOL
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Arcanea{" "}
            <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent">
              MCP Server
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Connect Claude Code, Cursor, Windsurf, or any MCP-compatible tool to
            Arcanea&apos;s creative intelligence layer. Audit a world against its
            canon with rule-level findings, verify an exported world was not
            edited, generate characters, and plan books and games — all from
            inside your editor.
          </p>

          {/* Quick start */}
          <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
            <p className="mb-3 font-mono text-xs text-zinc-500 uppercase tracking-wider">
              Quick Start
            </p>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-zinc-600">#</span>
                <span className="text-zinc-500">Claude Code</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-[var(--arc-brand-atlantean-teal)]">
                  $
                </span>
                <code className="text-zinc-200">
                  claude mcp add arcanea -- npx -y @arcanea/mcp-server@1
                </code>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <span className="shrink-0 text-zinc-600">#</span>
                <span className="text-zinc-500">
                  Cursor / Windsurf (mcp.json)
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-[var(--arc-brand-atlantean-teal)]">
                  {">"}
                </span>
                <code className="text-zinc-200 break-all">
                  {
                    '{ "arcanea": { "command": "npx", "args": ["-y", "@arcanea/mcp-server@1"] } }'
                  }
                </code>
              </div>
            </div>
            <div className="mt-4 border-t border-white/[0.04] pt-4">
              <Link
                href="/docs/mcp/install"
                className="text-sm text-[var(--arc-brand-atlantean-teal)] hover:text-white transition-colors"
              >
                Full installation guide &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ---- Feature grid ---- */}
        <section className="pb-12">
          <h2 className="font-display text-xl font-semibold text-white mb-5">
            What&apos;s included
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display text-3xl font-bold text-[var(--arc-brand-atlantean-teal)]">
                    {f.count}
                  </span>
                  <span className="font-display text-lg font-semibold text-white">
                    {f.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {f.description}
                </p>
                {f.href && (
                  <Link
                    href={f.href}
                    className="mt-3 inline-block text-sm text-[var(--arc-brand-atlantean-teal)] hover:text-white transition-colors"
                  >
                    Browse {f.label.toLowerCase()} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---- Tool categories ---- */}
        <section className="pb-12">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-xl font-semibold text-white">
              Tool categories
            </h2>
            <Link
              href="/docs/mcp/tools"
              className="text-sm text-[var(--arc-brand-atlantean-teal)] hover:text-white transition-colors"
            >
              Full reference &rarr;
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="py-3 px-5 text-left font-mono text-xs text-zinc-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-3 px-5 text-left font-mono text-xs text-zinc-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="hidden py-3 px-5 text-left font-mono text-xs text-zinc-500 uppercase tracking-wider sm:table-cell">
                    Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {TOOL_CATEGORIES.map((cat) => (
                  <tr
                    key={cat.name}
                    className="hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="py-3.5 px-5 font-medium text-zinc-200">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="rounded-md bg-[var(--arc-brand-atlantean-teal)]/10 px-2 py-0.5 font-mono text-xs text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/20">
                        {cat.count}
                      </span>
                    </td>
                    <td className="hidden py-3.5 px-5 text-zinc-500 sm:table-cell">
                      {cat.tools.slice(0, 3).join(", ")}
                      {cat.tools.length > 3 && (
                        <span className="text-zinc-600">
                          {" "}
                          +{cat.tools.length - 3} more
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---- Sub-page links ---- */}
        <section className="pb-20">
          <h2 className="font-display text-xl font-semibold text-white mb-5">
            Continue reading
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/docs/mcp/tools"
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-[var(--arc-brand-atlantean-teal)]/30 hover:bg-white/[0.04] transition-all"
            >
              <p className="font-display font-semibold text-white group-hover:text-[var(--arc-brand-atlantean-teal)] transition-colors">
                Tool Reference
              </p>
              <p className="mt-1.5 text-sm text-zinc-400">
                All 59 tools with parameters and usage examples.
              </p>
            </Link>
            <Link
              href="/docs/mcp/install"
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-[var(--arc-brand-atlantean-teal)]/30 hover:bg-white/[0.04] transition-all"
            >
              <p className="font-display font-semibold text-white group-hover:text-[var(--arc-brand-atlantean-teal)] transition-colors">
                Installation Guide
              </p>
              <p className="mt-1.5 text-sm text-zinc-400">
                Claude Code, Cursor, Windsurf, Cline, and HTTP mode.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
