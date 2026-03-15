'use client'

import type { Guardian } from './types'

interface GuardianInfoBarProps {
  guardian: Guardian
}

const ELEMENT_LABELS: Record<string, string> = {
  fire: 'Fire',
  water: 'Water',
  earth: 'Earth',
  void: 'Void',
  celestial: 'Celestial',
}

export function GuardianAvatar48({
  guardian,
  breathing = false,
}: {
  guardian: Guardian
  breathing?: boolean
}) {
  return (
    <div
      className={breathing ? 'animate-breathe-glow' : ''}
      style={
        breathing
          ? ({ '--glow-color': guardian.glowColor } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold select-none relative"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${guardian.glowColor}55, ${guardian.glowColor}22 60%, transparent)`,
          border: `2px solid ${guardian.color}`,
          color: guardian.color,
          boxShadow: `0 0 0 3px ${guardian.glowColor}20`,
        }}
      >
        {/* Inner cosmic pattern */}
        <span
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: `conic-gradient(from 0deg, ${guardian.color}40, transparent, ${guardian.color}40)`,
          }}
        />
        <span className="relative z-10 font-serif">{guardian.avatarInitials}</span>
      </div>
    </div>
  )
}

export function GuardianInfoBar({ guardian }: GuardianInfoBarProps) {
  return (
    <header
      className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
      style={{
        borderColor: 'rgba(13,71,161,0.15)',
        background: 'rgba(13,13,24,0.8)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <GuardianAvatar48 guardian={guardian} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1
            className="font-serif text-lg font-semibold text-foreground leading-tight"
          >
            {guardian.name}
          </h1>
          {/* Element badge */}
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: `${guardian.glowColor}18`,
              border: `1px solid ${guardian.glowColor}50`,
              color: guardian.color,
            }}
          >
            <ElementIcon element={guardian.element} color={guardian.color} />
            {ELEMENT_LABELS[guardian.element]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate italic">
          {guardian.tagline}
        </p>
      </div>

      {/* Status dot */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: guardian.color }}
          aria-hidden="true"
        />
        <span className="text-xs text-muted-foreground hidden sm:inline">Attuned</span>
      </div>
    </header>
  )
}

function ElementIcon({ element, color }: { element: string; color: string }) {
  switch (element) {
    case 'fire':
      return (
        <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true">
          <path d="M4 0C4 0 7 3 7 6A3 3 0 011 6c0-1.5 1-2.5 1-2.5S2.5 5 3.5 5C3.5 3.5 4 0 4 0z" fill={color} />
        </svg>
      )
    case 'water':
      return (
        <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true">
          <path d="M4 0L7.5 6A3.5 3.5 0 010.5 6L4 0z" fill={color} />
        </svg>
      )
    case 'void':
      return (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <circle cx="4.5" cy="4.5" r="3" stroke={color} strokeWidth="1.2" />
          <circle cx="4.5" cy="4.5" r="1" fill={color} />
        </svg>
      )
    case 'celestial':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M5 0l1 3.5h3.5L6.5 5.5l1 3.5L5 7 1.5 9l1-3.5L0 3.5H3.5z" fill={color} />
        </svg>
      )
    default:
      return (
        <svg width="8" height="9" viewBox="0 0 8 9" fill="none" aria-hidden="true">
          <path d="M4 0.5l1 2.5L8 4l-2.5 1.5.5 2.5L4 7 1.5 7.5l.5-2.5L0 4l2.5-.5L4 .5z" fill={color} />
        </svg>
      )
  }
}

export function TypingIndicator({ guardian }: { guardian: Guardian }) {
  return (
    <div className="flex items-end gap-3 animate-slide-up-fade px-1">
      {/* Small guardian avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mb-0.5"
        style={{
          background: `linear-gradient(135deg, ${guardian.glowColor}33, ${guardian.glowColor}55)`,
          border: `1.5px solid ${guardian.glowColor}60`,
          color: guardian.color,
        }}
      >
        <span className="font-serif">{guardian.avatarInitials}</span>
      </div>

      {/* Bubble */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{
          background: 'rgba(10,10,20,0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(13,71,161,0.18)',
        }}
        role="status"
        aria-label={`${guardian.name} is typing`}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-typing-dot inline-block"
            style={{
              background: guardian.color,
              animationDelay: `${i * 0.15}s`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}
