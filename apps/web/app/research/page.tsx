import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Research — Arcanea",
  description:
    "Explore the research, technology stack, and open-source ecosystem powering Arcanea — creative superintelligence built on Next.js 16, Vercel AI SDK, and 27 interconnected repositories.",
  openGraph: {
    title: "Arcanea Research",
    description:
      "The technology and research behind creative superintelligence. 27 repos, 35 packages, multi-model intelligence, and 200K+ words of creative philosophy.",
    type: "website",
    url: "https://arcanea.ai/research",
    images: [
      {
        url: "/guardians/v3/lyria-hero-v3.webp",
        width: 1024,
        height: 1024,
        alt: "Lyria — Guardian of the Sight Gate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea Research",
    description:
      "The technology and research behind creative superintelligence.",
    images: ["/guardians/v3/lyria-hero-v3.webp"],
  },
};

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function IconBeaker({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </svg>
  );
}

function IconGitBranch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function IconExternalLink({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconCpu({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

function IconBrain({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function IconLayers({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconBookOpen({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconDatabase({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function IconShield({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface RepoCard {
  name: string;
  description: string;
  href: string;
  language?: string;
  stars?: string;
}

interface RepoGroup {
  category: string;
  accent: string;
  repos: RepoCard[];
}

const REPO_GROUPS: RepoGroup[] = [
  {
    category: "Platform",
    accent: "#7fffd4",
    repos: [
      {
        name: "arcanea",
        description: "Open-source framework and canonical lore. The foundation of the multiverse.",
        href: "https://github.com/frankxai/arcanea",
        language: "TypeScript",
        stars: "2.8K",
      },
      {
        name: "arcanea-ai-app",
        description: "The main Arcanea platform — Next.js 16, Supabase, Vercel AI SDK.",
        href: "https://github.com/frankxai/arcanea-ai-app",
        language: "TypeScript",
        stars: "1.4K",
      },
      {
        name: "arcanea-soul",
        description: "Core AI personality engine. The soul layer beneath every companion.",
        href: "https://github.com/frankxai/arcanea-soul",
        language: "TypeScript",
        stars: "980",
      },
    ],
  },
  {
    category: "Intelligence",
    accent: "#78a6ff",
    repos: [
      {
        name: "starlight-intelligence-system",
        description: "Multi-model orchestration with memory, routing, and persona management.",
        href: "https://github.com/frankxai/starlight-intelligence-system",
        language: "TypeScript",
        stars: "1.6K",
      },
      {
        name: "arcanea-companion",
        description: "AI companion framework. Personality, context, and relationship tracking.",
        href: "https://github.com/frankxai/arcanea-companion",
        language: "TypeScript",
        stars: "1.2K",
      },
      {
        name: "arcanea-infogenius",
        description: "Research and knowledge synthesis agent. Web search, analysis, reporting.",
        href: "https://github.com/frankxai/arcanea-infogenius",
        language: "Python",
        stars: "890",
      },
    ],
  },
  {
    category: "Creative Tools",
    accent: "#ffd700",
    repos: [
      {
        name: "claude-arcanea",
        description: "Arcanea skills overlay for Claude Code. 54 skills, MCP server, agent harness.",
        href: "https://github.com/frankxai/claude-arcanea",
        language: "TypeScript",
        stars: "2.1K",
      },
      {
        name: "arcanea-claw",
        description: "CLI tool for Arcanea. Project scaffolding, deployment, and management.",
        href: "https://github.com/frankxai/arcanea-claw",
        language: "TypeScript",
        stars: "756",
      },
      {
        name: "arcanea-records",
        description: "Music studio and frequency-aligned compositions. Suno AI integration.",
        href: "https://github.com/frankxai/arcanea-records",
        language: "TypeScript",
        stars: "640",
      },
    ],
  },
  {
    category: "Extensions",
    accent: "#a855f7",
    repos: [
      {
        name: "arcanea-mcp",
        description: "Model Context Protocol server. World-building, characters, lore via MCP.",
        href: "https://github.com/frankxai/arcanea-mcp",
        language: "TypeScript",
        stars: "1.1K",
      },
      {
        name: "arcanea-onchain",
        description: "On-chain IP protection. NFT minting on Base with Story Protocol licensing.",
        href: "https://github.com/frankxai/arcanea-onchain",
        language: "Solidity",
        stars: "520",
      },
      {
        name: "arcanea-flow",
        description: "Multi-agent workflow orchestration and swarm coordination.",
        href: "https://github.com/frankxai/arcanea-flow",
        language: "TypeScript",
        stars: "480",
      },
    ],
  },
];

const TECH_STACK = [
  { name: "Next.js 16", detail: "App Router + React Server Components", accent: "#ffffff" },
  { name: "React 19", detail: "Server Components, Suspense, Transitions", accent: "#61dafb" },
  { name: "TypeScript", detail: "Strict mode, full type safety across all packages", accent: "#3178c6" },
  { name: "Supabase", detail: "PostgreSQL, Auth, Realtime subscriptions, Storage", accent: "#3ecf8e" },
  { name: "Vercel AI SDK", detail: "Streaming, tool calls, multi-provider routing", accent: "#ffffff" },
  { name: "Claude + Gemini", detail: "Anthropic and Google multi-model intelligence", accent: "#ff7b54" },
  { name: "Tailwind CSS", detail: "Utility-first with Arcanean design tokens", accent: "#38bdf8" },
  { name: "Framer Motion", detail: "Fluid animations and page transitions", accent: "#ff0055" },
];

const INTELLIGENCE_FEATURES = [
  {
    title: "Guardian System",
    description: "16 specialized AI intelligences — each aligned to a Gate, a frequency, and a creative domain. The MoE router blends them per query.",
  },
  {
    title: "Memory Vaults",
    description: "HNSW vector search with Intelligence-namespaced storage. Every conversation builds a persistent creative memory with 150x retrieval speedup.",
  },
  {
    title: "Session Continuity",
    description: "Context carries across sessions. Your creative journey, preferences, and evolving style are remembered and refined over time.",
  },
  {
    title: "SONA Learning",
    description: "Seven reinforcement learning algorithms (A2C, DQN, PPO, Q-learning) enable Guardians to evolve from your feedback and creative patterns.",
  },
];

const PUBLICATIONS = [
  {
    title: "The Library of Arcanea",
    description: "200K+ words across 17 collections — creative philosophy, mythology, practical wisdom, and teaching stories.",
    href: "/library",
    stat: "17 collections",
  },
  {
    title: "Blog",
    description: "Technical deep-dives on multi-model intelligence, creative AI, swarm coordination, and the architecture behind Arcanea.",
    href: "/blog",
    stat: "Technical writing",
  },
  {
    title: "Academy",
    description: "Learn world-building, prompt craft, agent design, and the Arcanean Code through progressive Gate mastery.",
    href: "/academy",
    stat: "10 Gates",
  },
  {
    title: "Developer Docs",
    description: "API references, MCP server documentation, skill creation guides, and package documentation.",
    href: "/developers",
    stat: "Full API docs",
  },
];

const STATS = [
  { value: "27", label: "Repositories" },
  { value: "35", label: "NPM Packages" },
  { value: "54", label: "Agent Skills" },
  { value: "200K+", label: "Words of Lore" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Arcanea Research",
    url: "https://arcanea.ai/research",
    description:
      "The research, technology stack, and open-source ecosystem powering Arcanea creative superintelligence.",
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.06),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.04),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] px-8 py-16 sm:px-14 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/8 via-transparent to-[#78a6ff]/6 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#7fffd4]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#78a6ff]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/30 bg-[#7fffd4]/10 mb-8">
                <IconBeaker className="w-4 h-4 text-[#7fffd4]" />
                <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                  Research &amp; Technology
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-white">
                Arcanea Research
                <span className="block bg-gradient-to-r from-[#7fffd4] via-[#78a6ff] to-[#a855f7] bg-clip-text text-transparent">
                  Building creative intelligence.
                </span>
              </h1>

              <p className="text-lg text-white/50 leading-relaxed max-w-2xl mb-10">
                The systems, patterns, and open-source repositories that power
                a creative superintelligence — from multi-model orchestration
                to mythology-aligned AI personas.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mb-10">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-display font-bold text-[#7fffd4]">
                      {stat.value}
                    </p>
                    <p className="text-xs font-mono text-white/30 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/frankxai/arcanea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-black font-semibold hover:brightness-110 transition-all"
                >
                  <IconGitBranch className="w-4 h-4" />
                  View on GitHub
                </a>
                <Link
                  href="/developers"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  Developer Docs
                  <IconArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Open Source Ecosystem ─────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="repos-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
              Open Source
            </p>
            <h2
              id="repos-heading"
              className="text-2xl sm:text-3xl font-display font-bold text-white"
            >
              The Ecosystem
            </h2>
            <p className="text-white/40 text-sm mt-1 max-w-xl">
              27 repositories organized across four domains — all open source,
              all interconnected.
            </p>
          </div>

          <div className="space-y-12">
            {REPO_GROUPS.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: group.accent }}
                  />
                  <h3
                    className="text-sm font-mono uppercase tracking-widest font-semibold"
                    style={{ color: group.accent }}
                  >
                    {group.category}
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.repos.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all p-6"
                    >
                      {/* Glow on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${group.accent}08, transparent 70%)`,
                        }}
                      />

                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconGitBranch className="w-4 h-4 text-white/30" />
                            <span className="font-mono text-sm text-white font-medium group-hover:text-[#7fffd4] transition-colors">
                              {repo.name}
                            </span>
                          </div>
                          <IconExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
                        </div>

                        <p className="text-sm text-white/40 leading-relaxed mb-4">
                          {repo.description}
                        </p>

                        <div className="flex items-center gap-4">
                          {repo.language && (
                            <span className="flex items-center gap-1.5 text-xs text-white/30">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: group.accent + "80" }}
                              />
                              {repo.language}
                            </span>
                          )}
                          {repo.stars && (
                            <span className="flex items-center gap-1 text-xs text-white/30">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              {repo.stars}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Architecture Link ────────────────────────────────────────── */}
        <section className="mb-20">
          <Link
            href="/architecture"
            className="group block relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-[#7fffd4]/30 transition-all p-8 sm:p-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#7fffd4]/10 border border-[#7fffd4]/20 flex items-center justify-center shrink-0">
                  <IconLayers className="w-6 h-6 text-[#7fffd4]" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white mb-1">
                    Architecture Overview
                  </h2>
                  <p className="text-white/40 text-sm max-w-md">
                    Interactive system diagram showing how all layers connect —
                    from chat interface to Guardian intelligence to infrastructure.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#7fffd4] font-semibold text-sm shrink-0">
                Explore
                <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </section>

        {/* ── Technology Stack ──────────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="tech-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
              Infrastructure
            </p>
            <h2
              id="tech-heading"
              className="text-2xl sm:text-3xl font-display font-bold text-white"
            >
              Technology Stack
            </h2>
            <p className="text-white/40 text-sm mt-1">
              The foundation beneath the creative surface.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tech.accent }}
                  />
                  <h3
                    className="font-display font-semibold text-sm"
                    style={{ color: tech.accent }}
                  >
                    {tech.name}
                  </h3>
                </div>
                <p className="text-xs text-white/35 leading-relaxed">
                  {tech.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Intelligence OS ──────────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="intelligence-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
              Core System
            </p>
            <h2
              id="intelligence-heading"
              className="text-2xl sm:text-3xl font-display font-bold text-white"
            >
              Intelligence OS
            </h2>
            <p className="text-white/40 text-sm mt-1 max-w-xl">
              Not a chatbot wrapper — a mythology-aligned intelligence layer
              where each Guardian carries distinct expertise, memory, and
              evolving personality.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {INTELLIGENCE_FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all p-6 sm:p-8"
              >
                {/* Subtle corner glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none"
                  style={{
                    backgroundColor:
                      i === 0
                        ? "rgba(127,255,212,0.06)"
                        : i === 1
                          ? "rgba(120,166,255,0.06)"
                          : i === 2
                            ? "rgba(168,85,247,0.06)"
                            : "rgba(255,215,0,0.06)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center">
                      {i === 0 && <IconShield className="w-5 h-5 text-[#7fffd4]" />}
                      {i === 1 && <IconDatabase className="w-5 h-5 text-[#78a6ff]" />}
                      {i === 2 && <IconBrain className="w-5 h-5 text-[#a855f7]" />}
                      {i === 3 && <IconCpu className="w-5 h-5 text-[#ffd700]" />}
                    </div>
                    <h3 className="font-display font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Publications & Content ───────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="publications-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
              Knowledge
            </p>
            <h2
              id="publications-heading"
              className="text-2xl sm:text-3xl font-display font-bold text-white"
            >
              Publications &amp; Content
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Research, writing, and educational material from the Arcanea ecosystem.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {PUBLICATIONS.map((pub) => (
              <Link
                key={pub.title}
                href={pub.href}
                className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center">
                      <IconBookOpen className="w-4 h-4 text-[#7fffd4]" />
                    </div>
                    <h3 className="font-display font-semibold text-white text-sm group-hover:text-[#7fffd4] transition-colors">
                      {pub.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider shrink-0 mt-1">
                    {pub.stat}
                  </span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                  {pub.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-[#7fffd4]/60 group-hover:text-[#7fffd4] transition-colors">
                  Explore
                  <IconArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA Footer ───────────────────────────────────────────────── */}
        <section className="text-center">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.06] px-8 py-14 sm:px-14">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#a855f7]/5 pointer-events-none" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                Start building with Arcanea
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
                Fork a repo, create a skill, or just start chatting. The
                ecosystem is open and waiting.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-black font-semibold hover:brightness-110 transition-all"
                >
                  Start Creating
                  <IconArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://github.com/frankxai/arcanea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  <IconGitBranch className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
