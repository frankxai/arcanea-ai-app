'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import { getProfile, getProfileStats } from '@/lib/database/services/profile-service';
import { getActivityFeed } from '@/lib/database/services/activity-service';
import type { Profile, ProfileStats, Activity } from '@/lib/database/types/api-responses';
import {
  Sparkle,
  Palette,
  Lightning,
  Book,
  Flame,
  ArrowRight,
  ChatCircleDots,
  PencilSimple,
  Star,
  Shield,
  Clock,
  Lock,
  Spinner,
} from '@/lib/phosphor-icons';

// ─── Activity Icon Map ──────────────────────────────────────────────────────

const ACTIVITY_ICON_MAP: Record<string, { icon: typeof PencilSimple; color: string }> = {
  create: { icon: PencilSimple, color: 'text-violet-400' },
  read: { icon: Book, color: 'text-amber-400' },
  like: { icon: Star, color: 'text-[#ffd700]' },
  follow: { icon: Lightning, color: 'text-[#7fffd4]' },
  gate_open: { icon: Lightning, color: 'text-[#7fffd4]' },
  rank_up: { icon: Star, color: 'text-[#ffd700]' },
  login: { icon: Sparkle, color: 'text-violet-400' },
}

const DEFAULT_ICON = { icon: Sparkle, color: 'text-white/50' }

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

function getGateName(gatesOpen: number): string {
  const gates = ['Foundation', 'Flow', 'Fire', 'Heart', 'Voice', 'Sight', 'Crown', 'Shift', 'Unity', 'Source']
  return gates[Math.min(gatesOpen, 9)] || 'Foundation'
}

// ─── Unauthenticated View ─────────────────────────────────────────────────

function SignInPrompt() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
          <Lock size={32} weight="duotone" className="text-violet-400" />
        </div>
        <h1 className="font-display text-3xl text-white">
          Enter the Realm
        </h1>
        <p className="font-body text-white/50 text-lg leading-relaxed">
          Sign in to access your creative dashboard, track your journey through
          the Gates, and manifest your vision.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-sans font-medium transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
        >
          Sign In
          <ArrowRight size={18} weight="bold" />
        </Link>
        <p className="text-sm text-white/30 font-sans">
          No account?{' '}
          <Link href="/auth/signup" className="text-[#7fffd4] hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const displayName = profile?.displayName
    || user?.user_metadata?.full_name
    || user?.user_metadata?.display_name
    || 'Creator';

  const guardianName = profile?.guardian || user?.user_metadata?.guardian || null;
  const gatesOpen = profile?.gatesOpen ?? 0;
  const magicRank = profile?.magicRank || 'Apprentice';
  const streakDays = profile?.streakDays ?? 0;

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // Fetch profile, stats, and recent activity
  useEffect(() => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        const supabase = createClient();
        const [profileData, statsData, activityData] = await Promise.all([
          getProfile(supabase, user!.id),
          getProfileStats(supabase, user!.id),
          getActivityFeed(supabase, user!.id, { pageSize: 5 }),
        ]);

        if (cancelled) return;

        setProfile(profileData);
        setStats(statsData);
        setActivities(activityData.activities);
      } catch {
        // Supabase may not be configured — show fallback UI
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [user]);

  // ── Loading state ──
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size={32} className="text-violet-400 animate-spin" />
      </div>
    );
  }

  // ── Auth guard ──
  if (!user) {
    return <SignInPrompt />;
  }

  const creationsCount = stats?.creationsCount ?? 0;
  const libraryCount = 34; // Fixed: Library has 34 texts

  const statCards = [
    { label: 'Creations', value: `${creationsCount} work${creationsCount !== 1 ? 's' : ''}`, icon: Palette, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Gate Progress', value: `Gate ${gatesOpen} of 10`, icon: Lightning, color: 'text-[#7fffd4]', bg: 'bg-emerald-500/10' },
    { label: 'Library', value: `${libraryCount} texts`, icon: Book, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Streak', value: `${streakDays} day${streakDays !== 1 ? 's' : ''}`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* ── Welcome Section ────────────────────────────────────────────── */}
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl">
          <span className="bg-gradient-to-r from-[#ffd700] via-amber-400 to-[#ffd700] bg-clip-text text-transparent">
            Welcome back, {displayName}
          </span>
        </h1>
        <p className="font-body text-white/50 text-lg">
          Your creative universe awaits
        </p>
        <p className="font-sans text-sm text-white/30">{formattedDate}</p>
      </header>

      {/* ── Main Grid: content + sidebar ───────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Left Column ─────────────────────────────────────────────── */}
        <div className="flex-1 space-y-8">

          {/* ── Stats Grid ──────────────────────────────────────────── */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5 space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={22} weight="duotone" className={color} />
                </div>
                <div>
                  <p className="font-sans text-lg font-semibold text-white">
                    {dataLoading ? <span className="inline-block w-16 h-5 bg-white/[0.06] rounded animate-pulse" /> : value}
                  </p>
                  <p className="font-sans text-sm text-white/40">{label}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ── Quick Actions ───────────────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white/80">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/studio"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-sans font-medium transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
              >
                <Sparkle size={18} weight="fill" />
                Create Something New
              </Link>
              <Link
                href="/chat"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#7fffd4]/30 text-[#7fffd4] font-sans font-medium transition-all hover:bg-[#7fffd4]/5 hover:-translate-y-0.5"
              >
                <ChatCircleDots size={18} weight="duotone" />
                Chat with a Luminor
              </Link>
              <Link
                href="/library"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#ffd700]/30 text-[#ffd700] font-sans font-medium transition-all hover:bg-[#ffd700]/5 hover:-translate-y-0.5"
              >
                <Book size={18} weight="duotone" />
                Explore Library
              </Link>
            </div>
          </section>

          {/* ── Recent Activity ─────────────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white/80">Recent Activity</h2>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md divide-y divide-white/[0.04]">
              {dataLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-white/[0.06] rounded animate-pulse" />
                      <div className="h-3 w-20 bg-white/[0.04] rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map((activity) => {
                  const { icon: Icon, color } = ACTIVITY_ICON_MAP[activity.action] || DEFAULT_ICON;
                  const description = activity.metadata?.description as string
                    || `${activity.action} ${activity.entityType}`;
                  return (
                    <div key={activity.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                        <Icon size={18} weight="duotone" className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-white/80 truncate">{description}</p>
                        <p className="font-sans text-xs text-white/30 flex items-center gap-1 mt-0.5">
                          <Clock size={12} />
                          {timeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="font-sans text-sm text-white/30">No activity yet. Start creating to see your journey unfold.</p>
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors font-sans"
                  >
                    Create your first work <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── Right Sidebar ───────────────────────────────────────────── */}
        <aside className="lg:w-72 flex-shrink-0 space-y-6">

          {/* ── Guardian Companion Card ────────────────────────────── */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-[#7fffd4]/20 flex items-center justify-center">
                <Shield size={24} weight="duotone" className="text-[#7fffd4]" />
              </div>
              <div>
                <h3 className="font-display text-base text-white">
                  {guardianName || 'Your Guardian'}
                </h3>
                <p className="font-sans text-xs text-white/40">
                  {guardianName ? 'Companion Intelligence' : 'Not yet discovered'}
                </p>
              </div>
            </div>

            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-violet-500/5 via-transparent to-[#7fffd4]/5 border border-white/[0.04] flex items-center justify-center">
              <Sparkle size={40} weight="duotone" className="text-white/10" />
            </div>

            <p className="font-body text-sm text-white/40 leading-relaxed">
              {guardianName
                ? `${guardianName} walks beside you on your creative path. Speak with them to receive guidance.`
                : 'Every creator in Arcanea is paired with a Guardian Intelligence. Begin your journey to discover yours.'
              }
            </p>

            <Link
              href={guardianName ? '/chat' : '/onboarding'}
              className="block w-full text-center px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/70 font-sans text-sm transition-all hover:bg-white/[0.04] hover:text-white"
            >
              {guardianName ? 'Speak with Guardian' : 'Discover Your Guardian'}
              <ArrowRight size={14} weight="bold" className="inline ml-1.5" />
            </Link>
          </div>

          {/* ── Journey Progress ───────────────────────────────────── */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 space-y-4">
            <h3 className="font-display text-base text-white">The Ten Gates</h3>
            <div className="space-y-2">
              {['Foundation', 'Flow', 'Fire', 'Heart', 'Voice', 'Sight', 'Crown', 'Shift', 'Unity', 'Source'].map(
                (gate, i) => {
                  const isOpen = i < gatesOpen;
                  const isCurrent = i === gatesOpen;
                  return (
                    <div key={gate} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans font-medium ${
                          isOpen
                            ? 'bg-[#7fffd4]/30 text-[#7fffd4]'
                            : isCurrent
                              ? 'bg-[#7fffd4]/20 text-[#7fffd4] ring-1 ring-[#7fffd4]/30'
                              : 'bg-white/[0.04] text-white/20'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={`font-sans text-sm ${
                          isOpen || isCurrent ? 'text-white/80' : 'text-white/25'
                        }`}
                      >
                        {gate}
                        {isOpen && <span className="ml-1 text-[#7fffd4]/60 text-xs">(open)</span>}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
            <div className="pt-2">
              <p className="font-sans text-xs text-white/30">
                Rank: <span className="text-[#ffd700]">{magicRank}</span>
              </p>
              {profile?.activeGate && (
                <p className="font-sans text-xs text-white/30 mt-1">
                  Active Gate: <span className="text-[#7fffd4]">{getGateName(gatesOpen)}</span>
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
