import Link from "next/link";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function IconGitBranch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function IconExternal({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconArrow({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconPackage({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconTerminal({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "27", label: "Repositories" },
  { value: "43", label: "NPM Packages" },
  { value: "80+", label: "Agent Skills" },
  { value: "200K+", label: "Words of Lore" },
];

const LAYERS = [
  {
    title: "arcanea.ai",
    subtitle: "The Product",
    accent: "#7fffd4",
    description: "Next.js 16, React 19, Vercel. The creative surface where users chat, imagine, build worlds, and publish.",
    stats: ["181 pages", "12 AI models", "16 Luminor personalities", "6 product layers"],
    features: ["Chat & Imagine", "Studio & Worlds", "Gallery & Feed", "Academy & Library"],
  },
  {
    title: "Intelligence Layer",
    subtitle: "The Brain",
    accent: "#78a6ff",
    description: "Multi-model orchestration, persistent memory, agent coordination, and Guardian routing.",
    stats: ["34 MCP tools", "HNSW vector search", "150x retrieval speedup", "7 RL algorithms"],
    features: ["arcanea-mcp", "arcanea-memory", "arcanea-flow", "Starlight Intelligence"],
  },
  {
    title: "Open Source",
    subtitle: "The Ecosystem",
    accent: "#ffd700",
    description: "Everything is forkable. Build your own world on top of the Arcanea framework.",
    stats: ["43 npm packages", "80+ skills", "20+ agent types", "5 harness overlays"],
    features: ["oh-my-arcanea", "claude-code-oracle-skills", "arcanea-skills-opensource", "arcanea-opencode"],
  },
];

interface Repo {
  name: string;
  desc: string;
  lang: string;
  status: "active" | "stable" | "experimental";
}

const REPO_GROUPS: { category: string; accent: string; repos: Repo[] }[] = [
  {
    category: "Core Platform",
    accent: "#7fffd4",
    repos: [
      { name: "arcanea-ai-app", desc: "The main platform -- Next.js 16, Supabase, Vercel AI SDK", lang: "TypeScript", status: "active" },
      { name: "arcanea", desc: "OSS mirror -- framework, lore, canonical reference", lang: "TypeScript", status: "active" },
    ],
  },
  {
    category: "Intelligence",
    accent: "#78a6ff",
    repos: [
      { name: "arcanea-mcp", desc: "Model Context Protocol server -- 34 tools for world intelligence", lang: "TypeScript", status: "active" },
      { name: "arcanea-memory-mcp", desc: "Persistent memory vault with HNSW vector search", lang: "TypeScript", status: "active" },
      { name: "arcanea-flow", desc: "Luminor-powered multi-agent orchestration engine", lang: "TypeScript", status: "active" },
      { name: "arcanea-orchestrator", desc: "Guardian routing, session continuity, model selection", lang: "TypeScript", status: "stable" },
    ],
  },
  {
    category: "Content & Companions",
    accent: "#a855f7",
    repos: [
      { name: "arcanea-luminor", desc: "16 Luminor personality kernels with domain expertise", lang: "TypeScript", status: "active" },
      { name: "arcanea-infogenius", desc: "Research synthesis agent -- web search, analysis, reporting", lang: "Python", status: "stable" },
      { name: "arcanea-companion", desc: "AI companion framework with personality and relationship tracking", lang: "TypeScript", status: "stable" },
      { name: "arcanea-soul", desc: "Core AI personality engine beneath every companion", lang: "TypeScript", status: "stable" },
    ],
  },
  {
    category: "Tools & Harnesses",
    accent: "#ffd700",
    repos: [
      { name: "oh-my-arcanea", desc: "Canonical Claude Code harness -- 54 skills, hooks, agents", lang: "TypeScript", status: "active" },
      { name: "claude-code-oracle-skills", desc: "Oracle Cloud + enterprise AI skill pack", lang: "TypeScript", status: "stable" },
      { name: "arcanea-opencode", desc: "TUI buddy with free model routing (MiniMax, R1, Gemini)", lang: "TypeScript", status: "experimental" },
      { name: "arcanea-skills-opensource", desc: "Community skill registry -- fork and extend", lang: "TypeScript", status: "active" },
    ],
  },
  {
    category: "Creative & Blockchain",
    accent: "#ff6b6b",
    repos: [
      { name: "arcanea-records", desc: "Music studio -- AI composition with Suno integration", lang: "TypeScript", status: "stable" },
      { name: "ArcaneaClaw", desc: "Media engine -- NFT generation, art pipelines, 60+ platforms", lang: "TypeScript", status: "active" },
      { name: "arcanea-onchain", desc: "On-chain IP protection -- NFT minting on Base, Story Protocol", lang: "Solidity", status: "experimental" },
    ],
  },
];

const PACKAGES = [
  { name: "@arcanea/core", desc: "Foundation types, constants, and utilities" },
  { name: "@arcanea/ai-core", desc: "Multi-model provider abstraction layer" },
  { name: "@arcanea/skill-registry", desc: "Skill discovery, loading, and execution" },
  { name: "@arcanea/guardian-memory", desc: "Per-Guardian persistent memory with HNSW" },
  { name: "@arcanea/flow-engine", desc: "Agent orchestration and swarm coordination" },
  { name: "@arcanea/creative-pipeline", desc: "Image, music, and story generation pipelines" },
  { name: "@arcanea/content-api", desc: "Library content loader and search" },
  { name: "@arcanea/prompt-books", desc: "Curated prompt collections per domain" },
  { name: "@arcanea/swarm-coordinator", desc: "Byzantine fault-tolerant consensus" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "#7fffd4",
  stable: "#78a6ff",
  experimental: "#ffd700",
};

const FLOW_STEPS = [
  { label: "User", sub: "Chat, Imagine, Studio", color: "#7fffd4" },
  { label: "arcanea.ai", sub: "Next.js 16 + React 19", color: "#7fffd4" },
  { label: "Supabase", sub: "Worlds, credits, auth", color: "#3ecf8e" },
  { label: "AI APIs", sub: "Gemini, Claude, Grok", color: "#78a6ff" },
  { label: "arcanea-mcp", sub: "34 tools, world intelligence", color: "#a855f7" },
  { label: "arcanea-memory", sub: "HNSW vector vault", color: "#78a6ff" },
  { label: "AgentDB", sub: "Similarity search, RL", color: "#ffd700" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EcosystemHubPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.06),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.04),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] px-8 py-16 sm:px-14 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/8 via-transparent to-[#78a6ff]/6 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#7fffd4]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ffd700]/4 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/30 bg-[#7fffd4]/10 mb-8">
                <IconGitBranch className="w-4 h-4 text-[#7fffd4]" />
                <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">Ecosystem Hub</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-white">
                The Arcanea Ecosystem
                <span className="block bg-gradient-to-r from-[#7fffd4] via-[#78a6ff] to-[#ffd700] bg-clip-text text-transparent">
                  One creative multiverse.
                </span>
              </h1>

              <p className="text-lg text-white/50 leading-relaxed max-w-2xl mb-10">
                27 repos. 43 packages. 80+ skills. From multi-model intelligence
                to mythology-aligned AI personas — everything is open, connected,
                and ready to fork.
              </p>

              <div className="flex flex-wrap gap-8 mb-10">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-display font-bold text-[#7fffd4]">{s.value}</p>
                    <p className="text-xs font-mono text-white/30 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="https://github.com/frankxai/arcanea" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-black font-semibold hover:brightness-110 transition-all">
                  <IconGitBranch className="w-4 h-4" /> View on GitHub
                </a>
                <Link href="/developers" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                  Developer Docs <IconArrow className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Architecture Overview ────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="arch-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Architecture</p>
            <h2 id="arch-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">The Three-Layer Stack</h2>
            <p className="text-white/40 text-sm mt-1">Product, intelligence, and open source — each layer powers the next.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {LAYERS.map((layer) => (
              <div key={layer.title} className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all p-6 sm:p-8">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${layer.accent}08, transparent 70%)` }} />
                <div className="relative">
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: `${layer.accent}99` }}>{layer.subtitle}</p>
                  <h3 className="text-xl font-display font-bold mb-3" style={{ color: layer.accent }}>{layer.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-5">{layer.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {layer.stats.map((s) => (
                      <div key={s} className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                        <p className="text-[11px] text-white/50 font-mono">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.features.map((f) => (
                      <span key={f} className="text-[10px] font-mono px-2.5 py-1 rounded-full border" style={{ color: `${layer.accent}cc`, borderColor: `${layer.accent}30`, backgroundColor: `${layer.accent}08` }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Repository Map ───────────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="repos-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Open Source</p>
            <h2 id="repos-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">Repository Map</h2>
            <p className="text-white/40 text-sm mt-1 max-w-xl">27 repositories across five domains — all interconnected, all forkable.</p>
          </div>

          <div className="space-y-10">
            {REPO_GROUPS.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.accent }} />
                  <h3 className="text-sm font-mono uppercase tracking-widest font-semibold" style={{ color: group.accent }}>{group.category}</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {group.repos.map((repo) => (
                    <a key={repo.name} href={`https://github.com/frankxai/${repo.name}`} target="_blank" rel="noopener noreferrer" className="group/card relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all p-5">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs text-white font-medium group-hover/card:text-[#7fffd4] transition-colors truncate mr-2">{repo.name}</span>
                        <IconExternal className="w-3 h-3 text-white/20 shrink-0 mt-0.5" />
                      </div>
                      <p className="text-[11px] text-white/35 leading-relaxed mb-3">{repo.desc}</p>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[10px] text-white/25">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `${group.accent}80` }} />{repo.lang}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: STATUS_COLORS[repo.status], backgroundColor: `${STATUS_COLORS[repo.status]}10` }}>{repo.status}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Package Registry ─────────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="packages-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">NPM Registry</p>
            <h2 id="packages-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">Package Registry</h2>
            <p className="text-white/40 text-sm mt-1">43 packages under the @arcanea scope. Install any piece independently.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className="relative rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all p-5">
                <div className="flex items-center gap-2 mb-2">
                  <IconPackage className="w-3.5 h-3.5 text-[#ffd700]/60" />
                  <span className="font-mono text-xs text-[#ffd700] font-medium">{pkg.name}</span>
                </div>
                <p className="text-[11px] text-white/35 leading-relaxed mb-3">{pkg.desc}</p>
                <div className="font-mono text-[10px] text-white/20 bg-white/[0.03] rounded-md px-3 py-1.5 select-all">
                  npm i {pkg.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── System Flow ──────────────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="flow-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Data Flow</p>
            <h2 id="flow-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">How Systems Connect</h2>
            <p className="text-white/40 text-sm mt-1">Every request flows through the full intelligence stack.</p>
          </div>

          <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 sm:p-10 overflow-x-auto">
            {/* Horizontal flow */}
            <div className="flex items-center gap-0 min-w-[800px]">
              {FLOW_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center text-center w-[110px]">
                    <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-2" style={{ borderColor: `${step.color}40`, backgroundColor: `${step.color}10` }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: step.color, boxShadow: `0 0 12px ${step.color}60` }} />
                    </div>
                    <p className="text-xs font-display font-semibold" style={{ color: step.color }}>{step.label}</p>
                    <p className="text-[9px] text-white/30 mt-0.5 leading-tight">{step.sub}</p>
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="flex-1 min-w-[20px] h-px mx-1" style={{ background: `linear-gradient(to right, ${step.color}40, ${FLOW_STEPS[i + 1].color}40)` }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── For Developers ───────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.06] px-8 py-14 sm:px-14">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#ffd700]/4 pointer-events-none" />

            <div className="relative max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 mb-8">
                <IconTerminal className="w-4 h-4 text-[#ffd700]" />
                <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">For Developers</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                Fork the framework.<br />Build your own world.
              </h2>

              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                Install the Arcanea harness in 30 seconds. Get 54 skills, Guardian intelligence, and a full creative pipeline out of the box.
              </p>

              {/* Install command */}
              <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-6 py-3 mb-10">
                <span className="text-[#7fffd4] font-mono text-sm">$</span>
                <code className="font-mono text-sm text-white/70 select-all">npx arcanea init</code>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/developers" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-black font-semibold hover:brightness-110 transition-all">
                  API Documentation <IconArrow className="w-4 h-4" />
                </Link>
                <a href="https://github.com/frankxai/arcanea" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                  <IconGitBranch className="w-4 h-4" /> Contribute on GitHub
                </a>
                <Link href="/architecture" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                  Architecture Diagrams <IconArrow className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
