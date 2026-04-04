import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ──────────────────────────────────────────────────────────────────

const TITLE = "Agent Engine Optimization — Making Your Platform Visible to AI";
const SUBTITLE =
  "SEO was for Google. AEO is for ChatGPT, Claude, and Perplexity.";
const DESCRIPTION =
  "In 2026, half of web discovery happens through AI agents. Learn how Arcanea built llms.txt, structured data, dual changelogs, and AI-friendly schemas to become visible to the new wave of LLM-powered crawlers.";
const SLUG = "agent-engine-optimization";
const DATE = "2026-04-05";
const AUTHOR = "FrankX";
const READ_TIME = "7 min read";
const ACCENT = "#ffd700";
const TAGS = [
  "aeo",
  "seo",
  "ai-crawlers",
  "llms-txt",
  "structured-data",
  "agent-discovery",
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

// ─── AEO Asset Data ────────────────────────────────────────────────────────────

interface AeoAsset {
  name: string;
  path: string;
  description: string;
}

const AEO_ASSETS: AeoAsset[] = [
  {
    name: "llms.txt",
    path: "/llms.txt",
    description:
      "Concise summary of the platform, capabilities, and key endpoints for LLM consumption.",
  },
  {
    name: "llms-full.txt",
    path: "/llms-full.txt",
    description:
      "Complete tool schemas, API surface, MCP server specs, and integration instructions.",
  },
  {
    name: "ai-plugin.json",
    path: "/.well-known/ai-plugin.json",
    description:
      "OpenAI plugin manifest for ChatGPT and compatible agent platforms.",
  },
  {
    name: "robots.txt",
    path: "/robots.txt",
    description:
      "AI-friendly crawl rules that welcome GPTBot, ClaudeBot, and PerplexityBot.",
  },
  {
    name: "JSON-LD",
    path: "Every page",
    description:
      "Schema.org structured data for WebApplication, SoftwareApplication, and CreativeWork.",
  },
  {
    name: "Agent Changelog",
    path: "/docs/ops/AGENT_CHANGELOG",
    description:
      "Machine-readable changelog with file paths, schemas, breaking changes, and migrations.",
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

export default function AgentEngineOptimizationPage() {
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
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(127,255,212,0.08),transparent_55%)]" />
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
              Strategy
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-atlantean-teal/40 bg-atlantean-teal/20 text-atlantean-teal">
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

            {/* Section 1: The Shift */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Shift
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed text-lg">
              For twenty years, SEO meant one thing: making your content readable by Google's crawler so it could rank your pages in a list of blue links. That era is not ending — but it is splitting. In 2026, a growing share of web discovery happens through AI agents. When someone asks ChatGPT <em>"what tools exist for AI-powered worldbuilding?"</em> or tells Claude <em>"find me an MCP server for creative writing"</em>, the answer does not come from a search index. It comes from what the model knows — and what it can access in real time.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              If your platform is not readable by LLMs, you are invisible to this audience. Not poorly ranked. <strong className="text-white font-semibold">Invisible.</strong> The agent never mentions you because it never knew you existed. Agent Engine Optimization is the practice of making your platform discoverable, parseable, and useful to AI agents — not just human visitors.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 2: What We Built */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              What We Built for AI Crawlers
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Arcanea ships six artifacts specifically designed for agent consumption. None of them are visible to human visitors. All of them make the platform legible to machines that recommend tools, answer questions, and integrate APIs on behalf of users.
            </p>

            {/* AEO Assets Grid */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {AEO_ASSETS.map((asset) => (
                <div
                  key={asset.name}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5"
                >
                  <h3
                    className="text-sm font-mono font-bold mb-1"
                    style={{ color: ACCENT }}
                  >
                    {asset.name}
                  </h3>
                  <p className="text-xs text-text-muted mb-2 font-mono">
                    {asset.path}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {asset.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              Together, these artifacts answer every question an AI agent might ask about the platform: <em>What is this? What can it do? How do I integrate it? What changed recently? Is it safe to crawl?</em>
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 3: Dual Changelog */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Dual Changelog
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Most platforms maintain one changelog written for humans. We maintain two. The human version lives at <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">/changelog</code> — narrative, benefit-focused, with screenshots and context. It tells users <em>what improved</em> and <em>why they should care</em>.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The agent version lives at <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">docs/ops/AGENT_CHANGELOG</code>. It is structured for machine parsing: file paths that changed, schema diffs, breaking changes with migration instructions, new API endpoints with request/response shapes. When an AI agent needs to answer <em>"did Arcanea change their MCP tool signatures recently?"</em>, this is the document that answers.
            </p>

            <blockquote className="border-l-4 border-brand-primary pl-4 my-8 italic text-text-secondary text-lg">
              Humans want narratives. Agents want diffs. Serve both.
            </blockquote>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 4: llms.txt */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The llms.txt Standard
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">llms.txt</code> file is an emerging convention — a plain-text file at your domain root that tells LLMs what your site is, what it does, and where to find the important parts. Think of it as <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">robots.txt</code> for comprehension rather than crawling. It does not control access — it provides context.
            </p>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">llms.txt — simplified example</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-text-secondary font-mono">{`# Arcanea
> AI-powered creative multiverse for worldbuilding, storytelling, and agent orchestration.

## Core Products
- Chat & Imagine: AI creation surface with Lumina orchestrator
- Worlds: Framework for building fantasy universes
- MCP Server: 34 tools for canon-aware worldbuilding

## For Developers
- Docs: https://arcanea.ai/developers
- MCP Install: npx @arcanea/mcp-server@latest
- API: REST + MCP dual-transport
- Structured Data: JSON-LD on every page

## Key Pages
- /showcase — Live demos and creator gallery
- /developers — SDK docs, API reference, integration guides
- /changelog — Platform updates (human-readable)
- /llms-full.txt — Complete tool schemas (machine-readable)`}</code>
              </pre>
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              The companion file <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">llms-full.txt</code> goes deeper: complete MCP tool schemas with parameter types, API endpoint specifications, integration code samples. The short file gets you discovered. The full file gets you integrated.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 5: Structured Data */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Structured Data That Agents Understand
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              JSON-LD structured data is not new — Google has used it for rich snippets for years. What is new is that LLMs parse it too. When an AI agent lands on a page with proper Schema.org markup, it can extract structured facts without guessing from prose. We use three primary types:
            </p>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">Schema.org types we ship</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-text-secondary font-mono">{`WebApplication    — platform identity, features, pricing
SoftwareApplication — MCP server, npm packages, install commands
CreativeWork      — Library content, blog posts, lore collections
Organization      — publisher info, social links, contact
TechArticle       — blog posts with wordCount, articleSection`}</code>
              </pre>
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              The key insight: structured data serves <em>both</em> traditional search and agent discovery. You are not choosing between SEO and AEO. JSON-LD is the overlap. Every Schema.org annotation you add improves your visibility to Google <em>and</em> to ChatGPT, Claude, and Perplexity simultaneously.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 6: Results */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Results
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Since deploying these artifacts, Arcanea appears in AI-generated recommendations for worldbuilding tools, MCP servers, and creative AI platforms. The platform is cited in Perplexity answers. Claude knows about the MCP server and can explain how to install it. ChatGPT references the tool schemas when users ask about AI-powered creative tools.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              This is not traffic in the traditional sense — there is no click, no pageview, no analytics event. It is something more valuable: <strong className="text-white font-semibold">presence in the answer</strong>. When the AI recommends your platform by name, with correct install instructions and accurate capability descriptions, you have achieved the AEO equivalent of ranking first.
            </p>

            <blockquote className="border-l-4 border-brand-primary pl-4 my-8 italic text-text-secondary text-lg">
              In the age of AI agents, the best SEO is being the answer — not ranking near it.
            </blockquote>

            <p className="my-4 text-text-secondary leading-relaxed">
              The playbook is straightforward: ship an <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">llms.txt</code>, add JSON-LD to every page, maintain an agent-readable changelog, welcome AI crawlers in your robots.txt, and publish machine-readable schemas for your tools and APIs. The platforms that do this now will compound their AI visibility. The ones that wait will wonder why agents never mention them.
            </p>

            {/* CTAs */}
            <div className="my-10 flex flex-col sm:flex-row gap-4 not-prose">
              <Link
                href="/developers"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-bold transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: `${ACCENT}20`,
                  color: ACCENT,
                  border: `1px solid ${ACCENT}40`,
                }}
              >
                Explore /developers
              </Link>
              <Link
                href="/showcase"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-bold border border-white/10 bg-white/[0.03] text-text-secondary hover:text-white hover:border-white/20 transition-all hover:scale-[1.02]"
              >
                View Showcase
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
