/**
 * AgentDB Cloud — Single Memory Operations
 *
 * GET    /api/memory/:key  — Retrieve a memory by key
 * DELETE /api/memory/:key  — Delete a memory
 * PATCH  /api/memory/:key  — Update a memory
 *
 * Query params: ?namespace=X (defaults to 'default')
 *
 * @auth Bearer arc_XXXXX
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardRequest } from '@/lib/api-auth';
import { getMemory, deleteMemory, updateMemory } from '@/lib/agentdb/store';

type RouteContext = { params: Promise<{ key: string }> };

/**
 * GET /api/memory/:key?namespace=X
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const start = performance.now();

  const guard = guardRequest(request);
  if ('error' in guard) return guard.error;
  const { auth, headers } = guard;

  const { key } = await context.params;
  const namespace = new URL(request.url).searchParams.get('namespace') || 'default';

  try {
    const record = await getMemory(auth.agentId, decodeURIComponent(key), namespace);

    if (!record) {
      return NextResponse.json(
        { ok: false, error: `Memory "${key}" not found in namespace "${namespace}"` },
        { status: 404, headers }
      );
    }

    const latencyMs = Math.round(performance.now() - start);

    return NextResponse.json(
      {
        ok: true,
        data: record,
        meta: { latency_ms: latencyMs },
      },
      { headers }
    );
  } catch (err) {
    console.error('[AgentDB] Get error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error retrieving memory' },
      { status: 500, headers }
    );
  }
}

/**
 * DELETE /api/memory/:key?namespace=X
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const start = performance.now();

  const guard = guardRequest(request);
  if ('error' in guard) return guard.error;
  const { auth, headers } = guard;

  const { key } = await context.params;
  const namespace = new URL(request.url).searchParams.get('namespace') || 'default';

  try {
    const deleted = await deleteMemory(auth.agentId, decodeURIComponent(key), namespace);

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: `Memory "${key}" not found in namespace "${namespace}"` },
        { status: 404, headers }
      );
    }

    const latencyMs = Math.round(performance.now() - start);

    return NextResponse.json(
      {
        ok: true,
        data: { key: decodeURIComponent(key), namespace, deleted: true },
        meta: { latency_ms: latencyMs },
      },
      { headers }
    );
  } catch (err) {
    console.error('[AgentDB] Delete error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error deleting memory' },
      { status: 500, headers }
    );
  }
}

/**
 * PATCH /api/memory/:key?namespace=X
 * Body: { value?, tags?, ttl?, namespace? }
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const start = performance.now();

  const guard = guardRequest(request);
  if ('error' in guard) return guard.error;
  const { auth, headers } = guard;

  const { key } = await context.params;
  const namespace = new URL(request.url).searchParams.get('namespace') || 'default';

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400, headers }
    );
  }

  const updates: { value?: string; tags?: string[]; ttl?: number | null; namespace?: string } = {};

  if (body.value !== undefined) {
    if (typeof body.value !== 'string') {
      return NextResponse.json(
        { ok: false, error: '"value" must be a string' },
        { status: 400, headers }
      );
    }
    if ((body.value as string).length > 100_000) {
      return NextResponse.json(
        { ok: false, error: 'Value must be 100KB or fewer' },
        { status: 400, headers }
      );
    }
    updates.value = body.value as string;
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) {
      return NextResponse.json(
        { ok: false, error: '"tags" must be an array of strings' },
        { status: 400, headers }
      );
    }
    updates.tags = body.tags as string[];
  }

  if (body.ttl !== undefined) {
    if (body.ttl !== null && (typeof body.ttl !== 'number' || (body.ttl as number) < 0)) {
      return NextResponse.json(
        { ok: false, error: '"ttl" must be a non-negative number or null' },
        { status: 400, headers }
      );
    }
    updates.ttl = body.ttl as number | null;
  }

  if (body.namespace !== undefined) {
    if (typeof body.namespace !== 'string') {
      return NextResponse.json(
        { ok: false, error: '"namespace" must be a string' },
        { status: 400, headers }
      );
    }
    updates.namespace = body.namespace as string;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { ok: false, error: 'No valid update fields provided (value, tags, ttl, namespace)' },
      { status: 400, headers }
    );
  }

  try {
    const record = await updateMemory(auth.agentId, decodeURIComponent(key), updates, namespace);

    if (!record) {
      return NextResponse.json(
        { ok: false, error: `Memory "${key}" not found in namespace "${namespace}"` },
        { status: 404, headers }
      );
    }

    const latencyMs = Math.round(performance.now() - start);

    return NextResponse.json(
      {
        ok: true,
        data: record,
        meta: { latency_ms: latencyMs },
      },
      { headers }
    );
  } catch (err) {
    console.error('[AgentDB] Update error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error updating memory' },
      { status: 500, headers }
    );
  }
}
