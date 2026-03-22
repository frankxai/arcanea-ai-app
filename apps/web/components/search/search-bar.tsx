'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  type: string
  similarity?: number
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Search on debounced query
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    fetch(`/api/search/fulltext?q=${encodeURIComponent(debouncedQuery)}&mode=fuzzy&limit=6`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setResults(data.data?.results ?? [])
          setOpen(true)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/gallery?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  const TYPE_COLORS: Record<string, string> = {
    text: 'bg-blue-500/20 text-blue-300',
    image: 'bg-purple-500/20 text-purple-300',
    video: 'bg-red-500/20 text-red-300',
    audio: 'bg-green-500/20 text-green-300',
    code: 'bg-yellow-500/20 text-yellow-300',
    mixed: 'bg-teal-500/20 text-teal-300',
  }

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-xl transition-colors focus-within:border-[#00bcd4]/30 focus-within:bg-white/[0.08] ${compact ? 'px-3 py-1.5' : 'px-4 py-2.5'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width={compact ? 14 : 16} height={compact ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (results.length > 0) setOpen(true) }}
            placeholder="Search creations..."
            className={`bg-transparent border-none outline-none text-white placeholder:text-white/30 w-full ${compact ? 'text-xs' : 'text-sm'}`}
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-white/20 border-t-teal-400 rounded-full animate-spin flex-shrink-0" />
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {results.map(r => (
            <button
              key={r.id}
              onClick={() => {
                router.push(`/gallery?q=${encodeURIComponent(query)}`)
                setOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
            >
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${TYPE_COLORS[r.type] || 'bg-white/10 text-white/50'}`}>
                {r.type}
              </span>
              <span className="text-sm text-white/90 truncate flex-1">{r.title}</span>
            </button>
          ))}
          <button
            onClick={handleSubmit as any}
            className="w-full px-4 py-2.5 text-xs text-[#00bcd4] hover:bg-[#00bcd4]/10 transition-colors font-medium"
          >
            View all results for &ldquo;{query}&rdquo;
          </button>
        </div>
      )}
    </div>
  )
}
