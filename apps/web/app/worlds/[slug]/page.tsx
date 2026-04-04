import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ElementBadge } from "@/components/worlds/ElementBadge";
import { WorldDetailTabs, type WorldPalette } from "./world-detail-tabs";

// ── Data fetching ────────────────────────────────────────────────────

async function getWorld(slug: string) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  const { data: world, error } = await sb
    .from("worlds")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !world) return null;

  if (world.visibility !== "public" && world.creator_id !== user?.id) {
    return null;
  }

  const [characters, factions, locations, events] = await Promise.all([
    sb.from("world_characters").select("*").eq("world_id", world.id),
    sb.from("world_factions").select("*").eq("world_id", world.id),
    sb.from("world_locations").select("*").eq("world_id", world.id),
    sb
      .from("world_events")
      .select("*")
      .eq("world_id", world.id)
      .order("sort_order"),
  ]);

  return {
    ...world,
    // Normalize elements from Json to string[]
    elements: Array.isArray(world.elements)
      ? (world.elements as string[])
      : [],
    characters: characters.data || [],
    factions: factions.data || [],
    locations: locations.data || [],
    events: events.data || [],
  };
}

type WorldData = NonNullable<Awaited<ReturnType<typeof getWorld>>>;

// ── Page ─────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorldDetailPage({ params }: Props) {
  const { slug } = await params;
  const world = await getWorld(slug);

  if (!world) notFound();

  const createdDate = world.created_at
    ? new Date(world.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const elements = world.elements;
  const palette = extractPalette(elements);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Cover image or gradient */}
        <div className="relative w-full aspect-[3/1] max-h-[360px]">
          {world.hero_image_url ? (
            <Image
              src={world.hero_image_url}
              alt={`${world.name} cover`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: palette.gradient }}
            />
          )}
          {/* Fade to page bg */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]"
            aria-hidden="true"
          />
          {/* Subtle noise */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 60%)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* World info overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-24">
          <div className="flex flex-col gap-3">
            {/* Name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight">
              {world.name}
            </h1>

            {/* Tagline */}
            {world.tagline && (
              <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed">
                {world.tagline}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-white/40">
              <span>
                by{" "}
                <span className="text-white/60 font-medium">Creator</span>
              </span>
              {createdDate && (
                <>
                  <span
                    className="w-px h-4 bg-white/10"
                    aria-hidden="true"
                  />
                  <span>{createdDate}</span>
                </>
              )}
              {world.mood && (
                <>
                  <span
                    className="w-px h-4 bg-white/10"
                    aria-hidden="true"
                  />
                  <span className="capitalize">{world.mood}</span>
                </>
              )}
            </div>

            {/* Stat badges + actions */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <StatBadge
                icon="star"
                value={world.star_count ?? 0}
                label="Stars"
              />
              <StatBadge
                icon="fork"
                value={world.fork_count ?? 0}
                label="Forks"
              />
              <StatBadge
                icon="character"
                value={world.characters.length}
                label="Characters"
              />
              <StatBadge
                icon="location"
                value={world.locations.length}
                label="Locations"
              />

              <div className="flex-1" />

              <StarButton slug={world.slug} />
              <ForkButton slug={world.slug} />
            </div>

            {/* Elements */}
            {elements.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {elements.map((el) => (
                  <ElementBadge key={el} element={el} size="md" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 mt-10 pb-24">
        <WorldDetailTabs world={world} palette={palette} slug={slug} />
      </section>
    </main>
  );
}

// ── Helper Components (server-rendered) ──────────────────────────────

function StatBadge({
  icon,
  value,
  label,
}: {
  icon: "star" | "fork" | "character" | "location";
  value: number;
  label: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <StatIcon type={icon} />
      <span className="text-white/60 tabular-nums">{value}</span>
      <span className="text-white/30 hidden sm:inline">{label}</span>
    </div>
  );
}

function StatIcon({ type }: { type: string }) {
  if (type === "star") {
    return (
      <svg
        className="w-3.5 h-3.5 text-[#ffd700]/70"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  if (type === "fork") {
    return (
      <svg
        className="w-3.5 h-3.5 text-white/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
        <path d="M12 12v3" />
      </svg>
    );
  }
  if (type === "character") {
    return (
      <svg
        className="w-3.5 h-3.5 text-white/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg
      className="w-3.5 h-3.5 text-white/40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ── Client action buttons ────────────────────────────────────────────

function StarButton({ slug }: { slug: string }) {
  return (
    <form action={`/api/worlds/${slug}/star`} method="POST">
      <button
        type="submit"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-[#ffd700]/20 text-[#ffd700]/70 hover:text-[#ffd700] hover:bg-[#ffd700]/10 hover:border-[#ffd700]/40 transition-all"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Star
      </button>
    </form>
  );
}

function ForkButton({ slug }: { slug: string }) {
  return (
    <Link
      href={`/chat?mode=world&fork=${slug}`}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] hover:bg-[#00bcd4]/20 hover:border-[#00bcd4]/40 transition-all"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
        <path d="M12 12v3" />
      </svg>
      Fork
    </Link>
  );
}

// ── Palette extraction ───────────────────────────────────────────────

const ELEMENT_HEX: Record<string, string> = {
  Fire: "#ef4444",
  Water: "#3b82f6",
  Earth: "#22c55e",
  Wind: "#e2e8f0",
  Void: "#a855f7",
  Spirit: "#fbbf24",
};

function extractPalette(elements: string[]): WorldPalette {
  if (elements.length === 0) {
    return {
      gradient: "linear-gradient(135deg, #00bcd4, #1a237e, #7c3aed)",
      primary: "#00bcd4",
      secondary: "#7c3aed",
    };
  }

  const colors = elements
    .map((e) => ELEMENT_HEX[e] || "#00bcd4")
    .slice(0, 3);

  if (colors.length === 1) colors.push("#1a237e");
  if (colors.length === 2) colors.push("#09090b");

  return {
    gradient: `linear-gradient(135deg, ${colors.join(", ")})`,
    primary: colors[0],
    secondary: colors[1],
  };
}
