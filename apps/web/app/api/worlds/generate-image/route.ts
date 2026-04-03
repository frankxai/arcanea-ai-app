/**
 * POST /api/worlds/generate-image
 *
 * Takes MCP character/location/creature blueprint and generates an image
 * using Google Gemini via Vercel AI SDK.
 *
 * Flow: MCP visualize_character → this API → Gemini → image URL → CharacterCard
 */

import { NextRequest, NextResponse } from "next/server";
import { buildGeminiCharacterPrompt, getArtDirection } from "@/lib/worlds/image-gen";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, blueprint, style } = body;

    if (!type || !blueprint) {
      return NextResponse.json(
        { error: "Missing type or blueprint" },
        { status: 400 }
      );
    }

    let prompt: string;

    switch (type) {
      case "character":
        prompt = buildGeminiCharacterPrompt(blueprint);
        break;
      case "location":
        prompt = buildLocationPrompt(blueprint);
        break;
      case "creature":
        prompt = buildCreaturePrompt(blueprint);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}. Use character, location, or creature.` },
          { status: 400 }
        );
    }

    // Apply style override if provided
    if (style) {
      prompt = `Style: ${style}. ${prompt}`;
    }

    // Use Gemini for image generation via the AI provider
    // The actual Gemini call depends on which API key is configured
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return the prompt without generating — useful for using with external tools
      return NextResponse.json({
        generated: false,
        prompt,
        message: "No GOOGLE_AI_API_KEY configured. Use this prompt with Gemini, Midjourney, or any image gen tool.",
        artDirection: type === "character"
          ? getArtDirection(blueprint.primaryElement, blueprint.rank)
          : undefined,
      });
    }

    // Gemini Imagen API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { generated: false, prompt, error: `Gemini API error: ${response.status}`, detail: error },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Extract image from Gemini response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));

    if (!imagePart) {
      return NextResponse.json({
        generated: false,
        prompt,
        message: "Gemini returned text but no image. The prompt may need adjustment.",
        textResponse: parts.find((p: any) => p.text)?.text,
      });
    }

    return NextResponse.json({
      generated: true,
      imageData: imagePart.inlineData.data, // base64
      mimeType: imagePart.inlineData.mimeType,
      prompt,
      artDirection: type === "character"
        ? getArtDirection(blueprint.primaryElement, blueprint.rank)
        : undefined,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate image", detail: String(error) },
      { status: 500 }
    );
  }
}

// --- Prompt builders for non-character types ---

function buildLocationPrompt(blueprint: {
  name: string;
  dominantElement: string;
  type: string;
  alignment?: string;
}): string {
  const artDir = getArtDirection(blueprint.dominantElement, "Master");
  return [
    `Create a stunning fantasy landscape painting of ${blueprint.name}.`,
    `It is a ${blueprint.type} aligned with ${blueprint.dominantElement} energy.`,
    `Mood: ${blueprint.alignment === "dark" ? "ominous and ancient" : blueprint.alignment === "light" ? "sacred and welcoming" : "mysterious twilight balance"}.`,
    `Color palette: ${artDir.palette}.`,
    `Reference: ${artDir.reference} landscape style.`,
    "Wide shot, epic scale, no characters, painterly fantasy art.",
    "No text, no watermarks.",
  ].join(" ");
}

function buildCreaturePrompt(blueprint: {
  name: string;
  element: string;
  size?: string;
  temperament?: string;
  species?: string;
}): string {
  const artDir = getArtDirection(blueprint.element, "Master");
  return [
    `Create a detailed creature illustration of ${blueprint.name}.`,
    blueprint.species ? `Species: ${blueprint.species}.` : "",
    `${blueprint.element}-aligned magical creature, ${blueprint.size || "medium"} sized.`,
    `Temperament: ${blueprint.temperament || "neutral"}.`,
    `Color palette: ${artDir.palette}.`,
    "Detailed fantasy biology, believable anatomy, magical aura.",
    "Dark background, dramatic lighting, concept art style.",
    "No text, no watermarks.",
  ].filter(Boolean).join(" ");
}
