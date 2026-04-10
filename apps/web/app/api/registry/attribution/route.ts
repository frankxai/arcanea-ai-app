import { NextResponse } from 'next/server';
import { createRegistryAdminClient } from '@/lib/registry/supabase';

/**
 * GET /api/registry/attribution
 * Public attribution lookup — transparency is a feature.
 *
 * Query params:
 *   creator_id  — filter by creator
 *   agent_id    — filter by agent
 *   platform_id — filter by platform
 *   since       — ISO date string
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const creator_id = searchParams.get('creator_id');
  const agent_id = searchParams.get('agent_id');
  const platform_id = searchParams.get('platform_id');
  const since = searchParams.get('since');

  const admin = createRegistryAdminClient();
  let query = admin
    .from('attribution_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (creator_id) query = query.eq('creator_id', creator_id);
  if (agent_id) query = query.eq('agent_id', agent_id);
  if (platform_id) query = query.eq('platform_id', platform_id);
  if (since) query = query.gte('created_at', since);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const events = data ?? [];
  const reach = {
    total_events: events.length,
    deploys: events.filter((e: { event_type: string }) => e.event_type === 'deploy').length,
    usages: events.filter((e: { event_type: string }) => e.event_type === 'usage').length,
    forks: events.filter((e: { event_type: string }) => e.event_type === 'fork').length,
    mentions: events.filter((e: { event_type: string }) => e.event_type === 'mention').length,
    tips_received: events
      .filter((e: { event_type: string; tip_amount?: number | null }) => e.event_type === 'tip')
      .reduce((sum: number, e: { tip_amount?: number | null }) => sum + (e.tip_amount ?? 0), 0),
    platforms_reached: new Set(events.map((e: { platform_id: string | null }) => e.platform_id).filter(Boolean)).size,
  };

  return NextResponse.json({
    data: { reach, recent_events: events.slice(0, 20) },
    meta: { filters: { creator_id, agent_id, platform_id, since } },
  });
}
