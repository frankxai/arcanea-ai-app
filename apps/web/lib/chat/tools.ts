/**
 * AI SDK tool definitions for the Arcanea chat pipeline.
 *
 * These tools are injected into streamText() when the client opts in
 * via the `enabledTools` request body field.
 *
 * Credit checking is NOT done here — it is the caller's responsibility
 * (route-level or UI-level).
 *
 * Use `createChatTools(options)` to get tools with Supabase-backed memory.
 * The default export `chatTools` is a backward-compatible instance without
 * memory persistence (memory_store will return a sign-in warning).
 */

import { tool } from 'ai';
import { z } from 'zod';
import { generateImages } from '@/lib/imagine/generate';
import { executeSearch } from '@/lib/search/providers';
import type { SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Input schemas
// ---------------------------------------------------------------------------

const imageGenerateInputSchema = z.object({
  prompt: z
    .string()
    .describe('Detailed description of the image to generate'),
  aspectRatio: z
    .enum(['1:1', '16:9', '9:16', '4:3'])
    .optional()
    .describe('Image aspect ratio. Defaults to 1:1 if not specified.'),
});

type ImageGenerateInput = z.infer<typeof imageGenerateInputSchema>;

const webSearchInputSchema = z.object({
  query: z
    .string()
    .describe('The search query - be specific and concise'),
  maxResults: z
    .number()
    .min(1)
    .max(10)
    .optional()
    .default(5)
    .describe('Number of results to return'),
});

type WebSearchInput = z.infer<typeof webSearchInputSchema>;

const memoryCategories = [
  'preference',
  'background',
  'goal',
  'project',
  'style',
  'general',
] as const;

const memoryStoreInputSchema = z.object({
  content: z
    .string()
    .max(500)
    .describe('The fact to remember about the user — be concise and specific'),
  category: z
    .enum(memoryCategories)
    .default('general')
    .describe(
      'Category: preference (likes/dislikes), background (who they are), goal (what they want), project (what they are working on), style (writing/creative style), general'
    ),
});

type MemoryStoreInput = z.infer<typeof memoryStoreInputSchema>;

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

interface ChatToolOptions {
  supabaseClient?: SupabaseClient;
  userId?: string;
  searchApiKey?: string;
}

/**
 * Create chat tools with optional Supabase-backed memory persistence.
 *
 * When `supabaseClient` and `userId` are provided, `memory_store` will
 * persist memories to the `user_memories` table. Otherwise it degrades
 * gracefully with a sign-in prompt.
 */
export function createChatTools(options?: ChatToolOptions) {
  return {
    image_generate: tool({
      description:
        'Generate an image based on a text description. Use when the user asks to create, draw, generate, or imagine a visual image.',
      inputSchema: imageGenerateInputSchema,
      execute: async ({ prompt, aspectRatio }: ImageGenerateInput) => {
        const result = await generateImages({
          prompt,
          aspectRatio: aspectRatio ?? '1:1',
          count: 1,
        });
        return {
          type: 'image' as const,
          images: result.images,
          provider: result.provider,
        };
      },
    }),

    web_search: tool({
      description:
        'Search the web for current information, recent events, facts, or up-to-date data. Use when the user asks about something that requires current knowledge beyond your training data.',
      inputSchema: webSearchInputSchema,
      execute: async ({ query, maxResults }: WebSearchInput) => {
        try {
          const result = await executeSearch(query, {
            apiKey: options?.searchApiKey,
            maxResults,
          });
          return {
            type: 'search' as const,
            query: result.query,
            answer: result.answer,
            provider: result.provider,
            results: result.results,
          };
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'Search failed';
          return { type: 'search' as const, error: msg, query, results: [] };
        }
      },
    }),

    deep_research: tool({
      description:
        'Conduct deep, multi-step research on a topic. Searches multiple sources in parallel and synthesizes findings into a comprehensive report with citations. Use when the user explicitly asks for thorough research, investigation, or comprehensive analysis on a topic.',
      inputSchema: z.object({
        question: z
          .string()
          .describe('The research question to investigate thoroughly'),
        maxSearches: z
          .number()
          .min(3)
          .max(10)
          .optional()
          .default(5)
          .describe('Number of parallel search queries to run (3-10)'),
      }),
      execute: async ({
        question,
        maxSearches,
      }: {
        question: string;
        maxSearches?: number;
      }) => {
        try {
          const { conductResearch } = await import('@/lib/ai/research');
          const result = await conductResearch(question, maxSearches);
          return { type: 'research_report' as const, ...result };
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Research failed';
          return {
            type: 'research_report' as const,
            error: message,
            report: '',
            sources: [],
            subQueries: [],
            totalSearches: 0,
          };
        }
      },
    }),

    memory_store: tool({
      description:
        'Save an important fact about the user for future conversations. Use when the user shares preferences, background info, goals, creative projects, writing style, or personal details they would want remembered across conversations.',
      inputSchema: memoryStoreInputSchema,
      execute: async ({ content, category }: MemoryStoreInput) => {
        if (!options?.supabaseClient || !options?.userId) {
          return {
            type: 'memory_saved' as const,
            content,
            category,
            saved: false,
            error: 'Sign in to enable memory',
          };
        }

        try {
          // Check memory count limit (max 100 per user)
          const { count } = await options.supabaseClient
            .from('user_memories')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', options.userId);

          if ((count ?? 0) >= 100) {
            return {
              type: 'memory_saved' as const,
              content,
              category,
              saved: false,
              warning:
                'Memory limit reached (100). Consider removing old memories in Settings.',
            };
          }

          const { data: memory } = await options.supabaseClient
            .from('user_memories')
            .insert({ user_id: options.userId, content, category })
            .select('id')
            .single();

          if (memory?.id) {
            // Fire-and-forget embedding generation (don't block the response)
            import('@/lib/memory/semantic').then(({ embedMemory }) => {
              embedMemory(options.supabaseClient!, memory.id, content).catch(() => {});
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
    }),
  };
}

/** Backward-compatible export for code that imports chatTools directly. */
export const chatTools = createChatTools();
