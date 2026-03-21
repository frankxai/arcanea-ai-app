"use client";

import { useState } from "react";
import { MusicNote, Info } from "@/lib/phosphor-icons";
import { MUSIC_MOODS } from "./studio-types";

// ---------------------------------------------------------------------------
// Music Creation Panel
// ---------------------------------------------------------------------------

export function MusicCreationPanel() {
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("Ethereal");

  return (
    <div className="flex flex-col lg:flex-row gap-0 flex-1 min-h-0">
      {/* Description */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="text-xs text-text-muted font-mono">
            Describe the sound
          </span>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the music you want to create...

Example: A haunting melody with crystal chimes echoing through
a vast space, building to a crescendo of orchestral strings
and choir — tension resolving into stillness."
          aria-label="Music description"
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7fffd4]/20 focus:ring-inset min-h-[200px]"
        />

        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02]">
          <p className="text-xs text-text-muted mb-2">Mood:</p>
          <div className="flex flex-wrap gap-2">
            {MUSIC_MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  mood === m
                    ? "border-blue-400/40 bg-blue-400/15 text-blue-400"
                    : "border-white/[0.06] bg-white/[0.04] text-text-muted hover:border-white/[0.12]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <MusicNote size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-text-primary">
            Sound Preview
          </span>
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center gap-4">
          {/* Waveform visualization */}
          <div className="w-full h-20 rounded-xl border border-white/[0.06] bg-gradient-to-r from-blue-500/5 via-brand-primary/5 to-blue-500/5 flex items-center justify-center overflow-hidden">
            <div className="flex items-end gap-[3px] h-12">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-400/40 rounded-full transition-all"
                  style={{
                    height: `${8 + Math.sin(i * 0.5) * 20 + 8}px`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-text-muted">
              {description.trim()
                ? `Mood: ${mood}`
                : "Describe your sound above"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-400/20">
            <Info size={12} className="text-blue-400" />
            <span className="text-[10px] text-blue-400">
              Music generation coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
