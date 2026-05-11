/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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

const ELEMENTS: { label: Element; Icon?: React.ComponentType<any>; color?: string }[] = [
  { label: 'All' },
  { label: 'Fire', Icon: Fire, color: 'var(--arc-fire)' },
  { label: 'Water', Icon: Drop, color: 'var(--arc-brand-atlantean-teal)' },
  { label: 'Earth', Icon: Mountains, color: 'var(--arc-earth)' },
  { label: 'Wind', Icon: Wind, color: 'var(--arc-text-primary)' },
  { label: 'Spirit', Icon: Sparkle, color: 'var(--arc-void)' },
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
        borderColor: 'rgba(13,71,161,0.12)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Element filters */}
          <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter by element">
            <Funnel size={16} style={{ color: 'var(--arc-earth)', flexShrink: 0 }} aria-hidden="true" />
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
                            : 'rgba(13,71,161,0.2)',
                          borderColor: color || 'var(--arc-brand-cosmic-blue)',
                          color: color || 'var(--arc-brand-atlantean-teal)',
                          boxShadow: `0 0 12px ${color ? `rgba(${hexToRgb(color)}, 0.25)` : 'rgba(13,71,161,0.25)'}`,
                        }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          borderColor: 'rgba(13,71,161,0.15)',
                          color: 'var(--arc-earth)',
                        }
                  }
                >
                  {Icon && (
                    <Icon
                      size={14}
                      weight={isActive ? 'fill' : 'regular'}
                      style={{ color: isActive ? color : 'var(--arc-earth)' }}
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
                            borderColor: 'var(--arc-brand-atlantean-teal)',
                            color: 'var(--arc-brand-atlantean-teal)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.03)',
                            borderColor: 'rgba(13,71,161,0.1)',
                            color: 'var(--arc-earth)',
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
              style={{ color: 'rgba(13,71,161,0.6)' }}
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
  if (!result) return '13,71,161'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
