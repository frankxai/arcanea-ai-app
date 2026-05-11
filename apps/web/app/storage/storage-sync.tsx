/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { SectionShell, SectionHeader, ConnectedFlow } from "@/components/premium";
import type { FlowStep } from "@/components/premium/connected-flow";

const STEPS: FlowStep[] = [
  {
    number: "01",
    accent: "var(--arc-brand-atlantean-teal)",
    title: "Create anywhere",
    body:
      "Write in Arcanea, Obsidian, your plain text editor, or even Notion. Everything uses open Markdown with structured frontmatter — any tool can author.",
    iconNode: (
      <div className="flex gap-1">
        {["◧", "◱", "◰"].map((g, i) => (
          <span
            key={i}
            className="text-[10px] opacity-40 font-mono"
            style={{ color: "var(--arc-brand-atlantean-teal)" }}
          >
            {g}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: "02",
    accent: "var(--arc-brand-atlantean-teal)",
    title: "Sync to your vault",
    body:
      "Point Syncthing, iCloud Drive, or git at your vault folder. Arcanea watches for changes and re-embeds anything new or updated. Conflict-free merge via CRDT-style timestamps.",
    iconNode: (
      <div className="flex gap-1">
        {["↕", "↻", "⇄"].map((g, i) => (
          <span
            key={i}
            className="text-[10px] opacity-40 font-mono"
            style={{ color: "var(--arc-brand-atlantean-teal)" }}
          >
            {g}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: "03",
    accent: "var(--arc-brand-arcanean-gold)",
    title: "Searchable everywhere",
    body:
      "pgvector indexes it all into the semantic layer within seconds. Ask anything across your entire world graph — characters, locations, events — and get ranked, relevant results.",
    iconNode: (
      <div className="flex gap-1">
        {["◎", "◉", "◈"].map((g, i) => (
          <span
            key={i}
            className="text-[10px] opacity-40 font-mono"
            style={{ color: "var(--arc-brand-arcanean-gold)" }}
          >
            {g}
          </span>
        ))}
      </div>
    ),
  },
];

export function StorageSync() {
  return (
    <LazyMotion features={domAnimation}>
      <SectionShell ambient="teal" id="sync">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Sync across tools"
            title="Three steps. Zero lock-in."
            subtitle="Write in any tool, sync through any path, search through everything — the semantic layer handles the rest."
            accent="teal"
          />

          <ConnectedFlow steps={STEPS} />

          {/* Supported sync tools */}
          <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-5 text-center">
              Compatible sync methods
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Syncthing", glyph: "⇄", color: "var(--arc-brand-atlantean-teal)" },
                { name: "iCloud Drive", glyph: "☁", color: "var(--arc-brand-atlantean-teal)" },
                { name: "Git", glyph: "◉", color: "var(--arc-fire)" },
                { name: "Obsidian Sync", glyph: "◈", color: "var(--arc-void)" },
                { name: "Google Drive", glyph: "G", color: "var(--arc-brand-atlantean-teal)" },
                { name: "Dropbox", glyph: "◱", color: "var(--arc-brand-cosmic-blue)" },
                { name: "OneDrive", glyph: "☁", color: "var(--arc-brand-atlantean-teal)" },
                { name: "Rclone", glyph: "◰", color: "var(--arc-brand-arcanean-gold)" },
              ].map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.025] border border-white/[0.06]"
                >
                  <span
                    className="text-sm font-mono font-bold"
                    style={{ color: tool.color }}
                  >
                    {tool.glyph}
                  </span>
                  <span className="text-xs text-white/50 font-body">
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>
    </LazyMotion>
  );
}
