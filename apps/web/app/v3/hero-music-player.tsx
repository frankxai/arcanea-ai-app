/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Play, Pause, MusicNotes } from "@/lib/phosphor-icons";
import { m } from "framer-motion";

export function HeroMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.06] transition-all group pointer-events-auto">
      <div className="flex items-center gap-3">
        <m.div 
          animate={{ 
            rotate: isPlaying ? 360 : 0,
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--arc-brand-atlantean-teal)]/20 to-[var(--arc-brand-cosmic-blue)]/20 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,188,212,0.15)]"
        >
          <MusicNotes size={18} weight="fill" className="text-[var(--arc-brand-atlantean-teal)]" />
        </m.div>
        
        <div className="text-left">
          <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold leading-none mb-1">Frequency</div>
          <div className="text-[13px] text-white/80 font-semibold tracking-tight truncate max-w-[100px]">
            {isPlaying ? "Arcanean Echoes" : "Resonator"}
          </div>
        </div>
      </div>

      <div className="flex items-end gap-1 h-4 px-2">
        {[1, 2, 3, 4].map((i) => (
          <m.div
            key={i}
            animate={{
              height: isPlaying ? [4, 16, 8, 14, 4] : 4,
            }}
            transition={{
              duration: 0.6 + (i * 0.1),
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[3px] bg-[var(--arc-brand-atlantean-teal)]/50 rounded-full"
          />
        ))}
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-[var(--arc-brand-atlantean-teal)] hover:text-white transition-all duration-300"
      >
        {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" className="ml-0.5" />}
      </button>
    </div>
  );
}
