/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { useState } from 'react'

interface SaveCreationButtonProps {
  content: string
  onSaved?: (creationId: string) => void
}

const ELEMENT_KEYWORDS: Record<string, string[]> = {
  Fire: ['fire', 'transform', 'courage', 'power', 'energy', 'forge', 'flame', 'draconia'],
  Water: ['water', 'flow', 'heal', 'emotion', 'crystal', 'ocean', 'leyla', 'stream'],
  Earth: ['earth', 'ground', 'stable', 'grow', 'foundation', 'stone', 'lyssandria', 'root'],
  Wind: ['wind', 'air', 'free', 'speed', 'change', 'breath', 'alera', 'voice'],
  Spirit: ['spirit', 'soul', 'transcend', 'conscious', 'light', 'lumina', 'shinkami', 'void'],
}

const GATE_KEYWORDS: Record<string, string[]> = {
  Foundation: ['foundation', 'root', 'basic', 'ground', 'survive', 'stable'],
  Flow: ['flow', 'create', 'emotion', 'express', 'feel'],
  Fire: ['fire', 'power', 'will', 'transform', 'courage'],
  Heart: ['heart', 'love', 'heal', 'connect', 'empathy'],
  Voice: ['voice', 'truth', 'speak', 'express', 'authentic'],
  Sight: ['sight', 'vision', 'intuition', 'insight', 'see'],
  Crown: ['crown', 'enlighten', 'wisdom', 'understand', 'aware'],
  Starweave: ['star', 'perspective', 'shift', 'transform', 'weave'],
  Unity: ['unity', 'partner', 'together', 'merge', 'collaborate'],
  Source: ['source', 'meta', 'conscious', 'infinite', 'origin'],
}

function detectElement(text: string): string | undefined {
  const lower = text.toLowerCase()
  let best: string | undefined
  let bestScore = 0
  for (const [element, keywords] of Object.entries(ELEMENT_KEYWORDS)) {
    const score = keywords.filter(k => lower.includes(k)).length
    if (score > bestScore) { bestScore = score; best = element }
  }
  return bestScore >= 1 ? best : undefined
}

function detectGate(text: string): string | undefined {
  const lower = text.toLowerCase()
  let best: string | undefined
  let bestScore = 0
  for (const [gate, keywords] of Object.entries(GATE_KEYWORDS)) {
    const score = keywords.filter(k => lower.includes(k)).length
    if (score > bestScore) { bestScore = score; best = gate }
  }
  return bestScore >= 1 ? best : undefined
}

export function SaveCreationButton({ content, onSaved }: SaveCreationButtonProps) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [title, setTitle] = useState('')
  const [showForm, setShowForm] = useState(false)

  if (content.length < 50) return null

  const [errorMsg, setErrorMsg] = useState('')

  const handleSave = async () => {
    if (!title.trim()) return
    setState('saving')
    setErrorMsg('')

    const element = detectElement(content)
    const gate = detectGate(content)

    try {
      const activeProjectId =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('arcanea_active_chat_project')
          : null

      const res = await fetch('/api/creations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
          content: { text: content, source: 'chat' },
          type: 'text',
          status: 'draft',
          visibility: 'private',
          element,
          gate,
          tags: ['from-chat', element?.toLowerCase(), gate?.toLowerCase()].filter(Boolean),
          ...(activeProjectId ? { projectId: activeProjectId } : {}),
        }),
      })

      if (!res.ok) {
        const msg = res.status === 401 ? 'Sign in to save'
          : res.status === 400 ? 'Try a shorter title'
          : 'Server error — try again'
        setErrorMsg(msg)
        setState('error')
        return
      }

      const data = await res.json()
      if (data.success) {
        setState('saved')
        onSaved?.(data.data?.creation?.id)
      } else {
        setErrorMsg(data.error || 'Save failed')
        setState('error')
      }
    } catch {
      setErrorMsg('Connection failed — try again')
      setState('error')
    }
  }

  if (state === 'saved') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--arc-brand-atlantean-teal)]/70">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        Saved to your creations
      </span>
    )
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--arc-brand-atlantean-teal)]/40"
        title="Save as creation"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        <span>Save</span>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setShowForm(false) }}
        placeholder="Name this creation..."
        className="flex-1 px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-white placeholder:text-white/30 outline-none focus:border-[var(--arc-brand-atlantean-teal)]/30"
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={!title.trim() || state === 'saving'}
        className="px-3 py-1.5 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] text-xs rounded-lg border border-[var(--arc-brand-atlantean-teal)]/20 hover:bg-[var(--arc-brand-atlantean-teal)]/20 disabled:opacity-40 transition-colors"
      >
        {state === 'saving' ? '...' : 'Save'}
      </button>
      <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white/50 text-xs">
        Cancel
      </button>
      {state === 'error' && (
        <span className="flex items-center gap-1.5 text-[10px] text-red-400/70">
          {errorMsg || 'Failed'}
          <button onClick={() => { setState('idle'); setErrorMsg(''); }} className="underline hover:text-red-300">Retry</button>
        </span>
      )}
    </div>
  )
}
