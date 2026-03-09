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
    <footer className="shrink-0 h-14 border-t border-[rgba(13,71,161,0.15)] bg-[#0d0d15] px-5 flex items-center justify-between gap-4">
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
          <Coins size={13} className="text-[#ffd700]" />
          <span className="text-[11px] text-muted-foreground font-mono">Est. cost:</span>
          <span className="text-[11px] font-bold text-[#ffd700] font-mono">{cost} credits</span>
        </div>
        {generationState === "generating" && (
          <div className="flex items-center gap-1.5">
            <ArrowsClockwise size={12} className="text-[#0d47a1] animate-spin" />
            <span className="text-[11px] text-[#0d47a1] font-mono">Weaving…</span>
          </div>
        )}
        {generationState === "complete" && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00bcd4]" />
            <span className="text-[11px] text-[#00bcd4] font-mono">Ready</span>
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
              ? "bg-[rgba(13,71,161,0.2)] text-[#0d47a1] border border-[rgba(13,71,161,0.3)] cursor-not-allowed"
              : "bg-gradient-to-r from-[#0d47a1] to-[#7c3aed] text-white hover:from-[#9d70f8] hover:to-[#0d47a1] shadow-lg shadow-[rgba(13,71,161,0.3)] glow-violet"
          )}
        >
          <Lightning size={13} weight={isGenerating ? "regular" : "fill"} className={isGenerating ? "animate-pulse" : ""} />
          {isGenerating ? "Generating…" : "Generate"}
        </button>
        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#00bcd4]/20 to-[#00bcd4]/10 text-[#00bcd4] border border-[rgba(0,188,212,0.3)] hover:from-[#00bcd4]/30 hover:to-[#00bcd4]/20 hover:border-[rgba(0,188,212,0.5)] transition-all duration-200"
        >
          <Share size={13} />
          Publish
        </button>
      </div>
    </footer>
  )
}
