"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";

const RECIPES = [
  {
    id: "world_to_game",
    title: "World to playable prototype",
    input: "World bible",
    nodes: ["Canon graph", "GDD", "Asset kit", "Codex build brief"],
    output: "Browser/Godot prototype sprint",
    route: "/games",
  },
  {
    id: "book_to_publish",
    title: "Book to launch package",
    input: "Reader promise",
    nodes: ["Book bible", "Chapter spine", "Cover brief", "Publish checklist"],
    output: "Author release kit",
    route: "/books/drafts",
  },
  {
    id: "artist_release",
    title: "Artist universe to release",
    input: "Artist lore",
    nodes: ["Song brief", "Cover art", "Visualizer", "Content pack"],
    output: "Single or EP rollout",
    route: "/music-studio",
  },
  {
    id: "cinematic_trailer",
    title: "Scene to trailer board",
    input: "Hook frame",
    nodes: ["Shot list", "Audio cue", "Render prompts", "Edit notes"],
    output: "Video production brief",
    route: "/cinema-studio",
  },
];

const LANES = [
  ["Input", "@world @book @song @repo"],
  ["Plan", "plan_world / plan_game"],
  ["Generate", "asset brief / shot list"],
  ["Assemble", "media, code, campaign"],
  ["Export", "Claude, Codex, Cursor"],
];

const MODEL_ROUTES = [
  ["Text", "Claude, GPT, Gemini", "bibles, chapters, prompts"],
  ["Image", "Nano Banana, Midjourney", "covers, sprites, frames"],
  ["Video", "Runway, Higgsfield-style briefs", "trailers, reels, animatics"],
  ["Music", "Suno, DAW handoff", "songs, motifs, visualizers"],
  ["Code", "Codex, Cursor, Claude Code", "games, sites, tools"],
];

export function CanvasFlowLab() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden bg-[var(--arc-cosmic-void)] px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-white/25">
                Canvas flow lab
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-display font-semibold tracking-[-0.03em] text-white md:text-5xl">
                Chain studios, models, media, and agents in one graph
              </h2>
            </div>
            <Link
              href="/mcp"
              className="rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-white/50 hover:text-white"
            >
              Export to MCP
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-white/[0.06] bg-black/28 p-4">
                <div
                  className="absolute inset-0 opacity-[0.045]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.75) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.75) 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                  }}
                />
                <div className="relative grid gap-3 md:grid-cols-5">
                  {LANES.map(([label, detail], index) => (
                    <m.div
                      key={label}
                      className="min-h-40 rounded-2xl border border-white/[0.08] bg-[var(--arc-cosmic-void)]/70 p-3"
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.45, delay: index * 0.07 }}
                    >
                      <span className="text-[10px] font-mono text-white/24">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-8 text-lg font-display font-semibold text-white/86">
                        {label}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-white/42">
                        {detail}
                      </p>
                    </m.div>
                  ))}
                </div>
                <div className="relative mt-4 grid gap-3 md:grid-cols-4">
                  {RECIPES.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={recipe.route}
                      className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 hover:border-white/[0.16]"
                    >
                      <p className="text-[10px] font-mono text-[var(--arc-brand-atlantean-teal)]">
                        {recipe.id}
                      </p>
                      <h3 className="mt-3 min-h-12 text-base font-display font-semibold text-white/84">
                        {recipe.title}
                      </h3>
                      <p className="mt-3 text-xs text-white/35">
                        Input: {recipe.input}
                      </p>
                      <div className="mt-3 space-y-1.5">
                        {recipe.nodes.map((node) => (
                          <p
                            key={`${recipe.id}-${node}`}
                            className="rounded-lg bg-black/22 px-2 py-1 text-[11px] text-white/48"
                          >
                            {node}
                          </p>
                        ))}
                      </div>
                      <p className="mt-3 text-xs font-semibold text-white/64">
                        {recipe.output}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25">
                  Model routing
                </p>
                <div className="mt-4 space-y-3">
                  {MODEL_ROUTES.map(([type, tools, output]) => (
                    <div
                      key={type}
                      className="rounded-2xl border border-white/[0.06] bg-black/24 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-display font-semibold text-white/82">
                          {type}
                        </p>
                        <span className="text-[10px] font-mono text-white/28">
                          {output}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-white/45">
                        {tools}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--arc-brand-arcanean-gold)]/16 bg-[var(--arc-brand-arcanean-gold)]/6 p-5">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--arc-brand-arcanean-gold)]/70">
                  Why this matters
                </p>
                <p className="mt-3 text-lg font-display font-semibold text-white/86">
                  Canvas turns prompting into a repeatable studio pipeline.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/45">
                  Higgsfield-style generation is one output. Arcanea Canvas is
                  the operating layer around it: world context, media
                  references, model routing, agent handoff, and exportable
                  production graphs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
