"use client";

import { FACTS } from "@/lib/facts";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Terminal, CaretRight, Check, Play, ArrowsClockwise } from "@/lib/phosphor-icons";

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

interface TerminalLog {
  type: "input" | "info" | "success" | "json" | "step";
  text: string;
}

export function McpCommandCenter() {
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [terminalStep, setTerminalStep] = useState(0);

  const script = [
    {
      input: "claude mcp add arcanea node ./packages/arcanea-mcp/dist/index.js",
      output: [
        { type: "info", text: "Adding MCP server 'arcanea' to configuration..." },
        { type: "success", text: `✓ Config updated. Loaded ${FACTS.mcpTools} tools across 9 creative modules.` },
        { type: "step", text: "Tools available: plan_world, plan_book, plan_game, plan_music_project, plan_cinematic_scene, get_workflow_recipe, generate_asset_brief, export_project_context..." }
      ]
    },
    {
      input: "claude-code: call_tool arcanea/get_workflow_recipe { recipeId: 'world_to_game' }",
      output: [
        { type: "info", text: "Calling tool arcanea/get_workflow_recipe..." },
        { type: "json", text: JSON.stringify({
          recipeId: "world_to_game",
          steps: [
            "01: plan_world --premise 'drowned moon academy'",
            "02: generate_game_design_doc --worldId 'moon-acad'",
            "03: generate_asset_brief --type 'sprite-kit'",
            "04: export_project_context --target 'obsidian'"
          ]
        }, null, 2) }
      ]
    },
    {
      input: "claude-code: call_tool arcanea/plan_world { premise: 'drowned moon academy where music changes gravity' }",
      output: [
        { type: "info", text: "Executing tool arcanea/plan_world..." },
        { type: "step", text: "✓ Initialized World bible graph structure." },
        { type: "step", text: "✓ Generated Faction: 'Acoustic Order' (melodic scholars)." },
        { type: "step", text: "✓ Generated Location: 'Resonance Chasm' (zero-gravity vault)." },
        { type: "step", text: "✓ Saved world graph to local Obsidian path '/worlds/drowned-moon-academy.md'." },
        { type: "success", text: "✓ Faction graph and timeline successfully serialized. 4 files modified." }
      ]
    }
  ];

  useEffect(() => {
    let active = true;
    const runTerminalSequence = async () => {
      setTerminalLogs([]);
      setCurrentInput("");
      
      for (let i = 0; i < script.length; i++) {
        if (!active) return;
        
        // Typing animation
        const currentCommand = script[i].input;
        for (let charIdx = 0; charIdx <= currentCommand.length; charIdx++) {
          if (!active) return;
          setCurrentInput(currentCommand.slice(0, charIdx));
          await new Promise((r) => setTimeout(r, 35));
        }

        await new Promise((r) => setTimeout(r, 400));
        if (!active) return;

        // Add input to logs and clear typing input
        setTerminalLogs((prev) => [...prev, { type: "input", text: currentCommand }]);
        setCurrentInput("");

        // Output lines one by one
        for (const outLine of script[i].output) {
          if (!active) return;
          await new Promise((r) => setTimeout(r, 350));
          setTerminalLogs((prev) => [...prev, outLine as TerminalLog]);
        }

        await new Promise((r) => setTimeout(r, 2000));
      }

      // Loop sequence after a short delay
      await new Promise((r) => setTimeout(r, 6000));
      if (active) {
        runTerminalSequence();
      }
    };

    runTerminalSequence();

    return () => {
      active = false;
    };
  }, []);

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
              {FACTS.mcpTools} tools · 5 recipes · open-core local MCP
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 mb-8">
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

          {/* ── Interactive Live Terminal Visualizer ── */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/[0.08] bg-black/55 shadow-[0_24px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-8"
          >
            {/* Terminal Top Window Bar */}
            <div className="bg-[#111216] border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
                <Terminal className="w-3.5 h-3.5" />
                <span>Claude Code Session · arcanea-mcp-server</span>
              </div>
              <div className="w-12" />
            </div>

            {/* Terminal Console Logs */}
            <div className="p-6 font-mono text-[11px] leading-relaxed text-white/60 space-y-2 h-[340px] overflow-y-auto scrollbar-thin">
              {terminalLogs.map((log, index) => {
                if (log.type === "input") {
                  return (
                    <div key={index} className="flex items-start gap-2 text-white/80">
                      <span className="text-[var(--arc-brand-atlantean-teal)] font-bold">claude ~ %</span>
                      <span>{log.text}</span>
                    </div>
                  );
                } else if (log.type === "info") {
                  return (
                    <div key={index} className="text-white/40 flex items-start gap-2 pl-4">
                      <span>⚡</span>
                      <span>{log.text}</span>
                    </div>
                  );
                } else if (log.type === "success") {
                  return (
                    <div key={index} className="text-green-400 pl-4 font-bold flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{log.text}</span>
                    </div>
                  );
                } else if (log.type === "json") {
                  return (
                    <pre key={index} className="pl-6 text-[var(--arc-brand-arcanean-gold)]/80 overflow-x-auto">
                      <code>{log.text}</code>
                    </pre>
                  );
                } else {
                  return (
                    <div key={index} className="text-white/50 pl-6 flex items-start gap-2">
                      <span className="text-white/20">↳</span>
                      <span>{log.text}</span>
                    </div>
                  );
                }
              })}

              {/* Current typing line */}
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-[var(--arc-brand-atlantean-teal)] font-bold">claude ~ %</span>
                <span>{currentInput}</span>
                <span className="inline-block w-1.5 h-3.5 bg-[var(--arc-brand-atlantean-teal)] animate-pulse" />
              </div>
            </div>
          </m.div>

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
