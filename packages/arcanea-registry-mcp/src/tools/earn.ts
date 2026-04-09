import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';

export function registerEarnTool(server: McpServer) {
  server.tool(
    'registry_earn',
    'Query creator revenue and attribution. Returns gross earnings, platform fees, creator payouts, and affiliate revenue breakdowns.',
    {
      creator_id: z.string().optional().describe('Filter by creator user ID'),
      agent_id: z.string().optional().describe('Filter by agent ID'),
      platform_id: z.string().optional().describe('Filter by platform ID'),
      since: z.string().optional().describe('ISO date string — only events after this date'),
    },
    async ({ creator_id, agent_id, platform_id, since }) => {
      let query = supabase
        .from('revenue_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (creator_id) query = query.eq('creator_id', creator_id);
      if (agent_id) query = query.eq('agent_id', agent_id);
      if (platform_id) query = query.eq('platform_id', platform_id);
      if (since) query = query.gte('created_at', since);

      const { data, error } = await query;

      if (error) {
        return { content: [{ type: 'text' as const, text: `Revenue query failed: ${error.message}` }], isError: true };
      }

      const events = data ?? [];
      const totals = events.reduce((acc, e) => ({
        gross: acc.gross + e.gross_amount,
        platform_fees: acc.platform_fees + e.platform_fee,
        creator_payouts: acc.creator_payouts + e.creator_payout,
        affiliate_payouts: acc.affiliate_payouts + (e.affiliate_payout ?? 0),
      }), { gross: 0, platform_fees: 0, creator_payouts: 0, affiliate_payouts: 0 });

      // Group by event type
      const byType: Record<string, number> = {};
      for (const e of events) {
        byType[e.event_type] = (byType[e.event_type] ?? 0) + e.gross_amount;
      }

      // Group by agent
      const byAgent: Record<string, { gross: number; count: number }> = {};
      for (const e of events) {
        if (!byAgent[e.agent_id]) byAgent[e.agent_id] = { gross: 0, count: 0 };
        byAgent[e.agent_id].gross += e.gross_amount;
        byAgent[e.agent_id].count += 1;
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            filters: { creator_id, agent_id, platform_id, since },
            total_events: events.length,
            totals,
            by_event_type: byType,
            by_agent: byAgent,
            recent_events: events.slice(0, 10),
          }, null, 2),
        }],
      };
    }
  );
}
