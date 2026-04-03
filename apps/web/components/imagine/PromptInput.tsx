'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ImageModelSelector } from './ImageModelSelector';

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1', icon: '\\u25A1' },
  { id: '16:9', label: '16:9', icon: '\\u25AD' },
  { id: '9:16', label: '9:16', icon: '\\u25AF' },
  { id: '4:3', label: '4:3', icon: '\\u25AD' },
  { id: '3:4', label: '3:4', icon: '\\u25AF' },
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
    // localStorage quota or disabled
  }
}

interface PromptInputProps {
  onGenerate: (prompt: string, count: number, aspectRatio: string, style?: string, model?: string, enhance?: boolean, negativePrompt?: string) => void;
  isGenerating: boolean;
  hasResults: boolean;
  externalPrompt?: string;
  generationProgress?: { current: number; total: number; estimatedSecondsLeft?: number } | null;
}

export function PromptInput({ onGenerate, isGenerating, hasResults, externalPrompt, generationProgress }: PromptInputProps) {
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

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

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
    onGenerate(
      prompt.trim(),
      4,
      aspectRatio,
      undefined,
      model !== 'auto' ? model : undefined,
      quality === 'quality' || undefined,
      undefined,
    );
    setShowHistory(false);
  }, [prompt, aspectRatio, model, quality, isGenerating, onGenerate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const selectedAR = ASPECT_RATIOS.find((ar) => ar.id === aspectRatio) || ASPECT_RATIOS[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-4 px-4 pointer-events-none">
      {/* Generation progress */}
      <AnimatePresence>
        {isGenerating && generationProgress && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="max-w-2xl mx-auto mb-2 pointer-events-auto"
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

      <div className="max-w-2xl mx-auto pointer-events-auto">
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
          <div className="flex items-end gap-2 px-3 py-2">
            {/* Options button */}
            <div ref={optionsRef} className="relative flex-shrink-0 mb-1">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {/* Extended options dropdown */}
              <AnimatePresence>
                {showOptions && (
                  <m.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-2 w-64 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden"
                  >
                    <div className="p-3 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">Model</span>
                        <div className="mt-1.5">
                          <ImageModelSelector value={model} onChange={setModel} />
                        </div>
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
              placeholder="Describe what you want to create..."
              rows={1}
              className="flex-1 bg-transparent text-white/90 placeholder:text-white/25 focus:outline-none resize-none text-sm leading-relaxed py-1.5 max-h-[120px]"
              style={{ height: 'auto' }}
            />

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all mb-1 disabled:opacity-20 disabled:cursor-not-allowed bg-white/[0.08] hover:bg-white/[0.15] active:scale-90"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Mode toggles row */}
          <div className="flex items-center gap-1 px-3 pb-2.5 pt-0.5">
            {/* Image / Video toggle */}
            <div className="flex items-center rounded-lg bg-white/[0.04] p-0.5">
              <button
                onClick={() => setMode('image')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  mode === 'image'
                    ? 'bg-white/[0.1] text-white/90'
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Image
              </button>
              <button
                onClick={() => setMode('video')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  mode === 'video'
                    ? 'bg-white/[0.1] text-white/90'
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  quality === 'speed'
                    ? 'bg-white/[0.1] text-white/90'
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                Speed
              </button>
              <button
                onClick={() => setQuality('quality')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  quality === 'quality'
                    ? 'bg-white/[0.1] text-white/90'
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                Quality
              </button>
            </div>

            {/* Aspect ratio picker */}
            <div ref={aspectRef} className="relative">
              <button
                onClick={() => setShowAspectPicker(!showAspectPicker)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-white/50 hover:text-white/70 transition-all"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                </svg>
                {selectedAR.label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-40">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <AnimatePresence>
                {showAspectPicker && (
                  <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-full left-0 mb-2 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden"
                  >
                    {ASPECT_RATIOS.map((ar) => (
                      <button
                        key={ar.id}
                        onClick={() => { setAspectRatio(ar.id); setShowAspectPicker(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-all flex items-center gap-3 ${
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

            {/* Spacer */}
            <div className="flex-1" />

            {/* Favorites count (if has results) */}
            {hasResults && (
              <span className="text-[10px] text-white/20 px-2">Scroll to load more</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
