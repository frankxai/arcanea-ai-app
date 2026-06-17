"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

const HOSTS = [
  {
    name: "Claude Code",
    command: "claude mcp add arcanea node ./packages/arcanea-mcp/dist/index.js",
    proof: "Use Arcanea recipes inside coding sessions with repo context.",
  },
  {
    name: "Codex",
    command: "arcanea-mcp --stdio",
    proof: "Expose world, game, music, cinema, and asset tools to Codex workflows.",
  },
  {
    name: "Cursor",
    command: "{ \"arcanea\": { \"command\": \"node\", \"args\": [\"./packages/arcanea-mcp/dist/index.js\"] } }",
    proof: "Attach Arcanea project context to agent composer and rules.",
  },
];

const RECIPES = [
  ["book_to_publish", "Book bible", "Chapters", "Cover", "Publish checklist"],
  ["world_to_game", "World bible", "GDD", "Asset kit", "Prototype brief"],
  ["artist_release", "Artist lore", "Song brief", "Cover", "Visualizer"],
  ["cinematic_trailer", "Scene intent", "Shot list", "Render prompts", "Edit notes"],
  ["campaign_pack", "Offer", "Angles", "Brand kit", "Content pack"],
];

export function McpCommandCenter() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden bg-[var(--arc-cosmic-void)] px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-white/25">
                Command center
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-display font-semibold tracking-[-0.03em] text-white md:text-5xl">
                Arcanea for any AI that can call tools
              </h2>
            </div>
            <div className="rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-brand-atlantean-teal)]/8 px-4 py-3 text-xs font-mono text-[var(--arc-brand-atlantean-teal)]">
              43 tools · 5 recipes · open-core local MCP
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {HOSTS.map((host, index) => (
              <m.article
                key={host.name}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <p className="text-sm font-display font-semibold text-white/86">{host.name}</p>
                <p className="mt-2 min-h-10 text-xs leading-relaxed text-white/42">{host.proof}</p>
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.06] bg-black/35 p-3 text-[11px] leading-relaxed text-white/58">
                  <code>{host.command}</code>
                </pre>
              </m.article>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25">
                  Workflow recipes
                </p>
                <h3 className="mt-2 text-2xl font-display font-semibold text-white/85">
                  Repeatable creative production, not one-off prompting
                </h3>
              </div>
              <code className="rounded-full border border-white/[0.08] bg-black/28 px-3 py-1.5 text-xs text-white/45">
                get_workflow_recipe
              </code>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {RECIPES.map(([id, ...steps], recipeIndex) => (
                <div key={id} className="rounded-2xl border border-white/[0.06] bg-black/24 p-3">
                  <p className="mb-3 text-xs font-mono text-[var(--arc-brand-arcanean-gold)]">{id}</p>
                  <div className="space-y-2">
                    {steps.map((step, stepIndex) => (
                      <div key={`${id}-${step}`} className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-2">
                        <span className="text-[9px] font-mono text-white/24">
                          {String(recipeIndex + 1)}.{String(stepIndex + 1)}
                        </span>
                        <p className="text-xs font-semibold text-white/62">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
