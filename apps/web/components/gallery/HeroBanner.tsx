'use client'

import { useState } from 'react'
import { MagnifyingGlass, Sparkle } from '@/lib/phosphor-icons'

interface HeroBannerProps {
  onSearch: (query: string) => void
  totalCount: number
}

export function HeroBanner({ onSearch, totalCount }: HeroBannerProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Cosmic background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(13,71,161,0.28) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(0,188,212,0.08) 0%, transparent 55%), #0a0a0f',
        }}
      />

      {/* Star field dots */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 4 + 's',
            }}
          />
        ))}
      </div>

      {/* Orb glows */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(13,71,161,0.18) 0%, transparent 70%)',
          animation: 'glow-pulse 4s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-24 pb-16">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border text-sm font-medium tracking-widest uppercase"
          style={{
            background: 'rgba(13,71,161,0.12)',
            borderColor: 'rgba(13,71,161,0.35)',
            color: '#c4b5fd',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Sparkle size={14} weight="fill" style={{ color: '#ffd700' }} />
          Arcanea Creation Engine
          <Sparkle size={14} weight="fill" style={{ color: '#ffd700' }} />
        </div>

        {/* Title */}
        <h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 text-balance"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 40%, #00bcd4 80%, #ffd700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Gallery of Creation
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl leading-relaxed mb-3"
          style={{ color: '#9b8ec4' }}
        >
          Original artwork created by the Arcanea community.
        </p>

        <p className="text-sm mb-10" style={{ color: 'rgba(13,71,161,0.7)' }}>
          {totalCount.toLocaleString()} creations and growing
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl relative"
          role="search"
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-4 border transition-all duration-300 focus-within:border-primary/70 focus-within:shadow-[0_0_0_3px_rgba(13,71,161,0.15)]"
            style={{
              background: 'rgba(15,15,24,0.75)',
              borderColor: 'rgba(13,71,161,0.25)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <MagnifyingGlass size={20} style={{ color: '#7c6fa0', flexShrink: 0 }} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={handleChange}
              placeholder="Search creations, elements, creators..."
              aria-label="Search gallery"
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              style={{ color: '#f0eeff' }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #0d47a1, #0a3780)',
                color: '#fff',
                boxShadow: '0 0 16px rgba(13,71,161,0.4)',
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
          <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(13,71,161,0.6), transparent)' }} />
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#7c6fa0' }}>Scroll to explore</p>
        </div>
      </div>
    </div>
  )
}
