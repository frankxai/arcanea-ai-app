/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  PhBookOpen,
  PhBooks,
  PhCheckCircle,
  PhCopy,
  PhDatabase,
  PhMagnifyingGlass,
  PhPlus,
  PhShield,
  PhX,
} from '@/lib/phosphor-icons'
import {
  PROMPT_REGISTRY_SCOPES,
  formatPublicRegistryBookMarkdown,
  formatPublicRegistryPromptMarkdown,
  getPublicRegistryScopeCounts,
  publicRegistryBookToCreateCollectionInput,
  publicRegistryPromptToCreatePromptInput,
  searchPublicRegistry,
} from '@/lib/prompt-books/public-registry'
import { usePromptBooksStore } from '@/lib/prompt-books/store'
import type {
  PromptRegistryScope,
  PublicRegistryBook,
  PublicRegistryPrompt,
} from '@/lib/prompt-books/public-registry'

type ScopeFilter = 'all' | PromptRegistryScope
type RegistryItem =
  | { kind: 'prompt'; value: PublicRegistryPrompt }
  | { kind: 'book'; value: PublicRegistryBook }

interface RegistryBrowserProps {
  open: boolean
  onClose: () => void
}

const SCOPE_LABELS: Record<ScopeFilter, string> = {
  all: 'All',
  starlight: 'Starlight',
  arcanea: 'Arcanea',
  general: 'General',
  frankx: 'FrankX',
}

const SCOPE_HINTS: Record<PromptRegistryScope, string> = {
  starlight: 'Swarms, repo work, operations',
  arcanea: 'Worldbuilding, canon, lore',
  general: 'Portable patterns',
  frankx: 'Business and creator systems',
}

export function RegistryBrowser({ open, onClose }: RegistryBrowserProps) {
  const { activeCollectionId, createPrompt, createCollection } = usePromptBooksStore()
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<ScopeFilter>('all')
  const [selectedItem, setSelectedItem] = useState<RegistryItem | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const scopeCounts = getPublicRegistryScopeCounts()

  const results = useMemo(() => {
    return searchPublicRegistry(query, scope === 'all' ? undefined : scope)
  }, [query, scope])

  const items = useMemo<RegistryItem[]>(() => {
    return [
      ...results.prompts.map((prompt) => ({ kind: 'prompt' as const, value: prompt })),
      ...results.books.map((book) => ({ kind: 'book' as const, value: book })),
    ]
  }, [results.books, results.prompts])

  useEffect(() => {
    if (!open) return
    setSelectedItem(null)
    setNotice(null)
  }, [open])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (selectedItem && !items.some((item) => getItemKey(item) === getItemKey(selectedItem))) {
      setSelectedItem(null)
    }
  }, [items, selectedItem])

  if (!open) return null

  const activeItem = selectedItem ?? items[0] ?? null

  const handleSave = async (item: RegistryItem) => {
    const id = getItemKey(item)
    setSavingId(id)
    setNotice(null)

    try {
      if (item.kind === 'prompt') {
        await createPrompt(
          publicRegistryPromptToCreatePromptInput(
            item.value,
            activeCollectionId ?? undefined,
          ),
        )
        setNotice(`Saved prompt index: ${item.value.title}`)
      } else {
        await createCollection(publicRegistryBookToCreateCollectionInput(item.value))
        setNotice(`Saved book collection: ${item.value.title}`)
      }
    } catch {
      setNotice('Save failed. Check your Prompt Books connection and try again.')
    } finally {
      setSavingId(null)
    }
  }

  const handleCopy = async (item: RegistryItem) => {
    const id = getItemKey(item)
    const markdown =
      item.kind === 'prompt'
        ? formatPublicRegistryPromptMarkdown(item.value)
        : formatPublicRegistryBookMarkdown(item.value)

    try {
      await navigator.clipboard.writeText(markdown)
      setCopiedId(id)
      setNotice('Copied registry brief.')
      window.setTimeout(() => setCopiedId(null), 1500)
    } catch {
      setNotice('Copy failed in this browser.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm">
      <div className="flex min-h-dvh items-end justify-center p-0 sm:items-center sm:p-6">
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Prompt registry"
          className={cn(
            'flex h-[92dvh] w-full flex-col overflow-hidden',
            'rounded-t-2xl border border-white/[0.08] bg-[rgba(9,9,11,0.96)] shadow-2xl',
            'sm:h-[82vh] sm:max-w-5xl sm:rounded-2xl',
          )}
        >
          <header className="border-b border-white/[0.06] px-4 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <PhDatabase className="h-4 w-4 text-atlantean-teal-aqua" weight="duotone" />
                  <h2 className="font-display text-sm font-semibold text-text-primary">
                    Prompt Registry
                  </h2>
                </div>
                <p className="max-w-2xl text-xs leading-relaxed text-text-muted">
                  Search reviewed prompt patterns, save registry cards, and keep Starlight,
                  Arcanea, general, and FrankX prompts separated.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0 text-text-muted hover:text-text-primary"
                aria-label="Close registry"
              >
                <PhX className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <label className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                <PhMagnifyingGlass className="h-4 w-4 shrink-0 text-text-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by title, tag, source, scope..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="rounded-md p-1 text-text-muted hover:bg-white/[0.05] hover:text-text-primary"
                    aria-label="Clear registry search"
                  >
                    <PhX className="h-3 w-3" />
                  </button>
                )}
              </label>

              <div className="flex gap-1 overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
                {(['all', ...PROMPT_REGISTRY_SCOPES] as ScopeFilter[]).map((scopeOption) => (
                  <button
                    key={scopeOption}
                    type="button"
                    onClick={() => setScope(scopeOption)}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                      scope === scopeOption
                        ? 'bg-white/[0.08] text-text-primary'
                        : 'text-text-muted hover:bg-white/[0.04] hover:text-text-secondary',
                    )}
                  >
                    {SCOPE_LABELS[scopeOption]}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs text-text-muted">
                  {items.length} result{items.length !== 1 ? 's' : ''}
                </p>
                <div className="hidden items-center gap-2 text-[10px] text-text-muted/60 sm:flex">
                  <PhShield className="h-3 w-3" />
                  Metadata mirror · canonical body stays in Git
                </div>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-10 text-center">
                  <PhMagnifyingGlass className="mx-auto mb-3 h-7 w-7 text-text-muted/40" />
                  <p className="text-sm text-text-secondary">No registry entries match.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {items.map((item) => {
                    const isSelected =
                      activeItem && getItemKey(activeItem) === getItemKey(item)
                    const title = item.value.title
                    const scopeValue = item.value.scope

                    return (
                      <button
                        key={getItemKey(item)}
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className={cn(
                          'rounded-xl border p-4 text-left transition-colors',
                          isSelected
                            ? 'border-atlantean-teal-aqua/30 bg-atlantean-teal-aqua/[0.04]'
                            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]',
                        )}
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
                              {item.kind === 'prompt' ? (
                                <PhBookOpen className="h-4 w-4 text-atlantean-teal-aqua" />
                              ) : (
                                <PhBooks className="h-4 w-4 text-creation-gold" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-text-primary">
                                {title}
                              </p>
                              <p className="mt-0.5 text-[11px] text-text-muted">
                                {item.kind === 'prompt' ? item.value.description : item.value.summary}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-wide text-text-muted">
                            {item.kind}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-text-secondary">
                            {SCOPE_LABELS[scopeValue]}
                          </span>
                          {item.kind === 'prompt' && (
                            <>
                              <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-text-muted">
                                rank {item.value.rankScore}
                              </span>
                              <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-text-muted">
                                {item.value.redTeamStatus}
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <aside className="min-h-0 border-t border-white/[0.06] bg-white/[0.015] p-4 lg:border-l lg:border-t-0 sm:p-5">
              {activeItem ? (
                <RegistryDetail
                  item={activeItem}
                  saving={savingId === getItemKey(activeItem)}
                  copied={copiedId === getItemKey(activeItem)}
                  onSave={() => handleSave(activeItem)}
                  onCopy={() => handleCopy(activeItem)}
                />
              ) : (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-sm text-text-secondary">Select a registry entry.</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                {PROMPT_REGISTRY_SCOPES.map((scopeName) => (
                  <div
                    key={scopeName}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <p className="text-xs font-semibold text-text-primary">
                      {SCOPE_LABELS[scopeName]}
                    </p>
                    <p className="mt-1 text-[10px] leading-snug text-text-muted">
                      {SCOPE_HINTS[scopeName]}
                    </p>
                    <p className="mt-2 text-[10px] text-text-muted/70">
                      {scopeCounts[scopeName].prompts} prompts · {scopeCounts[scopeName].books} books
                    </p>
                  </div>
                ))}
              </div>

              {notice && (
                <div className="mt-4 rounded-lg border border-atlantean-teal-aqua/20 bg-atlantean-teal-aqua/[0.04] px-3 py-2 text-xs text-text-secondary">
                  {notice}
                </div>
              )}
            </aside>
          </div>
        </section>
      </div>
    </div>
  )
}

function RegistryDetail({
  item,
  saving,
  copied,
  onSave,
  onCopy,
}: {
  item: RegistryItem
  saving: boolean
  copied: boolean
  onSave: () => void
  onCopy: () => void
}) {
  const { value } = item

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
          {item.kind === 'prompt' ? (
            <PhBookOpen className="h-4 w-4 text-atlantean-teal-aqua" />
          ) : (
            <PhBooks className="h-4 w-4 text-creation-gold" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary">{value.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            {item.kind === 'prompt' ? item.value.description : item.value.summary}
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-2 text-xs">
        <MetaRow label="Scope" value={SCOPE_LABELS[value.scope]} />
        <MetaRow label="Path" value={value.path} />
        {item.kind === 'prompt' && (
          <>
            <MetaRow label="Category" value={item.value.category} />
            <MetaRow label="Rank" value={String(item.value.rankScore)} />
            <MetaRow label="Eval" value={item.value.evalScore === null ? 'not run' : String(item.value.evalScore)} />
            <MetaRow label="Red team" value={item.value.redTeamStatus} />
            <MetaRow label="Attribution" value={item.value.attribution ?? 'none'} />
          </>
        )}
        {item.kind === 'book' && (
          <>
            <MetaRow label="Status" value={item.value.status} />
            <MetaRow label="Patterns" value={String(item.value.linkedPatterns.length)} />
          </>
        )}
      </div>

      {item.kind === 'prompt' && item.value.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {item.value.tags.slice(0, 8).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={onCopy}
          className="justify-center"
          iconLeft={copied ? <PhCheckCircle className="h-4 w-4" /> : <PhCopy className="h-4 w-4" />}
        >
          {copied ? 'Copied' : 'Copy brief'}
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          loading={saving}
          className="justify-center"
          iconLeft={<PhPlus className="h-4 w-4" />}
        >
          {item.kind === 'prompt' ? 'Save prompt index' : 'Save book'}
        </Button>
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-2">
      <span className="text-text-muted/70">{label}</span>
      <span className="truncate text-text-secondary" title={value}>
        {value}
      </span>
    </div>
  )
}

function getItemKey(item: RegistryItem) {
  return `${item.kind}:${item.value.id}`
}
