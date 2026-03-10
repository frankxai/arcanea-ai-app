'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  PhPencilSimple,
  PhStar,
  PhLightning,
  PhShieldStar,
  PhGraduationCap,
  PhEye,
  PhHeart,
  PhUsers,
  PhUserPlus,
  PhImage,
  PhFilm,
  PhCode,
  PhMusicNote,
  PhFile,
  PhSparkle,
  PhFire,
} from '@/lib/phosphor-icons'
import type { Profile, ProfileStats, Creation } from '@/lib/database/types/api-responses'

const GATE_COLORS: Record<string, string> = {
  Foundation: 'from-amber-600 to-amber-400',
  Flow: 'from-blue-600 to-blue-400',
  Fire: 'from-red-600 to-orange-400',
  Heart: 'from-pink-600 to-rose-400',
  Voice: 'from-emerald-600 to-emerald-400',
  Sight: 'from-indigo-600 to-indigo-400',
  Crown: 'from-violet-600 to-violet-400',
  Shift: 'from-purple-600 to-fuchsia-400',
  Unity: 'from-cyan-600 to-teal-400',
  Source: 'from-yellow-500 to-amber-300',
}

const RANK_ICONS: Record<string, string> = {
  Apprentice: 'I',
  Mage: 'II',
  Master: 'III',
  Archmage: 'IV',
  Luminor: 'V',
}

const TYPE_ICONS: Record<string, typeof PhImage> = {
  image: PhImage,
  video: PhFilm,
  code: PhCode,
  audio: PhMusicNote,
  text: PhFile,
  mixed: PhSparkle,
}

interface ProfilePageClientProps {
  profile: Profile
  stats: ProfileStats
  creations: Creation[]
  isOwnProfile: boolean
}

export function ProfilePageClient({
  profile,
  stats,
  creations,
  isOwnProfile,
}: ProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState<'creations' | 'about'>('creations')

  const gateGradient = profile.activeGate
    ? GATE_COLORS[profile.activeGate] || 'from-violet-500 to-cyan-400'
    : 'from-violet-500 to-cyan-400'

  const initials = profile.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="min-h-screen bg-black">
      {/* Hero banner with gradient */}
      <div className={`h-48 sm:h-56 bg-gradient-to-r ${gateGradient} relative`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          {/* Avatar */}
          <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-br ${gateGradient} shrink-0`}>
            <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-display font-bold text-white/[0.60]">
                  {initials}
                </span>
              )}
            </div>
          </div>

          {/* Name and Meta */}
          <div className="flex-1 pt-2 sm:pt-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                  {profile.displayName}
                </h1>
                {profile.bio && (
                  <p className="text-white/[0.40] font-body mt-2 max-w-xl leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>

              {isOwnProfile && (
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-2 px-4 py-2 border border-white/[0.12] rounded-lg text-white/[0.60] hover:bg-white/[0.04] transition-colors font-body text-sm"
                >
                  <PhPencilSimple size={16} weight="duotone" />
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Magic Rank */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.06] text-sm font-body">
                <PhStar size={14} weight="duotone" className="text-yellow-400" />
                <span className="text-white/[0.60]">{profile.magicRank}</span>
                <span className="text-white/[0.25] text-xs">{RANK_ICONS[profile.magicRank]}</span>
              </span>

              {/* Gates Open */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.06] text-sm font-body">
                <PhLightning size={14} weight="duotone" className="text-cyan-400" />
                <span className="text-white/[0.60]">{profile.gatesOpen}/10 Gates</span>
              </span>

              {/* Active Gate */}
              {profile.activeGate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.06] text-sm font-body">
                  <PhFire size={14} weight="duotone" className="text-orange-400" />
                  <span className="text-white/[0.60]">{profile.activeGate} Gate</span>
                </span>
              )}

              {/* Guardian */}
              {profile.guardian && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.06] text-sm font-body">
                  <PhShieldStar size={14} weight="duotone" className="text-violet-400" />
                  <span className="text-white/[0.60]">{profile.guardian}</span>
                </span>
              )}

              {/* Academy House */}
              {profile.academyHouse && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.06] text-sm font-body">
                  <PhGraduationCap size={14} weight="duotone" className="text-emerald-400" />
                  <span className="text-white/[0.60]">House {profile.academyHouse}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <StatCard label="Creations" value={stats.creationsCount} icon={PhSparkle} />
          <StatCard label="Followers" value={stats.followersCount} icon={PhUsers} />
          <StatCard label="Following" value={stats.followingCount} icon={PhUserPlus} />
          <StatCard label="XP" value={profile.xp} icon={PhLightning} />
          <StatCard label="Level" value={profile.level} icon={PhStar} />
        </div>

        {/* Tabs */}
        <div className="border-b border-white/[0.06] mb-8">
          <div className="flex gap-1">
            {(['creations', 'about'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-3 font-body text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-white/[0.25] hover:text-white/[0.40]'
                }`}
              >
                {tab === 'creations' ? `Creations (${creations.length})` : 'About'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="profileTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gateGradient}`}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'creations' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {creations.length === 0 ? (
              <div className="text-center py-20">
                <PhSparkle size={48} weight="duotone" className="text-white/[0.12] mx-auto mb-4" />
                <p className="text-white/[0.25] font-body text-lg">No creations yet</p>
                {isOwnProfile && (
                  <Link
                    href="/studio"
                    className="inline-block mt-4 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors font-body text-sm"
                  >
                    Create Something
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                {creations.map((creation, i) => (
                  <CreationCard key={creation.id} creation={creation} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pb-12"
          >
            {/* Bio Card */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-lg font-display font-bold text-white mb-3">About</h3>
              <p className="text-white/[0.40] font-body leading-relaxed">
                {profile.bio || 'This creator has not written a bio yet.'}
              </p>
            </div>

            {/* Journey Details */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-lg font-display font-bold text-white mb-4">Journey</h3>
              <div className="space-y-3">
                <DetailRow label="Magic Rank" value={profile.magicRank} />
                <DetailRow label="Gates Open" value={`${profile.gatesOpen} of 10`} />
                {profile.activeGate && (
                  <DetailRow label="Active Gate" value={profile.activeGate} />
                )}
                {profile.guardian && (
                  <DetailRow label="Guardian" value={profile.guardian} />
                )}
                {profile.academyHouse && (
                  <DetailRow label="Academy House" value={profile.academyHouse} />
                )}
                <DetailRow label="XP" value={profile.xp.toLocaleString()} />
                <DetailRow label="Level" value={String(profile.level)} />
                {profile.streakDays > 0 && (
                  <DetailRow label="Streak" value={`${profile.streakDays} days`} />
                )}
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-lg font-display font-bold text-white mb-3">Member Since</h3>
              <p className="text-white/[0.40] font-body">
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: typeof PhSparkle
}) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-xl p-4 text-center">
      <Icon size={18} weight="duotone" className="text-white/[0.25] mx-auto mb-1" />
      <div className="text-xl font-display font-bold text-white">
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </div>
      <div className="text-xs text-white/[0.25] font-body">{label}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/[0.25] font-body text-sm">{label}</span>
      <span className="text-white font-body text-sm">{value}</span>
    </div>
  )
}

function CreationCard({ creation, index }: { creation: Creation; index: number }) {
  const TypeIcon = TYPE_ICONS[creation.type] || PhFile

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`/creations/${creation.id}`}
        className="block group bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="aspect-square bg-white/[0.04] relative overflow-hidden">
          {creation.thumbnailUrl ? (
            <Image
              src={creation.thumbnailUrl}
              alt={creation.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TypeIcon size={48} weight="duotone" className="text-white/[0.06]" />
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.06] text-xs text-white/[0.50] font-body">
              <TypeIcon size={12} weight="duotone" />
              {creation.type}
            </span>
          </div>

          {/* Element badge */}
          {creation.element && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.06] text-xs text-white/[0.50] font-body">
                {creation.element}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-white text-sm truncate group-hover:text-violet-300 transition-colors">
            {creation.title}
          </h3>
          {creation.description && (
            <p className="text-white/[0.25] text-xs font-body mt-1 line-clamp-2">
              {creation.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 mt-3 text-xs text-white/[0.20] font-body">
            <span className="inline-flex items-center gap-1">
              <PhEye size={12} weight="duotone" />
              {creation.viewCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <PhHeart size={12} weight="duotone" />
              {creation.likeCount}
            </span>
            {creation.gate && (
              <span className="ml-auto text-white/[0.12]">
                {creation.gate}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
