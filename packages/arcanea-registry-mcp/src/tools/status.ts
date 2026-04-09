import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';

export function registerStatusTool(server: McpServer) {
  server.tool(
    'registry_status',
    'Check deployment status and health for an agent or specific deployment. Returns active deployments, usage summary, and last activity.',
    {
      deployment_id: z.string().optional().describe('Specific deployment ID'),
      agent_id: z.string().optional().describe('Agent ID to check all deployments'),
    },
    async ({ deployment_id, agent_id }) => {
      if (!deployment_id && !agent_id) {
        return { content: [{ type: 'text' as const, text: 'Provide either deployment_id or agent_id' }], isError: true };
      }

      if (deployment_id) {
        const { data: dep, error } = await supabase
          .from('deployments')
          .select('*, marketplace_agents(name, title)')
          .eq('id', deployment_id)
          .single();

        if (error || !dep) {
          return { content: [{ type: 'text' as const, text: `Deployment not found: ${deployment_id}` }], isError: true };
        }

        // Get usage stats for this deployment
        const { data: usage } = await supabase
          .from('usage_events')
          .select('tokens_used, duration_ms, credits_consumed')
          .eq('deployment_id', deployment_id);

        const stats = (usage ?? []).reduce((acc, u) => ({
          total_invocations: acc.total_invocations + 1,
          total_tokens: acc.total_tokens + (u.tokens_used ?? 0),
          total_duration_ms: acc.total_duration_ms + (u.duration_ms ?? 0),
          total_credits: acc.total_credits + (u.credits_consumed ?? 0),
        }), { total_invocations: 0, total_tokens: 0, total_duration_ms: 0, total_credits: 0 });

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              deployment: {
                id: dep.id,
                agent_id: dep.agent_id,
                platform_id: dep.platform_id,
                status: dep.status,
                deployed_at: dep.deployed_at,
                last_active_at: dep.last_active_at,
              },
              usage: stats,
            }, null, 2),
          }],
        };
      }

      // Get all deployments for an agent
      const { data: deployments, error } = await supabase
        .from('deployments')
        .select('id, platform_id, deployer_id, status, deployed_at, last_active_at')
        .eq('agent_id', agent_id!)
        .order('deployed_at', { ascending: false });

      if (error) {
        return { content: [{ type: 'text' as const, text: `Query failed: ${error.message}` }], isError: true };
      }

      const active = (deployments ?? []).filter(d => d.status === 'active').length;
      const total = (deployments ?? []).length;

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            agent_id,
            total_deployments: total,
            active_deployments: active,
            deployments: deployments ?? [],
          }, null, 2),
        }],
      };
    }
  );
}
