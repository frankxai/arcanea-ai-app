/**
 * AgentDB Cloud — Memory CRUD
 *
 * POST /api/memory  — Store a memory
 * GET  /api/memory  — List memories (with ?namespace=X&limit=20)
 *
 * @auth Bearer arc_XXXXX
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardRequest } from '@/lib/api-auth';
import { storeMemory, listMemories } from '@/lib/agentdb/store';
import { getAgentDbBackendLabel } from '@/lib/agentdb/starlight-store';

function jsonOk(data: unknown, meta: Record<string, unknown>, headers: Record<string, string>) {
  return NextResponse.json(
    { ok: true, data, meta },
    { headers }
  );
}

function jsonError(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json(
    { ok: false, error: message },
    { status, headers }
  );
}

/**
 * POST /api/memory
 * Body: { key, value, namespace?, tags?, ttl? }
 */
export async function POST(request: NextRequest) {
  const start = performance.now();

  const guard = guardRequest(request);
  if ('error' in guard) return guard.error;
  const { auth, headers } = guard;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400, headers);
  }

  const { key, value, namespace, tags, ttl } = body as {
    key?: string;
    value?: string;
    namespace?: string;
    tags?: string[];
    ttl?: number;
  };

  if (!key || typeof key !== 'string') {
    return jsonError('Missing or invalid "key" (string required)', 400, headers);
  }

  if (!value || typeof value !== 'string') {
    return jsonError('Missing or invalid "value" (string required)', 400, headers);
  }

  if (key.length > 256) {
    return jsonError('Key must be 256 characters or fewer', 400, headers);
  }

  if (value.length > 100_000) {
    return jsonError('Value must be 100KB or fewer', 400, headers);
  }

  if (tags && !Array.isArray(tags)) {
    return jsonError('"tags" must be an array of strings', 400, headers);
  }

  if (ttl !== undefined && (typeof ttl !== 'number' || ttl < 0)) {
    return jsonError('"ttl" must be a non-negative number (seconds)', 400, headers);
  }

  try {
    const record = await storeMemory(
      auth.agentId,
      key,
      value,
      namespace || 'default',
      tags || [],
      ttl ?? null
    );

    const latencyMs = Math.round(performance.now() - start);

    return jsonOk(record, {
      usage: { stored: 1, limit: 10_000 },
      backend: getAgentDbBackendLabel(),
      latency_ms: latencyMs,
    }, headers);
  } catch (err) {
    console.error('[AgentDB] Store error:', err);
    return jsonError('Internal error storing memory', 500, headers);
  }
}

/**
 * GET /api/memory?namespace=X&limit=20
 */
export async function GET(request: NextRequest) {
  const start = performance.now();

  const guard = guardRequest(request);
  if ('error' in guard) return guard.error;
  const { auth, headers } = guard;

  const { searchParams } = new URL(request.url);
  const namespace = searchParams.get('namespace') || undefined;
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));

  try {
    const records = await listMemories(auth.agentId, namespace, limit);
    const latencyMs = Math.round(performance.now() - start);

    return jsonOk(records, {
      count: records.length,
      namespace: namespace || 'all',
      backend: getAgentDbBackendLabel(),
      usage: { stored: records.length, limit: 10_000 },
      latency_ms: latencyMs,
    }, headers);
  } catch (err) {
    console.error('[AgentDB] List error:', err);
    return jsonError('Internal error listing memories', 500, headers);
  }
}
