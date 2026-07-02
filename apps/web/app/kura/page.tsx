import type { Metadata } from 'next';
import Link from 'next/link';
import { KuraHero, KuraWorkflow, KuraPlatformMarquee } from './kura-interactive';

export const metadata: Metadata = {
  title: 'Arcanea Kura — Export your most precious writing',
  description:
    'Local-first Chrome extension that exports your ChatGPT, Claude, Grok, Gemini, DeepSeek and Perplexity conversations into an Obsidian-compatible vault on disk. No cloud. No tracking.',
  alternates: { canonical: 'https://arcanea.ai/kura' },
  openGraph: {
    title: 'Arcanea Kura — Export your most precious writing',
    description:
      'Capture every AI conversation into a local Obsidian-compatible vault. Local-first. No cloud. No tracking.',
    type: 'website',
    url: 'https://arcanea.ai/kura',
    siteName: 'Arcanea',
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

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Arcanea Kura',
  alternateName: 'Kura',
  applicationCategory: 'BrowserApplication',
  applicationSubCategory: 'Productivity',
  operatingSystem: 'Chrome, Edge, Brave, Arc',
  description:
    'Local-first Chrome extension that exports AI conversations from ChatGPT, Claude, Grok, Gemini, DeepSeek and Perplexity into an Obsidian-compatible vault on disk.',
  url: 'https://arcanea.ai/kura',
  downloadUrl: 'https://github.com/frankxai/kura',
  softwareVersion: '0.2.0',
  license: 'https://opensource.org/licenses/MIT',
  author: {
    '@type': 'Organization',
    name: 'Arcanea',
    url: 'https://arcanea.ai',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Local-first capture (no cloud)',
    'Obsidian-compatible Markdown output',
    'ChatGPT, Claude, Grok, Gemini, DeepSeek, Perplexity support',
    'YAML frontmatter with entity tagging',
    'Per-conversation asset folders',
    'Open source (MIT)',
  ],
};

export default function KuraPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-zinc-100">
      {/* Structured data — SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <KuraHero />
      <KuraWorkflow />
      <KuraPlatformMarquee />

      {/* Supported platforms detail */}
      <section className="mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-20">
        <h2 className="mb-8 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Per-platform support matrix
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SUPPORTED.map((p) => (
            <div
              key={p.host}
              className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 backdrop-blur-sm transition hover:border-[#00bcd4]/30 hover:bg-white/[0.05]"
            >
              <div>
                <div className="text-sm font-semibold text-zinc-100">{p.name}</div>
                <div className="font-mono text-xs text-zinc-500">{p.host}</div>
              </div>
              <div className="text-right text-xs text-zinc-500">
                <div className="font-semibold text-zinc-400">Conversations</div>
                <div className="mt-0.5">{p.media}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy callout */}
      <section className="mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <h2 className="font-serif text-3xl font-normal leading-tight text-zinc-100 md:text-4xl">
            Your work stays on your machine.
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              Every export lands in{' '}
              <code className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[#00bcd4]">
                ~/Downloads/Kura/
              </code>{' '}
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
      <section className="mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-24 text-center">
        <h2 className="mx-auto mb-6 max-w-2xl text-balance font-serif text-3xl font-normal leading-tight text-zinc-100 md:text-5xl">
          Open source. MIT. <span className="text-[#ffd700]">Yours.</span>
        </h2>
        <Link
          href="https://github.com/frankxai/kura"
          className="inline-flex items-center gap-2 rounded-xl border border-[#00bcd4]/30 bg-gradient-to-br from-[#00bcd4] to-[#0d47a1] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_-12px_rgba(0,188,212,0.6)] transition hover:-translate-y-0.5"
        >
          github.com/frankxai/kura →
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
          part of the Arcanea creative OS
        </p>
      </section>
    </main>
  );
}
