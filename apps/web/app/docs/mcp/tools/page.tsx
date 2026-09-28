import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Arcanea reader tools",
  description:
    "The six tools on the live Arcanea reader: rubric, canon lint, score, doctor, and the licensed refusals for lore and templates.",
  alternates: { canonical: "/docs/mcp/tools" },
};

const TOOLS = [
  {
    name: "arcanea_rubric",
    description: "Returns one of the two public rubrics in full.",
    params: [{ name: "name", required: true, detail: "canon-fit or visual-taste." }],
    example: 'arcanea_rubric({ name: "canon-fit" })',
  },
  {
    name: "arcanea_canon_lint",
    description: "Reads the draft only. No model call. Flags an eleventh gate, or a Guardian or godbeast placed on the wrong element.",
    params: [{ name: "draft", required: true, detail: "The text to check." }],
    example: 'arcanea_canon_lint({ draft: "The 11th gate opened and Lyssandria is of Fire." })',
  },
  {
    name: "arcanea_score",
    description: "Runs the lint and returns a verdict. Fail blocks ship. Clear says ship is not granted.",
    params: [{ name: "draft", required: true, detail: "The text to score." }],
    example: 'arcanea_score({ draft: "A traveler waited at the gate until dawn." })',
  },
  {
    name: "arcanea_doctor",
    description: "Reports the door, the version, and that this server holds no key and does not generate.",
    params: [],
    example: "arcanea_doctor({})",
  },
  {
    name: "arcanea_lore",
    description: "Refuses. Canon passages are in the licensed studio, not on this door.",
    params: [{ name: "query", required: false, detail: "Ignored. The tool still refuses." }],
    example: 'arcanea_lore({ query: "Shinkami" })',
  },
  {
    name: "arcanea_template",
    description: "Refuses. Templates and prompts are in the licensed studio, not on this door.",
    params: [{ name: "name", required: false, detail: "Ignored. The tool still refuses." }],
    example: 'arcanea_template({ name: "camera-rig" })',
  },
];

export default function McpToolsPage() {
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
            <li className="text-[var(--arc-brand-atlantean-teal)]">Tools</li>
          </ol>
        </nav>

        <section className="pb-10 pt-10">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Reader tools</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            These six names are the whole public server. A tool from an older catalog will not resolve.
          </p>
        </section>

        <section className="grid gap-4 pb-20">
          {TOOLS.map((tool) => (
            <article key={tool.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h2 className="font-mono text-sm text-[var(--arc-brand-atlantean-teal)]">{tool.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{tool.description}</p>
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
              <pre className="mt-4 overflow-x-auto font-mono text-xs text-zinc-400">{tool.example}</pre>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
