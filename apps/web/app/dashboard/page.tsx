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
  create: { icon: PencilSimple, color: 'text-[#00bcd4]' },
  read: { icon: Book, color: 'text-amber-400' },
  like: { icon: Star, color: 'text-[#ffd700]' },
  follow: { icon: Lightning, color: 'text-[#00bcd4]' },
  gate_open: { icon: Lightning, color: 'text-[#00bcd4]' },
  rank_up: { icon: Star, color: 'text-[#ffd700]' },
  login: { icon: Sparkle, color: 'text-[#00bcd4]' },
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
  const gates = ['Foundation', 'Flow', 'Fire', 'Heart', 'Voice', 'Sight', 'Crown', 'Starweave', 'Unity', 'Source']
  return gates[Math.min(gatesOpen, 9)] || 'Foundation'
}

// ─── Unauthenticated View ─────────────────────────────────────────────────

function SignInPrompt() {
  const features = [
    { icon: Sparkle, label: 'Chat with AI creative partners', color: 'text-[#00bcd4]' },
    { icon: Palette, label: 'Generate images, stories, and code', color: 'text-[#00bcd4]' },
    { icon: Book, label: 'Access 200K+ words of creative frameworks', color: 'text-amber-400' },
    { icon: Lightning, label: 'Track your progress across ten stages', color: 'text-[#ffd700]' },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div
            className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(0,188,212,0.15), rgba(13,71,161,0.08))',
              border: '1px solid rgba(0,188,212,0.12)',
            }}
          >
            <Sparkle size={36} weight="fill" className="text-[#00bcd4]" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">
            Your creative universe awaits
          </h1>
          <p className="font-body text-white/50 text-lg leading-relaxed max-w-md mx-auto">
            Arcanea is where creators chat with AI, build worlds,
            generate art, write stories, and turn imagination into reality.
          </p>
        </div>

        {/* Feature list */}
        <div
          className="rounded-2xl border border-white/[0.06] p-5 space-y-4"
          style={{ background: 'rgba(255,255,255,0.015)' }}
        >
          {features.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <Icon size={18} weight="duotone" className={color} />
              </div>
              <span className="font-sans text-sm text-white/70">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white font-sans font-medium text-base transition-all hover:shadow-lg hover:shadow-[#00bcd4]/25 hover:-translate-y-0.5"
            aria-label="Continue with Google to sign in"
          >
            Continue with Google
            <ArrowRight size={18} weight="bold" />
          </Link>
          <p className="text-sm text-white/30 font-sans">
            Free to start. No credit card required.
          </p>
          <p className="text-sm text-white/30 font-sans">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#00bcd4] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
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
  const isFirstVisit = gatesOpen === 1
    && (profile?.metadata as Record<string, unknown> | null)?.onboardingComplete === true;

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
        <Spinner size={32} className="text-[#00bcd4] animate-spin" />
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
    { label: 'Creations', value: `${creationsCount} work${creationsCount !== 1 ? 's' : ''}`, icon: Palette, color: 'text-[#00bcd4]', bg: 'bg-[#00bcd4]/10' },
    { label: 'Progress', value: `${gatesOpen} of 10`, icon: Lightning, color: 'text-[#00bcd4]', bg: 'bg-emerald-500/10' },
    { label: 'Library', value: `${libraryCount} texts`, icon: Book, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Streak', value: `${streakDays} day${streakDays !== 1 ? 's' : ''}`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* ── Welcome Section ────────────────────────────────────────────── */}
      <header className="space-y-3">
        <p className="font-sans text-sm text-white/30">{formattedDate}</p>
        <h1 className="font-display text-3xl sm:text-4xl">
          <span className="bg-gradient-to-r from-[#ffd700] via-amber-400 to-[#ffd700] bg-clip-text text-transparent">
            {isFirstVisit ? `Welcome, ${displayName}` : `Welcome back, ${displayName}`}
          </span>
        </h1>
        <p className="font-body text-white/50 text-lg">
          {isFirstVisit
            ? 'Your workspace is ready. Start creating, explore the library, or chat with a creative partner.'
            : 'Here is what you have been working on.'}
        </p>
      </header>

      {/* ── What will you create today? ───────────────────────────────── */}
      <section
        className="rounded-2xl border border-[#00bcd4]/15 p-6"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(0,188,212,0.04), transparent 60%), rgba(255,255,255,0.015)',
        }}
      >
        <h2 className="font-display text-xl text-white mb-1">What will you create today?</h2>
        <p className="font-sans text-sm text-white/40 mb-4">
          Jump into any creative mode, or pick up where you left off.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/chat"
            className="group flex flex-col items-center gap-2 px-4 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-[#00bcd4]/30 hover:bg-[#00bcd4]/5 hover:-translate-y-0.5"
          >
            <ChatCircleDots size={24} weight="duotone" className="text-[#00bcd4] group-hover:scale-110 transition-transform" />
            <span className="font-sans text-sm text-white/70 group-hover:text-white transition-colors">Start Creating</span>
          </Link>
          <Link
            href="/studio"
            className="group flex flex-col items-center gap-2 px-4 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-[#00bcd4]/30 hover:bg-[#00bcd4]/5 hover:-translate-y-0.5"
          >
            <Palette size={24} weight="duotone" className="text-[#00bcd4] group-hover:scale-110 transition-transform" />
            <span className="font-sans text-sm text-white/70 group-hover:text-white transition-colors">Open Studio</span>
          </Link>
          <Link
            href="/library"
            className="group flex flex-col items-center gap-2 px-4 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-amber-400/30 hover:bg-amber-400/5 hover:-translate-y-0.5"
          >
            <Book size={24} weight="duotone" className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-sans text-sm text-white/70 group-hover:text-white transition-colors">Browse Library</span>
          </Link>
          <Link
            href="/academy"
            className="group flex flex-col items-center gap-2 px-4 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-[#ffd700]/30 hover:bg-[#ffd700]/5 hover:-translate-y-0.5"
          >
            <Star size={24} weight="duotone" className="text-[#ffd700] group-hover:scale-110 transition-transform" />
            <span className="font-sans text-sm text-white/70 group-hover:text-white transition-colors">Explore Academy</span>
          </Link>
        </div>
      </section>

      {/* ── First-time onboarding banner ──────────────────────────────── */}
      {isFirstVisit && (
        <section
          className="rounded-2xl border border-[#ffd700]/20 p-5 space-y-3"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.04), rgba(13,71,161,0.04))',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ffd700]/10 flex items-center justify-center flex-shrink-0">
              <Sparkle size={22} weight="fill" className="text-[#ffd700]" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-lg text-white">
                {guardianName ? `${guardianName} is ready` : 'You are all set'}
              </h2>
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                Gate 1: Foundation is now open. Create your first work, read from the library,
                or start a conversation with {guardianName || 'your companion'} to begin building your creative practice.
              </p>
            </div>
          </div>
        </section>
      )}

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

          {/* ── Quick Links ──────────────────────────────────────────── */}
          <section className="flex flex-wrap gap-3">
            <Link
              href="/companions/forge"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#00bcd4]/20 text-[#00bcd4] font-sans text-sm font-medium transition-all hover:bg-[#00bcd4]/5 hover:-translate-y-0.5"
            >
              <Sparkle size={16} weight="fill" />
              Forge a Companion
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/60 font-sans text-sm font-medium transition-all hover:bg-white/[0.04] hover:text-white/80 hover:-translate-y-0.5"
            >
              <Lightning size={16} weight="duotone" />
              Discover Creators
            </Link>
            <Link
              href="/academy/courses"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/60 font-sans text-sm font-medium transition-all hover:bg-white/[0.04] hover:text-white/80 hover:-translate-y-0.5"
            >
              <Flame size={16} weight="duotone" />
              Browse Courses
            </Link>
          </section>

          {/* ── Your Companions ─────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-white/80">Your Companions</h2>
              <Link
                href="/companions/forge"
                className="text-sm text-[#00bcd4] hover:text-[#00bcd4]/80 transition-colors font-sans flex items-center gap-1"
              >
                Forge new <ArrowRight size={14} />
              </Link>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5">
              {/* Empty state for now — will be populated when companions are created */}
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00bcd4]/10 to-[#a78bfa]/10 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <Sparkle size={24} weight="duotone" className="text-[#00bcd4]" />
                </div>
                <p className="font-sans text-sm text-white/50 mb-1">No companions yet</p>
                <p className="font-sans text-xs text-white/30 mb-4">
                  Visit the Forge to create your first companion
                </p>
                <Link
                  href="/companions/forge"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00bcd4]/20 to-[#a78bfa]/20 border border-[#00bcd4]/30 text-[#00bcd4] text-sm font-sans font-medium hover:border-[#00bcd4]/50 transition-all"
                >
                  <Sparkle size={16} weight="fill" />
                  Enter the Forge
                </Link>
              </div>
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
                  <p className="font-sans text-sm text-white/30">No activity yet. Start creating to see your progress here.</p>
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-[#00bcd4] hover:text-[#00bcd4] transition-colors font-sans"
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

          {/* ── Companion Card ──────────────────────────────────── */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00bcd4]/20 to-[#00bcd4]/20 flex items-center justify-center">
                <Shield size={24} weight="duotone" className="text-[#00bcd4]" />
              </div>
              <div>
                <h3 className="font-display text-base text-white">
                  {guardianName || 'Your Companion'}
                </h3>
                <p className="font-sans text-xs text-white/40">
                  {guardianName ? 'Creative partner' : 'Not yet matched'}
                </p>
              </div>
            </div>

            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-[#00bcd4]/5 via-transparent to-[#00bcd4]/5 border border-white/[0.04] flex items-center justify-center">
              <Sparkle size={40} weight="duotone" className="text-white/10" />
            </div>

            <p className="font-body text-sm text-white/40 leading-relaxed">
              {guardianName
                ? `${guardianName} is your creative partner. Start a conversation to get ideas, feedback, or a fresh perspective.`
                : 'Every creator here is matched with a companion that fits how they think. Take the quiz to find yours.'
              }
            </p>

            <Link
              href={guardianName ? '/chat' : '/onboarding'}
              className="block w-full text-center px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/70 font-sans text-sm transition-all hover:bg-white/[0.04] hover:text-white"
            >
              {guardianName ? 'Start a session' : 'Find your match'}
              <ArrowRight size={14} weight="bold" className="inline ml-1.5" />
            </Link>
          </div>

          {/* ── Progress ────────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 space-y-4">
            <h3 className="font-display text-base text-white">Your Journey</h3>
            <div className="space-y-3">
              {/* Current gate label */}
              {gatesOpen > 0 && (
                <p className="font-sans text-xs text-[#00bcd4]">
                  Current: Gate of {getGateName(gatesOpen - 1)}
                </p>
              )}
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs text-white/50">{gatesOpen} of 10 gates</span>
                  <span className="font-sans text-xs text-[#ffd700]">{magicRank}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00bcd4] to-[#00bcd4]/60 transition-all duration-500"
                    style={{ width: `${(gatesOpen / 10) * 100}%` }}
                  />
                </div>
              </div>
              <p className="font-sans text-xs text-white/30 leading-relaxed">
                Create, read, and explore to advance. Each gate unlocks new tools and deeper access.
              </p>
              <Link
                href="/academy"
                className="block text-center px-4 py-2 rounded-xl border border-white/[0.06] text-white/50 font-sans text-xs transition-all hover:bg-white/[0.04] hover:text-white/70"
              >
                View all gates
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
