/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkle,
  Download,
  Gear,
  MusicNote,
  MusicNotes,
  Microphone,
  SpeakerHigh,
  Play,
  Pause,
  Waveform,
  Radio,
  Plus,
  Minus,
  Check,
  Warning,
} from "@/lib/phosphor-icons";

// Audio Modes linked to the Radial Dial
const AUDIO_MODES = [
  { id: "voiceover", name: "Voiceover", desc: "Synthesizing text into warm acoustic voices", angle: 0 },
  { id: "soundtrack", name: "Soundtrack", desc: "Generating contextual scene background music", angle: 90 },
  { id: "fx", name: "Sound FX", desc: "Atmospheric and action sound events", angle: 180 },
  { id: "ambient", name: "Ambient Mesh", desc: "Generative drone frequencies for world depth", angle: 270 },
];

const GUARDIAN_VOICES = [
  { id: "aiyami", name: "Aiyami (Crown)", characteristics: "Wise, serene, melodic elder tone", freq: "96.4 MHz" },
  { id: "lyria", name: "Lyria (Sight)", characteristics: "Crisp, alert, fast-paced whisper", freq: "141.6 MHz" },
  { id: "elara", name: "Elara (Starweave)", characteristics: "Resonant, layered, cosmic reverberation", freq: "88.2 MHz" },
];

export default function AudioStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedMode, setSelectedMode] = useState("voiceover");
  const [selectedVoice, setSelectedVoice] = useState("aiyami");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanOutput, setScanOutput] = useState<string[]>([]);
  const [lockedFrequency, setLockedFrequency] = useState("96.4 MHz");

  // Simulated audio output state
  const [audioCreated, setAudioCreated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [showSettings, setShowSettings] = useState(false);

  const playbackTimer = useRef<NodeJS.Timeout | null>(null);

  // Compute rotation angle based on selected mode
  const getModeAngle = () => {
    const mode = AUDIO_MODES.find((m) => m.id === selectedMode);
    return mode ? -mode.angle : 0;
  };

  const handleModeChange = (id: string) => {
    setSelectedMode(id);
    setAudioCreated(false);
    setIsPlaying(false);
  };

  const handleScanVoices = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanOutput([]);
    
    const steps = [
      "Booting spectrum analyzer...",
      "Sweeping carrier frequencies...",
      "Detected carrier signal at 88.2 MHz...",
      "Detected carrier signal at 141.6 MHz...",
      "Detected carrier signal at 96.4 MHz...",
      "Aligning phase dynamics with voice lattices...",
      "Spectral connection established.",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setScanOutput((prev) => [...prev, steps[i]]);
    }

    setIsScanning(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setAudioCreated(false);
    setIsPlaying(false);

    // Simulated audio rendering logs
    await new Promise((r) => setTimeout(r, 3500));

    setAudioCreated(true);
    setIsGenerating(false);
  };

  // Simulated playback controls
  useEffect(() => {
    if (isPlaying) {
      playbackTimer.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(playbackTimer.current!);
            return 0;
          }
          return prev + 1;
        });
      }, 150);
    } else {
      if (playbackTimer.current) clearInterval(playbackTimer.current);
    }

    return () => {
      if (playbackTimer.current) clearInterval(playbackTimer.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Generate SVG waveform blocks
  const renderWaveform = () => {
    const bars = 40;
    const items = [];
    for (let i = 0; i < bars; i++) {
      const height = Math.sin(i * 0.4) * 15 + Math.cos(i * 0.2) * 10 + 30;
      const isActive = (i / bars) * 100 <= playbackProgress;
      items.push(
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-150"
          style={{
            height: `${Math.max(6, height)}px`,
            backgroundColor: isActive
              ? "var(--arc-brand-arcanean-gold)"
              : "rgba(255, 255, 255, 0.08)",
            boxShadow: isActive ? "0 0 10px rgba(255, 215, 0, 0.4)" : "none",
          }}
        />
      );
    }
    return items;
  };

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--arc-brand-arcanean-gold)]/40 to-[var(--arc-brand-cosmic-blue)]/20 flex items-center justify-center border border-[var(--arc-brand-arcanean-gold)]/20">
                  <MusicNotes className="w-5 h-5 text-[var(--arc-brand-arcanean-gold)]" />
                </div>
                <div>
                  <h1 className="font-display text-lg font-semibold tracking-tight">Audio Forge</h1>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Acoustic engine v1.2</p>
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
          <div className="grid lg:grid-cols-[480px_1fr] gap-8 items-start">
            
            {/* Left Column: Rotary Dial & Input Controls */}
            <div className="space-y-6">
              
              {/* Radial Mode Dial */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <label className="text-xs font-mono text-white/45 uppercase tracking-widest mb-6 w-full text-left">
                  Acoustic Mode Selector
                </label>

                {/* SVG Knob Dial */}
                <div className="relative w-56 h-56 flex items-center justify-center mb-6">
                  {/* Outer ticks ring */}
                  <svg className="absolute inset-0 w-full h-full rotate-45 opacity-20 pointer-events-none">
                    <circle cx="112" cy="112" r="95" stroke="white" strokeWidth="1" strokeDasharray="3,12" fill="none" />
                  </svg>

                  {/* Rotating Dial Knob */}
                  <m.div
                    animate={{ rotate: getModeAngle() }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-[#121319] to-[#050608] border-2 border-white/[0.08] shadow-[inset_0_4px_12px_rgba(255,255,255,0.05),0_12px_36px_rgba(0,0,0,0.5)] flex items-center justify-center relative cursor-pointer"
                  >
                    {/* Indicator Dot */}
                    <div className="absolute top-3 w-3.5 h-3.5 rounded-full bg-[var(--arc-brand-arcanean-gold)] shadow-[0_0_12px_rgba(255,215,0,0.6)]" />
                    
                    {/* Metal center cap */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#20222a] to-[#0f1115] border border-white/[0.1] shadow-xl flex items-center justify-center">
                      <Radio className="w-6 h-6 text-white/30" />
                    </div>
                  </m.div>

                  {/* Radial Label Placements */}
                  {AUDIO_MODES.map((mode) => {
                    const rad = (mode.angle * Math.PI) / 180 - Math.PI / 2;
                    const x = 112 + Math.cos(rad) * 98;
                    const y = 112 + Math.sin(rad) * 98;
                    
                    return (
                      <button
                        key={mode.id}
                        onClick={() => handleModeChange(mode.id)}
                        className={`absolute text-[10px] font-mono uppercase tracking-wider -translate-x-1/2 -translate-y-1/2 transition-colors duration-250 py-1.5 px-2.5 rounded-lg border bg-black/60 backdrop-blur-sm z-20 ${
                          selectedMode === mode.id
                            ? "border-[var(--arc-brand-arcanean-gold)] text-[var(--arc-brand-arcanean-gold)] font-bold shadow-[0_0_10px_rgba(255,215,0,0.15)]"
                            : "border-white/[0.04] text-white/40 hover:text-white/80"
                        }`}
                        style={{ left: `${x}px`, top: `${y}px` }}
                      >
                        {mode.name}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Mode description */}
                <div className="text-center w-full px-4 border-t border-white/[0.04] pt-4 min-h-[56px]">
                  <p className="text-xs text-white/80 leading-relaxed font-body">
                    {AUDIO_MODES.find((m) => m.id === selectedMode)?.desc}
                  </p>
                </div>
              </div>

              {/* Text / Script / Prompter input */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5">
                <label className="block text-xs font-mono text-white/45 uppercase tracking-widest mb-3">
                  Text script or sonic theme
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    selectedMode === "voiceover"
                      ? "Enter the spoken dialogue or text script to generate as speech..."
                      : "Describe the musical layout, style cues, instruments, and emotional atmosphere..."
                  }
                  rows={4}
                  className="w-full bg-black/40 rounded-xl border border-white/[0.08] p-3.5 text-xs focus:outline-none focus:border-[var(--arc-brand-arcanean-gold)]/50 resize-none transition-all text-white placeholder-white/35 font-body"
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-cosmic-blue)] text-black font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(255,215,0,0.35)] transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
              >
                <Sparkle className="w-5 h-5 text-black" />
                <span>Forge Acoustic Wave</span>
                <span className="text-xs font-mono opacity-50 ml-1">⚡10 credits</span>
              </button>

            </div>

            {/* Right Column: CRT Voice Scanner & Waveform player */}
            <div className="space-y-6">
              
              {/* CRT Voice Selection Screen */}
              {selectedMode === "voiceover" && (
                <div className="border border-green-500/30 bg-[#061009] rounded-3xl p-6 relative overflow-hidden shadow-[inset_0_0_30px_rgba(0,255,0,0.15)] flex flex-col justify-between min-h-[340px]">
                  {/* CRT Scanline filter effect */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
                    style={{
                      backgroundImage: "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)",
                      backgroundSize: "100% 4px",
                    }}
                  />
                  {/* CRT flicker glow overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-green-500/[0.02] animate-[pulse_6s_ease-in-out_infinite]" />

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-green-500/20 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[11px] font-mono text-green-400 uppercase tracking-widest">
                          Spectrum Voice Link
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-green-500/60">Freq locked: {lockedFrequency}</span>
                    </div>

                    {/* Scan status readout */}
                    <div className="font-mono text-[10px] text-green-500/80 space-y-1 bg-black/40 border border-green-500/15 rounded-xl p-4 h-36 overflow-y-auto scrollbar-none shadow-inner">
                      {scanOutput.length === 0 ? (
                        <p className="text-green-500/30 italic">No scanner running. Click Scan to locate voice carriers.</p>
                      ) : (
                        scanOutput.map((log, i) => (
                          <p key={i} className="flex gap-1">
                            <span>▶</span>
                            <span>{log}</span>
                          </p>
                        ))
                      )}
                    </div>

                    {/* Voice profiles */}
                    <div className="grid grid-cols-3 gap-3">
                      {GUARDIAN_VOICES.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVoice(v.id);
                            setLockedFrequency(v.freq);
                            setAudioCreated(false);
                            setIsPlaying(false);
                          }}
                          className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                            selectedVoice === v.id
                              ? "bg-green-500/10 border-green-500/80 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                              : "border-green-500/20 hover:border-green-500/40 text-green-500/50 hover:bg-green-500/[0.02]"
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{v.name}</span>
                          <span className="text-[9px] font-mono opacity-60 leading-normal line-clamp-2">{v.characteristics}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-green-500/20 pt-4 mt-2">
                    <span className="text-[10px] font-mono text-green-500/40">Status: Spectrum Active</span>
                    <button
                      onClick={handleScanVoices}
                      disabled={isScanning}
                      className="px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/40 hover:border-green-500/60 font-mono text-[10px] text-green-400 uppercase tracking-widest active:scale-95 transition-all disabled:opacity-40"
                    >
                      {isScanning ? "Scanning..." : "Scan Frequencies"}
                    </button>
                  </div>
                </div>
              )}

              {/* Waveform Player workspace */}
              <div className="border border-white/[0.08] bg-black/40 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[200px]">
                <div className="absolute inset-0 pointer-events-none">
                  {/* Subtle dot matrix backdrop */}
                  <div
                    className="absolute inset-0 opacity-[0.01]"
                    style={{
                      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <m.div
                      key="generating-audio"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-8"
                    >
                      <div className="w-12 h-12 rounded-full border border-white/[0.06] border-t-[var(--arc-brand-arcanean-gold)] animate-spin mb-4" />
                      <h4 className="font-display text-sm font-semibold">Synthesizing audio lattice</h4>
                      <p className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-wider">Multipass Fourier Transform</p>
                    </m.div>
                  ) : audioCreated ? (
                    /* Waveform display + playbar controls */
                    <m.div
                      key="playing-audio"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col gap-6"
                    >
                      <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
                        <div>
                          <span className="text-[9px] font-mono text-[var(--arc-brand-arcanean-gold)] uppercase tracking-wider">Acoustic output</span>
                          <h4 className="text-xs font-semibold text-white/80 mt-1 uppercase tracking-tight">
                            {selectedMode} - {selectedVoice} voice
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-white/30">Lattice-01.wav</span>
                      </div>

                      {/* Interactive Visual Waveform bar */}
                      <div className="flex items-center justify-between gap-1.5 h-20 px-2 bg-white/[0.01] border border-white/[0.04] rounded-2xl relative">
                        {renderWaveform()}
                      </div>

                      {/* Player control bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="p-3 rounded-2xl bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-atlantean-teal)] text-black font-semibold hover:shadow-[0_0_15px_rgba(255,215,0,0.35)] transition-all active:scale-95"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-black" />
                            ) : (
                              <Play className="w-4 h-4 text-black" />
                            )}
                          </button>
                          
                          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2">
                            <SpeakerHigh className="w-3.5 h-3.5 text-white/50" />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={volume}
                              onChange={(e) => setVolume(Number(e.target.value))}
                              className="w-16 accent-[var(--arc-brand-arcanean-gold)] h-1 bg-white/20 rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-white/30 uppercase mr-2">Stereo L+R</span>
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition-all text-white/50"
                            title="Download audio file"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </m.div>
                  ) : (
                    /* Default audio empty workspace */
                    <m.div
                      key="empty-audio"
                      className="flex flex-col items-center justify-center text-center py-8"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4">
                        <Waveform className="w-6 h-6 text-white/30" />
                      </div>
                      <h3 className="font-display text-sm font-semibold mb-1 text-white/80">Acoustic output workspace</h3>
                      <p className="text-xs text-white/30 max-w-xs leading-relaxed">
                        Input a script or soundtrack prompt, configure your dials, and generate finished wav/mp3 packages.
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
            
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
