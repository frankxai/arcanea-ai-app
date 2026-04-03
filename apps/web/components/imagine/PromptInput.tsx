'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ImageModelSelector } from './ImageModelSelector';

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1' },
  { id: '16:9', label: '16:9' },
  { id: '9:16', label: '9:16' },
  { id: '4:3', label: '4:3' },
  { id: '3:4', label: '3:4' },
] as const;

// Speed uses fast models, Quality uses premium
const QUALITY_MODEL_MAP = {
  speed: 'google/gemini-3.1-flash-image-preview',
  quality: 'google/gemini-3-pro-image-preview',
} as const;

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
  } catch {}
}

interface PromptInputProps {
  onGenerate: (prompt: string, count: number, aspectRatio: string, style?: string, model?: string, enhance?: boolean, negativePrompt?: string) => void;
  onAnimate?: (prompt: string) => void;
  isGenerating: boolean;
  hasResults: boolean;
  externalPrompt?: string;
  generationProgress?: { current: number; total: number; estimatedSecondsLeft?: number } | null;
}

export function PromptInput({ onGenerate, onAnimate, isGenerating, hasResults, externalPrompt, generationProgress }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [quality, setQuality] = useState<'speed' | 'quality'>('speed');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [model, setModel] = useState('auto');
  const [showOptions, setShowOptions] = useState(false);
  const [showAspectPicker, setShowAspectPicker] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const aspectRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalPrompt !== undefined && externalPrompt !== '') {
      setPrompt(externalPrompt);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [externalPrompt]);

  useEffect(() => { setHistory(loadHistory()); }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) setShowOptions(false);
      if (aspectRef.current && !aspectRef.current.contains(e.target as Node)) setShowAspectPicker(false);
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) setShowHistory(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;
    saveToHistory(prompt.trim());
    setHistory(loadHistory());

    // Video mode → trigger animate flow
    if (mode === 'video' && onAnimate) {
      onAnimate(prompt.trim());
      return;
    }

    // Determine model: if user picked a specific model use that, otherwise map from quality toggle
    const resolvedModel = model !== 'auto'
      ? model
      : QUALITY_MODEL_MAP[quality];

    onGenerate(
      prompt.trim(),
      4,
      aspectRatio,
      undefined, // style
      resolvedModel,
      quality === 'quality' || undefined, // enhance on quality mode
      undefined, // negative prompt
    );
    setShowHistory(false);
  }, [prompt, aspectRatio, model, quality, mode, isGenerating, onGenerate, onAnimate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const selectedAR = ASPECT_RATIOS.find((ar) => ar.id === aspectRatio) || ASPECT_RATIOS[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Gradient fade at bottom to blend content into input bar */}
      <div className="h-8 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />

      <div className="bg-[#09090b] pb-4 px-4 pointer-events-auto">
        {/* Generation progress */}
        <AnimatePresence>
          {isGenerating && generationProgress && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="max-w-2xl mx-auto mb-2"
            >
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/[0.06]">
                <div className="w-4 h-4 border-2 border-[#7fffd4]/30 border-t-[#7fffd4] rounded-full animate-spin flex-shrink-0" />
                <span className="text-xs text-[#7fffd4] font-medium">
                  Creating {generationProgress.current} of {generationProgress.total}
                </span>
                <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <m.div
                    className="h-full rounded-full bg-gradient-to-r from-[#7fffd4] to-[#78a6ff]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {generationProgress.estimatedSecondsLeft != null && generationProgress.estimatedSecondsLeft > 0 && (
                  <span className="text-[10px] text-white/40">~{generationProgress.estimatedSecondsLeft}s</span>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <div className="max-w-2xl mx-auto">
          {/* History dropdown (above input) */}
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <m.div
                ref={historyRef}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mb-2 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-2xl"
              >
                <div className="px-3 py-2 border-b border-white/[0.04] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">Recent</span>
                  <button onClick={() => setShowHistory(false)} className="text-[10px] text-white/20 hover:text-white/40">Hide</button>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {history.slice(0, 8).map((item, i) => (
                    <button
                      key={`${item}-${i}`}
                      onClick={() => { setPrompt(item); setShowHistory(false); textareaRef.current?.focus(); }}
                      className="w-full text-left px-3 py-2 text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors truncate"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Main input bar */}
          <div className="rounded-2xl bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40">
            {/* Text input row */}
            <div className="flex items-end gap-2 px-3 py-2.5">
              {/* Options button (+) */}
              <div ref={optionsRef} className="relative flex-shrink-0 mb-0.5">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    showOptions ? 'bg-white/[0.12] rotate-45' : 'bg-white/[0.06] hover:bg-white/[0.1]'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <AnimatePresence>
                  {showOptions && (
                    <m.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-2 w-72 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">Model Override</span>
                          <div className="mt-1.5">
                            <ImageModelSelector value={model} onChange={setModel} />
                          </div>
                        </div>
                        <div className="text-[10px] text-white/20 border-t border-white/[0.04] pt-2">
                          Tip: Speed/Quality toggle auto-selects the best model. Use override for specific models.
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (history.length > 0 && !prompt) setShowHistory(true); }}
                placeholder={mode === 'video' ? 'Describe a scene to animate...' : 'Describe what you want to create...'}
                rows={1}
                className="flex-1 bg-transparent text-white/90 placeholder:text-white/25 focus:outline-none resize-none text-sm leading-relaxed py-1.5 max-h-[120px]"
                style={{ height: 'auto' }}
              />

              {/* Send button */}
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim() || isGenerating}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all mb-0.5 ${
                  prompt.trim() && !isGenerating
                    ? 'bg-[#7fffd4]/20 hover:bg-[#7fffd4]/30 border border-[#7fffd4]/30'
                    : 'bg-white/[0.06] opacity-30 cursor-not-allowed'
                } active:scale-90`}
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-[#7fffd4]/30 border-t-[#7fffd4] rounded-full animate-spin" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={prompt.trim() ? '#7fffd4' : 'white'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mode toggles row */}
            <div className="flex items-center gap-1.5 px-3 pb-3 pt-0">
              {/* Image / Video toggle */}
              <div className="flex items-center rounded-lg bg-white/[0.04] p-0.5">
                <button
                  onClick={() => setMode('image')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    mode === 'image' ? 'bg-white/[0.1] text-white/90' : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Image
                </button>
                <button
                  onClick={() => setMode('video')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    mode === 'video' ? 'bg-violet-500/20 text-violet-300' : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  Video
                </button>
              </div>

              {/* Speed / Quality toggle */}
              <div className="flex items-center rounded-lg bg-white/[0.04] p-0.5">
                <button
                  onClick={() => setQuality('speed')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    quality === 'speed' ? 'bg-white/[0.1] text-white/90' : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  Speed
                </button>
                <button
                  onClick={() => setQuality('quality')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    quality === 'quality' ? 'bg-[#7fffd4]/15 text-[#7fffd4]' : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  Quality
                </button>
              </div>

              {/* Aspect ratio picker */}
              <div ref={aspectRef} className="relative">
                <button
                  onClick={() => setShowAspectPicker(!showAspectPicker)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-white/50 hover:text-white/70 transition-all"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                  </svg>
                  {selectedAR.label}
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-40">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <AnimatePresence>
                  {showAspectPicker && (
                    <m.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute bottom-full left-0 mb-2 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden min-w-[80px]"
                    >
                      {ASPECT_RATIOS.map((ar) => (
                        <button
                          key={ar.id}
                          onClick={() => { setAspectRatio(ar.id); setShowAspectPicker(false); }}
                          className={`w-full text-left px-4 py-2 text-xs font-medium transition-all ${
                            aspectRatio === ar.id
                              ? 'bg-[#7fffd4]/10 text-[#7fffd4]'
                              : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                          }`}
                        >
                          {ar.label}
                        </button>
                      ))}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="text-center mt-1.5">
            <span className="text-[10px] text-white/15">Press Enter to create</span>
          </div>
        </div>
      </div>
    </div>
  );
}
