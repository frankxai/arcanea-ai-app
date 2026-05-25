/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client"

import {
  FloppyDisk,
  Share,
  Download,
  Lightning,
  ArrowsClockwise,
  Eye,
  Coins,
} from '@/lib/phosphor-icons'
import { cn } from "@/lib/utils"

interface BottomBarProps {
  generationState: "idle" | "generating" | "complete" | "error"
  activeTab: string
  creditCost: number
  onSave: () => void
  onPublish: () => void
  onExport: () => void
  onGenerate: () => void
}

const tabCostMap: Record<string, number> = {
  text: 5,
  image: 25,
  video: 120,
  music: 40,
  code: 8,
}

export function BottomBar({
  generationState,
  activeTab,
  creditCost,
  onSave,
  onPublish,
  onExport,
  onGenerate,
}: BottomBarProps) {
  const cost = tabCostMap[activeTab] ?? creditCost
  const isGenerating = generationState === "generating"

  return (
    <footer className="shrink-0 h-14 border-t border-[rgba(13,71,161,0.15)] bg-[var(--arc-cosmic-void)] px-5 flex items-center justify-between gap-4">
      {/* Left — Save / Draft actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:text-foreground hover:border-[rgba(13,71,161,0.25)] hover:bg-[rgba(13,71,161,0.06)] transition-all duration-200"
        >
          <FloppyDisk size={13} />
          Save Draft
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:text-foreground hover:border-[rgba(13,71,161,0.25)] hover:bg-[rgba(13,71,161,0.06)] transition-all duration-200"
        >
          <Download size={13} />
          Export
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:text-foreground hover:border-[rgba(13,71,161,0.25)] hover:bg-[rgba(13,71,161,0.06)] transition-all duration-200">
          <Eye size={13} />
          Preview
        </button>
      </div>

      {/* Center — Cost estimate */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,215,0,0.06)] border border-[rgba(255,215,0,0.15)]">
          <Coins size={13} className="text-[var(--arc-brand-arcanean-gold)]" />
          <span className="text-[11px] text-muted-foreground font-mono">Est. cost:</span>
          <span className="text-[11px] font-bold text-[var(--arc-brand-arcanean-gold)] font-mono">{cost} credits</span>
        </div>
        {generationState === "generating" && (
          <div className="flex items-center gap-1.5">
            <ArrowsClockwise size={12} className="text-[var(--arc-brand-cosmic-blue)] animate-spin" />
            <span className="text-[11px] text-[var(--arc-brand-cosmic-blue)] font-mono">Weaving…</span>
          </div>
        )}
        {generationState === "complete" && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]" />
            <span className="text-[11px] text-[var(--arc-brand-atlantean-teal)] font-mono">Ready</span>
          </div>
        )}
        {generationState === "error" && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-[11px] text-red-400 font-mono">Failed</span>
          </div>
        )}
      </div>

      {/* Right — Primary actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
            isGenerating
              ? "bg-[rgba(13,71,161,0.2)] text-[var(--arc-brand-cosmic-blue)] border border-[rgba(13,71,161,0.3)] cursor-not-allowed"
              : "bg-gradient-to-r from-[var(--arc-brand-cosmic-blue)] to-[var(--arc-void)] text-white hover:from-[var(--arc-void)] hover:to-[var(--arc-brand-cosmic-blue)] shadow-lg shadow-[rgba(13,71,161,0.3)] glow-violet"
          )}
        >
          <Lightning size={13} weight={isGenerating ? "regular" : "fill"} className={isGenerating ? "animate-pulse" : ""} />
          {isGenerating ? "Generating…" : "Generate"}
        </button>
        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/20 to-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] border border-[rgba(0,188,212,0.3)] hover:from-[var(--arc-brand-atlantean-teal)]/30 hover:to-[var(--arc-brand-atlantean-teal)]/20 hover:border-[rgba(0,188,212,0.5)] transition-all duration-200"
        >
          <Share size={13} />
          Publish
        </button>
      </div>
    </footer>
  )
}
