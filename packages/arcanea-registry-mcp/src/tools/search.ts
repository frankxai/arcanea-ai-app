import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';

export function registerSearchTool(server: McpServer) {
  server.tool(
    'registry_search',
    'Search the Arcanea Agent Registry by query, capabilities, category, or tags. Returns ranked agent results.',
    {
      query: z.string().optional().describe('Natural language search query'),
      capabilities: z.array(z.string()).optional().describe('Filter by capability tags'),
      category: z.string().optional().describe('Filter by category'),
      tags: z.array(z.string()).optional().describe('Filter by tags'),
      is_open: z.boolean().optional().describe('Filter by open/free agents only'),
      limit: z.number().min(1).max(100).optional().describe('Max results (default 20)'),
      offset: z.number().min(0).optional().describe('Pagination offset'),
    },
    async ({ query, capabilities, category, tags, is_open, limit = 20, offset = 0 }) => {
      let dbQuery = supabase
        .from('marketplace_agents')
        .select('id, name, title, description, category, capabilities, tags, creator_id, price_credits, is_open, rating, usage_count, version, license, source_url, mcp_endpoint', { count: 'exact' })
        .eq('is_published', true)
        .range(offset, offset + limit - 1)
        .order('usage_count', { ascending: false });

      if (category) {
        dbQuery = dbQuery.eq('category', category);
      }

      if (is_open !== undefined) {
        dbQuery = dbQuery.eq('is_open', is_open);
      }

      if (capabilities && capabilities.length > 0) {
        dbQuery = dbQuery.overlaps('capabilities', capabilities);
      }

      if (tags && tags.length > 0) {
        dbQuery = dbQuery.overlaps('tags', tags);
      }

      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,title.ilike.%${query}%`);
      }

      const { data, error, count } = await dbQuery;

      if (error) {
        return { content: [{ type: 'text' as const, text: `Search failed: ${error.message}` }], isError: true };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            agents: data ?? [],
            total: count ?? 0,
            query: { query, capabilities, category, tags, is_open, limit, offset },
          }, null, 2),
        }],
      };
    }
  );
}
