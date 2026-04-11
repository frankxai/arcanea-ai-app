#!/usr/bin/env tsx
/**
 * Backfill Agent Embeddings
 *
 * One-shot script that finds all marketplace_agents without embeddings
 * and generates them via the /api/internal/embed-agent endpoint (or directly
 * via @ai-sdk/openai if run locally with env vars present).
 *
 * Usage:
 *   npx tsx scripts/backfill-agent-embeddings.ts
 *   npx tsx scripts/backfill-agent-embeddings.ts --force   # re-embed all
 *   npx tsx scripts/backfill-agent-embeddings.ts --limit 100
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { embedAgents, toPgVector } from '../apps/web/lib/embeddings/generate.js';

const FORCE = process.argv.includes('--force');
const LIMIT_ARG = process.argv.indexOf('--limit');
const LIMIT = LIMIT_ARG !== -1 ? parseInt(process.argv[LIMIT_ARG + 1], 10) : 500;
const BATCH_SIZE = 20;

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY required');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Backfill mode: ${FORCE ? 'FORCE (re-embed all)' : 'skip already-embedded'}`);
  console.log(`Limit: ${LIMIT}, batch size: ${BATCH_SIZE}\n`);

  // 1. Fetch agents
  let query = supabase
    .from('marketplace_agents')
    .select('id, name, title, description, category, capabilities, tags, spec, embedding')
    .eq('is_published', true)
    .limit(LIMIT);

  if (!FORCE) {
    query = query.is('embedding', null);
  }

  const { data: agents, error } = await query;

  if (error) {
    console.error('Failed to fetch agents:', error.message);
    process.exit(1);
  }

  if (!agents || agents.length === 0) {
    console.log('No agents to embed. All caught up.');
    return;
  }

  console.log(`Found ${agents.length} agent(s) to embed\n`);

  let processed = 0;
  let failed = 0;

  // 2. Process in batches for efficiency
  for (let i = 0; i < agents.length; i += BATCH_SIZE) {
    const batch = agents.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(agents.length / BATCH_SIZE);

    console.log(`Batch ${batchNum}/${totalBatches} (${batch.length} agents)…`);

    try {
      const embedInputs = batch.map((a) => {
        const spec = (a.spec as Record<string, unknown>) ?? {};
        return {
          id: a.id as string,
          name: (a.name as string) ?? (a.id as string),
          title: a.title as string | null,
          description: a.description as string | null,
          category: a.category as string | null,
          capabilities: a.capabilities as string[] | null,
          tags: a.tags as string[] | null,
          systemPrompt: typeof spec.systemPrompt === 'string' ? spec.systemPrompt : null,
        };
      });

      const embeddings = await embedAgents(embedInputs);

      // 3. Update rows in parallel
      const updates = Array.from(embeddings.entries()).map(async ([agentId, vec]) => {
        const { error: updateError } = await supabase
          .from('marketplace_agents')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .update({ embedding: toPgVector(vec) } as any)
          .eq('id', agentId);
        if (updateError) {
          console.error(`  ✗ ${agentId}: ${updateError.message}`);
          failed++;
        } else {
          console.log(`  ✓ ${agentId} (${vec.length} dims)`);
          processed++;
        }
      });

      await Promise.all(updates);
    } catch (err) {
      console.error(`  Batch ${batchNum} failed:`, (err as Error).message);
      failed += batch.length;
    }

    // Small pause between batches to respect rate limits
    if (i + BATCH_SIZE < agents.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Processed: ${processed}, Failed: ${failed}, Total: ${agents.length}`);
  console.log('='.repeat(50));

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
