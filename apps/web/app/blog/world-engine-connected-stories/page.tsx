import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ──────────────────────────────────────────────────────────────────

const TITLE = "One Prompt, A Connected World — How the Arcanea World Engine Works";
const SUBTITLE =
  "We generated a character, a temple, a creature, and a quest. The AI auto-linked them into a story.";
const DESCRIPTION =
  "The Arcanea World Engine uses 42 MCP tools to generate characters, locations, creatures, and quests that automatically reference each other — building a living narrative graph from a single session.";
const SLUG = "world-engine-connected-stories";
const DATE = "2026-04-04";
const AUTHOR = "FrankX";
const READ_TIME = "6 min read";
const ACCENT = "#00bcd4";
const TAGS = [
  "world-engine",
  "ai",
  "worldbuilding",
  "mcp",
  "quest-generation",
  "connected-narrative",
  "arcanea",
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
  author: {
    "@type": "Person",
    name: AUTHOR,
    url: "https://arcanea.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
  datePublished: DATE,
  dateModified: DATE,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://arcanea.ai/blog/${SLUG}`,
  },
  image: `https://arcanea.ai/og/${SLUG}.png`,
  keywords: TAGS.join(", "),
  wordCount: 1400,
  articleSection: "Technology",
};

// ─── Tool Category Data ────────────────────────────────────────────────────────

interface ToolCategory {
  name: string;
  count: number;
  tools: string[];
  description: string;
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: "Creation Generators",
    count: 7,
    tools: ["generate_character", "generate_creature", "generate_location", "generate_artifact", "generate_magic", "generate_name", "generate_story_prompt"],
    description: "Produce canon-aware characters, creatures, locations, artifacts, and magic systems seeded by your world state.",
  },
  {
    name: "Creator Coaching",
    count: 6,
    tools: ["diagnose_block", "deep_diagnosis", "match_skill", "identify_gate", "check_milestones", "get_journey"],
    description: "Identify creative blocks, match skills to challenges, and track your progression through the Ten Gates.",
  },
  {
    name: "World Graph",
    count: 5,
    tools: ["get_world_graph", "get_related", "suggest_connections", "link_creations", "find_path"],
    description: "Build and traverse a living relationship map between every element in your world.",
  },
  {
    name: "Orchestration",
    count: 6,
    tools: ["invoke_luminor", "luminor_debate", "convene_council", "orchestrate", "list_agents", "active_sessions"],
    description: "Coordinate specialized AI agents — Luminors — for complex multi-step creative tasks.",
  },
  {
    name: "Narrative Intelligence",
    count: 7,
    tools: ["world_report", "assess_world", "generate_conflict", "weave_narrative", "generate_quest", "analyze_factions", "validate_canon"],
    description: "Analyze world health, generate quests from existing graph data, and detect faction power imbalances.",
  },
  {
    name: "Memory Vaults",
    count: 5,
    tools: ["vault_remember", "vault_recall", "vault_recent", "vault_classify", "vault_stats"],
    description: "Persist your world across sessions with semantic search across six specialized vaults.",
  },
  {
    name: "Visual & Export",
    count: 6,
    tools: ["visualize_character", "visualize_creature", "visualize_location", "export_world", "save_world", "load_world"],
    description: "Generate image prompts for your creations and export or reload entire worlds.",
  },
];

// ─── MCP Output Examples ───────────────────────────────────────────────────────

interface McpOutput {
  tool: string;
  label: string;
  accent: string;
  output: string;
}

const MCP_OUTPUTS: McpOutput[] = [
  {
    tool: "generate_character",
    label: "Character: Pyrlyn",
    accent: "#ff6b35",
    output: `{
  "name": "Pyrlyn",
  "title": "Fire Master of the Broken Veil",
  "element": "Fire",
  "gate": "Fire Gate (396 Hz)",
  "rank": "Mage",
  "faction": "Pyros House",
  "backstory": "Pyrlyn was forged in the eruption that shattered
    the Veil between the mortal plane and the Fire Gate.
    She carries molten glass in her veins — literally.
    Her magic costs her: every spell leaves a scar.",
  "connections": []
}`,
  },
  {
    tool: "generate_location",
    label: "Location: The Tidal Place",
    accent: "#4fc3f7",
    output: `{
  "name": "The Tidal Place",
  "type": "Temple",
  "element": "Water",
  "description": "An underwater temple that surfaces once per
    lunar cycle. The architecture is alive — coral walls
    that reshape themselves based on who enters. Only
    those who have opened the Flow Gate can breathe
    inside its chambers.",
  "connections": []
}`,
  },
  {
    tool: "generate_creature",
    label: "Creature: ShadeFox",
    accent: "#ab47bc",
    output: `{
  "name": "ShadeFox",
  "type": "Void Creature",
  "element": "Void",
  "threat_level": "Moderate",
  "description": "A fox-like entity that exists in the space
    between shadows. ShadeFox does not attack — it erases.
    Anything it touches loses its history. Victims forget
    what the erased thing was, not that something is missing.",
  "connections": []
}`,
  },
  {
    tool: "generate_quest",
    label: "Quest: Safe Passage for ShadeFox",
    accent: "#00bcd4",
    output: `{
  "name": "Safe Passage for ShadeFox",
  "type": "Escort / Diplomacy",
  "description": "ShadeFox is dying — the Void is collapsing
    around it. Pyrlyn must escort the creature through
    The Tidal Place, where Water can stabilize Void energy.
    But the temple's coral walls reject Void-touched beings.
    Pyrlyn's Fire magic is the only element hot enough
    to temporarily fuse the coral open.",
  "references": ["Pyrlyn", "The Tidal Place", "ShadeFox"],
  "auto_linked": true
}`,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function WorldEngineConnectedStoriesPage() {
  return (
    <div className="relative min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(0,188,212,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(127,255,212,0.08),transparent_55%)]" />
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
              style={{
                backgroundColor: `${ACCENT}20`,
                color: ACCENT,
                borderColor: `${ACCENT}40`,
              }}
            >
              World Engine
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/20 text-brand-gold">
              AI
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
            <span className="flex items-center gap-2">
              <Icons.User />
              {AUTHOR}
            </span>
            <span className="flex items-center gap-2">
              <Icons.Calendar />
              {formatDate(DATE)}
            </span>
            <span className="flex items-center gap-2">
              <Icons.Clock />
              {READ_TIME}
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="liquid-glass rounded-2xl p-6 sm:p-10 mb-10">
          <div className="prose prose-invert prose-lg max-w-none">

            {/* Section 1: The Problem */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Problem with AI Content
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed text-lg">
              AI can generate a character in seconds. A location in two. A creature, an artifact, a magic system — all on demand. But ask it to generate a <strong className="text-white font-semibold">quest that references all three</strong>, and it falls apart. The character does not know the location exists. The creature has no relationship to either. Every generation is an island.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              This is the core failure of generative AI for worldbuilding. The outputs are high quality in isolation but structurally disconnected. You get assets, not a world. You get content, not narrative. The burden of connecting everything falls entirely on you — the creator — which means AI saves you time on the easy part (generating raw material) and gives you zero help on the hard part (making it all cohere into a living story).
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 2: What We Built */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              What We Built
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The Arcanea World Engine is an MCP server where every creation links to every other creation. We ran a single session — four tool calls in sequence — and the AI produced a character, a location, a creature, and a quest that automatically referenced all three previous creations. No manual linking. No post-hoc editing. The graph built itself.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              Here are the four real outputs from that session:
            </p>

            {/* MCP Output Cards */}
            <div className="my-8 space-y-4 not-prose">
              {MCP_OUTPUTS.map((item) => (
                <div
                  key={item.tool}
                  className="rounded-xl overflow-hidden border border-white/[0.06]"
                >
                  <div
                    className="px-4 py-2 border-b border-white/[0.06] flex items-center gap-3"
                    style={{ backgroundColor: `${item.accent}10` }}
                  >
                    <code
                      className="text-xs font-mono font-bold"
                      style={{ color: item.accent }}
                    >
                      {item.tool}
                    </code>
                    <span className="text-xs text-text-muted">{item.label}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm leading-relaxed bg-white/[0.02]">
                    <code className="text-text-secondary font-mono">{item.output}</code>
                  </pre>
                </div>
              ))}
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              Look at the fourth output. <strong className="text-white font-semibold">"Safe Passage for ShadeFox"</strong> was not hand-crafted. The quest generator read the session state, saw three unlinked creations, and wove them into a single narrative arc. Pyrlyn escorts ShadeFox through The Tidal Place. Each element has a reason to be there. Each element needs the others.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 3: How Auto-Linking Works */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              How Auto-Linking Works
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The engine maintains a <strong className="text-white font-semibold">session graph</strong> — a live data structure that tracks every creation, its element, its type, its faction affinity, and its narrative role. When you call <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">generate_quest</code>, the tool does not start from a blank prompt. It reads the full graph and constructs a quest that resolves existing tensions.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The linking logic follows three rules:
            </p>

            <div className="my-6 space-y-3 not-prose">
              {[
                { label: "Elemental Tension", desc: "Fire + Water + Void creates a three-way interaction. The quest generator looks for element combinations that produce conflict, not harmony." },
                { label: "Role Completion", desc: "A character without a quest is underutilized. A creature without a relationship to a character is decorative. The engine fills structural gaps." },
                { label: "Location as Constraint", desc: "Locations are not backdrops — they are constraints. The Tidal Place rejects Void-touched beings, which creates the core problem the quest must solve." },
              ].map((rule) => (
                <div
                  key={rule.label}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <span className="text-sm font-mono font-bold" style={{ color: ACCENT }}>
                    {rule.label}
                  </span>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">analyze_factions</code> adds another layer. It watches the power dynamics across your world and flags when one faction is accumulating too many powerful characters or when a faction has no narrative antagonist. The quest generator uses faction analysis as an input, which means quests do not just connect elements — they balance your world.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 4: 42 Tools, One Session */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              42 Tools, One Session
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The World Engine ships 42 MCP tools organized into seven categories. Every tool reads from and writes to the same world graph, which means a character generated by one tool is immediately available to every other tool in the session.
            </p>

            {/* Tool Categories Grid */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {TOOL_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className="text-sm font-mono font-bold"
                      style={{ color: ACCENT }}
                    >
                      {category.name}
                    </h3>
                    <span className="text-xs font-mono text-text-muted">
                      {category.count} tools
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mb-3 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {category.tools.map((tool) => (
                      <code
                        key={tool}
                        className="text-xs px-2 py-0.5 rounded bg-white/[0.05] text-text-secondary font-mono"
                      >
                        {tool}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 5: Try It */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Try It
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The World Engine is live. You can use it right now in two ways: through the Arcanea chat interface, or by installing the MCP server in your own AI tool.
            </p>

            {/* Install block */}
            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">Install — one command</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-text-secondary font-mono">{`npx @arcanea/mcp-server@latest`}</code>
              </pre>
            </div>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">Claude Desktop — claude_desktop_config.json</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-text-secondary font-mono">{`{
  "mcpServers": {
    "arcanea": {
      "command": "npx",
      "args": ["-y", "@arcanea/mcp-server@latest"]
    }
  }
}`}</code>
              </pre>
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              Or skip the install and start building immediately:
            </p>

            {/* CTA Links */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              <Link
                href="/chat"
                className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-[#00bcd4]/40 transition-colors no-underline"
              >
                <span className="text-sm font-mono font-bold" style={{ color: ACCENT }}>
                  /chat
                </span>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                  Open the Arcanea chat and start generating connected worlds with Lumina.
                </p>
              </Link>
              <Link
                href="/showcase"
                className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-[#00bcd4]/40 transition-colors no-underline"
              >
                <span className="text-sm font-mono font-bold" style={{ color: ACCENT }}>
                  /showcase
                </span>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                  See real outputs from the World Engine — characters, quests, and full world graphs.
                </p>
              </Link>
            </div>

            <blockquote className="border-l-4 border-brand-primary pl-4 my-8 italic text-text-secondary text-lg">
              The best AI worldbuilding tool is not the one that generates the most content. It is the one where every creation already knows every other creation exists.
            </blockquote>

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
