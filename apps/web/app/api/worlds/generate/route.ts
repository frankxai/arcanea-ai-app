/**
 * World Generator API — "Describe your world in one sentence"
 *
 * POST /api/worlds/generate
 *
 * The killer feature: a creator types "A world where music is magic" and gets
 * back a complete World — name, characters, locations, lore, and concept art
 * prompt. Powered by Gemini via Vercel AI SDK.
 *
 * Generation returns an unsaved draft for every user. Saving is a separate action.
 */

import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { randomUUID } from "node:crypto";
import { worldDraftSchema, draftResult } from "@/lib/worlds/draft";

export const maxDuration = 30;

const WORLD_FORGE_PROMPT = `You are a world-building AI for Arcanea, a creative multiverse platform.

Given this world concept: "{DESCRIPTION}"

Generate a complete world in JSON format:
{
  "name": "Creative world name (2-4 words)",
  "slug": "url-safe-slug",
  "tagline": "One compelling sentence",
  "description": "2-3 paragraph rich description of this world",
  "mood": "Visual aesthetic description for art generation (e.g. 'dark epic fantasy with bioluminescent flora')",
  "elements": [
    { "name": "Element name", "domain": "What it governs", "color": "#hexcolor" }
  ],
  "laws": [
    { "name": "Law name", "description": "Rule of this world" }
  ],
  "systems": [
    { "name": "System name", "type": "magic or technology", "rules": "How it works" }
  ],
  "characters": [
    {
      "name": "Character name",
      "title": "Their role/title",
      "personality": { "traits": ["trait1", "trait2", "trait3"], "voice_style": "How they speak" },
      "backstory": "2-3 sentence backstory",
      "element": "Primary element",
      "origin_class": "One of: Arcan, Gate-Touched, Bonded, Synth, Awakened, Celestial, Voidtouched, Architect"
    }
  ],
  "locations": [
    {
      "name": "Location name",
      "region": "Region name",
      "description": "2-3 sentence description",
      "significance": "Why this place matters"
    }
  ],
  "first_event": {
    "title": "Founding event name",
    "description": "What happened to create this world",
    "era": "Era name"
  },
  "palette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex"
  },
  "image_prompt": "Detailed prompt for generating hero art of this world (cinematic, epic, concept art style)"
}

Generate 3 elements, 3 laws, 1 magic/tech system, 2-3 characters, 2-3 locations, 1 founding event.
Be creative, specific, and evocative. Avoid generic fantasy tropes.
RESPOND WITH ONLY valid JSON. No markdown, no explanation, no code fences.`;

function resolveModel() {
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  if (googleKey) {
    const google = createGoogleGenerativeAI({ apiKey: googleKey });
    return google("gemini-2.5-flash");
  }
  if (openrouterKey) {
    const openrouter = createOpenAI({
      apiKey: openrouterKey,
      baseURL: "https://openrouter.ai/api/v1",
    });
    return openrouter("google/gemini-2.5-flash");
  }
  return null;
}

function parseJsonResponse(text: string): Record<string, unknown> | null {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const description =
      body &&
      typeof body === "object" &&
      "description" in body &&
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (
      !description ||
      typeof description !== "string" ||
      description.length < 5
    ) {
      return NextResponse.json(
        { error: "Describe your world in at least a few words." },
        { status: 400 },
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: "Description too long. Keep it under 500 characters." },
        { status: 400 },
      );
    }

    // --- Resolve AI model ---
    const model = resolveModel();
    if (!model) {
      return NextResponse.json(
        {
          error:
            "World generation is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }

    // --- Generate world ---
    const systemPrompt = WORLD_FORGE_PROMPT.replace(
      "{DESCRIPTION}",
      description,
    );

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: `Create a world based on: "${description}"`,
      temperature: 0.9,
      maxOutputTokens: 4096,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(25000),
      providerOptions: { google: { thinkingConfig: { thinkingBudget: 0 } } },
    });

    const parsed = worldDraftSchema.safeParse(parseJsonResponse(result.text));
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "The generated draft was incomplete. Your concept is still here; please try again.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json(draftResult(parsed.data, randomUUID()));
  } catch {
    console.error("World generation failed.");
    return NextResponse.json(
      {
        error:
          "World generation failed. Your concept is still here; please try again.",
      },
      { status: 500 },
    );
  }
}
