import { NextRequest, NextResponse } from "next/server";
import {
  canGenerateCreatureImage,
  creatureAtlasEntryToPromptPack,
  getCreatureAtlasSafetyNotes,
} from "@arcanea/world-engine";
import { generateImages, type ImageProvider } from "@/lib/imagine/generate";
import { getCreatureBySlug } from "@/lib/atlas/creatures";

interface GenerateCreatureImageRequest {
  execute?: boolean;
  count?: number;
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  provider?: ImageProvider;
  model?: string;
}

export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const entry = getCreatureBySlug(slug);

  if (!entry) {
    return NextResponse.json({ error: "Creature not found" }, { status: 404 });
  }

  const body = await readBody(req);
  const promptPack = creatureAtlasEntryToPromptPack(entry);
  const canGenerate = canGenerateCreatureImage(entry);

  if (!canGenerate) {
    return NextResponse.json(
      {
        generated: false,
        error: "Image generation is not allowed for this creature entry.",
        promptPack,
        safetyNotes: getCreatureAtlasSafetyNotes(entry),
      },
      { status: 409 },
    );
  }

  if (!body.execute) {
    return NextResponse.json({
      generated: false,
      mode: "prompt_preview",
      message:
        "Send execute:true to call a configured image provider. Prompt preview is returned by default to avoid accidental spend.",
      promptPack,
      safetyNotes: getCreatureAtlasSafetyNotes(entry),
      providerPolicy: {
        primary: "Configured Arcanea image provider chain",
        fallback: "Prompt-only when no provider key exists",
      },
    });
  }

  try {
    const result = await generateImages({
      prompt: promptPack.prompt,
      count: Math.min(4, Math.max(1, body.count ?? 1)),
      aspectRatio: body.aspectRatio ?? promptPack.aspectRatio,
      forceProvider: body.provider,
      openrouterModel: body.model,
    });

    return NextResponse.json({
      generated: true,
      entry: {
        slug: entry.slug,
        name: entry.name,
        arcaneaVariant: entry.arcaneaVariant.name,
        rightsTier: entry.rightsTier,
      },
      provider: result.provider,
      model: result.model,
      promptPack,
      assets: result.images.map((asset) => ({
        url: asset.url,
        revisedPrompt: asset.revisedPrompt,
        status: "generated_pending_visual_qa",
      })),
      safetyNotes: getCreatureAtlasSafetyNotes(entry),
      nextGate: "Run visual QA and record evidence before marking any asset approved.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image generation failed";
    const status = message.includes("No image generation API configured") ? 503 : 500;

    return NextResponse.json(
      {
        generated: false,
        error: message,
        promptPack,
        safetyNotes: getCreatureAtlasSafetyNotes(entry),
      },
      { status },
    );
  }
}

async function readBody(req: NextRequest): Promise<GenerateCreatureImageRequest> {
  try {
    const body = (await req.json()) as GenerateCreatureImageRequest;
    return body && typeof body === "object" ? body : {};
  } catch {
    return {};
  }
}
