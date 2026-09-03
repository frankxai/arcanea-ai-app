/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Media Catalog API — Enriched gallery data from media_catalog table
 * Guardian: Lyria (Sight Gate, 639 Hz)
 *
 * Public reads use only a publishable/anon key and remain constrained by RLS.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPublicSupabaseBinding,
  PublicSupabaseBindingError,
} from '@/lib/supabase/env';

const CATALOG_READ_TIMEOUT_MS = 4_500;
const FILTER_PATTERN = /^[a-z0-9:_-]{1,80}$/iu;

function boundedInteger(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  if (value === null) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function validFilter(value: string | null): value is string {
  return value === null || FILTER_PATTERN.test(value);
}

function unavailableResponse(requestId: string, durationMs: number) {
  return NextResponse.json(
    {
      error: 'Media catalog is temporarily unavailable. Please retry.',
      code: 'MEDIA_CATALOG_UNAVAILABLE',
    },
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': '30',
        'Server-Timing': `media_catalog;dur=${durationMs}`,
        'X-Request-Id': requestId,
      },
    },
  );
}

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startedAt = performance.now();
  const url = new URL(request.url);
  const guardian = url.searchParams.get('guardian');
  const status = url.searchParams.get('status');
  const source = url.searchParams.get('source');
  const tag = url.searchParams.get('tag');

  if (![guardian, status, source, tag].every(validFilter)) {
    return NextResponse.json(
      { error: 'Invalid catalog filter.', code: 'INVALID_FILTER' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const tier = boundedInteger(url.searchParams.get('tier'), 0, 0, 4);
  const limit = boundedInteger(url.searchParams.get('limit'), 500, 1, 1_000);
  const offset = boundedInteger(url.searchParams.get('offset'), 0, 0, 10_000);

  try {
    const { url: supabaseUrl, apiKey } = getPublicSupabaseBinding();
    const params = new URLSearchParams();
    params.set('select', '*');
    params.set('order', 'quality_tier.asc,guardian.asc');
    params.set('limit', String(limit));
    params.set('offset', String(offset));

    if (guardian) params.set('guardian', `eq.${guardian}`);
    if (tier) params.set('quality_tier', `eq.${tier}`);
    if (status) params.set('status', `eq.${status}`);
    if (source) params.set('source', `eq.${source}`);
    if (tag) params.set('tags', `cs.{${tag}}`);

    const response = await fetch(
      `${supabaseUrl}/rest/v1/media_catalog?${params.toString()}`,
      {
        headers: {
          apikey: apiKey,
          Prefer: 'count=exact',
        },
        signal: AbortSignal.timeout(CATALOG_READ_TIMEOUT_MS),
        cache: 'no-store',
      },
    );

    const durationMs = Math.round(performance.now() - startedAt);
    if (!response.ok) {
      console.error('[media/catalog] public_read', {
        requestId,
        outcome: 'upstream_error',
        upstreamStatus: response.status,
        durationMs,
      });
      return unavailableResponse(requestId, durationMs);
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      console.error('[media/catalog] public_read', {
        requestId,
        outcome: 'invalid_response',
        durationMs,
      });
      return unavailableResponse(requestId, durationMs);
    }

    const totalCount = response.headers.get('content-range')?.split('/')[1];
    console.info('[media/catalog] public_read', {
      requestId,
      outcome: 'ok',
      durationMs,
      count: data.length,
      limit,
      offset,
    });

    return NextResponse.json(
      {
        media: data,
        total: totalCount ? Number(totalCount) : data.length,
        limit,
        offset,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'Server-Timing': `media_catalog;dur=${durationMs}`,
          'X-Request-Id': requestId,
        },
      },
    );
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    console.error('[media/catalog] public_read', {
      requestId,
      outcome: 'error',
      code:
        error instanceof PublicSupabaseBindingError
          ? error.code
          : 'MEDIA_CATALOG_READ_FAILED',
      durationMs,
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
    return unavailableResponse(requestId, durationMs);
  }
}
