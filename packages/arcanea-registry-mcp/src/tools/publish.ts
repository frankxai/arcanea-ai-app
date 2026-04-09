import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';

export function registerPublishTool(server: McpServer) {
  server.tool(
    'registry_publish',
    'Publish an agent or skill to the Arcanea Agent Registry. Creates the agent entry, updates creator profile, and optionally registers associated skills.',
    {
      id: z.string().describe('Unique agent ID (slug)'),
      name: z.string().describe('Agent name'),
      title: z.string().describe('Display title'),
      category: z.string().describe('Category (e.g. creative, development, analysis)'),
      description: z.string().describe('Short description'),
      long_description: z.string().optional().describe('Full description'),
      capabilities: z.array(z.string()).describe('Capability tags'),
      tags: z.array(z.string()).optional().describe('Discovery tags'),
      spec: z.record(z.string(), z.unknown()).describe('Agent spec (personality, system prompt, config)'),
      price_credits: z.number().min(0).optional().describe('Price in credits (0 = free)'),
      is_open: z.boolean().optional().describe('Whether agent is free/open (default true)'),
      license: z.string().optional().describe('License (default MIT)'),
      source_url: z.string().optional().describe('Source code URL'),
      mcp_endpoint: z.string().optional().describe('MCP server endpoint URL'),
      creator_name: z.string().describe('Creator display name'),
      creator_id: z.string().describe('Creator user ID (UUID)'),
      skills: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        capabilities: z.array(z.string()),
        input_schema: z.record(z.string(), z.unknown()).optional(),
        output_schema: z.record(z.string(), z.unknown()).optional(),
      })).optional().describe('Skills to register with this agent'),
    },
    async (params) => {
      // Upsert creator profile
      const { error: creatorError } = await supabase
        .from('creators')
        .upsert({
          user_id: params.creator_id,
          display_name: params.creator_name,
        }, { onConflict: 'user_id' });

      if (creatorError) {
        return { content: [{ type: 'text' as const, text: `Creator upsert failed: ${creatorError.message}` }], isError: true };
      }

      // Insert agent
      const { data: agent, error: agentError } = await supabase
        .from('marketplace_agents')
        .upsert({
          id: params.id,
          creator_id: params.creator_id,
          name: params.name,
          title: params.title,
          category: params.category,
          description: params.description,
          long_description: params.long_description,
          spec: params.spec,
          capabilities: params.capabilities,
          tags: params.tags ?? [],
          price_credits: params.price_credits ?? 0,
          is_open: params.is_open ?? true,
          license: params.license ?? 'MIT',
          source_url: params.source_url,
          mcp_endpoint: params.mcp_endpoint,
          is_published: true,
        }, { onConflict: 'id' })
        .select()
        .single();

      if (agentError) {
        return { content: [{ type: 'text' as const, text: `Agent publish failed: ${agentError.message}` }], isError: true };
      }

      // Register skills if provided
      let skillsPublished = 0;
      if (params.skills && params.skills.length > 0) {
        const skillRows = params.skills.map(s => ({
          id: s.id,
          agent_id: params.id,
          creator_id: params.creator_id,
          name: s.name,
          description: s.description,
          capabilities: s.capabilities,
          input_schema: s.input_schema,
          output_schema: s.output_schema,
          is_published: true,
        }));

        const { error: skillError } = await supabase
          .from('skill_registry')
          .upsert(skillRows, { onConflict: 'id' });

        if (!skillError) {
          skillsPublished = skillRows.length;
        }
      }

      // Update creator agent count
      const { count } = await supabase
        .from('marketplace_agents')
        .select('id', { count: 'exact', head: true })
        .eq('creator_id', params.creator_id)
        .eq('is_published', true);

      await supabase
        .from('creators')
        .update({ agent_count: count ?? 0 })
        .eq('user_id', params.creator_id);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            published: true,
            agent_id: agent.id,
            skills_published: skillsPublished,
            message: `Agent "${params.title}" published successfully${skillsPublished > 0 ? ` with ${skillsPublished} skills` : ''}`,
          }, null, 2),
        }],
      };
    }
  );
}
