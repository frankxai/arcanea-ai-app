/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { Sparkle } from '@/lib/phosphor-icons'

interface EmptyStateProps {
  hasSearch: boolean
  query: string
}

export function EmptyState({ hasSearch, query }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6 py-24 rounded-3xl"
      style={{
        background: 'rgba(15,15,24,0.5)',
        border: '1px dashed rgba(13,71,161,0.2)',
      }}
      role="status"
      aria-label="No creations found"
    >
      {/* Cosmic orb */}
      <div className="relative mb-8" aria-hidden="true">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(13,71,161,0.15) 0%, transparent 70%)',
            border: '1px solid rgba(13,71,161,0.15)',
          }}
        >
          <Sparkle size={40} weight="thin" style={{ color: 'rgba(13,71,161,0.5)' }} />
        </div>
        {/* Orbiting dots */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <span
            key={deg}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 52}px - 3px)`,
              left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 52}px - 3px)`,
              background: deg % 120 === 0 ? 'var(--arc-brand-cosmic-blue)' : deg % 60 === 0 ? 'var(--arc-brand-atlantean-teal)' : 'rgba(13,71,161,0.3)',
              boxShadow: deg % 120 === 0 ? '0 0 6px rgba(13,71,161,0.8)' : deg % 60 === 0 ? '0 0 6px rgba(0,188,212,0.6)' : 'none',
            }}
          />
        ))}
      </div>

      <h3
        className="font-serif text-2xl font-semibold mb-3 text-balance"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: 'var(--arc-text-primary)',
        }}
      >
        {hasSearch ? `No results for "${query}"` : 'No creations yet'}
      </h3>

      <p className="text-base max-w-md leading-relaxed mb-8" style={{ color: 'var(--arc-earth)' }}>
        {hasSearch
          ? 'Try adjusting your filters or search terms to discover more creations.'
          : 'No creations yet. Be the first to share your work.'}
      </p>

      <button
        className="px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-95"
        style={{
          background: 'linear-gradient(135deg, rgba(13,71,161,0.2), rgba(13,71,161,0.1))',
          border: '1px solid rgba(13,71,161,0.35)',
          color: 'var(--arc-text-primary)',
          boxShadow: '0 0 24px rgba(13,71,161,0.1)',
        }}
        onClick={() => window.location.reload()}
      >
        Clear all filters
      </button>
    </div>
  )
}
