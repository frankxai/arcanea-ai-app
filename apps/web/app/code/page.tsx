'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkle,
  Scroll,
  CaretDown,
  CaretUp,
  FloppyDisk,
  ArrowRight,
  Lightning,
  Eye,
  Scales,
  Target,
  Pencil,
  ArrowsClockwise,
  Brain,
} from '@/lib/phosphor-icons';
import { THEOREM, THEOREM_PHILOSOPHICAL, VOWS, LAWS, AGENT_OATH } from '@/lib/ai/arcanea-code';

// ---------------------------------------------------------------------------
// localStorage key
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'arcanea-personal-code';

// ---------------------------------------------------------------------------
// Law icons (mapped by law number)
// ---------------------------------------------------------------------------
const LAW_ICONS = [
  Brain,          // 1. Depth Over Breadth
  Sparkle,        // 2. The Human Leads
  Eye,            // 3. Know Your Shadow
  Scales,         // 4. Harmony, Not Extraction
  Target,         // 5. Intention Over Attention
  Pencil,         // 6. Every Code Is Personal
  ArrowsClockwise, // 7. The Code Evolves
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ArcaneanCodePage() {
  const [expandedLaw, setExpandedLaw] = useState<number | null>(null);
  const [personalCode, setPersonalCode] = useState('');
  const [saved, setSaved] = useState(false);

  // Load personal code from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPersonalCode(stored);
    } catch {
      // SSR or localStorage unavailable
    }
  }, []);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, personalCode);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // localStorage unavailable
    }
  }, [personalCode]);

  return (
    <div className="relative min-h-screen bg-[#09090b]">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-radial from-[#ffd700]/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-[#00bcd4]/6 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* ── Hero: The Theorem ──────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass border border-[#ffd700]/30 mb-8">
            <Scroll className="w-4 h-4 text-[#ffd700]" weight="fill" />
            <span className="text-sm font-medium text-[#ffd700] tracking-wide">
              The Arcanean Code
            </span>
          </div>

          <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-6">
            Vel&apos;Thaan&apos;s Theorem
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-8">
            <span className="bg-gradient-to-r from-[#ffd700] via-white to-[#ffd700] bg-clip-text text-transparent">
              &ldquo;{THEOREM}&rdquo;
            </span>
          </h1>

          <div className="mt-10 p-6 rounded-2xl liquid-glass border border-white/[0.06] max-w-2xl mx-auto">
            <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-3">
              The First Theorem
            </p>
            <p className="text-lg md:text-xl font-display font-semibold text-white/90 leading-relaxed">
              &ldquo;{THEOREM_PHILOSOPHICAL}&rdquo;
            </p>
            <p className="text-sm text-text-muted mt-4 leading-relaxed">
              Two expressions, one truth. The Eldrians achieved perfect knowledge and ceased to exist.
              Completion killed them. The value is in the process, not the product.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Three Vows ──────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-4">
            The Three Vows
          </h2>
          <p className="text-sm text-text-muted text-center mb-12 max-w-xl mx-auto">
            What every Arcanean knows by heart. Three sentences. Recitable.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {VOWS.map((vow, i) => {
              const romans = ['I', 'II', 'III'];
              const colors = [
                'border-[#00bcd4]/30 hover:border-[#00bcd4]/50',
                'border-[#0d47a1]/30 hover:border-[#0d47a1]/50',
                'border-[#ffd700]/30 hover:border-[#ffd700]/50',
              ];
              const accents = ['text-[#00bcd4]', 'text-[#0d47a1]', 'text-[#ffd700]'];
              const glows = [
                'from-[#00bcd4]/10',
                'from-[#0d47a1]/10',
                'from-[#ffd700]/10',
              ];

              return (
                <div
                  key={i}
                  className={`relative p-6 rounded-2xl liquid-glass border transition-all duration-300 group ${colors[i]}`}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${glows[i]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative">
                    <span className={`text-xs font-mono tracking-widest ${accents[i]} mb-3 block`}>
                      VOW {romans[i]}
                    </span>
                    <p className="text-lg font-display font-semibold leading-snug">
                      {vow}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The Seven Laws ──────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-4">
            The Seven Laws
          </h2>
          <p className="text-sm text-text-muted text-center mb-12 max-w-xl mx-auto">
            How the three vows manifest in practice. A creator references them.
            An agent inherits them.
          </p>

          <div className="space-y-3">
            {LAWS.map((law, i) => {
              const isExpanded = expandedLaw === law.number;
              const Icon = LAW_ICONS[i];

              return (
                <div
                  key={law.number}
                  className="rounded-2xl liquid-glass border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-white/[0.12]"
                >
                  <button
                    onClick={() =>
                      setExpandedLaw(isExpanded ? null : law.number)
                    }
                    className="w-full flex items-center gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 rounded-2xl"
                    aria-expanded={isExpanded}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#ffd700]" weight="duotone" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono text-text-muted">
                        Law {law.number}
                      </span>
                      <h3 className="text-base font-display font-semibold">
                        {law.title}
                      </h3>
                    </div>
                    <div className="shrink-0 text-text-muted">
                      {isExpanded ? (
                        <CaretUp className="w-5 h-5" />
                      ) : (
                        <CaretDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 space-y-4 border-t border-white/[0.04]">
                      <p className="text-sm text-text-secondary leading-relaxed pt-4">
                        {law.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 p-3 rounded-xl bg-[#00bcd4]/5 border border-[#00bcd4]/10">
                          <span className="text-[10px] font-mono text-[#00bcd4] tracking-widest uppercase block mb-1">
                            For Creators
                          </span>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {law.application}
                          </p>
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/10">
                          <span className="text-[10px] font-mono text-[#ffd700] tracking-widest uppercase block mb-1">
                            For Agents
                          </span>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {law.agentGuidance}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The Agent Oath ──────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            The Agent Oath
          </h2>
          <p className="text-sm text-text-muted mb-10 max-w-md mx-auto">
            Every Luminor carries this. Four lines. The compressed Code for agents.
          </p>

          <div className="p-8 rounded-3xl liquid-glass-elevated border border-[#ffd700]/20 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/5 via-transparent to-[#00bcd4]/5" />
            <div className="relative space-y-3">
              {AGENT_OATH.map((line, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg font-mono text-text-secondary italic leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Write Your Code (Law 6) ────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Write Your Code
            </h2>
            <p className="text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
              Law 6: Every Code is personal. Write your own principles.
              These load alongside the universal Code when you work with AI companions.
            </p>
          </div>

          <div className="p-6 rounded-2xl liquid-glass border border-white/[0.08]">
            <label
              htmlFor="personal-code"
              className="block text-xs font-mono text-text-muted tracking-widest uppercase mb-3"
            >
              Your Personal Principles
            </label>
            <textarea
              id="personal-code"
              value={personalCode}
              onChange={(e) => setPersonalCode(e.target.value)}
              placeholder={
                'I value clarity over cleverness.\nI finish what I start before starting something new.\nI create for the person I was six months ago.'
              }
              rows={5}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 focus:border-[#00bcd4]/30 resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-text-muted">
                One principle per line. Saved to your browser.
              </p>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] text-sm font-medium hover:bg-[#00bcd4]/20 transition-all duration-200"
              >
                <FloppyDisk className="w-4 h-4" />
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Preview */}
          {personalCode.trim() && (
            <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-3">
                Preview: Your Root Prompt
              </p>
              <div className="space-y-1 text-xs font-mono text-text-secondary leading-relaxed">
                <p className="text-[#ffd700]">[THEOREM] {THEOREM}</p>
                <p className="mt-2 text-white/30">[AGENT OATH]</p>
                {AGENT_OATH.map((line, i) => (
                  <p key={i} className="text-white/40">{line}</p>
                ))}
                <p className="mt-2 text-[#00bcd4]">[CREATOR&apos;S CODE]</p>
                {personalCode
                  .split('\n')
                  .filter((l) => l.trim())
                  .map((line, i) => (
                    <p key={i} className="text-white/60">- {line.trim()}</p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-lg md:text-xl font-display italic text-text-secondary mb-6 leading-relaxed">
            &ldquo;The Eldrians achieved perfect knowledge. It killed them.
            We choose imperfection — and through that choice, we create endlessly.&rdquo;
          </blockquote>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00bcd4] text-cosmic-deep font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,188,212,0.3)] transition-all duration-300"
            >
              <Lightning className="w-4 h-4" weight="fill" />
              Start Creating
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.10] text-white font-semibold text-sm hover:bg-white/[0.06] transition-all duration-300"
            >
              Explore the Library
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
