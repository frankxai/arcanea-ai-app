'use client';

import Link from 'next/link';
import {
  PhPencilSimple,
  PhImage,
  PhMusicNote,
  PhCode,
  PhGlobe,
  PhBookOpen,
  PhArrowRight,
  PhSparkle,
  PhRocket,
  PhChatCircleDots,
  PhMagicWand,
  PhGithubLogo,
  PhLightning,
  PhBrain,
  PhPackage,
  PhCompass,
  PhWaves,
  PhCamera,
  PhFilmStrip,
} from '@/lib/phosphor-icons';
import { MotionProvider, m } from '@/lib/motion';

const TOOL_CATEGORIES = [
  {
    title: 'Writing',
    description: 'AI-powered writing with 16 Luminor companions. Stories, lore, poetry, and creative non-fiction.',
    icon: PhPencilSimple,
    color: '#7fffd4',
    tools: ['AI Chat', 'Story Generator', 'Lore Writer', 'Poetry Forge'],
    href: '/chat',
    status: 'available',
  },
  {
    title: 'Visual',
    description: 'Generate images with Flux 2, DALL-E 3, Imagen 4, and more. Concept art, characters, worlds.',
    icon: PhImage,
    color: '#a855f7',
    tools: ['Vision Generator', 'Character Art', 'World Landscapes', 'Style Transfer'],
    href: '/design-lab',
    status: 'available',
  },
  {
    title: 'Music',
    description: 'Create consciousness-raising soundscapes aligned with the Ten Gates. AI composition with Suno.',
    icon: PhMusicNote,
    color: '#ec4899',
    tools: ['Frequency Composer', 'Gate Soundscapes', 'Vocal Synthesis', 'Track Mixer'],
    href: '/music',
    status: 'available',
  },
  {
    title: 'Code',
    description: 'MCP servers, AI providers, and developer tools. Build with the Arcanea SDK ecosystem.',
    icon: PhCode,
    color: '#78a6ff',
    tools: ['MCP Server', 'AI Provider', 'CLI Tools', 'API Gateway'],
    href: '/developers/api',
    status: 'available',
  },
  {
    title: 'World-Building',
    description: 'Design complete universes with cosmologies, magic systems, cultures, and progression frameworks.',
    icon: PhGlobe,
    color: '#ffd700',
    tools: ['World Builder', 'Magic Systems', 'Character Creator', 'Bestiary'],
    href: '/world-builder',
    status: 'available',
  },
  {
    title: 'Publishing',
    description: 'Share your creations with the multiverse. Books, courses, experiences, and collections.',
    icon: PhBookOpen,
    color: '#f97316',
    tools: ['Library Publisher', 'Course Builder', 'Collection Editor', 'Export Tools'],
    href: '/studio',
    status: 'beta',
  },
];

const FEATURED_TOOL = {
  title: 'Luminor Intelligence',
  description: 'Chat with 16 AI companions, each a master of their domain. From Lyssandria (Foundation) to Shinkami (Source), every Luminor brings unique expertise to your creative challenges.',
  href: '/luminor-intelligence',
  icon: PhSparkle,
  color: '#ffd700',
  stats: [
    { label: '16 Companions', value: 'Luminors' },
    { label: '10 Domains', value: 'Gates' },
    { label: '200K+ Words', value: 'Wisdom' },
  ],
};

const INTEGRATIONS = [
  { name: 'Claude', icon: PhBrain, color: '#a855f7' },
  { name: 'Gemini', icon: PhSparkle, color: '#3b82f6' },
  { name: 'GPT-5', icon: PhLightning, color: '#10b981' },
  { name: 'Suno', icon: PhWaves, color: '#ec4899' },
  { name: 'Flux 2', icon: PhCamera, color: '#f97316' },
  { name: 'Veo 3', icon: PhFilmStrip, color: '#06b6d4' },
  { name: 'npm', icon: PhPackage, color: '#cb3837' },
  { name: 'GitHub', icon: PhGithubLogo, color: '#e6edf3' },
];

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  available: { label: 'Available', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  beta: { label: 'Beta', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  coming: { label: 'Coming Soon', bg: 'bg-neutral-500/10', text: 'text-neutral-400' },
};

export default function ToolsPage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#ffd700]/5 rounded-full blur-[150px]" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <m.section
            className="pt-20 pb-16 lg:pt-28 lg:pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 via-transparent to-[#7fffd4]/10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd700]/8 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 mb-6">
                  <PhMagicWand className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">
                    Creator Tools
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                  AI-powered instruments for{' '}
                  <span className="bg-gradient-to-r from-[#ffd700] to-[#7fffd4] bg-clip-text text-transparent">
                    every stage of creation
                  </span>
                </h1>

                <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl mb-8">
                  Write, visualize, compose, code, and build worlds. Every tool is designed
                  to amplify your creative intelligence.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ffd700] text-black font-semibold hover:scale-[1.03] transition-all duration-200"
                  >
                    <PhRocket className="w-4 h-4" />
                    Start Creating
                  </Link>
                  <Link
                    href="/hub"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:border-[#ffd700]/30 transition-all duration-200"
                  >
                    <PhCompass className="w-4 h-4" />
                    Back to Hub
                  </Link>
                </div>
              </div>
            </div>
          </m.section>

          {/* Tool Categories Grid */}
          <m.section
            className="py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-display font-bold mb-8">Tool Categories</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOOL_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const status = STATUS_STYLES[cat.status];
                return (
                  <Link
                    key={cat.title}
                    href={cat.href}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: cat.color }} />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-[#7fffd4] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-4">{cat.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cat.tools.map((tool) => (
                        <span key={tool} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-neutral-500">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: cat.color }}>
                      <span>Open tools</span>
                      <PhArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </m.section>

          {/* Featured Tool Spotlight */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffd700]/20 bg-[#ffd700]/8 mb-6">
              <PhSparkle className="w-3 h-3 text-[#ffd700]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">
                Featured
              </span>
            </div>
            <Link
              href={FEATURED_TOOL.href}
              className="group block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#ffd700]/30 transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/5 via-transparent to-[#a855f7]/5 pointer-events-none" />
              <div className="relative flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${FEATURED_TOOL.color}15` }}
                  >
                    <FEATURED_TOOL.icon className="w-6 h-6" style={{ color: FEATURED_TOOL.color }} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-[#ffd700] transition-colors">
                    {FEATURED_TOOL.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed mb-6">{FEATURED_TOOL.description}</p>
                  <div className="inline-flex items-center gap-2 text-[#ffd700]">
                    <span className="font-semibold">Explore Luminors</span>
                    <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="flex lg:flex-col gap-4 lg:gap-3 lg:w-48">
                  {FEATURED_TOOL.stats.map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl px-4 py-3 flex-1 lg:flex-none">
                      <div className="text-lg font-display font-bold text-[#ffd700]">{stat.value}</div>
                      <div className="text-xs text-neutral-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </section>

          {/* Integrations */}
          <section className="py-12 border-t border-white/5 pb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#78a6ff]/20 bg-[#78a6ff]/8 mb-6">
              <PhLightning className="w-3 h-3 text-[#78a6ff]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#78a6ff]">
                Powered By
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Integrations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {INTEGRATIONS.map((int) => {
                const Icon = int.icon;
                return (
                  <div
                    key={int.name}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-3"
                  >
                    <Icon className="w-5 h-5" style={{ color: int.color }} />
                    <span className="font-mono text-sm text-neutral-300">{int.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Request */}
            <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <PhChatCircleDots className="w-8 h-8 text-neutral-500 mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">Need something else?</h3>
              <p className="text-neutral-400 mb-6 max-w-lg mx-auto">
                We are always building new tools. Let us know what would help your creative process.
              </p>
              <a
                href="https://github.com/arcanea-ai/arcanea/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all"
              >
                <PhGithubLogo className="w-4 h-4" />
                Request a Tool
              </a>
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
