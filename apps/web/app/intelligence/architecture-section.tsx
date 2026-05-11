/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { m } from 'framer-motion';

const RUNTIMES = [
  {
    label: 'Vercel',
    title: 'The always-on',
    body: 'Edge functions stream Lumina to anyone who lands here. Multi-provider routing — Anthropic, Gemini, OpenAI, Groq — with the AI Gateway handling failover. The constellation you just touched is rendered, hydrated, and animated from a Next.js server component, then becomes interactive in the browser.',
    accent: 'var(--arc-brand-atlantean-teal)',
  },
  {
    label: 'Local',
    title: 'The kernel',
    body: 'Same code, same Guardians — but invoked through Claude Code, OpenCode, Kilo Code, or the Arcanea Orchestrator on a workstation. Subagents work in parallel, MCP servers expose Supabase / Replicate / Fal / Comfy. This is where the system was forged tonight and most nights.',
    accent: 'var(--arc-void)',
  },
  {
    label: 'Browser',
    title: 'Bring your own keys',
    body: 'No Vercel keys configured? Paste a Groq key in /room and you own the loop locally — speech transcribed, replies streamed, voice synthesized — all from your own credit. Sovereignty over the silicon.',
    accent: 'var(--arc-brand-arcanean-gold)',
  },
];

const PIPELINE = [
  { step: 'You speak', detail: 'Mic captures audio in the browser.' },
  { step: 'Whisper transcribes', detail: 'Groq or OpenAI returns text in <300ms.' },
  { step: 'Lumina routes', detail: 'Persona prompt + history → Vercel AI SDK.' },
  { step: 'A Guardian replies', detail: 'Streamed back token by token.' },
  { step: 'ElevenLabs speaks', detail: 'Per-persona voice, MP3 streamed back.' },
  { step: 'Loop continues', detail: 'Barge-in detection lets you interrupt.' },
];

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-24 border-t border-white/[0.05]"
    >
      <m.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 0.65, 0.25, 1] }}
        className="text-[10px] tracking-[0.42em] uppercase text-white/40"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Architecture
      </m.p>
      <m.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 0.65, 0.25, 1] }}
        className="mt-3 text-[32px] sm:text-[44px] leading-[1.08] tracking-[-0.01em] text-white/95 max-w-3xl"
        style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
      >
        Three runtimes. One voice.
      </m.h2>
      <m.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 0.65, 0.25, 1] }}
        className="mt-4 max-w-2xl text-[15px] sm:text-[17px] leading-[1.6] text-white/55"
        style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
      >
        Lumina speaks the same in the browser, on a workstation, and inside an editor — because
        the prompts, gates, and routing live in one source of truth and the runtimes are just
        different doors into the same room.
      </m.p>

      {/* Three runtime cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
        {RUNTIMES.map((r, idx) => (
          <m.article
            key={r.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: 0.7,
              delay: 0.2 + idx * 0.08,
              ease: [0.22, 0.65, 0.25, 1],
            }}
            className="relative rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-md p-7 overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-3xl"
              style={{ background: r.accent }}
            />
            <p
              className="text-[10px] tracking-[0.32em] uppercase"
              style={{ fontFamily: 'var(--font-display)', color: r.accent }}
            >
              {r.label}
            </p>
            <h3
              className="mt-2 text-[22px] tracking-[-0.005em] text-white/95 leading-[1.2]"
              style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
            >
              {r.title}
            </h3>
            <p
              className="mt-3 text-[14px] leading-[1.65] text-white/60"
              style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
            >
              {r.body}
            </p>
          </m.article>
        ))}
      </div>

      {/* Voice pipeline as a timeline */}
      <div className="mt-20">
        <m.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-[10px] tracking-[0.42em] uppercase text-white/40"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          The Voice Loop
        </m.p>
        <m.h3
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.06 }}
          className="mt-3 text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.005em] text-white/95"
          style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
        >
          What happens when you tap and speak.
        </m.h3>

        <ol className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIPELINE.map((p, idx) => (
            <m.li
              key={p.step}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.6,
                delay: 0.08 + idx * 0.06,
                ease: [0.22, 0.65, 0.25, 1],
              }}
              className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-5"
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="text-[10px] tracking-[0.32em] uppercase text-[var(--arc-text-primary)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p
                  className="text-[15px] tracking-[-0.005em] text-white/90"
                  style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
                >
                  {p.step}
                </p>
              </div>
              <p
                className="mt-2 text-[12px] leading-[1.6] text-white/45"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {p.detail}
              </p>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
