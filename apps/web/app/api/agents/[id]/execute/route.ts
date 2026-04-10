/**
 * Agent Execute — Stream a marketplace agent task
 *
 * POST /api/agents/:id/execute
 *   Body: { input: string, context?: Record<string, unknown> }
 *   Headers: Cookie (Supabase session — optional, anonymous allowed)
 *   Returns: Streaming text response (Vercel AI SDK format)
 *
 * Pipeline:
 *   1. Parse and validate request body
 *   2. Resolve user session (optional — anonymous gets limited credits)
 *   3. Look up agent spec in catalog (falls back to marketplace_agents table)
 *   4. Check credit balance if authenticated
 *   5. Build system prompt from agent spec + optional user context
 *   6. Resolve model using the same gateway pattern as /api/ai/chat
 *   7. Stream response via Vercel AI SDK streamText
 *   8. Deduct credits on stream completion (best-effort, non-blocking)
 *
 * Uses Edge runtime for low-latency streaming.
 */

import { NextRequest } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { CATALOG_BY_ID } from '@/lib/agents/marketplace/catalog';
import { GATEWAY_MODELS, EXTENDED_PROVIDERS } from '@/lib/gateway/catalog';
import { LUMINORS } from '@/lib/luminors/config';

export const runtime = 'edge';

// ---------------------------------------------------------------------------
// Provider config — mirrors /api/ai/chat/route.ts
// ---------------------------------------------------------------------------

interface ProviderConfig {
  envKeys: string[];
  defaultModel: string;
}

const PROVIDERS: Record<string, ProviderConfig> = {
  google: {
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GEMINI_API_KEY'],
    defaultModel: 'gemini-2.0-flash',
  },
  anthropic: {
    envKeys: ['ANTHROPIC_API_KEY'],
    defaultModel: 'claude-haiku-4-5-20251001',
  },
  openai: {
    envKeys: ['OPENAI_API_KEY'],
    defaultModel: 'gpt-4o-mini',
  },
  openrouter: {
    envKeys: ['OPENROUTER_API_KEY'],
    defaultModel: 'google/gemini-2.5-flash',
  },
};

function resolveApiKey(config: ProviderConfig): string | undefined {
  for (const key of config.envKeys) {
    if (process.env[key]) return process.env[key];
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Model resolution — prefer cheap + capable for agent tasks
// Auto-routing priority: Gemini Flash > Haiku > Bolt > Lightning
// ---------------------------------------------------------------------------

const AGENT_AUTO_PRIORITY = [
  'arcanea-gemini-flash',
  'arcanea-haiku',
  'arcanea-bolt',
  'arcanea-lightning',
  'arcanea-deepseek',
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveModel(preferredGatewayId?: string): { model: any; label: string } | null {
  // Try preferred model first if specified
  const candidates = preferredGatewayId
    ? [preferredGatewayId, ...AGENT_AUTO_PRIORITY]
    : [...AGENT_AUTO_PRIORITY];

  for (const gwId of candidates) {
    const gw = GATEWAY_MODELS[gwId];
    if (!gw) continue;

    const stdProvider = PROVIDERS[gw.provider];
    const extProvider = EXTENDED_PROVIDERS[gw.provider];
    const envKeys = stdProvider ? stdProvider.envKeys : extProvider ? extProvider.envKeys : [];
    const apiKey = envKeys.map((k) => process.env[k]).find(Boolean);

    if (!apiKey) continue;

    if (gw.provider === 'google') {
      const google = createGoogleGenerativeAI({ apiKey });
      return { model: google(gw.modelId), label: gw.label };
    }
    if (gw.provider === 'anthropic') {
      const anthropic = createAnthropic({ apiKey });
      return { model: anthropic(gw.modelId), label: gw.label };
    }
    if (gw.provider === 'openai') {
      const openai = createOpenAI({ apiKey });
      return { model: openai(gw.modelId), label: gw.label };
    }
    if (extProvider) {
      const compat = createOpenAI({ apiKey, baseURL: extProvider.baseUrl });
      return { model: compat(gw.modelId), label: gw.label };
    }
  }

  // Final fallback: any configured legacy provider
  for (const [providerId, cfg] of Object.entries(PROVIDERS)) {
    const apiKey = resolveApiKey(cfg);
    if (!apiKey) continue;

    if (providerId === 'google') {
      const google = createGoogleGenerativeAI({ apiKey });
      return { model: google(cfg.defaultModel), label: `${providerId}/${cfg.defaultModel}` };
    }
    if (providerId === 'anthropic') {
      const anthropic = createAnthropic({ apiKey });
      return { model: anthropic(cfg.defaultModel), label: `${providerId}/${cfg.defaultModel}` };
    }
    if (providerId === 'openai') {
      const openai = createOpenAI({ apiKey });
      return { model: openai(cfg.defaultModel), label: `${providerId}/${cfg.defaultModel}` };
    }
    if (providerId === 'openrouter') {
      const openrouter = createOpenAI({ apiKey, baseURL: 'https://openrouter.ai/api/v1' });
      return { model: openrouter(cfg.defaultModel), label: `openrouter/${cfg.defaultModel}` };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Supabase session helper (edge-compatible — manual cookie parsing)
// ---------------------------------------------------------------------------

async function resolveSession(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return null;

    const cookieHeader = req.headers.get('cookie') ?? '';
    const accessToken = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('sb-') && c.includes('-auth-token'))
      ?.split('=')
      .slice(1)
      .join('=');

    if (!accessToken) return null;

    let jwt = accessToken;
    try {
      const decoded = JSON.parse(decodeURIComponent(accessToken));
      if (decoded?.access_token) jwt = decoded.access_token;
      else if (Array.isArray(decoded) && decoded[0]?.access_token) jwt = decoded[0].access_token;
    } catch {
      // Already a raw JWT
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data } = await supabase.auth.getUser();
    if (!data?.user) return null;

    return { supabase, userId: data.user.id, user: data.user };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Credit check
// ---------------------------------------------------------------------------

async function checkCredits(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  required: number,
): Promise<{ sufficient: boolean; balance: number }> {
  try {
    const { data } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (!data) {
      // No record yet — initialize with 100 free credits
      await supabase
        .from('credits')
        .insert({ user_id: userId, balance: 100 })
        .select()
        .single();
      return { sufficient: required <= 100, balance: 100 };
    }

    return { sufficient: data.balance >= required, balance: data.balance };
  } catch {
    // Non-fatal: allow execution if credits table is unavailable
    return { sufficient: true, balance: 0 };
  }
}

// ---------------------------------------------------------------------------
// Deduct credits (fire-and-forget after stream completes)
// ---------------------------------------------------------------------------

async function deductCredits(
  supabaseUrl: string,
  supabaseAnonKey: string,
  userId: string,
  agentId: string,
  amount: number,
  modelUsed: string,
): Promise<void> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    // Use service role key if available for elevated write access
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;
    const admin = createClient(supabaseUrl, serviceKey);

    // Try RPC first (atomic decrement); fall back to read-modify-write
    const rpcResult = await admin.rpc('decrement_credits', { p_user_id: userId, p_amount: amount });

    if (rpcResult.error) {
      // RPC not available yet — read current balance then deduct manually
      const { data: row } = await admin
        .from('credits')
        .select('balance')
        .eq('user_id', userId)
        .single();

      const currentBalance: number = (row?.balance ?? 0) as number;
      const newBalance = Math.max(0, currentBalance - amount);

      await admin
        .from('credits')
        .upsert(
          { user_id: userId, balance: newBalance, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        );
    }

    // Log the transaction
    await admin.from('credit_transactions').insert({
      user_id: userId,
      amount: -amount,
      type: 'consume',
      agent_id: agentId,
      description: `Agent task: ${agentId} (${modelUsed})`,
    });
  } catch {
    // Non-fatal: best-effort credit deduction
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestStarted = Date.now();
  try {
  const { id } = await params;

  // ── 1. Validate request body ─────────────────────────────────────────────
  let body: { input?: unknown; context?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON in request body', { status: 400 });
  }

  if (!body.input || typeof body.input !== 'string' || body.input.trim().length === 0) {
    return new Response('input is required and must be a non-empty string', { status: 400 });
  }

  const input = body.input.trim();
  const context = typeof body.context === 'object' && body.context !== null
    ? (body.context as Record<string, unknown>)
    : {};

  // ── 2. Resolve agent spec ────────────────────────────────────────────────
  // Resolution order: 12 Chosen Luminors → marketplace catalog → marketplace_agents table
  let agent = CATALOG_BY_ID[id] ?? null;

  // Check the 12 Chosen Luminors first (canonical, always free, always available)
  if (!agent) {
    const chosen = LUMINORS[id];
    if (chosen) {
      agent = {
        id: chosen.id,
        name: chosen.name,
        title: chosen.loreName,
        category: chosen.team,
        description: chosen.tagline,
        longDescription: chosen.description,
        priceCredits: 0, // Chosen Luminors are always free
        element: 'Spirit',
        gateAlignment: chosen.title, // e.g. "Gate of Structure"
        icon: chosen.avatar,
        color: chosen.color,
        gradient: chosen.gradient,
        capabilities: [],
        inputPlaceholder: '',
        examplePrompts: chosen.quickActions?.map((qa) => qa.prompt) ?? [],
        spec: {
          systemPrompt: chosen.systemPrompt,
          name: chosen.name,
          title: chosen.loreName,
          tagline: chosen.tagline,
          temperature: 0.7,
          origin: 'chosen',
        },
        rating: 5.0,
        usageCount: 0,
        isFeatured: true,
        creatorId: null, // Arcanea canonical, no creator royalty
      } as unknown as NonNullable<typeof agent>;
    }
  }

  if (!agent) {
    // Try Supabase marketplace_agents table
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data } = await supabase
          .from('marketplace_agents')
          .select('*')
          .eq('id', id)
          .eq('is_published', true)
          .single();
        if (data) {
          agent = {
            id: data.id,
            name: data.spec?.name ?? id,
            title: data.spec?.title ?? '',
            category: data.category,
            description: data.spec?.tagline ?? '',
            longDescription: '',
            priceCredits: data.price_credits ?? 10,
            element: data.spec?.element ?? 'Spirit',
            gateAlignment: (data.spec?.gateAlignment ?? [])[0] ?? 'Foundation',
            icon: data.spec?.avatar ?? '✨',
            color: '#7fffd4',
            gradient: 'from-teal-900/60 to-cyan-900/60',
            capabilities: [],
            inputPlaceholder: '',
            examplePrompts: [],
            spec: data.spec,
            rating: Number(data.rating) ?? 0,
            usageCount: data.usage_count ?? 0,
            isFeatured: data.is_featured ?? false,
            creatorId: data.creator_id ?? null,
          };
        }
      }
    } catch {
      // Non-fatal
    }
  }

  if (!agent) {
    return new Response('Agent not found', { status: 404 });
  }

  // ── 3. Resolve user session ──────────────────────────────────────────────
  const session = await resolveSession(req);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  // ── 4. Credit check (authenticated users only) ───────────────────────────
  if (session) {
    const { sufficient, balance } = await checkCredits(
      session.supabase,
      session.userId,
      agent.priceCredits,
    );

    if (!sufficient) {
      return new Response(
        JSON.stringify({
          error: 'Insufficient credits',
          required: agent.priceCredits,
          balance,
          message: 'Purchase more credits to run this agent.',
        }),
        {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }

  // ── 5. Build system prompt ───────────────────────────────────────────────
  const agentSystemPrompt = agent.spec?.systemPrompt ?? `You are ${agent.name}, ${agent.title}. ${agent.description}`;

  let systemPrompt = agentSystemPrompt;

  // Inject user context if available
  if (session?.userId) {
    const userName = (context.userName as string) ?? 'Creator';
    const userRank = (context.rank as string) ?? 'Apprentice';
    const userElement = (context.element as string) ?? null;

    const contextBlock = [
      '[CREATOR CONTEXT]',
      `Name: ${userName}`,
      `Rank: ${userRank}`,
      ...(userElement ? [`Element: ${userElement}`] : []),
      '[/CREATOR CONTEXT]',
      '',
    ].join('\n');

    systemPrompt = `${contextBlock}${systemPrompt}`;
  }

  // ── 6. Resolve model ─────────────────────────────────────────────────────
  const preferredGatewayId = agent.spec?.preferredModel ?? undefined;
  const resolved = resolveModel(preferredGatewayId);

  if (!resolved) {
    return new Response(
      'No AI provider configured. Set at least one provider API key (GOOGLE_GENERATIVE_AI_API_KEY, ANTHROPIC_API_KEY, etc.) in your environment.',
      { status: 503 },
    );
  }

  const { model, label } = resolved;
  const temperature = agent.spec?.temperature ?? 0.7;

  // ── 7. Stream response ───────────────────────────────────────────────────
  const result = streamText({
    model,
    system: systemPrompt,
    messages: [{ role: 'user', content: input }],
    temperature,
    maxOutputTokens: 4096,
    onFinish: ({ text }) => {
      // ── 8. Deduct credits after completion ──────────────────────────────
      if (session && supabaseUrl && supabaseAnonKey) {
        // Fire and forget — do not await
        deductCredits(
          supabaseUrl,
          supabaseAnonKey,
          session.userId,
          agent.id,
          agent.priceCredits,
          label,
        ).catch((err) => {
          console.error('[execute] deductCredits failed:', err);
        });
      }

      // Log task to agent_tasks table (best-effort)
      if (session && supabaseUrl && supabaseAnonKey) {
        void (async () => {
          try {
            const { createClient } = await import('@supabase/supabase-js');
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;
            const admin = createClient(supabaseUrl, serviceKey);
            await admin.from('agent_tasks').insert({
              user_id: session.userId,
              agent_id: agent.id,
              input,
              output: text,
              status: 'completed',
              credits_consumed: agent.priceCredits,
              model_used: label,
              completed_at: new Date().toISOString(),
            });
          } catch {
            // Non-fatal
          }
        })();
      }

      // Registry Protocol telemetry — usage_events + revenue_events
      // This is the feedback loop for the marketplace: every invocation
      // flows through here, regardless of whether it's a Chosen Luminor or
      // a user-forged marketplace agent. Non-blocking, best-effort.
      if (supabaseUrl && supabaseAnonKey) {
        void (async () => {
          try {
            const { createClient } = await import('@supabase/supabase-js');
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;
            const admin = createClient(supabaseUrl, serviceKey);

            // Approximate token count from text length (Vercel AI SDK edge
            // doesn't always surface usage; ~4 chars per token is a safe estimate)
            const estimatedTokens = Math.ceil((input.length + text.length) / 4);
            const durationMs = Date.now() - requestStarted;

            // 1. usage_events — every invocation
            await admin.from('usage_events').insert({
              agent_id: agent.id,
              platform_id: null, // native arcanea.ai invocation
              deployment_id: null,
              user_id: session?.userId ?? null,
              tokens_used: estimatedTokens,
              duration_ms: durationMs,
              credits_consumed: agent.priceCredits,
              metadata: {
                model: label,
                origin: agent.creatorId ? 'forged' : 'chosen',
                streaming: true,
              },
            });

            // 2. revenue_events — only for creator-forged agents with a price
            if (agent.creatorId && agent.priceCredits > 0) {
              // Compute split via SQL function for consistency
              const { data: split } = await admin.rpc('calculate_revenue_split', {
                p_gross: agent.priceCredits,
                p_platform_id: null,
              });
              const row = Array.isArray(split) ? split[0] : split;
              const platformFee: number = row?.platform_fee ?? 0;
              const creatorPayout: number = row?.creator_payout ?? 0;

              await admin.from('revenue_events').insert({
                agent_id: agent.id,
                creator_id: agent.creatorId,
                platform_id: null,
                deployment_id: null,
                gross_amount: agent.priceCredits,
                platform_fee: platformFee,
                creator_payout: creatorPayout,
                affiliate_id: null,
                affiliate_payout: 0,
                event_type: 'usage',
              });
            }
          } catch (err) {
            console.error('[execute] registry telemetry failed:', err);
          }
        })();
      }
    },
  });

  return result.toTextStreamResponse({
    headers: {
      'x-arcanea-agent': agent.id,
      'x-arcanea-model': label,
      'x-arcanea-credits': String(agent.priceCredits),
    },
  });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
