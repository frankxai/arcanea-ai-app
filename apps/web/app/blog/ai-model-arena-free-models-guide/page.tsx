import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ──────────────────────────────────────────────────────────────────

const TITLE = "The AI Model Arena: How We Route Free Models Across 10 Agents";
const SUBTITLE = "Transparency over trade secrets. Every model, every agent, every decision.";
const DESCRIPTION =
  "A transparent look at which AI models power Arcanea, why we chose them, and how you can use the same free models in your own workflows. Updated weekly.";
const SLUG = "ai-model-arena-free-models-guide";
const DATE = "2026-04-04";
const AUTHOR = "FrankX";
const READ_TIME = "8 min read";
const ACCENT = "#7fffd4";
const TAGS = [
  "ai-models",
  "free-ai",
  "benchmarks",
  "model-routing",
  "opencode",
  "agentic-engineering",
  "llm-comparison",
  "cost-optimization",
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
  wordCount: 1800,
  articleSection: "Technology",
};

// ─── Routing Table Data ────────────────────────────────────────────────────────

interface AgentRoute {
  agent: string;
  role: string;
  model: string;
  why: string;
}

const ROUTING_TABLE: AgentRoute[] = [
  { agent: "Sisyphus", role: "Orchestrator", model: "Qwen 3.6 Plus", why: "1M context holds the full project state. Best agentic reasoning for task decomposition and delegation." },
  { agent: "Hephaestus", role: "Coder", model: "MiniMax M2.5", why: "Highest SWE-Bench at 80.2%. Writes code that passes tests on the first attempt." },
  { agent: "Oracle", role: "Architect", model: "Big Pickle", why: "Deep, deliberate reasoning for system design. Sees the whole picture before suggesting changes." },
  { agent: "Prometheus", role: "Researcher", model: "Qwen 3.6 Plus", why: "1M context ingests entire papers and codebases. The fire-bringer of knowledge." },
  { agent: "Metis", role: "Strategist", model: "Qwen 3.6 Plus", why: "Long-context reasoning to weigh trade-offs across the entire system." },
  { agent: "Momus", role: "Reviewer", model: "MiniMax M2.5", why: "80.2% SWE-Bench catches what others miss. The honest critic your code needs." },
  { agent: "Atlas", role: "Coordinator", model: "Kimi K2.5", why: "Strongest frontend model. Carries the world of integrations and UI work." },
  { agent: "Librarian", role: "Docs/Research", model: "GLM 4.7", why: "Multilingual research and knowledge extraction. Natural documentation prose." },
  { agent: "Explore", role: "Navigator", model: "GPT-5 Nano", why: "Fastest free model. Instant wayfinding through any codebase." },
];

interface BenchmarkDimension {
  name: string;
  description: string;
  leader: string;
}

const BENCHMARKS: BenchmarkDimension[] = [
  { name: "SWE-Bench Verified", description: "Can the model fix real software bugs in real codebases?", leader: "MiniMax M2.5" },
  { name: "Context Window (Effective)", description: "How well the model actually uses long context, not the advertised max.", leader: "Qwen 3.6 Plus" },
  { name: "Inference Speed", description: "Time to first token and tokens per second.", leader: "GPT-5 Nano" },
  { name: "Instruction Following", description: "Does the model do exactly what you asked without drift?", leader: "Qwen 3.6 Plus" },
  { name: "Creative Quality", description: "Human-evaluated output for narrative, dialogue, and world-building.", leader: "GLM 4.7" },
  { name: "Cost Efficiency", description: "All free tier — but rate limits and throughput differ.", leader: "GPT-5 Nano" },
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

export default function AIModelArenaPage() {
  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.15),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.08),transparent_55%)]" />
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
              Technology
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/20 text-brand-gold">
              Featured
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

            {/* Section 1: Transparency */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Why Model Transparency Matters
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed text-lg">
              Most AI products treat their model stack like a trade secret. You interact with a chat interface, you get a response, and somewhere behind the curtain a model you cannot name processed your request at a cost you cannot see.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              We think this is wrong. If you are building with AI — if your creative work, your code, your world-building depends on these systems — you deserve to know exactly what is running, why it was chosen, and what it costs. Arcanea publishes its full model stack. Every agent, every model, every routing decision.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 2: Free Model Revolution */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Free Model Revolution
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Something unprecedented happened in early 2026. Chinese labs and open-source projects began releasing frontier-class models with free API tiers. Not &ldquo;free trial&rdquo; — genuinely free, with generous rate limits and competitive performance. This changed the economics of agentic engineering overnight.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              Here are the models we currently route through OpenCode Zen at zero cost:
            </p>

            <div className="my-5 not-prose grid grid-cols-1 gap-3">
              {[
                { name: "Qwen 3.6 Plus", lab: "Alibaba", desc: "1M token context window, best-in-class agentic reasoning, strong multilingual performance. The model you reach for when an agent needs an entire codebase in context." },
                { name: "MiniMax M2.5", lab: "MiniMax", desc: "Highest SWE-Bench score among free models. Exceptional at code generation, refactoring, and debugging. Where Qwen thinks broadly, MiniMax cuts precisely." },
                { name: "Kimi K2.5", lab: "Moonshot AI", desc: "Strong mathematical reasoning and structured analysis. When a task needs careful step-by-step thinking rather than broad pattern matching, Kimi delivers." },
                { name: "GLM 4.7", lab: "Zhipu AI", desc: "Balanced general-purpose model with particularly strong creative writing. Generates narrative content that reads naturally rather than mechanically." },
                { name: "Big Pickle", lab: "Community", desc: "The wildcard. Competitive benchmarks with surprisingly strong creative and conversational abilities. Personality and tone over raw reasoning." },
                { name: "GPT-5 Nano", lab: "OpenAI", desc: "Lightweight, fast inference, reliable structured output. The workhorse for tasks that need speed over depth." },
              ].map((model) => (
                <div
                  key={model.name}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <code className="text-sm font-mono font-bold" style={{ color: ACCENT }}>
                      {model.name}
                    </code>
                    <span className="text-[10px] font-mono text-text-muted">
                      {model.lab}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {model.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 3: Routing Philosophy */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Our Routing Philosophy
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The naive approach to model routing is simple: find the best model, use it for everything. This is wrong for three reasons.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              <strong className="text-white font-semibold">Task fit.</strong> A model that excels at code generation may produce mediocre creative writing. A model with a 1M context window is overkill for a 200-token classification task.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              <strong className="text-white font-semibold">Latency.</strong> If an agent needs a quick decision to unblock a pipeline, waiting 5 seconds for a large model when a small model could answer in 200ms is a design failure.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              <strong className="text-white font-semibold">Resilience.</strong> If your entire system depends on one model and that API goes down, your system goes down. Routing across multiple providers means no single point of failure.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The Arcanean approach: 10 specialized agents, each assigned the model whose strengths match their role. The orchestrator does not pick the &ldquo;best&rdquo; model — it picks the <em>right</em> model for each task.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 4: Routing Table */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Routing Table
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Full agent-to-model mapping. This table is not static — we re-evaluate weekly based on benchmark updates, new model releases, and observed production performance.
            </p>

            <div className="my-6 not-prose overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-3 px-3 font-mono text-text-muted font-normal text-xs">Agent</th>
                    <th className="text-left py-3 px-3 font-mono text-text-muted font-normal text-xs">Role</th>
                    <th className="text-left py-3 px-3 font-mono text-text-muted font-normal text-xs">Model</th>
                    <th className="text-left py-3 px-3 font-mono text-text-muted font-normal text-xs">Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {ROUTING_TABLE.map((row) => (
                    <tr key={row.agent} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold" style={{ color: ACCENT }}>{row.agent}</td>
                      <td className="py-3 px-3 text-text-secondary">{row.role}</td>
                      <td className="py-3 px-3 text-white font-medium">{row.model}</td>
                      <td className="py-3 px-3 text-text-secondary text-xs">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 5: Benchmarks */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Benchmarks That Matter
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              SWE-Bench is the gold standard for coding ability — it measures whether a model can actually fix real bugs in real codebases. But it is one metric among many. Here is our full evaluation framework:
            </p>

            <div className="my-5 not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BENCHMARKS.map((b) => (
                <div
                  key={b.name}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4"
                >
                  <div className="text-sm font-mono font-bold text-white mb-1">{b.name}</div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-2">{b.description}</p>
                  <div className="text-[10px] font-mono" style={{ color: ACCENT }}>
                    Leader: {b.leader}
                  </div>
                </div>
              ))}
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 6: How To */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              How to Use This Yourself
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              Everything described here is reproducible. The model routing runs through OpenCode Zen, and the configuration is open. Visit <Link href="/models" className="underline" style={{ color: ACCENT }}>/models</Link> for the live arena with current benchmarks and model cards.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              To configure the same routing in your own oh-my-opencode setup:
            </p>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-text-muted">.opencode/config.yaml</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-text-secondary font-mono">{`// ~/.config/opencode/oh-my-opencode.json
{
  "agents": {
    "sisyphus": {
      "model": "opencode/qwen3.6-plus-free",
      "variant": "high",
      "fallback_models": ["opencode/minimax-m2.5-free", "opencode/kimi-k2.5-free"]
    },
    "hephaestus": {
      "model": "opencode/minimax-m2.5-free",
      "variant": "medium",
      "fallback_models": ["opencode/kimi-k2.5-free", "opencode/qwen3.6-plus-free"]
    },
    "oracle": {
      "model": "opencode/big-pickle",
      "fallback_models": ["opencode/qwen3.6-plus-free"]
    }
  },
  "model_fallback": true
}`}</code>
              </pre>
            </div>

            <p className="my-4 text-text-secondary leading-relaxed">
              Each agent gets a primary model matched to its role, with fallback chains that cascade if a model is rate-limited. The <code className="font-mono text-white">model_fallback</code> flag enables automatic switching. Full config with all 9 agents and fallback chains is on <Link href="/models" className="underline" style={{ color: ACCENT }}>the Models page</Link>.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 7: Weekly Updates */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              Weekly Updates
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              The AI model landscape shifts fast. New models drop weekly. Benchmarks update. Free tiers change. We track all of it.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The <Link href="/models" className="underline" style={{ color: ACCENT }}>/models</Link> page updates every week with new model additions, updated benchmark scores, routing table changes, and rate limit updates.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The model arena is not a static page — it is a living document of how we build with AI. Transparency is not a feature. It is a principle.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* CTA */}
            <div className="my-6 not-prose flex flex-wrap gap-3">
              <Link
                href="/models"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-black transition-colors"
                style={{ backgroundColor: ACCENT }}
              >
                View the Model Arena
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
