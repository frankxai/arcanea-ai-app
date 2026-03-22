'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Terminal,
  GitBranch,
  ArrowRight,
  Sparkle,
  Lightning,
  Copy,
  Check,
  Rocket,
  GraduationCap,
  ChatCircle,
  Package,
  Code,
  Book,
  Gear,
  Brain,
} from '@phosphor-icons/react';
import type { PhosphorIcon as PhIcon } from '@phosphor-icons/react';
import { MotionProvider, m } from '@/lib/motion';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PathOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: PhIcon;
  accent: string;
  gradient: string;
  cta: string;
  ctaHref: string;
  external?: boolean;
  steps: { label: string; detail: string; code?: string }[];
}

interface Requirement {
  name: string;
  version: string;
  note: string;
}

interface NextStep {
  title: string;
  description: string;
  href: string;
  icon: PhIcon;
  accent: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const PATHS: PathOption[] = [
  {
    id: 'platform',
    title: 'Use the Platform',
    subtitle: 'arcanea.ai',
    description: 'The fastest way to start. No installation required. Open the browser and begin creating with AI companions, the Library, and the Academy.',
    icon: Globe,
    accent: 'text-[#7fffd4]',
    gradient: 'from-[#7fffd4]/15 to-transparent',
    cta: 'Open arcanea.ai',
    ctaHref: '/chat',
    steps: [
      { label: 'Visit arcanea.ai', detail: 'Open the platform in your browser' },
      { label: 'Create an account', detail: 'Sign up with email or social login' },
      { label: 'Choose a companion', detail: 'Select an AI partner matched to your creative style' },
      { label: 'Start creating', detail: 'Chat, imagine, write, compose — the universe is yours' },
    ],
  },
  {
    id: 'cli',
    title: 'Install the CLI',
    subtitle: 'npm / pnpm / bun',
    description: 'Run Arcanea locally. Access companions from your terminal, integrate with your editor, and build with the full API.',
    icon: Terminal,
    accent: 'text-[#ffd700]',
    gradient: 'from-[#ffd700]/15 to-transparent',
    cta: 'Install Now',
    ctaHref: '#cli-install',
    steps: [
      { label: 'Install the package', detail: 'Choose your preferred package manager', code: 'npm install -g arcanea-ai' },
      { label: 'Authenticate', detail: 'Sign in with your Arcanea account', code: 'arcanea login' },
      { label: 'Start a session', detail: 'Launch a companion session from terminal', code: 'arcanea chat --companion architect' },
      { label: 'Explore commands', detail: 'View all available tools', code: 'arcanea --help' },
    ],
  },
  {
    id: 'framework',
    title: 'Fork the Framework',
    subtitle: 'GitHub',
    description: 'Build on top of Arcanea. Fork the open-source framework, customize the world system, and create your own universe in the multiverse.',
    icon: GitBranch,
    accent: 'text-green-400',
    gradient: 'from-green-500/15 to-transparent',
    cta: 'View on GitHub',
    ctaHref: 'https://github.com/frankxai/arcanea',
    external: true,
    steps: [
      { label: 'Fork the repository', detail: 'Clone the Arcanea framework to your GitHub', code: 'git clone https://github.com/frankxai/arcanea.git' },
      { label: 'Install dependencies', detail: 'Set up the development environment', code: 'cd arcanea && pnpm install' },
      { label: 'Configure environment', detail: 'Copy the env template and add your keys', code: 'cp .env.example .env.local' },
      { label: 'Start development', detail: 'Run the development server', code: 'pnpm dev' },
    ],
  },
];

const REQUIREMENTS: Requirement[] = [
  { name: 'Node.js', version: '20+', note: 'LTS recommended' },
  { name: 'pnpm', version: '9+', note: 'Package manager (npm/bun also work)' },
  { name: 'Git', version: '2.30+', note: 'For framework fork path' },
  { name: 'Supabase', version: 'Latest', note: 'For self-hosted database (optional)' },
];

const NEXT_STEPS: NextStep[] = [
  { title: 'Documentation', description: 'Full API reference and guides', href: '/docs', icon: Book, accent: 'text-[#7fffd4]' },
  { title: 'Academy', description: 'Learn world-building from Gate 1 to 10', href: '/academy', icon: GraduationCap, accent: 'text-violet-400' },
  { title: 'Chat', description: 'Start a conversation with an AI companion', href: '/chat', icon: ChatCircle, accent: 'text-[#78a6ff]' },
  { title: 'Ecosystem', description: 'Explore all 27 repositories and tools', href: '/ecosystem', icon: Gear, accent: 'text-[#ffd700]' },
];

// ─── Components ─────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <code className="block px-4 py-2.5 rounded-lg bg-black/40 border border-white/[0.06] text-sm font-mono text-[#7fffd4]/80 overflow-x-auto">
        <span className="text-white/20 mr-2">$</span>
        {code}
      </code>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-white/40" />
        )}
      </button>
    </div>
  );
}

function PathCard({ path, index }: { path: PathOption; index: number }) {
  const Icon = path.icon;

  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${path.gradient} pointer-events-none`} />

      <div className="relative p-7">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center">
            <Icon className={`w-6 h-6 ${path.accent}`} weight="duotone" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">{path.title}</h3>
            <p className={`text-xs font-mono ${path.accent} opacity-70`}>{path.subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-white/40 leading-relaxed mb-6">{path.description}</p>

        {/* Steps */}
        <div className="space-y-4 mb-6">
          {path.steps.map((step, i) => (
            <div key={i} className="relative pl-8">
              <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white/5 border border-white/[0.08] flex items-center justify-center">
                <span className="text-[10px] font-mono text-white/40">{i + 1}</span>
              </div>
              {i < path.steps.length - 1 && (
                <div className="absolute left-2.5 top-6 w-px h-full bg-white/[0.06]" />
              )}
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">{step.label}</p>
                <p className="text-xs text-white/30 mb-2">{step.detail}</p>
                {step.code && <CodeBlock code={step.code} />}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {path.external ? (
          <a
            href={path.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              path.id === 'framework'
                ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
            }`}
          >
            {path.cta} <ArrowRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            href={path.ctaHref}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              path.id === 'platform'
                ? 'bg-[#7fffd4] text-black hover:brightness-110'
                : 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20 hover:bg-[#ffd700]/20'
            }`}
          >
            {path.cta} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </m.div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function InstallPage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.04),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(255,215,0,0.03),transparent_50%)]" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <section className="mb-16">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 mb-8">
                <Rocket className="w-4 h-4 text-green-400" weight="fill" />
                <span className="text-xs font-mono tracking-widest uppercase text-green-400">
                  Get Started
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                Set up your creative
                <span className="block bg-gradient-to-r from-green-400 via-[#7fffd4] to-[#78a6ff] bg-clip-text text-transparent">
                  intelligence in minutes
                </span>
              </h1>

              <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
                Three paths into the Arcanea ecosystem. Use the platform directly,
                install the CLI for terminal access, or fork the entire framework
                to build your own universe.
              </p>
            </m.div>
          </section>

          {/* ── Three Paths ──────────────────────────────────────────── */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-3 gap-6">
              {PATHS.map((path, i) => (
                <PathCard key={path.id} path={path} index={i} />
              ))}
            </div>
          </section>

          {/* ── System Requirements ──────────────────────────────────── */}
          <section className="mb-20">
            <div className="mb-8">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Prerequisites</p>
              <h2 className="text-2xl font-display font-bold text-white">System Requirements</h2>
              <p className="text-white/40 text-sm mt-1">For CLI and Framework paths</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {REQUIREMENTS.map((req) => (
                <div key={req.name} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-mono font-semibold text-sm text-white">{req.name}</h4>
                    <span className="text-xs font-mono text-[#7fffd4]/60 px-2 py-0.5 rounded-full bg-[#7fffd4]/10">
                      {req.version}
                    </span>
                  </div>
                  <p className="text-xs text-white/30">{req.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Quick Config ──────────────────────────────────────────── */}
          <section className="mb-20">
            <div className="mb-8">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Configuration</p>
              <h2 className="text-2xl font-display font-bold text-white">Quick Configuration</h2>
              <p className="text-white/40 text-sm mt-1">Essential environment variables for self-hosted setup</p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-xs text-white/30 font-mono">.env.local</span>
              </div>

              <div className="p-6 bg-black/40 font-mono text-sm space-y-1.5">
                <p className="text-white/25"># Required</p>
                <p><span className="text-[#7fffd4]/60">NEXT_PUBLIC_SUPABASE_URL</span><span className="text-white/20">=</span><span className="text-amber-400/60">your-project-url</span></p>
                <p><span className="text-[#7fffd4]/60">NEXT_PUBLIC_SUPABASE_ANON_KEY</span><span className="text-white/20">=</span><span className="text-amber-400/60">your-anon-key</span></p>
                <p className="pt-2 text-white/25"># AI Providers (at least one)</p>
                <p><span className="text-[#7fffd4]/60">GOOGLE_GENERATIVE_AI_API_KEY</span><span className="text-white/20">=</span><span className="text-amber-400/60">your-gemini-key</span></p>
                <p><span className="text-[#7fffd4]/60">ANTHROPIC_API_KEY</span><span className="text-white/20">=</span><span className="text-amber-400/60">your-claude-key</span></p>
                <p className="pt-2 text-white/25"># Optional</p>
                <p><span className="text-[#7fffd4]/60">NEXT_PUBLIC_APP_URL</span><span className="text-white/20">=</span><span className="text-amber-400/60">http://localhost:3000</span></p>
              </div>
            </div>
          </section>

          {/* ── What's Next ──────────────────────────────────────────── */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Continue</p>
              <h2 className="text-2xl font-display font-bold text-white">What&apos;s Next</h2>
              <p className="text-white/40 text-sm mt-1">Explore the ecosystem after setup</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {NEXT_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <Link
                    key={step.title}
                    href={step.href}
                    className="group rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all p-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center mb-3">
                      <Icon className={`w-5 h-5 ${step.accent}`} weight="duotone" />
                    </div>
                    <h3 className="font-display font-semibold text-white text-sm mb-1 group-hover:text-[#7fffd4] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-white/30">{step.description}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-white/15 mt-3 group-hover:text-[#7fffd4] transition-colors" />
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
