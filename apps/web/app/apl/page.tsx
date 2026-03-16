'use client';

import { useState } from 'react';
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

// ── Component ────────────────────────────────────────────────────────────────

export default function APLPage() {
  const [activeExample, setActiveExample] = useState(0);
  const [analyzeInput, setAnalyzeInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    slopScore: number;
    qualityLevel: string;
    qualityPercent: number;
    suggestions: string[];
    slopMatches: { name: string; match: string; fix: string }[];
    detectedPalettes: { palette: string; confidence: number }[];
  } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  async function handleAnalyze() {
    if (!analyzeInput.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/apl/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: analyzeInput }),
      });
      if (!res.ok) {
        setAnalysisResult(null);
        return;
      }
      const data = await res.json();
      setAnalysisResult(data);
    } catch {
      setAnalysisResult(null);
    }
    setAnalyzing(false);
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
            { level: 'SPARK only', time: '10 seconds', beats: '80%', labelClass: 'text-cyan-400', beatsClass: 'text-cyan-400' },
            { level: 'SPARK + SHARPEN', time: '30 seconds', beats: '95%', labelClass: 'text-amber-400', beatsClass: 'text-amber-400' },
            { level: 'SPARK + SHAPE + SHARPEN', time: '60 seconds', beats: '99%', labelClass: 'text-emerald-400', beatsClass: 'text-emerald-400' },
          ].map((tier, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className={`text-2xl font-bold ${tier.labelClass}`}>L{i + 1}</div>
              <div className="flex-1">
                <div className="font-medium text-neutral-200">{tier.level}</div>
                <div className="text-sm text-neutral-500">{tier.time}</div>
              </div>
              <div className={`text-lg font-bold ${tier.beatsClass}`}>Beats {tier.beats}</div>
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

      {/* Live Analyzer */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-2 text-center text-2xl font-bold">Try It Now</h2>
        <p className="mb-8 text-center text-sm text-neutral-500">
          Paste any prompt. The APL engine will analyze it and show you how to improve it.
        </p>
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
          {analyzing ? 'Analyzing...' : 'Analyze My Prompt'}
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
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <a
            href="/apl/library"
            className="rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500"
          >
            Browse 30 Prompts
          </a>
          <a
            href="/academy/courses/arcanean-prompt-language"
            className="rounded-xl border border-neutral-700 px-6 py-3 font-medium text-neutral-300 transition hover:border-neutral-500"
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
