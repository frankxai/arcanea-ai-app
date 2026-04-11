/**
 * POST /api/internal/embed-agent
 *
 * Generates and stores the 1536-dim embedding for a marketplace agent.
 *
 * Triggered by:
 *   1. Supabase Database Webhook on marketplace_agents INSERT/UPDATE
 *   2. Manual call from backfill script
 *   3. Publish workflow in the Forge
 *
 * Request:
 *   { agentId: string, force?: boolean }
 *
 * Auth:
 *   x-arcanea-internal-key header matching ARCANEA_INTERNAL_API_KEY env var.
 *
 * Response:
 *   200 { agentId, embedded: true, text_length, dims }
 *   304 { agentId, skipped: 'already embedded' }
 *   404 { error: 'agent not found' }
 *
 * Reference: Luminor Kernel Spec v1.0, Registry Protocol migration
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { embedAgent, buildEmbeddingText, toPgVector } from '@/lib/embeddings/generate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface EmbedRequest {
  agentId: string;
  force?: boolean;
}

export async function POST(request: Request) {
  // 1. Auth check — internal key required
  const internalKey = process.env.ARCANEA_INTERNAL_API_KEY;
  if (internalKey) {
    const providedKey = request.headers.get('x-arcanea-internal-key');
    if (providedKey !== internalKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // 2. Parse body
  let body: EmbedRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.agentId) {
    return NextResponse.json({ error: 'agentId required' }, { status: 400 });
  }

  // 3. Get Supabase admin client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Supabase admin credentials not configured' },
      { status: 503 }
    );
  }
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 4. Fetch the agent row
  const { data: agent, error: fetchError } = await supabase
    .from('marketplace_agents')
    .select('id, name, title, description, category, capabilities, tags, spec, embedding')
    .eq('id', body.agentId)
    .maybeSingle();

  if (fetchError || !agent) {
    return NextResponse.json(
      { error: `Agent "${body.agentId}" not found` },
      { status: 404 }
    );
  }

  // 5. Skip if already embedded and not forced
  if (agent.embedding && !body.force) {
    return NextResponse.json(
      { agentId: body.agentId, skipped: 'already embedded' },
      { status: 304 }
    );
  }

  // 6. Build embedding input
  const spec = (agent.spec as Record<string, unknown>) ?? {};
  const systemPrompt = typeof spec.systemPrompt === 'string' ? spec.systemPrompt : null;

  const embedInput = {
    id: agent.id as string,
    name: (agent.name as string) ?? body.agentId,
    title: agent.title as string | null,
    description: agent.description as string | null,
    category: agent.category as string | null,
    capabilities: agent.capabilities as string[] | null,
    tags: agent.tags as string[] | null,
    systemPrompt,
  };

  const text = buildEmbeddingText(embedInput);

  // 7. Generate embedding
  let embedding: number[];
  try {
    embedding = await embedAgent(embedInput);
  } catch (err) {
    console.error('[embed-agent] embedding failed:', err);
    return NextResponse.json(
      { error: 'Embedding generation failed', message: (err as Error).message },
      { status: 500 }
    );
  }

  // 8. Store as pgvector literal
  const vectorLiteral = toPgVector(embedding);
  const { error: updateError } = await supabase
    .from('marketplace_agents')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ embedding: vectorLiteral } as any)
    .eq('id', body.agentId);

  if (updateError) {
    console.error('[embed-agent] update failed:', updateError);
    return NextResponse.json(
      { error: 'Failed to store embedding', message: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    agentId: body.agentId,
    embedded: true,
    text_length: text.length,
    dims: embedding.length,
  });
}
