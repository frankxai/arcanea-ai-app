import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ──────────────────────────────────────────────────────────────────

const TITLE = "42 AI Tools for World-Builders";
const SUBTITLE = "Every tool in the Arcanea MCP server, explained.";
const DESCRIPTION =
  "A complete reference guide to all 42 tools in the Arcanea MCP server — generators, intelligence, graph, visuals, coaching, canon, orchestration, and memory. One npx command.";
const SLUG = "42-tools-for-worldbuilders";
const DATE = "2026-04-04";
const AUTHOR = "FrankX";
const READ_TIME = "10 min read";
const ACCENT = "#a855f7";
const TAGS = [
  "mcp",
  "tools",
  "worldbuilding",
  "ai",
  "reference",
  "developer",
  "api",
];

export const metadata: Metadata = {
  title: `${TITLE} | Blog`,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    publishedTime: DATE,
    authors: [AUTHOR],
    url: `https://arcanea.ai/blog/${SLUG}`,
    images: [
      {
        url: `https://arcanea.ai/og/${SLUG}.png`,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`https://arcanea.ai/og/${SLUG}.png`],
  },
  alternates: {
    canonical: `https://arcanea.ai/blog/${SLUG}`,
  },
};

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────

type InlineSvgProps = { className?: string; style?: React.CSSProperties };
const Icons: Record<string, React.FC<InlineSvgProps>> = {
  ArrowLeft: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Tag: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
};

// ─── Structured Data ───────────────────────────────────────────────────────────

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: TITLE,
  description: DESCRIPTION,
  author: { "@type": "Person", name: AUTHOR, url: "https://arcanea.ai" },
  publisher: { "@type": "Organization", name: "Arcanea", url: "https://arcanea.ai" },
  datePublished: DATE,
  dateModified: DATE,
  mainEntityOfPage: { "@type": "WebPage", "@id": `https://arcanea.ai/blog/${SLUG}` },
  image: `https://arcanea.ai/og/${SLUG}.png`,
  keywords: TAGS.join(", "),
  wordCount: 2400,
  articleSection: "Technology",
};

// ─── Tool Category Data ────────────────────────────────────────────────────────

interface Tool {
  name: string;
  desc: string;
  params: string;
}

interface ToolCategory {
  title: string;
  count: number;
  description: string;
  tools: Tool[];
}

const CATEGORIES: ToolCategory[] = [
  {
    title: "World-Building Generators",
    count: 8,
    description: "Create canon-aware content seeded by your world's rules, history, and factions.",
    tools: [
      { name: "generate_character", desc: "Full character with backstory, abilities, faction ties, and arc hooks.", params: "archetype, element, gate, faction" },
      { name: "generate_location", desc: "Places with history, inhabitants, dangers, and narrative hooks.", params: "region, climate, faction, era" },
      { name: "generate_creature", desc: "Beasts with ecology, behavior, elemental affinity, and threat level.", params: "element, habitat, danger_level" },
      { name: "generate_quest", desc: "Multi-stage quests with objectives, antagonists, rewards, and consequences.", params: "difficulty, faction, quest_type" },
      { name: "generate_artifact", desc: "Items with origin, powers, cost, and lore connections.", params: "element, rarity, creator" },
      { name: "generate_magic", desc: "Spells and systems with rules, costs, and elemental interactions.", params: "element, gate, school" },
      { name: "generate_name", desc: "Lore-consistent names for characters, places, factions, and artifacts.", params: "type, element, culture" },
      { name: "generate_story_prompt", desc: "Narrative seeds drawn from your world's existing tensions.", params: "genre, conflict_type, scope" },
    ],
  },
  {
    title: "World Intelligence",
    count: 5,
    description: "Analyze your entire world state. Find gaps, diagnose imbalances, and generate what is missing.",
    tools: [
      { name: "analyze_factions", desc: "Map faction relationships, power balances, and narrative tensions.", params: "depth, focus_faction" },
      { name: "generate_conflict", desc: "Create conflicts that arise organically from your world's structure.", params: "factions, severity, scope" },
      { name: "assess_world", desc: "Health check across coverage, coherence, and narrative function.", params: "focus_area" },
      { name: "weave_narrative", desc: "Connect disparate elements into a coherent narrative thread.", params: "elements, theme, arc_type" },
      { name: "world_report", desc: "Full structural analysis with specific gaps and recommendations.", params: "sections, depth" },
    ],
  },
  {
    title: "Creation Graph",
    count: 5,
    description: "Build and traverse a living web of relationships between every element in your world.",
    tools: [
      { name: "link_creations", desc: "Create typed relationships between any two world elements.", params: "source, target, relationship" },
      { name: "get_related", desc: "Retrieve all elements connected to a given entity.", params: "entity, depth, type_filter" },
      { name: "suggest_connections", desc: "AI-discovered latent links you did not explicitly create.", params: "entity, max_suggestions" },
      { name: "get_world_graph", desc: "Full traversable map of your world's relationship network.", params: "filter, format" },
      { name: "find_path", desc: "Shortest narrative path between two elements in the graph.", params: "from, to, max_hops" },
    ],
  },
  {
    title: "Visual Prompts",
    count: 3,
    description: "Generate art-direction prompts from world data. Feed directly to image models.",
    tools: [
      { name: "visualize_character", desc: "Detailed visual prompt from character data: pose, gear, expression, style.", params: "character, style, mood" },
      { name: "visualize_location", desc: "Scene composition from location data: lighting, weather, time of day.", params: "location, perspective, atmosphere" },
      { name: "visualize_creature", desc: "Creature design prompt with anatomy, scale, habitat context.", params: "creature, style, action" },
    ],
  },
  {
    title: "Creative Coaching",
    count: 5,
    description: "Luminor-powered creative intelligence. Diagnose blocks, debate ideas, get personalized guidance.",
    tools: [
      { name: "diagnose_block", desc: "Identify why you are stuck and suggest targeted exercises.", params: "context, symptoms" },
      { name: "invoke_luminor", desc: "Channel a specific Luminor for domain-expert creative advice.", params: "luminor, question" },
      { name: "deep_diagnosis", desc: "Extended analysis of a creative challenge with multi-angle solutions.", params: "problem, depth" },
      { name: "convene_council", desc: "Assemble multiple Luminors for a roundtable on a complex decision.", params: "topic, luminors" },
      { name: "luminor_debate", desc: "Two Luminors argue opposing positions on a creative question.", params: "question, luminor_a, luminor_b" },
    ],
  },
  {
    title: "Canon & Reference",
    count: 3,
    description: "Validate content against your world's established rules and retrieve canonical facts.",
    tools: [
      { name: "validate_canon", desc: "Check new content for contradictions with established lore.", params: "content, strictness" },
      { name: "identify_gate", desc: "Map a concept to the Ten Gates framework and return its domain.", params: "concept" },
      { name: "get_canon", desc: "Retrieve canonical facts about any world element.", params: "topic, depth" },
    ],
  },
  {
    title: "Agent Orchestration",
    count: 6,
    description: "Coordinate specialized AI agents for complex multi-step creative workflows.",
    tools: [
      { name: "orchestrate", desc: "Route a complex task to the right agents with dependency resolution.", params: "task, strategy, agents" },
      { name: "list_agents", desc: "Show all available agent types and their capabilities.", params: "filter" },
      { name: "agent_info", desc: "Detailed info on a specific agent: skills, strengths, constraints.", params: "agent_id" },
      { name: "match_skill", desc: "Find the best agent for a given task type.", params: "task_description" },
      { name: "active_sessions", desc: "List all running agent sessions with status and progress.", params: "none" },
      { name: "check_milestones", desc: "Track progress against defined project milestones.", params: "project" },
    ],
  },
  {
    title: "Memory & Journey",
    count: 5,
    description: "Persist your world across sessions. Export, import, and track your creative journey.",
    tools: [
      { name: "get_journey", desc: "Retrieve your full creation timeline with milestones and stats.", params: "range, detail" },
      { name: "check_milestones", desc: "See which creative milestones you have reached and what is next.", params: "none" },
      { name: "export_world", desc: "Export your entire world as a portable JSON archive.", params: "format, sections" },
      { name: "save_world", desc: "Persist current world state to the vault.", params: "label" },
      { name: "load_world", desc: "Restore a previously saved world state.", params: "label" },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function FortyTwoToolsPage() {
  const totalTools = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(127,255,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
          >
            <Icons.ArrowLeft />
            Back to Blog
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{ backgroundColor: `${ACCENT}20`, color: ACCENT, borderColor: `${ACCENT}40` }}
            >
              Reference
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/20 text-brand-gold">
              Developer
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3">
            {TITLE}
          </h1>

          <p className="text-xl font-mono mb-4" style={{ color: ACCENT }}>
            {SUBTITLE}
          </p>

          <p className="text-xl text-text-secondary mb-6 max-w-2xl">
            {DESCRIPTION}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-2"><Icons.User />{AUTHOR}</span>
            <span className="flex items-center gap-2"><Icons.Calendar />{formatDate(DATE)}</span>
            <span className="flex items-center gap-2"><Icons.Clock />{READ_TIME}</span>
          </div>
        </header>

        {/* Article Content */}
        <article className="liquid-glass rounded-2xl p-6 sm:p-10 mb-10">
          <div className="prose prose-invert prose-lg max-w-none">

            {/* Intro */}
            <p className="my-4 text-text-secondary leading-relaxed text-lg">
              The Arcanea MCP server gives your AI <strong className="text-white font-semibold">{totalTools} specialized tools</strong> for building fantasy worlds, analyzing narrative structure, generating art prompts, coaching your creative process, and orchestrating multi-agent workflows. One command to install. Works with Claude, Cursor, Windsurf, and any MCP-compatible host.
            </p>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">Terminal</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="font-mono" style={{ color: ACCENT }}>npx @arcanea/mcp-server</code>
              </pre>
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              This page is the complete reference. Every tool, what it does, and its key parameters. Bookmark it.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Tool Categories */}
            {CATEGORIES.map((category, i) => (
              <section key={category.title}>
                <h2 className="text-2xl font-display font-bold mt-8 mb-2 text-white">
                  {i + 1}. {category.title}
                  <span className="ml-3 text-sm font-mono font-normal" style={{ color: ACCENT }}>
                    {category.count} tools
                  </span>
                </h2>

                <p className="my-3 text-text-secondary leading-relaxed">
                  {category.description}
                </p>

                <div className="my-5 not-prose grid grid-cols-1 gap-3">
                  {category.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <code className="text-sm font-mono font-bold" style={{ color: ACCENT }}>
                          {tool.name}
                        </code>
                        <span className="text-[10px] font-mono text-text-muted whitespace-nowrap shrink-0">
                          {tool.params}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {i < CATEGORIES.length - 1 && (
                  <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}
              </section>
            ))}

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* REST Bridge */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              REST Bridge
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Every tool is also available over HTTP via the MCP bridge endpoint. Send a POST request with the tool name and input, get the result back as JSON. No MCP client required.
            </p>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">curl — POST /api/worlds/mcp-bridge</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-text-secondary font-mono">{`curl -X POST https://arcanea.ai/api/worlds/mcp-bridge \\
  -H "Content-Type: application/json" \\
  -d '{
    "tool": "generate_character",
    "input": {
      "archetype": "shadow-mage",
      "element": "void",
      "gate": "Starweave",
      "faction": "Nero Enclave"
    }
  }'`}</code>
              </pre>
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              The bridge accepts the same parameters as the MCP tool calls. Responses include the full tool output plus metadata about the world state that was referenced during generation.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* CTA */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Start Building
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              {totalTools} tools. One server. Your world.
            </p>

            <div className="my-6 not-prose flex flex-wrap gap-3">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: ACCENT }}
              >
                See the Showcase
              </Link>
              <Link
                href="/developers"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                Developer Docs
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                Try in Chat
              </Link>
            </div>

          </div>
        </article>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <span className="text-sm text-text-muted flex items-center gap-2">
            <Icons.Tag />
            Tags:
          </span>
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-text-secondary"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Back Link Footer */}
        <div className="border-t border-white/[0.06] pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
          >
            <Icons.ArrowLeft />
            Back to Blog
          </Link>
        </div>
      </main>
    </div>
  );
}
