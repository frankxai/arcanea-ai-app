import { Metadata } from 'next';
import Link from 'next/link';
import { SplitText } from '@/components/motion/split-text';
import { LiquidGlass } from '@/components/motion/liquid-glass';
import { Magnetic } from '@/components/motion/magnetic';
import { Reveal, StaggerReveal } from '@/components/motion/reveal';
import { GradientMesh } from '@/components/motion/gradient-mesh';
import { NumberTicker } from '@/components/motion/number-ticker';

export const metadata: Metadata = {
  title: 'Templates — Build faster with Arcanea | Arcanea',
  description: 'Production-ready Next.js templates with liquid glass UI, AI chat, creator tools, and cosmic design system. MIT licensed. BYOK. Deploy in 60 seconds.',
  openGraph: {
    title: 'Arcanea Templates',
    description: 'Premium Next.js templates. Liquid glass UI. AI-native. MIT licensed.',
    type: 'website',
  },
};

const TEMPLATES = [
  {
    id: 'cosmic-landing',
    name: 'Cosmic Landing',
    tagline: 'Premium dark landing page with scroll choreography.',
    description: 'SplitText hero, GlowCard features, LiquidGlass pricing, Magnetic CTAs, GradientMesh background. 12 motion primitives included.',
    price: '$47',
    status: 'coming-soon' as const,
    color: '#00bcd4',
    stack: ['Next.js 16', 'Tailwind', 'Framer Motion', 'TypeScript'],
    features: ['12 motion primitives', 'Responsive', 'Dark mode', 'SEO ready'],
  },
  {
    id: 'ai-chat-starter',
    name: 'AI Chat Starter',
    tagline: 'Multi-model AI chat with BYOK and streaming.',
    description: 'Complete chat UI with provider routing, BYOK key management, streaming responses, conversation history, and 12 Luminor personas.',
    price: '$97',
    status: 'coming-soon' as const,
    color: '#a78bfa',
    stack: ['Next.js 16', 'Vercel AI SDK', 'Supabase', 'OpenRouter'],
    features: ['Multi-model', 'BYOK', 'Streaming', 'History'],
  },
  {
    id: 'creator-platform',
    name: 'Creator Platform',
    tagline: 'Full-stack creation ecosystem with worlds, library, and gallery.',
    description: 'Content management, reading progress, world-building engine, gallery with reactions, creator profiles, and 190K+ words of creative philosophy.',
    price: '$197',
    status: 'coming-soon' as const,
    color: '#f472b6',
    stack: ['Next.js 16', 'Supabase', 'R3F', 'MCP'],
    features: ['World engine', 'Content CMS', 'Gallery', 'Profiles'],
  },
  {
    id: 'glass-dashboard',
    name: 'Glass Dashboard',
    tagline: 'Liquid glass admin dashboard with real-time data.',
    description: 'LiquidGlass v2 cards, animated charts, stat tickers, command palette, sidebar navigation. Premium dark theme with cosmic depth.',
    price: '$97',
    status: 'coming-soon' as const,
    color: '#fbbf24',
    stack: ['Next.js 16', 'Tailwind', 'Radix UI', 'Framer Motion'],
    features: ['Glass cards', 'Charts', 'Command palette', 'Sidebar'],
  },
  {
    id: 'component-kit',
    name: 'Component Kit',
    tagline: '40+ production components with Arcanea design tokens.',
    description: '12 motion primitives (SplitText, TiltCard, GlowCard, LiquidGlass, Magnetic, Marquee, NumberTicker, AnimatedBeam, etc.) + 28 UI components.',
    price: '$29',
    status: 'coming-soon' as const,
    color: '#34d399',
    stack: ['React 19', 'Tailwind', 'Framer Motion', 'Radix UI'],
    features: ['40+ components', 'Motion library', 'Design tokens', 'TypeScript'],
  },
];

const STATS = [
  { value: 12, suffix: '', label: 'Motion primitives' },
  { value: 40, suffix: '+', label: 'UI components' },
  { value: 5, suffix: '', label: 'Templates' },
];

export default function TemplatesPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <GradientMesh colors={['#00bcd4', '#a78bfa', '#fbbf24']} intensity={0.05} />
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-24 pb-16 text-center">
          <Reveal y={12} blur>
            <p className="text-[11px] font-mono tracking-[0.3em] text-[#708094] mb-6 uppercase">
              MIT Licensed · BYOK · Deploy in 60 seconds
            </p>
          </Reveal>

          <SplitText
            as="h1"
            text="Ship faster."
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-[#e6eefc] mb-3 tracking-tight"
            delay={0.15}
            stagger={0.04}
          />
          <Reveal delay={0.6} y={12}>
            <p className="text-lg md:text-xl text-[#9bb1d0] max-w-2xl mx-auto leading-relaxed">
              Production-ready Next.js templates with liquid glass UI, AI chat,
              and the Arcanea design system. Your keys, your data, your product.
            </p>
          </Reveal>

          {/* Stats */}
          <Reveal y={16} delay={0.9}>
            <div className="flex justify-center gap-10 mt-10">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-display font-bold text-[#e6eefc]">
                    <NumberTicker value={s.value} suffix={s.suffix} delay={1.0} />
                  </p>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-[#708094] mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Template Grid */}
        <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16" stagger={0.08} delay={0.2}>
          {TEMPLATES.map((t) => (
            <Reveal key={t.id} y={20}>
              <LiquidGlass
                intensity="standard"
                tint={t.color}
                glow
                className="rounded-2xl border border-white/[0.06] hover:border-white/[0.14] transition-colors h-full"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color, boxShadow: `0 0 12px ${t.color}60` }} />
                        <h3 className="text-base font-display font-semibold text-[#e6eefc]">{t.name}</h3>
                      </div>
                      <p className="text-xs text-[#708094]">{t.tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-display font-bold text-[#e6eefc]">{t.price}</p>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-[#708094]">
                        {t.status === 'coming-soon' ? 'Coming soon' : 'Available'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#9bb1d0] leading-relaxed mb-4 flex-1">{t.description}</p>

                  {/* Stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {t.stack.map((s) => (
                      <span key={s} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[#708094]">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-5">
                    {t.features.map((f) => (
                      <span key={f} className="text-[10px] text-[#708094] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#00bcd4]/60" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Magnetic>
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl text-xs font-medium border transition-colors"
                      style={{
                        color: t.color,
                        borderColor: `${t.color}30`,
                        backgroundColor: `${t.color}08`,
                      }}
                    >
                      Coming soon
                    </button>
                  </Magnetic>
                </div>
              </LiquidGlass>
            </Reveal>
          ))}
        </StaggerReveal>

        {/* Bottom CTA */}
        <Reveal y={16} className="pb-24 text-center">
          <p className="text-sm text-[#708094] mb-4">
            All templates use MIT-licensed dependencies. Your keys, your data, your product.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Magnetic>
              <Link
                href="/ecosystem"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-[#e6eefc] hover:bg-white/[0.08] transition-colors"
              >
                Explore the ecosystem
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="https://github.com/frankxai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-[#e6eefc] hover:bg-white/[0.08] transition-colors"
              >
                View source on GitHub
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
