"use client"

import { useState } from "react"
import {
  Sparkle,
  Lightning,
  ArrowsClockwise,
  Download,
  MagnifyingGlassPlus,
  Shuffle,
  WarningCircle,
} from '@/lib/phosphor-icons'
import { cn } from "@/lib/utils"

interface ImageTabProps {
  generationState: "idle" | "generating" | "complete" | "error"
}

const aspectRatios = [
  { label: "1:1", value: "1:1", width: 1, height: 1 },
  { label: "4:3", value: "4:3", width: 4, height: 3 },
  { label: "16:9", value: "16:9", width: 16, height: 9 },
  { label: "9:16", value: "9:16", width: 9, height: 16 },
  { label: "3:2", value: "3:2", width: 3, height: 2 },
]

const stylePresets = [
  { name: "Atlantean", desc: "Aquatic baroque splendor", color: "#00bcd4" },
  { name: "Draconic", desc: "Primal fire and scale", color: "#ef4444" },
  { name: "Ethereal", desc: "Soft astral luminance", color: "#c4b5fd" },
  { name: "Abyssal", desc: "Void-touched darkness", color: "#60a5fa" },
  { name: "Celestial", desc: "Divine star-forged light", color: "#fbbf24" },
  { name: "Ancient", desc: "Crumbled mythic relic", color: "#a78bfa" },
]

const previewImages = [
  { id: "p1", src: "/placeholder.svg?height=160&width=160", label: "Variation 1" },
  { id: "p2", src: "/placeholder.svg?height=160&width=160", label: "Variation 2" },
  { id: "p3", src: "/placeholder.svg?height=160&width=160", label: "Variation 3" },
  { id: "p4", src: "/placeholder.svg?height=160&width=160", label: "Variation 4" },
]

export function ImageTab({ generationState }: ImageTabProps) {
  const [prompt, setPrompt] = useState(
    "An Atlantean temple rising from crystalline waters at dusk, bioluminescent sea life, ancient sigils glowing violet on marble columns, dramatic god-rays"
  )
  const [selectedRatio, setSelectedRatio] = useState("16:9")
  const [selectedStyle, setSelectedStyle] = useState("Atlantean")
  const [selectedImage, setSelectedImage] = useState("p1")

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left — Controls */}
      <div className="w-72 shrink-0 border-r border-[rgba(13,71,161,0.1)] overflow-y-auto p-5 space-y-5 bg-[rgba(10,10,15,0.3)]">
        {/* Prompt */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Vision Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full text-xs bg-[#16161f] border border-[rgba(13,71,161,0.15)] rounded-xl p-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-[#0d47a1] transition-colors resize-none leading-relaxed"
            placeholder="Describe what you want to create in detail…"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground font-mono">{prompt.length}/1000</span>
            <button className="flex items-center gap-1 text-[10px] text-[#0d47a1] hover:text-[#a78bfa] transition-colors">
              <Shuffle size={10} />
              Inspire
            </button>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Aspect Ratio
          </label>
          <div className="flex gap-1.5">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setSelectedRatio(ratio.value)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[11px] font-mono transition-all duration-200 border",
                  selectedRatio === ratio.value
                    ? "bg-[rgba(13,71,161,0.2)] border-[rgba(13,71,161,0.4)] text-[#a78bfa]"
                    : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground hover:border-[rgba(13,71,161,0.2)]"
                )}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style Presets */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Mythic Style
          </label>
          <div className="space-y-1.5">
            {stylePresets.map((style) => (
              <button
                key={style.name}
                onClick={() => setSelectedStyle(style.name)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 border",
                  selectedStyle === style.name
                    ? "border-[rgba(13,71,161,0.35)] bg-[rgba(13,71,161,0.1)]"
                    : "border-transparent hover:border-[rgba(13,71,161,0.15)] hover:bg-[rgba(13,71,161,0.04)]"
                )}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: style.color, boxShadow: `0 0 8px ${style.color}60` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{style.name}</p>
                  <p className="text-[10px] text-muted-foreground">{style.desc}</p>
                </div>
                {selectedStyle === style.name && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d47a1]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Quality
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {["Draft", "Standard", "Arcane"].map((q) => (
              <button
                key={q}
                className={cn(
                  "py-1.5 rounded-lg text-[11px] border transition-all duration-200",
                  q === "Arcane"
                    ? "border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.08)] text-[#ffd700]"
                    : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground"
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {generationState === "idle" ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-[rgba(13,71,161,0.25)] flex items-center justify-center bg-[rgba(13,71,161,0.04)]">
                <Sparkle size={40} className="text-[rgba(13,71,161,0.3)]" />
              </div>
              <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(13,71,161,0.06)_0%,transparent_70%)]" />
            </div>
            <div className="text-center max-w-sm">
              <h3 className="font-serif text-xl text-foreground mb-2">Summon Your Vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Craft your prompt, choose a mythic style, and let the Arcana AI render what exists beyond imagination.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Lightning size={12} className="text-[#ffd700]" />
              <span>Estimated: 25 credits · ~12 seconds</span>
            </div>
          </div>
        ) : generationState === "generating" ? (
          /* Generating State */
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-10">
            <div className="relative">
              <div className="w-64 h-40 rounded-2xl border border-[rgba(13,71,161,0.3)] overflow-hidden shimmer">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,71,161,0.2)_0%,transparent_70%)]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[rgba(13,71,161,0.15)] border border-[rgba(13,71,161,0.4)] flex items-center justify-center pulse-glow">
                  <Sparkle size={20} className="text-[#0d47a1]" style={{ animation: "spin 3s linear infinite" }} />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-serif text-lg text-foreground mb-1">Rendering the Unseen…</p>
              <p className="text-sm text-muted-foreground">Synthesizing mythic elements and cosmic color</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#0d47a1]"
                  style={{ animation: `wave 1.2s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
          </div>
        ) : generationState === "error" ? (
          /* Error State */
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-10">
            <div className="w-20 h-20 rounded-2xl border border-red-500/20 bg-red-500/05 flex items-center justify-center">
              <WarningCircle size={36} className="text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg text-foreground mb-2">The Ether Resists</h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                An anomaly disrupted the vision weave. Your credits were not consumed. Try adjusting your prompt or style.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(239,68,68,0.1)] border border-red-500/20 text-red-400 text-sm hover:bg-[rgba(239,68,68,0.15)] transition-colors">
              <ArrowsClockwise size={14} />
              Retry Generation
            </button>
          </div>
        ) : (
          /* Complete State — Preview Grid */
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base text-foreground">Generated Variations</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground hover:border-[rgba(13,71,161,0.2)] transition-all">
                  <ArrowsClockwise size={12} />
                  Regenerate
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[rgba(13,71,161,0.15)] border border-[rgba(13,71,161,0.3)] text-[#a78bfa] hover:bg-[rgba(13,71,161,0.25)] transition-all">
                  <Download size={12} />
                  Export All
                </button>
              </div>
            </div>
            {/* Main selected image */}
            <div className="relative mb-4 rounded-2xl overflow-hidden border border-[rgba(13,71,161,0.2)] group">
              <img
                src="/placeholder.svg?height=360&width=640"
                alt="Generated artwork"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg bg-[rgba(10,10,15,0.8)] border border-[rgba(13,71,161,0.3)] text-foreground hover:text-[#a78bfa] transition-colors">
                  <MagnifyingGlassPlus size={14} />
                </button>
                <button className="p-2 rounded-lg bg-[rgba(10,10,15,0.8)] border border-[rgba(13,71,161,0.3)] text-foreground hover:text-[#a78bfa] transition-colors">
                  <Download size={14} />
                </button>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-full bg-[rgba(10,10,15,0.8)] border border-[rgba(0,188,212,0.3)] text-[10px] text-[#00bcd4] font-mono">
                  Atlantean · 16:9
                </span>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {previewImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.id)}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden border transition-all duration-200",
                    selectedImage === img.id
                      ? "border-[#0d47a1] ring-1 ring-[rgba(13,71,161,0.3)]"
                      : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(13,71,161,0.3)]"
                  )}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  {selectedImage === img.id && (
                    <div className="absolute inset-0 bg-[rgba(13,71,161,0.15)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
