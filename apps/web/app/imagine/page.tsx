'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { m, AnimatePresence, LazyMotion, domMax } from 'framer-motion';
import { PromptInput } from '@/components/imagine/PromptInput';
import { ImageCard } from '@/components/imagine/ImageCard';
import { getFavorites, removeFavorite, getFavoriteCount, type FavoriteImage } from '@/lib/imagine-favorites';

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

export default function ImaginePage() {
  const [rows, setRows] = useState<GenerationRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentAspectRatio, setCurrentAspectRatio] = useState('1:1');
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  // Favorites state
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteImage[]>([]);
  const [favCount, setFavCount] = useState(0);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const generationCounterRef = useRef(0);
  const isGeneratingRef = useRef(false);

  // Load favorites count on mount
  useEffect(() => {
    setFavCount(getFavoriteCount());
  }, []);

  const refreshFavorites = useCallback(() => {
    setFavorites(getFavorites());
    setFavCount(getFavoriteCount());
  }, []);

  const handleOpenFavorites = useCallback(() => {
    refreshFavorites();
    setShowFavorites(true);
  }, [refreshFavorites]);

  const handleRemoveFavorite = useCallback((id: string) => {
    removeFavorite(id);
    refreshFavorites();
  }, [refreshFavorites]);

  // Generate a single row of images
  const generateRow = useCallback(async (prompt: string, aspectRatio: string, rowId?: string): Promise<GenerationRow | null> => {
    const id = rowId || `row_${Date.now()}_${generationCounterRef.current++}`;

    const res = await fetch('/api/imagine/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, count: 4, aspectRatio }),
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

    return {
      id,
      images,
      prompt,
      aspectRatio,
      createdAt: new Date().toISOString(),
    };
  }, []);

  // Handle initial generation from prompt input
  const handleGenerate = useCallback(async (prompt: string, _count: number, aspectRatio: string) => {
    if (isGeneratingRef.current) return;

    setIsGenerating(true);
    isGeneratingRef.current = true;
    setError(null);
    setCurrentPrompt(prompt);
    setCurrentAspectRatio(aspectRatio);

    const loadingId = `row_${Date.now()}_loading`;
    setRows((prev) => [{
      id: loadingId,
      images: [],
      prompt,
      aspectRatio,
      createdAt: new Date().toISOString(),
      isLoading: true,
    }, ...prev]);

    try {
      const row = await generateRow(prompt, aspectRatio, loadingId);
      if (row) {
        setRows((prev) => prev.map((r) => r.id === loadingId ? row : r));
        setAutoScrollEnabled(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setRows((prev) => prev.filter((r) => r.id !== loadingId));
    } finally {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  }, [generateRow]);

  // Infinite scroll
  const generateMoreRows = useCallback(async () => {
    if (isGeneratingRef.current || !currentPrompt || !autoScrollEnabled) return;

    setIsGenerating(true);
    isGeneratingRef.current = true;

    const loadingId = `row_${Date.now()}_scroll`;
    setRows((prev) => [...prev, {
      id: loadingId,
      images: [],
      prompt: currentPrompt,
      aspectRatio: currentAspectRatio,
      createdAt: new Date().toISOString(),
      isLoading: true,
    }]);

    try {
      const row = await generateRow(currentPrompt, currentAspectRatio, loadingId);
      if (row) {
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

  // IntersectionObserver
  useEffect(() => {
    if (!autoScrollEnabled) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isGeneratingRef.current) {
          generateMoreRows();
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [autoScrollEnabled, generateMoreRows]);

  // Handle animation
  const handleAnimate = useCallback(async (imageId: string, imageUrl: string) => {
    setAnimatingIds((prev) => new Set(prev).add(imageId));
    setError(null);

    try {
      let urlForAnimation = imageUrl;

      if (imageUrl.startsWith('data:')) {
        const [header, data] = imageUrl.split(',');
        const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/png';
        const saveRes = await fetch('/api/imagine/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: data, mimeType, prompt: 'animation source' }),
        });
        if (saveRes.ok) {
          const saveData = await saveRes.json();
          if (saveData.url) urlForAnimation = saveData.url;
        }
      }

      const res = await fetch('/api/imagine/animate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: urlForAnimation }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Animation failed');
      }

      const data = await res.json();

      if (data.videoUrl) {
        setRows((prev) =>
          prev.map((row) => ({
            ...row,
            images: row.images.map((img) =>
              img.id === imageId ? { ...img, videoUrl: data.videoUrl } : img,
            ),
          })),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Animation failed');
    } finally {
      setAnimatingIds((prev) => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
    }
  }, []);

  const totalImages = rows.reduce((sum, r) => sum + r.images.length, 0);
  const hasResults = rows.length > 0;

  return (
    <LazyMotion features={domMax}>
    <div className="min-h-screen bg-[#09090b]">
      {/* Hero — only visible when no results */}
      <AnimatePresence>
        {!hasResults && (
          <m.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="pt-20 pb-6 px-6 text-center"
          >
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-display font-bold bg-gradient-to-r from-[#00bcd4] via-[#0d47a1] to-[#00bcd4] bg-clip-text text-transparent"
            >
              Imagine
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 text-lg text-text-secondary font-body"
            >
              Describe your vision. Watch it materialize.
            </m.p>
          </m.div>
        )}
      </AnimatePresence>

      {/* Stats bar — when results exist */}
      {hasResults && (
        <div className="sticky top-0 z-30 border-b border-white/[0.06] liquid-glass">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-display font-semibold text-text-primary">Imagine</h1>
              <span className="text-xs text-text-muted bg-white/[0.04] px-2.5 py-1 rounded-full">
                {totalImages} image{totalImages !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {autoScrollEnabled && (
                <button
                  onClick={() => setAutoScrollEnabled(false)}
                  className="text-xs text-text-muted hover:text-text-secondary px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  Stop auto-generate
                </button>
              )}
              {!autoScrollEnabled && currentPrompt && (
                <button
                  onClick={() => setAutoScrollEnabled(true)}
                  className="text-xs text-[#00bcd4] hover:text-[#00acc1] px-3 py-1.5 rounded-lg hover:bg-[#00bcd4]/10 transition-all"
                >
                  Resume infinite scroll
                </button>
              )}
              {/* Favorites button */}
              <button
                onClick={handleOpenFavorites}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all text-pink-300 hover:bg-pink-500/10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f472b6" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Favorites
                {favCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-pink-500/20 rounded-full">
                    {favCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites button in empty state */}
      {!hasResults && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleOpenFavorites}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-pink-300/80 hover:text-pink-300 hover:bg-pink-500/5 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favCount > 0 ? `${favCount} Favorite${favCount !== 1 ? 's' : ''}` : 'Favorites'}
          </button>
        </div>
      )}

      {/* Prompt input */}
      <div className={hasResults ? '' : 'px-6 pb-8 pt-2'}>
        <PromptInput
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          hasResults={hasResults}
        />
      </div>

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto px-6 mb-6"
          >
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm text-red-300 flex items-center justify-between backdrop-blur-sm">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-3 p-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Image grid */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${hasResults ? 'pt-4 pb-32' : ''}`}>
        {rows.map((row) => (
          <div key={row.id} className="mb-6">
            {row.isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border border-white/[0.04] relative overflow-hidden ${
                      row.aspectRatio === '16:9' ? 'aspect-video' :
                      row.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                      row.aspectRatio === '4:3' ? 'aspect-[4/3]' :
                      row.aspectRatio === '3:4' ? 'aspect-[3/4]' :
                      'aspect-square'
                    }`}
                  >
                    {/* Shimmer gradient skeleton */}
                    <div className="absolute inset-0 bg-cosmic-surface/60" />
                    <div className="absolute inset-0 shimmer opacity-40" style={{ animationDelay: `${i * 0.2}s` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="relative w-10 h-10">
                          <div className="absolute inset-0 border-2 border-[#00bcd4]/20 rounded-full" />
                          <div className="absolute inset-0 border-2 border-transparent border-t-[#00bcd4] rounded-full animate-spin" />
                        </div>
                        <span className="text-[11px] text-text-muted/70 font-body">Creating...</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!row.isLoading && row.images.length > 0 && (
              <div className={`grid gap-3 ${
                row.images.length === 1
                  ? 'grid-cols-1 max-w-lg mx-auto'
                  : row.images.length === 2
                    ? 'grid-cols-2 max-w-2xl mx-auto'
                    : 'grid-cols-2 md:grid-cols-4'
              }`}>
                {row.images.map((img, i) => (
                  <ImageCard
                    key={img.id}
                    id={img.id}
                    src={img.url}
                    prompt={img.prompt}
                    data={img.data}
                    mimeType={img.mimeType}
                    aspectRatio={row.aspectRatio}
                    index={i}
                    onAnimate={handleAnimate}
                    onFavoriteChange={refreshFavorites}
                    isAnimating={animatingIds.has(img.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {autoScrollEnabled && <div ref={sentinelRef} className="h-px" />}

        {hasResults && !autoScrollEnabled && !isGenerating && currentPrompt && (
          <div className="text-center py-8">
            <button
              onClick={() => generateMoreRows()}
              className="px-6 py-3 rounded-2xl text-sm font-medium bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              Generate more variations
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!hasResults && !isGenerating && (
        <div className="text-center py-12 px-6">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-[#00bcd4]/10 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(262, 83%, 66%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-text-secondary font-body text-lg mb-1">Your imagination awaits</p>
            <p className="text-text-muted text-sm">Enter a prompt above to begin creating</p>
          </div>
        </div>
      )}

      {/* Favorites drawer */}
      <AnimatePresence>
        {showFavorites && (
          <>
            {/* Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowFavorites(false)}
            />

            {/* Drawer */}
            <m.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg glass-strong border-l border-white/[0.08] flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#f472b6" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <h2 className="text-lg font-display font-semibold text-text-primary">Favorites</h2>
                  {favorites.length > 0 && (
                    <span className="text-xs text-text-muted bg-white/[0.04] px-2 py-0.5 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="p-2 rounded-xl hover:bg-white/[0.06] transition-all text-text-muted hover:text-text-primary"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto p-4">
                {favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(330, 80%, 60%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <p className="text-text-secondary font-body mb-1">No favorites yet</p>
                    <p className="text-xs text-text-muted max-w-[240px]">
                      Heart images you love and they&apos;ll be saved here permanently
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {favorites.map((fav) => (
                      <m.div
                        key={fav.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative rounded-xl overflow-hidden"
                      >
                        <img
                          src={fav.blobUrl}
                          alt={fav.prompt}
                          className="w-full aspect-square object-cover"
                          loading="lazy"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-[10px] text-white/60 line-clamp-2 mb-2">{fav.prompt}</p>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleRemoveFavorite(fav.id)}
                                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all"
                                title="Remove from favorites"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                </svg>
                              </button>
                              <a
                                href={fav.blobUrl}
                                download={`arcanea-fav-${fav.id}.png`}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                                title="Download"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] text-white/50 bg-black/40 backdrop-blur-sm">
                          {new Date(fav.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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
