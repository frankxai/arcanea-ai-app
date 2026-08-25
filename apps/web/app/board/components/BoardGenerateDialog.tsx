'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

interface BoardGenerateDialogProps {
  onClose: () => void;
  onImageGenerated: (url: string, x: number, y: number) => void;
}

export function BoardGenerateDialog({ onClose, onImageGenerated }: BoardGenerateDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'ready' | 'wiring' | 'error'>('wiring');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/imagine/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          count: 1,
          aspectRatio: '1:1',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.assetUrls?.[0]) {
          setGenerationStatus('ready');
          onImageGenerated(data.assetUrls[0], 0, 0);
          onClose();
        } else {
          setGenerationStatus('error');
        }
      } else {
        setGenerationStatus('error');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationStatus('error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border p-6 relative"
        style={{
          backgroundColor: cosmic.surface,
          borderColor: cosmic.borderBright,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" style={{ color: text.secondary }} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6" style={{ color: brand.arcaneanGold }} />
          <h2
            className="text-xl font-medium"
            style={{ color: text.primary, fontFamily: 'Geist, sans-serif' }}
          >
            Generate image
          </h2>
        </div>

        {generationStatus === 'wiring' ? (
          <div className="space-y-4">
            <div
              className="p-4 rounded-md border"
              style={{
                backgroundColor: 'rgba(255,215,0,0.05)',
                borderColor: 'rgba(255,215,0,0.2)',
              }}
            >
              <p
                className="text-sm"
                style={{ color: text.primary, fontFamily: 'Geist, sans-serif' }}
              >
                Image generation is being wired
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: text.muted, fontFamily: 'Geist, sans-serif' }}
              >
                The generate endpoint exists at <code className="px-1 py-0.5 rounded bg-black/20">/api/imagine/generate</code> but may need provider configuration.
              </p>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full h-32 px-3 py-2 rounded-md border resize-none"
              style={{
                backgroundColor: cosmic.raised,
                borderColor: cosmic.borderBright,
                color: text.primary,
                fontFamily: 'Geist, sans-serif',
              }}
              disabled
            />

            <button
              className="w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
              style={{
                backgroundColor: brand.arcaneanGold,
                color: cosmic.void,
                fontFamily: 'Geist, sans-serif',
                fontWeight: 500,
              }}
              disabled
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full h-32 px-3 py-2 rounded-md border resize-none focus:outline-none focus:ring-2"
              style={{
                backgroundColor: cosmic.raised,
                borderColor: cosmic.borderBright,
                color: text.primary,
                fontFamily: 'Geist, sans-serif',
              }}
            />

            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: brand.arcaneanGold,
                color: cosmic.void,
                fontFamily: 'Geist, sans-serif',
                fontWeight: 500,
              }}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate</span>
                </>
              )}
            </button>

            {generationStatus === 'error' && (
              <p className="text-sm text-center" style={{ color: '#ef4444' }}>
                Generation failed. Check API configuration.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
