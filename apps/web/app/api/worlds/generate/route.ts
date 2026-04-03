/**
 * World Generator API — "Describe your world in one sentence"
 *
 * POST /api/worlds/generate
 *
 * The killer feature: a creator types "A world where music is magic" and gets
 * back a complete World — name, characters, locations, lore, and concept art
 * prompt. Powered by Gemini via Vercel AI SDK.
 *
 * Auth: optional. Guests get a preview; authenticated users get it saved to DB.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createClient } from '@/lib/supabase/server';

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
    return google('gemini-2.0-flash');
  }
  if (openrouterKey) {
    const openrouter = createOpenAI({
      apiKey: openrouterKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });
    return openrouter('google/gemini-2.5-flash');
  }
  return null;
}

function parseJsonResponse(text: string): Record<string, unknown> | null {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== 'string' || description.length < 5) {
      return NextResponse.json(
        { error: 'Describe your world in at least a few words.' },
        { status: 400 },
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: 'Description too long. Keep it under 500 characters.' },
        { status: 400 },
      );
    }

    // --- Resolve AI model ---
    const model = resolveModel();
    if (!model) {
      return NextResponse.json(
        { error: 'No AI provider configured. Set GOOGLE_GENERATIVE_AI_API_KEY on Vercel.' },
        { status: 503 },
      );
    }

    // --- Generate world ---
    const systemPrompt = WORLD_FORGE_PROMPT.replace('{DESCRIPTION}', description);

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: `Create a world based on: "${description}"`,
      temperature: 0.9,
      maxOutputTokens: 4096,
    });

    const worldData = parseJsonResponse(result.text);
    if (!worldData || !worldData.name || !worldData.slug) {
      return NextResponse.json(
        { error: 'World generation produced invalid data. Try a more descriptive sentence.' },
        { status: 500 },
      );
    }

    // Extract structured pieces from the generated data
    const characters = (worldData.characters as Record<string, unknown>[]) ?? [];
    const locations = (worldData.locations as Record<string, unknown>[]) ?? [];
    const event = (worldData.first_event as Record<string, unknown>) ?? null;
    const imagePrompt = (worldData.image_prompt as string) ?? '';

    // --- Auth check: save to DB if authenticated ---
    let saved = false;
    let savedWorldId: string | null = null;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Ensure unique slug
        const baseSlug = worldData.slug as string;
        const { count } = await supabase
          .from('worlds')
          .select('id', { count: 'exact', head: true })
          .eq('slug', baseSlug);

        const slug = count && count > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

        // Insert world
        const { data: insertedWorld, error: worldErr } = await supabase
          .from('worlds')
          .insert({
            name: worldData.name,
            slug,
            tagline: worldData.tagline ?? null,
            description: worldData.description ?? null,
            mood: worldData.mood ?? null,
            elements: worldData.elements ?? null,
            laws: worldData.laws ?? null,
            systems: worldData.systems ?? null,
            palette: worldData.palette ?? null,
            image_prompt: imagePrompt || null,
            first_event: event,
            creator_id: user.id,
            visibility: 'private',
          })
          .select('id')
          .single();

        if (!worldErr && insertedWorld) {
          savedWorldId = (insertedWorld as { id: string }).id;

          // Insert characters and locations in parallel
          await Promise.all([
            characters.length > 0
              ? supabase.from('world_characters').insert(
                  characters.map((c) => ({
                    world_id: savedWorldId,
                    name: c.name,
                    title: c.title ?? null,
                    personality: c.personality ?? null,
                    backstory: c.backstory ?? null,
                    element: c.element ?? null,
                    origin_class: c.origin_class ?? null,
                  })),
                )
              : null,
            locations.length > 0
              ? supabase.from('world_locations').insert(
                  locations.map((l) => ({
                    world_id: savedWorldId,
                    name: l.name,
                    region: l.region ?? null,
                    description: l.description ?? null,
                    significance: l.significance ?? null,
                  })),
                )
              : null,
          ]);

          saved = true;
        }
      }
    } catch {
      // Non-fatal: return generated data even if save fails
    }

    return NextResponse.json({
      world: worldData,
      characters,
      locations,
      event,
      image_prompt: imagePrompt,
      saved,
      ...(savedWorldId ? { world_id: savedWorldId } : {}),
    });
  } catch (error) {
    console.error('World generate API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'World generation failed' },
      { status: 500 },
    );
  }
}
