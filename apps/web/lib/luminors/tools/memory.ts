/**
 * memory_store — user_memories (general facts across all Luminors).
 * update_memory — luminor_memory_blocks (Letta-style per-Luminor, per-user block).
 *
 * Two distinct capabilities:
 *   - `memory_store` is the broad fact store, shared across every Luminor.
 *   - `update_memory` is the deep per-relationship block — what THIS Luminor
 *     has learned about THIS creator. Letta/MemGPT pattern.
 */

import { tool } from 'ai';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// memory_store — cross-Luminor user_memories
// ---------------------------------------------------------------------------

export const MEMORY_CATEGORIES = [
  'preference',
  'background',
  'goal',
  'project',
  'style',
  'general',
] as const;

export const memoryStoreInputSchema = z.object({
  content: z
    .string()
    .max(500)
    .describe('The fact to remember about the user — be concise and specific'),
  category: z
    .enum(MEMORY_CATEGORIES)
    .default('general')
    .describe(
      'Category: preference (likes/dislikes), background (who they are), goal (what they want), project (what they are working on), style (writing/creative style), general',
    ),
});

export type MemoryStoreInput = z.infer<typeof memoryStoreInputSchema>;

export function buildMemoryStoreTool(
  supabaseClient: SupabaseClient | null | undefined,
  userId: string | null | undefined,
) {
  return tool({
    description:
      'Save an important fact about the user for future conversations. Use when the user shares preferences, background info, goals, creative projects, writing style, or personal details they would want remembered across conversations.',
    inputSchema: memoryStoreInputSchema,
    execute: async ({ content, category }: MemoryStoreInput) => {
      if (!supabaseClient || !userId) {
        return {
          type: 'memory_saved' as const,
          content,
          category,
          saved: false,
          error: 'Sign in to enable memory',
        };
      }

      try {
        const { count } = await supabaseClient
          .from('user_memories')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId);

        if ((count ?? 0) >= 100) {
          return {
            type: 'memory_saved' as const,
            content,
            category,
            saved: false,
            warning: 'Memory limit reached (100). Consider removing old memories in Settings.',
          };
        }

        const { data: memory } = await supabaseClient
          .from('user_memories')
          .insert({ user_id: userId, content, category })
          .select('id')
          .single();

        if (memory?.id) {
          // Fire-and-forget embedding generation
          import('@/lib/memory/semantic').then(({ embedMemory }) => {
            embedMemory(supabaseClient, memory.id, content).catch(() => {});
          });
        }

        return { type: 'memory_saved' as const, content, category, saved: true };
      } catch {
        return {
          type: 'memory_saved' as const,
          content,
          category,
          saved: false,
          error: 'Failed to save memory',
        };
      }
    },
  });
}

// ---------------------------------------------------------------------------
// update_memory — Letta-style per-Luminor memory block
// ---------------------------------------------------------------------------

export const memoryBlockInputSchema = z.object({
  operation: z
    .enum(['append', 'replace', 'note'])
    .describe(
      'append: add to existing memory. replace: overwrite all (use sparingly). note: add a single observation.',
    ),
  content: z
    .string()
    .describe(
      'The information to remember. Be specific and actionable. Example: "Creator is building a Next.js 16 app with Supabase. Prefers functional components. Working on a publishing pipeline."',
    ),
});

export type MemoryBlockInput = z.infer<typeof memoryBlockInputSchema>;

/**
 * Build per-(luminor, user) memory edit tool. Scoped via closure.
 * Uses service-role client because the block table has strict RLS.
 */
export function buildMemoryBlockTool(luminorId: string, userId: string) {
  return tool({
    description:
      'Update your persistent memory about this creator. Use when you learn something important about the creator that should persist across conversations — their preferences, project context, skill level, past decisions. This memory is private to your relationship with this specific creator.',
    inputSchema: memoryBlockInputSchema,
    execute: async ({ operation, content }: MemoryBlockInput) => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !serviceKey) {
          return {
            success: false,
            error: 'Memory system not configured',
            note: 'Observation noted in this conversation but will not persist.',
          };
        }

        const supabase = createClient(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: existing } = await supabase
          .from('luminor_memory_blocks')
          .select('content')
          .eq('luminor_id', luminorId)
          .eq('user_id', userId)
          .maybeSingle();

        const currentContent = (existing as { content?: string } | null)?.content ?? '';

        let newContent = '';
        const timestamp = new Date().toISOString().slice(0, 10);

        switch (operation) {
          case 'append':
            newContent = currentContent
              ? `${currentContent}\n[${timestamp}] ${content}`
              : `[${timestamp}] ${content}`;
            break;
          case 'replace':
            newContent = `[${timestamp}] ${content}`;
            break;
          case 'note':
            newContent = currentContent ? `${currentContent}\n- ${content}` : `- ${content}`;
            break;
        }

        if (newContent.length > 8000) {
          const lines = newContent.split('\n');
          while (newContent.length > 7000 && lines.length > 2) {
            lines.shift();
            newContent = lines.join('\n');
          }
        }

        const { error: rpcError } = await supabase.rpc('upsert_memory_block', {
          p_luminor_id: luminorId,
          p_user_id: userId,
          p_content: newContent,
        });

        if (rpcError) {
          const { error: directError } = await supabase
            .from('luminor_memory_blocks')
            .upsert(
              {
                luminor_id: luminorId,
                user_id: userId,
                content: newContent,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'luminor_id,user_id' },
            );

          if (directError) {
            return {
              success: false,
              error: directError.message,
              note: 'Memory update failed. Observation noted in conversation only.',
            };
          }
        }

        return {
          success: true,
          operation,
          contentLength: newContent.length,
          note: `Memory updated (${operation}). This will be available in future conversations with this creator.`,
        };
      } catch (err) {
        return {
          success: false,
          error: (err as Error).message,
          note: 'Memory system error. Observation noted in conversation only.',
        };
      }
    },
  });
}
