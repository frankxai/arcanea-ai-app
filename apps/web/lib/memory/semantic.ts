/**
 * Semantic Memory Service
 *
 * Generates embeddings for memories and retrieves relevant ones
 * based on conversation context using vector similarity search.
 *
 * Uses Gemini text-embedding-004 (768 dimensions) via the existing
 * EmbeddingService. Falls back to chronological retrieval when
 * embeddings are unavailable.
 *
 * @module lib/memory/semantic
 */

import { generateEmbedding } from '@/lib/services/embeddings';
import { TaskType } from '@google/generative-ai';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface RelevantMemory {
  id: string;
  content: string;
  category: string;
  similarity: number;
}

/**
 * Generate embedding for a memory and store it.
 * Called fire-and-forget when a new memory is created via the memory_store tool.
 */
export async function embedMemory(
  supabase: SupabaseClient,
  memoryId: string,
  content: string,
): Promise<void> {
  try {
    // generateEmbedding uses GEMINI_API_KEY from env internally
    if (!process.env.GEMINI_API_KEY) return;

    const embedding = await generateEmbedding(content, TaskType.RETRIEVAL_DOCUMENT);

    await supabase
      .from('user_memories')
      .update({ embedding })
      .eq('id', memoryId);
  } catch (e) {
    // Non-fatal: memory is still saved, just not semantically searchable
    console.warn('Failed to embed memory:', e);
  }
}

/**
 * Retrieve memories relevant to the current conversation context.
 * Uses semantic search via pgvector if embeddings are available,
 * falls back to chronological (last N) otherwise.
 */
export async function recallRelevantMemories(
  supabase: SupabaseClient,
  userId: string,
  conversationContext: string,
  limit: number = 15,
): Promise<RelevantMemory[]> {
  try {
    if (process.env.GEMINI_API_KEY && conversationContext.trim().length > 0) {
      // Generate embedding for the conversation context
      const embedding = await generateEmbedding(
        conversationContext,
        TaskType.RETRIEVAL_QUERY,
      );

      // Use the match_user_memories RPC function (pgvector cosine similarity)
      const { data, error } = await supabase.rpc('match_user_memories', {
        query_embedding: embedding,
        match_user_id: userId,
        match_threshold: 0.3,
        match_count: limit,
      });

      if (!error && data && data.length > 0) {
        return data.map((m: { id: string; content: string; category: string; similarity: number }) => ({
          id: m.id,
          content: m.content,
          category: m.category,
          similarity: m.similarity,
        }));
      }
    }
  } catch (e) {
    console.warn('Semantic memory recall failed, falling back to chronological:', e);
  }

  // Fallback: chronological (last N memories)
  const { data: memories } = await supabase
    .from('user_memories')
    .select('id, content, category')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (memories || []).map((m: { id: string; content: string; category: string }) => ({
    id: m.id,
    content: m.content,
    category: m.category,
    similarity: 1.0, // Assume full relevance for chronological fallback
  }));
}
