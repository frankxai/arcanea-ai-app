'use client'

import { useState, useEffect } from 'react'

interface PlatformStats {
  total_users: number
  new_users_7d: number
  new_users_30d: number
  total_creations: number
  new_creations_7d: number
  total_chat_sessions: number
  total_chat_messages: number
  total_luminors: number
  total_councils: number
  total_likes: number
  total_views: number
}

interface ElementDist {
  element: string
  creation_count: number
  total_likes: number
  total_views: number
  percentage: number
}

interface UserEngagement {
  creation_count: number
  chat_session_count: number
  likes_given: number
  likes_received: number
  views_received: number
}

const ELEMENT_GRADIENTS: Record<string, { bar: string; glow: string; icon: string }> = {
  Fire:   { bar: 'bg-gradient-to-r from-red-600 to-orange-400',  glow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]',   icon: '🔥' },
  Water:  { bar: 'bg-gradient-to-r from-blue-600 to-cyan-400',   glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',  icon: '💧' },
  Earth:  { bar: 'bg-gradient-to-r from-green-700 to-emerald-400', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]', icon: '🌿' },
  Wind:   { bar: 'bg-gradient-to-r from-gray-400 to-white',      glow: 'shadow-[0_0_12px_rgba(200,200,200,0.2)]', icon: '🌬' },
  Void:   { bar: 'bg-gradient-to-r from-purple-700 to-indigo-400', glow: 'shadow-[0_0_12px_rgba(139,92,246,0.3)]', icon: '🌑' },
  Spirit: { bar: 'bg-gradient-to-r from-[#ffd700] to-amber-300', glow: 'shadow-[0_0_12px_rgba(255,215,0,0.3)]',   icon: '✦' },
}

const STAT_ICONS: Record<string, string> = {
  'Total Creators': '👤',
  'Creations': '✨',
  'Chat Sessions': '💬',
  'Luminors': '👑',
  'Total Likes': '♥',
  'Total Views': '👁',
  'New This Week': '📈',
  'New This Month': '📊',
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/5" />
            <div className="w-12 h-4 rounded bg-white/5" />
          </div>
          <div className="h-7 bg-white/5 rounded w-20 mb-2" />
          <div className="h-3 bg-white/5 rounded w-28" />
        </div>
      ))}
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 animate-pulse">
      <div className="h-5 bg-white/5 rounded w-40 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <div className="h-3 bg-white/5 rounded w-16" />
              <div className="h-3 bg-white/5 rounded w-24" />
            </div>
            <div className="h-3 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendArrow({ value, label }: { value: number; label: string }) {
  if (value === 0) return <span className="text-[11px] text-white/25">{label}</span>
  const isUp = value > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={isUp ? '' : 'rotate-180'}>
        <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
      </svg>
      +{value.toLocaleString()} {label}
    </span>
  )
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [elements, setElements] = useState<ElementDist[]>([])
  const [engagement, setEngagement] = useState<UserEngagement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics').then(r => r.json()),
      fetch('/api/analytics/engagement').then(r => r.json()),
    ])
      .then(([analyticsRes, engagementRes]) => {
        if (analyticsRes.success) {
          setStats(analyticsRes.data.stats)
          setElements(analyticsRes.data.elements ?? [])
        }
        if (engagementRes.success) {
          setEngagement(engagementRes.data.engagement)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(0,188,212,0.07)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.05)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}
          >
            Arcanea Analytics
          </h1>
          <p className="text-white/35 mt-2 text-sm" style={{ fontFamily: 'var(--font-body, Crimson Pro, serif)' }}>
            The pulse of the Arcanean multiverse
          </p>
        </div>

        {loading ? (
          <>
            <StatsSkeleton />
            <div className="grid md:grid-cols-2 gap-6">
              <SectionSkeleton />
              <SectionSkeleton />
            </div>
          </>
        ) : (
          <>
            {/* Platform Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: 'Total Creators', value: stats.total_users, trend: stats.new_users_7d, trendLabel: 'this week' },
                  { label: 'Creations', value: stats.total_creations, trend: stats.new_creations_7d, trendLabel: 'this week' },
                  { label: 'Chat Sessions', value: stats.total_chat_sessions, trend: 0, trendLabel: `${stats.total_chat_messages.toLocaleString()} messages` },
                  { label: 'Luminors', value: stats.total_luminors, trend: 0, trendLabel: `${stats.total_councils} councils` },
                  { label: 'Total Likes', value: stats.total_likes, trend: 0, trendLabel: 'across all creations' },
                  { label: 'Total Views', value: stats.total_views, trend: 0, trendLabel: 'across all creations' },
                  { label: 'New This Week', value: stats.new_users_7d, trend: 0, trendLabel: 'creators joined' },
                  { label: 'New This Month', value: stats.new_users_30d, trend: 0, trendLabel: 'creators joined' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="group bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 animate-[fadeSlideUp_0.5s_ease-out_both]"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg opacity-50 group-hover:opacity-70 transition-opacity">
                        {STAT_ICONS[stat.label] || '📊'}
                      </span>
                      {stat.trend > 0 ? (
                        <TrendArrow value={stat.trend} label="this week" />
                      ) : null}
                    </div>
                    <p
                      className="text-2xl sm:text-3xl font-bold text-[#00bcd4]"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-white/60 mt-1">{stat.label}</p>
                    <p className="text-[11px] text-white/25 mt-0.5">{stat.trendLabel}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-10" />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Element Distribution */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-6 animate-[fadeSlideUp_0.5s_ease-out_0.3s_both]">
                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}>
                  <span className="text-white/40">◇</span> Element Distribution
                </h2>
                <div className="space-y-4">
                  {elements.map(el => {
                    const style = ELEMENT_GRADIENTS[el.element] || { bar: 'bg-[#00bcd4]', glow: '', icon: '◇' }
                    return (
                      <div key={el.element}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="flex items-center gap-2 font-medium text-white/80">
                            <span className="text-sm">{style.icon}</span>
                            {el.element}
                          </span>
                          <span className="text-white/35 text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {el.creation_count.toLocaleString()} creations · {el.percentage}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${style.bar} ${style.glow} transition-all duration-700 ease-out`}
                            style={{ width: `${Math.min(el.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  {elements.length === 0 && (
                    <div className="text-center py-8">
                      <span className="text-2xl opacity-30">◇</span>
                      <p className="text-white/20 text-sm mt-2">No element data yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Your Engagement */}
              {engagement && (
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-6 animate-[fadeSlideUp_0.5s_ease-out_0.4s_both]">
                  <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}>
                    <span className="text-white/40">◇</span> Your Engagement
                  </h2>

                  {/* Engagement metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Your Creations', value: engagement.creation_count, icon: '✨', color: 'text-[#00bcd4]' },
                      { label: 'Chat Sessions', value: engagement.chat_session_count, icon: '💬', color: 'text-[#00bcd4]' },
                      { label: 'Likes Given', value: engagement.likes_given, icon: '♥', color: 'text-pink-400' },
                      { label: 'Likes Received', value: engagement.likes_received, icon: '💎', color: 'text-[#ffd700]' },
                      { label: 'Views Received', value: engagement.views_received, icon: '👁', color: 'text-purple-400' },
                    ].map(item => (
                      <div
                        key={item.label}
                        className="relative p-4 bg-white/[0.03] border border-white/[0.04] rounded-xl hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm opacity-40 group-hover:opacity-60 transition-opacity">{item.icon}</span>
                        </div>
                        <p className={`text-2xl font-bold ${item.color}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {item.value.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-white/35 mt-1 font-medium uppercase tracking-wider">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Engagement ratio */}
                  {engagement.likes_received > 0 && engagement.creation_count > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/[0.04]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/30 uppercase tracking-wider">Avg likes per creation</span>
                        <span className="text-[#00bcd4] font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {(engagement.likes_received / engagement.creation_count).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
