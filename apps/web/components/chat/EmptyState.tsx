'use client'

import type { Guardian } from './types'
import { GuardianAvatar48 } from './GuardianInfoBar'

interface EmptyStateProps {
  guardian: Guardian
  onStarterSelect: (prompt: string) => void
}

export function EmptyState({ guardian, onStarterSelect }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 overflow-y-auto">
      {/* Large avatar with glow */}
      <div className="relative mb-6">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full animate-breathe-glow"
          style={
            {
              '--glow-color': guardian.glowColor,
              margin: '-12px',
            } as React.CSSProperties
          }
        />
        {/* Large avatar */}
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold z-10"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${guardian.glowColor}66, ${guardian.glowColor}22 60%, ${guardian.glowColor}0a)`,
            border: `2.5px solid ${guardian.color}`,
            color: guardian.color,
          }}
        >
          {/* Cosmic inner ring */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${guardian.color}30, transparent 30%, ${guardian.color}20, transparent 80%, ${guardian.color}30)`,
            }}
            aria-hidden="true"
          />
          <span className="relative z-10 font-serif text-3xl">{guardian.avatarInitials}</span>
        </div>
      </div>

      {/* Guardian name + element */}
      <div className="text-center mb-3">
        <h2
          className="font-serif text-2xl font-bold text-foreground mb-1 text-balance"
          style={{ textShadow: `0 0 20px ${guardian.glowColor}40` }}
        >
          {guardian.name}
        </h2>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: guardian.color }}
        >
          {guardian.element} Luminor
        </p>
      </div>

      {/* Greeting message */}
      <div
        className="max-w-md text-center text-sm text-foreground/80 leading-relaxed mb-8 px-4 py-4 rounded-2xl"
        style={{
          background: 'rgba(10,10,20,0.5)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${guardian.glowColor}20`,
        }}
      >
        <span
          className="inline-block mb-2 text-base"
          style={{ color: guardian.glowColor }}
          aria-hidden="true"
        >
          &#10022;
        </span>
        <p className="italic">{guardian.greetingMessage}</p>
      </div>

      {/* Conversation starters */}
      <div className="w-full max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 text-center mb-3">
          Begin your journey
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {guardian.conversationStarters.map((starter, i) => (
            <StarterCard
              key={i}
              text={starter}
              guardian={guardian}
              onClick={() => onStarterSelect(starter)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StarterCard({
  text,
  guardian,
  onClick,
}: {
  text: string
  guardian: Guardian
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left px-4 py-3 rounded-xl text-sm text-foreground/75 hover:text-foreground transition-all duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(13,71,161,0.18)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = `${guardian.glowColor}50`
        el.style.background = `${guardian.glowColor}0d`
        el.style.boxShadow = `0 4px 24px ${guardian.glowColor}15`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(13,71,161,0.18)'
        el.style.background = 'rgba(255,255,255,0.03)'
        el.style.boxShadow = 'none'
      }}
      type="button"
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 w-1 h-1 rounded-full shrink-0 transition-colors"
          style={{ background: guardian.color, marginTop: 6 }}
          aria-hidden="true"
        />
        <span className="leading-snug">{text}</span>
      </div>
      {/* Arrow */}
      <div
        className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: guardian.color }}>
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  )
}
