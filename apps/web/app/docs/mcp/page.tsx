import { Metadata } from "next";
import Link from "next/link";

import {
  CANON_SOURCE_URL,
  READER_CLIENTS,
  READER_LIMITS,
  READER_TOOLS,
} from "@/lib/mcp/reader-catalog";

export const metadata: Metadata = {
  title: "Arcanea MCP reader",
  description:
    "Connect Claude Code, Codex, or Cursor to the free Arcanea reader. Six tools with limited deterministic checks and explicit refusals. No local server package or provider key.",
  openGraph: {
    title: "Arcanea MCP reader",
    description:
      "A remote HTTPS reader for Claude, Codex and Cursor. Public rubric prompts, limited canon checks and a separate canonical source.",
  },
  alternates: { canonical: "/docs/mcp" },
};

export default function McpOverviewPage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <nav className="pb-2 pt-8">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link
                href="/docs"
                className="transition-colors hover:text-zinc-300"
              >
                Docs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--arc-brand-atlantean-teal)]">MCP</li>
          </ol>
        </nav>

        <section className="pb-12 pt-10 sm:pb-16">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 py-1.5 font-mono text-xs tracking-widest text-[var(--arc-brand-atlantean-teal)]">
            Remote reader
          </p>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Arcanea MCP reader
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            One HTTPS address for Claude Desktop, Claude Code, Codex and Cursor.
            Read public rubric prompts or check a draft against supported canon
            patterns. The reader does not use a provider key or generate
            content.
          </p>

          <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
            <p className="mb-3 font-mono text-xs tracking-wider text-zinc-500">
              Claude Code
            </p>
            <code className="block break-all font-mono text-sm text-zinc-200">
              {
                READER_CLIENTS.find((client) => client.name === "Claude Code")
                  ?.body
              }
            </code>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Run that in a terminal, then{" "}
              <code className="text-zinc-300">claude mcp list</code>. Codex and
              Cursor have project config options; Claude Desktop uses a custom
              connector. Client instructions are on the{" "}
              <Link
                href="/docs/mcp/install"
                className="text-[var(--arc-brand-atlantean-teal)] hover:text-white"
              >
                install page
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="pb-12">
          <h2 className="mb-5 font-display text-xl font-semibold text-white">
            Six tools
          </h2>
          <ul className="grid gap-3">
            {READER_TOOLS.map((tool) => (
              <li
                key={tool.name}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4"
              >
                <code className="text-sm text-[var(--arc-brand-atlantean-teal)]">
                  {tool.name}
                </code>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  {tool.detail}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/docs/mcp/tools"
            className="mt-4 inline-block text-sm text-[var(--arc-brand-atlantean-teal)] hover:text-white"
          >
            Parameters and examples
          </Link>
        </section>

        <section className="pb-20">
          <h2 className="mb-3 font-display text-xl font-semibold text-white">
            Coverage and canonical source
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            {READER_LIMITS}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Canon and lore remain in the public app repository. A refusal on
            this endpoint does not make that source private or grant content
            reuse rights.
          </p>
          <a
            href={CANON_SOURCE_URL}
            className="mt-3 inline-block text-sm text-[var(--arc-brand-atlantean-teal)] underline underline-offset-4"
          >
            Read the canonical source
          </a>
        </section>
      </div>
    </div>
  );
}
