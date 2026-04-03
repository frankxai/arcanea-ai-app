import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ──────────────────────────────────────────────────────────────────

const TITLE = "We Built a Mythology Engine as an MCP Server";
const SUBTITLE = "34 tools for worldbuilding. One npx command.";
const DESCRIPTION =
  "The Arcanea MCP server gives your AI 34 tools to generate canon-aware characters, validate lore, weave narratives, and analyze world health — all connected through a living creation graph.";
const SLUG = "mcp-mythology-engine";
const DATE = "2026-04-03";
const AUTHOR = "FrankX";
const READ_TIME = "8 min read";
const ACCENT = "#78a6ff";
const TAGS = [
  "mcp",
  "worldbuilding",
  "ai-tools",
  "typescript",
  "open-source",
  "developer",
  "arcanea-mcp",
  "architecture",
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
  wordCount: 1100,
  articleSection: "Technology",
};

// ─── Tool Category Data ────────────────────────────────────────────────────────

interface ToolCategory {
  name: string;
  tools: string[];
  description: string;
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: "World Intelligence",
    tools: ["world_report", "assess_world", "generate_conflict", "weave_narrative", "export_world"],
    description: "Analyze, diagnose, and expand your world at a macro level.",
  },
  {
    name: "Creation Generators",
    tools: ["generate_character", "generate_creature", "generate_location", "generate_artifact", "generate_magic", "generate_name", "generate_story_prompt"],
    description: "Produce canon-aware content seeded by your world's rules.",
  },
  {
    name: "Creation Graph",
    tools: ["link_creations", "get_world_graph", "get_related", "suggest_connections"],
    description: "Build a living web of relationships between every element you create.",
  },
  {
    name: "Memory Vaults",
    tools: ["vault_remember", "vault_recall", "vault_recent", "vault_classify", "vault_stats"],
    description: "Six semantic vaults that persist your world across sessions.",
  },
  {
    name: "Canon Validation",
    tools: ["validate_canon", "identify_gate", "check_milestones", "find_path"],
    description: "AI that checks your new content against your own world rules.",
  },
  {
    name: "Luminor Orchestration",
    tools: ["invoke_luminor", "luminor_debate", "convene_council", "orchestrate", "list_agents"],
    description: "Coordinate specialized AI agents for complex creative tasks.",
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

export default function McpMythologyEnginePage() {
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
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(120,166,255,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(127,255,212,0.08),transparent_55%)]" />
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
              Technology
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

            {/* Hook */}
            <p className="my-4 text-text-secondary leading-relaxed text-lg">
              What if your AI could generate characters that <strong className="text-white font-semibold">fit your world</strong> — its specific history, factions, magic system, and political tensions — instead of producing generic heroes that could belong to any setting? We built that. It is called the Arcanea MCP server, and it ships as a single <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">npx</code> command.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* What is MCP */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              What is MCP?
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The Model Context Protocol is a standard for giving AI assistants structured access to external tools. Think of it as USB for AI: the protocol defines how tools connect, and any compliant host — Claude, Cursor, Windsurf, Zed — can use them without custom integration code. You define a server with typed tools and schemas. The AI calls them like functions. The results feed back into context.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              What makes MCP interesting for creative systems is that it turns an AI assistant into a stateful collaborator. The AI is not just generating text against a blank context — it is calling into a system that knows your world, remembers what you created yesterday, and can check new content against rules you established six months ago.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* What We Built */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              What We Built: 34 Tools Across 6 Categories
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The Arcanea MCP server is a mythology engine. It does not generate content in a vacuum — it generates content that is coherent with a specific world that you define and that grows richer with every session.
            </p>

            {/* Tool Categories Grid */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {TOOL_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5"
                >
                  <h3
                    className="text-sm font-mono font-bold mb-1"
                    style={{ color: ACCENT }}
                  >
                    {category.name}
                  </h3>
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

            {/* Creation Graph */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Creation Graph
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Most worldbuilding tools generate content in isolation. You get a character, a location, a magic system — but they exist as separate files with no relationship to each other. The Creation Graph changes this. Every element you create can be linked to every other element. A character can be linked to the faction they lead, the artifact they carry, the location where they were born, and the prophecy they are destined to fulfill. Call <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">get_world_graph</code> and you receive a traversable map of your entire world — not a list of documents, but a living network of relationships.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">suggest_connections</code> takes an element and surfaces latent links that you may not have noticed: a creature whose habitat overlaps with a villain's stronghold, a character whose backstory creates a conflict with an existing faction. The AI finds the structural tensions you built without realizing it.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Memory Vaults */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Memory Vaults: Your World Persists
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Six semantic vaults store your world across sessions: characters, locations, artifacts, factions, lore, and events. Each vault supports semantic search — not just keyword lookup but meaning-based retrieval. Ask for "a character with a tragic backstory tied to the Fire Gate" and the vault returns the closest match from everything you have built, ranked by semantic distance. Your world does not reset when the conversation ends. The AI walks back into your world with full context on every new session.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* The Genius Feature */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Feature That Changes How You Build
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">world_report</code> is the tool we are most proud of. It analyzes the structural health of your world — coverage across factions, character archetypes, narrative roles, conflict vectors — and tells you what to create next. Not "add more content." Specific gaps with specific consequences.
            </p>

            <blockquote className="border-l-4 border-brand-primary pl-4 my-8 italic text-text-secondary text-lg">
              "You have 5 warriors but no healer — your party will die in Act 3. Your northern faction has no known enemies, which means they have no narrative function. Your magic system lacks a cost, which means it lacks drama."
            </blockquote>

            <p className="my-4 text-text-secondary leading-relaxed">
              This is the difference between a generative tool and an intelligence. A generative tool produces content on demand. An intelligence looks at what you have built and tells you what is missing, what is structurally weak, and what you should build next to maximize coherence and narrative tension. <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">generate_conflict</code> and <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">weave_narrative</code> then help you fill those gaps with content that fits.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Installation */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Install in 3 Lines
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The server supports HTTP and SSE dual-transport. Add it to your AI tool of choice:
            </p>

            {/* Claude */}
            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06] flex items-center justify-between">
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

            {/* Cursor / Windsurf */}
            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">Cursor / Windsurf — .cursor/mcp.json or .windsurf/mcp.json</span>
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

            {/* Direct HTTP */}
            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">Direct — start the HTTP server</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-text-secondary font-mono">{`npx @arcanea/mcp-server@latest --port 3001 --transport http`}</code>
              </pre>
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Architecture */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Under the Hood
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The server is built on the MCP SDK 1.29 using the <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">tool()</code> API introduced in the current SDK generation — no legacy switch statements, no 47-case dispatch. Each tool is declared with a Zod schema for input validation, which means malformed tool calls fail fast with clear error messages rather than silently producing garbage. The dual-transport layer supports both HTTP for persistent servers and SSE for streaming contexts, so the same server binary works in Claude Desktop, Cursor, and any HTTP client.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              Tool calls are stateless at the protocol level but stateful through the vault system. The server holds no in-memory world state between calls — every call reads from and writes to the vault layer, which means the server can restart without losing your world and multiple clients can connect to the same vault simultaneously without conflicts.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* What's Next */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              What Comes Next
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The server is open source. The repository will be published to the Arcanea OSS organization within the next sprint, and the npm package will be available under <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">@arcanea/mcp-server</code>. Marketplace listings for the Claude and Cursor extension stores are in progress.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The longer arc: your world, your rules. The vault system is designed to be self-hostable with your own storage backend. You can define custom canon rules that the validation tools enforce. You can extend the tool set with domain-specific generators for your specific genre — military science fiction, secondary world fantasy, cosmic horror. The mythology engine is the substrate. What you build on it is yours.
            </p>

            <blockquote className="border-l-4 border-brand-primary pl-4 my-8 italic text-text-secondary text-lg">
              The best worldbuilding tool is the one that knows your world. Every call makes it smarter. Every session adds to what it knows. Your world compounds.
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
