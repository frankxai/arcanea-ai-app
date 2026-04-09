import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';

export function registerUsageTool(server: McpServer) {
  server.tool(
    'registry_usage',
    'Query usage analytics for an agent or deployment. Returns token counts, invocation counts, duration stats, and credit consumption.',
    {
      agent_id: z.string().optional().describe('Filter by agent ID'),
      deployment_id: z.string().optional().describe('Filter by deployment ID'),
      platform_id: z.string().optional().describe('Filter by platform ID'),
      since: z.string().optional().describe('ISO date string — only events after this date'),
      limit: z.number().min(1).max(1000).optional().describe('Max events to return (default 100)'),
    },
    async ({ agent_id, deployment_id, platform_id, since, limit = 100 }) => {
      let query = supabase
        .from('usage_events')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (agent_id) query = query.eq('agent_id', agent_id);
      if (deployment_id) query = query.eq('deployment_id', deployment_id);
      if (platform_id) query = query.eq('platform_id', platform_id);
      if (since) query = query.gte('created_at', since);

      const { data, error, count } = await query;

      if (error) {
        return { content: [{ type: 'text' as const, text: `Usage query failed: ${error.message}` }], isError: true };
      }

      const events = data ?? [];
      const aggregates = events.reduce((acc, e) => ({
        total_invocations: acc.total_invocations + 1,
        total_tokens: acc.total_tokens + (e.tokens_used ?? 0),
        total_duration_ms: acc.total_duration_ms + (e.duration_ms ?? 0),
        total_credits: acc.total_credits + (e.credits_consumed ?? 0),
      }), { total_invocations: 0, total_tokens: 0, total_duration_ms: 0, total_credits: 0 });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            filters: { agent_id, deployment_id, platform_id, since },
            total_events: count ?? events.length,
            aggregates,
            events: events.slice(0, 20), // Return first 20 for detail
          }, null, 2),
        }],
      };
    }
  );
}
