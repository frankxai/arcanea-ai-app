'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

interface BoardGenerateDialogProps {
  onClose: () => void;
  onImageGenerated: (url: string, x: number, y: number) => void;
  viewportTransform: { x: number; y: number; scale: number };
}

export function BoardGenerateDialog({ onClose, onImageGenerated, viewportTransform }: BoardGenerateDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    setError(null);

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
          const centerX = -viewportTransform.x / viewportTransform.scale + (window.innerWidth / 2) / viewportTransform.scale;
          const centerY = -viewportTransform.y / viewportTransform.scale + (window.innerHeight / 2) / viewportTransform.scale;
          onImageGenerated(data.assetUrls[0], centerX - 150, centerY - 200);
          onClose();
        } else {
          setError('No image returned. The API may need configuration.');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          setError('API key required. Please configure your image generation provider.');
        } else {
          setError(errorData.error || `Generation failed (${response.status})`);
        }
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Close"
        >
          <X className="w-5 h-5" style={{ color: text.secondary }} aria-hidden="true" />
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

        <div className="space-y-4">
          <label htmlFor="prompt-input" className="sr-only">
            Image description prompt
          </label>
          <textarea
            id="prompt-input"
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
            className="w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: brand.arcaneanGold,
              color: cosmic.void,
              fontFamily: 'Geist, sans-serif',
              fontWeight: 500,
            }}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Generate</span>
              </>
            )}
          </button>

          {error && (
            <div
              className="p-3 rounded-md flex items-start gap-2"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <p className="text-sm" style={{ color: '#ef4444', fontFamily: 'Geist, sans-serif' }}>
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
