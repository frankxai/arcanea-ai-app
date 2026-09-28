import { Metadata } from "next";
import Link from "next/link";

const READER = "https://arcanea-reader.frankxai.workers.dev/mcp";

export const metadata: Metadata = {
  title: "Arcanea MCP reader",
  description:
    "Connect Claude Code, Codex, or Cursor to the free Arcanea reader. Six tools: rubrics, canon lint, and a score that cannot grant ship. No install and no API key.",
  openGraph: {
    title: "Arcanea MCP reader",
    description:
      "A live HTTPS reader for Claude, Codex, and Cursor. Rubrics, canon lint, and a score that will not call a draft ship.",
  },
  alternates: { canonical: "/docs/mcp" },
};

const TOOLS = [
  {
    name: "arcanea_rubric",
    detail: "Returns the canon-fit or visual-taste rubric. Any other name is refused.",
  },
  {
    name: "arcanea_canon_lint",
    detail: "Flags an eleventh gate, or a Guardian or godbeast on the wrong element. No model call.",
  },
  {
    name: "arcanea_score",
    detail: "A contradiction blocks ship. A clean draft is clear, and clear is not a score of 85.",
  },
  {
    name: "arcanea_doctor",
    detail: "Says this is the free door, with no key and no generation.",
  },
  {
    name: "arcanea_lore",
    detail: "Refuses. The world text stays in the licensed studio.",
  },
  {
    name: "arcanea_template",
    detail: "Refuses. Prompts and templates stay in the licensed studio.",
  },
];

export default function McpOverviewPage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      <main className="mx-auto max-w-4xl px-5 sm:px-8">
        <nav className="pb-2 pt-8">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link href="/docs" className="transition-colors hover:text-zinc-300">
                Docs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--arc-brand-atlantean-teal)]">MCP</li>
          </ol>
        </nav>

        <section className="pb-12 pt-10 sm:pb-16">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 py-1.5 font-mono text-xs tracking-widest text-[var(--arc-brand-atlantean-teal)]">
            Live reader
          </p>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Arcanea MCP reader
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            One HTTPS address. No package and no API key. Claude Code, Codex, and Cursor can call the rubrics, the lint, and a score that will not grant ship.
          </p>

          <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-zinc-500">
              Claude Code
            </p>
            <code className="block break-all font-mono text-sm text-zinc-200">
              claude mcp add --transport http arcanea {READER}
            </code>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Run that in a terminal, then <code className="text-zinc-300">claude mcp list</code>. Codex and Cursor use the URL directly. The full blocks are on the{" "}
              <Link href="/docs/mcp/install" className="text-[var(--arc-brand-atlantean-teal)] hover:text-white">
                install page
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="pb-12">
          <h2 className="mb-5 font-display text-xl font-semibold text-white">Six tools</h2>
          <ul className="grid gap-3">
            {TOOLS.map((tool) => (
              <li key={tool.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
                <code className="text-sm text-[var(--arc-brand-atlantean-teal)]">{tool.name}</code>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{tool.detail}</p>
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
          <h2 className="mb-3 font-display text-xl font-semibold text-white">What this door is not</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            It does not return canon passages, prompts, or templates. It does not generate images. It does not hold a provider key. A clear score is not permission to publish. The licensed studio is a later install, and this page does not show an npm command for it. Older docs that listed dozens of generators described a package that is not this server.
          </p>
        </section>
      </main>
    </div>
  );
}
