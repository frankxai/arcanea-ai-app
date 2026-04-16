"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { SectionShell, SectionHeader, ConnectedFlow } from "@/components/premium";
import type { FlowStep } from "@/components/premium/connected-flow";

const STEPS: FlowStep[] = [
  {
    number: "01",
    accent: "#7fffd4",
    title: "Create anywhere",
    body:
      "Write in Arcanea, Obsidian, your plain text editor, or even Notion. Everything uses open Markdown with structured frontmatter — any tool can author.",
    iconNode: (
      <div className="flex gap-1">
        {["◧", "◱", "◰"].map((g, i) => (
          <span
            key={i}
            className="text-[10px] opacity-40 font-mono"
            style={{ color: "#7fffd4" }}
          >
            {g}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: "02",
    accent: "#00bcd4",
    title: "Sync to your vault",
    body:
      "Point Syncthing, iCloud Drive, or git at your vault folder. Arcanea watches for changes and re-embeds anything new or updated. Conflict-free merge via CRDT-style timestamps.",
    iconNode: (
      <div className="flex gap-1">
        {["↕", "↻", "⇄"].map((g, i) => (
          <span
            key={i}
            className="text-[10px] opacity-40 font-mono"
            style={{ color: "#00bcd4" }}
          >
            {g}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: "03",
    accent: "#ffd700",
    title: "Searchable everywhere",
    body:
      "pgvector indexes it all into the semantic layer within seconds. Ask anything across your entire world graph — characters, locations, events — and get ranked, relevant results.",
    iconNode: (
      <div className="flex gap-1">
        {["◎", "◉", "◈"].map((g, i) => (
          <span
            key={i}
            className="text-[10px] opacity-40 font-mono"
            style={{ color: "#ffd700" }}
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
                { name: "Syncthing", glyph: "⇄", color: "#7fffd4" },
                { name: "iCloud Drive", glyph: "☁", color: "#00bcd4" },
                { name: "Git", glyph: "◉", color: "#f97316" },
                { name: "Obsidian Sync", glyph: "◈", color: "#7c3aed" },
                { name: "Google Drive", glyph: "G", color: "#4285f4" },
                { name: "Dropbox", glyph: "◱", color: "#0061ff" },
                { name: "OneDrive", glyph: "☁", color: "#0078d4" },
                { name: "Rclone", glyph: "◰", color: "#ffd700" },
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
