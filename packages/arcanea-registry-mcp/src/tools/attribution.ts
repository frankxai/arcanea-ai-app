import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';

export function registerAttributionTool(server: McpServer) {
  server.tool(
    'registry_attribution',
    'Query creator attribution — reach, usage, deploys, tips. Pure analytics. Everything public by design, because transparency is a feature.',
    {
      creator_id: z.string().optional().describe('Filter by creator user ID'),
      agent_id: z.string().optional().describe('Filter by agent ID'),
      platform_id: z.string().optional().describe('Filter by platform ID'),
      since: z.string().optional().describe('ISO date — only events after this date'),
    },
    async ({ creator_id, agent_id, platform_id, since }) => {
      let query = supabase
        .from('attribution_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (creator_id) query = query.eq('creator_id', creator_id);
      if (agent_id) query = query.eq('agent_id', agent_id);
      if (platform_id) query = query.eq('platform_id', platform_id);
      if (since) query = query.gte('created_at', since);

      const { data, error } = await query;

      if (error) {
        return { content: [{ type: 'text' as const, text: `Attribution query failed: ${error.message}` }], isError: true };
      }

      const events = data ?? [];

      // Pure reach metrics — no money math
      const reach = {
        total_events: events.length,
        deploys: events.filter(e => e.event_type === 'deploy').length,
        usages: events.filter(e => e.event_type === 'usage').length,
        forks: events.filter(e => e.event_type === 'fork').length,
        mentions: events.filter(e => e.event_type === 'mention').length,
        tips_received: events
          .filter(e => e.event_type === 'tip')
          .reduce((sum, e) => sum + (e.tip_amount ?? 0), 0),
        platforms_reached: new Set(events.map(e => e.platform_id).filter(Boolean)).size,
      };

      // Group by agent
      const byAgent: Record<string, { deploys: number; usages: number; tips: number }> = {};
      for (const e of events) {
        if (!byAgent[e.agent_id]) byAgent[e.agent_id] = { deploys: 0, usages: 0, tips: 0 };
        if (e.event_type === 'deploy') byAgent[e.agent_id].deploys++;
        if (e.event_type === 'usage') byAgent[e.agent_id].usages++;
        if (e.event_type === 'tip') byAgent[e.agent_id].tips += e.tip_amount ?? 0;
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            filters: { creator_id, agent_id, platform_id, since },
            reach,
            by_agent: byAgent,
            recent_events: events.slice(0, 10),
          }, null, 2),
        }],
      };
    }
  );
}
