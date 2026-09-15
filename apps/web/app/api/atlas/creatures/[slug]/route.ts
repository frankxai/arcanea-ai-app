import { NextRequest, NextResponse } from "next/server";
import { getCreatureBySlug } from "@/lib/atlas/creatures";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const entry = getCreatureBySlug(slug);

  if (!entry) {
    return NextResponse.json({ error: "Creature not found" }, { status: 404 });
  }

  return NextResponse.json({
    entry,
    canonical: {
      source: "repo-seeded atlas content",
      worldRepoField: "content.creatures",
    },
  });
}
