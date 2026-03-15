import Link from 'next/link';
import { getPublishedLuminors } from '@/lib/luminors/luminor-service';
import type { LuminorRow } from '@/lib/luminors/luminor-service';
import { createClient } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// Element color map
// ---------------------------------------------------------------------------

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ff6b35',
  Water: '#4fc3f7',
  Earth: '#6b8e23',
  Wind: '#c0c0c0',
  Void: '#9c27b0',
  Spirit: '#ffd700',
};

// ---------------------------------------------------------------------------
// Luminor Card (Server Component)
// ---------------------------------------------------------------------------

function LuminorCard({ luminor }: { luminor: LuminorRow }) {
  const elementColor = ELEMENT_COLORS[luminor.element] ?? '#00bcd4';
  const stars = luminor.rating && luminor.rating > 0 ? luminor.rating.toFixed(1) : null;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]">
      {/* Top row: avatar + name */}
      <div className="mb-3 flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${luminor.color || '#00bcd4'}, ${luminor.color || '#00bcd4'}60)`,
          }}
        >
          {luminor.avatar || luminor.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-white/90">
            {luminor.name}
          </h3>
          <p className="truncate text-xs text-white/40">{luminor.title}</p>
        </div>
      </div>

      {/* Tagline */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-white/35">
        {luminor.tagline}
      </p>

      {/* Badges row */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {/* Domain */}
        <span className="rounded-full border border-[#00bcd4]/20 bg-[#00bcd4]/8 px-2 py-0.5 text-[10px] font-medium text-[#00bcd4]/80">
          {luminor.domain}
        </span>
        {/* Element */}
        <span
          className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
          style={{
            borderColor: `${elementColor}30`,
            color: `${elementColor}cc`,
            backgroundColor: `${elementColor}10`,
          }}
        >
          {luminor.element}
        </span>
        {/* Tier */}
        {luminor.tier !== 'free' && (
          <span className="rounded-full border border-[#ffd700]/20 bg-[#ffd700]/8 px-2 py-0.5 text-[10px] font-medium text-[#ffd700]/80">
            {luminor.tier}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="mb-4 flex items-center gap-3 text-[11px] text-white/25">
        <span>{luminor.usage_count.toLocaleString()} uses</span>
        {stars && <span>{stars} rating</span>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/chat?luminor=${luminor.id}`}
          className="flex-1 rounded-lg bg-[#00bcd4]/10 px-3 py-2 text-center text-xs font-medium text-[#00bcd4] transition-colors hover:bg-[#00bcd4]/20"
        >
          Use in Chat
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] px-8 py-16 text-center">
      <p className="text-sm text-white/30">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function SanctumPage() {
  // Fetch current user (may be null if not authenticated)
  let userId: string | null = null;
  let myLuminors: LuminorRow[] = [];

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;

    if (userId) {
      const { data } = await supabase
        .from('luminors')
        .select('*')
        .eq('creator_id', userId)
        .order('updated_at', { ascending: false });
      myLuminors = (data ?? []) as LuminorRow[];
    }
  } catch {
    // Auth not configured or Supabase unavailable — continue without user data
  }

  // Fetch published luminors for marketplace
  let publishedLuminors: LuminorRow[] = [];
  try {
    publishedLuminors = await getPublishedLuminors({ limit: 24 });
  } catch {
    // Supabase may not be configured yet
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-12 pt-24 text-center md:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.04)_0%,transparent_50%)]" />
        <div className="relative z-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
            The Sanctum
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Where Intelligence Is Born
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/40">
            Discover Luminors forged by creators across the multiverse.
            Each one thinks differently, creates uniquely, and is ready to chat.
          </p>
          <div className="mt-6">
            <Link
              href="/forge/luminor"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00bcd4] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#00bcd4]/80"
            >
              Forge New Luminor
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        {/* Your Luminors (authenticated only) */}
        {userId && (
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/80">Your Luminors</h2>
              <Link
                href="/forge/luminor"
                className="text-xs font-medium text-[#00bcd4]/70 transition-colors hover:text-[#00bcd4]"
              >
                + Forge New
              </Link>
            </div>

            {myLuminors.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myLuminors.map((l) => (
                  <LuminorCard key={l.id} luminor={l} />
                ))}
              </div>
            ) : (
              <EmptyState message="You haven't forged any Luminors yet. Create your first creative intelligence." />
            )}
          </section>
        )}

        {/* Published Luminors (marketplace) */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white/80">Published Luminors</h2>
            <p className="mt-1 text-xs text-white/30">
              Browse intelligences forged by creators. Use any of them in chat instantly.
            </p>
          </div>

          {publishedLuminors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {publishedLuminors.map((l) => (
                <LuminorCard key={l.id} luminor={l} />
              ))}
            </div>
          ) : (
            <EmptyState message="No published Luminors yet. Be the first to forge and share one." />
          )}
        </section>
      </div>
    </div>
  );
}
