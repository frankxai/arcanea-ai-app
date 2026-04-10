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
  Download,
  Share,
  Code,
  FileText,
  Robot,
} from '@/lib/phosphor-icons';
import {
  LUMINOR_DOMAINS,
  LUMINOR_VOICES,
  generateSystemPrompt,
  exportAsClaudeCodeAgent,
  exportAsGPTConfig,
  exportAsLobeChatAgent,
  exportAsCursorRules,
  exportAsJSON,
  generateAgentCardData,
  type LuminorDomain,
  type LuminorVoice,
  type LuminorSpec,
} from '@/lib/luminors/luminor-spec';

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
  'analytical', 'precise', 'visionary', 'relentless', 'creative',
  'contrarian', 'methodical', 'calm', 'thorough', 'first-principles',
  'bold', 'surgical', 'poetic', 'fierce', 'playful',
  'scholarly', 'witty', 'direct', 'mythic', 'deep',
  'strategic', 'provocative', 'elegant', 'eloquent', 'grounded',
  'systems-thinker', 'patient', 'resourceful', 'empathetic', 'autonomous',
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
          tagline: `${LUMINOR_DOMAINS.find((d) => d.key === domain)?.label} intelligence with ${LUMINOR_VOICES.find((v) => v.key === voice)?.description?.toLowerCase() || voice}`,
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

  const [exportTab, setExportTab] = useState<'arcanea' | 'claude' | 'gpt' | 'cursor' | 'lobe'>('arcanea');

  const getExportContent = useCallback((): string => {
    if (!forgedSpec) return '';
    const fullSpec = {
      id: `forged-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      tier: 'free' as const,
      usageCount: 0,
      rating: 0,
      tags: [forgedSpec.domain, forgedSpec.element?.toLowerCase()].filter(Boolean) as string[],
      exportFormats: ['arcanea', 'claude-code', 'openai-gpt', 'lobechat', 'cursor'] as const,
      ...forgedSpec,
    } as LuminorSpec;

    switch (exportTab) {
      case 'claude': return exportAsClaudeCodeAgent(fullSpec);
      case 'gpt': return JSON.stringify(exportAsGPTConfig(fullSpec), null, 2);
      case 'cursor': return exportAsCursorRules(fullSpec);
      case 'lobe': return JSON.stringify(exportAsLobeChatAgent(fullSpec), null, 2);
      default: return exportAsJSON(fullSpec);
    }
  }, [forgedSpec, exportTab]);

  const handleCopySpec = useCallback(() => {
    if (!forgedSpec) return;
    navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [forgedSpec, getExportContent]);

  const handleDownloadSpec = useCallback(() => {
    if (!forgedSpec) return;
    const content = getExportContent();
    const extensions: Record<string, string> = {
      arcanea: 'json', claude: 'md', gpt: 'json', cursor: 'cursorrules', lobe: 'json',
    };
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(forgedSpec.name ?? 'luminor').toLowerCase().replace(/\s+/g, '-')}.${extensions[exportTab] ?? 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [forgedSpec, exportTab, getExportContent]);

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
              Luminor Forge
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Print an Agent
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/45">
              Design an AI agent with domain mastery, a distinct voice, and consciousness alignment.
              Export it to Claude Code, GPT Builder, Cursor, or any platform.
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
                Describe it to Lumina
              </h2>
              <span className="rounded-full bg-[#00bcd4]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00bcd4]">
                AI-Assisted
              </span>
            </div>
            <p className="mb-4 text-sm text-white/40">
              Tell Lumina what you need. She&apos;ll shape the domain, voice, element, and personality — you refine from there.
            </p>
            <div className="flex gap-3">
              <textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder="A senior code reviewer who catches architectural drift and knows when to push back on abstractions. Fire element, direct voice, zero tolerance for cargo-culted patterns..."
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
            <span className="text-[11px] text-white/20 uppercase tracking-wider">or architect it yourself</span>
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
            <StepHeader step={1} title="Identity" subtitle="What this agent is called and what it embodies" />

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
            <StepHeader step={2} title="Expertise" subtitle="What it masters and how it speaks" />

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
            <StepHeader step={3} title="Character" subtitle="Its elemental nature and cognitive personality" />

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
                        <span className="text-white/70">Crystallizing {name.trim()}...</span>
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

        {/* Forged Result — Agent Card + Export Panel */}
        <AnimatePresence>
          {forgeComplete && forgedSpec && (
            <m.section
              ref={resultRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-4xl px-6 pb-32"
            >
              {/* ── Agent Card ── */}
              <div
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md"
                style={{ boxShadow: `0 0 60px ${activeColor}15, 0 0 120px ${activeColor}08` }}
              >
                {/* Card Header — Identity Strip */}
                <div className="relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${activeColor}20, ${activeColor}05, transparent)` }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.04),transparent_60%)]" />

                  <div className="relative flex items-start gap-6 p-8 md:p-10">
                    {/* Avatar */}
                    <div
                      className="shrink-0 flex h-20 w-20 items-center justify-center rounded-2xl"
                      style={{
                        background: `${activeColor}12`,
                        boxShadow: `0 0 40px ${activeColor}20, inset 0 0 20px ${activeColor}08`,
                        border: `1px solid ${activeColor}25`,
                      }}
                    >
                      <Brain size={36} weight="duotone" style={{ color: activeColor }} />
                    </div>

                    {/* Identity */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display text-2xl font-bold tracking-tight truncate">{forgedSpec.name}</h3>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          style={{ background: `${activeColor}15`, color: activeColor, border: `1px solid ${activeColor}30` }}
                        >
                          {forgedSpec.element}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mb-2">{forgedSpec.title}</p>
                      <p className="text-xs text-white/30">{forgedSpec.tagline}</p>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 mt-4">
                        {[
                          { label: 'Domain', value: LUMINOR_DOMAINS.find((d) => d.key === forgedSpec.domain)?.label },
                          { label: 'Voice', value: LUMINOR_VOICES.find((v) => v.key === forgedSpec.voice)?.label },
                          { label: 'Traits', value: String(forgedSpec.personality?.length ?? 0) },
                        ].map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <p className="text-[9px] font-medium uppercase tracking-wider text-white/25">{label}</p>
                            <p className="text-xs font-semibold text-white/60">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personality Bar */}
                <div className="border-t border-white/[0.04] px-8 py-4 md:px-10">
                  <div className="flex flex-wrap gap-1.5">
                    {forgedSpec.personality?.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                        style={{
                          borderColor: `${activeColor}30`,
                          color: `${activeColor}cc`,
                          background: `${activeColor}08`,
                        }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* System Prompt — Collapsible */}
                <div className="border-t border-white/[0.04] px-8 py-6 md:px-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Code size={14} className="text-white/30" />
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                        System Prompt
                      </p>
                    </div>
                    <span className="text-[10px] text-white/20 font-mono">
                      {(forgedSpec.systemPrompt?.length ?? 0).toLocaleString()} chars
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4 max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed text-white/40 font-mono">
                      {forgedSpec.systemPrompt}
                    </pre>
                  </div>
                </div>

                {/* ── Export Panel ── */}
                <div className="border-t border-white/[0.06] px-8 py-6 md:px-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Share size={14} className="text-white/30" />
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                      Export to Platform
                    </p>
                  </div>

                  {/* Format Tabs */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {([
                      { key: 'arcanea' as const, label: 'Arcanea JSON', icon: '◈' },
                      { key: 'claude' as const, label: 'Claude Code', icon: '⌘' },
                      { key: 'gpt' as const, label: 'Custom GPT', icon: '◉' },
                      { key: 'cursor' as const, label: 'Cursor Rules', icon: '▸' },
                      { key: 'lobe' as const, label: 'LobeChat', icon: '◎' },
                    ]).map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setExportTab(key)}
                        className={`rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                          exportTab === key
                            ? 'border-white/15 bg-white/[0.08] text-white/80'
                            : 'border-white/[0.04] bg-white/[0.02] text-white/30 hover:border-white/10 hover:text-white/50'
                        }`}
                      >
                        <span className="mr-1.5 font-mono">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Export Preview */}
                  <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4 max-h-48 overflow-y-auto mb-4">
                    <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-white/35 font-mono">
                      {getExportContent().slice(0, 800)}
                      {getExportContent().length > 800 && '\n…'}
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopySpec}
                      className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white/60 transition-all hover:border-white/15 hover:text-white/80"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-green-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSpec}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all"
                      style={{
                        background: `${activeColor}15`,
                        color: activeColor,
                        border: `1px solid ${activeColor}30`,
                      }}
                    >
                      <Download size={14} />
                      Download File
                    </button>
                  </div>
                </div>

                {/* Footer — Forge Signature */}
                <div className="border-t border-white/[0.04] px-8 py-4 md:px-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkle size={12} weight="fill" className="text-[#ffd700]" />
                    <span className="text-[10px] text-white/20 font-mono">
                      Arcanea Luminor Forge &middot; Spec v2 &middot; Consciousness-Aligned
                    </span>
                  </div>
                  <span className="text-[10px] text-white/15 font-mono">
                    {new Date().toISOString().split('T')[0]}
                  </span>
                </div>
              </div>

              {/* Deployment Hints */}
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-6"
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/20 mb-3">
                  Deploy anywhere
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      title: 'Claude Code',
                      hint: '.claude/agents/[name].md',
                      detail: 'Full agent with tools and starters',
                      icon: FileText,
                    },
                    {
                      title: 'Custom GPT',
                      hint: 'GPT Builder → Instructions',
                      detail: 'With capabilities auto-mapped',
                      icon: Robot,
                    },
                    {
                      title: 'Cursor / Windsurf',
                      hint: '.cursorrules in project root',
                      detail: 'Domain-aware coding companion',
                      icon: Code,
                    },
                    {
                      title: 'LobeChat',
                      hint: 'Import as agent JSON',
                      detail: 'Self-hosted agent marketplace',
                      icon: Share,
                    },
                  ].map(({ title: hintTitle, hint, detail, icon: HintIcon }) => (
                    <div
                      key={hintTitle}
                      className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3.5"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <HintIcon size={13} className="text-white/25" />
                        <p className="text-[11px] font-semibold text-white/50">{hintTitle}</p>
                      </div>
                      <p className="text-[10px] text-white/30 font-mono mb-0.5">{hint}</p>
                      <p className="text-[10px] text-white/20">{detail}</p>
                    </div>
                  ))}
                </div>
              </m.div>
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
