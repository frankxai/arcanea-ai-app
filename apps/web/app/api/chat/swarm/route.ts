/**
 * POST /api/chat/swarm
 *
 * Streaming swarm endpoint. Given a creator request, plan the Luminors that
 * should respond, stream each one in parallel, then stream a Lumina
 * synthesis pass. All events flow as SSE (`text/event-stream`).
 *
 * Event protocol (newline-delimited JSON payloads inside `data: ...\n\n`):
 *
 *   { type: 'plan', mode, luminors: [{id, name, reason}], rationale, source, planMs }
 *   { type: 'luminor_start', id, name, guardian }
 *   { type: 'luminor_token', id, delta }
 *   { type: 'luminor_tool', id, toolName, input }
 *   { type: 'luminor_tool_result', id, toolName, output }
 *   { type: 'luminor_done', id, durationMs, tokensIn, tokensOut }
 *   { type: 'synthesis_start' }
 *   { type: 'synthesis_token', delta }
 *   { type: 'done', totalMs, totalTokens, traceId? }
 *   { type: 'error', message, scope?: 'planner'|'luminor'|'synthesis'|'route', luminorId? }
 *
 * Feature flag: ARCANEA_SWARM_MODE env must NOT equal 'disabled'.
 * Gate further via ?swarm=1 or body.force=true during rollout.
 *
 * Reference: Luminor Kernel Spec v1.0 §7 (Swarm Protocol)
 */

import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { LUMINORS } from '@/lib/luminors/config';
import { planSwarm, type SwarmPlan } from '@/lib/ai/planner';
import { LUMINOR_HINTS } from '@/lib/ai/guardian-swarm';
import { buildLuminorTools } from '@/lib/luminors/tools';
import type { SupabaseClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SwarmRequest {
  input: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxLuminors?: number;
  /** Skip feature-flag gate (for internal testing). */
  force?: boolean;
  /** Disable the LLM planner, use only keyword heuristics. */
  heuristicOnly?: boolean;
}

type SwarmEvent =
  | { type: 'plan'; plan: SwarmPlan }
  | { type: 'luminor_start'; id: string; name: string; guardian: string; avatar?: string }
  | { type: 'luminor_token'; id: string; delta: string }
  | { type: 'luminor_tool'; id: string; toolName: string; input: unknown }
  | { type: 'luminor_tool_result'; id: string; toolName: string; output: unknown }
  | {
      type: 'luminor_done';
      id: string;
      durationMs: number;
      tokensIn: number;
      tokensOut: number;
      text: string;
    }
  | { type: 'synthesis_start' }
  | { type: 'synthesis_token'; delta: string }
  | { type: 'done'; totalMs: number; totalTokens: number; traceId?: string }
  | { type: 'error'; message: string; scope?: string; luminorId?: string };

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const started = Date.now();

  // Feature flag
  const flag = (process.env.ARCANEA_SWARM_MODE ?? 'enabled').toLowerCase();
  const url = new URL(req.url);
  const forceByQuery = url.searchParams.get('swarm') === '1';

  let body: SwarmRequest;
  try {
    body = (await req.json()) as SwarmRequest;
  } catch {
    return plainError('Invalid JSON body', 400);
  }

  if (flag === 'disabled' && !forceByQuery && !body.force) {
    return plainError('Swarm mode is disabled. Set ARCANEA_SWARM_MODE=enabled.', 503);
  }

  const input = body.input?.trim();
  if (!input || input.length < 2) {
    return plainError('input must be at least 2 characters', 400);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return plainError('ANTHROPIC_API_KEY not configured', 503);
  }
  const anthropic = createAnthropic({ apiKey });

  // Optional Supabase context for tools
  const { supabaseClient, userId } = await resolveSupabase(req);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const emit = (event: SwarmEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        // 1. Plan the swarm (Haiku)
        const plan = await planSwarm({
          input,
          history: body.history,
          maxLuminors: body.maxLuminors,
          heuristicOnly: body.heuristicOnly,
        });
        emit({ type: 'plan', plan });

        // 2. Execute each Luminor in parallel
        let totalTokens = 0;
        interface RecordedContribution {
          id: string;
          name: string;
          guardian: string;
          text: string;
          toolCalls: Array<{ toolName: string; input: unknown; output?: unknown }>;
          tokensIn: number;
          tokensOut: number;
          durationMs: number;
          error?: string;
        }
        const contributions: RecordedContribution[] = [];
        let synthesisText = '';

        await Promise.all(
          plan.luminors.map(async (luminor) => {
            const config = LUMINORS[luminor.id];
            if (!config) {
              emit({
                type: 'error',
                message: `Unknown Luminor: ${luminor.id}`,
                scope: 'luminor',
                luminorId: luminor.id,
              });
              return;
            }

            const guardian = LUMINOR_HINTS[luminor.id]?.team ?? 'unknown';
            emit({
              type: 'luminor_start',
              id: luminor.id,
              name: config.name,
              guardian,
              avatar: config.avatar,
            });

            const luminorStarted = Date.now();
            try {
              const tools = buildLuminorTools({
                luminorId: luminor.id,
                domain: LUMINOR_HINTS[luminor.id]?.team ?? 'custom',
                userId: userId ?? null,
                authenticated: Boolean(userId),
                supabaseClient: supabaseClient ?? null,
                // Swarm members get a tighter toolset — no handoff inside a swarm,
                // no image gen (lumina synthesizes), no deep_research (too slow).
                include: ['search_vault', 'save_to_vault', 'memory_store', 'web_search'],
              });

              const swarmSystemPrompt = `${config.systemPrompt}

## Swarm Context
You are one of ${plan.luminors.length} Luminors responding to the same creator request. Stay in your specialty. Do NOT try to cover every angle — other Luminors will. Be concise (150-300 words), specific, and add only what uniquely comes from you.

## Your Role in This Swarm
${luminor.reason}`;

              const result = streamText({
                model: anthropic('claude-haiku-4-5-20251001'),
                system: swarmSystemPrompt,
                prompt: input,
                temperature: 0.7,
                maxOutputTokens: 1200,
                ...(Object.keys(tools).length > 0 ? { tools, maxSteps: 3 } : {}),
              });

              let fullText = '';
              let tokensIn = 0;
              let tokensOut = 0;
              const toolCalls: Array<{ toolName: string; input: unknown; output?: unknown }> = [];

              for await (const chunk of result.fullStream) {
                if (chunk.type === 'text-delta') {
                  const delta = (chunk as { text?: string }).text ?? '';
                  if (delta) {
                    fullText += delta;
                    emit({ type: 'luminor_token', id: luminor.id, delta });
                  }
                } else if (chunk.type === 'tool-call') {
                  const toolName = (chunk as { toolName: string }).toolName;
                  const toolInput = (chunk as { input?: unknown }).input;
                  toolCalls.push({ toolName, input: toolInput });
                  emit({
                    type: 'luminor_tool',
                    id: luminor.id,
                    toolName,
                    input: toolInput,
                  });
                } else if (chunk.type === 'tool-result') {
                  const toolName = (chunk as { toolName: string }).toolName;
                  const toolOutput = (chunk as { output?: unknown }).output;
                  const open = toolCalls.findIndex(
                    (t) => t.toolName === toolName && t.output === undefined,
                  );
                  if (open >= 0) toolCalls[open].output = toolOutput;
                  emit({
                    type: 'luminor_tool_result',
                    id: luminor.id,
                    toolName,
                    output: toolOutput,
                  });
                } else if (chunk.type === 'finish') {
                  const usage = (chunk as { totalUsage?: { inputTokens?: number; outputTokens?: number } }).totalUsage;
                  tokensIn = usage?.inputTokens ?? 0;
                  tokensOut = usage?.outputTokens ?? 0;
                } else if (chunk.type === 'error') {
                  const msg = (chunk as { error?: unknown }).error;
                  emit({
                    type: 'error',
                    message: msg instanceof Error ? msg.message : String(msg ?? 'Luminor stream error'),
                    scope: 'luminor',
                    luminorId: luminor.id,
                  });
                }
              }

              totalTokens += tokensIn + tokensOut;
              const durationMs = Date.now() - luminorStarted;
              contributions.push({
                id: luminor.id,
                name: config.name,
                guardian,
                text: fullText,
                toolCalls,
                tokensIn,
                tokensOut,
                durationMs,
              });

              emit({
                type: 'luminor_done',
                id: luminor.id,
                durationMs,
                tokensIn,
                tokensOut,
                text: fullText,
              });
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Luminor failed';
              contributions.push({
                id: luminor.id,
                name: config.name,
                guardian,
                text: '',
                toolCalls: [],
                tokensIn: 0,
                tokensOut: 0,
                durationMs: Date.now() - luminorStarted,
                error: msg,
              });
              emit({
                type: 'error',
                message: msg,
                scope: 'luminor',
                luminorId: luminor.id,
              });
            }
          }),
        );

        // 3. Synthesis pass — skip when solo (no merging needed)
        const validContributions = contributions.filter((c) => c.text.trim().length > 0);

        if (plan.mode === 'swarm' && validContributions.length > 1) {
          emit({ type: 'synthesis_start' });

          try {
            const perspectives = validContributions
              .map((c) => `### ${c.name}\n${c.text}`)
              .join('\n\n---\n\n');

            const synthResult = streamText({
              model: anthropic('claude-sonnet-4-6'),
              temperature: 0.6,
              maxOutputTokens: 1500,
              system: `You are Lumina, meta-orchestrator of the Luminor swarm.

${validContributions.length} specialist Luminors just responded. Your job: synthesize their perspectives into ONE coherent answer that honors each voice while producing a unified response.

Rules:
- Attribute key insights when relevant ("[Storyteller] points out...")
- Resolve contradictions directly — don't paper over them
- Surface the deeper pattern across all contributions
- Close with one specific next step
- Voice: warm authority, confident, brief (300-500 words)
- Do NOT restate what each Luminor said verbatim — integrate.`,
              prompt: `The creator asked:
"${input}"

The swarm responded:

${perspectives}

Synthesize.`,
            });

            for await (const chunk of synthResult.fullStream) {
              if (chunk.type === 'text-delta') {
                const delta = (chunk as { text?: string }).text ?? '';
                if (delta) {
                  synthesisText += delta;
                  emit({ type: 'synthesis_token', delta });
                }
              } else if (chunk.type === 'finish') {
                const usage = (chunk as { totalUsage?: { inputTokens?: number; outputTokens?: number } }).totalUsage;
                totalTokens += (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0);
              } else if (chunk.type === 'error') {
                const msg = (chunk as { error?: unknown }).error;
                emit({
                  type: 'error',
                  message: msg instanceof Error ? msg.message : String(msg ?? 'Synthesis error'),
                  scope: 'synthesis',
                });
              }
            }
          } catch (err) {
            emit({
              type: 'error',
              message: err instanceof Error ? err.message : 'Synthesis failed',
              scope: 'synthesis',
            });
          }
        }

        const totalMs = Date.now() - started;

        // 4. Persist the trace (async; never blocks the response close)
        let traceId: string | undefined;
        try {
          traceId = await persistTrace({
            supabaseClient,
            userId,
            input,
            plan,
            contributions,
            synthesis: synthesisText || validContributions[0]?.text || '',
            totalMs,
            totalTokens,
          });
        } catch (err) {
          console.warn('[swarm] trace persist failed:', (err as Error).message);
        }

        emit({ type: 'done', totalMs, totalTokens, traceId });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Route error';
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ type: 'error', message, scope: 'route' })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      'X-Arcanea-Swarm': 'v1',
    },
  });
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

export async function GET() {
  const flag = (process.env.ARCANEA_SWARM_MODE ?? 'enabled').toLowerCase();
  return Response.json({
    status: flag === 'disabled' ? 'disabled' : 'ok',
    mode: flag,
    maxDuration,
    requires_env: ['ANTHROPIC_API_KEY'],
    optional_env: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    version: 'swarm-v1',
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function plainError(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

interface PersistTraceArgs {
  supabaseClient: SupabaseClient | null;
  userId: string | null;
  input: string;
  plan: SwarmPlan;
  contributions: Array<{
    id: string;
    name: string;
    guardian: string;
    text: string;
    toolCalls: Array<{ toolName: string; input: unknown; output?: unknown }>;
    tokensIn: number;
    tokensOut: number;
    durationMs: number;
    error?: string;
  }>;
  synthesis: string;
  totalMs: number;
  totalTokens: number;
}

async function persistTrace(args: PersistTraceArgs): Promise<string | undefined> {
  const { supabaseClient, userId, input, plan, contributions, synthesis, totalMs, totalTokens } =
    args;

  // Anonymous traces go through the service-role client when available
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let client: SupabaseClient | null = null;
  if (userId && supabaseClient) {
    client = supabaseClient;
  } else if (url && serviceKey) {
    const { createClient } = await import('@supabase/supabase-js');
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } else {
    return undefined;
  }

  const { data, error } = await client
    .from('chat_traces')
    .insert({
      user_id: userId ?? null,
      mode: plan.mode,
      planner_source: plan.source,
      plan_ms: plan.planMs,
      total_ms: totalMs,
      total_tokens: totalTokens,
      input,
      plan_luminors: plan.luminors,
      rationale: plan.rationale,
      contributions,
      synthesis,
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '42P01') {
      console.warn('[swarm] chat_traces table not migrated');
    } else {
      console.warn('[swarm] trace insert error:', error.message);
    }
    return undefined;
  }

  return (data as { id: string } | null)?.id;
}

async function resolveSupabase(req: NextRequest): Promise<{
  supabaseClient: SupabaseClient | null;
  userId: string | null;
}> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return { supabaseClient: null, userId: null };

    const cookieHeader = req.headers.get('cookie') ?? '';
    const accessToken = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('sb-') && c.includes('-auth-token'))
      ?.split('=')
      .slice(1)
      .join('=');

    if (!accessToken) return { supabaseClient: null, userId: null };

    let jwt = accessToken;
    try {
      const decoded = JSON.parse(decodeURIComponent(accessToken));
      if (decoded?.access_token) jwt = decoded.access_token;
      else if (Array.isArray(decoded) && decoded[0]?.access_token) jwt = decoded[0].access_token;
    } catch {
      // raw JWT — use as-is
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data } = await supabase.auth.getUser();
    return { supabaseClient: supabase as SupabaseClient, userId: data?.user?.id ?? null };
  } catch {
    return { supabaseClient: null, userId: null };
  }
}
