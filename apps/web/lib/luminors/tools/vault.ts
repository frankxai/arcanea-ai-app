/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * search_vault + save_to_vault — Studio vault integration.
 *
 * These tools close the chat ↔ vault loop. Luminors read from the creator's
 * `ingested_documents` via semantic search and write back new artifacts
 * classified by type (character, location, magic, scene, lore, reference,
 * chapter, note). Both degrade gracefully on no-auth or pre-migration.
 */

import { tool } from 'ai';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

export const VAULT_CLASSIFICATIONS = [
  'character',
  'location',
  'magic',
  'scene',
  'lore',
  'reference',
  'chapter',
  'note',
] as const;

export type VaultClassification = (typeof VAULT_CLASSIFICATIONS)[number];

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export const vaultSearchInputSchema = z.object({
  query: z
    .string()
    .min(2)
    .max(400)
    .describe(
      "Natural-language search over the user's ingested Studio documents. Use when the user references something they've shared before — a world, character, location, magic system, chapter, or note.",
    ),
  classification: z
    .enum(VAULT_CLASSIFICATIONS)
    .optional()
    .describe('Restrict to one content type if you know it'),
  worldId: z.string().uuid().optional().describe('Restrict to a specific world'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(16)
    .optional()
    .default(6)
    .describe('How many results to return (1-16, default 6)'),
});

export type VaultSearchInput = z.infer<typeof vaultSearchInputSchema>;

export function buildSearchVaultTool(
  supabaseClient: SupabaseClient | null | undefined,
  userId: string | null | undefined,
) {
  return tool({
    description:
      "Search the user's Studio vault — their ingested characters, locations, magic systems, scenes, lore, chapters, and notes — and return matching snippets. Use when the user references their own world (a character name, location, magic rule) or when pulling from their past notes would give a better answer. Returns top-K semantically similar documents with titles, classification, and content snippets.",
    inputSchema: vaultSearchInputSchema,
    execute: async ({ query, classification, worldId, limit }: VaultSearchInput) => {
      if (!supabaseClient || !userId) {
        return {
          type: 'vault_search' as const,
          query,
          results: [],
          count: 0,
          error: 'Sign in to search your vault',
        };
      }

      try {
        const [{ openai }, { embed }, { toPgVector }] = await Promise.all([
          import('@ai-sdk/openai'),
          import('ai'),
          import('@/lib/studio/embed'),
        ]);

        const { embedding } = await embed({
          model: openai.textEmbedding('text-embedding-3-small'),
          value: query,
        });

        const { data, error } = await supabaseClient.rpc('match_ingested_documents', {
          query_embedding: toPgVector(embedding),
          match_count: limit ?? 6,
          p_user_id: userId,
          p_world_id: worldId ?? null,
          p_classification: classification ?? null,
        });

        if (error) {
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
          const content =
            typeof row.markdown_content === 'string' ? row.markdown_content : '';
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
  });
}

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------

export const vaultSaveInputSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(180)
    .describe(
      'Concise, specific title. For characters: the name. For locations: the place name. For scenes: a descriptive phrase.',
    ),
  content: z
    .string()
    .min(10)
    .max(60_000)
    .describe(
      'The full markdown body to save. Use headings, lists, and frontmatter-style metadata where helpful.',
    ),
  classification: z
    .enum(VAULT_CLASSIFICATIONS)
    .describe('The type of content — pick the single best fit.'),
  tags: z
    .array(z.string().max(32))
    .max(10)
    .optional()
    .describe('Up to 10 short lowercase tags'),
  worldId: z.string().uuid().optional().describe('Attach to a specific world, if applicable'),
});

export type VaultSaveInput = z.infer<typeof vaultSaveInputSchema>;

export function buildSaveToVaultTool(
  supabaseClient: SupabaseClient | null | undefined,
  userId: string | null | undefined,
) {
  return tool({
    description:
      "Persist a piece of content to the user's Studio vault so it becomes part of their world graph and future chats can retrieve it. Use when the user produces something worth keeping — a character they've named, a location they're building, a magic system they sketched, a chapter draft, a lore fact. ALWAYS confirm with the user before saving unless they explicitly asked to save. Returns the new document id.",
    inputSchema: vaultSaveInputSchema,
    execute: async ({ title, content, classification, tags, worldId }: VaultSaveInput) => {
      if (!supabaseClient || !userId) {
        return {
          type: 'vault_saved' as const,
          saved: false,
          error: 'Sign in to save to your vault',
        };
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
              title,
              classification,
              tags,
              markdownContent: content,
            }),
          });
          embedding = vec;
        } catch {
          embedding = null;
        }
        const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        const tokenEstimate = Math.ceil(content.length / 4);
        const { data, error } = await supabaseClient
          .from('ingested_documents')
          .insert({
            user_id: userId,
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
            return {
              type: 'vault_saved' as const,
              saved: false,
              error: 'Vault not migrated yet. Run: supabase db push',
            };
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
  });
}
