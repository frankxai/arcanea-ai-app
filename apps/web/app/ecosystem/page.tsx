/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import Link from "next/link";
import { SplitText } from "@/components/motion/split-text";
import { LiquidGlass } from "@/components/motion/liquid-glass";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { LayerCards } from "./layer-cards";
import { EcosystemViews } from "./ecosystem-views";
import {
  FloatingOrbs,
  GridTexture,
  AuroraGradient,
  StatCard,
  SovereigntyBadge,
} from "@/components/premium";
import {
  PUBLIC_PACKAGE_NAMES,
  PUBLIC_REPOS,
  PUBLIC_REPO_SUMMARY,
  type PublicRepo,
  type PublicRepoGroup,
  type PublicRepoStatus,
} from "@/lib/public-repo-registry";

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
  { value: String(PUBLIC_REPO_SUMMARY.active), label: "Active Repos" },
  { value: String(PUBLIC_REPO_SUMMARY.public), label: "Public on GitHub" },
  { value: String(PUBLIC_REPO_SUMMARY.unresolved), label: "Needs Verification" },
  { value: "80+", label: "Agent Skills" },
];

const LAYERS = [
  {
    title: "arcanea.ai",
    subtitle: "The Product",
    accent: "var(--arc-brand-atlantean-teal)",
    description: "Next.js 16, React 19, Vercel. The creative surface where users chat, imagine, build worlds, and publish.",
    stats: ["181 pages", "12 AI models", "13 configured Luminors", "6 product layers"],
    features: ["Chat & Imagine", "Studio & Worlds", "Gallery & Feed", "Academy & Library"],
  },
  {
    title: "Intelligence Layer",
    subtitle: "The Brain",
    accent: "var(--arc-brand-cosmic-blue)",
    description: "Multi-model orchestration, persistent memory, agent coordination, and repo-level context.",
    stats: ["SIS substrate", "MCP adapters", "release-triggered sync", "manual harness sync"],
    features: ["starlight-intelligence-system", "starlight", "oh-my-arcanea", "arcanea-orchestrator"],
  },
  {
    title: "Open Source",
    subtitle: "The Ecosystem",
    accent: "var(--arc-brand-arcanean-gold)",
    description: "The public repos are forkable. Private production and unresolved historical entries are labeled instead of linked.",
    stats: [`${PUBLIC_REPO_SUMMARY.public} public repos`, `${PUBLIC_REPO_SUMMARY.private} private repo`, `${PUBLIC_REPO_SUMMARY.unresolved} unresolved`, `${PUBLIC_REPO_SUMMARY.upstream} upstream dependency`],
    features: ["arcanea", "oh-my-arcanea", "arcanea-code", "arcanea-vault"],
  },
];

const GROUP_LABELS: Record<PublicRepoGroup, { category: string; accent: string }> = {
  core: { category: "Core Platform", accent: "var(--arc-brand-atlantean-teal)" },
  intelligence: { category: "Intelligence", accent: "var(--arc-brand-cosmic-blue)" },
  tools: { category: "Tools & Harnesses", accent: "var(--arc-brand-arcanean-gold)" },
  protocol: { category: "Protocol & Adoption", accent: "var(--arc-water)" },
  archive: { category: "Needs Verification", accent: "var(--arc-fire)" },
  upstream: { category: "Upstream Runtime", accent: "var(--arc-void)" },
};

const GROUP_ORDER: PublicRepoGroup[] = ["core", "intelligence", "tools", "protocol", "archive", "upstream"];

const REPO_GROUPS: { category: string; accent: string; repos: PublicRepo[] }[] = GROUP_ORDER.map((group) => ({
  ...GROUP_LABELS[group],
  repos: PUBLIC_REPOS.filter((repo) => repo.group === group),
})).filter((group) => group.repos.length > 0);

const PACKAGE_DESCRIPTIONS: Record<string, string> = {
  "@arcanea/core": "Foundation types, constants, and shared runtime utilities",
  "@arcanea/aios": "AI operating-system primitives referenced by the OSS framework",
  "@arcanea/sdk": "Public SDK surface for Arcanea integrations",
  "@arcanea/starlight-intelligence-system": "Shared SIS substrate package",
  "@arcanea/mcp": "Historical MCP package reference; repo URL needs verification",
  "@arcanea/memory-mcp": "Historical memory package reference; likely superseded by SIS",
  "@claude-flow/cli": "Upstream orchestration CLI consumed as an external runtime",
};

const PACKAGES = PUBLIC_PACKAGE_NAMES.map((name) => ({
  name,
  desc: PACKAGE_DESCRIPTIONS[name] ?? "Package reference from the repo registry",
}));

const STATUS_COLORS: Record<PublicRepoStatus, string> = {
  public: "var(--arc-brand-atlantean-teal)",
  private: "var(--arc-brand-arcanean-gold)",
  beta: "var(--arc-brand-arcanean-gold)",
  unresolved: "var(--arc-fire)",
  upstream: "var(--arc-void)",
};

const FLOW_STEPS = [
  { label: "User", sub: "Chat, Imagine, Studio", color: "var(--arc-brand-atlantean-teal)" },
  { label: "arcanea.ai", sub: "Next.js 16 + React 19", color: "var(--arc-brand-atlantean-teal)" },
  { label: "Supabase", sub: "Worlds, credits, auth", color: "var(--arc-wind)" },
  { label: "AI APIs", sub: "Gemini, Claude, Grok", color: "var(--arc-brand-cosmic-blue)" },
  { label: "SIS", sub: "Memory and context substrate", color: "var(--arc-void)" },
  { label: "oh-my-arcanea", sub: "Manual harness sync", color: "var(--arc-brand-cosmic-blue)" },
  { label: "GitHub", sub: `${PUBLIC_REPO_SUMMARY.public} public repos`, color: "var(--arc-brand-arcanean-gold)" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EcosystemHubPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
        <FloatingOrbs preset="aurora" className="fixed" />
        <AuroraGradient />
        <GridTexture variant="dots" opacity={0.018} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] px-8 py-16 sm:px-14 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/8 via-transparent to-[var(--arc-brand-cosmic-blue)]/6 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--arc-brand-atlantean-teal)]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--arc-brand-arcanean-gold)]/4 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="mb-6">
                <SovereigntyBadge />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 mb-8">
                <IconGitBranch className="w-4 h-4 text-[var(--arc-brand-atlantean-teal)]" />
                <span className="text-xs font-mono tracking-widest uppercase text-[var(--arc-brand-atlantean-teal)]">Ecosystem Hub</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight tracking-tight">
                <SplitText as="span" text={`${PUBLIC_REPO_SUMMARY.public} public repos.`} className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent" delay={0.1} stagger={0.04} />
                {" "}
                <SplitText as="span" text="One ecosystem." className="text-white" delay={0.5} stagger={0.04} />
              </h1>

              <p className="text-lg text-white/50 leading-relaxed max-w-2xl mb-10">
                {PUBLIC_REPO_SUMMARY.active} active Arcanea repos are tracked in the registry.
                {` ${PUBLIC_REPO_SUMMARY.public}`} are public on GitHub today, {PUBLIC_REPO_SUMMARY.private} is private,
                and {PUBLIC_REPO_SUMMARY.unresolved} historical entries need verification before we link them.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                {STATS.map((s, i) => (
                  <StatCard
                    key={s.label}
                    value={s.value}
                    label={s.label}
                    color={i % 2 === 0 ? "var(--arc-brand-atlantean-teal)" : "var(--arc-brand-atlantean-teal)"}
                    delay={i * 0.08}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Magnetic>
                  <a href="https://github.com/frankxai/arcanea" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--arc-brand-atlantean-teal)] text-black font-semibold hover:brightness-110 transition-all">
                    <IconGitBranch className="w-4 h-4" /> View on GitHub
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link href="/developers" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                    Developer Docs <IconArrow className="w-4 h-4" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="mb-16 h-px bg-gradient-to-r from-transparent via-[var(--arc-brand-atlantean-teal)]/20 to-transparent" />

      {/* ── Connected Map (interactive views) ────────────────────────── */}
      <section className="mb-20" aria-labelledby="map-heading">
        <div className="mb-8">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">The Connected Map</p>
          <h2 id="map-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">Explore the ecosystem</h2>
          <p className="text-white/40 text-sm mt-1 max-w-2xl">
            Three views into the same 35-node graph: <span className="text-white/60">Layered</span> (substrate → product → surface), <span className="text-white/60">Ten Gates</span> (canonical mythology arrangement), and <span className="text-white/60">Arc ⊕ Nea</span> (sovereign / specialization hemispheres). Filter by status, hemisphere, or gate. Click any node to see what it consumes, who consumes it, and where to reach it.
          </p>
        </div>

        <EcosystemViews />
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="mb-20 h-px bg-gradient-to-r from-transparent via-[var(--arc-brand-atlantean-teal)]/20 to-transparent" />

        {/* ── Architecture Overview ────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="arch-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Architecture</p>
            <h2 id="arch-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">The Three-Layer Stack</h2>
            <p className="text-white/40 text-sm mt-1">Product, intelligence, and open source — each layer powers the next.</p>
          </div>

          <LayerCards layers={LAYERS} />
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="mb-20 h-px bg-gradient-to-r from-transparent via-[var(--arc-brand-atlantean-teal)]/15 to-transparent" />

        {/* ── Repository Map ───────────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="repos-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Open Source</p>
            <h2 id="repos-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">Repository Map</h2>
            <p className="text-white/40 text-sm mt-1 max-w-xl">
              Registry-derived map from <code className="font-mono text-white/45">.arcanea/config/repos.json</code>. Public links resolve; private and unresolved repos are labeled.
            </p>
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
                    <LiquidGlass key={repo.name} intensity="subtle" tint={group.accent} className="rounded-xl border border-white/[0.06] hover:border-white/[0.14] transition-colors" noise={false}>
                    {repo.url ? (
                    <a href={repo.url} target={repo.url.startsWith("http") ? "_blank" : undefined} rel={repo.url.startsWith("http") ? "noopener noreferrer" : undefined} className="group/card block relative p-5">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs text-white font-medium group-hover/card:text-[var(--arc-brand-atlantean-teal)] transition-colors truncate mr-2">{repo.name}</span>
                        <IconExternal className="w-3 h-3 text-white/20 shrink-0 mt-0.5" />
                      </div>
                      <p className="text-[11px] text-white/35 leading-relaxed mb-3">{repo.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[10px] text-white/25">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `${group.accent}80` }} />{repo.language}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: STATUS_COLORS[repo.status], backgroundColor: `${STATUS_COLORS[repo.status]}10` }}>{repo.status}</span>
                      </div>
                    </a>
                    ) : (
                    <div className="relative p-5">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs text-white font-medium truncate mr-2">{repo.name}</span>
                      </div>
                      <p className="text-[11px] text-white/35 leading-relaxed mb-3">{repo.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[10px] text-white/25">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `${group.accent}80` }} />{repo.language}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: STATUS_COLORS[repo.status], backgroundColor: `${STATUS_COLORS[repo.status]}10` }}>{repo.status}</span>
                      </div>
                    </div>
                    )}
                    </LiquidGlass>
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
            <p className="text-white/40 text-sm mt-1">
              Package references declared by the tracked repos. Historical packages stay labeled until their repo links are verified.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className="relative rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all p-5">
                <div className="flex items-center gap-2 mb-2">
                  <IconPackage className="w-3.5 h-3.5 text-[var(--arc-brand-arcanean-gold)]/60" />
                  <span className="font-mono text-xs text-[var(--arc-brand-arcanean-gold)] font-medium">{pkg.name}</span>
                </div>
                <p className="text-[11px] text-white/35 leading-relaxed mb-3">{pkg.desc}</p>
                <div className="font-mono text-[10px] text-white/20 bg-white/[0.03] rounded-md px-3 py-1.5 select-all">
                  pnpm add {pkg.name}
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
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/5 via-transparent to-[var(--arc-brand-arcanean-gold)]/4 pointer-events-none" />

            <div className="relative max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--arc-brand-arcanean-gold)]/30 bg-[var(--arc-brand-arcanean-gold)]/10 mb-8">
                <IconTerminal className="w-4 h-4 text-[var(--arc-brand-arcanean-gold)]" />
                <span className="text-xs font-mono tracking-widest uppercase text-[var(--arc-brand-arcanean-gold)]">For Developers</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                Fork the framework.<br />Build your own world.
              </h2>

              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                Install the Arcanea harness from the public framework repo. Skills and agents are evolving; the registry marks what is active, beta, or unresolved.
              </p>

              {/* Install command */}
              <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-6 py-3 mb-10">
                <span className="text-[var(--arc-brand-atlantean-teal)] font-mono text-sm">$</span>
                <code className="font-mono text-sm text-white/70 select-all">npx arcanea init</code>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/developers" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--arc-brand-atlantean-teal)] text-black font-semibold hover:brightness-110 transition-all">
                  API Documentation <IconArrow className="w-4 h-4" />
                </Link>
                <a href="https://github.com/frankxai/arcanea" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                  <IconGitBranch className="w-4 h-4" /> Contribute on GitHub
                </a>
                <Link href="/developers" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                  Developer Docs <IconArrow className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
