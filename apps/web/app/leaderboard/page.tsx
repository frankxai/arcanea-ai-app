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
  Luminor: 'text-yellow-400',
  Archmage: 'text-purple-400',
  Master: 'text-blue-400',
  Mage: 'text-teal-400',
  Apprentice: 'text-white/60',
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          Hall of Luminors
        </h1>
        <p className="text-center text-white/50 mb-8">The greatest creators in the Arcanean multiverse</p>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setType(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                type === tab.key
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-white/30">Loading rankings...</div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-white/30">No entries yet. Be the first!</div>
          ) : (
            <div className="divide-y divide-white/5">
              {entries.map((entry, i) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${
                    i < 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-10 text-center font-bold text-lg ${
                    i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/40'
                  }`}>
                    {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${entry.rank}`}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/30 to-purple-500/30 flex items-center justify-center overflow-hidden">
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">{(entry.display_name || '?')[0].toUpperCase()}</span>
                    )}
                  </div>

                  {/* Name + Rank */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{entry.display_name || 'Anonymous Creator'}</p>
                    <p className={`text-xs ${RANK_COLORS[entry.magic_rank] || 'text-white/40'}`}>
                      {entry.magic_rank} · {entry.gates_open}/10 Gates
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="font-bold text-teal-400">{entry.score.toLocaleString()}</p>
                    <p className="text-xs text-white/40">
                      {type === 'xp' ? 'XP' : type === 'creations' ? 'works' : type === 'likes' ? 'likes' : 'days'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
