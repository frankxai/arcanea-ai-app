import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';

export function registerSkillsTool(server: McpServer) {
  server.tool(
    'registry_skills',
    'List, search, or publish skills in the Arcanea Skill Registry. Skills can be standalone or attached to agents.',
    {
      action: z.enum(['list', 'search', 'publish']).describe('Action: list all, search by query, or publish new'),
      query: z.string().optional().describe('Search query (for search action)'),
      capabilities: z.array(z.string()).optional().describe('Filter by capabilities (for list/search)'),
      agent_id: z.string().optional().describe('Filter skills by agent ID (for list)'),
      // Publish fields
      skill: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        capabilities: z.array(z.string()),
        version: z.string().optional(),
        agent_id: z.string().optional(),
        creator_id: z.string(),
        guardian_affinity: z.array(z.string()).optional(),
        input_schema: z.record(z.string(), z.unknown()).optional(),
        output_schema: z.record(z.string(), z.unknown()).optional(),
      }).optional().describe('Skill to publish (for publish action)'),
    },
    async ({ action, query, capabilities, agent_id, skill }) => {
      if (action === 'publish') {
        if (!skill) {
          return { content: [{ type: 'text' as const, text: 'skill object required for publish action' }], isError: true };
        }

        const { data, error } = await supabase
          .from('skill_registry')
          .upsert({
            id: skill.id,
            name: skill.name,
            description: skill.description,
            capabilities: skill.capabilities,
            version: skill.version ?? '1.0.0',
            agent_id: skill.agent_id ?? null,
            creator_id: skill.creator_id,
            guardian_affinity: skill.guardian_affinity ?? [],
            input_schema: skill.input_schema,
            output_schema: skill.output_schema,
            is_published: true,
          }, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          return { content: [{ type: 'text' as const, text: `Skill publish failed: ${error.message}` }], isError: true };
        }

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({ published: true, skill: data }, null, 2),
          }],
        };
      }

      // List or search
      let dbQuery = supabase
        .from('skill_registry')
        .select('*')
        .eq('is_published', true)
        .order('usage_count', { ascending: false })
        .limit(50);

      if (agent_id) dbQuery = dbQuery.eq('agent_id', agent_id);
      if (capabilities && capabilities.length > 0) dbQuery = dbQuery.overlaps('capabilities', capabilities);
      if (query) dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);

      const { data, error } = await dbQuery;

      if (error) {
        return { content: [{ type: 'text' as const, text: `Skills query failed: ${error.message}` }], isError: true };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            action,
            total: (data ?? []).length,
            skills: data ?? [],
          }, null, 2),
        }],
      };
    }
  );
}
