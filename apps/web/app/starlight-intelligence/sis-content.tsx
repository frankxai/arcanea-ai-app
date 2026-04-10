'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { VAULT_CONFIG, VAULT_CATEGORIES, type VaultCategory } from '@/lib/vault-data';
import { EASE, VIEWPORT } from '@/lib/motion';
import { SplitText } from '@/components/motion/split-text';
import { TiltCard } from '@/components/motion/tilt-card';
import { Magnetic } from '@/components/motion/magnetic';
import { SisArchitecture } from './sis-architecture';

const ADAPTERS = [
  { name: 'Claude Code', desc: 'MCP server integration' },
  { name: 'Cursor', desc: 'Rules file + vault access' },
  { name: 'OpenCode', desc: 'TUI with vault commands' },
  { name: 'Gemini', desc: 'Context injection' },
  { name: 'Codex', desc: 'Thin vault pointer' },
  { name: 'Any MCP Client', desc: 'Universal protocol' },
];

const API_EXAMPLE = `GET /api/vaults/frank

{
  "name": "Frank",
  "vaults": {
    "strategic": { "count": 4, "latest": "BYOK-first is better than managed..." },
    "technical": { "count": 6, "latest": "R2 has free egress..." },
    "creative":  { "count": 3, "latest": "NEVER use Cinzel font..." },
    "operational": { "count": 4, "latest": "Focused sequential engineering..." },
    "wisdom":    { "count": 0 },
    "horizon":   { "count": 1, "latest": "We are building SIS to become..." }
  }
}`;

const HOW_STEPS = [
  {
    step: '01',
    title: 'Store locally',
    desc: 'Insights save to ~/.starlight/ as plain JSONL files. Human-readable. Git-friendly. No database.',
  },
  {
    step: '02',
    title: 'Connect via MCP',
    desc: 'The SIS MCP server exposes vault_remember, vault_recall, and horizon_append to any AI tool.',
  },
  {
    step: '03',
    title: 'Memory compounds',
    desc: 'Every session builds on the last. Confidence scores, vault routing, and cross-vault synthesis grow over time.',
  },
];

export function SisContent() {
  return (
    <LazyMotion features={domAnimation}>
      <main className="max-w-5xl mx-auto px-6">
        {/* ── Hero ── */}
        <section className="pt-24 pb-24 text-center">
          <m.p
            className="text-xs font-mono tracking-[0.3em] text-[#708094] mb-6 uppercase"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE.smooth }}
          >
            Open Source · Local-first
          </m.p>

          <SplitText
            as="h1"
            text="Persistent memory"
            className="text-4xl md:text-6xl font-display font-bold text-[#e6eefc] mb-2 tracking-tight"
            delay={0.2}
            stagger={0.04}
          />
          <SplitText
            as="h1"
            text="for AI agents."
            className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tight bg-gradient-to-r from-[#00bcd4] via-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent"
            delay={0.7}
            stagger={0.04}
          />

          <m.p
            className="text-lg text-[#9bb1d0] max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.smooth, delay: 1.3 }}
          >
            6 semantic vaults. 5 cognitive layers. Local JSONL files. Works with every AI tool
            through MCP. Your intelligence compounds instead of resetting.
          </m.p>
        </section>

        {/* ── 5-Layer Architecture (animated) ── */}
        <section className="pb-24">
          <SisArchitecture />
        </section>

        {/* ── 6 Vaults ── */}
        <section className="pb-24">
          <m.h2
            className="text-[10px] font-mono tracking-[0.25em] text-[#708094] mb-8 uppercase"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE.smooth }}
          >
            6 Semantic Vaults
          </m.h2>
          <m.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
            }}
          >
            {VAULT_CATEGORIES.map((cat) => {
              const config = VAULT_CONFIG[cat as VaultCategory];
              return (
                <m.div
                  key={cat}
                  variants={{
                    hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.6, ease: EASE.smooth },
                    },
                  }}
                >
                  <TiltCard intensity={6}>
                    <Link
                      href={`/vault/${cat}`}
                      className="group block p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: config.color, boxShadow: `0 0 12px ${config.color}60` }}
                        />
                        <span className="text-sm font-semibold text-[#e6eefc]">{config.label}</span>
                        <span className="text-[9px] text-[#708094] font-mono tracking-[0.1em] uppercase ml-auto">
                          {config.guardian}
                        </span>
                      </div>
                      <p className="text-xs text-[#708094]">{config.tagline}</p>
                    </Link>
                  </TiltCard>
                </m.div>
              );
            })}
          </m.div>
        </section>

        {/* ── How It Works (sticky steps) ── */}
        <section className="pb-24">
          <m.h2
            className="text-[10px] font-mono tracking-[0.25em] text-[#708094] mb-8 uppercase"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE.smooth }}
          >
            How It Works
          </m.h2>
          <div className="grid md:grid-cols-3 gap-4">
            {HOW_STEPS.map((item, i) => (
              <m.div
                key={item.step}
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, ease: EASE.smooth, delay: i * 0.15 }}
              >
                <TiltCard intensity={5}>
                  <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm h-full">
                    <p className="text-[11px] font-mono tracking-[0.2em] text-[#00bcd4] mb-4">{item.step}</p>
                    <p className="text-sm font-semibold text-[#e6eefc] mb-1 tracking-tight">{item.title}</p>
                    <p className="text-xs text-[#708094] leading-relaxed">{item.desc}</p>
                  </div>
                </TiltCard>
              </m.div>
            ))}
          </div>
        </section>

        {/* ── Privacy ── */}
        <section className="pb-24">
          <m.h2
            className="text-[10px] font-mono tracking-[0.25em] text-[#708094] mb-8 uppercase"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE.smooth }}
          >
            Privacy Model
          </m.h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: '~/.starlight/',
                body: 'Private. Never leaves your machine. All vault files, profile, and config stay local. You own the files.',
              },
              {
                title: 'public-vault/',
                body: 'Opt-in. Push selected insights to a GitHub repo. Powers the constellation and the Agent API.',
              },
            ].map((item, i) => (
              <m.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, ease: EASE.smooth, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
              >
                <p className="text-sm font-mono text-[#e6eefc] mb-2">{item.title}</p>
                <p className="text-xs text-[#708094] leading-relaxed">{item.body}</p>
              </m.div>
            ))}
          </div>
        </section>

        {/* ── Platform Adapters ── */}
        <section className="pb-24">
          <m.h2
            className="text-[10px] font-mono tracking-[0.25em] text-[#708094] mb-8 uppercase"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE.smooth }}
          >
            Platform Adapters
          </m.h2>
          <m.div
            className="grid grid-cols-2 md:grid-cols-3 gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {ADAPTERS.map((a) => (
              <m.div
                key={a.name}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.smooth } },
                }}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <p className="text-xs font-semibold text-[#e6eefc]">{a.name}</p>
                <p className="text-[10px] text-[#708094]">{a.desc}</p>
              </m.div>
            ))}
          </m.div>
        </section>

        {/* ── Agent API ── */}
        <section className="pb-24">
          <m.h2
            className="text-[10px] font-mono tracking-[0.25em] text-[#708094] mb-8 uppercase"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE.smooth }}
          >
            Agent API
          </m.h2>
          <m.div
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE.smooth }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden"
          >
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/15" />
                <div className="w-2 h-2 rounded-full bg-white/15" />
                <div className="w-2 h-2 rounded-full bg-white/15" />
              </div>
              <span className="text-[10px] font-mono text-[#34d399] font-bold ml-2">GET</span>
              <span className="text-xs font-mono text-[#708094]">/api/vaults/frank</span>
            </div>
            <pre className="p-5 text-xs font-mono text-[#9bb1d0] overflow-x-auto leading-relaxed">
              {API_EXAMPLE}
            </pre>
          </m.div>
        </section>

        {/* ── CTAs ── */}
        <section className="pb-32 text-center">
          <m.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE.smooth }}
          >
            <Magnetic>
              <a
                href="https://starlightintelligence.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-[#09090b] font-semibold text-sm hover:shadow-[0_0_40px_rgba(0,188,212,0.3)] transition-shadow"
              >
                Deploy your vault
              </a>
            </Magnetic>
            <Magnetic>
              <Link
                href="/arcanea-vault"
                className="inline-block px-8 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-[#e6eefc] hover:bg-white/[0.08] transition-colors"
              >
                Explore the constellation
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="https://github.com/frankxai/Starlight-Intelligence-System"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-[#e6eefc] hover:bg-white/[0.08] transition-colors"
              >
                View on GitHub
              </a>
            </Magnetic>
          </m.div>
        </section>
      </main>
    </LazyMotion>
  );
}
