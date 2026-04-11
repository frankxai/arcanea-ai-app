/**
 * ReasoningBank Runtime Helpers
 *
 * Implements Luminor Kernel Spec v1.0 §6 (Learning Protocol).
 *
 * The loop:
 *   1. RETRIEVE — before response, fetch relevant memory items via vector search
 *   2. RESPOND — generate with memory context injected (handled by executor)
 *   3. JUDGE — self-evaluate (optional; uses a judge model)
 *   4. DISTILL — extract principle from wins AND failures
 *   5. CONSOLIDATE — upsert into memory blocks via vector store
 *
 * Design:
 *   - Memory items are per (luminor, user), with optional shared wisdom (user_id NULL)
 *   - Each item is a distilled principle (max ~200 words)
 *   - Both wins AND failures contribute — failures often carry more signal
 *   - Distillation is async and fire-and-forget (non-blocking)
 */

// Edge-compatible: uses dynamic imports internally so this module can be
// imported from both node and edge runtimes without pulling in supabase at
// module-load time.
import type { SupabaseClient } from '@supabase/supabase-js';

export interface MemoryItem {
  id: string;
  content: string;
  source: 'win' | 'failure' | 'neutral';
  relevance_score: number;
  similarity: number;
}

export interface DistillInput {
  luminorId: string;
  userId?: string | null;
  userInput: string;
  agentOutput: string;
  model?: string;
}

// ─── RETRIEVE ─────────────────────────────────────────────────────────────

/**
 * Fetch the top-K most relevant memory items for a (luminor, user, query) tuple.
 * Includes shared wisdom (user_id IS NULL) + user-specific memories.
 * Returns empty array on any failure — memory retrieval must never block execution.
 */
export async function retrieveMemoryItems(params: {
  luminorId: string;
  userId?: string | null;
  queryText: string;
  topK?: number;
  threshold?: number;
}): Promise<MemoryItem[]> {
  try {
    const supabase = await getAdminClient();
    if (!supabase) return [];

    const { embedAgent, toPgVector } = await import('@/lib/embeddings/generate');

    // Generate query embedding
    const queryEmbedding = await embedAgent({
      id: 'query',
      name: 'query',
      description: params.queryText,
    });

    const { data, error } = await supabase.rpc('match_memory_items', {
      p_luminor_id: params.luminorId,
      p_user_id: params.userId ?? null,
      query_embedding: toPgVector(queryEmbedding),
      match_threshold: params.threshold ?? 0.6,
      match_count: params.topK ?? 5,
    });

    if (error || !data) return [];
    return data as MemoryItem[];
  } catch (err) {
    console.error('[reasoning-bank] retrieve failed:', err);
    return [];
  }
}

// ─── JUDGE + DISTILL ──────────────────────────────────────────────────────

/**
 * Use a judge model to evaluate a (input, output) pair and extract a
 * distilled principle. Returns null if the exchange wasn't notable enough
 * to remember (signal-to-noise filter).
 *
 * The principle can be a WIN (something that worked well and should be
 * remembered) or a FAILURE (something that went wrong and should be avoided).
 */
export async function distillPrinciple(
  input: DistillInput
): Promise<{ content: string; source: 'win' | 'failure' | 'neutral' } | null> {
  try {
    const { generateText } = await import('ai');
    const { anthropic } = await import('@ai-sdk/anthropic');
    const judgeModel = anthropic('claude-haiku-4-5-20251001'); // cheap, fast judge

    const { text } = await generateText({
      model: judgeModel,
      system: `You are a memory distillation agent for a Luminor's ReasoningBank.

Your job: read a (user input, agent response) exchange and extract ONE short, actionable principle that the agent should remember for future similar situations. The principle should be:
- 1-3 sentences, max 150 words
- Actionable (something the agent should DO or AVOID)
- Generalizable (applies to similar situations, not just this exact one)
- Honest (distinguish wins from failures)

Classify the exchange as one of:
- "win" — the agent response was strong and this pattern should be repeated
- "failure" — the agent response missed something and this mistake should be avoided
- "skip" — routine exchange, nothing worth remembering

Respond in this exact JSON format:
{"classification": "win" | "failure" | "skip", "principle": "..."}

Be strict. Most exchanges are "skip". Only distill genuine signal.`,
      prompt: `User input:
${input.userInput.slice(0, 2000)}

Agent response:
${input.agentOutput.slice(0, 2000)}

Distill the principle:`,
      temperature: 0.3,
    });

    // Parse the judge output
    const match = text.match(/\{[\s\S]*?\}/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]) as {
      classification: string;
      principle: string;
    };

    if (parsed.classification === 'skip') return null;
    if (!parsed.principle || parsed.principle.length < 10) return null;

    const source: 'win' | 'failure' | 'neutral' =
      parsed.classification === 'win'
        ? 'win'
        : parsed.classification === 'failure'
          ? 'failure'
          : 'neutral';

    return { content: parsed.principle.trim(), source };
  } catch (err) {
    console.error('[reasoning-bank] distill failed:', err);
    return null;
  }
}

// ─── CONSOLIDATE ──────────────────────────────────────────────────────────

/**
 * Store a distilled memory item in the vector store.
 * Non-blocking — failures are logged but don't propagate.
 */
export async function consolidateMemoryItem(params: {
  luminorId: string;
  userId?: string | null;
  content: string;
  source: 'win' | 'failure' | 'neutral';
}): Promise<string | null> {
  try {
    const supabase = await getAdminClient();
    if (!supabase) return null;

    const { embedAgent, toPgVector } = await import('@/lib/embeddings/generate');

    // Generate embedding for the distilled principle
    const embedding = await embedAgent({
      id: `memory-${Date.now()}`,
      name: 'memory-item',
      description: params.content,
    });

    const { data, error } = await supabase
      .from('luminor_memory_items')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({
        luminor_id: params.luminorId,
        user_id: params.userId ?? null,
        content: params.content,
        source: params.source,
        embedding: toPgVector(embedding),
        relevance_score: params.source === 'win' ? 0.7 : 0.8, // failures get slightly higher base
      } as any)
      .select('id')
      .single();

    if (error || !data) {
      console.error('[reasoning-bank] consolidate failed:', error?.message);
      return null;
    }
    return (data as { id: string }).id;
  } catch (err) {
    console.error('[reasoning-bank] consolidate error:', err);
    return null;
  }
}

// ─── Full loop (fire-and-forget) ──────────────────────────────────────────

/**
 * Run JUDGE + DISTILL + CONSOLIDATE as a fire-and-forget background task.
 * Called from the executor's onFinish hook. Never blocks the response.
 */
export async function learnFromExchange(input: DistillInput): Promise<void> {
  try {
    const principle = await distillPrinciple(input);
    if (!principle) return;

    await consolidateMemoryItem({
      luminorId: input.luminorId,
      userId: input.userId,
      content: principle.content,
      source: principle.source,
    });
  } catch (err) {
    console.error('[reasoning-bank] learn loop failed:', err);
  }
}

// ─── Memory Block (Letta-style persistent identity) ──────────────────────

/**
 * Load the persistent memory block for a (luminor, user) pair.
 * Returns empty string if no block exists yet.
 */
export async function loadMemoryBlock(
  luminorId: string,
  userId: string
): Promise<string> {
  try {
    const supabase = await getAdminClient();
    if (!supabase) return '';

    const { data } = await supabase
      .from('luminor_memory_blocks')
      .select('content')
      .eq('luminor_id', luminorId)
      .eq('user_id', userId)
      .maybeSingle();

    return (data as { content?: string } | null)?.content ?? '';
  } catch {
    return '';
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

let cachedAdmin: SupabaseClient | null = null;

async function getAdminClient(): Promise<SupabaseClient | null> {
  if (cachedAdmin) return cachedAdmin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const { createClient } = await import('@supabase/supabase-js');
  cachedAdmin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAdmin;
}

/**
 * Format retrieved memory items as a system prompt injection block.
 * Used by the executor to inject relevant memory into the Luminor's context.
 */
export function formatMemoryItemsForPrompt(items: MemoryItem[]): string {
  if (items.length === 0) return '';

  const lines = items.map((item) => {
    const marker = item.source === 'win' ? '✓' : item.source === 'failure' ? '✗' : '·';
    return `${marker} ${item.content}`;
  });

  return `\n## Relevant Learned Principles
${lines.join('\n')}
`;
}
