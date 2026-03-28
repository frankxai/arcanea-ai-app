'use client'

import { useState, useEffect } from 'react'

type LeaderboardType = 'xp' | 'creations' | 'likes' | 'streak'

interface LeaderboardEntry {
  user_id: string
  display_name: string
  avatar_url: string | null
  magic_rank: string
  gates_open: number
  xp: number
  score: number
  rank: number
}

const TABS: { key: LeaderboardType; label: string; icon: string }[] = [
  { key: 'xp', label: 'XP', icon: '⚡' },
  { key: 'creations', label: 'Creations', icon: '✨' },
  { key: 'likes', label: 'Most Loved', icon: '♥' },
  { key: 'streak', label: 'Streak', icon: '🔥' },
]

const RANK_COLORS: Record<string, string> = {
  Luminor: 'text-[#ffd700]',
  Archmage: 'text-purple-400',
  Master: 'text-[#00bcd4]',
  Mage: 'text-[#00bcd4]/70',
  Apprentice: 'text-white/50',
}

const RANK_BG: Record<string, string> = {
  Luminor: 'bg-[#ffd700]/[0.04]',
  Archmage: 'bg-purple-500/[0.04]',
  Master: 'bg-[#00bcd4]/[0.04]',
  Mage: 'bg-[#00bcd4]/[0.02]',
  Apprentice: '',
}

function GateBar({ gates, size = 'sm' }: { gates: number; size?: 'sm' | 'md' }) {
  const h = size === 'md' ? 'h-2' : 'h-1.5'
  return (
    <div className={`flex gap-0.5 ${size === 'md' ? 'w-24' : 'w-16'}`} role="meter" aria-label={`${gates} of 10 gates open`} aria-valuenow={gates} aria-valuemin={0} aria-valuemax={10}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 ${h} rounded-full transition-all duration-500 ${
            i < gates
              ? 'bg-[#00bcd4] shadow-[0_0_6px_rgba(0,188,212,0.5)]'
              : 'bg-white/10'
          }`}
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  )
}

function PodiumCard({ entry, place }: { entry: LeaderboardEntry; place: 1 | 2 | 3 }) {
  const config = {
    1: {
      order: 'order-2',
      height: 'h-36',
      ring: 'ring-[#ffd700]/40',
      glow: 'shadow-[0_0_40px_rgba(255,215,0,0.15)]',
      gradient: 'from-[#ffd700]/20 via-[#ffd700]/5 to-transparent',
      badge: '👑',
      badgeColor: 'text-[#ffd700]',
      avatarSize: 'w-20 h-20',
      nameSize: 'text-base',
      mt: 'mt-0',
    },
    2: {
      order: 'order-1',
      height: 'h-28',
      ring: 'ring-gray-300/30',
      glow: 'shadow-[0_0_30px_rgba(200,200,200,0.08)]',
      gradient: 'from-gray-300/10 via-gray-300/5 to-transparent',
      badge: '2',
      badgeColor: 'text-gray-300',
      avatarSize: 'w-16 h-16',
      nameSize: 'text-sm',
      mt: 'mt-8',
    },
    3: {
      order: 'order-3',
      height: 'h-24',
      ring: 'ring-amber-600/30',
      glow: 'shadow-[0_0_30px_rgba(180,120,50,0.08)]',
      gradient: 'from-amber-600/10 via-amber-600/5 to-transparent',
      badge: '3',
      badgeColor: 'text-amber-500',
      avatarSize: 'w-16 h-16',
      nameSize: 'text-sm',
      mt: 'mt-12',
    },
  }[place]

  return (
    <div
      className={`${config.order} ${config.mt} flex-1 flex flex-col items-center animate-[fadeSlideUp_0.6s_ease-out_both]`}
      style={{ animationDelay: place === 1 ? '0.1s' : place === 2 ? '0.2s' : '0.3s' }}
    >
      {/* Avatar with glow */}
      <div className="relative mb-3">
        <div className={`absolute inset-0 rounded-full bg-gradient-radial ${config.gradient} blur-xl scale-150`} />
        <div className={`relative ${config.avatarSize} rounded-full ring-2 ${config.ring} overflow-hidden bg-gradient-to-br from-[#00bcd4]/30 to-purple-500/30 flex items-center justify-center ${config.glow} ${place === 1 ? 'animate-[shimmer_3s_ease-in-out_infinite]' : ''}`}>
          {entry.avatar_url ? (
            <img src={entry.avatar_url} alt={entry.display_name || 'Creator'} width={96} height={96} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}>
              {(entry.display_name || '?')[0].toUpperCase()}
            </span>
          )}
        </div>
        {/* Rank badge */}
        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center ${config.badgeColor} text-sm font-bold`}>
          {config.badge}
        </div>
      </div>

      {/* Name + rank */}
      <p className={`${config.nameSize} font-semibold text-white truncate max-w-[120px] text-center`} style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}>
        {entry.display_name || 'Anonymous'}
      </p>
      <p className={`text-xs mt-0.5 ${RANK_COLORS[entry.magic_rank] || 'text-white/40'}`}>
        {entry.magic_rank}
      </p>

      {/* Gate bar */}
      <div className="mt-2">
        <GateBar gates={entry.gates_open} size={place === 1 ? 'md' : 'sm'} />
      </div>

      {/* Score */}
      <p className="mt-2 text-lg font-bold text-[#00bcd4]" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {entry.score.toLocaleString()}
      </p>

      {/* Podium block */}
      <div className={`w-full ${config.height} mt-3 rounded-t-xl bg-gradient-to-t ${config.gradient} border border-white/5 border-b-0 backdrop-blur-sm flex items-start justify-center pt-3`}>
        <span className={`text-xs font-medium ${config.badgeColor} uppercase tracking-widest`}>
          {place === 1 ? '1st' : place === 2 ? '2nd' : '3rd'}
        </span>
      </div>
    </div>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-0 divide-y divide-white/5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="w-10 h-6 bg-white/5 rounded" />
          <div className="w-10 h-10 rounded-full bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/5 rounded w-32" />
            <div className="h-3 bg-white/5 rounded w-24" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 bg-white/5 rounded w-16 ml-auto" />
            <div className="h-3 bg-white/5 rounded w-10 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LeaderboardPage() {
  const [type, setType] = useState<LeaderboardType>('xp')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/leaderboard?type=${type}&limit=50`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setEntries(data.data.leaderboard ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type])

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,188,212,0.08)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.06)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}
          >
            Hall of Luminors
          </h1>
          <p className="text-white/40 text-sm sm:text-base" style={{ fontFamily: 'var(--font-body, Crimson Pro, serif)' }}>
            The greatest creators in the Arcanean multiverse
          </p>
        </div>

        {/* Tabs */}
        <nav className="flex gap-2 justify-center mb-10" role="tablist" aria-label="Leaderboard categories">
          {TABS.map(tab => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={type === tab.key}
              onClick={() => setType(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/50 ${
                type === tab.key
                  ? 'bg-[#00bcd4]/15 text-[#00bcd4] border border-[#00bcd4]/25 shadow-[0_0_20px_rgba(0,188,212,0.1)]'
                  : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70 border border-transparent'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        {loading ? (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
            <LeaderboardSkeleton />
          </div>
        ) : entries.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00bcd4]/10 to-purple-500/10 border border-white/5 flex items-center justify-center">
              <span className="text-4xl opacity-60">✦</span>
            </div>
            <h2
              className="text-2xl font-bold text-white/80 mb-2"
              style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}
            >
              The Hall Awaits
            </h2>
            <p className="text-white/30 max-w-sm mx-auto text-sm" style={{ fontFamily: 'var(--font-body, Crimson Pro, serif)' }}>
              No creators have claimed their place yet. Begin your journey through the Gates and become the first Luminor.
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {top3.length >= 3 && (
              <div className="hidden sm:flex items-end justify-center gap-4 mb-10 px-4">
                <PodiumCard entry={top3[1]} place={2} />
                <PodiumCard entry={top3[0]} place={1} />
                <PodiumCard entry={top3[2]} place={3} />
              </div>
            )}

            {/* Mobile top 3 — stacked */}
            {top3.length >= 3 && (
              <div className="sm:hidden space-y-3 mb-6">
                {top3.map((entry, i) => {
                  const place = (i + 1) as 1 | 2 | 3
                  const colors = {
                    1: { border: 'border-[#ffd700]/20', bg: 'bg-[#ffd700]/[0.04]', badge: '👑', badgeColor: 'text-[#ffd700]' },
                    2: { border: 'border-gray-300/15', bg: 'bg-gray-300/[0.03]', badge: '2nd', badgeColor: 'text-gray-300' },
                    3: { border: 'border-amber-600/15', bg: 'bg-amber-600/[0.03]', badge: '3rd', badgeColor: 'text-amber-500' },
                  }[place]
                  return (
                    <div
                      key={entry.user_id}
                      className={`flex items-center gap-4 p-4 rounded-xl ${colors.bg} border ${colors.border} backdrop-blur-sm animate-[fadeSlideUp_0.5s_ease-out_both]`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <span className={`w-8 text-center font-bold ${colors.badgeColor}`}>{colors.badge}</span>
                      <div className="w-12 h-12 rounded-full ring-1 ring-white/10 overflow-hidden bg-gradient-to-br from-[#00bcd4]/30 to-purple-500/30 flex items-center justify-center">
                        {entry.avatar_url ? (
                          <img src={entry.avatar_url} alt={entry.display_name || 'Creator'} width={48} height={48} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <span className="text-lg font-bold">{(entry.display_name || '?')[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm">{entry.display_name || 'Anonymous'}</p>
                        <p className={`text-xs ${RANK_COLORS[entry.magic_rank] || 'text-white/40'}`}>{entry.magic_rank}</p>
                        <GateBar gates={entry.gates_open} size="sm" />
                      </div>
                      <p className="text-lg font-bold text-[#00bcd4]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {entry.score.toLocaleString()}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Remaining entries */}
            {rest.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="divide-y divide-white/[0.04]">
                  {rest.map((entry, i) => (
                    <div
                      key={entry.user_id}
                      className={`flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-white/[0.03] ${RANK_BG[entry.magic_rank] || ''} animate-[fadeSlideUp_0.4s_ease-out_both]`}
                      style={{ animationDelay: `${(i + 3) * 0.03}s` }}
                    >
                      {/* Rank number */}
                      <div
                        className="w-8 text-center text-sm font-medium text-white/30"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {entry.rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00bcd4]/20 to-purple-500/20 flex items-center justify-center overflow-hidden ring-1 ring-white/[0.06]">
                        {entry.avatar_url ? (
                          <img src={entry.avatar_url} alt={entry.display_name || 'Creator'} width={36} height={36} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <span className="text-sm font-medium text-white/70">{(entry.display_name || '?')[0].toUpperCase()}</span>
                        )}
                      </div>

                      {/* Name + rank + gates */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-white/90">{entry.display_name || 'Anonymous Creator'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs ${RANK_COLORS[entry.magic_rank] || 'text-white/40'}`}>
                            {entry.magic_rank}
                          </span>
                          <GateBar gates={entry.gates_open} />
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className="font-semibold text-sm text-[#00bcd4]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {entry.score.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-white/30 mt-0.5">
                          {type === 'xp' ? 'XP' : type === 'creations' ? 'works' : type === 'likes' ? 'likes' : 'days'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
        @keyframes shimmer {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.1), 0 0 40px rgba(255, 215, 0, 0.05);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.2), 0 0 60px rgba(255, 215, 0, 0.1);
          }
        }
      `}</style>
    </div>
  )
}
