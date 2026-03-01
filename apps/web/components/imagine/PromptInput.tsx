'use client';

import { useState, useRef, useCallback } from 'react';

type Quality = 'standard' | 'premium';

interface PromptInputProps {
  onGenerate: (prompt: string, count: number, quality: Quality) => void;
  isGenerating: boolean;
}

export function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(2);
  const [quality, setQuality] = useState<Quality>('standard');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim(), count, quality);
  }, [prompt, count, quality, isGenerating, onGenerate]);

  const handleEnhance = useCallback(async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);

    try {
      const res = await fetch('/api/imagine/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.enhanced) {
          setPrompt(data.enhanced);
        }
      }
    } catch {
      // Silently fail — enhancement is optional
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        {/* Glow effect behind input */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[hsl(var(--gold-bright))]/20 via-[hsl(var(--atlantean-primary))]/15 to-[hsl(var(--gold-bright))]/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

        <div className="relative rounded-2xl border border-[hsl(var(--cosmic-border-bright))]/40 bg-[hsl(var(--cosmic-surface))]/80 backdrop-blur-xl overflow-hidden">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to see..."
            rows={3}
            className="w-full bg-transparent px-6 py-5 text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none resize-none font-[family-name:var(--font-crimson-pro)] text-lg"
          />

          <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--cosmic-border))]/30">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              {/* Image count selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[hsl(var(--text-muted))] uppercase tracking-wider">Qty</span>
                <div className="flex gap-1">
                  {[1, 2, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                        count === n
                          ? 'bg-[hsl(var(--gold-bright))]/20 text-[hsl(var(--gold-bright))] border border-[hsl(var(--gold-bright))]/40'
                          : 'text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--cosmic-raised))]/50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality toggle */}
              <div className="flex items-center gap-1 bg-[hsl(var(--cosmic-deep))]/60 rounded-lg p-0.5">
                <button
                  onClick={() => setQuality('standard')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    quality === 'standard'
                      ? 'bg-[hsl(var(--cosmic-raised))] text-[hsl(var(--text-primary))] shadow-sm'
                      : 'text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-secondary))]'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setQuality('premium')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    quality === 'premium'
                      ? 'bg-gradient-to-r from-amber-600/80 to-yellow-500/80 text-white shadow-sm'
                      : 'text-[hsl(var(--text-muted))] hover:text-amber-400'
                  }`}
                >
                  Premium
                </button>
              </div>

              {/* Enhance with Grok button */}
              <button
                onClick={handleEnhance}
                disabled={!prompt.trim() || isEnhancing || isGenerating}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[hsl(var(--text-muted))] hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
                title="Enhance prompt with Grok AI"
              >
                {isEnhancing ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                  </span>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Generate button */}
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              className="px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[hsl(var(--gold-deep))] to-[hsl(var(--gold-bright))] text-[hsl(var(--cosmic-void))] hover:shadow-[0_0_20px_hsl(var(--gold-bright)/0.3)] active:scale-95"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[hsl(var(--cosmic-void))]/30 border-t-[hsl(var(--cosmic-void))] rounded-full animate-spin" />
                  Imagining...
                </span>
              ) : (
                quality === 'premium' ? 'Imagine HD' : 'Imagine'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick suggestions */}
      {!prompt && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {[
            'A cosmic library floating in nebula clouds',
            'Crystal dragon emerging from volcanic glass',
            'Bioluminescent underwater city at night',
            'Ancient tree of knowledge with glowing runes',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-1.5 rounded-full text-xs text-[hsl(var(--text-muted))] border border-[hsl(var(--cosmic-border))]/30 hover:border-[hsl(var(--gold-bright))]/30 hover:text-[hsl(var(--gold-medium))] transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
