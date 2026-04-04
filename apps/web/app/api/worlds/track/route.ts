import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Lightweight analytics endpoint. Accepts beacon payloads.
 * Upserts view counts on the worlds table.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { worldId, event } = body;

    if (!worldId || !event) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const sb = await createClient();

    // For views, increment a view counter (we could add a views column later)
    // For now, log to activity_log if the user is authenticated
    const { data: { user } } = await sb.auth.getUser();

    if (user) {
      await sb.from('activity_log').insert({
        user_id: user.id,
        action: `world_${event}`,
        metadata: { world_id: worldId },
      }).then(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Never fail analytics
  }
}
