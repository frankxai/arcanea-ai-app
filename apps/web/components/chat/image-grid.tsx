'use client';

import React, { useState } from 'react';
import { ImageLightbox, type LightboxImage } from './image-lightbox';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageGridProps {
  images: LightboxImage[];
}

// ---------------------------------------------------------------------------
// ImageGrid — masonry-style grid for multiple images in a chat message
// ---------------------------------------------------------------------------

export function ImageGrid({ images }: ImageGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  // Single image — no grid, just a clickable image
  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          className="block max-w-[400px] w-full rounded-xl overflow-hidden border border-white/[0.06] cursor-pointer group/img hover:shadow-[0_0_16px_rgba(0,188,212,0.1)] transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
          onClick={() => setLightboxIndex(0)}
          aria-label="Open image in lightbox"
        >
          <div className="relative overflow-hidden">
            <img
              src={images[0].src}
              alt={images[0].alt || 'Image'}
              className="w-full h-auto transition-transform duration-300 group-hover/img:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/15 transition-colors" />
          </div>
        </button>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </>
    );
  }

  // 2-4 images = 2 columns, 5+ = 3 columns
  const cols = images.length >= 5 ? 3 : 2;

  return (
    <>
      <div
        className="grid gap-1.5 max-w-[500px] w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {images.map((img, i) => (
          <button
            key={`${img.src}-${i}`}
            type="button"
            className="relative rounded-lg overflow-hidden border border-white/[0.06] cursor-pointer group/cell hover:shadow-[0_0_12px_rgba(0,188,212,0.1)] transition-all aspect-square focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
            onClick={() => setLightboxIndex(i)}
            aria-label={`Open image ${i + 1} in lightbox`}
          >
            <img
              src={img.src}
              alt={img.alt || `Image ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/cell:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/cell:bg-black/15 transition-colors" />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

export default ImageGrid;
