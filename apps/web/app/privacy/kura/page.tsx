/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy — Arcanea Kura",
  description:
    'Privacy policy for the Arcanea Kura Chrome extension. Local-first by design: nothing leaves your machine unless you explicitly click "Send to Arcanea".',
  openGraph: {
    title: "Privacy policy — Arcanea Kura",
    description:
      "Local-first by design. Nothing leaves your machine unless you opt in.",
    url: "https://arcanea.ai/privacy/kura",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const EFFECTIVE = "2026-05-13";

export default function KuraPrivacyPage() {
  return (
    <main className="relative min-h-screen bg-[#09090b] text-zinc-100">
      <article className="mx-auto max-w-3xl px-6 py-24">
        <header className="mb-12 border-b border-white/[0.06] pb-8">
          <p
            className="mb-4 text-xs uppercase tracking-[0.2em] text-zinc-500"
            style={{
              fontFamily:
                'var(--font-jetbrains-mono, "JetBrains Mono"), ui-monospace, monospace',
            }}
          >
            Effective {EFFECTIVE} · Arcanea Kura v0.2.0
          </p>
          <h1
            className="text-4xl font-normal leading-tight text-zinc-50 md:text-5xl"
            style={{
              fontFamily:
                'var(--font-instrument-serif, "Instrument Serif"), Georgia, serif',
            }}
          >
            Privacy policy
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Local-first by design. This page explains exactly which data the
            Arcanea Kura Chrome extension touches, where it goes, and what never
            leaves your machine.
          </p>
        </header>

        <Section title="In one sentence">
          <p>
            The extension reads the AI conversation on the tab you're currently
            looking at, writes it as a Markdown file into
            <code className="mx-1 rounded bg-white/[0.05] px-1.5 py-0.5 text-[#00bcd4]">
              ~/Downloads/ArcaneaKura/
            </code>{" "}
            on your computer, and does nothing else.
          </p>
        </Section>

        <Section title="What the extension can access">
          <ul className="list-inside list-disc space-y-2">
            <li>
              The DOM of the active tab when you click the extension icon — only
              on the AI platforms listed in the manifest{" "}
              <span className="text-zinc-500">
                (ChatGPT, Claude, Gemini, Grok, DeepSeek, Perplexity).
              </span>
            </li>
            <li>
              Chrome's{" "}
              <code className="rounded bg-white/[0.05] px-1.5 py-0.5">
                downloads
              </code>{" "}
              API, used to write files into your default Downloads folder.
            </li>
            <li>
              Chrome's{" "}
              <code className="rounded bg-white/[0.05] px-1.5 py-0.5">
                storage
              </code>{" "}
              API, used to persist your preferences (export format, default
              platform filter). Settings only — no conversation content.
            </li>
            <li>
              <code className="rounded bg-white/[0.05] px-1.5 py-0.5">
                IndexedDB
              </code>{" "}
              inside the extension, used as a lookup index for fast
              cross-conversation queries. The filesystem is the canonical store;
              IndexedDB is a cache.
            </li>
          </ul>
        </Section>

        <Section title="What the extension does not do">
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong className="text-zinc-100">No analytics.</strong> No
              page-view tracking, no event tracking, no metrics service of any
              kind.
            </li>
            <li>
              <strong className="text-zinc-100">No telemetry.</strong> No "ping
              home" requests. The extension makes zero network requests to
              Arcanea or any third party unless you click the optional
              Send-to-Arcanea button (see below).
            </li>
            <li>
              <strong className="text-zinc-100">No account.</strong> Nothing to
              sign up for. Nothing to log in to.
            </li>
            <li>
              <strong className="text-zinc-100">No third-party scripts.</strong>{" "}
              The popup loads Google Fonts CSS only; we plan to self-host fonts
              in v0.3 to remove this last external request.
            </li>
            <li>
              <strong className="text-zinc-100">No selling of data.</strong>{" "}
              There is no data to sell. Even if there were, we wouldn't.
            </li>
          </ul>
        </Section>

        <Section title="The optional Send-to-Arcanea bridge">
          <p>
            The extension popup includes a single <em>opt-in</em> button:{" "}
            <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[#ffd700]">
              Send to Arcanea (opt-in)
            </span>
            . It is disabled by default in spirit (you must click it; nothing
            auto-fires).
          </p>
          <p className="mt-3">When you click it, and only when you click it:</p>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>
              The current capture is POSTed to{" "}
              <code className="rounded bg-white/[0.05] px-1.5 py-0.5">
                https://arcanea.ai/api/kura/import
              </code>
              .
            </li>
            <li>
              The payload contains the conversation metadata, messages, prompts,
              and any AI-generated media references — same content that was just
              written to your disk.
            </li>
            <li>
              The Arcanea bridge endpoint logs only metadata (counts, platform,
              schema version, first three conversation titles) and returns a
              server-side capture id.
            </li>
            <li>
              Persistence of conversation bodies into the Arcanea second brain
              is deferred until a future version and will require an explicit
              opt-in beyond the button click.
            </li>
          </ul>
          <p className="mt-3">
            If you never click the button, no data ever leaves your machine.
          </p>
        </Section>

        <Section title="Host permissions">
          <p>
            The Chrome manifest declares host permissions for these domains
            only:
          </p>
          <ul
            className="mt-3 list-inside list-disc space-y-1"
            style={{
              fontFamily:
                'var(--font-jetbrains-mono, "JetBrains Mono"), ui-monospace, monospace',
            }}
          >
            <li>grok.com, assets.grok.com, imagine-public.x.ai</li>
            <li>chatgpt.com, chat.openai.com</li>
            <li>claude.ai</li>
            <li>gemini.google.com, aistudio.google.com</li>
            <li>chat.deepseek.com</li>
            <li>www.perplexity.ai</li>
            <li>arcanea.ai (only used by the opt-in bridge)</li>
          </ul>
          <p className="mt-3">
            The extension does not make network requests to any other host.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            Files captured to{" "}
            <code className="rounded bg-white/[0.05] px-1.5 py-0.5">
              ~/Downloads/ArcaneaKura/
            </code>{" "}
            remain on your machine until you delete them. The IndexedDB cache is
            cleared when you uninstall the extension.
          </p>
          <p className="mt-3">
            Metadata logged by the optional bridge endpoint (
            <code className="rounded bg-white/[0.05] px-1.5 py-0.5">
              /api/kura/import
            </code>
            ) is kept for at most 30 days in Vercel's standard log retention,
            then rotated. No conversation bodies are persisted server-side at
            this version.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Arcanea Kura is a developer/creator tool. It is not directed at
            children under 13 and we do not knowingly collect data from anyone —
            adult or otherwise.
          </p>
        </Section>

        <Section title="Open source">
          <p>
            The extension is MIT-licensed and fully open source. You can read
            every line of code that runs on your machine:{" "}
            <Link
              href="https://github.com/frankxai/arcanea-vault"
              className="text-[#00bcd4] underline-offset-4 hover:underline"
            >
              github.com/frankxai/arcanea-vault
            </Link>
            .
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions, audits, or security disclosures: open an issue at{" "}
            <Link
              href="https://github.com/frankxai/arcanea-vault/issues"
              className="text-[#00bcd4] underline-offset-4 hover:underline"
            >
              github.com/frankxai/arcanea-vault/issues
            </Link>{" "}
            or email{" "}
            <a
              href="mailto:frank@arcanea.ai"
              className="text-[#00bcd4] underline-offset-4 hover:underline"
            >
              frank@arcanea.ai
            </a>
            .
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            Material changes are versioned alongside the extension. The
            effective date at the top of this page reflects the current version.
            Older versions of the policy are kept in the project's git history
            at the repo above.
          </p>
        </Section>

        <footer className="mt-16 border-t border-white/[0.06] pt-8 text-sm text-zinc-500">
          <Link
            href="/kura"
            className="text-[#00bcd4] underline-offset-4 hover:underline"
          >
            ← Back to Arcanea Kura
          </Link>
        </footer>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2
        className="mb-4 text-2xl font-normal text-zinc-100 md:text-3xl"
        style={{
          fontFamily:
            'var(--font-instrument-serif, "Instrument Serif"), Georgia, serif',
        }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-base leading-relaxed text-zinc-400">
        {children}
      </div>
    </section>
  );
}
