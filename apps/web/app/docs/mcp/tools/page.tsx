import { Metadata } from "next";
import Link from "next/link";
import {
  CANON_SOURCE_URL,
  READER_LIMITS,
  READER_TOOLS,
} from "@/lib/mcp/reader-catalog";

export const metadata: Metadata = {
  title: "Arcanea reader tools",
  description:
    "Arguments, examples and limits for the remote Arcanea reader, including the lore and template endpoint refusals.",
  alternates: { canonical: "/docs/mcp/tools" },
};

export default function McpToolsPage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      <main className="mx-auto max-w-4xl px-5 sm:px-8">
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
            <li className="text-[var(--arc-brand-atlantean-teal)]">Tools</li>
          </ol>
        </nav>

        <section className="pb-10 pt-10">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Reader tools
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            These are the six tools advertised by this remote reader. Studio and
            generation tools belong to different services.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {READER_LIMITS}
          </p>
          <a
            href={CANON_SOURCE_URL}
            className="mt-3 inline-block text-sm text-[var(--arc-brand-atlantean-teal)] underline underline-offset-4"
          >
            Read the canonical source
          </a>
        </section>

        <section className="grid gap-4 pb-20">
          {READER_TOOLS.map((tool) => (
            <article
              key={tool.name}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <h2 className="font-mono text-sm text-[var(--arc-brand-atlantean-teal)]">
                {tool.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {tool.detail}
              </p>
              {tool.params.length > 0 ? (
                <ul className="mt-3 grid gap-1 text-sm text-zinc-400">
                  {tool.params.map((param) => (
                    <li key={param.name}>
                      <code className="text-zinc-200">{param.name}</code>
                      {param.required ? " required. " : " optional. "}
                      {param.detail}
                    </li>
                  ))}
                </ul>
              ) : null}
              <pre className="mt-4 overflow-x-auto font-mono text-xs text-zinc-400">
                {`${tool.name}(${JSON.stringify(tool.example)})`}
              </pre>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
