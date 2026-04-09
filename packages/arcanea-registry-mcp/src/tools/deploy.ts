import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';

export function registerDeployTool(server: McpServer) {
  server.tool(
    'registry_deploy',
    'Deploy an agent from the registry to a platform. Creates a deployment record and handles revenue split for paid agents.',
    {
      agent_id: z.string().describe('Agent ID to deploy'),
      deployer_id: z.string().describe('User ID of the deployer'),
      platform_id: z.string().optional().describe('Platform ID (null = direct/local deployment)'),
      config: z.record(z.string(), z.unknown()).optional().describe('Deployment configuration'),
      api_keys_ref: z.record(z.string(), z.string()).optional().describe('API key aliases (never raw keys)'),
    },
    async ({ agent_id, deployer_id, platform_id, config, api_keys_ref }) => {
      // Verify agent exists
      const { data: agent, error: agentError } = await supabase
        .from('marketplace_agents')
        .select('id, title, creator_id, price_credits, is_open, is_published, usage_count')
        .eq('id', agent_id)
        .single();

      if (agentError || !agent) {
        return { content: [{ type: 'text' as const, text: `Agent not found: ${agent_id}` }], isError: true };
      }

      if (!agent.is_published) {
        return { content: [{ type: 'text' as const, text: `Agent "${agent_id}" is not published` }], isError: true };
      }

      // Create deployment
      const { data: deployment, error: deployError } = await supabase
        .from('deployments')
        .insert({
          agent_id,
          deployer_id,
          platform_id: platform_id ?? null,
          config: config ?? {},
          api_keys_ref: api_keys_ref ?? {},
          status: 'active',
        })
        .select()
        .single();

      if (deployError) {
        return { content: [{ type: 'text' as const, text: `Deploy failed: ${deployError.message}` }], isError: true };
      }

      // Handle revenue for paid agents
      let revenueEvent = null;
      if (agent.price_credits > 0 && agent.creator_id) {
        const { data: split } = await supabase
          .rpc('calculate_revenue_split', {
            p_gross: agent.price_credits,
            p_platform_id: platform_id ?? null,
          });

        const splitData = Array.isArray(split) ? split[0] : split;
        if (splitData) {
          const { data: rev } = await supabase
            .from('revenue_events')
            .insert({
              agent_id,
              creator_id: agent.creator_id,
              platform_id: platform_id ?? null,
              deployment_id: deployment.id,
              gross_amount: agent.price_credits,
              platform_fee: splitData.platform_fee,
              creator_payout: splitData.creator_payout,
              event_type: 'deploy',
            })
            .select()
            .single();
          revenueEvent = rev;
        }
      }

      // Increment usage count on the agent
      await supabase
        .from('marketplace_agents')
        .update({ usage_count: (agent.usage_count ?? 0) + 1 })
        .eq('id', agent_id);

      // Update platform deployment count
      if (platform_id) {
        const { count } = await supabase
          .from('deployments')
          .select('id', { count: 'exact', head: true })
          .eq('platform_id', platform_id)
          .eq('status', 'active');

        await supabase
          .from('platforms')
          .update({ deployment_count: count ?? 0 })
          .eq('id', platform_id);
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            deployed: true,
            deployment_id: deployment.id,
            agent_id,
            agent_title: agent.title,
            platform_id: platform_id ?? 'local',
            status: 'active',
            revenue: revenueEvent ? {
              gross: revenueEvent.gross_amount,
              platform_fee: revenueEvent.platform_fee,
              creator_payout: revenueEvent.creator_payout,
            } : null,
          }, null, 2),
        }],
      };
    }
  );
}
