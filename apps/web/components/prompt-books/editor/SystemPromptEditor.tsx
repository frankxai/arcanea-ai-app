'use client'

import { useState } from 'react'
import { PhCaretDown, PhCaretRight, PhBrain } from '@/lib/phosphor-icons'
import { cn } from '@/lib/utils'

interface SystemPromptEditorProps {
  value: string
  onChange: (value: string) => void
}

export function SystemPromptEditor({ value, onChange }: SystemPromptEditorProps) {
  const [expanded, setExpanded] = useState(!!value)

  return (
    <div className="border-t border-white/[0.04]">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center gap-2 px-1 py-2 text-xs font-sans',
          'text-text-muted hover:text-text-secondary transition-colors',
        )}
        type="button"
      >
        {expanded ? (
          <PhCaretDown className="w-3.5 h-3.5" />
        ) : (
          <PhCaretRight className="w-3.5 h-3.5" />
        )}
        <PhBrain className="w-3.5 h-3.5" />
        <span className="font-medium uppercase tracking-wider">System Prompt</span>
        {value && !expanded && (
          <span className="text-text-muted/60 truncate ml-2 font-mono text-[10px]">
            {value.slice(0, 60)}...
          </span>
        )}
      </button>

      {expanded && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="You are a helpful assistant that..."
          rows={4}
          className={cn(
            'w-full bg-transparent text-sm font-mono text-text-primary',
            'placeholder:text-text-muted/40 focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/20',
            'resize-none leading-relaxed px-1 pb-3',
            'scrollbar-thin',
          )}
        />
      )}
    </div>
  )
}
