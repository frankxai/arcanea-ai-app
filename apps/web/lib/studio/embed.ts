/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Studio Embedding — 1536-dim vectors for ingested_documents
 *
 * Uses the same OpenAI text-embedding-3-small model as the agent registry
 * so queries are comparable across tables (Luminor memory, agents, docs).
 *
 * Prefix-aware: we embed title + classification + tags + first 1500 chars
 * of content, because the classifier has already surfaced the high-signal
 * facets. Full document bodies get chunked later if we add chunk-level
 * retrieval.
 */

import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const MODEL = openai.textEmbedding('text-embedding-3-small');

export interface StudioEmbeddingInput {
  title: string;
  classification: string;
  tags?: string[];
  markdownContent: string;
}

export function buildStudioEmbeddingText(input: StudioEmbeddingInput): string {
  const parts: string[] = [];
  parts.push(`Title: ${input.title}`);
  parts.push(`Type: ${input.classification}`);
  if (input.tags && input.tags.length > 0) {
    parts.push(`Tags: ${input.tags.join(', ')}`);
  }
  const body = input.markdownContent.slice(0, 1500).replace(/\s+/g, ' ').trim();
  parts.push(`Content: ${body}`);
  return parts.join('\n');
}

export async function embedStudioDocument(
  input: StudioEmbeddingInput,
): Promise<number[]> {
  const text = buildStudioEmbeddingText(input);
  const { embedding } = await embed({
    model: MODEL,
    value: text,
  });
  return embedding;
}

export function toPgVector(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}
