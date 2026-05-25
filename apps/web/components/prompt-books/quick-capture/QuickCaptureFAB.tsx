/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { PhPlus } from '@/lib/phosphor-icons'

interface QuickCaptureFABProps {
  onClick: () => void
}

export function QuickCaptureFAB({ onClick }: QuickCaptureFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-atlantean-teal-aqua to-atlantean-teal-aqua/70 flex items-center justify-center shadow-[0_4px_24px_rgba(0,188,212,0.2)] hover:shadow-[0_4px_32px_rgba(0,188,212,0.35)] hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Quick capture prompt (Cmd+Shift+P)"
    >
      <PhPlus className="w-6 h-6 text-cosmic-deep" weight="bold" />
    </button>
  )
}
