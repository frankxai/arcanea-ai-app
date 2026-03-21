'use client';

import { motion } from 'framer-motion';
import { ChatCircleDots, Books, Sparkle, GithubLogo, ArrowRight, Fire, Drop, Leaf, Wind, Planet } from '@/lib/phosphor-icons';

/* ─────────────────────────────────────────────
   Variation 2 — "Bento Grid"
   Inspired by Apple / Linear / Vercel
   Dark, structured, information-dense.
   Everything organized into a beautiful bento layout.
   ───────────────────────────────────────────── */

// ── palette ──────────────────────────────────
const BG = '#09090b';
const CARD = '#18181b';
const BORDER = 'rgba(255,255,255,0.06)';
const BORDER_HOVER = 'rgba(255,255,255,0.12)';
const TEXT = '#fafafa';
const MUTED = 'rgba(255,255,255,0.5)';
const VIOLET = '#8b5cf6';
const TEAL = '#7fffd4';
const GOLD = '#ffd700';

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444',
  Water: '#3b82f6',
  Earth: '#22c55e',
  Wind: '#f5f5f5',
  Void: '#a855f7',
};

// ── guardian data ────────────────────────────
const GUARDIANS = [
  { name: 'Lyssandria', element: 'Earth' },
  { name: 'Leyla', element: 'Water' },
  { name: 'Draconia', element: 'Fire' },
  { name: 'Maylinn', element: 'Earth' },
  { name: 'Alera', element: 'Wind' },
  { name: 'Lyria', element: 'Void' },
  { name: 'Aiyami', element: 'Fire' },
  { name: 'Elara', element: 'Void' },
  { name: 'Ino', element: 'Water' },
  { name: 'Shinkami', element: 'Fire' },
];

// ── animation ────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

// ── steps data ───────────────────────────────
const STEPS = [
  { n: '01', label: 'Choose a companion', desc: 'Pick from 16 Luminors' },
  { n: '02', label: 'Describe your vision', desc: 'Text, image, code, music' },
  { n: '03', label: 'Co-create together', desc: 'Real-time collaboration' },
  { n: '04', label: 'Share & evolve', desc: 'Publish to the community' },
];

// ── cell wrapper ─────────────────────────────
function Cell({
  children,
  className = '',
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-[20px] p-6 transition-all duration-300 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${CARD} 0%, rgba(24,24,27,0.8) 100%)`,
        border: `1px solid ${BORDER}`,
      }}
      whileHover={{
        scale: 1.02,
        borderColor: BORDER_HOVER,
        boxShadow: accent ? `inset 0 0 40px ${accent}15` : `inset 0 0 40px rgba(255,255,255,0.02)`,
      }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

// ── chat mockup ──────────────────────────────
function ChatMockup() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-full" style={{ background: `linear-gradient(135deg, ${VIOLET}, ${TEAL})` }} />
        <span className="text-sm font-medium" style={{ color: TEXT }}>Draconia</span>
        <span className="text-xs ml-auto" style={{ color: MUTED }}>Guardian of Fire</span>
      </div>
      <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)' }}>
        What would you like to create today? I can help with writing, brainstorming, or transforming your ideas.
      </div>
      <div className="rounded-xl px-4 py-3 text-sm self-end" style={{ background: `${VIOLET}22`, color: TEXT, border: `1px solid ${VIOLET}33` }}>
        Help me write a short story about transformation
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
        <span className="text-xs" style={{ color: MUTED }}>Draconia is composing...</span>
      </div>
    </div>
  );
}

// ── main component ───────────────────────────
export function V2Bento() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: BG, color: TEXT }}>
      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '60vh' }}>
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${VIOLET}12 0%, transparent 70%)` }}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 text-center md:py-28">
          <motion.h1
            className="mx-auto max-w-4xl font-bold leading-[1.05] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4rem)', fontFamily: 'Inter, system-ui, sans-serif' }}
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Living Intelligence{' '}
            <span style={{ background: `linear-gradient(90deg, ${VIOLET}, ${TEAL}, ${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              for Creators
            </span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-5 max-w-lg text-base md:text-lg"
            style={{ color: MUTED, lineHeight: 1.7 }}
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            10 AI companions. 62 wisdom texts. One creative universe.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <a
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${VIOLET}, ${TEAL})` }}
            >
              Start Creating
              <ArrowRight size={16} weight="bold" />
            </a>
            <a
              href="/docs/api"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold transition-colors"
              style={{ color: MUTED, border: `1px solid ${BORDER}` }}
            >
              API Docs
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Bento Grid ── */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <motion.div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 'minmax(180px, auto)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* AI Chat — 2x2 */}
          <motion.div className="col-span-2 row-span-2" custom={0} variants={fadeUp}>
            <Cell className="h-full" accent={VIOLET}>
              <div className="mb-4 flex items-center gap-2">
                <ChatCircleDots size={20} weight="duotone" style={{ color: VIOLET }} />
                <span className="text-sm font-semibold tracking-wide uppercase" style={{ color: MUTED }}>AI Chat</span>
              </div>
              <ChatMockup />
            </Cell>
          </motion.div>

          {/* 10 Guardians — 1x2 */}
          <motion.div className="col-span-1 row-span-2" custom={1} variants={fadeUp}>
            <Cell className="h-full" accent={GOLD}>
              <p className="text-sm font-semibold tracking-wide uppercase mb-4" style={{ color: MUTED }}>10 Guardians</p>
              <ul className="flex flex-col gap-2">
                {GUARDIANS.map((g) => (
                  <li key={g.name} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <span className="inline-block h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: ELEMENT_COLORS[g.element] }} />
                    {g.name}
                  </li>
                ))}
              </ul>
            </Cell>
          </motion.div>

          {/* Intelligence Gateway — 2x1 (remaining top-right) */}
          <motion.div className="col-span-1 row-span-2" custom={2} variants={fadeUp}>
            <Cell className="h-full flex flex-col justify-between" accent={TEAL}>
              <div>
                <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: MUTED }}>Intelligence Gateway</p>
                <p className="text-2xl font-bold leading-tight">26 models.</p>
                <p className="text-2xl font-bold leading-tight">13 providers.</p>
                <p className="text-2xl font-bold leading-tight" style={{ color: TEAL }}>One API.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Cohere'].map((m) => (
                  <span key={m} className="rounded-md px-2 py-1 text-[11px] font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: MUTED }}>
                    {m}
                  </span>
                ))}
              </div>
            </Cell>
          </motion.div>

          {/* Library — 1x1 */}
          <motion.div className="col-span-1 row-span-1" custom={3} variants={fadeUp}>
            <Cell className="h-full flex flex-col justify-between" accent={GOLD}>
              <Books size={28} weight="duotone" style={{ color: GOLD }} />
              <div className="mt-auto">
                <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: MUTED }}>Library</p>
                <p className="text-3xl font-bold mt-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>62</p>
                <p className="text-xs" style={{ color: MUTED }}>wisdom texts</p>
              </div>
            </Cell>
          </motion.div>

          {/* Create — 1x1 */}
          <motion.div className="col-span-1 row-span-1" custom={4} variants={fadeUp}>
            <Cell className="h-full flex flex-col justify-between" accent={VIOLET}>
              <Sparkle size={28} weight="duotone" style={{ color: VIOLET }} />
              <div className="mt-auto">
                <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: MUTED }}>Create</p>
                <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Forge your vision with AI</p>
              </div>
            </Cell>
          </motion.div>

          {/* Five Elements — 2x1 */}
          <motion.div className="col-span-2 row-span-1" custom={5} variants={fadeUp}>
            <Cell className="h-full" accent={ELEMENT_COLORS.Fire}>
              <p className="text-sm font-semibold tracking-wide uppercase mb-5" style={{ color: MUTED }}>The Five Elements</p>
              <div className="flex items-center justify-between gap-3">
                {[
                  { name: 'Fire', Icon: Fire },
                  { name: 'Water', Icon: Drop },
                  { name: 'Earth', Icon: Leaf },
                  { name: 'Wind', Icon: Wind },
                  { name: 'Void', Icon: Planet },
                ].map(({ name, Icon }) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ background: `${ELEMENT_COLORS[name]}20`, border: `1px solid ${ELEMENT_COLORS[name]}40` }}
                    >
                      <Icon size={22} weight="duotone" style={{ color: ELEMENT_COLORS[name] }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: ELEMENT_COLORS[name] }}>{name}</span>
                  </div>
                ))}
              </div>
            </Cell>
          </motion.div>

          {/* Source — 1x1 */}
          <motion.div className="col-span-1 row-span-1" custom={6} variants={fadeUp}>
            <Cell className="h-full flex flex-col justify-center items-center text-center" accent={VIOLET}>
              <p
                className="text-4xl font-bold"
                style={{ fontFamily: 'JetBrains Mono, monospace', background: `linear-gradient(135deg, ${VIOLET}, ${TEAL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                1,111
              </p>
              <p className="text-sm mt-1" style={{ color: MUTED }}>The source of all creation</p>
            </Cell>
          </motion.div>

          {/* Open Source — 1x1 */}
          <motion.div className="col-span-1 row-span-1" custom={7} variants={fadeUp}>
            <Cell className="h-full flex flex-col justify-between" accent="rgba(255,255,255,0.3)">
              <GithubLogo size={28} weight="duotone" style={{ color: TEXT }} />
              <div className="mt-auto">
                <p className="text-sm font-semibold" style={{ color: TEXT }}>Open Source</p>
                <p className="text-xs mt-1" style={{ color: MUTED }}>MIT Licensed</p>
              </div>
            </Cell>
          </motion.div>
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <motion.h2
          className="text-center text-3xl font-bold tracking-tight mb-14"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  background: `linear-gradient(135deg, ${VIOLET}25, ${TEAL}25)`,
                  border: `1px solid ${BORDER}`,
                  color: TEAL,
                }}
              >
                {s.n}
              </div>
              <p className="mt-4 text-sm font-semibold">{s.label}</p>
              <p className="mt-1.5 text-xs" style={{ color: MUTED }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 text-center">
        <motion.blockquote
          className="text-2xl font-light italic leading-relaxed md:text-3xl"
          style={{ fontFamily: 'Crimson Pro, Georgia, serif', color: 'rgba(255,255,255,0.65)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          &ldquo;Enter seeking, leave transformed, return whenever needed.&rdquo;
        </motion.blockquote>
        <motion.p
          className="mt-4 text-sm"
          style={{ color: MUTED }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The Library of Arcanea
        </motion.p>
      </section>

      {/* ── Final CTA ── */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-black transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${VIOLET}, ${TEAL}, ${GOLD})` }}
          >
            Build Your Universe
            <ArrowRight size={18} weight="bold" />
          </a>
          <p className="mt-4 text-sm" style={{ color: MUTED }}>
            Free to start &middot; No credit card required
          </p>
        </motion.div>
      </section>
    </div>
  );
}
