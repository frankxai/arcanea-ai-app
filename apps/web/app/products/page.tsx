/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
    <div className="group relative inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-sm text-[var(--arc-brand-atlantean-teal)] backdrop-blur-sm transition hover:border-[var(--arc-brand-atlantean-teal)]/30 hover:bg-white/[0.06]">
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[var(--arc-brand-atlantean-teal)]">
              {product.icon}
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {product.name}
              </h3>
              <p className="text-sm text-[var(--arc-brand-atlantean-teal)]/80">{product.tagline}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/60">{product.description}</p>

        {/* Features */}
        <ul className="flex flex-col gap-1.5">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-white/50">
              <span className="h-1 w-1 rounded-full bg-[var(--arc-brand-atlantean-teal)]/60" />
              {f}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="mt-auto border-t border-white/[0.06] pt-4">
          <p className="mb-3 text-xs text-white/40">{product.pricing}</p>
          <Link
            href={product.cta.href}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 py-2 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] transition hover:border-[var(--arc-brand-atlantean-teal)]/40 hover:bg-[var(--arc-brand-atlantean-teal)]/20"
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
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      {/* Background effects — premium floating orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -left-40 top-20 h-[550px] w-[550px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.04] blur-[160px] animate-[breathe_8s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-60 h-[450px] w-[450px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/[0.04] blur-[140px] animate-[breathe_10s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-[var(--arc-brand-arcanean-gold)]/[0.03] blur-[130px] animate-[breathe_12s_ease-in-out_infinite_4s]" />
      </div>

      {/* Dot grid texture */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.02]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="mb-24 text-center">
          <p className="mb-5 text-[11px] font-mono uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/60">
            Arcanea Products
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Infrastructure for the
            <br />
            <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">
              Agent Economy
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/40 leading-relaxed font-body">
            Memory. Skills. Identity. Creative APIs. World Engine. One platform.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] px-7 py-3.5 text-sm font-semibold text-[var(--arc-cosmic-void)] transition hover:shadow-[0_0_40px_rgba(127,255,212,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <CopyCommandBlock command="npx @arcanea/cli init" />
          </div>

          {/* Trust metrics */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mt-14">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6">
                {i > 0 && <span className="w-px h-4 bg-white/[0.06]" />}
                <div className="text-center">
                  <span className="text-lg font-display font-bold bg-gradient-to-b from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent">{stat.value}</span>
                  <span className="text-[10px] text-white/25 ml-1.5 font-mono uppercase tracking-wider">{stat.label}</span>
                </div>
              </div>
            ))}
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

        {/* ── Bottom CTA ────────────────────────────────────────────── */}
        <section className="text-center py-16">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/10 via-[var(--arc-void)]/8 to-[var(--arc-brand-arcanean-gold)]/10" />
            <div className="absolute inset-0 bg-white/[0.02]" />
            <div className="relative p-12 md:p-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.02em]">
                One command. Everything your agent needs.
              </h2>
              <p className="text-base text-white/40 mb-8 max-w-lg mx-auto">
                Memory, skills, identity, creative APIs — all wired up and ready to go.
              </p>
              <div className="flex justify-center mb-4">
                <CopyCommandBlock command="npx @arcanea/cli init" />
              </div>
              <p className="mt-6 text-[11px] font-mono text-white/20 tracking-wider">
                Free to start. Scale as you grow. MIT licensed.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
