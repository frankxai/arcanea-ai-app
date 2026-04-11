/**
 * Embedding Generation for the Luminor Registry
 *
 * Generates 1536-dim embeddings for marketplace_agents rows to activate
 * the HNSW semantic search that's already in the schema.
 *
 * Uses OpenAI text-embedding-3-small (1536 dims, cheap, fast).
 *
 * Reference: Luminor Kernel Spec v1.0 §5 (Runtime), Registry Protocol §10
 */

import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';

const MODEL = openai.textEmbedding('text-embedding-3-small');

export interface AgentEmbeddingInput {
  id: string;
  name: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  capabilities?: string[] | null;
  tags?: string[] | null;
  systemPrompt?: string | null;
}

/**
 * Build the text blob that will be embedded for an agent.
 *
 * Composition strategy:
 *   - Name and title first (highest signal for search queries)
 *   - Description and tagline (mid signal)
 *   - Capabilities and tags (structured keywords)
 *   - First 500 chars of system prompt (captures voice and approach)
 *
 * We truncate the system prompt because embedding models have input limits
 * and the top of the prompt usually carries the identity/personality.
 */
export function buildEmbeddingText(input: AgentEmbeddingInput): string {
  const parts: string[] = [];

  parts.push(`Name: ${input.name}`);
  if (input.title) parts.push(`Title: ${input.title}`);
  if (input.description) parts.push(`Description: ${input.description}`);
  if (input.category) parts.push(`Category: ${input.category}`);

  if (input.capabilities && input.capabilities.length > 0) {
    parts.push(`Capabilities: ${input.capabilities.join(', ')}`);
  }

  if (input.tags && input.tags.length > 0) {
    parts.push(`Tags: ${input.tags.join(', ')}`);
  }

  if (input.systemPrompt) {
    const snippet = input.systemPrompt.slice(0, 500).replace(/\s+/g, ' ').trim();
    parts.push(`Voice: ${snippet}`);
  }

  return parts.join('\n');
}

/**
 * Generate a single 1536-dim embedding for an agent.
 * Returns the vector as a plain number array, ready for pgvector.
 */
export async function embedAgent(input: AgentEmbeddingInput): Promise<number[]> {
  const text = buildEmbeddingText(input);
  const { embedding } = await embed({
    model: MODEL,
    value: text,
  });
  return embedding;
}

/**
 * Batch embedding for multiple agents.
 * More efficient than calling embedAgent() in a loop — uses a single API call.
 */
export async function embedAgents(
  inputs: AgentEmbeddingInput[]
): Promise<Map<string, number[]>> {
  if (inputs.length === 0) return new Map();

  const texts = inputs.map(buildEmbeddingText);
  const { embeddings } = await embedMany({
    model: MODEL,
    values: texts,
  });

  const result = new Map<string, number[]>();
  inputs.forEach((input, i) => {
    result.set(input.id, embeddings[i]);
  });
  return result;
}

/**
 * Format a 1536-dim embedding as a pgvector literal string.
 * pgvector expects: '[0.1, 0.2, ..., 0.9]'
 */
export function toPgVector(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}
