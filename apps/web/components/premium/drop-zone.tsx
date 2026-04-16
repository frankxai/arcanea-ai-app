"use client";

import { m } from "framer-motion";
import { useState } from "react";

// ---------------------------------------------------------------------------
// DropZone — The universal ingestion surface for Arcanea Studio.
// "Drop anything in" — files, URLs, embeds, paste from clipboard.
// The system auto-classifies, stores as markdown/JSONML, routes to world.
// ---------------------------------------------------------------------------

interface AcceptedType {
  label: string;
  extensions: string[];
  icon: string;
  color: string;
}

const ACCEPTED_TYPES: AcceptedType[] = [
  { label: "Markdown", extensions: [".md", ".mdx"], icon: "◩", color: "#7fffd4" },
  { label: "Documents", extensions: [".pdf", ".docx", ".txt"], icon: "◧", color: "#00bcd4" },
  { label: "Images", extensions: [".jpg", ".png", ".webp", ".gif"], icon: "◉", color: "#a855f7" },
  { label: "Audio", extensions: [".mp3", ".wav", ".ogg"], icon: "♪", color: "#f472b6" },
  { label: "Video", extensions: [".mp4", ".mov", ".webm"], icon: "▶", color: "#ef4444" },
  { label: "Data", extensions: [".json", ".jsonml", ".yaml", ".csv"], icon: "◈", color: "#ffd700" },
  { label: "URLs", extensions: ["https://", "http://"], icon: "⎆", color: "#c084fc" },
  { label: "Embeds", extensions: ["oembed"], icon: "⌬", color: "#60a5fa" },
];

const SOURCES = [
  { label: "Claude Code", glyph: "✶", color: "#f97316" },
  { label: "Obsidian vault", glyph: "◰", color: "#7c3aed" },
  { label: "Google Drive", glyph: "▲", color: "#4285f4" },
  { label: "Notion", glyph: "▰", color: "#ffffff" },
  { label: "Syncthing", glyph: "⟲", color: "#4fa4d4" },
  { label: "GitHub", glyph: "◉", color: "#ffffff" },
  { label: "Linear", glyph: "▰", color: "#5e6ad2" },
];

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [pasted, setPasted] = useState(false);

  return (
    <div
      className="relative"
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
    >
      <m.div
        animate={{
          borderColor: isDragging ? "#7fffd4" : "rgba(255,255,255,0.08)",
          backgroundColor: isDragging ? "rgba(127,255,212,0.04)" : "rgba(255,255,255,0.02)",
        }}
        transition={{ duration: 0.3 }}
        className="relative rounded-3xl border-2 border-dashed p-12 md:p-16 text-center overflow-hidden"
      >
        {/* Animated aurora backdrop when dragging */}
        {isDragging && (
          <m.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <m.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(ellipse 60% 40% at 30% 30%, rgba(127,255,212,0.18), transparent 70%)",
                  "radial-gradient(ellipse 60% 40% at 70% 70%, rgba(0,188,212,0.16), transparent 70%)",
                  "radial-gradient(ellipse 60% 40% at 30% 70%, rgba(255,215,0,0.12), transparent 70%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </m.div>
        )}

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative">
          {/* Icon */}
          <m.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{
              background: isDragging ? "rgba(127,255,212,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isDragging ? "rgba(127,255,212,0.4)" : "rgba(255,255,255,0.08)"}`,
            }}
            animate={{
              scale: isDragging ? 1.1 : 1,
              rotate: isDragging ? [0, -5, 5, -5, 0] : 0,
            }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-4xl"
              style={{
                color: isDragging ? "#7fffd4" : "rgba(255,255,255,0.5)",
              }}
            >
              ⇡
            </span>
          </m.div>

          {/* Headline */}
          <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
              {isDragging ? "Release to ingest" : "Drop anything in"}
            </span>
          </h3>

          {/* Subtitle */}
          <p className="text-base text-white/45 leading-relaxed max-w-md mx-auto mb-8">
            Files, URLs, text, embeds — the Studio classifies, stores as markdown or JSON, and routes to your world graph. Open formats. Portable.
          </p>

          {/* Accepted types row */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {ACCEPTED_TYPES.map((type) => (
              <span
                key={type.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono"
                style={{ color: `${type.color}cc` }}
              >
                <span>{type.icon}</span>
                {type.label}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] text-[#09090b] text-sm font-semibold hover:shadow-[0_0_24px_rgba(127,255,212,0.3)] transition-all"
            >
              Browse files
            </button>
            <button
              type="button"
              onClick={() => {
                setPasted(true);
                setTimeout(() => setPasted(false), 1500);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08] transition-colors"
            >
              {pasted ? "Paste detected ✓" : "⌘V to paste"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08] transition-colors"
            >
              Paste URL
            </button>
          </div>
        </div>
      </m.div>

      {/* Sources strip below */}
      <div className="mt-6">
        <p className="text-center text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-4">
          Or pull from connected sources
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SOURCES.map((s) => (
            <button
              key={s.label}
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all group"
            >
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold"
                style={{
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}30`,
                  color: s.color,
                }}
              >
                {s.glyph}
              </span>
              <span className="text-xs font-medium text-white/60 group-hover:text-white/90 transition-colors">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
