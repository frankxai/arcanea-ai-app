import { NextRequest, NextResponse } from "next/server";
import {
  getCreatureAtlasFilters,
  getCreatureAtlasStats,
  searchCreatureAtlas,
  type CreatureAtlasElement,
} from "@/lib/atlas/creatures";
import type { CreatureRightsTier } from "@arcanea/world-engine";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 100)));

  const entries = searchCreatureAtlas({
    query: searchParams.get("q") || undefined,
    world: searchParams.get("world") || undefined,
    element: (searchParams.get("element") as CreatureAtlasElement | "all" | null) || undefined,
    rights: (searchParams.get("rights") as CreatureRightsTier | "all" | null) || undefined,
    taxonomy: searchParams.get("taxonomy") || undefined,
    hasApprovedImage: searchParams.get("hasImage") === "approved",
    limit,
  });

  return NextResponse.json({
    entries,
    count: entries.length,
    stats: getCreatureAtlasStats(),
    filters: getCreatureAtlasFilters(),
    canonical: {
      source: "repo-seeded atlas content",
      worldRepoField: "content.creatures",
      mediaPolicy: "Arcanea-original generated variants only; no official franchise art.",
    },
  });
}
