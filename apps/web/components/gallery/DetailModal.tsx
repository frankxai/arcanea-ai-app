'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  X,
  Heart,
  Bookmark,
  Share,
  Download,
  Eye,
  Sparkle,
  ArrowLeft,
  ArrowRight,
} from '@/lib/phosphor-icons'
import type { GalleryItem } from '@/lib/gallery-data'
import { ELEMENT_COLORS } from '@/lib/gallery-data'
import type { Comment } from '@/lib/types/profile'
import { CommentSection } from '@/components/social/comment-section'

interface DetailModalProps {
  item: GalleryItem | null
  relatedItems: GalleryItem[]
  onClose: () => void
  onLike: (id: string) => void
  onBookmark: (id: string) => void
  onOpenRelated: (item: GalleryItem) => void
  comments?: Comment[]
  commentsLoading?: boolean
  onAddComment?: (content: string) => Promise<void>
  onLikeComment?: (commentId: string) => Promise<void>
  onDeleteComment?: (commentId: string) => Promise<void>
  currentUserId?: string
}

export function DetailModal({
  item,
  relatedItems,
  onClose,
  onLike,
  onBookmark,
  onOpenRelated,
  comments = [],
  commentsLoading = false,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  currentUserId,
}: DetailModalProps) {
  const [likeAnimating, setLikeAnimating] = useState(false)
  const [copied, setCopied] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [promptExpanded, setPromptExpanded] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [item])

  const handleLike = useCallback(() => {
    if (!item) return
    setLikeAnimating(true)
    onLike(item.id)
    setTimeout(() => setLikeAnimating(false), 400)
  }, [item, onLike])

  const handleShare = useCallback(async () => {
    if (!item) return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }, [item])

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' })
  }

  if (!item) return null

  const elementColor = ELEMENT_COLORS[item.element] || '#0d47a1'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${item.title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ background: 'rgba(5,5,10,0.88)', backdropFilter: 'blur(20px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl flex flex-col lg:flex-row"
        style={{
          background: 'rgba(12,12,20,0.95)',
          border: '1px solid rgba(13,71,161,0.2)',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 40px 120px rgba(13,71,161,0.15)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close detail view"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(10,10,15,0.8)',
            border: '1px solid rgba(13,71,161,0.2)',
            color: '#7c6fa0',
          }}
        >
          <X size={16} />
        </button>

        {/* Image panel */}
        <div className="lg:w-3/5 relative flex-shrink-0">
          <div
            className="relative overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
            style={{ minHeight: '360px', height: '100%' }}
          >
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />

            {/* Gradient overlay on image */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, transparent 60%, rgba(12,12,20,0.5) 100%)',
              }}
              aria-hidden="true"
            />

            {/* Element badge */}
            <div
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: `rgba(${hexToRgb(elementColor)}, 0.2)`,
                border: `1px solid ${elementColor}`,
                color: elementColor,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: elementColor, boxShadow: `0 0 8px ${elementColor}` }}
                aria-hidden="true"
              />
              {item.element} · {item.type}
            </div>

            {/* Stats overlay on image */}
            <div
              className="absolute bottom-4 left-4 flex items-center gap-3"
            >
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm"
                style={{
                  background: 'rgba(10,10,15,0.7)',
                  color: '#9b8ec4',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Eye size={14} aria-hidden="true" />
                {formatCount(item.views)}
              </span>
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm"
                style={{
                  background: 'rgba(10,10,15,0.7)',
                  color: item.liked ? '#ff6b6b' : '#9b8ec4',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Heart size={14} weight={item.liked ? 'fill' : 'regular'} aria-hidden="true" />
                {formatCount(item.likes)}
              </span>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-2/5 flex flex-col p-6 gap-5 overflow-y-auto">
          {/* Title */}
          <div>
            <h2
              className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-2 text-balance"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {item.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#9b8ec4' }}>
              {item.description}
            </p>
          </div>

          {/* Creator card */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: 'rgba(13,71,161,0.06)',
              border: '1px solid rgba(13,71,161,0.12)',
            }}
          >
            <img
              src={item.creator.avatar}
              alt={item.creator.name}
              className="w-10 h-10 rounded-full border"
              style={{ borderColor: 'rgba(13,71,161,0.4)' }}
            />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#f0eeff' }}>
                {item.creator.name}
              </p>
              <p className="text-xs" style={{ color: '#7c6fa0' }}>
                {item.creator.handle}
              </p>
            </div>
            <button
              className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
              style={{
                background: 'rgba(13,71,161,0.15)',
                border: '1px solid rgba(13,71,161,0.3)',
                color: '#c4b5fd',
              }}
            >
              View Profile
            </button>
          </div>

          {/* Prompt used */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkle size={14} style={{ color: '#ffd700' }} aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#7c6fa0' }}>
                Prompt Used
              </span>
            </div>
            <div
              className="relative rounded-xl p-3 cursor-pointer"
              style={{
                background: 'rgba(13,71,161,0.06)',
                border: '1px solid rgba(13,71,161,0.1)',
              }}
              onClick={() => setPromptExpanded(!promptExpanded)}
            >
              <p
                className={`text-xs leading-relaxed font-mono ${!promptExpanded ? 'line-clamp-3' : ''}`}
                style={{ color: '#9b8ec4' }}
              >
                {item.prompt}
              </p>
              {!promptExpanded && (
                <p className="text-xs mt-1" style={{ color: '#0d47a1' }}>
                  Click to expand
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-xs"
                style={{
                  background: 'rgba(0,188,212,0.06)',
                  border: '1px solid rgba(0,188,212,0.12)',
                  color: '#00bcd4',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Created at */}
          <p className="text-xs" style={{ color: '#4a3f64' }}>
            Created {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-auto">
            {/* Like */}
            <button
              onClick={handleLike}
              aria-label={item.liked ? 'Unlike' : 'Like'}
              aria-pressed={item.liked}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95 ${likeAnimating ? 'heart-pop' : ''}`}
              style={
                item.liked
                  ? { background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.4)', color: '#ff6b6b' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9b8ec4' }
              }
            >
              <Heart size={16} weight={item.liked ? 'fill' : 'regular'} />
              {item.liked ? 'Liked' : 'Like'} · {formatCount(item.likes)}
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onBookmark(item.id)}
              aria-label={item.bookmarked ? 'Remove bookmark' : 'Bookmark'}
              aria-pressed={item.bookmarked}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-95"
              style={
                item.bookmarked
                  ? { background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)', color: '#ffd700' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9b8ec4' }
              }
            >
              <Bookmark size={16} weight={item.bookmarked ? 'fill' : 'regular'} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              aria-label="Copy link to share"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: copied ? 'rgba(0,188,212,0.1)' : 'rgba(255,255,255,0.05)',
                border: copied ? '1px solid rgba(0,188,212,0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: copied ? '#00bcd4' : '#9b8ec4',
              }}
            >
              <Share size={16} />
            </button>

            {/* Download */}
            <a
              href={item.thumbnail}
              download
              aria-label="Download creation"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9b8ec4',
              }}
            >
              <Download size={16} />
            </a>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-5" style={{ borderColor: 'rgba(13,71,161,0.1)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#c4b5fd' }}>
              Comments {comments.length > 0 && `(${comments.length})`}
            </h3>
            {commentsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(13,71,161,0.4)', borderTopColor: 'transparent' }} />
                <span className="ml-2 text-xs" style={{ color: '#7c6fa0' }}>Loading comments...</span>
              </div>
            ) : (
              <CommentSection
                creationId={item.id}
                comments={comments}
                onAddComment={onAddComment}
                onLikeComment={onLikeComment}
                onDeleteComment={onDeleteComment}
                currentUserId={currentUserId}
              />
            )}
          </div>
        </div>

        {/* Related creations — full width bottom */}
        {relatedItems.length > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 lg:static lg:col-span-2 border-t p-5"
            style={{
              background: 'rgba(10,10,18,0.9)',
              borderColor: 'rgba(13,71,161,0.1)',
              position: 'relative',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>
                Related Creations
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  aria-label="Scroll left"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-primary/20"
                  style={{ color: '#7c6fa0', border: '1px solid rgba(13,71,161,0.15)' }}
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  aria-label="Scroll right"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-primary/20"
                  style={{ color: '#7c6fa0', border: '1px solid rgba(13,71,161,0.15)' }}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedItems.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onOpenRelated(rel)}
                  className="shrink-0 w-24 h-24 rounded-xl overflow-hidden relative transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    border: '1px solid rgba(13,71,161,0.15)',
                    boxShadow: 'none',
                  }}
                  aria-label={`Open ${rel.title}`}
                >
                  <Image
                    src={rel.thumbnail}
                    alt={rel.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5"
                    style={{ background: 'linear-gradient(to top, rgba(10,10,15,0.85), transparent)' }}
                  >
                    <span className="text-xs leading-tight text-white truncate block w-full text-left">
                      {rel.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '13,71,161'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
