'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'

export function NotificationBell() {
  const { user, isLoading: authLoading } = useAuth()
  const [count, setCount] = useState(0)
  const [prevCount, setPrevCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<SVGSVGElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Fetch unread count
  const fetchCount = useCallback(async () => {
    if (!user) {
      setPrevCount(0)
      setCount(0)
      return
    }

    try {
      const res = await fetch('/api/notifications/unread-count')
      if (res.status === 401) {
        setPrevCount(0)
        setCount(0)
        return
      }
      const data = await res.json()
      const newCount = data.count ?? 0
      setPrevCount(count)
      setCount(newCount)
    } catch {
      // Silently fail — count stays at last known value
    }
  }, [count, user])

  useEffect(() => {
    if (!user) return
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [fetchCount, user])

  // Trigger ring animation when count increases
  useEffect(() => {
    if (count > prevCount && prevCount !== 0 && bellRef.current) {
      bellRef.current.classList.remove('animate-bell-ring')
      // Force reflow via getBoundingClientRect (works on SVG elements)
      bellRef.current.getBoundingClientRect()
      bellRef.current.classList.add('animate-bell-ring')
    }
  }, [count, prevCount])

  // Realtime subscription for instant updates on new notifications
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      }, () => {
        fetchCount()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchCount, user])

  // Click outside to close
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Escape key to close + focus trap
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown()
        triggerRef.current?.focus()
      }
      if (e.key === 'Tab' && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button, a, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const fetchNotifications = async () => {
    if (!user || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/notifications?page=1&pageSize=20')
      if (res.status === 401) {
        setNotifications([])
        return
      }
      const data = await res.json()
      if (data.success) {
        setNotifications(data.data?.notifications ?? [])
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  const openDropdown = () => {
    setOpen(true)
    fetchNotifications()
    // Allow DOM to render, then animate in
    requestAnimationFrame(() => {
      setVisible(true)
      // Focus the first interactive element
      setTimeout(() => firstFocusableRef.current?.focus(), 80)
    })
  }

  const closeDropdown = () => {
    setVisible(false)
    setTimeout(() => setOpen(false), 200)
  }

  const handleToggle = () => {
    if (open) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' })
      setCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch {
      // Silently fail
    }
  }

  const handleMarkOneRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
      setCount(prev => Math.max(0, prev - 1))
    } catch {
      // Silently fail
    }
  }

  const typeIcons: Record<string, string> = {
    like: '\u2665',
    follow: '\u{1F464}',
    comment: '\u{1F4AC}',
    mention: '@',
    achievement: '\u{1F3C6}',
    system: '\u26A1',
    council: '\u{1F52E}',
    gate_unlock: '\u{1F6AA}',
  }

  // Group notifications by date
  const grouped = groupByDate(notifications)

  if (authLoading || !user) {
    return null
  }

  return (
    <>
      <style jsx global>{`
        @keyframes bell-ring {
          0% { transform: rotate(0); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(8deg); }
          60% { transform: rotate(-6deg); }
          75% { transform: rotate(3deg); }
          100% { transform: rotate(0); }
        }
        .animate-bell-ring {
          animation: bell-ring 0.6s ease-in-out;
          transform-origin: top center;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        .animate-pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }
      `}</style>
      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          onClick={handleToggle}
          className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
          aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <svg
            ref={bellRef}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {count > 0 && (
            <span
              aria-live="polite"
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium animate-pulse-dot"
            >
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Notifications"
            className={`absolute right-0 top-full mt-2 w-80 max-h-[420px] bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 transition-all duration-200 ease-out ${
              visible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h3 className="font-semibold text-sm text-white">Notifications</h3>
              {count > 0 && (
                <button
                  ref={firstFocusableRef}
                  onClick={handleMarkAllRead}
                  className="text-xs text-[#00bcd4] hover:text-[#00bcd4]/80 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="overflow-y-auto max-h-[360px] scroll-smooth overscroll-contain">
              {loading && notifications.length === 0 ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-2 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-white/5 rounded w-3/4" />
                        <div className="h-2 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">
                  No notifications yet
                </div>
              ) : (
                grouped.map((group, gi) => (
                  <div key={group.label}>
                    <div className="sticky top-0 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
                      {group.label}
                    </div>
                    {group.items.map((n) => (
                      <a
                        key={n.id}
                        href={n.link || undefined}
                        role={n.link ? undefined : 'button'}
                        tabIndex={0}
                        onClick={(e) => {
                          if (!n.link) e.preventDefault()
                          if (!n.read) handleMarkOneRead(n.id)
                          if (!n.link) closeDropdown()
                        }}
                        className={`block p-3 hover:bg-white/[0.06] transition-all duration-150 border-b border-white/[0.04] cursor-pointer ${
                          !n.read ? 'bg-[#00bcd4]/[0.04]' : ''
                        }`}
                      >
                        <div className="flex gap-2.5">
                          <span className="text-lg leading-none mt-0.5">{typeIcons[n.type] || '\u{1F4CC}'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!n.read ? 'text-white font-medium' : 'text-white/60'}`}>
                              {n.title}
                            </p>
                            {n.body && (
                              <p className="text-xs text-white/35 truncate mt-0.5">{n.body}</p>
                            )}
                            <p className="text-[11px] text-white/25 mt-1">{formatTimeAgo(n.createdAt)}</p>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-[#00bcd4] mt-1.5 flex-shrink-0 animate-pulse-dot" />
                          )}
                        </div>
                      </a>
                    ))}
                    {gi < grouped.length - 1 && (
                      <div className="h-px bg-white/[0.06]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

interface NotificationItem {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  createdAt: string
}

interface NotificationGroup {
  label: string
  items: NotificationItem[]
}

function groupByDate(notifications: NotificationItem[]): NotificationGroup[] {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterdayStart = todayStart - 86400000
  const weekStart = todayStart - 6 * 86400000

  const groups: Record<string, NotificationItem[]> = {}
  const order = ['Today', 'Yesterday', 'This week', 'Earlier']

  for (const n of notifications) {
    const ts = new Date(n.createdAt).getTime()
    let label: string
    if (ts >= todayStart) label = 'Today'
    else if (ts >= yesterdayStart) label = 'Yesterday'
    else if (ts >= weekStart) label = 'This week'
    else label = 'Earlier'

    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  }

  return order
    .filter(label => groups[label]?.length)
    .map(label => ({ label, items: groups[label] }))
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}
