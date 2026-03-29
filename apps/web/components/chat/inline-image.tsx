'use client';

import React, { useState, useCallback } from 'react';
import {
  Download,
  ArrowsClockwise,
  ArrowsOut,
} from '@/lib/phosphor-icons';
import { ImageLightbox } from './image-lightbox';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InlineImageProps {
  src: string;
  prompt?: string;
  revisedPrompt?: string;
  onRegenerate?: () => void;
  aspectRatio?: string;
}

// ---------------------------------------------------------------------------
// InlineImage — renders an AI-generated image inline in the message stream
// ---------------------------------------------------------------------------

export function InlineImage({
  src,
  prompt,
  revisedPrompt,
  onRegenerate,
  aspectRatio,
}: InlineImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const displayPrompt = revisedPrompt || prompt;

  // Download handler — works for both base64 and HTTP URLs
  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arcanea-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(src, '_blank');
    }
  }, [src]);

  // Error state
  if (error) {
    return (
      <div className="max-w-[400px] w-full rounded-xl border border-red-500/10 bg-red-500/5 p-4">
        <p className="text-sm text-red-400 mb-2">Failed to load image</p>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <ArrowsClockwise className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[400px] w-full">
        {/* Image container */}
        <div
          className="relative rounded-xl overflow-hidden border border-white/[0.06] cursor-pointer group/img hover:shadow-[0_0_16px_rgba(0,188,212,0.1)] transition-shadow"
          style={{ aspectRatio: aspectRatio || 'auto' }}
          onClick={() => setLightboxOpen(true)}
        >
          {/* Shimmer placeholder */}
          {!loaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.06] to-white/[0.02] animate-shimmer bg-[length:200%_100%]" />
          )}

          <img
            src={src}
            alt={displayPrompt || 'AI-generated image'}
            className={`w-full h-auto transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />

          {/* Expand overlay on hover */}
          {loaded && (
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
              <ArrowsOut className="w-5 h-5 text-white/0 group-hover/img:text-white/80 transition-colors" />
            </div>
          )}
        </div>

        {/* Caption and actions */}
        {(displayPrompt || onRegenerate) && (
          <div className="mt-2 px-1">
            {displayPrompt && (
              <p className="text-[12px] text-white/40 leading-relaxed line-clamp-2 mb-1.5">
                {displayPrompt}
              </p>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[#00bcd4]/70 hover:text-[#00bcd4] hover:bg-[#00bcd4]/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[#00bcd4]/70 hover:text-[#00bcd4] hover:bg-[#00bcd4]/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none"
                >
                  <ArrowsClockwise className="w-3.5 h-3.5" />
                  <span>Redo</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full-featured lightbox with zoom, download, and spring animation */}
      {lightboxOpen && (
        <ImageLightbox
          images={[{ src, alt: displayPrompt || 'AI-generated image' }]}
          initialIndex={0}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

export default InlineImage;
