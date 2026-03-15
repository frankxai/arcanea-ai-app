'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PALETTES } from '@/lib/apl/palettes';
import { ANTI_SLOP } from '@/lib/apl/anti-slop';

// ── Before/After Examples ────────────────────────────────────────────────────

const EXAMPLES = [
  {
    label: 'Character',
    before: 'Write a story about a lonely king',
    after: `SPARK: A king who eats dinner alone and sets a place for his dead wife every night — including pouring her wine

SHAPE: TIDE — the dining hall echoes. Rain against tall windows. Everything is silver and cold and too clean. His wine tastes like the sea because he has been crying into it.

SHARPEN: NOT a noble king mourning nobly. NOT a dramatic monologue about loss. NOT a resolution where he "learns to move on." He is pathetic and he knows it and he pours the wine anyway.`,
  },
  {
    label: 'Image',
    before: 'Create an image of a fantasy library',
    after: `SPARK: A library where the books are warm to the touch — they are alive, dreaming

SHAPE: VOID — near-black space, a single warm light source from within the shelves. Dust motes that move too slowly, like they are suspended in honey.

SHARPEN: NOT a grand fantasy library. NOT colorful spines. NOT orderly. The books have GROWN into the shelves like roots into soil.

Cinematic wide shot. Film grain. 21:9. A figure stands small in the center aisle, touching a spine that pulses faintly gold.`,
  },
  {
    label: 'Music',
    before: 'Compose an epic orchestral track',
    after: `SPARK: The cello is slightly out of tune — on purpose. It sounds like someone trying not to cry.

SHAPE: TIDE — sustained, reverberant, oceanic. A piano underneath like distant rain on glass.

SHARPEN: NOT epic. NOT building to a climax. It stays quiet the entire time. The power is in the restraint.

Ambient neoclassical, 72 BPM, solo cello with sparse piano, large reverb space, intimate recording, no percussion, instrumental only.`,
  },
];

// ── Library Preview Cards ────────────────────────────────────────────────────

const LIBRARY_PREVIEWS = [
  {
    label: 'Character',
    title: 'The Cartographer Who Maps Dreams',
    spark: 'She draws coastlines that only exist when people are sleeping',
    palette: 'DRIFT',
  },
  {
    label: 'Image',
    title: 'Cathedral of Abandoned Clocks',
    spark: 'Every clock stopped at the exact moment its owner died',
    palette: 'VOID',
  },
  {
    label: 'Music',
    title: 'Lullaby for a Machine',
    spark: 'A music box playing underwater — each note arrives late and distorted',
    palette: 'TIDE',
  },
];

// ── Types ────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  slopScore: number;
  qualityLevel: string;
  qualityPercent: number;
  suggestions: string[];
  slopMatches: { name: string; match: string; fix: string }[];
  detectedPalettes: { palette: string; confidence: number }[];
}

interface EnhanceResult {
  original: string;
  enhanced: string;
  spark: string | null;
  palette: string | null;
  paletteDescription: string | null;
  sharpened: string[];
  qualityBefore: number;
  qualityAfter: number;
}

// ── Quality Score Bar ────────────────────────────────────────────────────────

function QualityBar({ score, label }: { score: number; label: string }) {
  const color =
    score >= 90
      ? 'bg-emerald-500'
      : score >= 70
      ? 'bg-cyan-500'
      : score >= 50
      ? 'bg-amber-500'
      : 'bg-red-500';
  const textColor =
    score >= 90
      ? 'text-emerald-400'
      : score >= 70
      ? 'text-cyan-400'
      : score >= 50
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div className="flex-1">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-neutral-500">{label}</span>
        <span className={`font-bold ${textColor}`}>{score}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function APLPage() {
  const [activeExample, setActiveExample] = useState(0);

  // Quick Scan (regex analyzer) state
  const [analyzeInput, setAnalyzeInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // AI Enhance state
  const [enhanceInput, setEnhanceInput] = useState('');
  const [enhanceMode, setEnhanceMode] = useState<'text' | 'image' | 'music'>('text');
  const [enhanceResult, setEnhanceResult] = useState<EnhanceResult | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Tab state for the analyzer section
  const [activeTab, setActiveTab] = useState<'enhance' | 'scan'>('enhance');

  async function handleAnalyze() {
    if (!analyzeInput.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/apl/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: analyzeInput }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch {
      setAnalysisResult(null);
    }
    setAnalyzing(false);
  }

  async function handleEnhance() {
    if (!enhanceInput.trim()) return;
    setEnhancing(true);
    setEnhanceError(null);
    setEnhanceResult(null);
    setCopied(false);
    try {
      const res = await fetch('/api/apl/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhanceInput, mode: enhanceMode }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Enhancement failed' }));
        throw new Error(err.error || `Error ${res.status}`);
      }
      const data: EnhanceResult = await res.json();
      setEnhanceResult(data);
    } catch (err) {
      setEnhanceError(err instanceof Error ? err.message : 'Enhancement failed');
    }
    setEnhancing(false);
  }

  async function handleCopy() {
    if (!enhanceResult?.enhanced) return;
    try {
      await navigator.clipboard.writeText(enhanceResult.enhanced);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments where clipboard API is unavailable
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            The Arcanean Prompt Language
          </p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="text-cyan-400">SPARK</span>.{' '}
            <span className="text-amber-400">SHAPE</span>.{' '}
            <span className="text-rose-400">SHARPEN</span>.
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-neutral-400">
            Three words that turn generic AI output into work you are proud of.
            Works on every model. Learnable in 60 seconds. No mythology required.
          </p>
          <p className="text-sm text-neutral-500">
            Claude Opus 4.6 · GPT-5.4 · Gemini 3.1 Pro · Grok Imagine · Midjourney · Suno · any AI
          </p>
        </div>
      </section>

      {/* The System */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* SPARK */}
          <div className="rounded-xl border border-cyan-900/50 bg-cyan-950/10 p-6">
            <div className="mb-3 text-3xl font-bold text-cyan-400">SPARK</div>
            <p className="mb-2 text-lg font-medium text-neutral-200">The one detail that makes it yours</p>
            <p className="text-sm text-neutral-400">
              Not a description. A truth. The detail so specific it could only come from you.
              Close your eyes. See the thing. Find the detail that surprises YOU.
            </p>
            <div className="mt-4 rounded-lg bg-neutral-900/50 p-3 text-xs text-neutral-300">
              <span className="text-neutral-500">Generic:</span> &quot;a lonely king&quot;<br />
              <span className="text-cyan-400">Sparked:</span> &quot;a king who pours wine for his dead wife every night&quot;
            </div>
          </div>

          {/* SHAPE */}
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/10 p-6">
            <div className="mb-3 text-3xl font-bold text-amber-400">SHAPE</div>
            <p className="mb-2 text-lg font-medium text-neutral-200">The sensory world it lives in</p>
            <p className="text-sm text-neutral-400">
              Five palettes: Forge (fire), Tide (water), Root (earth), Drift (wind), Void (spirit).
              Pick the one that feels right.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.values(PALETTES).map((p) => (
                <span
                  key={p.id}
                  className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* SHARPEN */}
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/10 p-6">
            <div className="mb-3 text-3xl font-bold text-rose-400">SHARPEN</div>
            <p className="mb-2 text-lg font-medium text-neutral-200">What it must NOT be</p>
            <p className="text-sm text-neutral-400">
              Tell the AI what to avoid. Seven defaults to cut — the anti-slop checklist.
            </p>
            <div className="mt-4 space-y-1">
              {ANTI_SLOP.slice(0, 4).map((s) => (
                <div key={s.id} className="text-xs text-neutral-400">
                  <span className="text-rose-400">{s.name}</span> → {s.fix}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Ladder */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">The Quality Ladder</h2>
        <div className="space-y-4">
          {[
            { level: 'SPARK only', time: '10 seconds', beats: '80%', color: 'cyan' },
            { level: 'SPARK + SHARPEN', time: '30 seconds', beats: '95%', color: 'amber' },
            { level: 'SPARK + SHAPE + SHARPEN', time: '60 seconds', beats: '99%', color: 'emerald' },
          ].map((tier, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className={`text-2xl font-bold text-${tier.color}-400`}>L{i + 1}</div>
              <div className="flex-1">
                <div className="font-medium text-neutral-200">{tier.level}</div>
                <div className="text-sm text-neutral-500">{tier.time}</div>
              </div>
              <div className={`text-lg font-bold text-${tier.color}-400`}>Beats {tier.beats}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Before/After */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">Before → After</h2>
        <div className="mb-6 flex justify-center gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setActiveExample(i)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeExample === i
                  ? 'bg-cyan-500 text-black'
                  : 'border border-neutral-700 text-neutral-400 hover:border-neutral-500'
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-red-900/30 bg-red-950/5 p-6">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-red-400">
              Generic Prompt
            </div>
            <pre className="whitespace-pre-wrap text-sm text-neutral-400">
              {EXAMPLES[activeExample].before}
            </pre>
          </div>
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/5 p-6">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-400">
              With SPARK.SHAPE.SHARPEN
            </div>
            <pre className="whitespace-pre-wrap text-sm text-neutral-300">
              {EXAMPLES[activeExample].after}
            </pre>
          </div>
        </div>
      </section>

      {/* ── AI-Powered Enhance + Quick Scan ──────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-2 text-center text-2xl font-bold">Try It Now</h2>
        <p className="mb-8 text-center text-sm text-neutral-500">
          Paste any prompt. Enhance it with AI or scan it for quality issues.
        </p>

        {/* Tabs */}
        <div className="mb-6 flex justify-center gap-1 rounded-full border border-neutral-800 bg-neutral-900/50 p-1 sm:mx-auto sm:w-fit">
          <button
            onClick={() => setActiveTab('enhance')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === 'enhance'
                ? 'bg-cyan-600 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Enhance with AI
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === 'scan'
                ? 'bg-cyan-600 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Quick Scan
          </button>
        </div>

        {/* ── Enhance Tab ──────────────────────────────────────────────────── */}
        {activeTab === 'enhance' && (
          <div className="mx-auto max-w-3xl">
            <textarea
              value={enhanceInput}
              onChange={(e) => setEnhanceInput(e.target.value)}
              placeholder="Paste your prompt here — the AI will transform it into SPARK.SHAPE.SHARPEN format..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900/50 p-4 text-sm text-neutral-200 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
              rows={4}
            />

            {/* Mode selector + Enhance button */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                {(['text', 'image', 'music'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setEnhanceMode(m)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      enhanceMode === m
                        ? 'bg-amber-600 text-white'
                        : 'border border-neutral-700 text-neutral-400 hover:border-neutral-500'
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={handleEnhance}
                disabled={enhancing || !enhanceInput.trim()}
                className="flex-1 rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50 sm:flex-none"
              >
                {enhancing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enhancing...
                  </span>
                ) : (
                  'Enhance with APL'
                )}
              </button>
            </div>

            {/* Error */}
            {enhanceError && (
              <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
                {enhanceError}
              </div>
            )}

            {/* Results */}
            {enhanceResult && (
              <div className="mt-6 space-y-6">
                {/* Quality comparison */}
                <div className="rounded-xl border border-neutral-700 bg-neutral-900/50 p-6">
                  <div className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Quality Improvement
                  </div>
                  <div className="flex gap-6">
                    <QualityBar score={enhanceResult.qualityBefore} label="Before" />
                    <div className="flex items-end pb-1 text-lg font-bold text-emerald-400">
                      +{enhanceResult.qualityAfter - enhanceResult.qualityBefore}
                    </div>
                    <QualityBar score={enhanceResult.qualityAfter} label="After" />
                  </div>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Original */}
                  <div className="rounded-xl border border-red-900/30 bg-red-950/5 p-5">
                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-red-400">
                      Original
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-neutral-400">
                      {enhanceResult.original}
                    </pre>
                  </div>

                  {/* Enhanced */}
                  <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/5 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                        Enhanced
                      </span>
                      <button
                        onClick={handleCopy}
                        className="rounded-lg border border-neutral-700 px-3 py-1 text-xs text-neutral-400 transition hover:border-cyan-500 hover:text-cyan-400"
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-neutral-200">
                      {enhanceResult.enhanced}
                    </pre>
                  </div>
                </div>

                {/* Breakdown: Spark, Palette, Sharpen */}
                <div className="grid gap-4 md:grid-cols-3">
                  {enhanceResult.spark && (
                    <div className="rounded-xl border border-cyan-900/30 bg-cyan-950/10 p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-cyan-400">
                        SPARK
                      </div>
                      <p className="text-sm text-neutral-300">{enhanceResult.spark}</p>
                    </div>
                  )}
                  {enhanceResult.palette && (
                    <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-amber-400">
                        SHAPE — {enhanceResult.palette.toUpperCase()}
                      </div>
                      <p className="text-sm text-neutral-300">
                        {enhanceResult.paletteDescription || enhanceResult.palette}
                      </p>
                    </div>
                  )}
                  {enhanceResult.sharpened && enhanceResult.sharpened.length > 0 && (
                    <div className="rounded-xl border border-rose-900/30 bg-rose-950/10 p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-rose-400">
                        SHARPEN
                      </div>
                      <ul className="space-y-1">
                        {enhanceResult.sharpened.map((s, i) => (
                          <li key={i} className="text-sm text-neutral-300">
                            NOT {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Quick Scan Tab ───────────────────────────────────────────────── */}
        {activeTab === 'scan' && (
          <div className="mx-auto max-w-3xl">
            <textarea
              value={analyzeInput}
              onChange={(e) => setAnalyzeInput(e.target.value)}
              placeholder="Paste your prompt here..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900/50 p-4 text-sm text-neutral-200 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
              rows={4}
            />
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !analyzeInput.trim()}
              className="mt-4 w-full rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
            >
              {analyzing ? 'Scanning...' : 'Scan My Prompt'}
            </button>

            {analysisResult && (
              <div className="mt-6 space-y-4 rounded-xl border border-neutral-700 bg-neutral-900/50 p-6">
                {/* Quality Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Quality Level</span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      analysisResult.qualityLevel === 'generic'
                        ? 'bg-red-900/50 text-red-400'
                        : analysisResult.qualityLevel === 'clear'
                        ? 'bg-amber-900/50 text-amber-400'
                        : analysisResult.qualityLevel === 'vivid'
                        ? 'bg-cyan-900/50 text-cyan-400'
                        : 'bg-emerald-900/50 text-emerald-400'
                    }`}
                  >
                    {analysisResult.qualityLevel.toUpperCase()} ({analysisResult.qualityPercent}%)
                  </span>
                </div>

                {/* Slop Score */}
                {analysisResult.slopScore > 0 && (
                  <div>
                    <div className="mb-2 text-sm text-neutral-400">Slop Detected</div>
                    {analysisResult.slopMatches.map((m, i) => (
                      <div key={i} className="mb-2 rounded-lg bg-red-950/20 p-3 text-xs">
                        <span className="text-red-400">&quot;{m.match}&quot;</span>
                        <span className="text-neutral-500"> — {m.name}: </span>
                        <span className="text-neutral-300">{m.fix}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Palette Detection */}
                {analysisResult.detectedPalettes.length > 0 && (
                  <div>
                    <div className="mb-2 text-sm text-neutral-400">Detected Palette</div>
                    <div className="flex gap-2">
                      {analysisResult.detectedPalettes.slice(0, 3).map((p) => (
                        <span
                          key={p.palette}
                          className="rounded-full border border-amber-800 px-3 py-1 text-xs text-amber-400"
                        >
                          {p.palette.toUpperCase()} ({Math.round(p.confidence * 100)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {analysisResult.suggestions.length > 0 && (
                  <div>
                    <div className="mb-2 text-sm text-neutral-400">Suggestions</div>
                    <ul className="space-y-1">
                      {analysisResult.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-neutral-300">
                          → {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Browse Library Section ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold">Browse 30+ Ready-to-Use Prompts</h2>
          <p className="mx-auto max-w-lg text-sm text-neutral-500">
            Every prompt in the library is built with SPARK.SHAPE.SHARPEN — ready to copy and paste
            into any AI model.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {LIBRARY_PREVIEWS.map((card) => (
            <div
              key={card.title}
              className="group rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 transition hover:border-cyan-900/50 hover:bg-cyan-950/5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs text-neutral-400">
                  {card.label}
                </span>
                <span className="rounded-full border border-amber-900/50 px-2.5 py-0.5 text-xs text-amber-400">
                  {card.palette}
                </span>
              </div>
              <h3 className="mb-2 font-medium text-neutral-200 group-hover:text-white">
                {card.title}
              </h3>
              <p className="text-sm text-neutral-500">
                <span className="text-cyan-400/70">SPARK:</span> {card.spark}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/apl/library"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-800/50 bg-cyan-950/20 px-6 py-3 font-medium text-cyan-400 transition hover:border-cyan-600 hover:bg-cyan-950/30"
          >
            View Full Library
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Model Compatibility */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">Works on Every Model</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { name: 'Claude Opus 4.6', tip: 'Permission to be brave' },
            { name: 'GPT-5.4', tip: 'SHARPEN is incredibly effective' },
            { name: 'Gemini 3.1 Pro', tip: 'Palettes translate to multimodal' },
            { name: 'Grok Imagine', tip: 'SPARK prevents generic output' },
            { name: 'Midjourney', tip: 'Direct to image prompts' },
            { name: 'DALL-E', tip: 'Concrete visual anchors' },
            { name: 'Suno / Udio', tip: 'Tell music what NOT to do' },
            { name: 'Stable Diffusion', tip: 'Palettes = color grading' },
          ].map((model) => (
            <div
              key={model.name}
              className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-3 text-center"
            >
              <div className="text-sm font-medium text-neutral-200">{model.name}</div>
              <div className="mt-1 text-xs text-neutral-500">{model.tip}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold">Start Here</h2>
        <ol className="mb-8 space-y-2 text-left text-neutral-300">
          <li>1. Think of something you want to create</li>
          <li>2. Find the SPARK — the one detail that surprises you</li>
          <li>3. That is it. You are using APL.</li>
        </ol>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/academy/courses/arcanean-prompt-language"
            className="rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500"
          >
            Take the Course
          </a>
          <a
            href="/chat"
            className="rounded-xl border border-neutral-700 px-6 py-3 font-medium text-neutral-300 transition hover:border-neutral-500"
          >
            Try It in Chat
          </a>
          <a
            href="/blog/arcanean-prompt-language"
            className="rounded-xl border border-neutral-700 px-6 py-3 font-medium text-neutral-300 transition hover:border-neutral-500"
          >
            Read the Guide
          </a>
        </div>
        <p className="mt-8 text-sm text-neutral-600">
          SPARK. SHAPE. SHARPEN. That is the whole system. Everything else is practice.
        </p>
      </section>
    </div>
  );
}
