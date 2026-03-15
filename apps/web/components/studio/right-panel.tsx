"use client"

import { useState } from "react"
import {
  Sparkle,
  Lightning,
  Robot,
  ArrowRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Waveform,
  Palette,
  ClockCounterClockwise,
  ChartBar,
  Globe,
  Star,
} from '@/lib/phosphor-icons'
import { cn } from "@/lib/utils"

const suggestions = [
  {
    id: "s1",
    type: "style",
    label: "Atlantean Baroque",
    description: "Ornate underwater palatial aesthetics with coral and gold",
  },
  {
    id: "s2",
    type: "enhance",
    label: "Deepen the mysticism",
    description: "Add layers of arcane symbolism and ancient prophecy",
  },
  {
    id: "s3",
    type: "remix",
    label: "Celestial variant",
    description: "Shift the palette to stars, nebulae, and astral planes",
  },
]

const history = [
  { id: "h1", prompt: "Ancient dragon perched on crystalline spire", type: "image", time: "2m" },
  { id: "h2", prompt: "The last oracle speaks of the age's end", type: "text", time: "15m" },
  { id: "h3", prompt: "Ethereal choir of the void, 120 BPM", type: "music", time: "1h" },
]

const stylePresets = [
  { name: "Atlantean", color: "#00bcd4", active: true },
  { name: "Draconic", color: "#ef4444", active: false },
  { name: "Ethereal", color: "#c4b5fd", active: false },
  { name: "Celestial", color: "#fbbf24", active: false },
  { name: "Abyssal", color: "#60a5fa", active: false },
  { name: "Ancient", color: "#a78bfa", active: false },
]

interface RightPanelProps {
  generationState: "idle" | "generating" | "complete" | "error"
  activeTab: string
}

export function RightPanel({ generationState, activeTab }: RightPanelProps) {
  const [selectedStyle, setSelectedStyle] = useState("Atlantean")
  const [activeSection, setActiveSection] = useState<"assistant" | "history">("assistant")
  const [aiMessage, setAiMessage] = useState("")

  return (
    <aside className="flex flex-col h-full w-72 shrink-0 border-l border-[rgba(13,71,161,0.15)] bg-[#0d0d15]">
      {/* Panel Header Tabs */}
      <div className="flex border-b border-[rgba(13,71,161,0.12)]">
        {(["assistant", "history"] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-200",
              activeSection === section
                ? "text-[#0d47a1] border-b-2 border-[#0d47a1]"
                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
            )}
          >
            {section === "assistant" ? (
              <>
                <Robot size={13} />
                AI Muse
              </>
            ) : (
              <>
                <ClockCounterClockwise size={13} />
                History
              </>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeSection === "assistant" ? (
          <div className="p-4 space-y-5">
            {/* AI Status */}
            <div className="rounded-xl glass-subtle p-3.5">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    generationState === "generating"
                      ? "bg-[rgba(13,71,161,0.2)] pulse-glow"
                      : "bg-gradient-to-br from-[#0d47a1] to-[#6d28d9]"
                  )}
                >
                  {generationState === "generating" ? (
                    <Waveform size={14} className="text-[#0d47a1] animate-pulse" />
                  ) : (
                    <Sparkle size={14} weight="fill" className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground mb-1">
                    {generationState === "generating"
                      ? "Weaving your vision…"
                      : generationState === "complete"
                      ? "Creation manifested!"
                      : generationState === "error"
                      ? "The ether resists…"
                      : "Arcana AI is ready"}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {generationState === "generating"
                      ? "Drawing from the ancient archives and aligning the celestial coordinates for your creation."
                      : generationState === "complete"
                      ? "Your creation has been brought into existence. Explore variations or refine further."
                      : generationState === "error"
                      ? "An anomaly disrupted the weave. Adjust your parameters and try again."
                      : `Ready to assist with your ${activeTab} creation. Describe your vision or use suggestions below.`}
                  </p>
                </div>
              </div>
              {generationState === "generating" && (
                <div className="mt-3 rounded-lg overflow-hidden h-1.5 bg-[rgba(13,71,161,0.1)]">
                  <div className="h-full shimmer rounded-lg" />
                </div>
              )}
            </div>

            {/* Quick Input */}
            <div>
              <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
                Ask the Muse
              </label>
              <div className="flex gap-2">
                <input
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Refine, remix, or ask…"
                  className="flex-1 text-xs bg-[#16161f] border border-[rgba(13,71,161,0.15)] rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:border-[#0d47a1] transition-colors"
                />
                <button className="p-2 rounded-lg bg-[rgba(13,71,161,0.15)] text-[#0d47a1] hover:bg-[rgba(13,71,161,0.25)] transition-colors">
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </div>

            {/* Style Presets */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Palette size={12} className="text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                  Style Presets
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {stylePresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedStyle(preset.name)}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 border",
                      selectedStyle === preset.name
                        ? "border-[rgba(13,71,161,0.5)] bg-[rgba(13,71,161,0.15)] text-foreground"
                        : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-muted-foreground hover:text-foreground hover:border-[rgba(13,71,161,0.25)]"
                    )}
                  >
                    <span
                      className="block w-2 h-2 rounded-full mx-auto mb-1"
                      style={{ background: preset.color, boxShadow: `0 0 6px ${preset.color}60` }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Lightning size={12} className="text-[#ffd700]" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                  Suggestions
                </span>
              </div>
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    className="w-full text-left p-2.5 rounded-lg border border-[rgba(13,71,161,0.12)] bg-[rgba(13,71,161,0.05)] hover:border-[rgba(13,71,161,0.3)] hover:bg-[rgba(13,71,161,0.1)] transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-semibold text-[#a78bfa] group-hover:text-[#c4b5fd] transition-colors">
                        {s.label}
                      </span>
                      <ArrowRight
                        size={11}
                        className="text-muted-foreground group-hover:text-[#0d47a1] transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-[rgba(255,215,0,0.12)] bg-[rgba(255,215,0,0.04)] p-3">
              <div className="flex items-center gap-1.5 mb-2.5">
                <ChartBar size={12} className="text-[#ffd700]" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#ffd700]">
                  Session Stats
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Generated", value: "12" },
                  { label: "Credits used", value: "340" },
                  { label: "Saved", value: "5" },
                  { label: "Published", value: "2" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-sm font-bold text-[#ffd700] font-mono">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Buttons */}
            {generationState === "complete" && (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2">
                  Rate this creation
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[rgba(0,188,212,0.2)] text-[#00bcd4] hover:bg-[rgba(0,188,212,0.08)] text-xs transition-colors">
                    <ThumbsUp size={13} /> Arcane
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] text-muted-foreground hover:bg-[rgba(255,255,255,0.04)] text-xs transition-colors">
                    <ThumbsDown size={13} /> Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* History Panel */
          <div className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground px-1">
              Recent Generations
            </p>
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-[rgba(13,71,161,0.1)] bg-[rgba(13,71,161,0.04)] hover:border-[rgba(13,71,161,0.25)] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(13,71,161,0.15)] text-[#a78bfa] font-mono capitalize">
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                      <Copy size={11} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">{item.prompt}</p>
              </div>
            ))}
            <button className="w-full py-2.5 text-xs text-[#0d47a1] hover:text-[#a78bfa] border border-[rgba(13,71,161,0.15)] hover:border-[rgba(13,71,161,0.3)] rounded-lg transition-all duration-200">
              Load more history
            </button>
          </div>
        )}
      </div>

      {/* Credits Footer */}
      <div className="px-4 py-3 border-t border-[rgba(13,71,161,0.12)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe size={12} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">API Status</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse" />
            <span className="text-[10px] text-[#00bcd4] font-mono">Nominal</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Remaining credits</span>
          <div className="flex items-center gap-1">
            <Star size={10} weight="fill" className="text-[#ffd700]" />
            <span className="text-[11px] font-bold text-[#ffd700] font-mono">2,847</span>
          </div>
        </div>
        <div className="mt-1.5 h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0d47a1] to-[#00bcd4]"
            style={{ width: "71%" }}
          />
        </div>
      </div>
    </aside>
  )
}
