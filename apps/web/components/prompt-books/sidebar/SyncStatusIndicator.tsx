/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { cn } from '@/lib/utils'
import type { SyncStatus } from '@/lib/prompt-books/types'

interface SyncStatusIndicatorProps {
  status: SyncStatus
  lastSyncAt: string | null
}

const statusConfig: Record<SyncStatus, { color: string; label: string; animate?: boolean }> = {
  synced: { color: 'bg-green-400', label: 'Synced' },
  syncing: { color: 'bg-amber-400', label: 'Syncing...', animate: true },
  offline: { color: 'bg-gray-400', label: 'Offline' },
  error: { color: 'bg-red-400', label: 'Sync error' },
}

export function SyncStatusIndicator({ status, lastSyncAt }: SyncStatusIndicatorProps) {
  const config = statusConfig[status]

  const formattedTime = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="flex items-center gap-2 group" title={`${config.label}${formattedTime ? ` at ${formattedTime}` : ''}`}>
      <div className="relative">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            config.color,
            config.animate && 'animate-pulse',
          )}
        />
      </div>
      <span className="text-xs font-sans text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
        {config.label}
      </span>
    </div>
  )
}
