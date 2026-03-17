/**
 * Arc Protocol API — List & Create Arcs
 *
 * POST /api/arcs  — Create a new arc
 * GET  /api/arcs  — List all arcs (optionally filtered by type/creator)
 *
 * In-memory store until Supabase auth is configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import type {
  ArcType,
  Palette,
} from '../../../../../packages/arc-protocol/src/types';
import {
  createArc as createArcCore,
  validate,
} from '../../../../../packages/arc-protocol/src/arc';
import { getArcStore } from '@/lib/arc/store';

export const runtime = 'edge';

// ── Edge-Compatible Rate Limiter ─────────────────────────────────────────────

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const real = req.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || real || 'unknown';
}

function checkRate(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  bucket.count++;
  if (bucket.count > RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - bucket.count, resetAt: bucket.resetAt };
}

function rateLimitHeaders(remaining: number, resetAt: number): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': new Date(resetAt).toISOString(),
  };
}

// ── Validation Helpers ───────────────────────────────────────────────────────

const VALID_TYPES: ArcType[] = [
  'character', 'world', 'location', 'creature', 'artifact',
  'scene', 'story', 'image', 'music', 'video',
  'code', 'agent', 'system', 'collection',
];

const VALID_PALETTES: Palette[] = ['forge', 'tide', 'root', 'drift', 'void'];

function isValidType(v: unknown): v is ArcType {
  return typeof v === 'string' && VALID_TYPES.includes(v as ArcType);
}

function isValidPalette(v: unknown): v is Palette {
  return typeof v === 'string' && VALID_PALETTES.includes(v as Palette);
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(item => typeof item === 'string');
}

// ── POST /api/arcs ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRate(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 20 requests per minute.', retryAfter: Math.ceil((rate.resetAt - Date.now()) / 1000) },
      { status: 429, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Request body must be a JSON object' },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  const { type, spark, palette, sharpen, tags, creator, gate, element } = body as Record<string, unknown>;

  // Required fields
  if (!isValidType(type)) {
    return NextResponse.json(
      { error: `Invalid or missing 'type'. Must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  if (typeof creator !== 'string' || creator.trim().length === 0) {
    return NextResponse.json(
      { error: "'creator' is required and must be a non-empty string" },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  // Optional fields validation
  if (spark !== undefined && typeof spark !== 'string') {
    return NextResponse.json(
      { error: "'spark' must be a string" },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  if (palette !== undefined && !isValidPalette(palette)) {
    return NextResponse.json(
      { error: `Invalid 'palette'. Must be one of: ${VALID_PALETTES.join(', ')}` },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  if (sharpen !== undefined && !isStringArray(sharpen)) {
    return NextResponse.json(
      { error: "'sharpen' must be an array of strings" },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  if (tags !== undefined && !isStringArray(tags)) {
    return NextResponse.json(
      { error: "'tags' must be an array of strings" },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  if (gate !== undefined && (typeof gate !== 'number' || gate < 1 || gate > 10)) {
    return NextResponse.json(
      { error: "'gate' must be a number between 1 and 10" },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  if (element !== undefined && typeof element !== 'string') {
    return NextResponse.json(
      { error: "'element' must be a string" },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  // Create the arc
  const arc = createArcCore({
    type,
    creator: (creator as string).trim(),
    spark: spark as string | undefined,
    palette: palette as Palette | undefined,
    sharpen: sharpen as string[] | undefined,
    tags: tags as string[] | undefined,
    gate: gate as number | undefined,
    element: element as string | undefined,
  });

  // Validate the created arc
  const validation = validate(arc);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Arc validation failed', details: validation.errors },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  const store = getArcStore();
  store.set(arc.id, arc);

  return NextResponse.json(arc, {
    status: 201,
    headers: {
      ...rateLimitHeaders(rate.remaining, rate.resetAt),
      'Content-Type': 'application/json',
    },
  });
}

// ── GET /api/arcs ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRate(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 20 requests per minute.', retryAfter: Math.ceil((rate.resetAt - Date.now()) / 1000) },
      { status: 429, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  const url = new URL(req.url);
  const filterType = url.searchParams.get('type');
  const filterCreator = url.searchParams.get('creator');
  const filterStage = url.searchParams.get('stage');
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 200) : 50;

  const store = getArcStore();
  let arcs = Array.from(store.values());

  if (filterType && isValidType(filterType)) {
    arcs = arcs.filter(a => a.type === filterType);
  }
  if (filterCreator) {
    arcs = arcs.filter(a => a.creator === filterCreator);
  }
  if (filterStage) {
    arcs = arcs.filter(a => a.stage === filterStage);
  }

  // Sort newest first
  arcs.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  // Apply limit
  arcs = arcs.slice(0, limit);

  return NextResponse.json(
    { arcs, total: store.size, returned: arcs.length },
    {
      status: 200,
      headers: {
        ...rateLimitHeaders(rate.remaining, rate.resetAt),
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );
}
