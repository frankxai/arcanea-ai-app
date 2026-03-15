/**
 * /api/luminors — List published Luminors (GET) and save new ones (POST).
 *
 * Uses Node.js runtime (cookie-based Supabase auth requires next/headers).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublishedLuminors, saveLuminor } from '@/lib/luminors/luminor-service';
import { createClient } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// GET — Browse published Luminors
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain') ?? undefined;
    const element = searchParams.get('element') ?? undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '24', 10), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10), 0);

    const luminors = await getPublishedLuminors({ domain, element, limit, offset });

    return NextResponse.json({ data: luminors, count: luminors.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch luminors';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST — Create a new Luminor
// ---------------------------------------------------------------------------

const REQUIRED_FIELDS = ['name', 'title', 'tagline', 'domain', 'voice', 'element', 'avatar', 'color', 'gradient'] as const;

export async function POST(req: NextRequest) {
  try {
    // Authenticate via cookie session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? null;
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required. Sign in to forge a Luminor.' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate personality is an array with at least one entry
    if (!Array.isArray(body.personality) || body.personality.length === 0) {
      return NextResponse.json(
        { error: 'personality must be a non-empty array of strings' },
        { status: 400 }
      );
    }

    // Build LuminorSpec from body
    const now = new Date().toISOString();
    const spec = {
      id: body.id ?? crypto.randomUUID(),
      version: 2 as const,
      name: body.name,
      title: body.title,
      tagline: body.tagline,
      origin: body.origin ?? 'forged',
      domain: body.domain,
      voice: body.voice,
      personality: body.personality,
      element: body.element,
      wisdom: body.wisdom,
      systemPrompt: body.systemPrompt ?? body.system_prompt ?? '',
      preferredModel: body.preferredModel ?? body.preferred_model,
      temperature: body.temperature,
      knowledge: body.knowledge ?? [],
      starters: body.starters ?? [],
      tools: body.tools ?? [],
      tags: body.tags ?? [],
      gateAlignment: body.gateAlignment ?? body.gate_alignment ?? [],
      avatar: body.avatar,
      color: body.color,
      gradient: body.gradient,
      creatorId: userId,
      companionId: body.companionId ?? body.companion_id ?? null,
      published: body.published ?? false,
      tier: body.tier ?? 'free',
      usageCount: 0,
      rating: 0,
      exportFormats: body.exportFormats ?? body.export_formats ?? ['arcanea'],
      createdAt: now,
      updatedAt: now,
    };

    const saved = await saveLuminor(spec, userId);

    return NextResponse.json({ data: saved }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save luminor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
