/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { useEffect, useRef } from 'react'
import { usePromptBooksStore } from '@/lib/prompt-books/store'
import { PromptBooksSync } from '@/lib/prompt-books/sync'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Main hook for initializing and using Prompt Books.
 * Call this once at the top-level prompt-books page.
 */
export function usePromptBooks(client: SupabaseClient | null, userId: string | null) {
  const store = usePromptBooksStore()
  const syncRef = useRef<PromptBooksSync | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!client || !userId || initializedRef.current) return

    initializedRef.current = true
    store.initialize(client, userId)

    // Set up realtime sync
    const sync = new PromptBooksSync(client, userId)
    syncRef.current = sync
    sync.subscribe()

    return () => {
      sync.unsubscribe()
      syncRef.current = null
      initializedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, userId])

  return store
}
