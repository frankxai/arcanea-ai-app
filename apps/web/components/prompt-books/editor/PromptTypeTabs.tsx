'use client'

import {
  PhChatSquare, PhImage, PhImageSquare, PhChats, PhLink,
  PhListNumbers, PhCode, PhPen, PhChartBar,
} from '@/lib/phosphor-icons'
import { cn } from '@/lib/utils'
import { PROMPT_TYPES } from '@/lib/prompt-books/constants'
import type { PromptType } from '@/lib/prompt-books/types'

const ICONS: Record<string, React.ReactNode> = {
  MessageSquare: <PhChatSquare className="w-3.5 h-3.5" />,
  Image: <PhImage className="w-3.5 h-3.5" />,
  ImagePlus: <PhImageSquare className="w-3.5 h-3.5" />,
  MessagesSquare: <PhChats className="w-3.5 h-3.5" />,
  Link: <PhLink className="w-3.5 h-3.5" />,
  ListOrdered: <PhListNumbers className="w-3.5 h-3.5" />,
  Code: <PhCode className="w-3.5 h-3.5" />,
  PenTool: <PhPen className="w-3.5 h-3.5" />,
  BarChart3: <PhChartBar className="w-3.5 h-3.5" />,
}

interface PromptTypeTabsProps {
  value: PromptType
  onChange: (type: PromptType) => void
}

export function PromptTypeTabs({ value, onChange }: PromptTypeTabsProps) {
  const types = Object.entries(PROMPT_TYPES) as [PromptType, (typeof PROMPT_TYPES)[PromptType]][]

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-none py-1 px-1">
      {types.map(([type, config]) => {
        const isActive = type === value
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium',
              'whitespace-nowrap transition-all duration-150',
              isActive
                ? 'glass text-text-primary'
                : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03]',
            )}
            title={config.description}
          >
            {ICONS[config.icon]}
            <span>{config.label}</span>
          </button>
        )
      })}
    </div>
  )
}
