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

const ELEMENT_COLORS: Record<string, string> = {
  Fire: 'bg-red-500', Water: 'bg-blue-500', Earth: 'bg-green-500',
  Wind: 'bg-gray-300', Void: 'bg-purple-500', Spirit: 'bg-yellow-400',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-white/40">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Cinzel, serif' }}>
          Arcanea Analytics
        </h1>

        {/* Platform Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Creators', value: stats.total_users, sub: `+${stats.new_users_7d} this week` },
              { label: 'Creations', value: stats.total_creations, sub: `+${stats.new_creations_7d} this week` },
              { label: 'Chat Sessions', value: stats.total_chat_sessions, sub: `${stats.total_chat_messages} messages` },
              { label: 'Luminors', value: stats.total_luminors, sub: `${stats.total_councils} councils` },
              { label: 'Total Likes', value: stats.total_likes, sub: 'across all creations' },
              { label: 'Total Views', value: stats.total_views, sub: 'across all creations' },
              { label: 'New This Week', value: stats.new_users_7d, sub: 'creators joined' },
              { label: 'New This Month', value: stats.new_users_30d, sub: 'creators joined' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-teal-400">{stat.value.toLocaleString()}</p>
                <p className="text-sm font-medium text-white/80 mt-1">{stat.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Element Distribution */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Element Distribution</h2>
            <div className="space-y-3">
              {elements.map(el => (
                <div key={el.element}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{el.element}</span>
                    <span className="text-white/50">{el.creation_count} creations ({el.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ELEMENT_COLORS[el.element] || 'bg-teal-500'}`}
                      style={{ width: `${Math.min(el.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {elements.length === 0 && <p className="text-white/30 text-sm">No element data yet</p>}
            </div>
          </div>

          {/* Your Engagement */}
          {engagement && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Your Engagement</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Your Creations', value: engagement.creation_count },
                  { label: 'Chat Sessions', value: engagement.chat_session_count },
                  { label: 'Likes Given', value: engagement.likes_given },
                  { label: 'Likes Received', value: engagement.likes_received },
                  { label: 'Views Received', value: engagement.views_received },
                ].map(item => (
                  <div key={item.label} className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xl font-bold text-teal-400">{item.value.toLocaleString()}</p>
                    <p className="text-xs text-white/50 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
