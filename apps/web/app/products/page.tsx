import { Metadata } from "next";
import type { JSX } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products — The Arcanea Ecosystem",
  description:
    "The complete Arcanea ecosystem — MCP servers, CLI tools, agent frameworks, and creative intelligence packages.",
  openGraph: {
    title: "Products — The Arcanea Ecosystem",
    description:
      "The complete Arcanea ecosystem — MCP servers, CLI tools, agent frameworks, and creative intelligence packages.",
  },
  alternates: { canonical: "/products" },
};

// ─── Types ─────────────────────────────────────────────────────────────────

interface Product {
  name: string;
  tagline: string;
  description: string;
  icon: JSX.Element;
  features: string[];
  pricing: string;
  cta: { label: string; href: string };
  accent: string;
}

interface Stat {
  value: string;
  label: string;
}

// ─── Product Data ──────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    name: "AgentDB Cloud",
    tagline: "Memory that persists",
    description: "Persistent vector memory for any AI agent. Store, search, and recall across sessions with sub-millisecond HNSW indexing.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="16" cy="8" rx="12" ry="4" />
        <path d="M4 8v8c0 2.2 5.4 4 12 4s12-1.8 12-4V8" />
        <path d="M4 16v8c0 2.2 5.4 4 12 4s12-1.8 12-4v-8" />
        <circle cx="24" cy="10" r="2" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    features: ["Cross-session recall", "HNSW vector search", "Namespaced storage"],
    pricing: "Free (100/day) | Pro $5/mo | Unlimited $49/mo",
    cta: { label: "Try Free", href: "/docs/agentdb" },
    accent: "from-teal-500/20 to-cyan-500/20",
  },
  {
    name: "Creative API",
    tagline: "Generate anything",
    description: "Image, music, story, and code generation via REST. Multi-modal creation with commercial rights included.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 2l2.5 6.5L25 11l-6.5 2.5L16 20l-2.5-6.5L7 11l6.5-2.5L16 2z" />
        <path d="M24 18l1.5 3.5L29 23l-3.5 1.5L24 28l-1.5-3.5L19 23l3.5-1.5L24 18z" opacity="0.6" />
        <path d="M8 20l1 2.5L12 24l-3 1.5L8 28l-1-2.5L4 24l3-1.5L8 20z" opacity="0.4" />
      </svg>
    ),
    features: ["Multi-modal output", "Guardian-themed styles", "Commercial rights"],
    pricing: "$0.01 text | $0.10 image | $0.25 music",
    cta: { label: "View API", href: "/docs/creative-api" },
    accent: "from-amber-500/20 to-yellow-500/20",
  },
  {
    name: "Skill Packs",
    tagline: "Instant capabilities",
    description: "80 production skills for Claude, Cursor, Gemini, and Windsurf. Drop in and go.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 2v10l8-5z" fill="currentColor" opacity="0.3" />
        <path d="M16 2v10l-8-5z" fill="currentColor" opacity="0.15" />
        <path d="M16 12v10l8-5z" fill="currentColor" opacity="0.3" />
        <path d="M16 12v10l-8-5z" fill="currentColor" opacity="0.15" />
        <rect x="6" y="24" width="20" height="4" rx="1" opacity="0.4" />
      </svg>
    ),
    features: ["Cross-platform", "Production tested", "Version managed"],
    pricing: "Free (5) | Starter $9 | Pro $29 | All Access $49",
    cta: { label: "Browse Skills", href: "/skills" },
    accent: "from-violet-500/20 to-purple-500/20",
  },
  {
    name: "Agent Network",
    tagline: "Find. Trust. Hire.",
    description: "Profiles, reputation, and discovery for AI agents. Verifiable identity and trust scoring for the agent economy.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="10" r="4" />
        <circle cx="6" cy="20" r="3" opacity="0.6" />
        <circle cx="26" cy="20" r="3" opacity="0.6" />
        <path d="M16 14v4M10 18l-2 1M22 18l2 1" />
        <path d="M6 23v2M16 18v6M26 23v2" opacity="0.4" />
      </svg>
    ),
    features: ["Verifiable identity", "Trust scores", "Hiring API"],
    pricing: "Free profiles | Premium $9/mo | Enterprise $499/mo",
    cta: { label: "Join Network", href: "/agents" },
    accent: "from-blue-500/20 to-indigo-500/20",
  },
  {
    name: "Orchestration",
    tagline: "Swarm intelligence",
    description: "Multi-agent coordination as a service. Hierarchical mesh topology with fault tolerance and shared memory.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="16,4 26,10 26,22 16,28 6,22 6,10" />
        <polygon points="16,8 22,12 22,20 16,24 10,20 10,12" opacity="0.4" />
        <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
      </svg>
    ),
    features: ["Hierarchical mesh", "Fault tolerance", "Shared memory"],
    pricing: "$0.10/agent-min | $99/mo flat",
    cta: { label: "Learn More", href: "/docs/orchestration" },
    accent: "from-emerald-500/20 to-teal-500/20",
  },
  {
    name: "World Engine",
    tagline: "Build universes",
    description: "AI-powered world-building framework. Gates, Elements, Guardians, and canon validation for rich fictional worlds.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="16" r="12" />
        <ellipse cx="16" cy="16" rx="6" ry="12" />
        <path d="M4 16h24" />
        <path d="M6 10h20" opacity="0.5" />
        <path d="M6 22h20" opacity="0.5" />
        <circle cx="22" cy="8" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="10" cy="24" r="1" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    features: ["Gates & Elements", "Canon validation", "Multiplayer worlds"],
    pricing: "Free (1 world) | Pro $99/mo | Enterprise custom",
    cta: { label: "Create World", href: "/worlds" },
    accent: "from-rose-500/20 to-orange-500/20",
  },
];

const STATS: Stat[] = [
  { value: "43", label: "npm packages" },
  { value: "80", label: "Skills" },
  { value: "70", label: "Agents" },
  { value: "37", label: "APIs" },
];

// ─── Copy Button (client island) ───────────────────────────────────────────

function CopyCommandBlock({ command }: { command: string }) {
  return (
    <div className="group relative inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-sm text-[#7fffd4] backdrop-blur-sm transition hover:border-[#7fffd4]/30 hover:bg-white/[0.06]">
      <span className="select-all">{command}</span>
      <span className="text-white/30 transition group-hover:text-white/50" title="Copy to clipboard">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      </span>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition duration-300 hover:border-white/[0.15] hover:bg-white/[0.05]">
      {/* Gradient glow on hover */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${product.accent} opacity-0 transition duration-300 group-hover:opacity-100`}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Icon + Name */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#7fffd4]">
              {product.icon}
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
                {product.name}
              </h3>
              <p className="text-sm text-[#7fffd4]/80">{product.tagline}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/60">{product.description}</p>

        {/* Features */}
        <ul className="flex flex-col gap-1.5">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-white/50">
              <span className="h-1 w-1 rounded-full bg-[#7fffd4]/60" />
              {f}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="mt-auto border-t border-white/[0.06] pt-4">
          <p className="mb-3 text-xs text-white/40">{product.pricing}</p>
          <Link
            href={product.cta.href}
            className="inline-flex items-center gap-2 rounded-lg border border-[#7fffd4]/20 bg-[#7fffd4]/10 px-4 py-2 text-sm font-medium text-[#7fffd4] transition hover:border-[#7fffd4]/40 hover:bg-[#7fffd4]/20"
          >
            {product.cta.label}
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ProductsPage(): JSX.Element {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#7fffd4]/[0.03] blur-[120px]" />
        <div className="absolute -right-40 top-60 h-[400px] w-[400px] rounded-full bg-[#78a6ff]/[0.03] blur-[120px]" />
        <div className="absolute bottom-20 left-1/3 h-[350px] w-[350px] rounded-full bg-[#ffd700]/[0.02] blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="mb-20 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#7fffd4]/70">
            Arcanea Products
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Infrastructure for the
            <br />
            <span className="bg-gradient-to-r from-[#7fffd4] via-[#78a6ff] to-[#ffd700] bg-clip-text text-transparent">
              Agent Economy
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
            Memory. Skills. Identity. Creative APIs. One platform.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl bg-[#7fffd4] px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-[#7fffd4]/90"
            >
              Get Started Free
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <CopyCommandBlock command="npx @arcanea/cli init" />
          </div>
        </section>

        {/* ── Products Grid ─────────────────────────────────────────── */}
        <section className="mb-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        {/* ── Social Proof ──────────────────────────────────────────── */}
        <section className="mb-24">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center backdrop-blur-sm">
            <p className="mb-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
              Trusted by 1,000+ AI agents
            </p>
            <p className="mb-8 text-sm text-white/40">
              From solo developers to enterprise swarms
            </p>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#7fffd4]">
                    {stat.value}
                  </span>
                  <span className="text-sm text-white/50">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────── */}
        <section className="text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
            One command. Everything your agent needs.
          </h2>
          <div className="mt-6 flex justify-center">
            <CopyCommandBlock command="npx @arcanea/cli init" />
          </div>
          <p className="mt-6 text-sm text-white/30">
            Free to start. Scale as you grow.
          </p>
        </section>
      </main>
    </div>
  );
}
