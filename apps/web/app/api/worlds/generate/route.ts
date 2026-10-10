/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
import type { Json } from '@/lib/database/types/world-graph-types';

export const maxDuration = 30;

const WORLD_FORGE_PROMPT = `You are the master World-Forging Intelligence of Arcanea, operating according to the canonical laws of the Arcanean Multiverse, Sanderson's Three Laws of Magic, Tolkien's Philological Rigor, and Campbell's Monomyth.

Given this world concept: "{DESCRIPTION}"

Generate a complete world in JSON format:
{
  "name": "Creative world name (2-4 words)",
  "slug": "url-safe-kebab-slug",
  "tagline": "One compelling, high-stakes sentence",
  "description": "2-3 paragraph rich description of this world. Follow the Five Sensory Anchor Laws: ground every scene in weight, texture, acoustic resonance, scent, and temperature. NEVER use banned AI clichés like 'unleash', 'rich tapestry', 'testament to', 'delve', 'nestled', 'intricate dance', or 'beacon of hope'.",
  "mood": "Visual aesthetic description for art generation (e.g. 'cinematic dark fantasy with bioluminescent flora, wet basalt, volumetric fog')",
  "resonance": {
    "primary_gate": "One of: Foundation, Flow, Fire, Heart, Voice, Sight, Crown, Starweaving, Unity, Source",
    "frequency_hz": 528,
    "acoustic_manifestation": "How the fundamental Solfeggio standing-wave physically manifests in matter and senses"
  },
  "linguistic_family": "One of: High Eldrian, Veldarín, Aurevaldan, Sunder-tongue, Solar Common, Deep Runic",
  "elements": [
    { "name": "Element name", "domain": "What it governs", "color": "#hexcolor" }
  ],
  "laws": [
    { "name": "Law name", "description": "Unbreakable natural or metaphysical rule of this world" }
  ],
  "systems": [
    {
      "name": "System name",
      "type": "harmonic, elemental, or technomantic",
      "rules": "How practitioners interface with the system",
      "bodily_cost": "Concrete physical toll on the wielder (e.g. capillary frost, retinal burning, copper taste, tremor)",
      "failure_boundary": "Exact limit where power collapses or rebounds dangerously",
      "counter_remedy": "Tangible physical countermeasure or grounding ritual"
    }
  ],
  "characters": [
    {
      "name": "Character name (phonetically adhering to the chosen linguistic family)",
      "title": "Their role or title",
      "personality": { "traits": ["trait1", "trait2", "trait3"], "voice_style": "How they speak" },
      "backstory": "2-3 sentence backstory",
      "element": "Primary element",
      "origin_class": "One of: Arcan, Gate-Touched, Bonded, Synth, Awakened, Celestial, Voidtouched, Architect",
      "monomyth_stage": "One of: Ordinary World, Call to Adventure, Meeting the Mentor, Crossing the Threshold, Tests & Allies, The Inmost Cave, The Ordeal, Reward, The Road Back, Resurrection, Master of Two Worlds"
    }
  ],
  "locations": [
    {
      "name": "Location name (phonetically adhering to the linguistic family)",
      "region": "Region name",
      "description": "2-3 sentence description with concrete sensory details",
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
  "image_prompt": "Detailed prompt for generating hero art of this world (cinematic, epic, concept art style, unreal engine 5 render, 8k)"
}

Generate 3 elements, 3 laws, 1 Sandersonian magic/harmonic system with explicit bodily_cost, failure_boundary, and counter_remedy, 3 characters with monomyth_stage, 3 locations, 1 founding event.
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
    const characters = Array.isArray(worldData.characters)
      ? (worldData.characters as Record<string, unknown>[])
      : [];
    const locations = Array.isArray(worldData.locations)
      ? (worldData.locations as Record<string, unknown>[])
      : [];
    const event = (worldData.first_event as Record<string, unknown>) ?? null;
    const imagePrompt = typeof worldData.image_prompt === 'string' ? worldData.image_prompt : '';

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

        // Insert world (image_prompt / first_event are not DB columns — kept in response only)
        const { data: insertedWorld, error: worldErr } = await supabase
          .from('worlds')
          .insert({
            name: worldData.name as string,
            slug,
            tagline: (worldData.tagline as string) ?? null,
            description: (worldData.description as string) ?? null,
            mood: (worldData.mood as string) ?? null,
            elements: (worldData.elements as Json) ?? null,
            laws: (worldData.laws as Json) ?? null,
            systems: (worldData.systems as Json) ?? null,
            palette: (worldData.palette as Json) ?? null,
            creator_id: user.id,
            visibility: 'private',
          })
          .select('id')
          .single();

        if (!worldErr && insertedWorld) {
          savedWorldId = insertedWorld.id;

          // Insert characters and locations in parallel
          const wid = savedWorldId!; // safe — we just inserted and checked
          await Promise.all([
            characters.length > 0
              ? supabase.from('world_characters').insert(
                  characters.map((c) => ({
                    world_id: wid,
                    name: c.name as string,
                    title: (c.title as string) ?? null,
                    personality: (c.personality as Json) ?? {},
                    backstory: (c.backstory as string) ?? null,
                    element: (c.element as string) ?? null,
                    origin_class: (c.origin_class as string) ?? null,
                  })),
                )
              : null,
            locations.length > 0
              ? supabase.from('world_locations').insert(
                  locations.map((l) => ({
                    world_id: wid,
                    name: l.name as string,
                    region: (l.region as string) ?? null,
                    description: (l.description as string) ?? null,
                    significance: (l.significance as string) ?? null,
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
