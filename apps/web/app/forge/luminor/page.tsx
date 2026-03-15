'use client';

import { useState, useRef, useCallback } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Lightning,
  Sparkle,
  Brain,
  Flame,
  Drop,
  Leaf,
  Wind,
  Eye,
  Sun,
  ArrowLeft,
  Copy,
  Check,
} from '@/lib/phosphor-icons';
import {
  LUMINOR_DOMAINS,
  LUMINOR_VOICES,
  generateSystemPrompt,
  type LuminorDomain,
  type LuminorVoice,
  type LuminorSpec,
} from '@/lib/luminors/luminor-spec';
import { ExportPanel } from '@/components/luminors/export-panel';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

type ForgeElement = LuminorSpec['element'];

const ELEMENTS: { key: ForgeElement; label: string; color: string; icon: typeof Flame }[] = [
  { key: 'Fire', label: 'Fire', color: '#ef4444', icon: Flame },
  { key: 'Water', label: 'Water', color: '#00bcd4', icon: Drop },
  { key: 'Earth', label: 'Earth', color: '#22c55e', icon: Leaf },
  { key: 'Wind', label: 'Wind', color: '#94a3b8', icon: Wind },
  { key: 'Void', label: 'Void', color: '#a78bfa', icon: Eye },
  { key: 'Spirit', label: 'Spirit', color: '#ffd700', icon: Sun },
];

const PERSONALITY_POOL = [
  'analytical', 'patient', 'visionary', 'precise', 'creative',
  'persistent', 'methodical', 'calm', 'thorough', 'encouraging',
  'bold', 'warm', 'poetic', 'fierce', 'playful',
  'scholarly', 'witty', 'direct', 'mythic', 'deep',
  'strategic', 'nurturing', 'transformative', 'eloquent', 'grounded',
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function StepHeader({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="mb-1 font-display text-lg font-semibold tracking-tight text-white/80">
        Step {step}
      </h2>
      <p className="text-sm text-white/40">{subtitle}</p>
    </div>
  );
}

function Pill({
  label,
  selected,
  color,
  onClick,
}: {
  label: string;
  selected: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
        selected
          ? 'border-[#00bcd4]/40 bg-[#00bcd4]/15 text-[#00bcd4]'
          : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:border-white/10 hover:text-white/60'
      }`}
      style={
        selected && color
          ? { borderColor: `${color}60`, backgroundColor: `${color}15`, color }
          : undefined
      }
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

export default function ForgeLuminorPage() {
  // Step 1: Identity
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  // Step 2: Domain & Voice
  const [domain, setDomain] = useState<LuminorDomain | null>(null);
  const [voice, setVoice] = useState<LuminorVoice | null>(null);

  // Step 3: Element & Personality
  const [element, setElement] = useState<ForgeElement | null>(null);
  const [personality, setPersonality] = useState<string[]>([]);

  // Forge state
  // AI-assisted creation
  const [aiDescription, setAiDescription] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [isForging, setIsForging] = useState(false);
  const [forgeComplete, setForgeComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Ask Lumina to generate a LuminorSpec from natural language
  const handleAiForge = useCallback(async () => {
    if (!aiDescription.trim() || aiDescription.length < 10) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/forge/luminor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: aiDescription,
          name: name || undefined,
          element: element || undefined,
          domain: domain || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Forge failed');
      }
      const { spec } = await res.json();
      // Populate form with AI-generated values
      if (spec.name && !name) setName(spec.name);
      if (spec.title) setTitle(spec.title || '');
      if (spec.domain) setDomain(spec.domain);
      if (spec.voice) setVoice(spec.voice);
      if (spec.element) setElement(spec.element);
      if (spec.personality) setPersonality(spec.personality.slice(0, 5));
    } catch (err) {
      console.error('AI Forge error:', err);
    } finally {
      setIsAiGenerating(false);
    }
  }, [aiDescription, name, element, domain]);

  const canForge =
    name.trim().length > 0 &&
    title.trim().length > 0 &&
    domain !== null &&
    voice !== null &&
    element !== null &&
    personality.length >= 2;

  const handleTogglePersonality = useCallback((trait: string) => {
    setPersonality((prev) => {
      if (prev.includes(trait)) return prev.filter((t) => t !== trait);
      if (prev.length >= 5) return prev;
      return [...prev, trait];
    });
  }, []);

  const handleForge = useCallback(() => {
    setIsForging(true);
    setForgeComplete(false);
    setTimeout(() => {
      setIsForging(false);
      setForgeComplete(true);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }, 2500);
  }, []);

  const forgedSpec: Partial<LuminorSpec> | null =
    forgeComplete && domain && voice && element
      ? {
          version: 2,
          name: name.trim(),
          title: title.trim(),
          tagline: `${LUMINOR_DOMAINS.find((d) => d.key === domain)?.label} specialist with a ${voice} voice`,
          origin: 'forged',
          domain,
          voice,
          personality,
          element,
          avatar: ELEMENTS.find((e) => e.key === element)?.label === 'Spirit' ? '✦' : '◈',
          color: ELEMENTS.find((e) => e.key === element)?.color ?? '#00bcd4',
          gradient: `from-[${ELEMENTS.find((e) => e.key === element)?.color}]/20 to-transparent`,
          creatorId: null,
          companionId: null,
          systemPrompt: generateSystemPrompt({
            name: name.trim(),
            title: title.trim(),
            domain,
            voice,
            personality,
            element,
          }),
        }
      : null;

  const handleCopySpec = useCallback(() => {
    if (!forgedSpec) return;
    navigator.clipboard.writeText(JSON.stringify(forgedSpec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [forgedSpec]);

  const activeColor = element ? (ELEMENTS.find((e) => e.key === element)?.color ?? '#00bcd4') : '#00bcd4';

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-12 pt-24 text-center md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.06)_0%,transparent_60%)]" />
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Link
              href="/forge"
              className="mb-6 inline-flex items-center gap-2 text-xs text-white/30 transition-colors hover:text-white/50"
            >
              <ArrowLeft size={14} />
              Back to The Forge
            </Link>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#00bcd4]/60">
              Forge a Luminor
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Shape an Intelligence
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/45">
              Give it a name, a domain, a voice. It becomes your creative partner
              — thinking with you, creating alongside you.
            </p>
          </m.div>
        </section>

        {/* AI-Assisted Creation — Talk to Lumina */}
        <section className="mx-auto max-w-3xl px-6 pb-8">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-2xl border border-[#00bcd4]/20 bg-[#00bcd4]/[0.03] p-6 md:p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <Sparkle className="h-5 w-5 text-[#00bcd4]" />
              <h2 className="font-display text-lg font-semibold text-white/80">
                Ask Lumina
              </h2>
              <span className="rounded-full bg-[#00bcd4]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00bcd4]">
                AI
              </span>
            </div>
            <p className="mb-4 text-sm text-white/40">
              Describe what you want your Luminor to help with. Lumina will shape the intelligence for you.
            </p>
            <div className="flex gap-3">
              <textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder="I need a creative partner who understands music theory and can help me compose emotional piano pieces with jazz influences..."
                className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm text-white/90 placeholder-white/25 focus:border-[#00bcd4]/40 focus:outline-none"
                rows={2}
              />
              <button
                type="button"
                onClick={handleAiForge}
                disabled={isAiGenerating || aiDescription.length < 10}
                className="shrink-0 self-end rounded-xl bg-[#00bcd4] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#00acc1] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isAiGenerating ? 'Shaping...' : 'Shape'}
              </button>
            </div>
          </m.div>
        </section>

        <div className="mx-auto max-w-3xl px-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[11px] text-white/20 uppercase tracking-wider">or customize manually</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
        </div>

        {/* Step 1: Identity */}
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
          >
            <StepHeader step={1} title="Identity" subtitle="Name and title your Luminor" />

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="luminor-name"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40"
                >
                  Name
                </label>
                <input
                  id="luminor-name"
                  type="text"
                  maxLength={24}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Vesper, Aethon, Nova"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-display text-base text-white placeholder:text-white/20 focus:border-[#00bcd4]/30 focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/20"
                />
                <p className="mt-1.5 text-right text-[11px] text-white/20">{name.length}/24</p>
              </div>

              <div>
                <label
                  htmlFor="luminor-title"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40"
                >
                  Title
                </label>
                <input
                  id="luminor-title"
                  type="text"
                  maxLength={48}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Dawn Keeper, The Pattern Weaver"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#00bcd4]/30 focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/20"
                />
                <p className="mt-1.5 text-right text-[11px] text-white/20">{title.length}/48</p>
              </div>
            </div>
          </m.div>
        </section>

        {/* Step 2: Domain & Voice */}
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
          >
            <StepHeader step={2} title="Expertise" subtitle="Choose a domain and voice" />

            {/* Domain grid */}
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
              Domain
            </p>
            <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {LUMINOR_DOMAINS.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDomain(d.key)}
                  className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                    domain === d.key
                      ? 'border-[#00bcd4]/40 bg-[#00bcd4]/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      domain === d.key ? 'text-[#00bcd4]' : 'text-white/60'
                    }`}
                  >
                    {d.label}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/30">{d.description}</p>
                </button>
              ))}
            </div>

            {/* Voice */}
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
              Voice
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LUMINOR_VOICES.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVoice(v.key)}
                  className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                    voice === v.key
                      ? 'border-[#00bcd4]/40 bg-[#00bcd4]/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      voice === v.key ? 'text-[#00bcd4]' : 'text-white/60'
                    }`}
                  >
                    {v.label}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/30">{v.description}</p>
                </button>
              ))}
            </div>
          </m.div>
        </section>

        {/* Step 3: Element & Personality */}
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8"
          >
            <StepHeader step={3} title="Character" subtitle="Element affinity and personality" />

            {/* Elements */}
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
              Element
            </p>
            <div className="mb-8 flex flex-wrap gap-2">
              {ELEMENTS.map((el) => {
                const isActive = element === el.key;
                const Icon = el.icon;
                return (
                  <button
                    key={el.key}
                    type="button"
                    onClick={() => setElement(el.key)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/[0.08] text-white'
                        : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/10 hover:text-white/60'
                    }`}
                    style={
                      isActive
                        ? { borderColor: `${el.color}50`, boxShadow: `0 0 16px ${el.color}20` }
                        : undefined
                    }
                  >
                    <Icon size={16} style={isActive ? { color: el.color } : undefined} />
                    {el.label}
                  </button>
                );
              })}
            </div>

            {/* Personality */}
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
              Personality Traits
            </p>
            <p className="mb-3 text-[11px] text-white/25">Select 2-5 traits</p>
            <div className="flex flex-wrap gap-2">
              {PERSONALITY_POOL.map((trait) => (
                <Pill
                  key={trait}
                  label={trait}
                  selected={personality.includes(trait)}
                  color={activeColor}
                  onClick={() => handleTogglePersonality(trait)}
                />
              ))}
            </div>
          </m.div>
        </section>

        {/* Forge Button */}
        <section className="mx-auto max-w-3xl px-6 pb-12 text-center">
          <AnimatePresence>
            {canForge && !forgeComplete && (
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.4 }}
              >
                <m.button
                  type="button"
                  onClick={handleForge}
                  disabled={isForging}
                  whileHover={isForging ? undefined : { scale: 1.03 }}
                  whileTap={isForging ? undefined : { scale: 0.97 }}
                  className="group relative mx-auto inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 px-10 py-4 font-display text-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${activeColor}30, #0d47a120)`,
                    boxShadow: isForging
                      ? `0 0 40px ${activeColor}30, 0 0 80px ${activeColor}15`
                      : `0 0 20px ${activeColor}15`,
                  }}
                >
                  {isForging ? (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${activeColor}15, transparent)`,
                          animation: 'shimmer 1.5s ease-in-out infinite',
                        }}
                      />
                      <div className="relative flex items-center gap-3">
                        <div
                          className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                          style={{ borderColor: `${activeColor}60`, borderTopColor: 'transparent' }}
                        />
                        <span className="text-white/70">Forging {name.trim()}...</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Brain size={22} weight="duotone" style={{ color: activeColor }} />
                      Forge {name.trim()}
                    </>
                  )}
                </m.button>
              </m.div>
            )}
          </AnimatePresence>
        </section>

        {/* Forged Result */}
        <AnimatePresence>
          {forgeComplete && forgedSpec && (
            <m.section
              ref={resultRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-3xl px-6 pb-32"
            >
              <div
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md"
                style={{ boxShadow: `0 0 40px ${activeColor}20, 0 0 80px ${activeColor}10` }}
              >
                {/* Header */}
                <div
                  className="relative p-8 text-center"
                  style={{ background: `linear-gradient(135deg, ${activeColor}15, transparent)` }}
                >
                  <div
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-3xl"
                    style={{ background: `${activeColor}15`, boxShadow: `0 0 30px ${activeColor}20` }}
                  >
                    <Brain size={36} weight="duotone" style={{ color: activeColor }} />
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">{forgedSpec.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{forgedSpec.title}</p>
                  <p className="mt-2 text-xs text-white/30">{forgedSpec.tagline}</p>
                </div>

                {/* Details */}
                <div className="space-y-6 p-8">
                  {/* Element + Domain + Voice */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">Element</p>
                      <p className="mt-1 text-sm font-semibold" style={{ color: activeColor }}>
                        {forgedSpec.element}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">Domain</p>
                      <p className="mt-1 text-sm font-semibold text-white/70">
                        {LUMINOR_DOMAINS.find((d) => d.key === forgedSpec.domain)?.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">Voice</p>
                      <p className="mt-1 text-sm font-semibold text-white/70">
                        {LUMINOR_VOICES.find((v) => v.key === forgedSpec.voice)?.label}
                      </p>
                    </div>
                  </div>

                  {/* Personality */}
                  <div>
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/30">Personality</p>
                    <div className="flex flex-wrap gap-1.5">
                      {forgedSpec.personality?.map((trait) => (
                        <span
                          key={trait}
                          className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                          style={{
                            borderColor: `${activeColor}30`,
                            color: `${activeColor}cc`,
                            background: `${activeColor}10`,
                          }}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* System Prompt Preview */}
                  <div>
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/30">
                      System Prompt (generated)
                    </p>
                    <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4">
                      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-white/40">
                        {forgedSpec.systemPrompt}
                      </pre>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
                    <div className="flex items-center gap-2">
                      <Sparkle size={14} weight="fill" className="text-[#ffd700]" />
                      <span className="text-xs text-white/30">
                        Luminor forged. Ready to create with you.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySpec}
                      className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/15 hover:text-white/70"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-green-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy Spec
                        </>
                      )}
                    </button>
                  </div>

                  {/* Cross-Platform Export */}
                  <ExportPanel spec={forgedSpec as LuminorSpec} />
                </div>
              </div>
            </m.section>
          )}
        </AnimatePresence>

        <style jsx global>{`
          @keyframes shimmer {
            0%, 100% { opacity: 0.3; transform: translateX(-100%); }
            50% { opacity: 1; transform: translateX(100%); }
          }
        `}</style>
      </div>
    </LazyMotion>
  );
}
