import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Arcanea Kura — Export your most precious writing',
  description:
    'Local-first Chrome extension that exports your ChatGPT, Claude, Grok, Gemini, DeepSeek and Perplexity conversations into an Obsidian-compatible vault on disk. No cloud. No tracking.',
  openGraph: {
    title: 'Arcanea Kura — Export your most precious writing',
    description:
      'Capture every AI conversation into a local Obsidian-compatible vault. Local-first. No cloud. No tracking.',
    type: 'website',
    url: 'https://arcanea.ai/kura',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanea Kura — Export your most precious writing',
    description:
      'Local-first AI conversation exporter. Capture → Obsidian → Claude Code.',
  },
};

const SUPPORTED = [
  { name: 'ChatGPT', host: 'chatgpt.com', media: 'DALL·E images' },
  { name: 'Claude', host: 'claude.ai', media: 'inline images' },
  { name: 'Gemini', host: 'gemini.google.com', media: 'generated images' },
  { name: 'Grok', host: 'grok.com', media: 'Imagine images + video' },
  { name: 'DeepSeek', host: 'chat.deepseek.com', media: '—' },
  { name: 'Perplexity', host: 'perplexity.ai', media: '—' },
];

const STAGES = [
  {
    n: '01',
    label: 'Export',
    body: 'One click in your browser. The current AI conversation, its prompts, and any generated media land in ArcaneaKura/ on your disk.',
  },
  {
    n: '02',
    label: 'Process',
    body: 'Run /kura-process in Claude Code. The skill extracts characters, locations, artifacts, and lore — populating Obsidian wikilinks in the frontmatter.',
  },
  {
    n: '03',
    label: 'See',
    body: 'Open the folder in Obsidian. The graph view builds itself from the wikilinks. Your AI work becomes a knowledge network you actually own.',
  },
];

export default function KuraPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-zinc-100">
      {/* Backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[#00bcd4]/[0.07] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[420px] w-[680px] rounded-full bg-[#0d47a1]/[0.10] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[320px] w-[420px] rounded-full bg-[#ffd700]/[0.04] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-36">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00bcd4]" />
          v0.2.0 · Chrome MV3 · Local-first
        </div>

        <h1
          className="text-balance text-5xl font-normal leading-[1.05] tracking-tight text-zinc-50 md:text-7xl"
          style={{ fontFamily: 'var(--font-instrument-serif, "Instrument Serif"), Georgia, serif' }}
        >
          Kura.
          <br />
          <span className="text-[#00bcd4]">Export your most precious writing.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
          A 蔵 (<em className="italic">kura</em>) is the fireproof storehouse a
          family kept for their most valuable scrolls. This is the digital one
          — for every ChatGPT, Claude, Grok, Gemini, DeepSeek, and Perplexity
          conversation you've ever wanted to keep.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link
            href="https://github.com/frankxai/arcanea-vault"
            className="inline-flex items-center gap-2 rounded-xl border border-[#00bcd4]/30 bg-gradient-to-br from-[#00bcd4] to-[#0d47a1] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_-12px_rgba(0,188,212,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(0,188,212,0.7)]"
          >
            Install (developer mode)
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="https://github.com/frankxai/arcanea-vault/blob/main/FORMAT_SPEC.md"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Read the format spec
          </Link>
          <span className="ml-auto text-xs uppercase tracking-[0.2em] text-zinc-500">
            Chrome Web Store · in review
          </span>
        </div>
      </section>

      {/* Three-stage workflow */}
      <section className="mx-auto max-w-5xl border-t border-white/[0.06] px-6 py-20">
        <h2
          className="mb-12 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500"
        >
          The capture loop
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {STAGES.map((s) => (
            <div
              key={s.n}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-7 backdrop-blur-sm transition hover:border-[#00bcd4]/30"
            >
              <div
                className="mb-4 font-mono text-xs text-zinc-500"
                style={{ fontFamily: 'var(--font-jetbrains-mono, "JetBrains Mono"), ui-monospace, monospace' }}
              >
                {s.n}
              </div>
              <div
                className="mb-3 text-2xl font-normal text-[#00bcd4]"
                style={{ fontFamily: 'var(--font-instrument-serif, "Instrument Serif"), Georgia, serif' }}
              >
                {s.label}
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported platforms */}
      <section className="mx-auto max-w-5xl border-t border-white/[0.06] px-6 py-20">
        <h2
          className="mb-12 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500"
        >
          Works with the platforms you already use
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SUPPORTED.map((p) => (
            <div
              key={p.host}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 backdrop-blur-sm"
            >
              <div>
                <div className="text-sm font-semibold text-zinc-100">{p.name}</div>
                <div
                  className="text-xs text-zinc-500"
                  style={{ fontFamily: 'var(--font-jetbrains-mono, "JetBrains Mono"), ui-monospace, monospace' }}
                >
                  {p.host}
                </div>
              </div>
              <div className="text-right text-xs text-zinc-500">
                <div className="font-semibold text-zinc-400">Conversations</div>
                <div className="mt-0.5">{p.media}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="mx-auto max-w-5xl border-t border-white/[0.06] px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <h2
            className="text-3xl font-normal leading-tight text-zinc-100 md:text-4xl"
            style={{ fontFamily: 'var(--font-instrument-serif, "Instrument Serif"), Georgia, serif' }}
          >
            Your work stays on your machine.
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              Every export lands in <code className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[#00bcd4]">~/Downloads/ArcaneaKura/</code>{' '}
              on your computer. The filesystem is the source of truth.
              IndexedDB inside the extension is just a query cache.
            </p>
            <p>
              No telemetry. No analytics. No account required to use the
              extension. Host permissions are restricted to the AI platforms
              with scrapers — nothing else.
            </p>
            <p>
              A single optional <span className="text-zinc-200">Send to Arcanea</span>{' '}
              button exists in the popup for users who want to mirror
              captures into their Arcanea second-brain. It is off by default
              and never fires without an explicit click.
            </p>
            <p>
              <Link
                href="/privacy/kura"
                className="font-semibold text-[#00bcd4] underline-offset-4 hover:underline"
              >
                Read the full privacy policy →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mx-auto max-w-5xl border-t border-white/[0.06] px-6 py-24 text-center">
        <h2
          className="mx-auto mb-6 max-w-2xl text-balance text-3xl font-normal leading-tight text-zinc-100 md:text-5xl"
          style={{ fontFamily: 'var(--font-instrument-serif, "Instrument Serif"), Georgia, serif' }}
        >
          Open source. MIT. <span className="text-[#ffd700]">Yours.</span>
        </h2>
        <Link
          href="https://github.com/frankxai/arcanea-vault"
          className="inline-flex items-center gap-2 rounded-xl border border-[#00bcd4]/30 bg-gradient-to-br from-[#00bcd4] to-[#0d47a1] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_-12px_rgba(0,188,212,0.6)] transition hover:-translate-y-0.5"
        >
          github.com/frankxai/arcanea-vault →
        </Link>
        <p
          className="mt-8 text-xs uppercase tracking-[0.2em] text-zinc-600"
          style={{ fontFamily: 'var(--font-jetbrains-mono, "JetBrains Mono"), ui-monospace, monospace' }}
        >
          part of the Arcanea creative OS
        </p>
      </section>
    </main>
  );
}
