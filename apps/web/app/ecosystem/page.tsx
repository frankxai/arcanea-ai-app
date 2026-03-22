'use client';

import Link from 'next/link';
import {
  Sparkle,
  ArrowRight,
  ArrowSquareOut,
  Globe,
  Brain,
  Wrench,
  Book,
  Package,
  GitBranch,
  Code,
  Database,
  Cpu,
  ChatCircle,
  Shield,
  GraduationCap,
  Users,
  Terminal,
  Heart,
} from '@phosphor-icons/react';
import type { PhosphorIcon as PhIcon } from '@phosphor-icons/react';
import { MotionProvider, m } from '@/lib/motion';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Layer {
  id: string;
  name: string;
  description: string;
  icon: PhIcon;
  accent: string;
  features: string[];
}

interface Repo {
  name: string;
  description: string;
  href: string;
  language?: string;
}

interface RepoCategory {
  name: string;
  icon: PhIcon;
  accent: string;
  repos: Repo[];
}

interface TechItem {
  name: string;
  description: string;
  accent: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const SIX_LAYERS: Layer[] = [
  {
    id: 'chat',
    name: 'Chat / Imagine',
    description: 'The creation surface. Talk to AI, generate images, write stories, compose music.',
    icon: ChatCircle,
    accent: 'text-[#7fffd4]',
    features: ['AI Chat', 'Image Generation', 'Music Creation', 'Story Writing'],
  },
  {
    id: 'worlds',
    name: 'Worlds',
    description: 'The framework for building your fantasy universe. Gates, Archetypes, Elements.',
    icon: Globe,
    accent: 'text-[#78a6ff]',
    features: ['Ten Gates', 'Five Elements', 'Magic System', 'Lore Engine'],
  },
  {
    id: 'feed',
    name: 'Feed',
    description: 'The social layer. See what other creators build, get inspired, share your worlds.',
    icon: Heart,
    accent: 'text-pink-400',
    features: ['Creator Profiles', 'Sharing', 'Discovery', 'Inspiration'],
  },
  {
    id: 'oss',
    name: 'OSS',
    description: 'The open ecosystem. 27 repos, 35 npm packages, 54 skills for every coding agent.',
    icon: Code,
    accent: 'text-green-400',
    features: ['27 Repositories', '35 Packages', '54 Skills', 'Agent Overlays'],
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Not just users — co-creators. Contribute lore, agents, skills, code, art.',
    icon: Users,
    accent: 'text-[#ffd700]',
    features: ['Governance', 'Inner Circle', 'Contributions', 'Shared Ownership'],
  },
  {
    id: 'academy',
    name: 'Academy',
    description: 'Learn world-building, prompt craft, agent design, the Arcanean Code.',
    icon: GraduationCap,
    accent: 'text-violet-400',
    features: ['Gate Progression', 'Seven Houses', 'Courses', '200K+ Words'],
  },
];

const REPO_CATEGORIES: RepoCategory[] = [
  {
    name: 'Core',
    icon: Globe,
    accent: 'text-[#7fffd4]',
    repos: [
      { name: 'arcanea-ai-app', description: 'The main Arcanea platform — Next.js 16, Supabase, Vercel AI SDK', href: 'https://github.com/frankxai/arcanea-ai-app' },
      { name: 'arcanea', description: 'Open-source framework and canonical lore. The foundation of the multiverse.', href: 'https://github.com/frankxai/arcanea' },
      { name: 'arcanea-soul', description: 'Core AI personality engine. The soul layer beneath every companion.', href: 'https://github.com/frankxai/arcanea-soul' },
    ],
  },
  {
    name: 'Intelligence',
    icon: Brain,
    accent: 'text-[#78a6ff]',
    repos: [
      { name: 'starlight-intelligence-system', description: 'Multi-model orchestration with memory, routing, and persona management', href: 'https://github.com/frankxai/starlight-intelligence-system' },
      { name: 'arcanea-companion', description: 'AI companion framework. Personality, context, and relationship tracking.', href: 'https://github.com/frankxai/arcanea-companion' },
      { name: 'arcanea-infogenius', description: 'Research and knowledge synthesis agent. Web search, analysis, reporting.', href: 'https://github.com/frankxai/arcanea-infogenius' },
    ],
  },
  {
    name: 'Tools',
    icon: Wrench,
    accent: 'text-[#ffd700]',
    repos: [
      { name: 'claude-arcanea', description: 'Arcanea skills overlay for Claude Code. 54 skills, MCP server, agent harness.', href: 'https://github.com/frankxai/claude-arcanea' },
      { name: 'arcanea-claw', description: 'CLI tool for Arcanea. Project scaffolding, deployment, and management.', href: 'https://github.com/frankxai/arcanea-claw' },
      { name: 'arcanea-mcp', description: 'Model Context Protocol server. World-building, characters, lore via MCP.', href: 'https://github.com/frankxai/arcanea-mcp' },
    ],
  },
  {
    name: 'Content',
    icon: Book,
    accent: 'text-pink-400',
    repos: [
      { name: 'arcanea-records', description: 'Music studio and frequency-aligned compositions. Suno AI integration.', href: 'https://github.com/frankxai/arcanea-records' },
      { name: 'arcanea-books', description: 'The Library of Arcanea. 17 collections, 200K+ words of creative philosophy.', href: 'https://github.com/frankxai/arcanea-books' },
    ],
  },
  {
    name: 'Web3',
    icon: Shield,
    accent: 'text-violet-400',
    repos: [
      { name: 'arcanea-onchain', description: 'On-chain IP protection. NFT minting on Base with Story Protocol licensing.', href: 'https://github.com/frankxai/arcanea-onchain' },
    ],
  },
];

const TECH_STACK: TechItem[] = [
  { name: 'Next.js 16', description: 'App Router, React Server Components', accent: 'text-white' },
  { name: 'React 19', description: 'Server Components, Suspense, Transitions', accent: 'text-sky-400' },
  { name: 'TypeScript', description: 'Strict mode, full type safety', accent: 'text-blue-400' },
  { name: 'Supabase', description: 'PostgreSQL, Auth, Realtime, Storage', accent: 'text-emerald-400' },
  { name: 'Vercel AI SDK', description: 'Streaming, tool calls, multi-provider', accent: 'text-white/80' },
  { name: 'Claude & Gemini', description: 'Anthropic + Google multi-model intelligence', accent: 'text-orange-400' },
  { name: 'Tailwind CSS', description: 'Utility-first with Arcanean design tokens', accent: 'text-cyan-400' },
  { name: 'Framer Motion', description: 'Fluid animations and transitions', accent: 'text-pink-400' },
];

const NPM_PACKAGES = [
  'arcanea-mcp', 'claude-arcanea', 'arcanea-claw', 'arcanea-soul',
  'arcanea-companion', 'arcanea-flow', 'arcanea-vault', 'arcanea-overlays',
];

const STATS = [
  { label: 'Repositories', value: '27' },
  { label: 'NPM Packages', value: '35' },
  { label: 'Agent Skills', value: '54' },
  { label: 'Library Words', value: '200K+' },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function EcosystemPage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.04),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.04),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <section className="mb-20">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] px-8 py-16 sm:px-14 sm:py-20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/8 via-transparent to-[#78a6ff]/6 pointer-events-none" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#7fffd4]/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#78a6ff]/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/30 bg-[#7fffd4]/10 mb-8">
                  <Sparkle className="w-4 h-4 text-[#7fffd4]" weight="fill" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                    The Ecosystem
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-white">
                  27 repositories. 35 packages.
                  <span className="block bg-gradient-to-r from-[#7fffd4] via-[#78a6ff] to-violet-400 bg-clip-text text-transparent">
                    One creative superintelligence.
                  </span>
                </h1>

                <p className="text-lg text-white/50 leading-relaxed max-w-2xl mb-10">
                  Arcanea is not a single tool — it is a living ecosystem built for the complete
                  creative life. Six interconnected layers that grow with you, from first chat
                  to published universe.
                </p>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-6 mb-10">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-display font-bold text-[#7fffd4]">{stat.value}</p>
                      <p className="text-xs font-mono text-white/30 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-black font-semibold hover:brightness-110 transition-all"
                  >
                    Start Creating <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://github.com/frankxai/arcanea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                  >
                    <GitBranch className="w-4 h-4" />
                    View on GitHub
                  </a>
                </div>
              </div>
            </m.div>
          </section>

          {/* ── Six Layers Diagram ───────────────────────────────────── */}
          <section className="mb-20">
            <div className="mb-10">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Architecture</p>
              <h2 className="text-2xl font-display font-bold text-white">The Six Layers</h2>
              <p className="text-white/40 text-sm mt-1">How everything connects — from chat to community</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SIX_LAYERS.map((layer, i) => {
                const Icon = layer.icon;
                return (
                  <m.div
                    key={layer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${layer.accent}`} weight="duotone" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">Layer {i + 1}</span>
                        <h3 className="font-display font-semibold text-white text-sm">{layer.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed mb-4">{layer.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {layer.features.map((f) => (
                        <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-white/30 border border-white/[0.04]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </m.div>
                );
              })}
            </div>

            {/* Flow arrows */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-white/20">
              <span>Chat/Imagine</span>
              <ArrowRight className="w-3 h-3" />
              <span>Worlds</span>
              <ArrowRight className="w-3 h-3" />
              <span>Feed</span>
              <ArrowRight className="w-3 h-3" />
              <span>OSS</span>
              <ArrowRight className="w-3 h-3" />
              <span>Community</span>
              <ArrowRight className="w-3 h-3" />
              <span>Academy</span>
            </div>
          </section>

          {/* ── Repository Grid ──────────────────────────────────────── */}
          <section className="mb-20">
            <div className="mb-10">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Open Source</p>
              <h2 className="text-2xl font-display font-bold text-white">Repository Map</h2>
              <p className="text-white/40 text-sm mt-1">Organized by domain — every piece of the ecosystem</p>
            </div>

            <div className="space-y-8">
              {REPO_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center gap-2 mb-4">
                      <CatIcon className={`w-4 h-4 ${cat.accent}`} weight="duotone" />
                      <h3 className={`text-sm font-mono font-semibold ${cat.accent} uppercase tracking-wider`}>{cat.name}</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cat.repos.map((repo) => (
                        <a
                          key={repo.name}
                          href={repo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all p-5"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-mono text-sm text-white font-semibold group-hover:text-[#7fffd4] transition-colors">
                              {repo.name}
                            </h4>
                            <ArrowSquareOut className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0 mt-0.5" />
                          </div>
                          <p className="text-xs text-white/35 leading-relaxed">{repo.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── NPM Packages ─────────────────────────────────────────── */}
          <section className="mb-20">
            <div className="mb-10">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Distribution</p>
              <h2 className="text-2xl font-display font-bold text-white">NPM Packages</h2>
              <p className="text-white/40 text-sm mt-1">35 packages published and maintained across the ecosystem</p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {NPM_PACKAGES.map((pkg) => (
                  <a
                    key={pkg}
                    href={`https://www.npmjs.com/package/${pkg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    <Package className="w-3 h-3" />
                    {pkg}
                  </a>
                ))}
                <span className="inline-flex items-center text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/30 border border-white/[0.06]">
                  + 27 more packages
                </span>
              </div>

              <div className="text-xs text-white/25 font-mono">
                Install any package: <code className="text-[#7fffd4]/60 bg-white/[0.04] px-1.5 py-0.5 rounded">npm install package-name</code>
              </div>
            </div>
          </section>

          {/* ── Architecture Flow ─────────────────────────────────────── */}
          <section className="mb-20">
            <div className="mb-10">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Data Flow</p>
              <h2 className="text-2xl font-display font-bold text-white">How Data Flows</h2>
              <p className="text-white/40 text-sm mt-1">From user input to multi-model intelligence to creative output</p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8">
              <div className="grid sm:grid-cols-5 gap-4 items-center">
                {[
                  { label: 'User Input', sub: 'Chat, Prompt, Command', icon: Terminal, accent: 'text-white/70' },
                  { label: 'Starlight Router', sub: 'Model Selection, Routing', icon: Cpu, accent: 'text-[#7fffd4]' },
                  { label: 'AI Models', sub: 'Claude, Gemini, Suno', icon: Brain, accent: 'text-[#78a6ff]' },
                  { label: 'Memory Layer', sub: 'Context, HNSW, Sessions', icon: Database, accent: 'text-[#ffd700]' },
                  { label: 'Creative Output', sub: 'Text, Image, Music, Code', icon: Sparkle, accent: 'text-violet-400' },
                ].map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.label} className="text-center relative">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                        <StepIcon className={`w-5 h-5 ${step.accent}`} weight="duotone" />
                      </div>
                      <p className="text-xs font-semibold text-white">{step.label}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{step.sub}</p>
                      {i < 4 && (
                        <ArrowRight className="absolute -right-3 top-5 w-3 h-3 text-white/15 hidden sm:block" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Built With ────────────────────────────────────────────── */}
          <section className="mb-20">
            <div className="mb-10">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Technology</p>
              <h2 className="text-2xl font-display font-bold text-white">Built With</h2>
              <p className="text-white/40 text-sm mt-1">The full technology stack powering the ecosystem</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TECH_STACK.map((tech) => (
                <div key={tech.name} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                  <h4 className={`font-mono font-semibold text-sm ${tech.accent} mb-1`}>{tech.name}</h4>
                  <p className="text-xs text-white/30">{tech.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Contribution Guide ────────────────────────────────────── */}
          <section className="mb-20">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] p-8 sm:p-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-[#7fffd4]/5 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <GitBranch className="w-6 h-6 text-green-400" weight="duotone" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Contribute to Arcanea</h3>
                  <p className="text-white/40 leading-relaxed mb-6 max-w-2xl">
                    Arcanea is open source at its core. Contribute code, lore, agents, skills, or art.
                    Inner circle contributors earn governance rights and shape the future of the multiverse.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://github.com/frankxai/arcanea"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/10 text-green-400 text-sm font-semibold border border-green-500/20 hover:bg-green-500/20 transition-colors"
                    >
                      <GitBranch className="w-4 h-4" />
                      Fork on GitHub
                    </a>
                    <Link
                      href="/docs/contributing"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-semibold border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      Read the Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </m.div>
          </section>

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <section>
            <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#7fffd4] via-violet-500 to-[#ffd700]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5 pointer-events-none" />

              <div className="relative px-8 py-16 sm:px-14 text-center">
                <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-6">Begin here</p>

                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                  Start building your universe
                </h2>
                <p className="text-white/40 leading-relaxed max-w-xl mx-auto mb-10">
                  Every product in the ecosystem grows with you. Start with the platform.
                  Add tools as your practice deepens. The Arc turns — begin.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#7fffd4] text-black font-semibold hover:brightness-110 transition-all"
                  >
                    Open the platform <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                  >
                    Learn about Arcanea
                  </Link>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-[#ffd700] via-violet-500 to-[#7fffd4]" />
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
