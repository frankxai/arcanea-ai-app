'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ArrowLeft, ArrowRight } from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LightboxImage {
  src: string;
  alt?: string;
}

export interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// ImageLightbox — full-screen image viewer with navigation, zoom, download
// ---------------------------------------------------------------------------

export function ImageLightbox({
  images,
  initialIndex = 0,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [entering, setEntering] = useState(true);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const current = images[index];
  const hasMultiple = images.length > 1;

  // Entrance animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntering(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Reset zoom/pan when navigating
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (hasMultiple && e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
      if (hasMultiple && e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, hasMultiple, images.length]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Double-click to toggle zoom
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  }, [scale]);

  // Pan when zoomed — pointer events
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (scale <= 1) return;
      e.preventDefault();
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [scale, translate],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setTranslate({ x: dragStart.current.tx + dx, y: dragStart.current.ty + dy });
    },
    [dragging],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  // Pinch-to-zoom via wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setScale((s) => {
      const next = Math.min(5, Math.max(1, s + delta));
      if (next <= 1) setTranslate({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Download handler
  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(current.src);
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
      window.open(current.src, '_blank');
    }
  }, [current.src]);

  const overlay = (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        opacity: entering ? 0 : 1,
        transition: 'opacity 200ms ease-out',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Edge gradient fades */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/[0.08] hover:bg-[#00bcd4]/20 hover:border-[#00bcd4]/30 flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-sm"
          aria-label="Download image"
        >
          <Download className="w-4.5 h-4.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/[0.08] hover:bg-white/20 hover:border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-sm"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Image counter */}
      {hasMultiple && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/10 border border-white/[0.08] text-white/60 text-xs font-mono backdrop-blur-sm z-20">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Arrow navigation */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/[0.08] hover:bg-[#00bcd4]/20 hover:border-[#00bcd4]/30 flex items-center justify-center text-white/60 hover:text-white transition-all backdrop-blur-sm z-20"
            aria-label="Previous image"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/[0.08] hover:bg-[#00bcd4]/20 hover:border-[#00bcd4]/30 flex items-center justify-center text-white/60 hover:text-white transition-all backdrop-blur-sm z-20"
            aria-label="Next image"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Main image */}
      <div
        className="relative z-10 max-w-[90vw] max-h-[85vh] flex items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        <img
          src={current.src}
          alt={current.alt || 'Image'}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          style={{
            transform: `scale(${entering ? 0.9 : scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          draggable={false}
        />
      </div>
    </div>
  );

  // Render into a portal so it escapes any overflow:hidden ancestors
  if (typeof window === 'undefined') return null;
  return createPortal(overlay, document.body);
}

export default ImageLightbox;
