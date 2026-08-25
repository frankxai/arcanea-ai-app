'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

interface CanvasImage {
  id: string;
  url: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface InfiniteCanvasProps {
  images: CanvasImage[];
  onAddImage: (url: string, x: number, y: number) => void;
  onTransformChange?: (transform: { x: number; y: number; scale: number }) => void;
}

export function InfiniteCanvas({ images, onAddImage, onTransformChange }: InfiniteCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    onTransformChange?.(transform);
  }, [transform, onTransformChange]);

  useEffect(() => {
    images.forEach((img) => {
      if (!loadedImages.has(img.id)) {
        const image = new Image();
        image.src = img.url;
        image.onload = () => {
          setLoadedImages((prev) => new Map(prev).set(img.id, image));
        };
      }
    });
  }, [images]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.1, transform.scale + delta), 3);
    setTransform((prev) => ({ ...prev, scale: newScale }));
  }, [transform.scale]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left - transform.x) / transform.scale;
          const y = (e.clientY - rect.top - transform.y) / transform.scale;
          onAddImage(url, x, y);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [transform, onAddImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const url = event.target?.result as string;
            onAddImage(url, 0, 0);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }, [onAddImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('paste', handlePaste);
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        document.removeEventListener('paste', handlePaste);
      };
    }
  }, [handleWheel, handlePaste]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: cosmic.void,
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(0, 188, 212, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 30%, rgba(255, 215, 0, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 80%, rgba(13, 71, 161, 0.05) 0%, transparent 50%)
        `,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        {images.map((img) => {
          const loadedImg = loadedImages.get(img.id);
          return (
            <div
              key={img.id}
              style={{
                position: 'absolute',
                left: img.x,
                top: img.y,
                width: img.width,
                height: img.height,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredImage(img.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              {loadedImg && (
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover rounded-lg border-2 transition-all"
                  style={{
                    borderColor: hoveredImage === img.id ? brand.arcaneanGold : 'rgba(255,255,255,0.1)',
                    boxShadow: hoveredImage === img.id ? '0 0 20px rgba(255, 215, 0, 0.3)' : 'none',
                  }}
                />
              )}
              <div
                className="absolute bottom-0 left-0 right-0 p-2 rounded-b-lg"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: text.primary,
                  fontSize: '14px',
                  fontFamily: 'Geist, sans-serif',
                }}
              >
                {img.label}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="absolute bottom-4 right-4 px-3 py-2 rounded-md border"
        style={{
          backgroundColor: cosmic.surface,
          borderColor: cosmic.borderBright,
          color: text.secondary,
          fontFamily: 'Geist Mono, monospace',
          fontSize: '12px',
        }}
      >
        Zoom: {Math.round(transform.scale * 100)}%
      </div>
    </div>
  );
}
