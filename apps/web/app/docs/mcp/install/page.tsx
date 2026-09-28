import { Metadata } from "next";
import Link from "next/link";

const READER = "https://arcanea-reader.frankxai.workers.dev/mcp";

export const metadata: Metadata = {
  title: "Connect the Arcanea reader",
  description:
    "Add the live Arcanea reader to Claude Code, Codex, or Cursor. One HTTPS address. No package and no API key.",
  alternates: { canonical: "/docs/mcp/install" },
};

const CLIENTS = [
  {
    name: "Claude Code",
    note: "Run this in a terminal, not inside a Claude session. Then run claude mcp list.",
    code: `claude mcp add --transport http arcanea ${READER}`,
  },
  {
    name: "Codex",
    note: "Add this block to ~/.codex/config.toml.",
    code: `[mcp_servers.arcanea]\nurl = "${READER}"`,
  },
  {
    name: "Cursor",
    note: "Add this block to ~/.cursor/mcp.json, then reload the window.",
    code: `{\n  "mcpServers": {\n    "arcanea": {\n      "url": "${READER}"\n    }\n  }\n}`,
  },
];

export default function McpInstallPage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      <main className="mx-auto max-w-4xl px-5 sm:px-8">
        <nav className="pb-2 pt-8">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link href="/docs" className="hover:text-zinc-300">Docs</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/docs/mcp" className="hover:text-zinc-300">MCP</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--arc-brand-atlantean-teal)]">Install</li>
          </ol>
        </nav>

        <section className="pb-16 pt-10">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Connect the reader</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            The reader is already running. You do not install a package, and you do not send an API key. After it connects, call <code className="text-zinc-200">arcanea_canon_lint</code> on a draft.
          </p>
          <p className="mt-4 break-all font-mono text-sm text-[var(--arc-brand-atlantean-teal)]">{READER}</p>
        </section>

        <section className="grid gap-4 pb-20">
          {CLIENTS.map((client) => (
            <article key={client.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h2 className="font-display text-xl font-semibold text-white">{client.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">{client.note}</p>
              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-200">{client.code}</pre>
            </article>
          ))}
          <p className="text-sm leading-relaxed text-zinc-500">
            Health is at{" "}
            <a className="text-[var(--arc-brand-atlantean-teal)] hover:text-white" href="https://arcanea-reader.frankxai.workers.dev/health">
              /health
            </a>
            . It should report the free reader and keys false. Tool arguments are on the{" "}
            <Link href="/docs/mcp/tools" className="text-[var(--arc-brand-atlantean-teal)] hover:text-white">
              tool page
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
