"use client"

import { useState } from "react"
import {
  Sparkle,
  Lightning,
  Camera,
  ArrowsClockwise,
  Play,
  Pause,
  SpeakerHigh,
  WarningCircle,
} from '@/lib/phosphor-icons'
import { cn } from "@/lib/utils"

interface VideoTabProps {
  generationState: "idle" | "generating" | "complete" | "error"
}

const cameraMovements = [
  { id: "static", label: "Static", desc: "No movement" },
  { id: "pan-left", label: "Pan Left", desc: "Slow horizontal pan" },
  { id: "pan-right", label: "Pan Right", desc: "Slow horizontal pan" },
  { id: "zoom-in", label: "Zoom In", desc: "Gradual approach" },
  { id: "zoom-out", label: "Zoom Out", desc: "Gradual retreat" },
  { id: "orbit", label: "Orbit", desc: "360° rotation" },
  { id: "dolly", label: "Dolly", desc: "Track forward" },
  { id: "crane", label: "Crane", desc: "Vertical rise" },
]

const videoStyles = ["Cinematic", "Anime", "Documentary", "Epic Fantasy", "Dreamlike"]

export function VideoTab({ generationState }: VideoTabProps) {
  const [prompt, setPrompt] = useState(
    "A colossal dragon descending from storm clouds onto a burning Olympian temple, slow motion, cinematic light beams through smoke"
  )
  const [duration, setDuration] = useState(8)
  const [selectedCamera, setSelectedCamera] = useState("crane")
  const [selectedStyle, setSelectedStyle] = useState("Cinematic")
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="flex h-full overflow-hidden">
      {/* Controls */}
      <div className="w-80 shrink-0 border-r border-[rgba(139,92,246,0.1)] overflow-y-auto p-5 space-y-5 bg-[rgba(10,10,15,0.3)]">
        {/* Prompt */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Scene Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full text-xs bg-[#16161f] border border-[rgba(139,92,246,0.15)] rounded-xl p-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-[#8b5cf6] transition-colors resize-none leading-relaxed"
            placeholder="Describe the video scene with movement, mood, and mythic detail…"
          />
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
              Duration
            </label>
            <span className="text-xs font-bold text-[#7fffd4] font-mono">{duration}s</span>
          </div>
          <input
            type="range"
            min={3}
            max={30}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-[rgba(139,92,246,0.15)] accent-[#8b5cf6] cursor-pointer"
            style={{ accentColor: "#8b5cf6" }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground font-mono">3s</span>
            <span className="text-[10px] text-muted-foreground font-mono">30s</span>
          </div>
        </div>

        {/* Camera Movement */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Camera Movement
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {cameraMovements.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCamera(cam.id)}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-lg text-left border transition-all duration-200",
                  selectedCamera === cam.id
                    ? "border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.12)]"
                    : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(139,92,246,0.2)] hover:bg-[rgba(139,92,246,0.04)]"
                )}
              >
                <Camera
                  size={12}
                  className={selectedCamera === cam.id ? "text-[#8b5cf6] mt-0.5 shrink-0" : "text-muted-foreground mt-0.5 shrink-0"}
                />
                <div>
                  <p className="text-[11px] font-medium text-foreground leading-tight">{cam.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{cam.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Video Style */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Visual Style
          </label>
          <div className="flex flex-wrap gap-1.5">
            {videoStyles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] border transition-all duration-200",
                  selectedStyle === style
                    ? "bg-[rgba(139,92,246,0.2)] border-[rgba(139,92,246,0.4)] text-[#a78bfa]"
                    : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground hover:border-[rgba(139,92,246,0.2)]"
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Cost estimate */}
        <div className="p-3 rounded-xl border border-[rgba(255,215,0,0.15)] bg-[rgba(255,215,0,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Estimated cost</span>
            <span className="text-sm font-bold text-[#ffd700] font-mono">{duration * 15} credits</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-muted-foreground">Est. time</span>
            <span className="text-[11px] text-muted-foreground font-mono">~{Math.ceil(duration * 3)}s</span>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {generationState === "idle" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-10">
            <div className="relative w-full max-w-lg">
              <div className="aspect-video rounded-2xl border-2 border-dashed border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.03)] flex flex-col items-center justify-center gap-3">
                <Sparkle size={44} className="text-[rgba(139,92,246,0.25)]" />
                <p className="text-sm text-muted-foreground">Your video will appear here</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Lightning size={12} className="text-[#ffd700]" />
              <span>Estimated: {duration * 15} credits · ~{Math.ceil(duration * 3)}s generation time</span>
            </div>
          </div>
        ) : generationState === "generating" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 p-10">
            <div className="relative w-full max-w-lg">
              <div className="aspect-video rounded-2xl overflow-hidden shimmer border border-[rgba(139,92,246,0.3)]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.4)] flex items-center justify-center pulse-glow">
                  <Sparkle size={24} className="text-[#8b5cf6]" style={{ animation: "spin 3s linear infinite" }} />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-serif text-xl text-foreground mb-2">Animating the Epic…</p>
              <p className="text-sm text-muted-foreground">Rendering {duration} seconds of video</p>
            </div>
            <div className="w-full max-w-md">
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono mb-1.5">
                <span>Frame synthesis</span>
                <span>47%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[rgba(139,92,246,0.1)] overflow-hidden">
                <div className="h-full w-[47%] rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7fffd4] shimmer" />
              </div>
            </div>
          </div>
        ) : generationState === "error" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-10">
            <div className="w-20 h-20 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
              <WarningCircle size={36} className="text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg text-foreground mb-2">Vision Collapsed</h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                The cinematic weave failed to hold. Your credits were returned.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(239,68,68,0.1)] border border-red-500/20 text-red-400 text-sm hover:bg-[rgba(239,68,68,0.15)] transition-colors">
              <ArrowsClockwise size={14} />
              Retry Generation
            </button>
          </div>
        ) : (
          /* Complete */
          <div className="flex-1 flex flex-col overflow-hidden p-5 gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base text-foreground">Generated Video</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground transition-all">
                  <ArrowsClockwise size={12} />
                  Regenerate
                </button>
              </div>
            </div>
            {/* Video Player */}
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(139,92,246,0.2)] bg-black group flex-1 max-h-80">
              <img
                src="/placeholder.svg?height=320&width=640"
                alt="Generated video preview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-[rgba(139,92,246,0.9)] flex items-center justify-center hover:bg-[#8b5cf6] transition-colors glow-violet"
                >
                  {isPlaying ? <Pause size={24} weight="fill" className="text-white" /> : <Play size={24} weight="fill" className="text-white ml-1" />}
                </button>
              </div>
              {/* Controls bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3">
                <button onClick={() => setIsPlaying(!isPlaying)} className="text-white">
                  {isPlaying ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
                </button>
                <div className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-[35%] rounded-full bg-[#8b5cf6]" />
                </div>
                <span className="text-[10px] text-white/60 font-mono">0:03 / 0:{duration.toString().padStart(2, '0')}</span>
                <button className="text-white/60 hover:text-white transition-colors">
                  <SpeakerHigh size={14} />
                </button>
              </div>
            </div>
            {/* Metadata */}
            <div className="flex gap-3">
              {[
                { label: "Style", value: selectedStyle },
                { label: "Camera", value: cameraMovements.find(c => c.id === selectedCamera)?.label ?? selectedCamera },
                { label: "Duration", value: `${duration}s` },
                { label: "Resolution", value: "1920×1080" },
              ].map((meta) => (
                <div key={meta.label} className="flex-1 p-2.5 rounded-lg bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.1)] text-center">
                  <p className="text-[10px] text-muted-foreground">{meta.label}</p>
                  <p className="text-xs font-medium text-foreground mt-0.5">{meta.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
