/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import type { Guardian } from './types'

interface EmptyStateProps {
  guardian: Guardian
  onStarterSelect: (prompt: string) => void
}

export function EmptyState({ guardian, onStarterSelect }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 overflow-y-auto relative">
      {/* Ambient background glow keyed to guardian color */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute rounded-full w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: `radial-gradient(circle, ${guardian.glowColor}08 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      </div>
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.018]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Large avatar with layered glow */}
      <div className="relative mb-5">
        {/* Outer pulse ring */}
        <div
          className="absolute rounded-full animate-breathe-glow"
          style={{
            inset: -14,
            background: `radial-gradient(circle, ${guardian.glowColor}15 0%, transparent 70%)`,
          } as React.CSSProperties}
        />
        {/* Mid ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -5,
            border: `1px solid ${guardian.color}20`,
            borderRadius: '50%',
          }}
        />
        {/* Avatar */}
        <div
          className="relative w-[88px] h-[88px] rounded-full flex items-center justify-center z-10"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${guardian.glowColor}55, ${guardian.glowColor}18 60%, ${guardian.glowColor}06)`,
            border: `2px solid ${guardian.color}60`,
            boxShadow: `0 0 32px ${guardian.glowColor}20, inset 0 1px 0 ${guardian.glowColor}30`,
          }}
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${guardian.color}25, transparent 30%, ${guardian.color}18, transparent 80%, ${guardian.color}25)`,
            }}
            aria-hidden="true"
          />
          <span
            className="relative z-10 text-3xl font-display font-bold"
            style={{ color: guardian.color }}
          >
            {guardian.avatarInitials}
          </span>
        </div>
      </div>

      {/* Guardian name + element badge */}
      <div className="text-center mb-4">
        <h2
          className="text-xl font-display font-bold text-white/90 mb-1.5 tracking-[-0.02em]"
          style={{ textShadow: `0 0 24px ${guardian.glowColor}30` }}
        >
          {guardian.name}
        </h2>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase border"
          style={{
            color: guardian.color,
            borderColor: `${guardian.color}25`,
            background: `${guardian.color}08`,
          }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: guardian.color }} aria-hidden />
          {guardian.element} Companion
        </span>
      </div>

      {/* Greeting message — glass card */}
      <div
        className="max-w-sm w-full text-center text-sm text-white/65 leading-relaxed mb-7 px-5 py-4 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${guardian.glowColor}15`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        <p className="italic font-body">{guardian.greetingMessage}</p>
      </div>

      {/* Conversation starters */}
      <div className="w-full max-w-xl">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20 text-center mb-3">
          Try one of these
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
      type="button"
      className="group text-left px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white/90 transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
      style={{
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(12px)',
        border: `1px solid rgba(255,255,255,0.06)`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = `${guardian.glowColor}35`
        el.style.background = `${guardian.glowColor}0a`
        el.style.boxShadow = `0 4px 20px ${guardian.glowColor}12, inset 0 1px 0 ${guardian.glowColor}15`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(255,255,255,0.06)'
        el.style.background = 'rgba(255,255,255,0.025)'
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.03)'
      }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="shrink-0 w-1 h-1 rounded-full mt-[7px]"
          style={{ background: `${guardian.color}80` }}
          aria-hidden="true"
        />
        <span className="leading-snug font-body text-[13px]">{text}</span>
      </div>
      {/* Arrow — reveals on hover */}
      <div
        className="flex justify-end mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        aria-hidden="true"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: guardian.color }}>
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  )
}
