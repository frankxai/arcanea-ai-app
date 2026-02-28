import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/navigation";
import {
  PhCode,
  PhTerminal,
  PhBracketsCurly,
  PhGitBranch,
  PhPackage,
  PhWrench,
  PhLightning,
  PhBug,
  PhRocket,
  PhArrowRight,
  PhChevronRight,
  PhSparkle,
} from '@/lib/phosphor-icons';

export const metadata: Metadata = {
  title: "Arcanea Code | Developer Platform & VS Code Extension",
  description:
    "Build with the Arcanea developer platform. TypeScript SDK, MCP tools, Guardian sidebar for VS Code, and 30+ specialized intelligence tools.",
  openGraph: {
    title: "Arcanea Code | Developer Platform",
    description:
      "Complete developer platform with TypeScript SDK, MCP server, and the Arcanea Guardian VS Code extension.",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

interface CodeFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

const FEATURES: CodeFeature[] = [
  {
    title: "CLI Tools",
    description:
      "Powerful command-line interface for scaffolding projects, running Guardian agents, and managing your Arcanea workspace from the terminal.",
    icon: <PhTerminal weight="thin" size={24} />,
    accent: "var(--color-creation-prism-purple)",
  },
  {
    title: "MCP Server",
    description:
      "Model Context Protocol server exposing 30+ specialized tools — memory search, Guardian invocation, lore queries, and intelligence routing.",
    icon: <PhPackage weight="thin" size={24} />,
    accent: "var(--color-atlantean-teal-aqua)",
  },
  {
    title: "TypeScript SDK",
    description:
      "Fully typed SDK with zero `any` types. Strict interfaces for every Guardian, Gate, and intelligence layer interaction.",
    icon: <PhBracketsCurly weight="thin" size={24} />,
    accent: "var(--color-gold-bright)",
  },
  {
    title: "Git Integration",
    description:
      "Arcanea-aware version control workflows. Commit hooks, branch naming conventions tied to Gates, and Guardian-reviewed pull requests.",
    icon: <PhGitBranch weight="thin" size={24} />,
    accent: "var(--color-draconic-crimson)",
  },
  {
    title: "Intelligence Packages",
    description:
      "9 published packages for council, evolution, memory, rituals, creative-pipeline, and more. Each one battle-tested with 3,000+ passing tests.",
    icon: <PhLightning weight="thin" size={24} />,
    accent: "var(--color-cosmic-blue)",
  },
  {
    title: "Developer Tooling",
    description:
      "Debug, profile, and deploy Arcanea applications. Built-in error boundaries, structured logging, and Vercel-ready output.",
    icon: <PhWrench weight="thin" size={24} />,
    accent: "var(--color-atlantean-flow-deep)",
  },
];

const QUICK_START = [
  {
    step: "01",
    title: "Install CLI",
    code: "npm install -g @arcanea/cli",
    note: "Requires Node 20+",
  },
  {
    step: "02",
    title: "Initialize Project",
    code: "arcanea init my-app",
    note: "Scaffolds with TypeScript, MCP, and Guardian config",
  },
  {
    step: "03",
    title: "Start Creating",
    code: "arcanea dev",
    note: "Dev server with hot-reload Guardian sidebar",
  },
];

const VSCODE_FEATURES = [
  "Guardian AI assistant panel — invoke any of the 10 Guardians inline",
  "`.arcanea` project config support — per-workspace Guardian presets",
  "Inline lore lookups — hover a Gate name to see its frequency and domain",
  "Code explanations in Guardian voice — right-click any function",
  "Diagnostic overlays powered by the Arcanea intelligence layer",
  "Install from `.vsix` or search VS Code Marketplace for 'Arcanea Realm'",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArcaneaCodePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        {/* Draconia — Fire Gate, forge of code and will */}
        <img
          src="/guardians/gallery/draconia-gallery-4.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none"
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at top right, color-mix(in srgb, var(--color-creation-prism-purple) 12%, transparent), transparent 55%), radial-gradient(ellipse at bottom left, color-mix(in srgb, var(--color-atlantean-teal-aqua) 8%, transparent), transparent 55%)",
          }}
        />
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-12 sm:px-12 sm:py-16">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--color-brand-primary) 12%, transparent), transparent 50%, color-mix(in srgb, var(--color-atlantean-teal-aqua) 10%, transparent))",
              }}
            />
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{
                background: "color-mix(in srgb, var(--color-brand-primary) 8%, transparent)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
              style={{
                background: "color-mix(in srgb, var(--color-atlantean-teal-aqua) 6%, transparent)",
              }}
            />

            <div className="relative max-w-3xl">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                style={{
                  borderColor: "color-mix(in srgb, var(--color-brand-primary) 30%, transparent)",
                  background: "color-mix(in srgb, var(--color-brand-primary) 10%, transparent)",
                }}
              >
                <PhCode weight="thin" size={16} className="text-brand-primary" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  Developer Platform
                </span>
              </div>

              <h1 className="text-fluid-3xl font-display font-bold mb-4">
                Build with
                <span className="block text-gradient-brand">Arcanea Code</span>
              </h1>

              <p className="text-text-secondary font-body text-lg leading-relaxed mb-8 max-w-2xl">
                A complete developer platform for building with the Arcanea
                intelligence layer. TypeScript
                SDK, 30+ MCP tools, intelligent Guardian agents, and a VS Code
                extension that puts the cosmos inside your editor.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/developers"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  Start Building
                  <PhArrowRight weight="thin" size={16} />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-atlantean-teal-aqua/30 transition-all duration-200"
                >
                  Read the Docs
                  <PhChevronRight weight="thin" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Start ──────────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="liquid-glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-2 text-center">
              Quick Start
            </h2>
            <p className="text-text-secondary text-sm text-center mb-8">
              From zero to Guardian-assisted dev in under two minutes.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {QUICK_START.map((item) => (
                <div key={item.step} className="relative">
                  <div
                    className="absolute -top-3 -left-3 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs font-mono"
                    style={{ background: "var(--color-brand-primary)" }}
                  >
                    {item.step}
                  </div>
                  <div className="pt-4 pl-2">
                    <h3 className="font-semibold text-text-primary mb-2 font-display">
                      {item.title}
                    </h3>
                    <code
                      className="block rounded-lg p-3 text-sm font-mono overflow-x-auto mb-2"
                      style={{
                        background: "color-mix(in srgb, var(--color-cosmic-void) 50%, transparent)",
                        color: "var(--color-atlantean-teal-aqua)",
                      }}
                    >
                      {item.code}
                    </code>
                    <p className="text-xs text-text-secondary">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ────────────────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="features-heading">
          <div className="mb-8">
            <h2
              id="features-heading"
              className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-2"
            >
              Developer Tools
            </h2>
            <h3 className="text-fluid-2xl font-display font-bold text-text-primary">
              Everything You Need to Build
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden hover-lift transition-all"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 30% 30%, color-mix(in srgb, ${feature.accent} 12%, transparent), transparent 65%)`,
                  }}
                />

                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `color-mix(in srgb, ${feature.accent} 15%, transparent)`,
                      color: feature.accent,
                    }}
                  >
                    {feature.icon}
                  </div>

                  <h4
                    className="font-display text-xl font-semibold mb-2 group-hover:opacity-90 transition-colors"
                    style={{ color: feature.accent }}
                  >
                    {feature.title}
                  </h4>

                  <p className="text-text-secondary text-sm leading-relaxed font-body">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── VS Code Extension ────────────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="vscode-heading">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-10 sm:px-12">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--color-atlantean-teal-aqua) 8%, transparent), transparent 60%)",
              }}
            />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--color-atlantean-teal-aqua) 30%, transparent)",
                    background:
                      "color-mix(in srgb, var(--color-atlantean-teal-aqua) 10%, transparent)",
                  }}
                >
                  <PhSparkle weight="thin" size={14} className="text-atlantean-teal-aqua" />
                  <span className="text-xs font-mono tracking-widest uppercase text-atlantean-teal-aqua">
                    VS Code Extension
                  </span>
                </div>

                <h2
                  id="vscode-heading"
                  className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-4"
                >
                  Arcanea Realm
                  <span className="block text-atlantean-teal-aqua">
                    inside your editor
                  </span>
                </h2>

                <p className="text-text-secondary font-body leading-relaxed mb-6">
                  The Arcanea Realm VS Code extension brings Guardian
                  intelligence directly into your development environment.
                  Available on the VS Code Marketplace and as a standalone
                  `.vsix` for air-gapped installs.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://marketplace.visualstudio.com/search?term=arcanea+realm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-atlantean-teal-aqua text-cosmic-deep font-semibold text-sm hover:scale-[1.02] transition-all"
                  >
                    Install from Marketplace
                    <PhArrowRight weight="thin" size={14} />
                  </Link>
                  <Link
                    href="/arcanea-vault"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold text-sm hover:border-atlantean-teal-aqua/30 transition-all"
                  >
                    Download .vsix
                    <PhChevronRight weight="thin" size={16} />
                  </Link>
                </div>
              </div>

              <ul className="space-y-3" aria-label="VS Code extension features">
                {VSCODE_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <span
                      className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--color-atlantean-teal-aqua)" }}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-text-secondary leading-relaxed font-body">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Quality Stats ────────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-3d liquid-glass rounded-2xl p-6 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "color-mix(in srgb, var(--color-brand-primary) 20%, transparent)",
                  color: "var(--color-brand-primary)",
                }}
              >
                <PhLightning weight="thin" size={24} />
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Lightning Fast
              </h3>
              <p className="text-text-secondary text-sm font-body">
                Tier-1 WASM agent booster handles simple transforms in under
                1ms. No LLM round-trip for routine edits.
              </p>
            </div>

            <div className="card-3d liquid-glass rounded-2xl p-6 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "color-mix(in srgb, var(--color-atlantean-teal-aqua) 20%, transparent)",
                  color: "var(--color-atlantean-teal-aqua)",
                }}
              >
                <PhBug weight="thin" size={24} />
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Type Safe
              </h3>
              <p className="text-text-secondary text-sm font-body">
                Full TypeScript strict mode. Zero `any` types across all 9
                published packages.
              </p>
            </div>

            <div className="card-3d liquid-glass rounded-2xl p-6 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "color-mix(in srgb, var(--color-gold-bright) 20%, transparent)",
                  color: "var(--color-gold-bright)",
                }}
              >
                <PhRocket weight="thin" size={24} />
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Production Ready
              </h3>
              <p className="text-text-secondary text-sm font-body">
                3,000+ tests passing across 26 packages. Tested against
                Vercel, Supabase, and Google Gemini in production.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section>
          <div className="relative liquid-glass rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--color-brand-primary) 10%, transparent), transparent 50%, color-mix(in srgb, var(--color-atlantean-teal-aqua) 8%, transparent))",
              }}
            />
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{
                background: "color-mix(in srgb, var(--color-brand-primary) 6%, transparent)",
              }}
            />

            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-fluid-2xl font-display font-bold text-text-primary mb-4">
                Start Building Today
              </h2>
              <p className="text-text-secondary font-body leading-relaxed mb-8">
                The Arcanea developer platform is open source and free to use.
                Join the builders shaping the future of creator AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="https://github.com/ruvnet/claude-flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhCode weight="thin" size={18} />
                  View on GitHub
                </Link>
                <Link
                  href="/workflows"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-atlantean-teal-aqua/30 transition-all duration-200"
                >
                  See Workflow Templates
                  <PhChevronRight weight="thin" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
