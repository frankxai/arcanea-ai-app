'use client'

import { useMemo, useState } from 'react'
import type { ChatSession, DateGroup } from './types'
import { GUARDIANS } from './data'
import { cn } from '@/lib/utils'

interface SidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onNewChat: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getDateGroup(date: Date): DateGroup {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return 'This Week'
  return 'Older'
}

function GuardianAvatar({
  guardianId,
  size = 28,
}: {
  guardianId: string
  size?: number
}) {
  const guardian = GUARDIANS.find((g) => g.id === guardianId)
  if (!guardian) return null
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-xs font-semibold select-none flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${guardian.glowColor}33, ${guardian.glowColor}66)`,
        border: `1.5px solid ${guardian.glowColor}60`,
        color: guardian.color,
        fontSize: size * 0.36,
      }}
    >
      {guardian.avatarInitials}
    </span>
  )
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [search, setSearch] = useState('')

  const grouped = useMemo(() => {
    const order: DateGroup[] = ['Today', 'Yesterday', 'This Week', 'Older']
    const map: Record<DateGroup, ChatSession[]> = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: [],
    }
    const q = search.toLowerCase()
    sessions
      .filter(
        (s) =>
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.lastMessage.toLowerCase().includes(q),
      )
      .forEach((s) => {
        map[getDateGroup(s.timestamp)].push(s)
      })
    return order.map((label) => ({ label, items: map[label] })).filter((g) => g.items.length > 0)
  }, [sessions, search])

  return (
    <aside
      className={cn(
        'flex flex-col h-full transition-all duration-300 ease-in-out select-none',
        'border-r border-[rgba(13,71,161,0.15)]',
        'bg-[#0d0d18]',
        collapsed ? 'w-14' : 'w-[280px]',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-[rgba(13,71,161,0.12)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            {/* Arcanea wordmark */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <polygon
                points="11,2 20,18 2,18"
                fill="none"
                stroke="#0d47a1"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="11" cy="11" r="2.5" fill="#ffd700" />
            </svg>
            <span className="font-serif text-base font-semibold tracking-wide text-foreground">
              Arcanea
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-[rgba(13,71,161,0.1)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* New Chat Button */}
      <div className={cn('px-3 pt-3', collapsed && 'px-2')}>
        <button
          onClick={onNewChat}
          className={cn(
            'w-full flex items-center gap-2 rounded-lg text-sm font-medium transition-all duration-200',
            'bg-[rgba(13,71,161,0.15)] hover:bg-[rgba(13,71,161,0.25)]',
            'border border-[rgba(13,71,161,0.3)] hover:border-[rgba(13,71,161,0.5)]',
            'text-primary hover:text-white',
            collapsed ? 'justify-center p-2' : 'px-3 py-2.5',
          )}
          aria-label="New Chat"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="relative">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              aria-label="Search conversations"
              className={cn(
                'w-full pl-8 pr-3 py-2 rounded-lg text-xs',
                'bg-[rgba(255,255,255,0.04)] border border-[rgba(13,71,161,0.15)]',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:border-primary/40 focus:bg-[rgba(13,71,161,0.06)]',
                'transition-colors',
              )}
            />
          </div>
        </div>
      )}

      {/* Session list */}
      <nav className="flex-1 overflow-y-auto mt-3 pb-4 space-y-1" aria-label="Chat sessions">
        {!collapsed &&
          grouped.map(({ label, items }) => (
            <div key={label}>
              <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {label}
              </p>
              {items.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => onSelectSession(session.id)}
                />
              ))}
            </div>
          ))}

        {collapsed &&
          sessions.map((session) => (
            <div key={session.id} className="px-2">
              <button
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  'w-full flex justify-center p-2 rounded-lg transition-colors',
                  session.id === activeSessionId
                    ? 'bg-[rgba(13,71,161,0.2)]'
                    : 'hover:bg-[rgba(255,255,255,0.05)]',
                )}
                aria-label={session.title}
              >
                <GuardianAvatar guardianId={session.guardianId} size={28} />
              </button>
            </div>
          ))}
      </nav>
    </aside>
  )
}

function SessionItem({
  session,
  isActive,
  onSelect,
}: {
  session: ChatSession
  isActive: boolean
  onSelect: () => void
}) {
  const guardian = GUARDIANS.find((g) => g.id === session.guardianId)
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left flex items-start gap-2.5 px-3 py-2.5 mx-1 rounded-lg transition-all duration-150 group',
        'hover:bg-[rgba(255,255,255,0.04)]',
        isActive
          ? 'bg-[rgba(13,71,161,0.12)] border-l-2 border-primary pl-2.5'
          : 'border-l-2 border-transparent',
      )}
      style={{ width: 'calc(100% - 8px)' }}
      aria-current={isActive ? 'true' : undefined}
    >
      <GuardianAvatar guardianId={session.guardianId} size={30} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span
            className={cn(
              'text-xs font-medium truncate',
              isActive ? 'text-foreground' : 'text-foreground/80',
            )}
          >
            {session.title}
          </span>
          <span className="text-[10px] text-muted-foreground/60 shrink-0">
            {formatTimestamp(session.timestamp)}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5 leading-4">
          <span style={{ color: guardian?.color }}>{guardian?.name}: </span>
          {session.lastMessage}
        </p>
      </div>
    </button>
  )
}
