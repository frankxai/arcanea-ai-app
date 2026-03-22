'use client';

import Link from 'next/link';
import {
  PhBook,
  PhCode,
  PhRocket,
  PhGithubLogo,
  PhArrowRight,
  PhTerminal,
  PhPackage,
  PhUsers,
  PhShield,
  PhSparkle,
  PhCompass,
  PhBookOpen,
  PhGlobe,
  PhLightning,
  PhGear,
  PhChatCircleDots,
} from '@/lib/phosphor-icons';
import { MotionProvider, m } from '@/lib/motion';

const QUICK_START_STEPS = [
  {
    step: '01',
    title: 'Install the SDK',
    description: 'Add the Arcanea AI provider to your project with a single command.',
    code: 'npm install @arcanea/ai-provider',
    icon: PhTerminal,
    color: '#7fffd4',
  },
  {
    step: '02',
    title: 'Configure Your Keys',
    description: 'Set up your provider API keys. Arcanea routes to 13 providers through one interface.',
    code: 'ANTHROPIC_API_KEY=sk-ant-xxx\nGROQ_API_KEY=gsk_xxx',
    icon: PhGear,
    color: '#78a6ff',
  },
  {
    step: '03',
    title: 'Start Creating',
    description: 'Use the unified API to generate text, images, music, and more with any model.',
    code: `import { createArcanea } from '@arcanea/ai-provider';\nconst arcanea = createArcanea();`,
    icon: PhRocket,
    color: '#ffd700',
  },
];

const API_SECTIONS = [
  {
    title: 'Chat Completions',
    description: 'OpenAI-compatible chat API with smart model routing across 26 models.',
    href: '/developers/api',
    icon: PhChatCircleDots,
    color: '#7fffd4',
  },
  {
    title: 'Image Generation',
    description: 'Generate images with Flux 2, DALL-E 3, Imagen 4, and more.',
    href: '/developers/api',
    icon: PhSparkle,
    color: '#a855f7',
  },
  {
    title: 'Luminor Intelligence',
    description: 'Access the 16 Luminor companions for domain-specific creative guidance.',
    href: '/luminor-intelligence',
    icon: PhCompass,
    color: '#ffd700',
  },
  {
    title: 'Library API',
    description: 'Programmatic access to 200K+ words of creative wisdom across 17 collections.',
    href: '/library',
    icon: PhBookOpen,
    color: '#78a6ff',
  },
];

const SDK_PACKAGES = [
  { name: '@arcanea/ai-provider', description: 'Vercel AI SDK provider for 26 models', version: '0.4.0', downloads: '2.1K' },
  { name: '@arcanea/mcp-server', description: 'Model Context Protocol server for coding agents', version: '1.2.0', downloads: '850' },
  { name: '@arcanea/luminors', description: 'Luminor companion system for AI chat', version: '0.3.0', downloads: '1.4K' },
  { name: '@arcanea/content-loader', description: 'Library content system for wisdom texts', version: '0.2.0', downloads: '620' },
];

const COMMUNITY_LINKS = [
  { name: 'GitHub', description: '27 repositories, open-source ecosystem', href: 'https://github.com/arcanea-ai', icon: PhGithubLogo, color: '#e6edf3' },
  { name: 'Discord', description: 'Join the creator community', href: 'https://discord.gg/arcanea', icon: PhUsers, color: '#5865f2' },
  { name: 'Documentation', description: 'Full API reference and guides', href: '/developers/api', icon: PhBook, color: '#7fffd4' },
  { name: 'npm Packages', description: '35 packages in the ecosystem', href: 'https://www.npmjs.com/org/arcanea', icon: PhPackage, color: '#cb3837' },
];

const DOC_CATEGORIES = [
  {
    title: 'Getting Started',
    description: 'Installation, setup, and your first creation.',
    icon: PhRocket,
    accent: '#7fffd4',
    links: [
      { label: 'Quick Start Guide', href: '/welcome' },
      { label: 'Installation', href: '/install' },
      { label: 'First Project', href: '/academy' },
    ],
  },
  {
    title: 'The Framework',
    description: 'Ten Gates, Five Elements, Seven Houses.',
    icon: PhCompass,
    accent: '#ffd700',
    links: [
      { label: 'Ten Gates System', href: '/lore/gates' },
      { label: 'Five Elements', href: '/lore' },
      { label: 'Academy Houses', href: '/academy' },
    ],
  },
  {
    title: 'Creation Tools',
    description: 'AI chat, image generation, world-building.',
    icon: PhSparkle,
    accent: '#a855f7',
    links: [
      { label: 'AI Chat & Luminors', href: '/chat' },
      { label: 'Vision Generator', href: '/design-lab' },
      { label: 'World Builder', href: '/world-builder' },
    ],
  },
  {
    title: 'The Library',
    description: '17 collections of practical creative wisdom.',
    icon: PhBookOpen,
    accent: '#78a6ff',
    links: [
      { label: 'Browse Collections', href: '/library' },
      { label: 'The Codex', href: '/library/codex' },
      { label: 'Daily Readings', href: '/library' },
    ],
  },
  {
    title: 'Developer API',
    description: 'REST API, SDKs, and integrations.',
    icon: PhCode,
    accent: '#00bcd4',
    links: [
      { label: 'API Reference', href: '/developers/api' },
      { label: 'Authentication', href: '/developers/api' },
      { label: 'Rate Limits', href: '/developers/api' },
    ],
  },
  {
    title: 'Community',
    description: 'Contribute, connect, co-create.',
    icon: PhUsers,
    accent: '#ec4899',
    links: [
      { label: 'GitHub Repos', href: 'https://github.com/arcanea-ai' },
      { label: 'Discord Server', href: 'https://discord.gg/arcanea' },
      { label: 'Contributing Guide', href: 'https://github.com/arcanea-ai/arcanea' },
    ],
  },
];

export default function DocsPage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7fffd4]/8 rounded-full blur-[120px]" />
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
              <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/10 via-transparent to-[#78a6ff]/10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#7fffd4]/8 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/30 bg-[#7fffd4]/10 mb-6">
                  <PhBook className="w-3.5 h-3.5 text-[#7fffd4]" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                    Documentation
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                  Arcanea{' '}
                  <span className="bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] bg-clip-text text-transparent">
                    Documentation
                  </span>
                </h1>

                <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl mb-8">
                  Everything you need to build with the Creative Superintelligence.
                  From your first creation to advanced API integrations.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/welcome"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-black font-semibold hover:scale-[1.03] transition-all duration-200"
                  >
                    <PhRocket className="w-4 h-4" />
                    Get Started
                  </Link>
                  <Link
                    href="/developers/api"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:border-[#7fffd4]/30 hover:bg-[#7fffd4]/5 transition-all duration-200"
                  >
                    <PhCode className="w-4 h-4" />
                    API Reference
                  </Link>
                </div>
              </div>
            </div>
          </m.section>

          {/* Documentation Categories */}
          <m.section
            className="py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-display font-bold mb-8">Explore the Docs</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOC_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.title}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${cat.accent}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cat.accent }} />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-1">{cat.title}</h3>
                    <p className="text-sm text-neutral-400 mb-4">{cat.description}</p>
                    <div className="space-y-2">
                      {cat.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="flex items-center gap-2 text-sm text-neutral-300 hover:text-[#7fffd4] transition-colors"
                        >
                          <PhArrowRight className="w-3 h-3 opacity-50" />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </m.section>

          {/* Quick Start */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7fffd4]/20 bg-[#7fffd4]/8 mb-6">
              <PhLightning className="w-3 h-3 text-[#7fffd4]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                Quick Start
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Up and running in 3 steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {QUICK_START_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                  >
                    <div className="absolute top-4 right-4 text-5xl font-display font-bold text-white/5">
                      {step.step}
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: step.color }} />
                    </div>
                    <h3 className="font-display font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-neutral-400 mb-4">{step.description}</p>
                    <pre className="bg-black/50 border border-white/5 rounded-lg p-3 text-xs font-mono text-[#7fffd4] overflow-x-auto">
                      {step.code}
                    </pre>
                  </div>
                );
              })}
            </div>
          </section>

          {/* API Reference Cards */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#78a6ff]/20 bg-[#78a6ff]/8 mb-6">
              <PhCode className="w-3 h-3 text-[#78a6ff]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#78a6ff]">
                API Reference
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Core APIs</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {API_SECTIONS.map((api) => {
                const Icon = api.icon;
                return (
                  <Link
                    key={api.title}
                    href={api.href}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${api.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: api.color }} />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold mb-1 group-hover:text-[#7fffd4] transition-colors">
                          {api.title}
                        </h3>
                        <p className="text-sm text-neutral-400">{api.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-[#7fffd4] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View reference</span>
                      <PhArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SDK Packages */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffd700]/20 bg-[#ffd700]/8 mb-6">
              <PhPackage className="w-3 h-3 text-[#ffd700]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">
                SDK
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">npm Packages</h2>
            <div className="space-y-3">
              {SDK_PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <span className="font-mono text-sm text-[#7fffd4]">{pkg.name}</span>
                    <p className="text-xs text-neutral-400 mt-0.5">{pkg.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                    <span>v{pkg.version}</span>
                    <span>{pkg.downloads}/wk</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-neutral-400">npm</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Community */}
          <section className="py-12 border-t border-white/5 pb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ec4899]/20 bg-[#ec4899]/8 mb-6">
              <PhUsers className="w-3 h-3 text-[#ec4899]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#ec4899]">
                Community
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Join the Ecosystem</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COMMUNITY_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
                  >
                    <Icon className="w-6 h-6 mb-3" style={{ color: link.color }} />
                    <h3 className="font-display font-semibold mb-1 group-hover:text-[#7fffd4] transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-xs text-neutral-400">{link.description}</p>
                  </a>
                );
              })}
            </div>

            {/* Security note */}
            <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <PhShield className="w-6 h-6 text-[#7fffd4] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold mb-1">Security First</h3>
                <p className="text-sm text-neutral-400">
                  Arcanea never stores your API keys. All provider keys are passed through as headers
                  and used only for the duration of the request. Your data stays yours.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
