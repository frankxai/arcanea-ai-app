import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  BookOpen,
  Star,
  Award,
  Sparkles,
  Plus,
  Github,
  ExternalLink,
  Users,
  LifeBuoy,
  FileText,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import {
  getAuthorBooks,
  getAuthorStats,
  getRecentActivity,
  type AuthorBook,
  type ActivityEvent,
  type AuthorStats,
} from '@/lib/dashboard/queries';

import { StatCard } from '@/components/dashboard/StatCard';
import { BookRow } from '@/components/dashboard/BookRow';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { EmptyState } from '@/components/dashboard/EmptyState';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard — Arcanea',
  description: 'Your Open Library dashboard — books, reviews, and Guardian feedback.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard' },
};

// ─── Quick Links Sidebar ─────────────────────────────────────────────────

const QUICK_LINKS = [
  {
    href: '/contribute',
    label: 'New book',
    icon: Plus,
    external: false,
  },
  {
    href: 'https://github.com/frankxai/arcanea-ai-app/blob/main/docs/publishing-guide.md',
    label: 'Publishing guide',
    icon: FileText,
    external: true,
  },
  {
    href: 'https://discord.gg/arcanea',
    label: 'Discord community',
    icon: Users,
    external: true,
  },
  {
    href: 'https://github.com/frankxai/arcanea-ai-app',
    label: 'GitHub repo',
    icon: Github,
    external: true,
  },
  {
    href: 'https://github.com/frankxai/arcanea-ai-app/issues/new?template=feature_request.md&labels=request-featured&title=Request+Featured:',
    label: 'Request featured',
    icon: Sparkles,
    external: true,
  },
  {
    href: 'mailto:support@arcanea.ai',
    label: 'Support',
    icon: LifeBuoy,
    external: true,
  },
] as const;

// ─── Data loader with resilience ─────────────────────────────────────────

interface DashboardData {
  books: AuthorBook[];
  stats: AuthorStats;
  activity: ActivityEvent[];
  dbAvailable: boolean;
}

async function loadDashboardData(userId: string): Promise<DashboardData> {
  const empty: DashboardData = {
    books: [],
    stats: { bookCount: 0, totalReviews: 0, averageRating: 0, guardianScore: 0 },
    activity: [],
    dbAvailable: true,
  };

  try {
    const supabase = await createClient();

    const [books, activity] = await Promise.all([
      getAuthorBooks(supabase, userId).catch((err) => {
        console.error('[dashboard] books query failed:', err);
        return [];
      }),
      getRecentActivity(supabase, userId, 10).catch((err) => {
        console.error('[dashboard] activity query failed:', err);
        return [];
      }),
    ]);

    return {
      books,
      stats: getAuthorStats(books),
      activity,
      dbAvailable: true,
    };
  } catch (err) {
    console.error('[dashboard] Supabase unreachable:', err);
    return { ...empty, dbAvailable: false };
  }
}

// ─── Page ────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Auth check
  let userId: string | null = null;
  let displayName = 'Creator';

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      redirect('/auth/login?redirect=/dashboard');
    }
    userId = data.user.id;
    displayName =
      (data.user.user_metadata?.full_name as string | undefined) ||
      (data.user.user_metadata?.display_name as string | undefined) ||
      (data.user.user_metadata?.name as string | undefined) ||
      data.user.email?.split('@')[0] ||
      'Creator';
  } catch (err) {
    // If the auth check itself fails (Supabase unreachable), treat as
    // unauthenticated rather than crash.
    console.error('[dashboard] auth check failed:', err);
    redirect('/auth/login?redirect=/dashboard');
  }

  const { books, stats, activity, dbAvailable } =
    await loadDashboardData(userId!);

  const hasBooks = books.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* ── Welcome Header ──────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white/95 tracking-tight">
                Welcome back, {displayName}
              </h1>
              <p className="mt-2 text-white/50 text-lg font-sans">
                Your Open Library dashboard
              </p>
            </div>
            <Link
              href="/contribute"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white font-sans font-medium text-sm transition-all hover:shadow-lg hover:shadow-[#00bcd4]/25 hover:-translate-y-0.5 self-start sm:self-auto"
            >
              <Plus size={16} />
              Publish a new book
            </Link>
          </div>
        </header>

        {/* ── DB unavailable banner ──────────────────────────────────── */}
        {!dbAvailable && (
          <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-5">
            <p className="text-amber-300 text-sm font-medium">
              Dashboard temporarily unavailable
            </p>
            <p className="text-amber-200/70 text-xs mt-1">
              We couldn&rsquo;t reach the library database. Your books and
              stats will reappear as soon as connectivity is restored.
            </p>
          </div>
        )}

        {/* ── Stats Grid ──────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={BookOpen}
            label="My Books"
            value={stats.bookCount}
            accent="teal"
          />
          <StatCard
            icon={Star}
            label="Total Reviews"
            value={stats.totalReviews.toLocaleString()}
            accent="gold"
          />
          <StatCard
            icon={Sparkles}
            label="Average Rating"
            value={
              stats.averageRating > 0 ? stats.averageRating.toFixed(2) : '—'
            }
            accent="blue"
          />
          <StatCard
            icon={Award}
            label="Guardian Score"
            value={
              stats.guardianScore > 0 ? stats.guardianScore.toFixed(0) : '—'
            }
            accent="violet"
          />
        </section>

        {/* ── Main Grid: content + sidebar ───────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main column ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Books */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-white/90">
                  Your Books
                </h2>
                {hasBooks && (
                  <span className="text-xs text-white/40 font-mono tabular-nums">
                    {books.length} total
                  </span>
                )}
              </div>

              {hasBooks ? (
                <div className="space-y-3">
                  {books.map((book) => (
                    <BookRow key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </section>

            {/* Activity */}
            {hasBooks && (
              <section>
                <h2 className="font-display text-xl font-semibold text-white/90 mb-4">
                  Recent Activity
                </h2>
                <ActivityFeed events={activity} />
              </section>
            )}
          </div>

          {/* ── Quick Links Sidebar (desktop only) ─────────────────── */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5">
              <h3 className="text-xs uppercase tracking-wider text-white/40 font-sans font-medium mb-4">
                Quick Links
              </h3>
              <nav className="space-y-1">
                {QUICK_LINKS.map(({ href, label, icon: Icon, external }) =>
                  external ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="inline-flex items-center gap-3">
                        <Icon size={15} strokeWidth={1.75} />
                        {label}
                      </span>
                      <ExternalLink
                        size={11}
                        className="text-white/20 group-hover:text-white/40"
                      />
                    </a>
                  ) : (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.04] transition-colors"
                    >
                      <Icon size={15} strokeWidth={1.75} />
                      {label}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
