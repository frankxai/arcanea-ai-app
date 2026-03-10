'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import {
  Heart,
  Bookmark,
  Eye,
  Play,
  MusicNote,
  TextT,
  Image as ImageIcon,
} from '@/lib/phosphor-icons'
import type { GalleryItem } from '@/lib/gallery-data'
import { ELEMENT_COLORS } from '@/lib/gallery-data'

interface GalleryCardProps {
  item: GalleryItem
  onOpen: (item: GalleryItem) => void
  onLike: (id: string) => void
  onBookmark: (id: string) => void
}

const TYPE_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Image: ImageIcon,
  Video: Play,
  Music: MusicNote,
  Text: TextT,
}

export function GalleryCard({ item, onOpen, onLike, onBookmark }: GalleryCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [likeAnimating, setLikeAnimating] = useState(false)

  const elementColor = ELEMENT_COLORS[item.element] || '#8b5cf6'
  const TypeIcon = TYPE_ICON_MAP[item.type] || ImageIcon

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setLikeAnimating(true)
      onLike(item.id)
      setTimeout(() => setLikeAnimating(false), 400)
    },
    [item.id, onLike]
  )

  const handleBookmark = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onBookmark(item.id)
    },
    [item.id, onBookmark]
  )

  return (
    <article
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: 'rgba(15,15,24,0.7)',
        border: '1px solid rgba(139,92,246,0.15)',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onClick={() => onOpen(item)}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = `0 20px 60px rgba(139,92,246,0.2), 0 0 0 1px rgba(139,92,246,0.25)`
        el.style.borderColor = 'rgba(139,92,246,0.35)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'rgba(139,92,246,0.15)'
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(item)}
      aria-label={`Open ${item.title} by ${item.creator.name}`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: `${item.width}/${item.height}` }}>
        {/* Skeleton while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />
        )}

        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Type badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
          style={{
            background: 'rgba(10,10,15,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            color: '#c4b5fd',
          }}
        >
          <TypeIcon size={11} weight="fill" aria-hidden="true" />
          {item.type}
        </div>

        {/* Element badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `rgba(${hexToRgb(elementColor)}, 0.2)`,
            border: `1px solid ${elementColor}`,
            color: elementColor,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: elementColor, boxShadow: `0 0 6px ${elementColor}` }}
            aria-hidden="true"
          />
          {item.element}
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
          style={{
            background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 60%, transparent 100%)',
          }}
        >
          {/* Title */}
          <h3
            className="font-serif text-base font-semibold text-white leading-tight mb-2 text-balance"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.title}
          </h3>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={item.creator.avatar}
              alt={item.creator.name}
              className="w-6 h-6 rounded-full border"
              style={{ borderColor: 'rgba(139,92,246,0.4)' }}
            />
            <span className="text-xs" style={{ color: '#9b8ec4' }}>
              {item.creator.name}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs" style={{ color: '#7c6fa0' }}>
              <Eye size={12} aria-hidden="true" />
              {formatCount(item.views)}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: item.liked ? '#ff6b6b' : '#7c6fa0' }}>
              <Heart size={12} weight={item.liked ? 'fill' : 'regular'} aria-hidden="true" />
              {formatCount(item.likes)}
            </span>
          </div>
        </div>
      </div>

      {/* Card footer (always visible) */}
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={item.creator.avatar}
            alt={item.creator.name}
            className="w-7 h-7 rounded-full border shrink-0"
            style={{ borderColor: 'rgba(139,92,246,0.3)' }}
          />
          <div className="min-w-0">
            <p
              className="text-sm font-medium truncate leading-tight"
              style={{ color: '#f0eeff' }}
            >
              {item.title}
            </p>
            <p className="text-xs truncate" style={{ color: '#7c6fa0' }}>
              {item.creator.handle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            aria-label={item.bookmarked ? 'Remove bookmark' : 'Bookmark creation'}
            aria-pressed={item.bookmarked}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-primary/10"
            style={{ color: item.bookmarked ? '#ffd700' : '#7c6fa0' }}
          >
            <Bookmark size={15} weight={item.bookmarked ? 'fill' : 'regular'} />
          </button>

          {/* Like button */}
          <button
            onClick={handleLike}
            aria-label={item.liked ? 'Unlike creation' : 'Like creation'}
            aria-pressed={item.liked}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-red-500/10 ${likeAnimating ? 'heart-pop' : ''}`}
            style={{ color: item.liked ? '#ff6b6b' : '#7c6fa0' }}
          >
            <Heart size={15} weight={item.liked ? 'fill' : 'regular'} />
          </button>
        </div>
      </div>
    </article>
  )
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '139,92,246'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
