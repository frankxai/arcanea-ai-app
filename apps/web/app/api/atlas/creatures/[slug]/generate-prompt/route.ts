import { NextRequest, NextResponse } from "next/server";
import {
  canGenerateCreatureImage,
  creatureAtlasEntryToPromptPack,
  getCreatureAtlasSafetyNotes,
} from "@arcanea/world-engine";
import { getCreatureBySlug } from "@/lib/atlas/creatures";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const entry = getCreatureBySlug(slug);

  if (!entry) {
    return NextResponse.json({ error: "Creature not found" }, { status: 404 });
  }

  const promptPack = creatureAtlasEntryToPromptPack(entry);

  return NextResponse.json({
    generated: false,
    mode: "prompt_only",
    entry: {
      slug: entry.slug,
      name: entry.name,
      arcaneaVariant: entry.arcaneaVariant.name,
      rightsTier: entry.rightsTier,
      generationPolicy: entry.arcaneaVariant.generationPolicy,
    },
    canGenerateImage: canGenerateCreatureImage(entry),
    promptPack,
    safetyNotes: getCreatureAtlasSafetyNotes(entry),
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  return POST(req, context);
}
