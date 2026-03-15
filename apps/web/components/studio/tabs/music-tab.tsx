"use client"

import { useState, useEffect } from "react"
import {
  Sparkle,
  Play,
  Pause,
  SpeakerHigh,
  ArrowsClockwise,
  WarningCircle,
  Metronome,
  MusicNote,
} from '@/lib/phosphor-icons'
import { cn } from "@/lib/utils"

interface MusicTabProps {
  generationState: "idle" | "generating" | "complete" | "error"
}

const moods = [
  { id: "epic", label: "Epic", color: "#ffd700" },
  { id: "mystical", label: "Mystical", color: "#0d47a1" },
  { id: "melancholic", label: "Melancholic", color: "#60a5fa" },
  { id: "triumphant", label: "Triumphant", color: "#00bcd4" },
  { id: "ominous", label: "Ominous", color: "#ef4444" },
  { id: "serene", label: "Serene", color: "#c4b5fd" },
]

const genres = ["Orchestral", "Ambient", "Folk", "Electronic", "Choral", "Percussion"]

const instruments = ["Strings", "Brass", "Choir", "Piano", "Drums", "Synthesizer", "Lute", "Harp"]

function WaveformBars({ isPlaying, color = "#0d47a1" }: { isPlaying: boolean; color?: string }) {
  const barCount = 48
  return (
    <div className="flex items-end gap-0.5 h-16" aria-hidden="true">
      {Array.from({ length: barCount }).map((_, i) => {
        const baseH = 20 + Math.sin(i * 0.4) * 15 + Math.sin(i * 0.9) * 10 + Math.random() * 10
        return (
          <div
            key={i}
            className="w-1 rounded-sm transition-all"
            style={{
              height: `${Math.max(8, baseH)}%`,
              background: i % 3 === 0 ? color : `${color}80`,
              animationDelay: isPlaying ? `${(i * 50) % 1200}ms` : undefined,
              animation: isPlaying ? `wave 1.2s ease-in-out ${(i * 50) % 1200}ms infinite` : undefined,
            }}
          />
        )
      })}
    </div>
  )
}

export function MusicTab({ generationState }: MusicTabProps) {
  const [prompt, setPrompt] = useState(
    "Cinematic orchestral track, rising choir, deep war drums, brass fanfare building to a triumphant crescendo"
  )
  const [bpm, setBpm] = useState(128)
  const [duration, setDuration] = useState(60)
  const [selectedMood, setSelectedMood] = useState("epic")
  const [selectedGenre, setSelectedGenre] = useState("Orchestral")
  const [selectedInstruments, setSelectedInstruments] = useState(["Strings", "Choir", "Brass"])
  const [isPlaying, setIsPlaying] = useState(false)
  const [playProgress, setPlayProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setPlayProgress((p) => (p >= 100 ? 0 : p + 0.5))
    }, 150)
    return () => clearInterval(interval)
  }, [isPlaying])

  const toggleInstrument = (inst: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    )
  }

  const currentMood = moods.find((m) => m.id === selectedMood)

  return (
    <div className="flex h-full overflow-hidden">
      {/* Controls */}
      <div className="w-80 shrink-0 border-r border-[rgba(13,71,161,0.1)] overflow-y-auto p-5 space-y-5 bg-[rgba(10,10,15,0.3)]">
        {/* Prompt */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Musical Vision
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full text-xs bg-[#16161f] border border-[rgba(13,71,161,0.15)] rounded-xl p-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-[#0d47a1] transition-colors resize-none leading-relaxed"
            placeholder="Describe the emotion, scene, and musical texture…"
          />
        </div>

        {/* Mood */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Mood
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={cn(
                  "flex flex-col items-center py-2 px-1.5 rounded-lg text-[11px] border transition-all duration-200",
                  selectedMood === mood.id
                    ? "border-[rgba(13,71,161,0.4)] bg-[rgba(13,71,161,0.12)]"
                    : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(13,71,161,0.2)]"
                )}
              >
                <span
                  className="w-3 h-3 rounded-full mb-1"
                  style={{ background: mood.color, boxShadow: `0 0 8px ${mood.color}60` }}
                />
                <span
                  className="font-medium"
                  style={{ color: selectedMood === mood.id ? mood.color : undefined }}
                >
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Genre */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Genre
          </label>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] border transition-all duration-200",
                  selectedGenre === genre
                    ? "bg-[rgba(13,71,161,0.2)] border-[rgba(13,71,161,0.4)] text-[#a78bfa]"
                    : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground hover:border-[rgba(13,71,161,0.2)]"
                )}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Instruments */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
            Instruments
          </label>
          <div className="flex flex-wrap gap-1.5">
            {instruments.map((inst) => (
              <button
                key={inst}
                onClick={() => toggleInstrument(inst)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border transition-all duration-200",
                  selectedInstruments.includes(inst)
                    ? "bg-[rgba(0,188,212,0.1)] border-[rgba(0,188,212,0.3)] text-[#00bcd4]"
                    : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground"
                )}
              >
                {selectedInstruments.includes(inst) && (
                  <MusicNote size={9} weight="fill" />
                )}
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* BPM */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-1">
              <Metronome size={11} />
              BPM
            </label>
            <span className="text-sm font-bold text-[#00bcd4] font-mono">{bpm}</span>
          </div>
          <input
            type="range"
            min={60}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "#00bcd4" }}
          />
          <div className="flex justify-between mt-1 text-[10px] text-muted-foreground font-mono">
            <span>Adagio 60</span>
            <span>Presto 200</span>
          </div>
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
              Duration
            </label>
            <span className="text-xs font-bold text-[#00bcd4] font-mono">{duration}s</span>
          </div>
          <input
            type="range"
            min={15}
            max={300}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "#00bcd4" }}
          />
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {generationState === "idle" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-[rgba(13,71,161,0.25)] flex items-center justify-center bg-[rgba(13,71,161,0.04)]">
                <MusicNote size={44} className="text-[rgba(13,71,161,0.3)]" weight="fill" />
              </div>
              <div className="absolute -inset-8 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(13,71,161,0.05)_0%,transparent_70%)]" />
            </div>
            <div className="text-center max-w-sm">
              <h3 className="font-serif text-xl text-foreground mb-2">Compose the Unheard</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configure mood, instruments, and vision to summon music from the Arcane Ether.
              </p>
            </div>
          </div>
        ) : generationState === "generating" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 p-10">
            <div className="flex items-end gap-0.5 h-20">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar"
                  style={{
                    animationDelay: `${(i * 60) % 1200}ms`,
                    height: `${20 + Math.sin(i * 0.5) * 40 + 20}%`,
                  }}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="font-serif text-xl text-foreground mb-2">Composing the Hymn…</p>
              <p className="text-sm text-muted-foreground">Weaving {selectedGenre.toLowerCase()} threads into mythic sound</p>
            </div>
          </div>
        ) : generationState === "error" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-10">
            <div className="w-20 h-20 rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center">
              <WarningCircle size={36} className="text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg text-foreground mb-2">The Harmony Broke</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                The musical weave collapsed. Try adjusting your parameters.
              </p>
            </div>
          </div>
        ) : (
          /* Complete */
          <div className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base text-foreground">Generated Composition</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground transition-all">
                <ArrowsClockwise size={12} />
                Regenerate
              </button>
            </div>

            {/* Player */}
            <div className="rounded-2xl border border-[rgba(13,71,161,0.2)] bg-[rgba(13,71,161,0.04)] p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0d47a1] to-[#6d28d9] flex items-center justify-center glow-violet shrink-0">
                  <MusicNote size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <p className="font-serif text-base text-foreground">Battle Hymn of the Olympians</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedGenre} · {bpm} BPM · {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                  </p>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="ml-auto w-11 h-11 rounded-full bg-gradient-to-br from-[#0d47a1] to-[#6d28d9] flex items-center justify-center hover:from-[#9d70f8] hover:to-[#0d47a1] transition-all glow-violet shrink-0"
                >
                  {isPlaying ? (
                    <Pause size={18} weight="fill" className="text-white" />
                  ) : (
                    <Play size={18} weight="fill" className="text-white ml-0.5" />
                  )}
                </button>
              </div>

              {/* Waveform */}
              <div className="relative mb-3">
                <WaveformBars isPlaying={isPlaying} color={currentMood?.color ?? "#0d47a1"} />
                {/* Progress overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(10,10,15,0.7)]"
                  style={{ left: `${playProgress}%` }}
                />
              </div>

              {/* Scrubber */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-mono w-8 shrink-0 text-right">
                  {Math.floor((playProgress / 100) * duration)}s
                </span>
                <div className="flex-1 h-1 bg-[rgba(13,71,161,0.15)] rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${playProgress}%`,
                      background: `linear-gradient(90deg, #0d47a1, ${currentMood?.color ?? "#00bcd4"})`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono w-8 shrink-0">
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                </span>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <SpeakerHigh size={14} />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {[selectedMood, selectedGenre, `${bpm} BPM`, ...selectedInstruments.slice(0, 3)].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-[rgba(13,71,161,0.08)] border border-[rgba(13,71,161,0.15)] text-muted-foreground capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Variations */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2">
                Variations
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["Softer Mix", "Extended", "Percussion Heavy"].map((v, i) => (
                  <button
                    key={v}
                    className="p-2.5 rounded-xl border border-[rgba(13,71,161,0.1)] bg-[rgba(13,71,161,0.04)] hover:border-[rgba(13,71,161,0.25)] transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[rgba(13,71,161,0.15)] flex items-center justify-center mb-2 group-hover:bg-[rgba(13,71,161,0.25)] transition-colors">
                      <Play size={12} weight="fill" className="text-[#0d47a1] ml-0.5" />
                    </div>
                    <p className="text-[11px] text-foreground">{v}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
