'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const RECENT_ACTIVITY = [
  { id: 1, icon: PencilSimple, text: "Created 'The Oracle's Lament'", time: '2 hours ago', color: 'text-violet-400' },
  { id: 2, icon: Lightning, text: 'Reached Gate 1 — Foundation', time: '1 day ago', color: 'text-[#7fffd4]' },
  { id: 3, icon: Book, text: "Read 'The First Dawn' from Legends", time: '2 days ago', color: 'text-amber-400' },
  { id: 4, icon: Star, text: 'Earned Apprentice rank', time: '3 days ago', color: 'text-[#ffd700]' },
];

const STATS = [
  { label: 'Creations', value: '3 works', icon: Palette, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { label: 'Gate Progress', value: 'Gate 1 of 10', icon: Lightning, color: 'text-[#7fffd4]', bg: 'bg-emerald-500/10' },
  { label: 'Library', value: '34 texts to explore', icon: Book, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Streak', value: '1 day', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

// ─── Unauthenticated View ─────────────────────────────────────────────────────

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

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  const displayName = user?.user_metadata?.display_name
    || user?.user_metadata?.full_name
    || 'Creator';

  const guardianName = user?.user_metadata?.guardian || null;

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // ── Loading state ──
  if (isLoading) {
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
            {STATS.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5 space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={22} weight="duotone" className={color} />
                </div>
                <div>
                  <p className="font-sans text-lg font-semibold text-white">{value}</p>
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
              {RECENT_ACTIVITY.map(({ id, icon: Icon, text, time, color }) => (
                <div key={id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                    <Icon size={18} weight="duotone" className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-white/80 truncate">{text}</p>
                    <p className="font-sans text-xs text-white/30 flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      {time}
                    </p>
                  </div>
                </div>
              ))}
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
                  {guardianName ? `${guardianName}` : 'Your Guardian'}
                </h3>
                <p className="font-sans text-xs text-white/40">
                  {guardianName ? 'Companion Intelligence' : 'Not yet discovered'}
                </p>
              </div>
            </div>

            {/* Guardian image placeholder */}
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
                (gate, i) => (
                  <div key={gate} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans font-medium ${
                        i === 0
                          ? 'bg-[#7fffd4]/20 text-[#7fffd4] ring-1 ring-[#7fffd4]/30'
                          : 'bg-white/[0.04] text-white/20'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`font-sans text-sm ${
                        i === 0 ? 'text-white/80' : 'text-white/25'
                      }`}
                    >
                      {gate}
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="pt-2">
              <p className="font-sans text-xs text-white/30">
                Rank: <span className="text-[#ffd700]">Apprentice</span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
