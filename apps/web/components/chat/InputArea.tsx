'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { Guardian } from './types'
import { cn } from '@/lib/utils'

const MAX_CHARS = 2000

interface InputAreaProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  guardian: Guardian
  disabled?: boolean
}

export function InputArea({ value, onChange, onSubmit, guardian, disabled }: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSend = value.trim().length > 0 && !disabled
  const charCount = value.length
  const nearLimit = charCount > MAX_CHARS * 0.85

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (canSend) onSubmit()
      }
    },
    [canSend, onSubmit],
  )

  return (
    <div
      className="px-4 md:px-8 py-4 border-t shrink-0"
      style={{
        borderColor: 'rgba(13,71,161,0.15)',
        background: 'rgba(10,10,20,0.85)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Suggested prompts row */}
      <SuggestedPrompts
        prompts={guardian.suggestedPrompts}
        onSelect={(p) => onChange(value ? `${value} ${p}` : p)}
      />

      {/* Input box */}
      <div
        className="relative flex items-end gap-2 rounded-xl mt-2"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${canSend ? `${guardian.glowColor}50` : 'rgba(13,71,161,0.2)'}`,
          transition: 'border-color 0.2s',
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) onChange(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Speak with ${guardian.name}... (Enter to send)`}
          rows={1}
          disabled={disabled}
          className={cn(
            'flex-1 bg-transparent resize-none px-4 pt-3.5 pb-3.5 text-sm text-foreground',
            'placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed',
            'disabled:opacity-50',
          )}
          aria-label="Message input"
          style={{ minHeight: 52, maxHeight: 200 }}
        />

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5 pr-3 pb-3 shrink-0">
          {/* Character count */}
          {charCount > 0 && (
            <span
              className={cn(
                'text-[10px] tabular-nums transition-colors',
                nearLimit ? 'text-[#ffd700]' : 'text-muted-foreground/50',
              )}
            >
              {MAX_CHARS - charCount}
            </span>
          )}

          {/* Voice button */}
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Voice input (coming soon)"
            title="Voice input — coming soon"
            type="button"
          >
            <MicIcon />
          </button>

          {/* Send button */}
          <button
            onClick={onSubmit}
            disabled={!canSend}
            className={cn(
              'p-2 rounded-lg transition-all duration-200 flex items-center justify-center',
              canSend
                ? 'animate-pulse-send text-white'
                : 'text-muted-foreground/30 cursor-not-allowed',
            )}
            style={
              canSend
                ? {
                    background: `linear-gradient(135deg, #0d47a1, ${guardian.glowColor}cc)`,
                    boxShadow: `0 0 16px ${guardian.glowColor}40`,
                  }
                : { background: 'rgba(255,255,255,0.05)' }
            }
            aria-label="Send message"
            type="button"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/40 mt-2 text-center">
        Arcanea — Shift+Enter for new line
      </p>
    </div>
  )
}

function SuggestedPrompts({
  prompts,
  onSelect,
}: {
  prompts: string[]
  onSelect: (p: string) => void
}) {
  return (
    <div className="flex gap-2 flex-wrap" role="list" aria-label="Suggested prompts">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs text-muted-foreground/80 hover:text-foreground transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(13,71,161,0.2)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13,71,161,0.45)'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,71,161,0.1)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13,71,161,0.2)'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'
          }}
          role="listitem"
          type="button"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M13 7.5L2 2l2.5 5.5L2 13l11-5.5z"
        fill="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4.5" y="1" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 7a5 5 0 0010 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M7 12v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
