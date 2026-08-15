/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { PromptInput } from '@/components/imagine/PromptInput';
import { ImageCard } from '@/components/imagine/ImageCard';
import { getFavorites, removeFavorite, getFavoriteCount, type FavoriteImage } from '@/lib/imagine-favorites';
import { Heart, X, Trash, Download } from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Featured Templates — Arcanean style presets as clickable cards (like Grok)
// ---------------------------------------------------------------------------

const FEATURED_TEMPLATES = [
  { id: 'guardian-portrait', label: 'Guardian Portrait', prompt: 'Divine Arcanean Guardian with cosmic aura, gold accents on sacred armor, glowing elemental energy, mythic portrait' },
  { id: 'godbeast', label: 'Godbeast Summon', prompt: 'Majestic Arcanean Godbeast emerging from elemental energy, divine creature, crystalline scales, cosmic backdrop, mythic scale' },
  { id: 'gate-vision', label: 'Gate Vision', prompt: 'Deep space nebula scene with cosmic dust, vibrant violet and teal colors, infinite scale, volumetric god-rays, sacred geometry' },
  { id: 'eldrian-ruins', label: 'Eldrian Ruins', prompt: 'Professional concept art of ancient magical ruins, bold shapes, clear silhouettes, painterly finish, environmental storytelling, forgotten civilization' },
  { id: 'anime', label: 'Anime', prompt: 'Beautiful anime character illustration, studio quality, expressive eyes, dynamic pose, vibrant colors' },
  { id: 'portrait', label: 'Portrait', prompt: 'Cinematic portrait with dramatic lighting, shallow depth of field, Hasselblad quality, natural skin textures' },
  { id: '3d-render', label: '3D Render', prompt: 'Ultra-detailed 3D render, subsurface scattering, ray-traced reflections, studio lighting, octane render quality' },
  { id: 'starweave', label: 'Starweave Vista', prompt: 'Vast cosmic landscape, aurora-streaked sky over crystalline mountains, teal and gold palette, mythic fantasy environment, breathtaking scale' },
  { id: 'cyberpunk', label: 'Cyberpunk', prompt: 'Cyberpunk street at night, neon reflections on rain-soaked pavement, holographic advertisements, cinematic composition' },
  { id: 'watercolor', label: 'Watercolor', prompt: 'Delicate watercolor painting, soft washes of color, wet-on-wet technique, gentle palette, fine detail work' },
  { id: 'chibi', label: 'Chibi', prompt: 'Adorable chibi character, cute proportions, big expressive eyes, colorful, kawaii style illustration' },
  { id: 'cinematic', label: 'Cinematic', prompt: 'Cinematic film still, anamorphic widescreen, professional color grading, dramatic lighting, decisive moment' },
] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  data?: string;
  mimeType?: string;
}

interface GenerationRow {
  id: string;
  images: GeneratedImage[];
  prompt: string;
  aspectRatio: string;
  createdAt: string;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ImaginePage() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<GenerationRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentAspectRatio, setCurrentAspectRatio] = useState('1:1');
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [externalPrompt, setExternalPrompt] = useState('');
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number; estimatedSecondsLeft?: number } | null>(null);
  const generationTimesRef = useRef<number[]>([]);

  // Favorites
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteImage[]>([]);
  const [favCount, setFavCount] = useState(0);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const generationCounterRef = useRef(0);
  const isGeneratingRef = useRef(false);

  // Refs for style/model/enhance/negative persistence across scroll generations
  const currentStyleRef = useRef<string | undefined>(undefined);
  const currentModelRef = useRef<string | undefined>(undefined);
  const currentEnhanceRef = useRef<boolean | undefined>(undefined);
  const currentNegativePromptRef = useRef<string | undefined>(undefined);

  useEffect(() => { setFavCount(getFavoriteCount()); }, []);

  // Prompt handoff from homepage showcase card (?prompt=...)
  const promptConsumed = useRef(false);
  useEffect(() => {
    if (promptConsumed.current) return;
    const prompt = searchParams.get('prompt');
    if (prompt && prompt.trim()) {
      promptConsumed.current = true;
      setExternalPrompt(prompt.trim());
      window.history.replaceState(null, '', '/imagine');
    }
  }, [searchParams]);

  const refreshFavorites = useCallback(() => {
    setFavorites(getFavorites());
    setFavCount(getFavoriteCount());
  }, []);

  // Generate a single row of images
  const generateRow = useCallback(async (prompt: string, aspectRatio: string, rowId?: string, style?: string, model?: string, enhance?: boolean): Promise<GenerationRow | null> => {
    const id = rowId || `row_${Date.now()}_${generationCounterRef.current++}`;
    const res = await fetch('/api/imagine/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, count: 4, aspectRatio, style, model, enhance }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Generation failed');
    }
    const data = await res.json();
    const images: GeneratedImage[] = (data.images || []).map((img: { url?: string; data?: string; mimeType?: string; prompt?: string }, i: number) => ({
      id: `${id}_img_${i}`,
      url: img.url || (img.data ? `data:${img.mimeType || 'image/png'};base64,${img.data}` : ''),
      prompt: img.prompt || prompt,
      data: img.data,
      mimeType: img.mimeType,
    }));
    return { id, images, prompt, aspectRatio, createdAt: new Date().toISOString() };
  }, []);

  // Main generation handler
  const handleGenerate = useCallback(async (prompt: string, _count: number, aspectRatio: string, style?: string, model?: string, enhance?: boolean, negativePrompt?: string) => {
    if (isGeneratingRef.current) return;
    currentStyleRef.current = style;
    currentModelRef.current = model;
    currentEnhanceRef.current = enhance;
    currentNegativePromptRef.current = negativePrompt;

    setIsGenerating(true);
    isGeneratingRef.current = true;
    setError(null);
    setCurrentPrompt(prompt);
    setCurrentAspectRatio(aspectRatio);

    // Progress tracking
    const avgTime = generationTimesRef.current.length > 0
      ? generationTimesRef.current.reduce((a, b) => a + b, 0) / generationTimesRef.current.length
      : 12000;
    setGenerationProgress({ current: 1, total: 4, estimatedSecondsLeft: Math.round(avgTime / 1000) });
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (!prev || prev.current >= prev.total) return prev;
        return { ...prev, current: Math.min(prev.current + 1, prev.total), estimatedSecondsLeft: Math.max(0, Math.round((prev.estimatedSecondsLeft ?? 0) - 3)) };
      });
    }, 3000);

    const loadingId = `row_${Date.now()}_loading`;
    setRows((prev) => [{ id: loadingId, images: [], prompt, aspectRatio, createdAt: new Date().toISOString(), isLoading: true }, ...prev]);

    const startTime = Date.now();
    try {
      const fullPrompt = negativePrompt ? `${prompt}. Avoid: ${negativePrompt}` : prompt;
      const row = await generateRow(fullPrompt, aspectRatio, loadingId, style, model, enhance);
      if (row) {
        row.prompt = prompt;
        row.images = row.images.map((img) => ({ ...img, prompt }));
        setRows((prev) => prev.map((r) => r.id === loadingId ? row : r));
        setAutoScrollEnabled(true);
        generationTimesRef.current.push(Date.now() - startTime);
        if (generationTimesRef.current.length > 5) generationTimesRef.current.shift();
        requestAnimationFrame(() => {
          gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setRows((prev) => prev.filter((r) => r.id !== loadingId));
    } finally {
      clearInterval(progressInterval);
      setGenerationProgress(null);
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  }, [generateRow]);

  // Infinite scroll generation
  const generateMoreRows = useCallback(async () => {
    if (isGeneratingRef.current || !currentPrompt || !autoScrollEnabled) return;
    setIsGenerating(true);
    isGeneratingRef.current = true;
    const loadingId = `row_${Date.now()}_scroll`;
    setRows((prev) => [...prev, { id: loadingId, images: [], prompt: currentPrompt, aspectRatio: currentAspectRatio, createdAt: new Date().toISOString(), isLoading: true }]);
    try {
      const neg = currentNegativePromptRef.current;
      const fullPrompt = neg ? `${currentPrompt}. Avoid: ${neg}` : currentPrompt;
      const row = await generateRow(fullPrompt, currentAspectRatio, loadingId, currentStyleRef.current, currentModelRef.current, currentEnhanceRef.current);
      if (row) {
        row.prompt = currentPrompt;
        row.images = row.images.map((img) => ({ ...img, prompt: currentPrompt }));
        setRows((prev) => prev.map((r) => r.id === loadingId ? row : r));
      }
    } catch {
      setRows((prev) => prev.filter((r) => r.id !== loadingId));
      setAutoScrollEnabled(false);
    } finally {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  }, [currentPrompt, currentAspectRatio, autoScrollEnabled, generateRow]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!autoScrollEnabled) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !isGeneratingRef.current) generateMoreRows(); },
      { rootMargin: '400px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [autoScrollEnabled, generateMoreRows]);

  // Handle template click
  const handleTemplateClick = useCallback((templatePrompt: string) => {
    setExternalPrompt(templatePrompt);
  }, []);

  // Handle animation
  const handleAnimate = useCallback(async (imageId: string, imageUrl: string) => {
    setAnimatingIds((prev) => new Set(prev).add(imageId));
    setError(null);
    try {
      let urlForAnimation = imageUrl;
      if (imageUrl.startsWith('data:')) {
        const [header, data] = imageUrl.split(',');
        const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/png';
        const saveRes = await fetch('/api/imagine/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageData: data, mimeType, prompt: 'animation source' }) });
        if (saveRes.ok) { const saveData = await saveRes.json(); if (saveData.url) urlForAnimation = saveData.url; }
      }
      const res = await fetch('/api/imagine/animate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: urlForAnimation }) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Animation failed'); }
      const data = await res.json();
      if (data.videoUrl) {
        setRows((prev) => prev.map((row) => ({ ...row, images: row.images.map((img) => img.id === imageId ? { ...img, videoUrl: data.videoUrl } : img) })));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Animation failed');
    } finally {
      setAnimatingIds((prev) => { const next = new Set(prev); next.delete(imageId); return next; });
    }
  }, []);

  // Vary: pre-fill prompt
  const handleVary = useCallback((originalPrompt: string) => {
    setExternalPrompt(originalPrompt + ' \u2014 variation');
  }, []);

  const totalImages = rows.reduce((sum, r) => sum + r.images.length, 0);
  const hasResults = rows.length > 0;

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] pb-40">
      {/* ═══ Navigation ═══ */}
      <div className="fixed top-[72px] left-1/2 -translate-x-1/2 z-40">
        <nav className="flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl">
          <Link href="/chat" className="px-4 py-1.5 text-sm font-medium rounded-lg text-white/40 hover:text-white/60 transition-all">
            Chat
          </Link>
          <Link href="/imagine" className="relative px-4 py-1.5 text-sm font-medium rounded-lg text-white">
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/15 to-[var(--arc-brand-cosmic-blue)]/15 border border-[var(--arc-brand-atlantean-teal)]/20" />
            <span className="relative">Imagine</span>
          </Link>
        </nav>
      </div>

      {/* ═══ Hero + Templates (empty state) ═══ */}
      {!hasResults && (
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative pt-20 pb-2 px-4"
        >
          {/* Ambient background orbs */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
            <div className="absolute rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.07] w-[500px] h-[500px] left-[20%] top-[-10%] blur-[160px]" />
            <div className="absolute rounded-full bg-[var(--arc-brand-cosmic-blue)]/[0.05] w-[400px] h-[400px] right-[10%] top-[30%] blur-[140px]" />
            <div className="absolute rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.03] w-[300px] h-[300px] left-[60%] top-[60%] blur-[120px]" />
          </div>
          {/* Dot grid texture */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
            aria-hidden
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Headline */}
          <div className="text-center mb-8">
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3">
              Visual AI
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-[-0.03em] leading-tight mb-3">
              <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">
                Turn words into images
              </span>
            </h1>
            <p className="text-sm text-white/35 max-w-xs mx-auto leading-relaxed">
              Four images per generation. Pick a style or write your own prompt.
            </p>
          </div>

          {/* Style cards */}
          <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/25 mb-3 px-1">
            Styles
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
            {FEATURED_TEMPLATES.map((template, i) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template.prompt)}
                className="flex-shrink-0 group"
                aria-label={`Use ${template.label} style`}
              >
                <div className="w-[140px] h-[100px] rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[var(--arc-brand-atlantean-teal)]/25 hover:bg-white/[0.05] transition-all duration-200 overflow-hidden relative">
                  <div
                    className="absolute inset-0 opacity-25 group-hover:opacity-45 transition-opacity duration-200"
                    style={{
                      background: `linear-gradient(${135 + i * 25}deg, ${
                        ['var(--arc-brand-atlantean-teal)', 'var(--arc-brand-cosmic-blue)', 'var(--arc-void)', 'var(--arc-void)', 'var(--arc-brand-arcanean-gold)', 'var(--arc-wind)', 'var(--arc-void)', 'var(--arc-fire)', 'var(--arc-void)', 'var(--arc-brand-atlantean-teal)', 'var(--arc-text-primary)', 'var(--arc-brand-arcanean-gold)'][i]
                      }18, transparent 65%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-end p-3">
                    <span className="text-xs font-semibold text-white/60 group-hover:text-white/90 transition-colors leading-tight font-display">
                      {template.label}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mx-1 mt-1 h-px bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/15 via-[var(--arc-brand-atlantean-teal)]/10 to-transparent" />
        </m.div>
      )}

      {/* ═══ Stats bar (when generating) ═══ */}
      {hasResults && (
        <div className="sticky top-0 z-30 bg-[var(--arc-cosmic-void)]/80 backdrop-blur-xl border-b border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50 font-medium">
                {totalImages} image{totalImages !== 1 ? 's' : ''} created
              </span>
            </div>
            <div className="flex items-center gap-2">
              {autoScrollEnabled && (
                <button onClick={() => setAutoScrollEnabled(false)} className="text-xs text-white/30 hover:text-white/60 px-3 py-2 min-h-[44px] rounded-lg hover:bg-white/[0.04] transition-colors">
                  Stop auto-generate
                </button>
              )}
              {!autoScrollEnabled && currentPrompt && (
                <button onClick={() => setAutoScrollEnabled(true)} className="text-xs text-[var(--arc-brand-atlantean-teal)]/70 hover:text-[var(--arc-brand-atlantean-teal)] px-3 py-2 min-h-[44px] rounded-lg hover:bg-[var(--arc-brand-atlantean-teal)]/10 transition-colors">
                  Resume
                </button>
              )}
              <button
                onClick={() => { refreshFavorites(); setShowFavorites(true); }}
                className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs text-pink-300/60 hover:text-pink-300 hover:bg-pink-500/10 transition-colors"
              >
                <Heart size={12} weight="fill" className="text-pink-400" />
                {favCount > 0 && favCount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Error display ═══ */}
      <AnimatePresence>
        {error && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto px-4 py-3 mt-2"
          >
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm text-red-300 flex items-center justify-between backdrop-blur-sm">
              <span className="truncate">{error}</span>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                {currentPrompt && (
                  <button
                    onClick={() => { setError(null); handleGenerate(currentPrompt, 4, currentAspectRatio); }}
                    className="px-3 py-1 text-xs rounded-lg bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/20 hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors"
                  >
                    Retry
                  </button>
                )}
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 p-1">
                  <X size={14} />
                </button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* ═══ Discover Section Header ═══ */}
      {!hasResults && (
        <div className="px-6 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/25">Discover</h2>
            <button
              onClick={() => { refreshFavorites(); setShowFavorites(true); }}
              className="flex items-center gap-1.5 text-xs text-pink-300/40 hover:text-pink-300 transition-colors"
            >
              <Heart size={11} />
              {favCount > 0 ? `${favCount} Saved` : 'Favorites'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ Image Grid ═══ */}
      <div ref={gridTopRef} className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Loading skeletons */}
        {rows.filter((r) => r.isLoading).map((row) => (
          <div key={row.id} className="mb-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-lg border border-white/[0.04] relative overflow-hidden ${
                    row.aspectRatio === '16:9' ? 'aspect-video' :
                    row.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                    row.aspectRatio === '4:3' ? 'aspect-[4/3]' :
                    row.aspectRatio === '3:4' ? 'aspect-[3/4]' :
                    'aspect-square'
                  }`}
                >
                  <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
                  <div className="absolute inset-0 shimmer opacity-40" style={{ animationDelay: `${i * 0.3}s` }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/[0.02] to-[var(--arc-brand-cosmic-blue)]/[0.02] animate-pulse" style={{ animationDuration: '2.5s' }} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Masonry grid of generated images */}
        {rows.some((r) => !r.isLoading && r.images.length > 0) && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2">
            {rows.filter((r) => !r.isLoading && r.images.length > 0).flatMap((row) =>
              row.images.map((img, i) => (
                <div key={img.id} className="break-inside-avoid mb-2">
                  <ImageCard
                    id={img.id}
                    src={img.url}
                    prompt={img.prompt}
                    data={img.data}
                    mimeType={img.mimeType}
                    aspectRatio={row.aspectRatio}
                    index={i}
                    onAnimate={handleAnimate}
                    onVary={handleVary}
                    onFavoriteChange={refreshFavorites}
                    isAnimating={animatingIds.has(img.id)}
                  />
                </div>
              )),
            )}
          </div>
        )}

        {autoScrollEnabled && <div ref={sentinelRef} className="h-px" />}

        {hasResults && !autoScrollEnabled && !isGenerating && currentPrompt && (
          <div className="text-center py-6">
            <button
              onClick={() => generateMoreRows()}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-white/[0.04] text-white/50 hover:text-white/80 hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.1] transition-all"
            >
              Generate more
            </button>
          </div>
        )}
      </div>

      {/* ═══ Empty state hint ═══ */}
      {!hasResults && !isGenerating && (
        <div className="text-center py-6 px-6">
          <p className="text-white/15 text-xs tracking-wide">Describe what you see in the prompt below</p>
        </div>
      )}

      {/* ═══ Floating Prompt Input (Grok-style bottom bar) ═══ */}
      <PromptInput
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        hasResults={hasResults}
        externalPrompt={externalPrompt}
        generationProgress={generationProgress}
      />

      {/* ═══ Favorites Drawer ═══ */}
      <AnimatePresence>
        {showFavorites && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowFavorites(false)}
            />
            <m.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-[var(--arc-cosmic-void)]/95 backdrop-blur-xl border-l border-white/[0.08] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Heart size={18} weight="fill" className="text-pink-400" />
                  <h2 className="text-base font-semibold text-white/90">Favorites</h2>
                  {favorites.length > 0 && <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">{favorites.length}</span>}
                </div>
                <button onClick={() => setShowFavorites(false)} className="p-2 rounded-xl hover:bg-white/[0.06] transition-all text-white/40 hover:text-white/80">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <p className="text-white/30 text-sm mb-1">No favorites yet</p>
                    <p className="text-xs text-white/15 max-w-[240px]">Heart images you love and they&apos;ll be saved here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {favorites.map((fav) => (
                      <m.div key={fav.id} layout className="group relative rounded-xl overflow-hidden">
                        <Image src={fav.blobUrl} alt={fav.prompt} width={200} height={200} className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2.5">
                            <p className="text-[10px] text-white/60 line-clamp-2 mb-2">{fav.prompt}</p>
                            <div className="flex gap-1.5">
                              <button onClick={() => { removeFavorite(fav.id); refreshFavorites(); }} className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400" title="Remove">
                                <Trash size={12} />
                              </button>
                              <a href={fav.blobUrl} download={`arcanea-fav-${fav.id}.png`} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white" title="Download" onClick={(e) => e.stopPropagation()}>
                                <Download size={12} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </m.div>
                    ))}
                  </div>
                )}
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
    </LazyMotion>
  );
}
