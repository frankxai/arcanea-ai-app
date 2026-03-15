'use client'

import { PhStar, PhCopy } from '@/lib/phosphor-icons'
import { cn } from '@/lib/utils'
import { PROMPT_TYPES } from '@/lib/prompt-books/constants'
import { GlowCard } from '@/components/ui/glow-card'
import type { Prompt } from '@/lib/prompt-books/types'

interface PromptCardProps {
  prompt: Prompt
  viewMode: 'grid' | 'list'
  onClick: () => void
  onFavorite: () => void
  onCopy: () => void
}

export function PromptCard({
  prompt,
  viewMode,
  onClick,
  onFavorite,
  onCopy,
}: PromptCardProps) {
  const typeConfig = PROMPT_TYPES[prompt.promptType]
  const preview = prompt.content.slice(0, viewMode === 'grid' ? 120 : 200)

  const timeAgo = getTimeAgo(prompt.updatedAt)

  if (viewMode === 'list') {
    return (
      <button
        onClick={onClick}
        className="w-full rounded-lg px-4 py-3 hover:bg-white/[0.04] transition-all group flex items-center gap-4 text-left"
      >
        {/* Type indicator */}
        <div className="w-1 h-8 rounded-full bg-atlantean-teal-aqua/30 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-sans font-medium text-text-primary truncate">
              {prompt.title}
            </h4>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-medium text-text-muted bg-white/[0.04] flex-shrink-0">
              {typeConfig.label}
            </span>
          </div>
          <p className="text-xs text-text-muted font-sans truncate mt-0.5">{preview}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-text-muted font-sans">{timeAgo}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite() }}
            className="p-1 rounded hover:bg-white/[0.06]"
          >
            <PhStar
              className={cn(
                'w-3.5 h-3.5',
                prompt.isFavorite ? 'text-amber-400' : 'text-text-muted',
              )}
              weight={prompt.isFavorite ? 'fill' : 'regular'}
            />
          </button>
        </div>
      </button>
    )
  }

  return (
    <GlowCard
      onClick={onClick}
      glass="none"
      lift={false}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer group relative"
    >
      {/* Type badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="px-2 py-1 rounded-lg text-xs font-sans font-medium text-atlantean-teal-aqua/70 bg-atlantean-teal-aqua/8 border border-atlantean-teal-aqua/10">
          {typeConfig.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onCopy() }}
            className="p-1.5 rounded-lg hover:bg-white/[0.06]"
            title="Copy to clipboard"
          >
            <PhCopy className="w-3.5 h-3.5 text-text-muted" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite() }}
            className="p-1.5 rounded-lg hover:bg-white/[0.06]"
          >
            <PhStar
              className={cn(
                'w-3.5 h-3.5',
                prompt.isFavorite ? 'text-amber-400' : 'text-text-muted',
              )}
              weight={prompt.isFavorite ? 'fill' : 'regular'}
            />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-base font-display text-text-primary mb-2 group-hover:text-atlantean-teal-aqua transition-colors line-clamp-1">
        {prompt.title}
      </h4>

      {/* Preview */}
      <p className="text-sm text-text-secondary font-body leading-relaxed line-clamp-3 mb-4">
        {preview}
      </p>

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="px-1.5 py-0.5 rounded text-[10px] font-sans text-text-muted bg-white/[0.04]"
            >
              {tag.name}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-[10px] font-sans text-text-muted">
              +{prompt.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs font-sans text-text-muted">
        <span>{timeAgo}</span>
        <div className="flex items-center gap-3">
          {prompt.useCount > 0 && (
            <span>{prompt.useCount} uses</span>
          )}
          <span>v{prompt.version}</span>
        </div>
      </div>
    </GlowCard>
  )
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date

  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`

  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return new Date(dateStr).toLocaleDateString()
}
