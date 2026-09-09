import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SOVEREIGN_DEPTHS,
  SOVEREIGN_ENTRIES,
} from "@/lib/visual-encyclopedia/sovereign-depths";
import {
  filterSovereignEntries,
  containsExperimental,
} from "@/lib/visual-encyclopedia/sovereign-depths-schema";

const querySchema = z.object({
  includeExperimental: z.enum(["true", "false"]).default("false"),
  includeProposals: z.enum(["true", "false"]).default("false"),
  kind: z.enum(["all", "boss", "dungeon"]).default("all"),
  query: z.string().max(160).default(""),
  id: z
    .string()
    .regex(/^[bd]\d{2}$/u)
    .optional(),
});

export function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid collection query.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const { includeProposals, includeExperimental, kind, query, id } =
    parsed.data;
  const entries =
    includeProposals === "true"
      ? filterSovereignEntries(SOVEREIGN_ENTRIES, query, kind).filter(
          (entry) =>
            (!id || entry.id === id) &&
            (includeExperimental === "true" || !containsExperimental(entry)),
        )
      : [];
  return NextResponse.json(
    {
      schemaVersion: "arcanea.public-collection.v1",
      collectionId: SOVEREIGN_DEPTHS.id,
      title: SOVEREIGN_DEPTHS.title,
      canonStatus: SOVEREIGN_DEPTHS.canonStatus,
      source: SOVEREIGN_DEPTHS.source,
      notice:
        "These are worldbuilding proposals, not locked canon. Game encounters and books are authored concepts, not shipped games or published books.",
      includeProposals: includeProposals === "true",
      includeExperimental: includeExperimental === "true",
      series:
        includeProposals === "true"
          ? SOVEREIGN_DEPTHS.series.filter(
              (series) =>
                includeExperimental === "true" || !containsExperimental(series),
            )
          : [],
      factions:
        includeProposals === "true"
          ? SOVEREIGN_DEPTHS.factions.filter(
              (faction) =>
                includeExperimental === "true" ||
                !containsExperimental(faction),
            )
          : [],
      total: entries.length,
      entries,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
