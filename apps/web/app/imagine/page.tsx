'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInput } from '@/components/imagine/PromptInput';
import { ImageCard } from '@/components/imagine/ImageCard';

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

  const sentinelRef = useRef<HTMLDivElement>(null);
  const generationCounterRef = useRef(0);
  const isGeneratingRef = useRef(false);

  // Generate a single row of images
  const generateRow = useCallback(async (prompt: string, aspectRatio: string, rowId?: string): Promise<GenerationRow | null> => {
    const id = rowId || `row_${Date.now()}_${generationCounterRef.current++}`;

    try {
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
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  }, []);

  // Handle initial generation from prompt input
  const handleGenerate = useCallback(async (prompt: string, _count: number, aspectRatio: string) => {
    if (isGeneratingRef.current) return;

    setIsGenerating(true);
    isGeneratingRef.current = true;
    setError(null);
    setCurrentPrompt(prompt);
    setCurrentAspectRatio(aspectRatio);

    // Add loading placeholder row
    const loadingId = `row_${Date.now()}_loading`;
    setRows((prev) => [{
      id: loadingId,
      images: [],
      prompt,
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

  // Infinite scroll — generate more rows with same prompt
  const generateMoreRows = useCallback(async () => {
    if (isGeneratingRef.current || !currentPrompt || !autoScrollEnabled) return;

    setIsGenerating(true);
    isGeneratingRef.current = true;

    const loadingId = `row_${Date.now()}_scroll`;
    setRows((prev) => [...prev, {
      id: loadingId,
      images: [],
      prompt: currentPrompt,
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

  // IntersectionObserver for infinite scroll
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

      // For base64 images, save first to get a URL
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
    <div className="min-h-screen bg-cosmic-deep">
      {/* Hero — only visible when no results */}
      <AnimatePresence>
        {!hasResults && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="pt-20 pb-6 px-6 text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-display font-bold bg-gradient-to-r from-violet-400 via-fuchsia-300 to-violet-400 bg-clip-text text-transparent"
            >
              Imagine
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 text-lg text-text-secondary font-body"
            >
              Describe your vision. Watch it materialize.
            </motion.p>
          </motion.div>
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
                  className="text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg hover:bg-violet-500/10 transition-all"
                >
                  Resume infinite scroll
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prompt input — floating when results exist, inline when empty */}
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto px-6 mb-6"
          >
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm text-red-300 flex items-center justify-between backdrop-blur-sm">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 ml-3 p-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image grid — the infinite scroll river */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${hasResults ? 'pt-4 pb-32' : ''}`}>
        {rows.map((row) => (
          <div key={row.id} className="mb-6">
            {/* Row — loading skeleton */}
            {row.isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-cosmic-surface/60 animate-pulse border border-white/[0.04] flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      <span className="text-xs text-text-muted">Imagining...</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Row — actual images */}
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
                    index={i}
                    onAnimate={handleAnimate}
                    isAnimating={animatingIds.has(img.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Infinite scroll sentinel */}
        {autoScrollEnabled && (
          <div ref={sentinelRef} className="h-px" />
        )}

        {/* Manual "Load more" when auto-scroll is off but we have results */}
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
            <div className="w-20 h-20 rounded-3xl bg-violet-600/10 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(262, 83%, 66%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-text-secondary font-body text-lg mb-1">
              Your imagination awaits
            </p>
            <p className="text-text-muted text-sm">
              Enter a prompt above to begin creating
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
