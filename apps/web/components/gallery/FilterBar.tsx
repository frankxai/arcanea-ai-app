'use client'

import { Fire, Drop, Mountains, Wind, Sparkle, Funnel } from '@/lib/phosphor-icons'
import type { Element, ContentType } from '@/lib/gallery-data'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  activeElement: Element
  activeType: ContentType
  onElementChange: (el: Element) => void
  onTypeChange: (type: ContentType) => void
  resultCount: number
}

const ELEMENTS: { label: Element; Icon?: React.ElementType; color?: string }[] = [
  { label: 'All' },
  { label: 'Fire', Icon: Fire, color: '#ff6b35' },
  { label: 'Water', Icon: Drop, color: '#4fc3f7' },
  { label: 'Earth', Icon: Mountains, color: '#81c784' },
  { label: 'Wind', Icon: Wind, color: '#b0bec5' },
  { label: 'Spirit', Icon: Sparkle, color: '#ce93d8' },
]

const TYPES: ContentType[] = ['All', 'Image', 'Video', 'Music', 'Text']

export function FilterBar({
  activeElement,
  activeType,
  onElementChange,
  onTypeChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div
      className="sticky top-0 z-40 w-full border-b"
      style={{
        background: 'rgba(10,10,15,0.85)',
        borderColor: 'rgba(139,92,246,0.12)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Element filters */}
          <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter by element">
            <Funnel size={16} style={{ color: '#7c6fa0', flexShrink: 0 }} aria-hidden="true" />
            {ELEMENTS.map(({ label, Icon, color }) => {
              const isActive = activeElement === label
              return (
                <button
                  key={label}
                  onClick={() => onElementChange(label)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                    isActive
                      ? 'border-transparent shadow-lg'
                      : 'hover:border-primary/30'
                  )}
                  style={
                    isActive
                      ? {
                          background: color
                            ? `rgba(${hexToRgb(color)}, 0.2)`
                            : 'rgba(139,92,246,0.2)',
                          borderColor: color || '#8b5cf6',
                          color: color || '#c4b5fd',
                          boxShadow: `0 0 12px ${color ? `rgba(${hexToRgb(color)}, 0.25)` : 'rgba(139,92,246,0.25)'}`,
                        }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          borderColor: 'rgba(139,92,246,0.15)',
                          color: '#7c6fa0',
                        }
                  }
                >
                  {Icon && (
                    <Icon
                      size={14}
                      weight={isActive ? 'fill' : 'regular'}
                      style={{ color: isActive ? color : '#7c6fa0' }}
                      aria-hidden="true"
                    />
                  )}
                  {label}
                </button>
              )
            })}
          </div>

          {/* Type filters + count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter by type">
              {TYPES.map((type) => {
                const isActive = activeType === type
                return (
                  <button
                    key={type}
                    onClick={() => onTypeChange(type)}
                    aria-pressed={isActive}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 border',
                      isActive
                        ? 'border-transparent'
                        : 'hover:border-primary/25'
                    )}
                    style={
                      isActive
                        ? {
                            background: 'rgba(0,188,212,0.15)',
                            borderColor: '#00bcd4',
                            color: '#00bcd4',
                          }
                        : {
                            background: 'rgba(255,255,255,0.03)',
                            borderColor: 'rgba(139,92,246,0.1)',
                            color: '#7c6fa0',
                          }
                    }
                  >
                    {type}
                  </button>
                )
              })}
            </div>
            <span
              className="text-xs font-mono shrink-0"
              style={{ color: 'rgba(139,92,246,0.6)' }}
              aria-live="polite"
              aria-label={`${resultCount} results`}
            >
              {resultCount} results
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '139,92,246'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
