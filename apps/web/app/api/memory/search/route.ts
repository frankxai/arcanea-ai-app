/**
 * AgentDB Cloud — Semantic Search
 *
 * POST /api/memory/search
 * Body: { query: string, namespace?: string, limit?: number, threshold?: number }
 *
 * Returns top-K matches with similarity scores.
 *
 * Current: simple text matching (includes/token overlap).
 * Future: HNSW vector similarity via pgvector embeddings.
 *
 * @auth Bearer arc_XXXXX
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardRequest } from '@/lib/api-auth';
import { searchMemories } from '@/lib/agentdb/store';
import { getAgentDbBackendLabel } from '@/lib/agentdb/starlight-store';

export async function POST(request: NextRequest) {
  const start = performance.now();

  const guard = guardRequest(request);
  if ('error' in guard) return guard.error;
  const { auth, headers } = guard;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400, headers }
    );
  }

  const { query, namespace, limit, threshold } = body as {
    query?: string;
    namespace?: string;
    limit?: number;
    threshold?: number;
  };

  if (!query || typeof query !== 'string') {
    return NextResponse.json(
      { ok: false, error: 'Missing or invalid "query" (string required)' },
      { status: 400, headers }
    );
  }

  if (query.length > 1000) {
    return NextResponse.json(
      { ok: false, error: 'Query must be 1000 characters or fewer' },
      { status: 400, headers }
    );
  }

  const safeLimit = Math.min(50, Math.max(1, limit ?? 10));
  const safeThreshold = Math.max(0, Math.min(1, threshold ?? 0.0));

  try {
    const results = await searchMemories(
      auth.agentId,
      query,
      namespace || undefined,
      safeLimit,
      safeThreshold
    );

    const latencyMs = Math.round(performance.now() - start);

    return NextResponse.json(
      {
        ok: true,
        data: results.map((r) => ({
          ...r.record,
          score: Math.round(r.score * 1000) / 1000,
        })),
        meta: {
          query,
          namespace: namespace || 'all',
          count: results.length,
          backend: getAgentDbBackendLabel(),
          // TODO [HNSW]: Add vector search metadata (index type, ef_search, etc.)
          search_backend: 'text_match',
          usage: { stored: results.length, limit: 10_000 },
          latency_ms: latencyMs,
        },
      },
      { headers }
    );
  } catch (err) {
    console.error('[AgentDB] Search error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error during search' },
      { status: 500, headers }
    );
  }
}
