import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  WEIGHT_OF_WONDERS,
  WONDER_ENTRIES,
} from "@/lib/visual-encyclopedia/weight-of-wonders";
import { filterWonderEntries } from "@/lib/visual-encyclopedia/weight-of-wonders-schema";

const querySchema = z.object({
  includeExperimental: z.enum(["true", "false"]).default("false"),
  includeProposals: z.enum(["true", "false"]).default("false"),
  kind: z.enum(["all", "boss", "dungeon"]).default("all"),
  query: z.string().max(160).default(""),
  id: z
    .string()
    .regex(/^wow-[bd]0[1-3]$/u)
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
  const optedIn = includeProposals === "true" && includeExperimental === "true";
  const entries = optedIn
    ? filterWonderEntries(WONDER_ENTRIES, query, kind).filter(
        (entry) => !id || entry.id === id,
      )
    : [];
  return NextResponse.json(
    {
      schemaVersion: "arcanea.public-collection.v1",
      collectionId: WEIGHT_OF_WONDERS.collection.id,
      title: WEIGHT_OF_WONDERS.collection.title,
      canonStatus: WEIGHT_OF_WONDERS.collection.canonStatus,
      source: WEIGHT_OF_WONDERS.collection.source,
      notice:
        "These six records are experimental worldbuilding proposals. Encounter and story material is an authoring aid, not shipped gameplay or locked canon.",
      includeProposals: includeProposals === "true",
      includeExperimental: includeExperimental === "true",
      trilogy: optedIn ? WEIGHT_OF_WONDERS.collection.trilogy : [],
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
