/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import { SplitText } from '@/components/motion/split-text';
import { LiquidGlass } from '@/components/motion/liquid-glass';
import { Magnetic } from '@/components/motion/magnetic';
import { Reveal, StaggerReveal } from '@/components/motion/reveal';
import { GradientMesh } from '@/components/motion/gradient-mesh';
import { NumberTicker } from '@/components/motion/number-ticker';

export const metadata: Metadata = {
  title: 'Blueprints — Open Source Production Code',
  description: '7 production blueprints for AI startups, authors, game studios, and design engineers. 33K+ lines. MIT licensed. Fork the code behind arcanea.ai.',
  openGraph: {
    title: 'Arcanea Blueprints — Fork the code behind arcanea.ai',
    description: '7 production blueprints. 33K+ lines. MIT licensed. Multi-model chat, world engine, publishing house, MCP server.',
    type: 'website',
  },
  alternates: { canonical: '/templates' },
};

// ── Blueprint Data ─────────────────────────────────────────────────────────

interface Blueprint {
  id: string;
  name: string;
  desc: string;
  audience: string;
  loc: string;
  files: string[];
  stack: string[];
  github: string;
  demo?: string;
  deploy?: string;
  color: string;
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: 'chat',
    name: 'Multi-Model Chat',
    desc: 'BYOK chat with provider routing, streaming, rate limiting, and 12 agent personas. Swap models without code changes.',
    audience: 'AI startups',
    loc: '1,700',
    files: ['app/chat/page.tsx', 'app/api/ai/chat/route.ts', 'lib/ai/luminors.ts'],
    stack: ['Next.js 16', 'Vercel AI SDK', 'OpenRouter', 'Supabase'],
    github: 'https://github.com/frankxai/arcanea-chat-template',
    demo: '/chat',
    deploy: 'https://vercel.com/new/clone?repository-url=https://github.com/frankxai/arcanea-chat-template',
    color: 'var(--arc-void)',
  },
  {
    id: 'worlds',
    name: 'World Engine',
    desc: 'Characters, locations, magic systems, factions — all interconnected in a living relationship graph.',
    audience: 'Game studios · Authors',
    loc: '2,000',
    files: ['packages/world-engine/src/index.ts', 'app/worlds/page.tsx'],
    stack: ['TypeScript', 'Supabase', 'pgvector', 'MCP'],
    github: 'https://github.com/frankxai/arcanea-ai-app/tree/main/packages/world-engine',
    demo: '/worlds',
    color: 'var(--arc-wind)',
  },
  {
    id: 'library',
    name: 'Living Library',
    desc: '190K+ words across 17 collections with reading progress, semantic graph visualization, and content loader.',
    audience: 'Publishers · Authors',
    loc: '5,000',
    files: ['app/library/page.tsx', 'lib/content/index.ts', 'app/library/graph/'],
    stack: ['Next.js 16', 'MDX', 'ISR', 'Canvas2D'],
    github: 'https://github.com/frankxai/arcanea-ai-app/tree/main/apps/web/app/library',
    demo: '/library',
    color: 'var(--arc-brand-cosmic-blue)',
  },
  {
    id: 'motion',
    name: 'Motion + UI Kit',
    desc: '12 motion primitives + 40 UI components. LiquidGlass, TiltCard, GlowCard, SplitText, Marquee, AnimatedBeam. Standalone template available.',
    audience: 'Design engineers',
    loc: '2,900',
    files: ['components/motion/', 'components/ui/', 'packages/arcanea-design-preset.js'],
    stack: ['React 19', 'Framer Motion 11', 'Tailwind', 'Radix UI'],
    github: 'https://github.com/frankxai/cosmic-landing-template',
    demo: '/arcanea-vault',
    deploy: 'https://vercel.com/new/clone?repository-url=https://github.com/frankxai/cosmic-landing-template',
    color: 'var(--arc-brand-atlantean-teal)',
  },
  {
    id: 'dashboard',
    name: 'Cosmic Dashboard',
    desc: 'Cosmic analytics dashboard with 6 liquid glass widgets, Recharts visualizations, and Luminor-themed activity feed. Mock data, zero env vars.',
    audience: 'Product builders · Founders',
    loc: '1,400',
    files: ['app/page.tsx', 'lib/mock-data.ts', 'components/dashboard/'],
    stack: ['Next.js 16', 'Recharts', 'Framer Motion', 'Tailwind'],
    github: 'https://github.com/frankxai/arcanea-dashboard-template',
    deploy: 'https://vercel.com/new/clone?repository-url=https://github.com/frankxai/arcanea-dashboard-template',
    color: 'var(--arc-void)',
  },
  {
    id: 'vault',
    name: 'Starlight Vault',
    desc: '6 semantic vaults with confidence scoring, Guardian routing, Mem0 adapter, and WebGL constellation visualization.',
    audience: 'Agent builders',
    loc: '4,600',
    files: ['packages/memory-system/src/', 'packages/memory-mcp/', 'app/arcanea-vault/'],
    stack: ['TypeScript', 'MCP SDK', 'JSONL', 'React Three Fiber'],
    github: 'https://github.com/frankxai/Starlight-Intelligence-System',
    demo: '/arcanea-vault',
    color: 'var(--arc-void)',
  },
  {
    id: 'publishing',
    name: 'Publishing House',
    desc: 'Multi-agent book production with 5 Claw agents, 7-gate taste evaluator, and Pandoc export to EPUB/PDF/DOCX.',
    audience: 'Publishers · Content platforms',
    loc: '8,300',
    files: ['packages/publishing-house/agents/', 'packages/publishing-house/quality/'],
    stack: ['TypeScript', 'Claude API', 'Pandoc', 'MCP'],
    github: 'https://github.com/frankxai/arcanea-ai-app/tree/main/packages/publishing-house',
    color: 'var(--arc-brand-arcanean-gold)',
  },
  {
    id: 'mcp',
    name: 'MCP Server',
    desc: '42 tools: world intelligence, vault memory, media generation, canon validation — one server, any AI client.',
    audience: 'Claude developers · Agent builders',
    loc: '8,500',
    files: ['packages/arcanea-mcp/src/index.ts', 'packages/arcanea-mcp/src/tools/'],
    stack: ['TypeScript', 'MCP SDK 1.29', 'Zod', 'HTTP/SSE'],
    github: 'https://github.com/frankxai/arcanea-ai-app/tree/main/packages/arcanea-mcp',
    demo: '/starlight-intelligence',
    color: 'var(--arc-fire)',
  },
  {
    id: 'mcp-starter',
    name: 'MCP Starter',
    desc: 'Minimal MCP server scaffold — SDK 1.29, 3 example tools, Zod validation, Claude Desktop config. Fork to build your own tools.',
    audience: 'Agent builders · Tool authors',
    loc: '500',
    files: ['src/index.ts', 'src/tools/', 'README.md'],
    stack: ['TypeScript', 'MCP SDK 1.29', 'Zod', 'stdio'],
    github: 'https://github.com/frankxai/arcanea-mcp-starter',
    deploy: 'https://github.com/frankxai/arcanea-mcp-starter/generate',
    color: 'var(--arc-brand-atlantean-teal)',
  },
];

// ── Use Cases ──────────────────────────────────────────────────────────────

const USE_CASES = [
  {
    title: 'Building an AI product?',
    desc: 'Start with Multi-Model Chat for the UI, Starlight Vault for memory, and the MCP Server for tool use. BYOK architecture means your users pay their own API costs — no margin pressure on you.',
    blueprints: ['chat', 'vault', 'mcp'],
    cta: { label: 'Try the chat', href: '/chat' },
    color: 'var(--arc-void)',
  },
  {
    title: 'Writing a book or building a universe?',
    desc: 'The Publishing House gives you 5 specialized agents for drafting, editing, and formatting. The World Engine structures your characters, locations, and lore into a queryable graph. The Library stores it all.',
    blueprints: ['publishing', 'worlds', 'library'],
    cta: { label: 'Explore the library', href: '/library' },
    color: 'var(--arc-brand-arcanean-gold)',
  },
  {
    title: 'Need a premium dark UI?',
    desc: 'The Motion + UI Kit gives you 12 physics-based primitives (SplitText, LiquidGlass, TiltCard, Magnetic) and 40 production components. Works with any Next.js project — just copy the files.',
    blueprints: ['motion'],
    cta: { label: 'See it in action', href: '/arcanea-vault' },
    color: 'var(--arc-brand-atlantean-teal)',
  },
];

// ── Stats ───────────────────────────────────────────────────────────────────

const STATS = [
  { value: 7, suffix: '', label: 'Blueprints' },
  { value: 33, suffix: 'K+', label: 'Lines of code' },
  { value: 42, suffix: '', label: 'MCP tools' },
  { value: 12, suffix: '', label: 'Motion primitives' },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function BlueprintsPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
        <GradientMesh colors={['var(--arc-brand-atlantean-teal)', 'var(--arc-void)', 'var(--arc-brand-arcanean-gold)']} intensity={0.05} />
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {/* ── Hero ── */}
        <section className="pt-24 pb-16 text-center">
          <Reveal y={12} blur>
            <p className="text-[11px] font-mono tracking-[0.3em] text-[var(--arc-text-muted)] mb-6 uppercase">
              Open source · MIT licensed · Battle-tested on arcanea.ai
            </p>
          </Reveal>

          <SplitText
            as="h1"
            text="Everything we build, you can fork."
            className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-[var(--arc-text-primary)] mb-4 tracking-tight"
            delay={0.15}
            stagger={0.025}
          />

          <Reveal delay={0.8} y={12}>
            <p className="text-base md:text-lg text-[var(--arc-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              The production code behind arcanea.ai — organized as 7 forkable blueprints.
              Use the whole platform or extract the pieces you need.
            </p>
          </Reveal>

          <Reveal y={16} delay={1.0}>
            <div className="flex justify-center gap-8 md:gap-12 mt-10">
              {STATS.map((s, i) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl md:text-2xl font-display font-bold text-[var(--arc-text-primary)]">
                    <NumberTicker value={s.value} suffix={s.suffix} delay={1.2 + i * 0.1} />
                  </p>
                  <p className="text-[9px] font-mono tracking-widest uppercase text-[var(--arc-text-muted)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── Use Cases (ICP-focused) ── */}
        <section className="mb-20">
          <Reveal y={12}>
            <p className="text-[10px] font-mono tracking-[0.25em] text-[var(--arc-text-muted)] mb-8 uppercase text-center">
              Start from your use case
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {USE_CASES.map((uc, i) => (
              <Reveal key={uc.title} y={20} delay={i * 0.1}>
                <LiquidGlass
                  intensity="subtle"
                  tint={uc.color}
                  className="rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-colors h-full"
                >
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-base font-display font-semibold text-[var(--arc-text-primary)] mb-2">{uc.title}</h3>
                    <p className="text-xs text-[var(--arc-text-secondary)] leading-relaxed mb-4 flex-1">{uc.desc}</p>
                    <div className="flex items-center gap-2 mb-4">
                      {uc.blueprints.map((bid) => {
                        const bp = BLUEPRINTS.find((b) => b.id === bid);
                        if (!bp) return null;
                        return (
                          <span key={bid} className="flex items-center gap-1 text-[9px] font-mono text-[var(--arc-text-muted)]">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bp.color }} />
                            {bp.name}
                          </span>
                        );
                      })}
                    </div>
                    <Magnetic>
                      <Link
                        href={uc.cta.href}
                        className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                        style={{ color: uc.color }}
                      >
                        {uc.cta.label} <span aria-hidden>&#8594;</span>
                      </Link>
                    </Magnetic>
                  </div>
                </LiquidGlass>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Blueprint Grid ── */}
        <section className="mb-20">
          <Reveal y={12}>
            <p className="text-[10px] font-mono tracking-[0.25em] text-[var(--arc-text-muted)] mb-8 uppercase text-center">
              All 7 blueprints
            </p>
          </Reveal>

          <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.06} delay={0.1}>
            {BLUEPRINTS.map((b) => (
              <Reveal key={b.id} y={20}>
                <LiquidGlass
                  intensity="standard"
                  tint={b.color}
                  glow
                  tilt
                  tiltIntensity={6}
                  className="rounded-2xl border border-white/[0.06] hover:border-white/[0.14] transition-colors h-full"
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color, boxShadow: `0 0 12px ${b.color}60` }} />
                          <h3 className="text-sm font-display font-semibold text-[var(--arc-text-primary)]">{b.name}</h3>
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--arc-text-muted)]">{b.audience}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-base font-display font-bold text-[var(--arc-text-primary)]">{b.loc}</p>
                        <p className="text-[8px] font-mono uppercase tracking-widest text-[var(--arc-text-muted)]">lines</p>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--arc-text-secondary)] leading-relaxed mb-3 flex-1">{b.desc}</p>

                    <div className="mb-3 space-y-0.5">
                      {b.files.map((f) => (
                        <p key={f} className="text-[10px] font-mono text-[var(--arc-text-muted)] truncate">
                          <span className="text-[var(--arc-brand-atlantean-teal)]/50 mr-1">/</span>{f}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {b.stack.map((s) => (
                        <span key={s} className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[var(--arc-text-muted)]">{s}</span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Magnetic>
                        <a
                          href={b.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 rounded-xl text-xs font-medium border text-center transition-colors"
                          style={{ color: b.color, borderColor: `${b.color}30`, backgroundColor: `${b.color}08` }}
                        >
                          View source
                        </a>
                      </Magnetic>
                      {b.deploy ? (
                        <Magnetic>
                          <a
                            href={b.deploy}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-4 rounded-xl text-xs font-medium bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/15 to-[var(--arc-brand-cosmic-blue)]/15 border border-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)] transition-colors hover:from-[var(--arc-brand-atlantean-teal)]/25 hover:to-[var(--arc-brand-cosmic-blue)]/25"
                          >
                            Deploy
                          </a>
                        </Magnetic>
                      ) : b.demo ? (
                        <Magnetic>
                          <Link
                            href={b.demo}
                            className="py-2 px-4 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-[var(--arc-text-primary)] transition-colors hover:bg-white/[0.08]"
                          >
                            Demo
                          </Link>
                        </Magnetic>
                      ) : null}
                    </div>
                  </div>
                </LiquidGlass>
              </Reveal>
            ))}
          </StaggerReveal>
        </section>

        {/* ── Quick Start ── */}
        <Reveal y={16} className="mb-20">
          <LiquidGlass intensity="subtle" tint="var(--arc-brand-atlantean-teal)" className="rounded-2xl border border-white/[0.06] max-w-3xl mx-auto">
            <div className="p-8">
              <h2 className="text-xl font-display font-bold text-[var(--arc-text-primary)] mb-2">Quick start</h2>
              <p className="text-sm text-[var(--arc-text-secondary)] mb-6">Fork the repo. Deploy to Vercel. Start building.</p>

              <div className="space-y-3">
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/[0.06] flex items-center gap-2">
                    <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /></div>
                    <span className="text-[10px] font-mono text-[var(--arc-text-muted)] ml-2">Terminal</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-[var(--arc-text-secondary)] overflow-x-auto">
{`# Clone the repo
git clone https://github.com/frankxai/arcanea-ai-app.git
cd arcanea-ai-app

# Install dependencies
pnpm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local

# Run locally
pnpm dev`}
                  </pre>
                </div>
              </div>

              <p className="text-xs text-[var(--arc-text-muted)] mt-4">
                Or extract just the components you need — each blueprint works independently.
              </p>
            </div>
          </LiquidGlass>
        </Reveal>

        {/* ── Bottom CTA ── */}
        <Reveal y={16} className="pb-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--arc-text-primary)] mb-3 tracking-tight">
              Your keys. Your data. Your product.
            </h2>
            <p className="text-sm text-[var(--arc-text-secondary)] mb-8">
              MIT licensed. No vendor lock-in. Run it locally, deploy to Vercel, or host it yourself.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Magnetic>
                <a
                  href="https://github.com/frankxai/arcanea-ai-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[0_0_30px_rgba(0,188,212,0.15)]"
                >
                  Fork on GitHub
                </a>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/ecosystem"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-[var(--arc-text-primary)] hover:bg-white/[0.08] transition-colors"
                >
                  Browse all 27 repos
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
