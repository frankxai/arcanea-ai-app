/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import Link from 'next/link';
import { getResearchCategories, getResearchItems } from '@/lib/research/loader';
import { GATE_COLORS } from '@/lib/research/types';
import { PUBLIC_REPO_SUMMARY } from '@/lib/public-repo-registry';
import { FACTS } from '@/lib/facts';

export const dynamic = 'force-dynamic';

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function IconBeaker({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </svg>
  );
}

function IconGitBranch({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function IconArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconExternalLink({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ─── Category Icons (SVG paths) ───────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  papers: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  github: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  benchmarks: 'M3 13h2v8H3zm6-4h2v12H9zm6-6h2v18h-2zm6 10h2v8h-2z',
  synthesis: 'M13 10V3L4 14h7v7l9-11h-7z',
  books: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
};

function CategoryIcon({ category }: { category: string }) {
  const d = CATEGORY_ICONS[category] ?? CATEGORY_ICONS.papers;
  return (
    <svg className="h-6 w-6 text-[var(--arc-brand-atlantean-teal)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function GateBadge({ gate }: { gate: string }) {
  const colors = GATE_COLORS[gate] ?? 'bg-white/5 border-white/10 text-white/60';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors}`}>
      {gate}
    </span>
  );
}

function TypeLabel({ type }: { type: string }) {
  const labels: Record<string, string> = {
    paper: 'Paper',
    repo: 'Tool',
    book: 'Book',
    benchmark: 'Benchmark',
    synthesis: 'Synthesis',
    'research-synthesis': 'Synthesis',
  };
  return (
    <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-xs text-white/40 border border-white/[0.06]">
      {labels[type] ?? type}
    </span>
  );
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: String(PUBLIC_REPO_SUMMARY.public), label: 'Public Repos' },
  { value: String(FACTS.mcpTools), label: 'MCP Tools' },
  { value: String(FACTS.skills), label: 'Agent Skills' },
  { value: String(FACTS.luminors), label: 'Luminors' },
];

interface RepoCard {
  name: string;
  description: string;
  href: string;
  language?: string;
}

interface RepoGroup {
  category: string;
  accent: string;
  repos: RepoCard[];
}

const REPO_GROUPS: RepoGroup[] = [
  {
    category: 'Platform',
    accent: 'var(--arc-brand-atlantean-teal)',
    repos: [
      { name: 'arcanea', description: 'Open-source framework and canonical lore. The foundation of the multiverse.', href: 'https://github.com/frankxai/arcanea', language: 'TypeScript' },
      { name: 'arcanea-ai-app', description: 'The main Arcanea platform — Next.js 16, Supabase, Vercel AI SDK.', href: 'https://github.com/frankxai/arcanea-ai-app', language: 'TypeScript' },
      { name: 'arcanea-soul', description: 'Core AI personality engine. The soul layer beneath every companion.', href: 'https://github.com/frankxai/arcanea-soul', language: 'TypeScript' },
    ],
  },
  {
    category: 'Intelligence',
    accent: 'var(--arc-brand-cosmic-blue)',
    repos: [
      { name: 'starlight-intelligence-system', description: 'Multi-model orchestration with memory, routing, and persona management.', href: 'https://github.com/frankxai/starlight-intelligence-system', language: 'TypeScript' },
      { name: 'arcanea-companion', description: 'AI companion framework. Personality, context, and relationship tracking.', href: 'https://github.com/frankxai/arcanea-companion', language: 'TypeScript' },
      { name: 'arcanea-infogenius', description: 'Research and knowledge synthesis agent. Web search, analysis, reporting.', href: 'https://github.com/frankxai/arcanea-infogenius', language: 'Python' },
    ],
  },
  {
    category: 'Creative Tools',
    accent: 'var(--arc-brand-arcanean-gold)',
    repos: [
      { name: 'claude-arcanea', description: 'Arcanea skills overlay for Claude Code. 20 creator skills, MCP server, agent harness.', href: 'https://github.com/frankxai/claude-arcanea', language: 'TypeScript' },
      { name: 'arcanea-claw', description: 'CLI tool for Arcanea. Project scaffolding, deployment, and management.', href: 'https://github.com/frankxai/arcanea-claw', language: 'TypeScript' },
      { name: 'arcanea-records', description: 'Music studio and frequency-aligned compositions. Suno AI integration.', href: 'https://github.com/frankxai/arcanea-records', language: 'TypeScript' },
    ],
  },
  {
    category: 'Extensions',
    accent: 'var(--arc-void)',
    repos: [
      { name: 'arcanea-mcp', description: 'Model Context Protocol server. World-building, characters, lore via MCP.', href: 'https://github.com/frankxai/arcanea-mcp', language: 'TypeScript' },
      { name: 'arcanea-onchain', description: 'On-chain IP protection. NFT minting on Base with Story Protocol licensing.', href: 'https://github.com/frankxai/arcanea-onchain', language: 'Solidity' },
      { name: 'arcanea-flow', description: 'Multi-agent workflow orchestration and swarm coordination.', href: 'https://github.com/frankxai/arcanea-flow', language: 'TypeScript' },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ResearchPage() {
  const [categories, items] = await Promise.all([
    getResearchCategories(),
    getResearchItems(),
  ]);

  const totalResearchCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.06),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.04),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] px-8 py-16 sm:px-14 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/8 via-transparent to-[var(--arc-brand-cosmic-blue)]/6 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--arc-brand-atlantean-teal)]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--arc-brand-cosmic-blue)]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 mb-8">
                <IconBeaker className="w-4 h-4 text-[var(--arc-brand-atlantean-teal)]" />
                <span className="text-xs font-mono tracking-widest uppercase text-[var(--arc-brand-atlantean-teal)]">
                  Research &amp; Technology
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-white">
                Arcanea Research
                <span className="block bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-cosmic-blue)] to-[var(--arc-void)] bg-clip-text text-transparent">
                  Science-backed mythology.
                </span>
              </h1>

              <p className="text-lg text-white/50 leading-relaxed max-w-2xl mb-10">
                Where neuroscience validates the Ten Gates framework. Papers, tools,
                benchmarks, and cross-domain synthesis — mapped to the Guardians who
                watch over each domain.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-display font-bold text-[var(--arc-brand-atlantean-teal)]">{stat.value}</p>
                    <p className="text-xs font-mono text-white/30 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
                <div>
                  <p className="text-2xl font-display font-bold text-[var(--arc-brand-cosmic-blue)]">{totalResearchCount}</p>
                  <p className="text-xs font-mono text-white/30 uppercase tracking-wider">Research Items</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Research Categories ───────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="categories-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
              Research Library
            </p>
            <h2 id="categories-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">
              Categories
            </h2>
            <p className="text-white/40 text-sm mt-1 max-w-xl">
              Structured research across five domains, each mapped to Gates and Guardians.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <CategoryIcon category={cat.slug} />
                    <span className="font-mono text-2xl font-bold text-[var(--arc-brand-atlantean-teal)]/80">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white/90">{cat.name}</h3>
                  <p className="mt-1 text-sm text-white/40 line-clamp-2">{cat.description}</p>
                </div>
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(100,255,218,0.12), transparent)' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Research Items ─────────────────────────────────────── */}
        {items.length > 0 && (
          <section className="mb-20" aria-labelledby="recent-heading">
            <div className="mb-10">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
                Latest
              </p>
              <h2 id="recent-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">
                Recent Research
              </h2>
              <p className="text-white/40 text-sm mt-1">
                Papers, tools, and synthesis reports from the research scouts.
              </p>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={`${item.category}-${item.slug}`}
                  className="group rounded-2xl p-5 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.10] transition-all"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <TypeLabel type={item.type} />
                        {item.confidence === 'high' && (
                          <span className="text-xs text-emerald-500/60">High confidence</span>
                        )}
                      </div>
                      <h3 className="text-base font-medium text-white/90 leading-snug group-hover:text-[var(--arc-brand-atlantean-teal)]/90 transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-white/30">
                        {item.author && <span>{item.author}</span>}
                        {item.date && (
                          <>
                            <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                            <time>{item.date}</time>
                          </>
                        )}
                        {item.relevanceScore > 0 && (
                          <>
                            <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                            <span>Relevance {item.relevanceScore}/10</span>
                          </>
                        )}
                      </div>
                    </div>

                    {item.gateConnections.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:justify-end shrink-0">
                        {item.gateConnections.map((gate) => (
                          <GateBadge key={gate} gate={gate} />
                        ))}
                      </div>
                    )}
                  </div>

                  {item.domain.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {item.domain.slice(0, 5).map((d) => (
                        <span key={d} className="rounded bg-white/[0.03] px-1.5 py-0.5 text-xs text-white/25">
                          {d}
                        </span>
                      ))}
                      {item.domain.length > 5 && (
                        <span className="text-xs text-white/20">+{item.domain.length - 5}</span>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Open Source Ecosystem ─────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="repos-heading">
          <div className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
              Open Source
            </p>
            <h2 id="repos-heading" className="text-2xl sm:text-3xl font-display font-bold text-white">
              The Ecosystem
            </h2>
            <p className="text-white/40 text-sm mt-1 max-w-xl">
              14 public repositories organized across four domains — all open source, all interconnected.
            </p>
          </div>

          <div className="space-y-12">
            {REPO_GROUPS.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.accent }} />
                  <h3 className="text-sm font-mono uppercase tracking-widest font-semibold" style={{ color: group.accent }}>
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
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ background: `radial-gradient(circle at 50% 0%, ${group.accent}08, transparent 70%)` }}
                      />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconGitBranch className="w-4 h-4 text-white/30" />
                            <span className="font-mono text-sm text-white font-medium group-hover:text-[var(--arc-brand-atlantean-teal)] transition-colors">
                              {repo.name}
                            </span>
                          </div>
                          <IconExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed mb-4">{repo.description}</p>
                        <div className="flex items-center gap-4">
                          {repo.language && (
                            <span className="flex items-center gap-1.5 text-xs text-white/30">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.accent + '80' }} />
                              {repo.language}
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

        {/* ── CTA Footer ───────────────────────────────────────────────── */}
        <section className="text-center">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.06] px-8 py-14 sm:px-14">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/5 via-transparent to-[var(--arc-void)]/5 pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                Start building with Arcanea
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
                Fork a repo, create a skill, or just start chatting. The ecosystem is open and waiting.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--arc-brand-atlantean-teal)] text-black font-semibold hover:brightness-110 transition-all"
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
