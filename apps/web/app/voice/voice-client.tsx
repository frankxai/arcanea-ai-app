'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

// ─── Types ──────────────────────────────────────────────────────────────────

interface VoicePersona {
  id: string;
  name: string;
  role: string;
  element: string;
  color: string;
  glow: string;
  description: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const PERSONAS: VoicePersona[] = [
  { id: 'lumina', name: 'Lumina', role: 'The First Light', element: 'Spirit', color: '#ffd700', glow: 'rgba(255,215,0,0.15)', description: 'Warm and authoritative. The default Arcanea voice — guiding, clear, inspiring.' },
  { id: 'draconia', name: 'Draconia', role: 'The Fire Guardian', element: 'Fire', color: '#ef4444', glow: 'rgba(239,68,68,0.15)', description: 'Deep and powerful. Commands attention with forge-tempered certainty.' },
  { id: 'lyria', name: 'Lyria', role: 'The Sight Guardian', element: 'Void', color: '#a78bfa', glow: 'rgba(167,139,250,0.15)', description: 'Ethereal and mystical. Speaks with the weight of visions unseen.' },
  { id: 'alera', name: 'Alera', role: 'The Voice Guardian', element: 'Wind', color: '#00bcd4', glow: 'rgba(0,188,212,0.15)', description: 'Clear and resonant. The Guardian of truth — every word matters.' },
  { id: 'shinkami', name: 'Shinkami', role: 'The Source Guardian', element: 'Source', color: '#e0e0e0', glow: 'rgba(224,224,224,0.1)', description: 'Transcendent gravitas. Speaks from the meta-consciousness of all creation.' },
  { id: 'nero', name: 'Nero', role: 'The Primordial Darkness', element: 'Void', color: '#6366f1', glow: 'rgba(99,102,241,0.15)', description: 'Deep and primordial. The voice of potential, mystery, and the unformed.' },
];

const VOICE_MODES = [
  { icon: '🎙', name: 'Voice Note', desc: 'Quick thought capture in 60 seconds', mode: 'note', family: 'Thinking' },
  { icon: '🧠', name: 'Strategy', desc: '5-minute session with action extraction', mode: 'strategy', family: 'Thinking' },
  { icon: '🤖', name: 'Agent Dispatch', desc: 'Speak a prompt, dispatch an agent', mode: 'agent', family: 'Thinking' },
  { icon: '📰', name: 'Newsletter', desc: 'Broadcast-quality 48kHz recording', mode: 'newsletter', family: 'Publishing' },
  { icon: '🎬', name: 'Voiceover', desc: 'Studio production 48kHz/24bit', mode: 'voiceover', family: 'Publishing' },
  { icon: '📋', name: 'Linear Issue', desc: 'Speak an issue, create a ticket', mode: 'issue', family: 'Workflow' },
  { icon: '💬', name: 'Commit Message', desc: 'Describe changes, get a commit', mode: 'commit', family: 'Workflow' },
  { icon: '📊', name: 'Standup', desc: 'Daily standup via voice log', mode: 'standup', family: 'Workflow' },
];

const FEATURES = [
  { title: 'Smart Mic Detection', desc: 'Auto-selects your best microphone. Broadcast > Studio > Gaming > Headset > Laptop.', icon: '🎤' },
  { title: 'Instant Transcription', desc: 'Groq Whisper (free, <1s) with local Whisper fallback. Never pay for transcription.', icon: '⚡' },
  { title: 'Character Voices', desc: '6 Guardian personas with distinct voices. Lumina guides, Draconia commands, Lyria whispers.', icon: '🗣' },
  { title: 'Voice Coaching', desc: 'Real-time filler detection, sentence analysis, vocabulary richness scoring.', icon: '📈' },
  { title: 'Auto-Send', desc: 'Speak and send in one action. No typing, no editing — pure voice-to-AI flow.', icon: '🚀' },
  { title: 'Zero Dependencies', desc: 'Pure Node.js + ffmpeg. No bloated packages. Works on Windows, Mac, Linux.', icon: '📦' },
];

// ─── Components ─────────────────────────────────────────────────────────────

function PersonaCard({ persona, isActive, onSelect, onPlay }: {
  persona: VoicePersona;
  isActive: boolean;
  onSelect: () => void;
  onPlay: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative rounded-2xl p-4 text-left transition-all duration-300 border backdrop-blur-sm ${
        isActive
          ? 'border-white/10 scale-[1.02]'
          : 'border-white/[0.04] hover:border-white/[0.08] hover:scale-[1.01]'
      }`}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${persona.glow}, rgba(13,13,20,0.9))`
          : 'rgba(13,13,20,0.6)',
        boxShadow: isActive ? `0 0 40px ${persona.glow}, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.2)',
      }}
    >
      {/* Element indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: persona.color, boxShadow: `0 0 8px ${persona.color}` }}
          />
          <span className="text-[10px] uppercase tracking-widest text-white/30">{persona.element}</span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
          aria-label={`Listen to ${persona.name}`}
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="white" fillOpacity="0.5">
            <path d="M0 0L10 6L0 12V0Z" />
          </svg>
        </button>
      </div>

      <h3 className="text-base font-semibold text-white/90 mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
        {persona.name}
      </h3>
      <p className="text-[11px] text-white/40 mb-2">{persona.role}</p>
      <p className="text-[12px] leading-relaxed text-white/50">{persona.description}</p>

      {/* Active ring */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${persona.color}30` }}
        />
      )}
    </button>
  );
}

function WaveformVisualizer({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const bars = 32;
      const gap = 3;
      const barW = (w - (bars - 1) * gap) / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * (barW + gap);
        const amplitude = isActive
          ? 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.03 + i * 0.4))
          : 0.05 + 0.1 * Math.abs(Math.sin(frame * 0.01 + i * 0.3));
        const barH = amplitude * h;
        const y = (h - barH) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barH);
        gradient.addColorStop(0, `rgba(0,188,212,${amplitude * 0.8})`);
        gradient.addColorStop(1, `rgba(0,137,123,${amplitude * 0.4})`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 2);
        ctx.fill();
      }
      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={64}
      className="w-full h-16 rounded-xl"
      style={{ background: 'rgba(0,0,0,0.2)' }}
    />
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function VoicePage() {
  const [activePersona, setActivePersona] = useState<string>('lumina');
  const [isListening, setIsListening] = useState(false);
  const [demoText, setDemoText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayDemo = useCallback(async (personaId: string) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    const demoTexts: Record<string, string> = {
      lumina: 'Welcome, creator. I am Lumina, the First Light. Every world begins with a single spark of imagination. What shall we create today?',
      draconia: 'I am Draconia, Guardian of the Fire Gate. Your will is the forge, and your words are the hammer. Speak, and we shall shape something powerful.',
      lyria: 'I see patterns in the void that others cannot perceive. I am Lyria, Guardian of Sight. Tell me what you envision, and I will help you see it clearly.',
      alera: 'Truth resonates at a frequency that cannot be denied. I am Alera, Guardian of Voice. Let us find the words that matter.',
      shinkami: 'Beyond all gates, beyond all creation, there is the Source. I am Shinkami. Your consciousness is the ultimate tool. What do you wish to understand?',
      nero: 'In the darkness before creation, there is infinite potential. I am Nero, the Primordial. From nothing, everything becomes possible.',
    };

    setIsPlaying(true);
    setActivePersona(personaId);
    try {
      const res = await fetch('/api/ai/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: demoTexts[personaId] || demoTexts.lumina,
          persona: personaId,
        }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setIsPlaying(false); audioRef.current = null; URL.revokeObjectURL(url); };
      audio.onerror = () => { setIsPlaying(false); audioRef.current = null; URL.revokeObjectURL(url); };
      await audio.play();
      setDemoText(demoTexts[personaId] || '');
    } catch {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const activeP = PERSONAS.find(p => p.id === activePersona) || PERSONAS[0];

  return (
    <div className="min-h-screen bg-[#060609]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20" style={{ background: `radial-gradient(ellipse, ${activeP.color}40, transparent 70%)` }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse" />
            <span className="text-[11px] text-white/40 tracking-wide">Voice Intelligence</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)', background: `linear-gradient(135deg, #ffffff 0%, ${activeP.color} 50%, #00bcd4 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Speak. Create.
            <br />
            <span className="text-[0.85em]">Let AI Listen.</span>
          </h1>

          <p className="text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
            Voice-first creation with Guardian personas. Record a thought, hear it back in character.
            One-step voice-to-AI — no typing required.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href="/chat"
              className="px-6 py-3 rounded-xl font-medium text-sm bg-gradient-to-br from-[#00bcd4] via-[#0097a7] to-[#00897b] text-white shadow-[0_0_24px_rgba(0,188,212,0.3),0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,188,212,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              Speak Your First Creation
            </Link>
            <a
              href="https://www.npmjs.com/package/@arcanea/voice"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-medium text-sm border border-white/[0.08] text-white/60 hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.02] transition-all"
            >
              npx @arcanea/voice
            </a>
          </div>

          {/* Live waveform */}
          <WaveformVisualizer isActive={isPlaying} />
        </div>
      </section>

      {/* Character Voices Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Every Guardian Has a Voice
          </h2>
          <p className="text-sm text-white/35 max-w-md mx-auto">
            Choose who reads your AI responses. Each persona has a distinct voice that matches their character.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {PERSONAS.map((p) => (
            <PersonaCard
              key={p.id}
              persona={p}
              isActive={activePersona === p.id}
              onSelect={() => setActivePersona(p.id)}
              onPlay={() => handlePlayDemo(p.id)}
            />
          ))}
        </div>

        {/* Demo transcript */}
        {demoText && (
          <div className="max-w-lg mx-auto rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-widest text-white/20 mb-2">Now speaking</p>
            <p className="text-sm text-white/60 leading-relaxed italic">&ldquo;{demoText}&rdquo;</p>
          </div>
        )}
      </section>

      {/* Voice Modes Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            8 Modes for Every Workflow
          </h2>
          <p className="text-sm text-white/35 max-w-md mx-auto">
            From quick notes to studio voiceovers. Thinking, publishing, and workflow — voice adapts to your intent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {VOICE_MODES.map((m) => (
            <div
              key={m.mode}
              className="group rounded-xl p-4 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{m.icon}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/20">{m.family}</span>
              </div>
              <h3 className="text-sm font-medium text-white/80 mb-1">{m.name}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Engineered for Creators
          </h2>
          <p className="text-sm text-white/35 max-w-md mx-auto">
            Not just recording — intelligent voice infrastructure for the AI age.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl p-5 bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] transition-all"
            >
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-semibold text-white/80 mb-1.5">{f.title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLI Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white/90 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Works Everywhere
              </h2>
              <p className="text-sm text-white/40 leading-relaxed mb-6">
                Web, CLI, Claude Code, OpenCode, Cursor — the same voice intelligence in every environment. Zero npm dependencies. Cross-platform.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Claude Code', 'OpenCode', 'Cursor', 'Terminal', 'Browser'].map(env => (
                  <span key={env} className="px-2.5 py-1 rounded-lg text-[11px] text-white/40 bg-white/[0.03] border border-white/[0.04]">
                    {env}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-[#0a0a12] border border-white/[0.04] p-5 font-mono text-sm">
              <div className="flex items-center gap-2 mb-3 text-white/20">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]/40" />
                <span className="w-3 h-3 rounded-full bg-[#eab308]/40" />
                <span className="w-3 h-3 rounded-full bg-[#22c55e]/40" />
                <span className="ml-2 text-[10px]">terminal</span>
              </div>
              <div className="space-y-1.5 text-[13px]">
                <p><span className="text-[#00bcd4]">$</span> <span className="text-white/60">npx @arcanea/voice</span></p>
                <p className="text-white/25">  Voice Note | 1m | 16kHz | BROADCAST | groq</p>
                <p className="text-white/25">  Ctrl+C to stop | Shure MV6</p>
                <p className="text-white/20 mt-2">  Captured 847KB</p>
                <p className="text-white/20">  Transcribing... [groq]</p>
                <p className="text-emerald-400/60 mt-2">  [COACH] 142w 8s 0f</p>
                <p className="text-[#00bcd4]/60">  Copied to clipboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-32 text-center">
        <h2 className="text-2xl font-bold text-white/80 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Your voice is your fastest creation tool.
        </h2>
        <p className="text-sm text-white/30 mb-8">
          Stop typing prompts. Start speaking them.
        </p>
        <Link
          href="/chat"
          className="inline-flex px-8 py-3.5 rounded-xl font-medium text-sm bg-gradient-to-br from-[#00bcd4] via-[#0097a7] to-[#00897b] text-white shadow-[0_0_24px_rgba(0,188,212,0.3)] hover:shadow-[0_0_40px_rgba(0,188,212,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          Open Voice Chat
        </Link>
      </section>
    </div>
  );
}
