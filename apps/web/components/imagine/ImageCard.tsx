'use client';

import { useState, useCallback, useEffect } from 'react';
import { m } from 'framer-motion';
import { isFavorited, addFavorite, removeFavorite } from '@/lib/imagine-favorites';

const ASPECT_CLASSES: Record<string, string> = {
  '1:1': 'aspect-square',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
  '4:3': 'aspect-[4/3]',
  '3:4': 'aspect-[3/4]',
  '3:2': 'aspect-[3/2]',
  '2:3': 'aspect-[2/3]',
};

interface ImageCardProps {
  id: string;
  src: string;
  prompt: string;
  index: number;
  data?: string;
  mimeType?: string;
  aspectRatio?: string;
  onAnimate?: (id: string, imageUrl: string) => void;
  onFavoriteChange?: () => void;
  isAnimating?: boolean;
  videoUrl?: string;
}

export function ImageCard({
  id,
  src,
  prompt,
  index,
  data,
  mimeType,
  aspectRatio = '1:1',
  onAnimate,
  onFavoriteChange,
  isAnimating,
  videoUrl,
}: ImageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFavorited(isFavorited(id));
  }, [id]);

  const handleToggleFavorite = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isSaving) return;

    if (favorited) {
      removeFavorite(id);
      setFavorited(false);
      onFavoriteChange?.();
      return;
    }

    setIsSaving(true);
    try {
      await addFavorite({ id, url: src, prompt, data, mimeType });
      setFavorited(true);
      onFavoriteChange?.();
    } catch {
      // Favorite failed silently
    } finally {
      setIsSaving(false);
    }
  }, [id, src, prompt, data, mimeType, favorited, isSaving, onFavoriteChange]);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arcanea-imagine-${id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(src, '_blank');
    }
  }, [src, id]);

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  const [shared, setShared] = useState(false);
  const handleShare = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareUrl = src.startsWith('data:') ? window.location.href : src;
    const shareData = { title: 'Arcanea Imagine', text: prompt, url: shareUrl };
    try {
      if (navigator.share && !src.startsWith('data:')) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // Share cancelled or failed
    }
  }, [src, prompt]);

  // Heart SVG — filled when favorited, outline when not
  const HeartIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={favorited ? '#f472b6' : 'none'}
      stroke={favorited ? '#f472b6' : 'white'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-all duration-300 ${className}`}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  return (
    <>
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        className="group relative rounded-sm sm:rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        {/* Image */}
        {showVideo && videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full ${ASPECT_CLASSES[aspectRatio] || 'aspect-square'} object-cover`}
            onClick={(e) => {
              e.stopPropagation();
              setShowVideo(false);
            }}
          />
        ) : (
          <img
            src={src}
            alt={prompt}
            className={`w-full ${ASPECT_CLASSES[aspectRatio] || 'aspect-square'} object-cover transition-transform duration-500 group-hover:scale-105`}
            loading="lazy"
          />
        )}

        {/* Video badge */}
        {videoUrl && !showVideo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowVideo(true);
            }}
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-violet-600/90 text-white backdrop-blur-sm flex items-center gap-1.5 hover:bg-violet-500 transition-colors"
          >
            <span className="w-2 h-2 bg-white rounded-full" />
            Video
          </button>
        )}

        {/* Favorite button — always visible (top-left) */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-sm transition-all z-10 ${
            favorited
              ? 'bg-pink-500/20 border border-pink-500/30'
              : 'bg-black/30 opacity-0 group-hover:opacity-100 hover:bg-white/20'
          } ${isSaving ? 'animate-pulse' : ''}`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon size={16} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {/* Top-right actions */}
          <div className="absolute top-3 right-3 flex gap-1.5 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyPrompt();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              title={copied ? 'Copied!' : 'Copy prompt'}
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              title="Download"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              title={shared ? 'Link copied!' : 'Share'}
            >
              {shared ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              )}
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
            <p className="text-xs text-white/70 line-clamp-2 font-body leading-relaxed">
              {prompt}
            </p>
            {onAnimate && !videoUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAnimate(id, src);
                }}
                disabled={isAnimating}
                className="mt-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600/80 text-white hover:bg-violet-500 transition-all disabled:opacity-50 backdrop-blur-sm"
              >
                {isAnimating ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Animating
                  </span>
                ) : (
                  'Animate'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Animating overlay */}
        {isAnimating && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
              <span className="text-xs text-violet-300">Bringing to life...</span>
            </div>
          </div>
        )}
      </m.div>

      {/* Lightbox */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          onClick={() => setIsExpanded(false)}
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {showVideo && videoUrl ? (
              <video
                src={videoUrl}
                autoPlay
                loop
                controls
                className="max-w-full max-h-[80vh] mx-auto object-contain rounded-2xl"
              />
            ) : (
              <img
                src={src}
                alt={prompt}
                className="max-w-full max-h-[80vh] mx-auto object-contain rounded-2xl"
              />
            )}

            {/* Lightbox controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-2xl">
              <p className="text-sm text-white/70 font-body mb-4 max-w-2xl">
                {prompt}
              </p>
              <div className="flex gap-2 flex-wrap items-center">
                {/* Favorite in lightbox */}
                <button
                  onClick={() => handleToggleFavorite()}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    favorited
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  } ${isSaving ? 'animate-pulse' : ''}`}
                >
                  <HeartIcon size={16} />
                  {favorited ? 'Favorited' : 'Favorite'}
                </button>
                {videoUrl && (
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-violet-600/80 text-white hover:bg-violet-500 transition-all"
                  >
                    {showVideo ? 'Show Image' : 'Play Video'}
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  Download
                </button>
                <button
                  onClick={handleCopyPrompt}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  {shared ? 'Shared!' : 'Share'}
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="ml-auto px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white transition-all"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Close X button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </m.div>
        </div>
      )}
    </>
  );
}
