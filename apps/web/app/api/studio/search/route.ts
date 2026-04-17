/**
 * POST /api/studio/search
 *
 * Semantic search across the current user's ingested_documents.
 * Uses pgvector HNSW via match_ingested_documents() RPC.
 *
 * Body:
 *   { query: string, limit?: number, worldId?: string, classification?: string }
 *
 * Returns: [{ id, title, classification, source_type, similarity, snippet, ... }]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { toPgVector } from '@/lib/studio/embed';

export const runtime = 'nodejs';
export const maxDuration = 20;

const EMBED_MODEL = openai.textEmbedding('text-embedding-3-small');

interface SearchBody {
  query: string;
  limit?: number;
  worldId?: string;
  classification?: string;
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  let body: SearchBody;
  try {
    body = (await request.json()) as SearchBody;
  } catch {
    return err('Invalid JSON body', 400);
  }

  const query = body.query?.trim();
  if (!query || query.length < 2) {
    return err('query must be at least 2 characters', 400);
  }

  const limit = Math.min(Math.max(body.limit ?? 8, 1), 32);

  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required', 401);

  // Embed the query
  if (!process.env.OPENAI_API_KEY) {
    return err('Semantic search requires OPENAI_API_KEY on the server', 503);
  }

  let queryVector: number[];
  try {
    const { embedding } = await embed({
      model: EMBED_MODEL,
      value: query,
    });
    queryVector = embedding;
  } catch (e) {
    console.error('[studio/search] embed failed:', e);
    return err('Failed to embed query', 502);
  }

  // Call match_ingested_documents RPC
  const { data, error } = await supabase.rpc('match_ingested_documents', {
    query_embedding: toPgVector(queryVector),
    match_count: limit,
    p_user_id: user.id,
    p_world_id: body.worldId ?? null,
    p_classification: body.classification ?? null,
  });

  if (error) {
    console.error('[studio/search] rpc error:', error);
    if (error.code === '42883' || error.code === '42P01') {
      return err('Search schema not yet migrated. Run: supabase db push', 503);
    }
    return err(`Search error: ${error.message}`, 500);
  }

  // Build snippets — first 280 chars of content
  const results = (data ?? []).map((row: { markdown_content?: string | null } & Record<string, unknown>) => {
    const content = typeof row.markdown_content === 'string' ? row.markdown_content : '';
    return {
      ...row,
      snippet: content.slice(0, 280).replace(/\s+/g, ' ').trim(),
      markdown_content: undefined, // don't ship full content in search response
    };
  });

  return NextResponse.json({
    query,
    count: results.length,
    results,
  });
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    methods: ['POST'],
    requires_auth: true,
    requires_env: ['OPENAI_API_KEY'],
    rpc: 'match_ingested_documents',
  });
}
