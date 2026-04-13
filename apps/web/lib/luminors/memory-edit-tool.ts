/**
 * Luminor Memory Edit Tool (Letta Pattern)
 *
 * Lets a Luminor update its own persistent memory block during a conversation.
 * This is the deepest Letta/MemGPT pattern — the agent edits its own context.
 *
 * Operations:
 *   - append: add new information to the memory block
 *   - replace: overwrite the entire block (use sparingly)
 *   - note: add a single observation without replacing anything
 *
 * The memory block is per (luminorId, userId) — each user has their own
 * relationship with each Luminor. Stored in luminor_memory_blocks table.
 *
 * Reference: Luminor Kernel Spec v1.0 §5.3 (Memory Block)
 */

import { tool } from 'ai';
import { z } from 'zod';

/**
 * Build a memory edit tool scoped to a specific (luminor, user) pair.
 * Must be called with known IDs — the tool captures them in closure.
 */
export function buildMemoryEditTool(luminorId: string, userId: string) {
  return tool({
    description: `Update your persistent memory about this creator. Use when you learn something important about the creator that should persist across conversations — their preferences, project context, skill level, past decisions. This memory is private to your relationship with this specific creator.`,
    inputSchema: z.object({
      operation: z.enum(['append', 'replace', 'note']).describe(
        'append: add to existing memory. replace: overwrite all (use sparingly). note: add a single observation.'
      ),
      content: z.string().describe(
        'The information to remember. Be specific and actionable. Example: "Creator is building a Next.js 16 app with Supabase. Prefers functional components. Working on a publishing pipeline."'
      ),
    }),
    execute: async ({ operation, content }: { operation: 'append' | 'replace' | 'note'; content: string }) => {
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

        // Load existing block
        const { data: existing } = await supabase
          .from('luminor_memory_blocks')
          .select('content')
          .eq('luminor_id', luminorId)
          .eq('user_id', userId)
          .maybeSingle();

        const currentContent = (existing as { content?: string } | null)?.content ?? '';

        // Compute new content based on operation
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
            newContent = currentContent
              ? `${currentContent}\n- ${content}`
              : `- ${content}`;
            break;
        }

        // Enforce max length (2000 tokens ~ 8000 chars)
        if (newContent.length > 8000) {
          // Trim from the top (oldest entries) to make room
          const lines = newContent.split('\n');
          while (newContent.length > 7000 && lines.length > 2) {
            lines.shift();
            newContent = lines.join('\n');
          }
        }

        // Upsert via RPC (uses the upsert_memory_block function from migration)
        const { error: rpcError } = await supabase.rpc('upsert_memory_block', {
          p_luminor_id: luminorId,
          p_user_id: userId,
          p_content: newContent,
        });

        if (rpcError) {
          // Fallback: direct upsert
          const { error: directError } = await supabase
            .from('luminor_memory_blocks')
            .upsert(
              {
                luminor_id: luminorId,
                user_id: userId,
                content: newContent,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'luminor_id,user_id' }
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
