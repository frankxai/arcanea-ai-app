/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { PhMagnifyingGlass } from '@/lib/phosphor-icons'
import { Input } from '@/components/ui/input'

interface SidebarSearchProps {
  value: string
  onChange: (value: string) => void
}

export function SidebarSearch({ value, onChange }: SidebarSearchProps) {
  return (
    <div className="relative">
      <PhMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search collections..."
        className="liquid-glass border-white/[0.06] pl-9 h-8 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-accent/50"
      />
    </div>
  )
}
