/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { WorldsClient, type WorldCard } from "./worlds-client";
import { WorldsHero } from "./worlds-hero";

export const metadata: Metadata = {
  title: "Worlds — Build Your Universe — Arcanea",
  description:
    "Build your own fantasy universe with the Living Worlds engine. Characters, locations, magic systems, and lore — all interconnected.",
  openGraph: {
    title: "Worlds — Build Your Universe — Arcanea",
    description:
      "Build your own fantasy universe with the Living Worlds engine. Characters, locations, magic systems, and lore — all interconnected.",
  },
  alternates: { canonical: "/worlds" },
};

// ---------------------------------------------------------------------------
// Template worlds — always available as fallback
// ---------------------------------------------------------------------------

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "var(--arc-fire)",
  Water: "var(--arc-brand-cosmic-blue)",
  Earth: "var(--arc-wind)",
  Wind: "var(--arc-text-primary)",
  Void: "var(--arc-void)",
  Spirit: "var(--arc-brand-arcanean-gold)",
};

const TEMPLATE_WORLDS: WorldCard[] = [
  {
    id: "eldria-prime",
    name: "Eldria Prime",
    tagline: "The Celestine Heartland atop Mount Solaris — 1111 Hz Source Gate",
    creator: "Assembly of Luminors",
    stars: 124,
    forks: 38,
    characters: 28,
    mood: "mythological",
    elements: [
      { name: "Spirit", color: ELEMENT_COLORS.Spirit },
      { name: "Wind", color: ELEMENT_COLORS.Wind },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-arcanean-gold), var(--arc-brand-cosmic-blue), var(--arc-brand-atlantean-teal))",
    isTemplate: true,
  },
  {
    id: "veldoria",
    name: "Veldoria",
    tagline: "The Singing Valleys of acoustic chalk-stone — 528 Hz Voice Gate",
    creator: "Alera",
    stars: 96,
    forks: 24,
    characters: 18,
    mood: "fantasy",
    elements: [
      { name: "Wind", color: ELEMENT_COLORS.Wind },
      { name: "Water", color: ELEMENT_COLORS.Water },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-atlantean-teal), var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold))",
    isTemplate: true,
  },
  {
    id: "aurevalde",
    name: "Aurevalde",
    tagline: "Thermal ironstone mesas and solar-tempered steppes — 396 Hz Fire Gate",
    creator: "Draconia",
    stars: 82,
    forks: 19,
    characters: 16,
    mood: "fantasy",
    elements: [
      { name: "Fire", color: ELEMENT_COLORS.Fire },
      { name: "Earth", color: ELEMENT_COLORS.Earth },
    ],
    gradient: "linear-gradient(135deg, var(--arc-fire), var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold))",
    isTemplate: true,
  },
  {
    id: "mar-arcano",
    name: "Mar Arcano",
    tagline: "Subterranean bioluminescent sea and 5-realm aquifer — 285 Hz Flow Gate",
    creator: "Leyla",
    stars: 110,
    forks: 31,
    characters: 22,
    mood: "mythological",
    elements: [
      { name: "Water", color: ELEMENT_COLORS.Water },
      { name: "Void", color: ELEMENT_COLORS.Void },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-brand-atlantean-teal), var(--arc-cosmic-void))",
    isTemplate: true,
  },
  {
    id: "the-shadowfen",
    name: "The Shadowfen",
    tagline: "Sunken obsidian arches and petrified cedar groves — 174 Hz Foundation Gate",
    creator: "Malachar / Sealed Archive",
    stars: 75,
    forks: 42,
    characters: 14,
    mood: "horror",
    elements: [
      { name: "Void", color: ELEMENT_COLORS.Void },
      { name: "Earth", color: ELEMENT_COLORS.Earth },
    ],
    gradient: "linear-gradient(135deg, var(--arc-cosmic-void), var(--arc-void), var(--arc-brand-cosmic-blue))",
    isTemplate: true,
  },
];

// ---------------------------------------------------------------------------
// Helper: map Supabase row to WorldCard
// ---------------------------------------------------------------------------

interface WorldRow {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  creator_id: string;
  star_count: number;
  fork_count: number;
  character_count: number;
  mood: string;
  elements: unknown;
  gradient: string | null;
  profiles?: { display_name: string | null; username: string | null } | null;
}

function mapRowToCard(row: WorldRow): WorldCard {
  const rawElements = Array.isArray(row.elements) ? row.elements : [];
  const elements = rawElements.map((el: { name?: string; color?: string }) => ({
    name: el.name ?? "Unknown",
    color: el.color ?? ELEMENT_COLORS[el.name ?? ""] ?? "var(--arc-earth)",
  }));

  const creatorName =
    row.profiles?.display_name || row.profiles?.username || "Creator";

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline ?? "",
    creator: creatorName,
    stars: row.star_count ?? 0,
    forks: row.fork_count ?? 0,
    characters: row.character_count ?? 0,
    mood: row.mood as WorldCard["mood"],
    elements,
    gradient:
      row.gradient ??
      "linear-gradient(135deg, var(--arc-brand-atlantean-teal), var(--arc-void), var(--arc-brand-arcanean-gold))",
  };
}

// ---------------------------------------------------------------------------
// Server Component
// ---------------------------------------------------------------------------

export default async function WorldsPage() {
  let dbWorlds: WorldCard[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("worlds")
      .select("*, profiles(display_name, username)")
      .eq("visibility", "public")
      .order("star_count", { ascending: false })
      .limit(20);

    if (data && data.length > 0) {
      dbWorlds = data.map((row) => mapRowToCard(row as unknown as WorldRow));
    }
  } catch {
    // Supabase not available or table doesn't exist yet — use templates only
  }

  // Merge: real worlds first, then templates as fallback
  const allWorlds =
    dbWorlds.length > 0
      ? [...dbWorlds, ...TEMPLATE_WORLDS]
      : TEMPLATE_WORLDS;

  return (
    <>
      <WorldsHero />
      <WorldsClient worlds={allWorlds} />
    </>
  );
}
