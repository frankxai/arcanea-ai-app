/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { PhWifiHigh, PhWifiSlash, PhArrowsClockwise, PhCloud, PhCloudSlash } from '@/lib/phosphor-icons'
import { cn } from '@/lib/utils'
import { usePromptBooksStore } from '@/lib/prompt-books/store'

export function ConnectionStatus() {
  const { syncStatus, lastSyncAt, setSyncStatus } = usePromptBooksStore()
  const [online, setOnline] = useState(true)

  useEffect(() => {
    setOnline(navigator.onLine)

    const handleOnline = () => {
      setOnline(true)
      setSyncStatus('syncing')
      // Reconnect will happen via PromptBooksSync
    }
    const handleOffline = () => {
      setOnline(false)
      setSyncStatus('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setSyncStatus])

  const statusConfig = {
    synced: { icon: PhCloud, label: 'Synced', color: 'text-success', pulse: false },
    syncing: { icon: PhArrowsClockwise, label: 'Syncing...', color: 'text-brand-accent', pulse: true },
    offline: { icon: PhCloudSlash, label: 'Offline', color: 'text-text-muted', pulse: false },
    error: { icon: PhWifiSlash, label: 'Sync error', color: 'text-error', pulse: false },
  }

  const config = statusConfig[syncStatus]
  const Icon = config.icon

  const lastSync = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 liquid-glass rounded-lg">
      <div className="flex items-center gap-1.5">
        {!online && <PhWifiSlash className="w-3 h-3 text-error" />}
        <Icon className={cn('w-3 h-3', config.color, config.pulse && 'animate-spin')} />
        <span className={cn('text-[10px] font-sans', config.color)}>
          {config.label}
        </span>
      </div>

      {lastSync && syncStatus === 'synced' && (
        <span className="text-[10px] font-sans text-text-muted/40">
          {lastSync}
        </span>
      )}
    </div>
  )
}
