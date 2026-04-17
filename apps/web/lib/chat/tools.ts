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
// Vault search — lets Luminors retrieve from the creator's ingested content
// ---------------------------------------------------------------------------

const vaultClassifications = [
  'character',
  'location',
  'magic',
  'scene',
  'lore',
  'reference',
  'chapter',
  'note',
] as const;

const vaultSearchInputSchema = z.object({
  query: z
    .string()
    .min(2)
    .max(400)
    .describe(
      "Natural-language search over the user's ingested Studio documents. Use when the user references something they've shared before — a world, character, location, magic system, chapter, or note.",
    ),
  classification: z
    .enum(vaultClassifications)
    .optional()
    .describe('Restrict to one content type if you know it'),
  worldId: z
    .string()
    .uuid()
    .optional()
    .describe('Restrict to a specific world'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(16)
    .optional()
    .default(6)
    .describe('How many results to return (1-16, default 6)'),
});

type VaultSearchInput = z.infer<typeof vaultSearchInputSchema>;

// ---------------------------------------------------------------------------
// Vault save — Luminors persist content to the vault mid-chat
// ---------------------------------------------------------------------------

const vaultSaveInputSchema = z.object({
  title: z.string().min(2).max(180)
    .describe("Concise, specific title. For characters: the name. For locations: the place name. For scenes: a descriptive phrase."),
  content: z.string().min(10).max(60_000)
    .describe("The full markdown body to save. Use headings, lists, and frontmatter-style metadata where helpful."),
  classification: z.enum(vaultClassifications)
    .describe("The type of content — pick the single best fit."),
  tags: z.array(z.string().max(32)).max(10).optional()
    .describe('Up to 10 short lowercase tags'),
  worldId: z.string().uuid().optional()
    .describe('Attach to a specific world, if applicable'),
});

type VaultSaveInput = z.infer<typeof vaultSaveInputSchema>;

// ---------------------------------------------------------------------------
// Luminor handoff — inter-specialist routing mid-conversation
// ---------------------------------------------------------------------------

const LUMINOR_IDS = [
  'lumina', 'systems-architect', 'code-crafter', 'debugger',
  'visual-designer', 'composer', 'motion-designer',
  'storyteller', 'voice', 'poet',
  'deep-researcher', 'strategist', 'integrator',
] as const;

const luminorHandoffSchema = z.object({
  to: z.enum(LUMINOR_IDS)
    .describe("Which Luminor to hand off to. Choose based on fit: code-crafter (clean code), debugger (root cause), visual-designer (UI/color), composer (music/audio), motion-designer (animation), storyteller (narrative arcs), voice (copy/naming), poet (lyrics/verse), deep-researcher (synthesis), strategist (direction), integrator (connection), systems-architect (architecture), or lumina (orchestrator when unsure)."),
  reason: z.string().min(10).max(400)
    .describe('One sentence: why this specialist is the right next step.'),
  brief: z.string().min(10).max(2000)
    .describe('What the target Luminor should pick up with — summarize done work, user wants, and vault context.'),
});

type LuminorHandoffInput = z.infer<typeof luminorHandoffSchema>;

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

    save_to_vault: tool({
      description:
        "Persist a piece of content to the user's Studio vault so it becomes part of their world graph and future chats can retrieve it. Use when the user produces something worth keeping — a character they've named, a location they're building, a magic system they sketched, a chapter draft, a lore fact. ALWAYS confirm with the user before saving unless they explicitly asked to save. Returns the new document id.",
      inputSchema: vaultSaveInputSchema,
      execute: async ({ title, content, classification, tags, worldId }: VaultSaveInput) => {
        if (!options?.supabaseClient || !options?.userId) {
          return { type: 'vault_saved' as const, saved: false, error: 'Sign in to save to your vault' };
        }
        try {
          const [{ openai }, { embed }, embedMod] = await Promise.all([
            import('@ai-sdk/openai'),
            import('ai'),
            import('@/lib/studio/embed'),
          ]);
          let embedding: number[] | null = null;
          try {
            const { embedding: vec } = await embed({
              model: openai.textEmbedding('text-embedding-3-small'),
              value: embedMod.buildStudioEmbeddingText({
                title, classification, tags, markdownContent: content,
              }),
            });
            embedding = vec;
          } catch {
            embedding = null;
          }
          const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
          const tokenEstimate = Math.ceil(content.length / 4);
          const { data, error } = await options.supabaseClient
            .from('ingested_documents')
            .insert({
              user_id: options.userId,
              world_id: worldId ?? null,
              title,
              markdown_content: content,
              jsonml_content: { source: 'chat', savedBy: 'luminor' },
              classification,
              classification_confidence: 0.85,
              source_type: 'chat',
              source_uri: null,
              source_metadata: { savedAt: new Date().toISOString() },
              embedding: embedding ? embedMod.toPgVector(embedding) : null,
              word_count: wordCount,
              token_estimate: tokenEstimate,
              tags: tags ?? [],
            })
            .select('id, title, classification, tags')
            .single();
          if (error) {
            if (error.code === '42P01') {
              return { type: 'vault_saved' as const, saved: false, error: 'Vault not migrated yet. Run: supabase db push' };
            }
            return { type: 'vault_saved' as const, saved: false, error: error.message };
          }
          return {
            type: 'vault_saved' as const,
            saved: true,
            id: data.id,
            title: data.title,
            classification: data.classification,
            tags: data.tags,
            embedded: embedding !== null,
            detailUrl: `/studio/vault/${data.id}`,
          };
        } catch (err) {
          return {
            type: 'vault_saved' as const,
            saved: false,
            error: err instanceof Error ? err.message : 'Save failed',
          };
        }
      },
    }),

    handoff_to_luminor: tool({
      description:
        "Hand off the current conversation to a different specialist Luminor. Use when the next step needs expertise you don't have — e.g., Storyteller drafts a scene, then hands off to Composer for a soundtrack. Returns a structured handoff payload the client uses to switch the active Luminor. Include enough brief so the new Luminor picks up seamlessly.",
      inputSchema: luminorHandoffSchema,
      execute: async ({ to, reason, brief }: LuminorHandoffInput) => {
        return { type: 'luminor_handoff' as const, to, reason, brief };
      },
    }),

    search_vault: tool({
      description:
        "Search the user's Studio vault — their ingested characters, locations, magic systems, scenes, lore, chapters, and notes — and return matching snippets. Use when the user references their own world (a character name, location, magic rule) or when pulling from their past notes would give a better answer. Returns top-K semantically similar documents with titles, classification, and content snippets.",
      inputSchema: vaultSearchInputSchema,
      execute: async ({ query, classification, worldId, limit }: VaultSearchInput) => {
        // Requires both supabase client and userId — degrades gracefully otherwise
        if (!options?.supabaseClient || !options?.userId) {
          return {
            type: 'vault_search' as const,
            query,
            results: [],
            count: 0,
            error: 'Sign in to search your vault',
          };
        }

        try {
          // Lazy-load the embedder so the bundle stays lean for non-vault routes
          const [{ openai }, { embed }, { toPgVector }] = await Promise.all([
            import('@ai-sdk/openai'),
            import('ai'),
            import('@/lib/studio/embed'),
          ]);

          const { embedding } = await embed({
            model: openai.textEmbedding('text-embedding-3-small'),
            value: query,
          });

          const { data, error } = await options.supabaseClient.rpc(
            'match_ingested_documents',
            {
              query_embedding: toPgVector(embedding),
              match_count: limit ?? 6,
              p_user_id: options.userId,
              p_world_id: worldId ?? null,
              p_classification: classification ?? null,
            },
          );

          if (error) {
            // Clean error — not migrated, or RPC missing
            if (error.code === '42883' || error.code === '42P01') {
              return {
                type: 'vault_search' as const,
                query,
                results: [],
                count: 0,
                error: 'Vault not migrated yet. Run: supabase db push',
              };
            }
            return {
              type: 'vault_search' as const,
              query,
              results: [],
              count: 0,
              error: error.message,
            };
          }

          type Row = {
            id: string;
            title: string;
            markdown_content?: string | null;
            classification: string;
            source_type: string;
            world_id: string | null;
            tags: string[];
            similarity: number;
          };

          const rows: Row[] = (data as Row[]) ?? [];
          const results = rows.map((row) => {
            const content = typeof row.markdown_content === 'string' ? row.markdown_content : '';
            return {
              id: row.id,
              title: row.title,
              classification: row.classification,
              source_type: row.source_type,
              world_id: row.world_id,
              tags: row.tags,
              similarity: Math.round(row.similarity * 100) / 100,
              snippet: content.slice(0, 600).replace(/\s+/g, ' ').trim(),
            };
          });

          return {
            type: 'vault_search' as const,
            query,
            count: results.length,
            results,
          };
        } catch (err) {
          return {
            type: 'vault_search' as const,
            query,
            results: [],
            count: 0,
            error: err instanceof Error ? err.message : 'Vault search failed',
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
