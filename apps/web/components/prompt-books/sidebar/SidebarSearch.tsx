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
