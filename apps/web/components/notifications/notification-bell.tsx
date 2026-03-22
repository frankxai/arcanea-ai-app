'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function NotificationBell() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch unread count
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/unread-count')
      const data = await res.json()
      setCount(data.count ?? 0)
    } catch {
      // Silently fail — count stays at last known value
    }
  }, [])

  useEffect(() => {
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [fetchCount])

  // Realtime subscription for instant updates on new notifications
  useEffect(() => {
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
  }, [fetchCount])

  const fetchNotifications = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/notifications?page=1&pageSize=10')
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

  const handleToggle = () => {
    const next = !open
    setOpen(next)
    if (next) fetchNotifications()
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

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {count > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-teal-400 hover:text-teal-300"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-80">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-sm">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <a
                  key={n.id}
                  href={n.link || '#'}
                  className={`block p-3 hover:bg-white/5 transition-colors border-b border-white/5 ${!n.read ? 'bg-teal-500/5' : ''}`}
                >
                  <div className="flex gap-2">
                    <span className="text-lg">{typeIcons[n.type] || '\u{1F4CC}'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.read ? 'text-white font-medium' : 'text-white/70'}`}>
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-xs text-white/40 truncate mt-0.5">{n.body}</p>
                      )}
                      <p className="text-xs text-white/30 mt-1">{formatTimeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
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
