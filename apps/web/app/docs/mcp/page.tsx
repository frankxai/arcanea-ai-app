import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Arcanea MCP — Developer Docs",
  description:
    "Connect any MCP-compatible AI coding tool to Arcanea's world intelligence: 34 tools, 5 resources, 6 prompts. Works with Claude Code, Cursor, Windsurf, and Cline.",
  openGraph: {
    title: "Arcanea MCP — Model Context Protocol Server",
    description:
      "34 tools, 5 resources, 6 prompts. Connect Claude Code, Cursor, or Windsurf to Arcanea world intelligence.",
  },
  alternates: { canonical: "/docs/mcp" },
};

const FEATURES = [
  {
    count: "34",
    label: "Tools",
    description:
      "Worldbuilding generators, creative coaching, agent orchestration, memory, canon validation, and APL prompt optimization.",
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
    count: 3,
    tools: ["world_report", "generate_conflict", "weave_narrative"],
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
];

export default function McpOverviewPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.07),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(127,255,212,0.03),transparent_50%)]" />
      </div>

      <main className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* ---- Breadcrumb ---- */}
        <nav className="pt-8 pb-2">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link href="/docs" className="hover:text-zinc-300 transition-colors">
                Docs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[#7fffd4]">MCP</li>
          </ol>
        </nav>

        {/* ---- Hero ---- */}
        <section className="pb-12 pt-10 sm:pb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#00bcd4]" />
            <span className="font-mono text-xs tracking-widest text-[#00bcd4]">
              MODEL CONTEXT PROTOCOL
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Arcanea{" "}
            <span className="bg-gradient-to-r from-[#00bcd4] to-[#7fffd4] bg-clip-text text-transparent">
              MCP Server
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Connect Claude Code, Cursor, Windsurf, or any MCP-compatible tool to
            Arcanea&apos;s creative intelligence layer. Generate characters,
            validate canon, orchestrate agents, and build narrative-consistent
            worlds — all from inside your editor.
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
                <span className="shrink-0 text-[#7fffd4]">$</span>
                <code className="text-zinc-200">
                  claude mcp add arcanea npx @arcanea/mcp-server
                </code>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <span className="shrink-0 text-zinc-600">#</span>
                <span className="text-zinc-500">Cursor / Windsurf (mcp.json)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-[#7fffd4]">{">"}</span>
                <code className="text-zinc-200 break-all">
                  {
                    '{ "arcanea": { "command": "npx", "args": ["@arcanea/mcp-server"] } }'
                  }
                </code>
              </div>
            </div>
            <div className="mt-4 border-t border-white/[0.04] pt-4">
              <Link
                href="/docs/mcp/install"
                className="text-sm text-[#7fffd4] hover:text-white transition-colors"
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
                  <span className="font-display text-3xl font-bold text-[#7fffd4]">
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
                    className="mt-3 inline-block text-sm text-[#7fffd4] hover:text-white transition-colors"
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
              className="text-sm text-[#7fffd4] hover:text-white transition-colors"
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
                      <span className="rounded-md bg-[#00bcd4]/10 px-2 py-0.5 font-mono text-xs text-[#00bcd4] border border-[#00bcd4]/20">
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
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-[#7fffd4]/30 hover:bg-white/[0.04] transition-all"
            >
              <p className="font-display font-semibold text-white group-hover:text-[#7fffd4] transition-colors">
                Tool Reference
              </p>
              <p className="mt-1.5 text-sm text-zinc-400">
                All 34 tools with parameters and usage examples.
              </p>
            </Link>
            <Link
              href="/docs/mcp/install"
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-[#7fffd4]/30 hover:bg-white/[0.04] transition-all"
            >
              <p className="font-display font-semibold text-white group-hover:text-[#7fffd4] transition-colors">
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
