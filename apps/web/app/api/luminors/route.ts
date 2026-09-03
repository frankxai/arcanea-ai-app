/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * /api/luminors — List published Luminors (GET) and save new ones (POST).
 *
 * Uses Node.js runtime (cookie-based Supabase auth requires next/headers).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPublishedLuminors,
  getPublishedLuminorErrorCode,
  LUMINOR_READ_TIMEOUT_MS,
  PublishedLuminorReadError,
  saveLuminor,
} from '@/lib/luminors/luminor-service';
import { createClient } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// GET — Browse published Luminors
// ---------------------------------------------------------------------------

/** Bound the entire public-read operation, including client creation and retries. */
async function withPublicReadDeadline<T>(
  operation: () => Promise<T>
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () =>
        reject(
          new PublishedLuminorReadError(
            'SUPABASE_PUBLIC_READ_TIMEOUT'
          )
        ),
      LUMINOR_READ_TIMEOUT_MS
    );
  });

  try {
    return await Promise.race([operation(), deadline]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function boundedInteger(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  if (value === null) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const startedAt = performance.now();

  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain') ?? undefined;
    const element = searchParams.get('element') ?? undefined;
    const limit = boundedInteger(searchParams.get('limit'), 24, 1, 100);
    const offset = boundedInteger(
      searchParams.get('offset'),
      0,
      0,
      10_000,
    );

    const luminors = await withPublicReadDeadline(() =>
      getPublishedLuminors({ domain, element, limit, offset })
    );
    const durationMs = Math.round(performance.now() - startedAt);

    console.info('[api/luminors] public_read', {
      requestId,
      outcome: 'ok',
      durationMs,
      count: luminors.length,
      limit,
      offset,
      filtered: Boolean(domain || element),
    });

    return NextResponse.json(
      { data: luminors, count: luminors.length },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'Server-Timing': `luminors;dur=${durationMs}`,
          'X-Request-Id': requestId,
        },
      },
    );
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    const code = getPublishedLuminorErrorCode(error);

    console.error('[api/luminors] public_read', {
      requestId,
      outcome: 'error',
      code,
      durationMs,
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });

    return NextResponse.json(
      { error: 'Published Luminors are temporarily unavailable. Please retry.' },
      {
        status: 503,
        headers: {
          'Retry-After': '30',
          'Cache-Control': 'no-store',
          'Server-Timing': `luminors;dur=${durationMs}`,
          'X-Request-Id': requestId,
        },
      }
    );
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
