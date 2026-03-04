'use client'

import { PhPlus } from '@/lib/phosphor-icons'

interface QuickCaptureFABProps {
  onClick: () => void
}

export function QuickCaptureFAB({ onClick }: QuickCaptureFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-atlantean-teal-aqua to-atlantean-teal-aqua/70 flex items-center justify-center shadow-[0_4px_24px_rgba(127,255,212,0.2)] hover:shadow-[0_4px_32px_rgba(127,255,212,0.35)] hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Quick capture prompt (Cmd+Shift+P)"
    >
      <PhPlus className="w-6 h-6 text-cosmic-deep" weight="bold" />
    </button>
  )
}
