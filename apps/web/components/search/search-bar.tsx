'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  type: string
  similarity?: number
}

const RECENT_SEARCHES_KEY = 'arcanea-recent-searches'
const MAX_RECENT = 3

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === 'undefined') return
  try {
    const existing = getRecentSearches().filter(s => s !== query)
    const updated = [query, ...existing].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // localStorage not available
  }
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-white font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showRecent, setShowRecent] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debouncedQuery = useDebounce(query, 300)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Search on debounced query
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      if (debouncedQuery.length < 2 && !showRecent) closeDropdown()
      return
    }
    setShowRecent(false)
    setLoading(true)
    setActiveIndex(-1)
    fetch(`/api/search/fulltext?q=${encodeURIComponent(debouncedQuery)}&mode=fuzzy&limit=6`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const items = data.data?.results ?? []
          setResults(items)
          if (items.length > 0 || debouncedQuery.length >= 2) {
            openDropdown()
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  const openDropdown = () => {
    setOpen(true)
    requestAnimationFrame(() => setVisible(true))
  }

  const closeDropdown = () => {
    setVisible(false)
    setShowRecent(false)
    setTimeout(() => setOpen(false), 150)
  }

  const navigateTo = (path: string, searchTerm?: string) => {
    if (searchTerm) saveRecentSearch(searchTerm)
    router.push(path)
    closeDropdown()
    setQuery('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigateTo(`/gallery?q=${encodeURIComponent(query.trim())}`, query.trim())
    }
  }

  const handleFocus = () => {
    if (results.length > 0) {
      openDropdown()
    } else if (!query) {
      const recent = getRecentSearches()
      if (recent.length > 0) {
        setRecentSearches(recent)
        setShowRecent(true)
        openDropdown()
      }
    }
  }

  // Total navigable items count
  const totalItems = showRecent ? recentSearches.length : results.length + (results.length > 0 ? 1 : 0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeDropdown()
      setQuery('')
      inputRef.current?.blur()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => (prev + 1) % totalItems)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => (prev <= 0 ? totalItems - 1 : prev - 1))
    }
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      if (showRecent && recentSearches[activeIndex]) {
        setQuery(recentSearches[activeIndex])
        setShowRecent(false)
      } else if (activeIndex < results.length) {
        navigateTo(`/gallery?q=${encodeURIComponent(query)}`, query.trim())
      } else {
        // "View all" button
        navigateTo(`/gallery?q=${encodeURIComponent(query.trim())}`, query.trim())
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-search-item]')
      items[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const TYPE_COLORS: Record<string, string> = {
    text: 'bg-blue-500/20 text-blue-300',
    image: 'bg-purple-500/20 text-purple-300',
    video: 'bg-red-500/20 text-red-300',
    audio: 'bg-green-500/20 text-green-300',
    code: 'bg-yellow-500/20 text-yellow-300',
    mixed: 'bg-teal-500/20 text-teal-300',
  }

  const activeDescendant = activeIndex >= 0 ? `search-item-${activeIndex}` : undefined
  const showDropdown = open && (results.length > 0 || loading || showRecent || (debouncedQuery.length >= 2 && !loading))

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit} role="search">
        <div className={`flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-xl transition-all duration-200 focus-within:border-[#00bcd4]/30 focus-within:bg-white/[0.08] focus-within:shadow-[0_0_20px_rgba(0,188,212,0.06)] ${compact ? 'px-3 py-1.5' : 'px-4 py-2.5'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width={compact ? 14 : 16} height={compact ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(-1) }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Search creations..."
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="search-listbox"
            aria-activedescendant={activeDescendant}
            aria-autocomplete="list"
            className={`bg-transparent border-none outline-none text-white placeholder:text-white/30 w-full ${compact ? 'text-xs min-w-[140px]' : 'text-sm'}`}
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-white/20 border-t-[#00bcd4] rounded-full animate-spin flex-shrink-0" />
          )}
        </div>
      </form>

      {showDropdown && (
        <div
          id="search-listbox"
          role="listbox"
          ref={listRef}
          aria-label="Search results"
          className={`absolute left-0 right-0 top-full mt-2 bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 transition-all duration-150 ease-out ${
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          {/* Recent searches */}
          {showRecent && recentSearches.length > 0 && (
            <>
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                Recent searches
              </div>
              {recentSearches.map((term, i) => (
                <button
                  key={term}
                  id={`search-item-${i}`}
                  data-search-item
                  role="option"
                  aria-selected={activeIndex === i}
                  onClick={() => {
                    setQuery(term)
                    setShowRecent(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left border-b border-white/[0.04] last:border-0 ${
                    activeIndex === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 flex-shrink-0">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                  </svg>
                  <span className="text-sm text-white/60">{term}</span>
                </button>
              ))}
            </>
          )}

          {/* Loading skeleton */}
          {loading && results.length === 0 && !showRecent && (
            <div className="p-2 space-y-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                  <div className="w-10 h-4 rounded bg-white/[0.06]" />
                  <div className="flex-1 h-3.5 rounded bg-white/[0.06]" />
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && !showRecent && debouncedQuery.length >= 2 && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-white/40">No results for &ldquo;{debouncedQuery}&rdquo;</p>
              <p className="text-xs text-white/25 mt-1">Try different keywords or check your spelling</p>
            </div>
          )}

          {/* Results */}
          {!showRecent && results.length > 0 && (
            <>
              <div role="status" className="sr-only" aria-live="polite">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((r, i) => (
                <button
                  key={r.id}
                  id={`search-item-${i}`}
                  data-search-item
                  role="option"
                  aria-selected={activeIndex === i}
                  onClick={() => navigateTo(`/gallery?q=${encodeURIComponent(query)}`, query.trim())}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-white/[0.04] last:border-0 ${
                    activeIndex === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${TYPE_COLORS[r.type] || 'bg-white/10 text-white/50'}`}>
                    {r.type}
                  </span>
                  <span className="text-sm text-white/70 truncate flex-1">
                    {highlightMatch(r.title, debouncedQuery)}
                  </span>
                </button>
              ))}
              <button
                id={`search-item-${results.length}`}
                data-search-item
                role="option"
                aria-selected={activeIndex === results.length}
                onClick={() => navigateTo(`/gallery?q=${encodeURIComponent(query.trim())}`, query.trim())}
                className={`w-full px-4 py-2.5 text-xs text-[#00bcd4] transition-colors font-medium ${
                  activeIndex === results.length ? 'bg-[#00bcd4]/10' : 'hover:bg-[#00bcd4]/10'
                }`}
              >
                View all results for &ldquo;{query}&rdquo;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
