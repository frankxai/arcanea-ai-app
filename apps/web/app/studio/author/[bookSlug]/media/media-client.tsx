/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Image,
  Sparkle,
  PaintBrush,
  DownloadSimple,
  Copy,
  Check,
  Eye,
  Sliders,
} from '@/lib/phosphor-icons';

interface MediaClientProps {
  bookSlug: string;
  bookTitle: string;
  firstChapterSlug: string;
}

const SAMPLE_MEDIA = [
  {
    id: 'm1',
    title: 'Kaelen Voss — Portrait Reference',
    type: 'Character Sheet',
    prompt: 'Arcanean apprentice stonemason, athletic build, calloused hands, piercing gray eyes, wearing dark indigo linen tunic with leather guild straps, dramatic cinematic rim lighting, 8k resolution',
    ratio: '1:1',
    gate: 'Foundation',
  },
  {
    id: 'm2',
    title: 'The Storm That Remembered — Chapter 1 Key Art',
    type: 'Scene Art',
    prompt: 'Ancient coastal stone quay under violent turquoise lightning, crashing waves glowing with bioluminescent foam, towering dark granite spires in the background, cinematic fantasy illustration',
    ratio: '16:9',
    gate: 'Flow',
  },
  {
    id: 'm3',
    title: 'The Three Academies — Official Book Cover',
    type: 'Book Cover',
    prompt: 'Three towering crystal academies perched on soaring cliff tops, celestial aurora borealis swirling in deep cosmic violet sky, golden title layout, epic fantasy masterpiece',
    ratio: '2:3',
    gate: 'Crown',
  },
];

export function MediaClient({
  bookSlug,
  bookTitle,
  firstChapterSlug,
}: MediaClientProps) {
  const [selectedMedia, setSelectedMedia] = useState(SAMPLE_MEDIA[0]);
  const [prompt, setPrompt] = useState(SAMPLE_MEDIA[0].prompt);
  const [generating, setGenerating] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 1500);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-white/[0.06] pb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/studio/author/${bookSlug}/${firstChapterSlug}`}
            className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Sparkle size={18} className="text-[var(--arc-brand-atlantean-teal)]" />
              <h1 className="font-display text-2xl font-semibold">
                Visual & Media Studio — {bookTitle}
              </h1>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Multi-Modal Character Reference Sheets, Key Scene Art, and Book Covers
            </p>
          </div>
        </div>

        <Link
          href={`/studio/author/${bookSlug}/${firstChapterSlug}`}
          className="px-4 py-2 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/15 border border-[var(--arc-brand-atlantean-teal)]/30 text-xs font-medium text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/25 transition-all"
        >
          Return to Manuscript
        </Link>
      </header>

      {/* Grid: Left Controls & Prompt Lab + Right Gallery / Preview */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              Asset Category
            </label>
            <div className="space-y-2">
              {SAMPLE_MEDIA.map((item) => {
                const isSelected = selectedMedia.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedMedia(item);
                      setPrompt(item.prompt);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[var(--arc-brand-atlantean-teal)]/15 border-[var(--arc-brand-atlantean-teal)] text-white shadow-[0_0_15px_rgba(45,212,191,0.1)]'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-[10px] text-white/30">{item.type} &middot; Ratio: {item.ratio}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/[0.05] text-[var(--arc-brand-atlantean-teal)] font-mono">
                      {item.gate}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                <PaintBrush size={14} className="text-[var(--arc-brand-arcanean-gold)]" />
                Prompt Blueprint (NanoBanana / Veo)
              </h3>
              <button
                onClick={handleCopyPrompt}
                className="text-[10px] text-white/40 hover:text-white flex items-center gap-1"
              >
                {copiedPrompt ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40 resize-none"
            />

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] text-black font-display text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.2)] disabled:opacity-50"
            >
              {generating ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  Generating High-Res Canvas...
                </>
              ) : (
                <>
                  <Sparkle size={14} />
                  Generate Asset with Antigravity / NanoBanana
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
            <Eye size={14} className="text-[var(--arc-brand-atlantean-teal)]" />
            Visual Asset Canvas
          </span>

          <div className="rounded-3xl border border-white/[0.08] bg-[#08090d] p-6 shadow-2xl flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden group">
            {/* Visual Canvas Mockup */}
            <div className="relative w-full max-w-md aspect-[16/10] rounded-2xl bg-gradient-to-tr from-[#0f172a] via-[#1e1b4b] to-[#042f2e] border border-white/15 p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--arc-brand-atlantean-teal)]/20 via-transparent to-transparent pointer-events-none" />

              <div className="flex justify-between items-start z-10">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-[var(--arc-brand-atlantean-teal)] border border-white/10">
                  {selectedMedia.type}
                </span>
                <span className="text-[10px] text-white/50 font-mono">
                  Gate: {selectedMedia.gate}
                </span>
              </div>

              <div className="z-10 space-y-1">
                <h3 className="font-display text-lg font-bold text-white drop-shadow-md">
                  {selectedMedia.title}
                </h3>
                <p className="text-[11px] text-white/70 line-clamp-2 drop-shadow">
                  {selectedMedia.prompt}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-white/30 mt-4 text-center">
              All generated character portraits and scene art automatically sync with your manuscript inspector and chapter header bibles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
