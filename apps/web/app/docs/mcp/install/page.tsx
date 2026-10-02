import { Metadata } from "next";
import Link from "next/link";

import {
  READER_CLIENTS,
  READER_HEALTH_URL,
  READER_URL,
} from "@/lib/mcp/reader-catalog";

export const metadata: Metadata = {
  title: "Connect the Arcanea reader",
  description:
    "Connect Claude Desktop, Claude Code, Codex or Cursor to the remote Arcanea reader. Client-specific setup with no local server package or provider key.",
  alternates: { canonical: "/docs/mcp/install" },
};

export default function McpInstallPage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <nav className="pb-2 pt-8">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link href="/docs" className="hover:text-zinc-300">
                Docs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/docs/mcp" className="hover:text-zinc-300">
                MCP
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--arc-brand-atlantean-teal)]">Install</li>
          </ol>
        </nav>

        <section className="pb-16 pt-10">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Connect the reader
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Connect to the remote reader through your client. It needs no local
            server package or provider key. After it connects, call{" "}
            <code className="text-zinc-200">arcanea_canon_lint</code> on a
            draft.
          </p>
          <p className="mt-4 break-all font-mono text-sm text-[var(--arc-brand-atlantean-teal)]">
            {READER_URL}
          </p>
        </section>

        <section className="grid gap-4 pb-20">
          {READER_CLIENTS.map((client) => (
            <article
              key={client.name}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <h2 className="font-display text-xl font-semibold text-white">
                {client.name}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">{client.location}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {client.note}
              </p>
              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-200">
                {client.body}
              </pre>
              <a
                href={client.guide}
                className="mt-4 inline-block text-sm text-[var(--arc-brand-atlantean-teal)] underline underline-offset-4"
              >
                {client.name} setup guide
              </a>
            </article>
          ))}
          <p className="text-sm leading-relaxed text-zinc-500">
            Health is at{" "}
            <a
              className="text-[var(--arc-brand-atlantean-teal)] hover:text-white"
              href={READER_HEALTH_URL}
            >
              /health
            </a>
            . Check current availability and reader scope there. Tool arguments
            are on the{" "}
            <Link
              href="/docs/mcp/tools"
              className="text-[var(--arc-brand-atlantean-teal)] hover:text-white"
            >
              tool page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
