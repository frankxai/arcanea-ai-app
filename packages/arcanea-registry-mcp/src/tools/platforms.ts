import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { supabase } from '../supabase.js';
import { createHash, randomBytes } from 'node:crypto';

export function registerPlatformsTool(server: McpServer) {
  server.tool(
    'registry_platforms',
    'List active platforms or register a new platform in the Arcanea Agent Registry. Platforms are consumers of the registry (e.g. Trinity, OpenClaw instances).',
    {
      action: z.enum(['list', 'register']).describe('Action: list platforms or register new'),
      // Register fields
      platform: z.object({
        id: z.string(),
        name: z.string(),
        owner_id: z.string(),
        description: z.string().optional(),
        allowed_origins: z.array(z.string()).optional(),
        fee_override: z.number().min(0).max(0.5).optional(),
      }).optional().describe('Platform to register (for register action)'),
    },
    async ({ action, platform }) => {
      if (action === 'register') {
        if (!platform) {
          return { content: [{ type: 'text' as const, text: 'platform object required for register action' }], isError: true };
        }

        // Generate API key
        const rawKey = `arc_${randomBytes(32).toString('hex')}`;
        const keyHash = createHash('sha256').update(rawKey).digest('hex');

        const { data, error } = await supabase
          .from('platforms')
          .insert({
            id: platform.id,
            name: platform.name,
            owner_id: platform.owner_id,
            description: platform.description,
            allowed_origins: platform.allowed_origins ?? [],
            fee_override: platform.fee_override,
            api_key_hash: keyHash,
          })
          .select()
          .single();

        if (error) {
          return { content: [{ type: 'text' as const, text: `Platform registration failed: ${error.message}` }], isError: true };
        }

        // Also create the API key record
        await supabase
          .from('platform_api_keys')
          .insert({
            platform_id: platform.id,
            key_hash: keyHash,
            label: 'Default API Key',
            scopes: ['read', 'write', 'deploy'],
          });

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              registered: true,
              platform: {
                id: data.id,
                name: data.name,
                description: data.description,
              },
              api_key: rawKey,
              warning: 'Store this API key securely — it cannot be retrieved again.',
            }, null, 2),
          }],
        };
      }

      // List platforms
      const { data, error } = await supabase
        .from('platforms')
        .select('id, name, description, agent_count, deployment_count, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        return { content: [{ type: 'text' as const, text: `Platforms query failed: ${error.message}` }], isError: true };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            total: (data ?? []).length,
            platforms: data ?? [],
          }, null, 2),
        }],
      };
    }
  );
}
