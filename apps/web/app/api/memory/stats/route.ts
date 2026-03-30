/**
 * AgentDB Cloud — Usage Statistics
 *
 * GET /api/memory/stats
 *
 * Returns: total memories, namespaces, estimated storage.
 *
 * @auth Bearer arc_XXXXX
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardRequest } from '@/lib/api-auth';
import { getStats } from '@/lib/agentdb/store';

export async function GET(request: NextRequest) {
  const start = performance.now();

  const guard = guardRequest(request);
  if ('error' in guard) return guard.error;
  const { auth, headers } = guard;

  try {
    const stats = await getStats(auth.agentId);
    const latencyMs = Math.round(performance.now() - start);

    return NextResponse.json(
      {
        ok: true,
        data: {
          agent_id: auth.agentId,
          total_memories: stats.total_memories,
          namespaces: stats.namespaces,
          namespace_count: stats.namespaces.length,
          storage_bytes_estimate: stats.storage_bytes_estimate,
          storage_human: formatBytes(stats.storage_bytes_estimate),
          tier: 'developer',
          limits: {
            max_memories: 10_000,
            max_value_bytes: 100_000,
            max_key_length: 256,
            rate_limit_rpm: 120,
          },
        },
        meta: {
          usage: {
            stored: stats.total_memories,
            limit: 10_000,
            percent: Math.round((stats.total_memories / 10_000) * 100 * 10) / 10,
          },
          latency_ms: latencyMs,
        },
      },
      { headers }
    );
  } catch (err) {
    console.error('[AgentDB] Stats error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error fetching stats' },
      { status: 500, headers }
    );
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${Math.round(val * 10) / 10} ${units[i]}`;
}
