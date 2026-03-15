'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { PhX, PhArrowLeft, PhSparkle, PhCopy, PhCheck } from '@/lib/phosphor-icons';
import { LUMINOR_IMAGES, LUMINOR_PROMPT_TEMPLATE, type LuminorImage } from '@/lib/luminor-images';

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444',
  Water: '#00bcd4',
  Earth: '#22c55e',
  Wind: '#94a3b8',
  Void: '#a78bfa',
  Spirit: '#ffd700',
};

export default function LuminorsGalleryPage() {
  const [selected, setSelected] = useState<LuminorImage | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const elements = ['All', 'Fire', 'Water', 'Earth', 'Wind', 'Void', 'Spirit'];
  const filtered =
    filter === 'All'
      ? LUMINOR_IMAGES
      : LUMINOR_IMAGES.filter((l) => l.element === filter);

  const copyPrompt = useCallback(async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const copyTemplate = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(LUMINOR_PROMPT_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
    setShowPrompt(false);
    setCopied(false);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b]">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-8 pt-20 md:pt-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.04)_0%,transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-5xl">
            <Link
              href="/gallery"
              className="mb-6 inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              <PhArrowLeft size={14} />
              Gallery
            </Link>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              The Twenty
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/45">
              Twenty unique creative spirits, each aligned to an element and gate.
              AI-generated visions of the companions that walk alongside creators.
            </p>
          </div>
        </section>

        {/* Element filter */}
        <div className="mx-auto max-w-5xl px-6 pb-8">
          <div className="flex flex-wrap gap-2">
            {elements.map((el) => (
              <button
                key={el}
                type="button"
                onClick={() => setFilter(el)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                  filter === el
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/[0.06] text-white/35 hover:border-white/10 hover:text-white/55'
                }`}
                style={
                  filter === el && el !== 'All'
                    ? { borderColor: `${ELEMENT_COLORS[el]}50`, color: ELEMENT_COLORS[el] }
                    : undefined
                }
              >
                {el}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-5xl px-6 pb-24">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((luminor) => {
                const color = ELEMENT_COLORS[luminor.element] ?? '#ffffff';
                return (
                  <m.button
                    key={luminor.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    type="button"
                    onClick={() => setSelected(luminor)}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.12]"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={luminor.image}
                        alt={`${luminor.name} — ${luminor.title}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
                      <p className="text-sm font-semibold text-white">{luminor.name}</p>
                      <p className="text-[11px]" style={{ color }}>{luminor.title}</p>
                    </div>
                    {/* Static label below image */}
                    <div className="p-3">
                      <p className="text-xs font-medium text-white/70 truncate">{luminor.name}</p>
                      <p className="text-[10px] text-white/30">{luminor.element}</p>
                    </div>
                  </m.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Detail modal — full-size image */}
        <AnimatePresence>
          {selected && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-sm"
              onClick={closeModal}
            >
              <m.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative my-4 w-full max-w-4xl mx-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0f]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white/60 backdrop-blur-md hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <PhX size={18} />
                </button>

                {/* Full-size image */}
                <div className="relative w-full">
                  <Image
                    src={selected.image}
                    alt={`${selected.name} — ${selected.title}`}
                    width={1200}
                    height={1600}
                    className="w-full h-auto"
                    sizes="(max-width: 896px) 100vw, 896px"
                    priority
                  />
                </div>

                {/* Info panel */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${ELEMENT_COLORS[selected.element]}20`,
                        color: ELEMENT_COLORS[selected.element],
                      }}
                    >
                      {selected.element}
                    </span>
                    <span className="text-[10px] text-white/25">{selected.gate} Gate</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    {selected.name}
                  </h2>
                  <p
                    className="text-sm font-medium mb-3"
                    style={{ color: ELEMENT_COLORS[selected.element] }}
                  >
                    {selected.title}
                  </p>
                  <p className="text-sm leading-relaxed text-white/55 mb-5">
                    {selected.description}
                  </p>

                  {/* Prompt section */}
                  <div className="border-t border-white/[0.06] pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={() => setShowPrompt(!showPrompt)}
                        className="text-xs font-medium text-white/40 hover:text-white/60 transition-colors"
                      >
                        {showPrompt ? 'Hide generation prompt' : 'Show generation prompt'}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyPrompt(selected.prompt)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-3 py-1.5 text-xs font-medium text-[#00bcd4] transition-all hover:bg-[#00bcd4]/20"
                      >
                        {copied ? (
                          <>
                            <PhCheck size={14} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <PhCopy size={14} />
                            Copy Prompt
                          </>
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showPrompt && (
                        <m.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                            <p className="text-xs leading-relaxed text-white/50 font-mono whitespace-pre-wrap">
                              {selected.prompt}
                            </p>
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <div className="mx-auto max-w-5xl px-6 pb-20">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <PhSparkle size={28} weight="fill" className="mx-auto mb-3 text-[#ffd700]/50" />
            <p className="text-sm text-white/40 mb-2">
              Each companion was generated with detailed prompts capturing the spirit of its element and gate.
            </p>
            <p className="text-xs text-white/25 mb-5">
              Click any image above and use &quot;Copy Prompt&quot; to create your own luminor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={copyTemplate}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-white/50 transition-all hover:bg-white/[0.06] flex items-center gap-2"
              >
                <PhCopy size={16} />
                Copy Base Template
              </button>
              <Link
                href="/companions/forge"
                className="rounded-lg border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-5 py-2.5 text-sm text-[#00bcd4] transition-all hover:bg-[#00bcd4]/20"
              >
                Forge Your Own
              </Link>
              <Link
                href="/gallery"
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-white/50 transition-all hover:bg-white/[0.06]"
              >
                Back to Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
