/**
 * GET /api/creator/stats
 *
 * Returns creator dashboard data — usage + revenue aggregates.
 * Requires authenticated session (uses Supabase auth cookie).
 *
 * Response shape:
 *   {
 *     creator: { id, displayName, attributionScore, totalEarned, agentCount },
 *     agents: [{ id, name, usageCount, rating, tier }],
 *     usage: {
 *       totalInvocations30d: number,
 *       totalTokens30d: number,
 *       totalCredits30d: number,
 *       byAgent: { [agentId]: { invocations, tokens, credits } },
 *       daily: [{ date, invocations, tokens, credits }],
 *     },
 *     revenue: {
 *       grossAll: number,
 *       platformFeeAll: number,
 *       creatorPayoutAll: number,
 *       byAgent: { [agentId]: { gross, fee, payout } },
 *       daily: [{ date, gross, payout }],
 *     },
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function resolveSession(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;

    const cookieHeader = req.headers.get('cookie') ?? '';
    const tokenCookie = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('sb-') && c.includes('-auth-token'));
    if (!tokenCookie) return null;

    let jwt = tokenCookie.split('=').slice(1).join('=');
    try {
      const decoded = JSON.parse(decodeURIComponent(jwt));
      if (decoded?.access_token) jwt = decoded.access_token;
      else if (Array.isArray(decoded) && decoded[0]?.access_token) jwt = decoded[0].access_token;
    } catch {
      // raw JWT
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data } = await supabase.auth.getUser();
    if (!data?.user) return null;
    return { userId: data.user.id, supabase };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const session = await resolveSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'Server not configured' },
      { status: 503 }
    );
  }

  const { createClient } = await import('@supabase/supabase-js');
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Creator profile
  const { data: creator } = await admin
    .from('creators')
    .select('*')
    .eq('user_id', session.userId)
    .maybeSingle();

  // 2. Owned agents
  const { data: agents } = await admin
    .from('marketplace_agents')
    .select('id, name, title, category, usage_count, rating, is_published, tags, spec')
    .eq('creator_id', session.userId);

  const agentIds = ((agents as Array<{ id: string }>) ?? []).map((a) => a.id);

  // 3. Usage events (last 30 days, for owned agents only)
  let usageEvents: Array<{
    agent_id: string;
    tokens_used: number;
    credits_consumed: number;
    created_at: string;
  }> = [];

  if (agentIds.length > 0) {
    const { data: usage } = await admin
      .from('usage_events')
      .select('agent_id, tokens_used, credits_consumed, created_at')
      .in('agent_id', agentIds)
      .gte('created_at', thirtyDaysAgo);
    usageEvents = (usage as typeof usageEvents) ?? [];
  }

  // 4. Revenue events (last 30 days, for this creator)
  const { data: revenue } = await admin
    .from('revenue_events')
    .select('agent_id, gross_amount, platform_fee, creator_payout, created_at, event_type')
    .eq('creator_id', session.userId)
    .gte('created_at', thirtyDaysAgo);

  const revenueEvents = (revenue as Array<{
    agent_id: string;
    gross_amount: number;
    platform_fee: number;
    creator_payout: number;
    created_at: string;
    event_type: string;
  }>) ?? [];

  // ─── Aggregates ─────────────────────────────────────────────────────────

  const usageByAgent: Record<string, { invocations: number; tokens: number; credits: number }> = {};
  const dailyUsage: Record<string, { invocations: number; tokens: number; credits: number }> = {};

  let totalInvocations = 0;
  let totalTokens = 0;
  let totalCredits = 0;

  for (const evt of usageEvents) {
    totalInvocations++;
    totalTokens += evt.tokens_used ?? 0;
    totalCredits += evt.credits_consumed ?? 0;

    if (!usageByAgent[evt.agent_id]) {
      usageByAgent[evt.agent_id] = { invocations: 0, tokens: 0, credits: 0 };
    }
    usageByAgent[evt.agent_id].invocations++;
    usageByAgent[evt.agent_id].tokens += evt.tokens_used ?? 0;
    usageByAgent[evt.agent_id].credits += evt.credits_consumed ?? 0;

    const day = evt.created_at.slice(0, 10);
    if (!dailyUsage[day]) {
      dailyUsage[day] = { invocations: 0, tokens: 0, credits: 0 };
    }
    dailyUsage[day].invocations++;
    dailyUsage[day].tokens += evt.tokens_used ?? 0;
    dailyUsage[day].credits += evt.credits_consumed ?? 0;
  }

  const revenueByAgent: Record<string, { gross: number; fee: number; payout: number }> = {};
  const dailyRevenue: Record<string, { gross: number; payout: number }> = {};

  let totalGross = 0;
  let totalFee = 0;
  let totalPayout = 0;

  for (const evt of revenueEvents) {
    totalGross += evt.gross_amount ?? 0;
    totalFee += evt.platform_fee ?? 0;
    totalPayout += evt.creator_payout ?? 0;

    if (!revenueByAgent[evt.agent_id]) {
      revenueByAgent[evt.agent_id] = { gross: 0, fee: 0, payout: 0 };
    }
    revenueByAgent[evt.agent_id].gross += evt.gross_amount ?? 0;
    revenueByAgent[evt.agent_id].fee += evt.platform_fee ?? 0;
    revenueByAgent[evt.agent_id].payout += evt.creator_payout ?? 0;

    const day = evt.created_at.slice(0, 10);
    if (!dailyRevenue[day]) {
      dailyRevenue[day] = { gross: 0, payout: 0 };
    }
    dailyRevenue[day].gross += evt.gross_amount ?? 0;
    dailyRevenue[day].payout += evt.creator_payout ?? 0;
  }

  const daily = Object.entries(dailyUsage)
    .map(([date, usage]) => ({
      date,
      invocations: usage.invocations,
      tokens: usage.tokens,
      credits: usage.credits,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const dailyRevenueArray = Object.entries(dailyRevenue)
    .map(([date, rev]) => ({
      date,
      gross: rev.gross,
      payout: rev.payout,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // ─── Response ───────────────────────────────────────────────────────────

  return NextResponse.json({
    creator: creator ?? {
      user_id: session.userId,
      display_name: 'Unnamed Creator',
      attribution_score: 0,
      total_earned: 0,
      agent_count: agents?.length ?? 0,
    },
    agents: (agents as Array<Record<string, unknown>>) ?? [],
    usage: {
      totalInvocations30d: totalInvocations,
      totalTokens30d: totalTokens,
      totalCredits30d: totalCredits,
      byAgent: usageByAgent,
      daily,
    },
    revenue: {
      grossAll: totalGross,
      platformFeeAll: totalFee,
      creatorPayoutAll: totalPayout,
      byAgent: revenueByAgent,
      daily: dailyRevenueArray,
    },
  });
}
