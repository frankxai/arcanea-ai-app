/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkle,
  MagicWand,
  Download,
  ArrowsClockwise,
  Gear,
  VideoCamera,
  FilmStrip,
  Play,
  Pause,
  SpeakerHigh,
  ArrowsOut,
  CaretDown,
  Flame,
  Warning,
  Plus,
  Minus,
  Check,
} from "@/lib/phosphor-icons";

const CAMERA_PRESETS = [
  { id: "orbit", name: "Cinematic Orbit", desc: "Slow, sweeping 360-degree rotation", motion: "rotate-y" },
  { id: "zoom-in", name: "Push In", desc: "Steady zoom focusing details", motion: "zoom-in" },
  { id: "drone", name: "Drone Flyby", desc: "High-angle panoramic glide", motion: "pan-x" },
  { id: "crane-up", name: "Crane Lift", desc: "Ascending vertical tilt", motion: "pan-y" },
];

const ASSET_SUGGESTIONS = [
  { label: "@assets/kael-character.png", desc: "Guardian of the Star Gates" },
  { label: "@assets/reliquary-chest.png", desc: "Ancient obsidian brass chest" },
  { label: "@lore/drowned-moon.md", desc: "World bible for moon academy" },
  { label: "@scenes/temple-intro.md", desc: "Cinema scene plot script" },
];

export default function VideoStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("orbit");
  const [videoLength, setVideoLength] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Custom video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  // `@mention` suggestion state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Monitor text for "@" to toggle mentions dropdown
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPrompt(text);
    
    const index = e.target.selectionStart;
    setCursorIndex(index);

    const lastCharIndex = text.lastIndexOf("@", index - 1);
    if (lastCharIndex !== -1 && !text.slice(lastCharIndex, index).includes(" ")) {
      setShowSuggestions(true);
      setMentionQuery(text.slice(lastCharIndex, index).toLowerCase());
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const text = prompt;
    const lastCharIndex = text.lastIndexOf("@", cursorIndex - 1);
    if (lastCharIndex !== -1) {
      const before = text.slice(0, lastCharIndex);
      const after = text.slice(cursorIndex);
      const newText = before + suggestion + " " + after;
      setPrompt(newText);
      setShowSuggestions(false);
      // Put cursor right after inserted asset name
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const targetPos = lastCharIndex + suggestion.length + 1;
          textareaRef.current.setSelectionRange(targetPos, targetPos);
        }
      }, 50);
    }
  };

  const simulateLogs = async () => {
    const logs = [
      "Analyzing reference assets in prompt...",
      "Resolving " + (prompt.includes("@") ? "embedded asset bibles..." : "no reference overrides..."),
      "Preparing neural layout keyframes...",
      "Interpolating optical flows...",
      "Synthesizing motion preset: " + selectedPreset + "...",
      "Rendering frame passes (seconds 1 to " + videoLength + ")...",
      "Compiling video stream wrapper...",
      "Completing rendering and saving to Obsidian library...",
    ];
    setGenerationLogs([]);
    for (let i = 0; i < logs.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setGenerationLogs((prev) => [...prev, logs[i]]);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setVideoUrl(null);
    setIsPlaying(false);

    await simulateLogs();
    
    // Set finished video path
    setVideoUrl("/brand/arcanea-dashboard-hero-premium.mp4");
    setIsGenerating(false);
  };

  // Video controller handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const targetMute = !isMuted;
      videoRef.current.muted = targetMute;
      setIsMuted(targetMute);
    }
  };

  const triggerFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen?.();
    }
  };

  const filteredSuggestions = ASSET_SUGGESTIONS.filter((s) =>
    s.label.toLowerCase().includes(mentionQuery)
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white/90 font-sans relative pb-12">
        {/* Header */}
        <header className="border-b border-white/[0.06] backdrop-blur-md sticky top-0 z-40 bg-[var(--arc-cosmic-void)]/80">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/studio"
                className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white/60" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--arc-brand-cosmic-blue)]/50 to-[var(--arc-brand-atlantean-teal)]/20 flex items-center justify-center border border-[var(--arc-brand-atlantean-teal)]/30">
                  <VideoCamera className="w-5 h-5 text-[var(--arc-brand-atlantean-teal)]" />
                </div>
                <div>
                  <h1 className="font-display text-lg font-semibold tracking-tight">Cinema Bench</h1>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Higgsfield core v1.5</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings ? "bg-white/[0.06] text-white" : "hover:bg-white/[0.06] text-white/60"
              }`}
            >
              <Gear className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start">
            
            {/* Left Column: Config Panel */}
            <div className="space-y-6">
              
              {/* Prompt with mentions */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 relative">
                <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-3">
                  Motion intent
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={handleTextChange}
                    placeholder="Describe scene details. Type '@' to reference world assets, characters, or locations..."
                    rows={4}
                    className="w-full bg-black/40 rounded-xl border border-white/[0.08] p-3.5 text-xs focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/50 resize-none transition-all text-white placeholder-white/35 font-body"
                  />
                  
                  {/* Mention dropdown */}
                  <AnimatePresence>
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-20 left-0 right-0 top-full mt-2 bg-[#0d0f14] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl p-1 max-h-48 overflow-y-auto"
                      >
                        {filteredSuggestions.map((s) => (
                          <button
                            key={s.label}
                            onClick={() => handleSelectSuggestion(s.label)}
                            className="w-full px-3 py-2 text-left rounded-lg text-xs hover:bg-white/[0.04] transition-colors flex flex-col gap-0.5"
                          >
                            <span className="font-mono text-[var(--arc-brand-atlantean-teal)] font-bold">{s.label}</span>
                            <span className="text-[10px] text-white/30">{s.desc}</span>
                          </button>
                        ))}
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Camera preset cards */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-3">
                  Camera motion preset
                </label>
                <div className="space-y-2">
                  {CAMERA_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        selectedPreset === preset.id
                          ? "border-[var(--arc-brand-atlantean-teal)] bg-[var(--arc-brand-atlantean-teal)]/8"
                          : "border-white/[0.06] hover:border-white/[0.16] hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`text-xs font-semibold ${selectedPreset === preset.id ? "text-[var(--arc-brand-atlantean-teal)]" : "text-white/80"}`}>
                          {preset.name}
                        </span>
                        <div className="flex gap-1">
                          <span className="text-[9px] font-mono text-white/20 uppercase">Preset</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/45">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Steppers & generation costs */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-widest">
                    Duration
                  </label>
                  <p className="text-[10px] text-white/30 mt-1">Maximum 12 seconds</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-black/40 border border-white/[0.08] rounded-xl p-0.5">
                    <button
                      onClick={() => setVideoLength(Math.max(3, videoLength - 1))}
                      disabled={videoLength <= 3}
                      className="p-2.5 text-white/40 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-white/85">
                      {videoLength}s
                    </span>
                    <button
                      onClick={() => setVideoLength(Math.min(12, videoLength + 1))}
                      disabled={videoLength >= 12}
                      className="p-2.5 text-white/40 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] text-black font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(0,188,212,0.35)] transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
              >
                <Sparkle className="w-5 h-5 text-black" />
                <span>Forge Scene</span>
                <span className="text-xs font-mono opacity-50 ml-1">⚡{videoLength * 2} credits</span>
              </button>
            </div>

            {/* Right Column: Display Canvas / Interactive Player */}
            <div className="relative border border-white/[0.08] bg-black/30 rounded-3xl overflow-hidden aspect-[16/10] backdrop-blur-sm flex flex-col justify-between p-6">
              <div className="absolute inset-0 pointer-events-none">
                {/* Visual Grid Backdrop */}
                <div
                  className="absolute inset-0 opacity-[0.015]"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <AnimatePresence mode="wait">
                {isGenerating ? (
                  /* Loading dashboard with timeline logging */
                  <m.div
                    key="rendering"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 bg-[var(--arc-cosmic-void)]/90"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full border border-white/[0.06] border-t-[var(--arc-brand-atlantean-teal)] animate-spin" />
                      <FilmStrip className="w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--arc-brand-atlantean-teal)] animate-pulse" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-white/90">Synthesizing cinematic frames</h3>
                    <div className="w-64 max-w-full bg-white/[0.04] border border-white/[0.08] h-1 rounded-full overflow-hidden mt-3">
                      <m.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4.8, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)]"
                      />
                    </div>
                    
                    {/* Simulated live console logs */}
                    <div className="w-full max-w-md mt-6 rounded-xl bg-black/60 border border-white/[0.06] p-4 font-mono text-[9px] text-white/40 space-y-1.5 h-36 overflow-y-auto">
                      {generationLogs.map((log, idx) => (
                        <m.p
                          key={idx}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-2"
                        >
                          <span className="text-[var(--arc-brand-atlantean-teal)]">❯</span>
                          <span>{log}</span>
                        </m.p>
                      ))}
                      {generationLogs.length < 8 && (
                        <span className="inline-block w-1.5 h-2.5 bg-[var(--arc-brand-atlantean-teal)] animate-pulse ml-0.5" />
                      )}
                    </div>
                  </m.div>
                ) : videoUrl ? (
                  /* Custom HTML5 video component */
                  <m.div
                    key="player"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 w-full h-full bg-black z-10 flex flex-col justify-end"
                  >
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-cover absolute inset-0"
                      loop
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onClick={togglePlay}
                    />

                    {/* Dark gradient overlay for controls */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 flex flex-col gap-3 z-20">
                      {/* Timeline scrubbar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/50">
                          {Math.floor(currentTime / 60)}:
                          {String(Math.floor(currentTime % 60)).padStart(2, "0")}
                        </span>
                        <input
                          type="range"
                          min="0"
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleScrubChange}
                          className="flex-1 accent-[var(--arc-brand-atlantean-teal)] h-1 bg-white/20 rounded-lg cursor-pointer"
                        />
                        <span className="text-[10px] font-mono text-white/50">
                          {Math.floor(duration / 60)}:
                          {String(Math.floor(duration % 60)).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Controls toolbar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] transition-colors border border-white/[0.08]"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </button>
                          
                          {/* Volume & Mute */}
                          <div className="flex items-center gap-2 group/volume">
                            <button
                              onClick={toggleMute}
                              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] transition-colors border border-white/[0.08]"
                            >
                              <SpeakerHigh className={`w-4 h-4 ${isMuted ? "text-white/30" : "text-white"}`} />
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="w-16 accent-[var(--arc-brand-atlantean-teal)] h-1 bg-white/20 rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={triggerFullscreen}
                            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] transition-colors border border-white/[0.08]"
                          >
                            <ArrowsOut className="w-4 h-4 text-white" />
                          </button>
                          <a
                            href={videoUrl}
                            download="arcanea-cinema-scene.mp4"
                            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] transition-colors border border-white/[0.08]"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </m.div>
                ) : (
                  /* Standard empty state preview */
                  <m.div
                    key="empty"
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4">
                      <FilmStrip className="w-7 h-7 text-white/30" />
                    </div>
                    <h3 className="font-display text-sm font-semibold mb-1 text-white/80">Cinematic display</h3>
                    <p className="text-xs text-white/30 max-w-xs leading-relaxed">
                      Generated cinematic scenes and trailers render directly inside this canvas workspace.
                    </p>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
