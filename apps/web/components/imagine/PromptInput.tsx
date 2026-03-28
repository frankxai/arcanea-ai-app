'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1' },
  { id: '16:9', label: '16:9' },
  { id: '9:16', label: '9:16' },
  { id: '4:3', label: '4:3' },
  { id: '3:4', label: '3:4' },
] as const;

const STYLE_PRESETS = [
  { id: 'none', label: 'None' },
  { id: 'arcanean-fantasy', label: 'Arcanean' },
  { id: 'photorealistic', label: 'Photo' },
  { id: 'anime', label: 'Anime' },
  { id: 'guardian-portrait', label: 'Guardian' },
  { id: 'concept-art', label: 'Concept' },
  { id: 'cosmic-void', label: 'Cosmic' },
  { id: 'cinematic', label: 'Cinema' },
  { id: 'forge-fire', label: 'Forge' },
  { id: 'tide-crystal', label: 'Tide' },
  { id: 'ink-wash', label: 'Ink' },
] as const;

const STYLE_CHIPS = [
  'Cinematic',
  'Anime',
  'Oil Painting',
  '3D Render',
  'Photograph',
  'Concept Art',
  'Watercolor',
  'Pixel Art',
] as const;

const HISTORY_KEY = 'arcanea-imagine-history';
const HISTORY_MAX = 30;

function loadHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as string[]).slice(0, HISTORY_MAX) : [];
  } catch {
    return [];
  }
}

function saveToHistory(prompt: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = loadHistory().filter((p) => p !== prompt);
    history.unshift(prompt);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_MAX)));
  } catch {
    // localStorage quota or disabled — silently ignore
  }
}

const QUICK_PROMPTS = [
  'A cosmic library floating in nebula clouds, ancient knowledge glowing with starlight',
  'Crystal dragon emerging from volcanic glass, iridescent scales catching moonlight',
  'Bioluminescent underwater city at twilight, coral spires reaching toward the surface',
  'Samurai standing in a field of cherry blossoms, cinematic golden hour lighting',
  'Futuristic Tokyo street at night, neon reflections on rain-soaked pavement',
  'Ancient tree of knowledge with glowing runes carved into bark, fireflies dancing',
];

interface AplFeedback {
  qualityBefore: number;
  qualityAfter: number;
  spark: string | null;
  palette: string | null;
}

interface PromptInputProps {
  onGenerate: (prompt: string, count: number, aspectRatio: string, style?: string) => void;
  isGenerating: boolean;
  hasResults: boolean;
}

export function PromptInput({ onGenerate, isGenerating, hasResults }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('none');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aplFeedback, setAplFeedback] = useState<AplFeedback | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Close history dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleStyleChip = useCallback((chipLabel: string) => {
    const suffix = `, ${chipLabel.toLowerCase()} style`;
    setPrompt((prev) => {
      // Avoid duplicate style suffixes
      if (prev.toLowerCase().includes(suffix)) return prev;
      return prev.trim() + suffix;
    });
    textareaRef.current?.focus();
  }, []);

  const handleHistorySelect = useCallback((item: string) => {
    setPrompt(item);
    setShowHistory(false);
    textareaRef.current?.focus();
  }, []);

  const buildPrompt = useCallback(() => {
    // Style application is now handled server-side by the Arcanean Style Engine.
    // We just return the raw prompt here; the style ID is passed separately.
    return prompt.trim();
  }, [prompt]);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;
    const finalPrompt = buildPrompt();
    saveToHistory(prompt.trim());
    setHistory(loadHistory());
    onGenerate(finalPrompt, 4, aspectRatio, style !== 'none' ? style : undefined);
    if (hasResults) setIsExpanded(false);
  }, [prompt, aspectRatio, style, isGenerating, onGenerate, hasResults, buildPrompt]);

  const handleEnhance = useCallback(async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    setAplFeedback(null);
    try {
      const res = await fetch('/api/apl/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), mode: 'image' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.enhanced) {
          setPrompt(data.enhanced);
          setAplFeedback({
            qualityBefore: data.qualityBefore ?? 0,
            qualityAfter: data.qualityAfter ?? 0,
            spark: data.spark ?? null,
            palette: data.palette ?? null,
          });
          // Auto-dismiss feedback after 6 seconds
          setTimeout(() => setAplFeedback(null), 6000);
        }
      } else {
        // Fall back to simpler enhance endpoint
        const fallbackRes = await fetch('/api/imagine/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt.trim() }),
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData.enhanced) setPrompt(fallbackData.enhanced);
        }
      }
    } catch {
      // Enhancement is optional — silently fail
    } finally {
      setIsEnhancing(false);
    }
  }, [prompt, isEnhancing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Collapsed compact bar
  if (hasResults && !isExpanded) {
    return (
      <m.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-2xl"
      >
        <button
          onClick={() => {
            setIsExpanded(true);
            setTimeout(() => textareaRef.current?.focus(), 100);
          }}
          className="w-full liquid-glass rounded-2xl px-6 py-4 flex items-center gap-4 hover:border-white/20 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">
            {prompt || 'Describe your next vision...'}
          </span>
          {isGenerating && (
            <div className="w-5 h-5 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin ml-auto flex-shrink-0" />
          )}
        </button>
      </m.div>
    );
  }

  return (
    <m.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={hasResults
        ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-2xl'
        : 'w-full max-w-2xl mx-auto'
      }
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600/20 via-fuchsia-500/15 to-violet-600/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

        <div className="relative liquid-glass rounded-3xl overflow-hidden">
          {/* Style chips */}
          <div className="flex items-center gap-1.5 px-4 sm:px-5 pt-3 pb-1 overflow-x-auto scrollbar-hide">
            {STYLE_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleStyleChip(chip)}
                className="flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all text-text-muted hover:text-text-secondary hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { setIsExpanded(true); if (history.length > 0) setShowHistory(true); }}
            onBlur={() => { /* history closes via outside click */ }}
            placeholder="Describe what you want to see..."
            rows={hasResults ? 2 : 3}
            className="w-full bg-transparent px-5 sm:px-6 pt-5 pb-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:ring-inset resize-none font-body text-lg sm:text-base leading-relaxed"
          />

          {/* Prompt history dropdown */}
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <m.div
                ref={historyRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="border-t border-white/[0.04] overflow-hidden"
              >
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-text-muted/60 font-medium">Recent</span>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-[10px] text-text-muted/40 hover:text-text-muted transition-colors"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-0.5 scrollbar-hide">
                    {history.slice(0, 10).map((item, i) => (
                      <button
                        key={`${item}-${i}`}
                        onClick={() => handleHistorySelect(item)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary hover:bg-white/[0.04] transition-all truncate"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Style preset pills */}
          <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 overflow-x-auto scrollbar-hide border-t border-white/[0.04]">
            {STYLE_PRESETS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  style === s.id
                    ? 'bg-[#00bcd4]/15 text-[#00bcd4] border border-[#00bcd4]/40 shadow-[0_0_8px_rgba(0,188,212,0.15)]'
                    : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04] border border-white/[0.06]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              {/* Aspect ratio pills */}
              <div className="flex gap-1">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      aspectRatio === ar.id
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>

              {/* Enhance with APL button */}
              <button
                onClick={handleEnhance}
                disabled={!prompt.trim() || isEnhancing || isGenerating}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-text-muted hover:text-violet-300 hover:bg-violet-500/10"
                title="Enhance prompt with APL (SPARK.SHAPE.SHARPEN)"
              >
                {isEnhancing ? (
                  <span className="w-3.5 h-3.5 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
                <span className="hidden sm:inline">Enhance with APL</span>
              </button>
            </div>

            {/* Generate button */}
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:shadow-[0_0_24px_rgba(13,71,161,0.4)] active:scale-95"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Imagining...
                </span>
              ) : (
                'Imagine'
              )}
            </button>
          </div>

          {/* APL enhancement feedback */}
          <AnimatePresence>
            {aplFeedback && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="border-t border-violet-500/20 overflow-hidden"
              >
                <div className="px-4 py-2.5 flex items-center gap-3 bg-violet-500/[0.04]">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-text-muted">Quality</span>
                    <span className="text-orange-300 font-mono">{aplFeedback.qualityBefore}%</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span className="text-emerald-400 font-mono font-semibold">{aplFeedback.qualityAfter}%</span>
                  </div>
                  {aplFeedback.palette && (
                    <span className="text-[10px] uppercase tracking-wider text-violet-300/60 bg-violet-500/10 px-2 py-0.5 rounded-full">
                      {aplFeedback.palette}
                    </span>
                  )}
                  {aplFeedback.spark && (
                    <span className="text-[11px] text-text-muted truncate max-w-[200px] hidden sm:inline" title={aplFeedback.spark}>
                      Spark: {aplFeedback.spark}
                    </span>
                  )}
                  <button
                    onClick={() => setAplFeedback(null)}
                    className="ml-auto p-1 rounded text-text-muted/50 hover:text-text-muted transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick suggestions — only show when no results yet */}
      {!hasResults && !prompt && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mt-4 justify-center px-4"
        >
          {QUICK_PROMPTS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-3.5 py-2 rounded-xl text-xs text-text-muted border border-white/[0.06] hover:border-violet-500/30 hover:text-violet-300 hover:bg-violet-500/5 transition-all"
            >
              {suggestion.length > 50 ? suggestion.slice(0, 50) + '...' : suggestion}
            </button>
          ))}
        </m.div>
      )}
    </m.div>
  );
}
