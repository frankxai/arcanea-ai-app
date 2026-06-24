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

export const dynamic = "force-dynamic";

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
    id: "arcanea-prime",
    name: "Arcanea Prime",
    tagline: "The original world of Luminors, Guardians, and the Ten Gates",
    creator: "Arcanea",
    stars: 0,
    forks: 0,
    characters: 28,
    mood: "mythological",
    elements: [
      { name: "Fire", color: ELEMENT_COLORS.Fire },
      { name: "Water", color: ELEMENT_COLORS.Water },
      { name: "Earth", color: ELEMENT_COLORS.Earth },
      { name: "Wind", color: ELEMENT_COLORS.Wind },
      { name: "Void", color: ELEMENT_COLORS.Void },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-atlantean-teal), var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold))",
    isTemplate: true,
  },
  {
    id: "shadowfen-chronicles",
    name: "The Shadowfen",
    tagline: "Where Malachar's corruption seeps through fractured reality",
    creator: "Arcanea",
    stars: 0,
    forks: 0,
    characters: 12,
    mood: "horror",
    elements: [
      { name: "Void", color: ELEMENT_COLORS.Void },
      { name: "Fire", color: ELEMENT_COLORS.Fire },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-cosmic-void), var(--arc-earth))",
    isTemplate: true,
  },
  {
    id: "starweave-academy",
    name: "Starweave Academy",
    tagline: "Seven houses, ten gates, and a thousand stories waiting to unfold",
    creator: "Arcanea",
    stars: 0,
    forks: 0,
    characters: 19,
    mood: "fantasy",
    elements: [
      { name: "Spirit", color: ELEMENT_COLORS.Spirit },
      { name: "Water", color: ELEMENT_COLORS.Water },
      { name: "Wind", color: ELEMENT_COLORS.Wind },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold), var(--arc-brand-atlantean-teal))",
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
      dbWorlds = data.map((row: any) => mapRowToCard(row as unknown as WorldRow));
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
