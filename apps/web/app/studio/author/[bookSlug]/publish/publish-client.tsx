/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FilePdf,
  Book,
  Article,
  DownloadSimple,
  Check,
  Sparkle,
  Eye,
  Sliders,
  Globe,
} from '@/lib/phosphor-icons';
import type { ExportConfig } from '@/lib/author/types';

interface PublishClientProps {
  bookSlug: string;
  bookTitle: string;
  totalWords: number;
  chapterCount: number;
  firstChapterSlug: string;
}

export function PublishClient({
  bookSlug,
  bookTitle,
  totalWords,
  chapterCount,
  firstChapterSlug,
}: PublishClientProps) {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'kdp-pdf',
    trimSize: '6x9',
    includeDropCaps: true,
    includeChapterArt: true,
    includeCharacterRoster: true,
    typographyStyle: 'arcanean-editorial',
  });

  const [exporting, setExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setDownloadReady(false);
    setTimeout(() => {
      setExporting(false);
      setDownloadReady(true);
    }, 1200);
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
              <Sparkle size={18} className="text-[var(--arc-brand-arcanean-gold)]" />
              <h1 className="font-display text-2xl font-semibold">
                Publishing House — {bookTitle}
              </h1>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Multi-Format Compilation & Distribution: Print PDF, ePub 3, Web & Serialization
            </p>
          </div>
        </div>

        <Link
          href={`/books/drafts/${bookSlug}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-white/80 transition-all"
        >
          <Globe size={14} className="text-[var(--arc-brand-atlantean-teal)]" />
          Preview Live Web Reader
        </Link>
      </header>

      {/* Grid: Left Options + Right Live Print / ePub Preview */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Options Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Format Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'kdp-pdf', label: 'KDP Print PDF', icon: FilePdf, desc: '6x9 print-ready with bleed' },
                { id: 'epub3', label: 'ePub 3.0 E-Book', icon: Book, desc: 'Kindle & Apple Books' },
                { id: 'wattpad-md', label: 'Wattpad / Royal Road', icon: Article, desc: 'Serialized Markdown' },
                { id: 'clean-markdown', label: 'Clean Markdown / Git', icon: Globe, desc: 'Local SSOT package' },
              ].map(({ id, label, icon: Icon, desc }) => {
                const isActive = config.format === id;
                return (
                  <button
                    key={id}
                    onClick={() => setConfig({ ...config, format: id as any })}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      isActive
                        ? 'bg-[var(--arc-brand-atlantean-teal)]/15 border-[var(--arc-brand-atlantean-teal)] text-white shadow-[0_0_15px_rgba(45,212,191,0.1)]'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-[var(--arc-brand-atlantean-teal)]' : 'text-white/40'} />
                    <p className="font-display text-xs font-semibold mt-2">{label}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Print Layout Specs */}
          {config.format === 'kdp-pdf' && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <h3 className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                <Sliders size={14} className="text-[var(--arc-brand-atlantean-teal)]" />
                Print Interior Formatting
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-white/40 uppercase">Trim Size</span>
                  <select
                    value={config.trimSize}
                    onChange={(e) => setConfig({ ...config, trimSize: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white"
                  >
                    <option value="6x9">6 x 9 in (Standard US Trade)</option>
                    <option value="5.5x8.5">5.5 x 8.5 in (Demy)</option>
                    <option value="5x8">5 x 8 in (Mass Market)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-white/40 uppercase">Typography Style</span>
                  <select
                    value={config.typographyStyle}
                    onChange={(e) => setConfig({ ...config, typographyStyle: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white"
                  >
                    <option value="arcanean-editorial">Arcanean Editorial (Instrument Serif)</option>
                    <option value="classical">Garamond Classical</option>
                    <option value="modern-serif">Merriweather Modern</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer">
                  <span>Include Decorative Drop Caps</span>
                  <input
                    type="checkbox"
                    checked={config.includeDropCaps}
                    onChange={(e) => setConfig({ ...config, includeDropCaps: e.target.checked })}
                    className="accent-[var(--arc-brand-atlantean-teal)]"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer">
                  <span>Include Chapter Header Art</span>
                  <input
                    type="checkbox"
                    checked={config.includeChapterArt}
                    onChange={(e) => setConfig({ ...config, includeChapterArt: e.target.checked })}
                    className="accent-[var(--arc-brand-atlantean-teal)]"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer">
                  <span>Include Character Diamond Appendix</span>
                  <input
                    type="checkbox"
                    checked={config.includeCharacterRoster}
                    onChange={(e) => setConfig({ ...config, includeCharacterRoster: e.target.checked })}
                    className="accent-[var(--arc-brand-atlantean-teal)]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] text-black font-display text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.2)] disabled:opacity-50"
          >
            {exporting ? (
              <>
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                Compiling {config.format.toUpperCase()}...
              </>
            ) : downloadReady ? (
              <>
                <Check size={18} />
                Download Ready ({config.format})
              </>
            ) : (
              <>
                <DownloadSimple size={18} />
                Compile & Export Manuscript
              </>
            )}
          </button>
        </div>

        {/* Right Live Manuscript Book Spread Preview */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
            <Eye size={14} className="text-[var(--arc-brand-arcanean-gold)]" />
            Live Print Interior Spread Preview
          </span>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0c0d12] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Mock Book Spread */}
            <div className="w-full max-w-lg aspect-[1.4/1] bg-[#fcfaf2] text-[#1c1d22] rounded-r-xl rounded-l-md shadow-2xl p-8 flex flex-col justify-between border-l-4 border-[#e2dec9]">
              {/* Running Header */}
              <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-[#7c786c] border-b border-[#e5e1cf] pb-2 font-mono">
                <span>The Three Academies</span>
                <span>Chapter One</span>
              </div>

              {/* Chapter Interior Body */}
              <div className="space-y-4 my-auto">
                <h2 className="text-center font-serif text-lg font-bold tracking-tight text-[#111]">
                  Chapter I
                </h2>
                <h3 className="text-center font-serif text-xs italic text-[#555] -mt-2">
                  The Storm That Remembered
                </h3>

                <p className="font-serif text-[11px] leading-relaxed text-[#2a2a2a] text-justify indent-4">
                  {config.includeDropCaps ? (
                    <span className="float-left text-3xl font-serif font-bold leading-none pr-1.5 pt-0.5 text-[#111]">
                      T
                    </span>
                  ) : null}
                  he sea remembered things the town had forgotten. Kael knew this the way you know anything you&apos;ve never been taught — in the soles of the feet, in the way the back of the neck prickles before lightning, in the way the tide sometimes came in speaking a language older than words.
                </p>

                <p className="font-serif text-[11px] leading-relaxed text-[#2a2a2a] text-justify indent-4">
                  He stood upon the salt-slick quay, holding a mason’s chisel in calloused fingers. The Five Elements resonated in the stone beneath his boots, waiting for the seal to break.
                </p>
              </div>

              {/* Page Number */}
              <div className="text-center text-[9px] font-mono text-[#8c887b]">
                — 1 —
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
              <span>{totalWords.toLocaleString()} Words</span>
              <span>&middot;</span>
              <span>{chapterCount} Chapters</span>
              <span>&middot;</span>
              <span>Trim: {config.trimSize}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
