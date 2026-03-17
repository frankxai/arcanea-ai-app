/**
 * Arc Protocol API — Single Arc Operations
 *
 * GET   /api/arcs/[id]  — Get a specific arc
 * PATCH /api/arcs/[id]  — Advance stage or bond to another arc
 */

import { NextRequest, NextResponse } from 'next/server';
import type {
  Arc,
  ArcHistoryEntry,
  Relation,
} from '../../../../../../packages/arc-protocol/src/types';
import {
  advanceStage,
  bond,
  validate,
} from '../../../../../../packages/arc-protocol/src/arc';
import { getArcStore } from '@/lib/arc/store';

export const runtime = 'edge';

// ── Edge-Compatible Rate Limiter ─────────────────────────────────────────────

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

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

const VALID_RELATIONS: Relation[] = [
  'inhabits', 'creates', 'opposes', 'evolves_from',
  'soundtrack', 'illustrates', 'teaches', 'forks',
  'collection_of', 'inspired_by',
];

function isValidRelation(v: unknown): v is Relation {
  return typeof v === 'string' && VALID_RELATIONS.includes(v as Relation);
}

// ── GET /api/arcs/[id] ──────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ip = getClientIp(req);
  const rate = checkRate(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 20 requests per minute.', retryAfter: Math.ceil((rate.resetAt - Date.now()) / 1000) },
      { status: 429, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  const store = getArcStore();
  const arc = store.get(id);
  if (!arc) {
    return NextResponse.json(
      { error: `Arc not found: ${id}` },
      { status: 404, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  return NextResponse.json(arc, {
    status: 200,
    headers: {
      ...rateLimitHeaders(rate.remaining, rate.resetAt),
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

// ── PATCH /api/arcs/[id] ────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ip = getClientIp(req);
  const rate = checkRate(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 20 requests per minute.', retryAfter: Math.ceil((rate.resetAt - Date.now()) / 1000) },
      { status: 429, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  const store = getArcStore();
  const arc = store.get(id);
  if (!arc) {
    return NextResponse.json(
      { error: `Arc not found: ${id}` },
      { status: 404, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
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

  const { action, ...rest } = body as Record<string, unknown>;

  if (action !== 'advance' && action !== 'bond') {
    return NextResponse.json(
      { error: "'action' must be 'advance' or 'bond'" },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  let updated: Arc;

  if (action === 'advance') {
    // Build history entry from provided fields
    const entry: Omit<ArcHistoryEntry, 'stage'> = {
      at: new Date().toISOString(),
    };

    if (typeof rest.input === 'string') entry.input = rest.input;
    if (typeof rest.model === 'string') entry.model = rest.model;
    if (typeof rest.output === 'string') entry.output = rest.output;
    if (typeof rest.output_hash === 'string') entry.output_hash = rest.output_hash;
    if (typeof rest.quality === 'number' && rest.quality >= 0 && rest.quality <= 100) {
      entry.quality = rest.quality;
    }
    if (typeof rest.note === 'string') entry.note = rest.note;

    updated = advanceStage(arc, entry);
  } else {
    // action === 'bond'
    const { targetId, relation, note } = rest;

    if (typeof targetId !== 'string' || targetId.trim().length === 0) {
      return NextResponse.json(
        { error: "'targetId' is required for bond action" },
        { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
      );
    }

    if (!isValidRelation(relation)) {
      return NextResponse.json(
        { error: `Invalid 'relation'. Must be one of: ${VALID_RELATIONS.join(', ')}` },
        { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
      );
    }

    updated = bond(arc, {
      target: (targetId as string).trim(),
      relation,
      note: typeof note === 'string' ? note : undefined,
    });
  }

  // Validate the updated arc
  const validation = validate(updated);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Updated arc failed validation', details: validation.errors },
      { status: 400, headers: rateLimitHeaders(rate.remaining, rate.resetAt) },
    );
  }

  store.set(id, updated);

  return NextResponse.json(updated, {
    status: 200,
    headers: {
      ...rateLimitHeaders(rate.remaining, rate.resetAt),
      'Content-Type': 'application/json',
    },
  });
}
