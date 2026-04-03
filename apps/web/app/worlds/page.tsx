import { createClient } from "@/lib/supabase/server";
import { WorldsClient, type WorldCard } from "./worlds-client";

// ---------------------------------------------------------------------------
// Template worlds — always available as fallback
// ---------------------------------------------------------------------------

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#ef4444",
  Water: "#3b82f6",
  Earth: "#22c55e",
  Wind: "#e2e8f0",
  Void: "#a855f7",
  Spirit: "#fbbf24",
};

const TEMPLATE_WORLDS: WorldCard[] = [
  {
    id: "arcanea-prime",
    name: "Arcanea Prime",
    tagline: "The original world of Luminors, Guardians, and the Ten Gates",
    creator: "Arcanea",
    stars: 1111,
    forks: 42,
    characters: 28,
    mood: "mythological",
    elements: [
      { name: "Fire", color: ELEMENT_COLORS.Fire },
      { name: "Water", color: ELEMENT_COLORS.Water },
      { name: "Earth", color: ELEMENT_COLORS.Earth },
      { name: "Wind", color: ELEMENT_COLORS.Wind },
      { name: "Void", color: ELEMENT_COLORS.Void },
    ],
    gradient: "linear-gradient(135deg, #7fffd4, #1a237e, #ffd700)",
    isTemplate: true,
  },
  {
    id: "shadowfen-chronicles",
    name: "The Shadowfen",
    tagline: "Where Malachar's corruption seeps through fractured reality",
    creator: "Arcanea",
    stars: 777,
    forks: 18,
    characters: 12,
    mood: "horror",
    elements: [
      { name: "Void", color: ELEMENT_COLORS.Void },
      { name: "Fire", color: ELEMENT_COLORS.Fire },
    ],
    gradient: "linear-gradient(135deg, #4c1d95, #0f0f23, #7c2d12)",
    isTemplate: true,
  },
  {
    id: "starweave-academy",
    name: "Starweave Academy",
    tagline: "Seven houses, ten gates, and a thousand stories waiting to unfold",
    creator: "Arcanea",
    stars: 528,
    forks: 31,
    characters: 19,
    mood: "fantasy",
    elements: [
      { name: "Spirit", color: ELEMENT_COLORS.Spirit },
      { name: "Water", color: ELEMENT_COLORS.Water },
      { name: "Wind", color: ELEMENT_COLORS.Wind },
    ],
    gradient: "linear-gradient(135deg, #78a6ff, #fbbf24, #7fffd4)",
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
    color: el.color ?? ELEMENT_COLORS[el.name ?? ""] ?? "#888",
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
      "linear-gradient(135deg, #00bcd4, #7c3aed, #ffd700)",
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

  return <WorldsClient worlds={allWorlds} />;
}
