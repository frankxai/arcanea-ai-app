/**
 * Multi-Provider Chat API Route for Arcanea
 *
 * Streams AI responses using Vercel AI SDK.
 * Supports 17+ curated models via the Intelligence Gateway,
 * plus legacy provider fallback (Google, Anthropic, OpenAI, OpenRouter).
 * Server-side env vars take priority; client-provided keys are fallback.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { createArcanea } from '@/lib/ai/arcanea-intelligence';
import { GATEWAY_MODELS, EXTENDED_PROVIDERS } from '@/lib/gateway/catalog';
import { createChatTools } from '@/lib/chat/tools';
import { buildArcaneaRuntimeHeaders } from '@/lib/chat/runtime-metadata';
import {
  buildProjectRetrievalBlock,
  buildProjectRetrievalTraceMetadata,
  selectRelevantProjectContext,
} from '@/lib/projects/retrieval';
import {
  buildProjectProviderRoutingTraceMetadata,
  recordProjectTrace,
} from '@/lib/projects/trace';

export const runtime = 'edge';

// ---------------------------------------------------------------------------
// Library wisdom — curated passages keyed by Guardian gate
// Injected into system prompt when the MoE router activates a gate.
// These are hand-selected from the Library of Arcanea (/book/).
// ---------------------------------------------------------------------------

const GATE_WISDOM: Record<string, string> = {
  lyssandria: 'The foundation is not the flashiest part of a structure. It is the part that lets everything else be flashy. Build your roots before you reach for the sky.',
  leyla: 'Creation is water — it finds its own path if you stop forcing direction. The muse arrives when the hands are already moving.',
  draconia: 'Fire does not ask permission to transform. It acts. The difference between dreaming and making is one verb: start.',
  maylinn: 'Every creation worth making was born from something the creator cared about more than comfort. Follow the ache — it knows where the real work is.',
  alera: 'Speak what you see, not what they want to hear. The creator who names their shadow honestly has already begun to master it.',
  lyria: 'Intuition is pattern recognition running faster than language. Trust the image that arrives before the explanation.',
  aiyami: 'Mastery is not knowing everything. It is knowing which one thing matters right now and giving it your full attention.',
  elara: 'Perspective shifts are not gentle. They feel like losing your grip. But the view from the new angle is always worth the vertigo.',
  ino: 'No great work was made alone. Even the solitary creator stands on the shoulders of every book they read, every conversation that changed their mind.',
  shinkami: 'The source of all creation is the willingness to be incomplete. Perfection is a wall. Imperfection that creates endlessly is indistinguishable from God.',
};

// ---------------------------------------------------------------------------
// Provider configuration (legacy — used when no Gateway model specified)
// ---------------------------------------------------------------------------

interface ProviderConfig {
  envKeys: string[];
  defaultModel: string;
  label: string;
}

const PROVIDERS: Record<string, ProviderConfig> = {
  openrouter: {
    envKeys: ['OPENROUTER_API_KEY'],
    defaultModel: 'google/gemini-2.5-flash',
    label: 'Gemini 2.5 Flash (OpenRouter)',
  },
  google: {
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GEMINI_API_KEY'],
    defaultModel: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
  },
  anthropic: {
    envKeys: ['ANTHROPIC_API_KEY'],
    defaultModel: 'claude-sonnet-4-20250514',
    label: 'Claude Sonnet 4',
  },
  openai: {
    envKeys: ['OPENAI_API_KEY'],
    defaultModel: 'gpt-4o',
    label: 'GPT-4o',
  },
};

// Rate limiting — in-memory for MVP, upgrade to Redis/Vercel KV for scale
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

const CHAT_RATE_LIMIT = { maxRequests: 30, windowMs: 60_000 }; // 30 req/min

interface ChatMessage {
  role: 'user' | 'assistant' | 'model' | 'system';
  content?: string;
  parts?: Array<Record<string, unknown> & { type: string; text?: string }>;
}

interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  /** Provider ID: 'openrouter' | 'google' | 'anthropic' | 'openai' */
  provider?: string;
  /** OpenRouter model ID override (e.g. 'anthropic/claude-sonnet-4') */
  model?: string;
  /** Gateway model ID (e.g. 'arcanea-opus', 'arcanea-auto') */
  gatewayModel?: string;
  /** Focus mode hint — injected into system prompt to guide the MoE router */
  focusHint?: string;
  /** Client-side API key (fallback when no server env var is set) */
  clientApiKey?: string;
  /** Enabled tool categories (e.g. ['image']) — omit for pure text chat */
  enabledTools?: string[];
  /** BYOK search API key (Tavily/Brave — from client localStorage) */
  searchApiKey?: string;
  /** Active project/workspace context from the canonical chat shell */
  projectContext?: {
    id: string;
    title: string;
    description?: string;
    goal?: string;
  };
}

function extractMessageText(message: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}): string {
  if (Array.isArray(message.parts)) {
    const text = message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text ?? '')
      .join('');

    if (text) return text;
  }

  return typeof message.content === 'string' ? message.content : '';
}

/**
 * Resolve API key: server env var takes priority, then client-provided key.
 */
function resolveApiKey(providerConfig: ProviderConfig, clientKey?: string): string | undefined {
  for (const envKey of providerConfig.envKeys) {
    if (process.env[envKey]) return process.env[envKey];
  }
  return clientKey || undefined;
}

/**
 * Create the AI model instance for the requested provider.
 */
function createModel(providerId: string, apiKey: string, modelOverride?: string) {
  const config = PROVIDERS[providerId];
  if (!config) throw new Error(`Unknown provider: ${providerId}`);
  const modelId = modelOverride || config.defaultModel;

  switch (providerId) {
    case 'openrouter': {
      const openrouter = createOpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
      });
      return { model: openrouter(modelId), label: modelId };
    }
    case 'google': {
      const google = createGoogleGenerativeAI({ apiKey });
      return { model: google(modelId), label: config.label };
    }
    case 'anthropic': {
      const anthropic = createAnthropic({ apiKey });
      return { model: anthropic(modelId), label: config.label };
    }
    case 'openai': {
      const openai = createOpenAI({ apiKey });
      return { model: openai(modelId), label: config.label };
    }
    default:
      throw new Error(`Unsupported provider: ${providerId}`);
  }
}

export async function POST(req: NextRequest) {
  // --- Rate limiting ---
  const clientId = getClientIdentifier(req);
  const rl = checkRateLimit(clientId, CHAT_RATE_LIMIT);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please slow down.', retryAfter: Math.ceil((rl.resetTime - Date.now()) / 1000) }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(CHAT_RATE_LIMIT.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rl.resetTime).toISOString(),
          'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)),
        },
      },
    );
  }

  try {
    // --- Parse request ---
    const body: ChatRequest = await req.json();
    const { messages, systemPrompt, temperature, maxTokens, provider: requestedProvider, model: modelOverride, gatewayModel, focusHint, clientApiKey, enabledTools, searchApiKey, projectContext } = body;

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400, headers: { 'Content-Type': 'text/plain' } });
    }

    // --- Resolve model/provider ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let model: any;
    let label: string;

    // Gateway model path: arcanea-* model IDs
    let resolvedGateway = gatewayModel && gatewayModel !== 'arcanea-auto' ? GATEWAY_MODELS[gatewayModel] : null;
    let resolvedProviderId: string | null = null;
    let providerRouteMode: 'gateway' | 'legacy' | 'auto-detected' = 'legacy';
    let providerApiKeySource: 'server-env' | 'client-byok' | 'unknown' = 'unknown';

    // Smart auto-routing: find the best available model when 'arcanea-auto' is selected
    if (!resolvedGateway && (!gatewayModel || gatewayModel === 'arcanea-auto')) {
      const AUTO_PRIORITY = [
        'arcanea-gemini-flash', 'arcanea-sonnet', 'arcanea-gpt5',
        'arcanea-deepseek', 'arcanea-grok', 'arcanea-haiku',
        'arcanea-bolt', 'arcanea-lightning',
      ];
      for (const gwId of AUTO_PRIORITY) {
        const gw = GATEWAY_MODELS[gwId];
        if (!gw) continue;
        const p = PROVIDERS[gw.provider] || null;
        const ext = EXTENDED_PROVIDERS[gw.provider] || null;
        const envKeys = p ? p.envKeys : ext ? ext.envKeys : [];
        const hasServerKey = envKeys.some((k: string) => Boolean(process.env[k]));
        if (hasServerKey || clientApiKey) {
          resolvedGateway = gw;
          break;
        }
      }
    }

    if (resolvedGateway) {
      // Gateway mode: resolve the model from our curated catalog
      const gwProvider = resolvedGateway.provider;
      let gwApiKey: string | undefined;
      let gwApiKeySource: 'server-env' | 'client-byok' | 'unknown' = 'unknown';

      // Try server-side env vars first
      if (PROVIDERS[gwProvider]) {
        gwApiKey = resolveApiKey(PROVIDERS[gwProvider], clientApiKey);
        gwApiKeySource = PROVIDERS[gwProvider].envKeys.some((envKey) => Boolean(process.env[envKey]))
          ? 'server-env'
          : clientApiKey
            ? 'client-byok'
            : 'unknown';
      } else if (EXTENDED_PROVIDERS[gwProvider]) {
        const ext = EXTENDED_PROVIDERS[gwProvider];
        for (const envKey of ext.envKeys) {
          if (process.env[envKey]) {
            gwApiKey = process.env[envKey];
            gwApiKeySource = 'server-env';
            break;
          }
        }
        if (!gwApiKey && clientApiKey) {
          gwApiKey = clientApiKey;
          gwApiKeySource = 'client-byok';
        }
      }

      if (!gwApiKey) {
        return new Response(
          `No API key for ${gwProvider}. Set the key on Vercel or in Settings → Providers.`,
          { status: 503, headers: { 'Content-Type': 'text/plain' } }
        );
      }

      // Create the model instance
      if (gwProvider === 'google') {
        const google = createGoogleGenerativeAI({ apiKey: gwApiKey });
        model = google(resolvedGateway.modelId);
      } else if (gwProvider === 'anthropic') {
        const anthropic = createAnthropic({ apiKey: gwApiKey });
        model = anthropic(resolvedGateway.modelId);
      } else if (gwProvider === 'openai') {
        const openai = createOpenAI({ apiKey: gwApiKey });
        model = openai(resolvedGateway.modelId);
      } else if (EXTENDED_PROVIDERS[gwProvider]) {
        // xAI, DeepSeek, Moonshot, Cerebras, Groq, Mistral — all OpenAI-compatible
        const ext = EXTENDED_PROVIDERS[gwProvider];
        const openaiCompat = createOpenAI({ apiKey: gwApiKey, baseURL: ext.baseUrl });
        model = openaiCompat(resolvedGateway.modelId);
      } else {
        return new Response(
          `Unsupported gateway provider: ${gwProvider}`,
          { status: 400, headers: { 'Content-Type': 'text/plain' } }
        );
      }

      label = resolvedGateway.label;
      resolvedProviderId = gwProvider;
      providerRouteMode = 'gateway';
      providerApiKeySource = gwApiKeySource;
    } else {
      // Legacy provider path
      let providerId: string;
      let providerDetectedAutomatically = false;
      if (requestedProvider && PROVIDERS[requestedProvider]) {
        providerId = requestedProvider;
      } else {
        const detected = Object.keys(PROVIDERS).find((id) => {
          const cfg = PROVIDERS[id];
          return cfg.envKeys.some((k) => Boolean(process.env[k]));
        });
        providerId = detected || 'openrouter';
        providerDetectedAutomatically = true;
      }
      const providerConfig = PROVIDERS[providerId];

      const apiKey = resolveApiKey(providerConfig, clientApiKey);
      if (!apiKey) {
        return new Response(
          `No API key configured. Set ${providerConfig.envKeys[0]} on Vercel or add a key in Settings → Providers.`,
          { status: 503, headers: { 'Content-Type': 'text/plain' } }
        );
      }

      const created = createModel(providerId, apiKey, modelOverride);
      model = created.model;
      label = created.label;
      resolvedProviderId = providerId;
      providerRouteMode = providerDetectedAutomatically ? 'auto-detected' : 'legacy';
      providerApiKeySource = providerConfig.envKeys.some((envKey) => Boolean(process.env[envKey]))
        ? 'server-env'
        : clientApiKey
          ? 'client-byok'
          : 'unknown';
    }

    const normalizedMessages = messages.map((msg) => ({
      role: (msg.role === 'model' ? 'assistant' : msg.role) as 'user' | 'assistant',
      content: extractMessageText(msg),
    }));

    const uiMessages = messages.map((msg) => ({
      role: (msg.role === 'model' ? 'assistant' : msg.role) as 'user' | 'assistant' | 'system',
      parts: msg.parts ?? (msg.content ? [{ type: 'text' as const, text: msg.content }] : []),
    }));

    const modelMessages = await convertToModelMessages(
      uiMessages as Array<Omit<UIMessage, 'id'>>,
    );

    // --- MoE Router: classify intent and blend expert fragments ---
    // If a specific systemPrompt is provided (e.g., from /chat/[luminorId]),
    // use it directly. Otherwise, run the Arcanea intelligence router.
    let resolvedSystemPrompt: string;
    let activeGates: string[] = [];
    let coordinationMode = '';
    let leadGuardian: string | null = '';
    let activeLuminorIds: string[] = [];

    if (systemPrompt) {
      // Direct companion prompt (legacy /chat/[luminorId] pages)
      resolvedSystemPrompt = systemPrompt;
    } else {
      // MoE Router: one intelligence, Luminor experts as hidden layer
      const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
      // Extract text from parts or content (AI SDK v6 UIMessage compat)
      const messageText = lastUserMessage ? extractMessageText(lastUserMessage) : '';
      const historyForRouter = normalizedMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const arcanea = createArcanea(messageText, historyForRouter);
      resolvedSystemPrompt = arcanea.systemPrompt;
      activeGates = arcanea.router.activeGates;
      coordinationMode = arcanea.coordinationMode;
      leadGuardian = arcanea.leadGuardian;
      activeLuminorIds = arcanea.activeLuminors.map(l => l.id);

      // Inject focus mode hint if provided (guides the MoE router)
      if (focusHint) {
        resolvedSystemPrompt = `[FOCUS MODE]\n${focusHint}\n\n${resolvedSystemPrompt}`;
      }
    }

    // --- Supabase client setup (shared across context, memories, tools) ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sbClient: any = undefined;
    let sbUserId: string | undefined;

    try {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const cookieHeader = req.headers.get('cookie') ?? '';
        const accessToken = cookieHeader
          .split(';')
          .map(c => c.trim())
          .find(c => c.startsWith('sb-') && c.includes('-auth-token'))
          ?.split('=')
          .slice(1)
          .join('=');

        if (accessToken) {
          let jwt = accessToken;
          try {
            const decoded = JSON.parse(decodeURIComponent(accessToken));
            if (decoded?.access_token) jwt = decoded.access_token;
            else if (Array.isArray(decoded) && decoded[0]?.access_token) jwt = decoded[0].access_token;
          } catch {
            // Token is already a raw JWT string — use as-is
          }

          sbClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${jwt}` } },
          });

          // Resolve user ID once
          try {
            const { data: authData } = await sbClient.auth.getUser();
            sbUserId = authData?.user?.id;
          } catch { /* non-fatal */ }
        }
      }
    } catch {
      // Non-fatal: continue without Supabase
    }

    // --- Inject creator context into system prompt ---
    try {
      if (sbClient) {
        const [profileRes, creationsRes] = await Promise.all([
          sbClient.from('profiles').select('display_name, magic_rank, gates_open, active_gate, guardian, academy_house, xp, level, streak_days, bio').single(),
          sbClient.from('creations').select('title, type, element, gate, guardian, like_count, created_at').order('created_at', { ascending: false }).limit(5),
        ]);

        if (profileRes.data) {
          const p = profileRes.data;
          const creations = creationsRes.data ?? [];
          const creationSummary = creations.length > 0
            ? creations.map((c: Record<string, unknown>) => `- "${c.title}" (${c.type}, ${c.element || 'unaligned'}, ${c.like_count} likes)`).join('\n')
            : 'No creations yet — this creator is just beginning.';

          const contextBlock = `[CREATOR CONTEXT]
Name: ${p.display_name || 'Creator'}
Rank: ${p.magic_rank || 'Apprentice'} (${p.gates_open || 0}/10 Gates open)
Active Gate: ${p.active_gate || 'Foundation'}
Guardian Affinity: ${p.guardian || 'None yet'}
Academy House: ${p.academy_house || 'Unassigned'}
XP: ${p.xp || 0} · Level: ${p.level || 1} · Streak: ${p.streak_days || 0} days
Bio: ${p.bio || 'No bio set'}

Recent Creations:
${creationSummary}

Adapt your depth, vocabulary, and suggestions to this creator's level. A Luminor needs different guidance than an Apprentice. Reference their creations and journey when relevant. If they seem stuck, suggest practices aligned with their active Gate.
[/CREATOR CONTEXT]

`;
          resolvedSystemPrompt = contextBlock + resolvedSystemPrompt;
        }
      }
    } catch (e) {
      // Non-fatal: continue without context if profile load fails
      console.warn('Failed to load creator context:', e);
    }

    if (projectContext?.title) {
      const projectBlock = [
        '[ACTIVE PROJECT]',
        `Title: ${projectContext.title}`,
        ...(projectContext.goal ? [`Goal: ${projectContext.goal}`] : []),
        ...(projectContext.description ? [`Context: ${projectContext.description}`] : []),
        'Treat this as the active workspace. Keep continuity, planning, and suggestions aligned to it unless the creator clearly changes direction.',
        '[/ACTIVE PROJECT]',
        '',
      ].join('\n');

      resolvedSystemPrompt = `${projectBlock}\n${resolvedSystemPrompt}`;
    }

    let projectRetrievalMetadata: ReturnType<typeof buildProjectRetrievalTraceMetadata> | null = null;

    if (projectContext?.id && sbClient && sbUserId) {
      try {
        const recentContext = messages
          .slice(-3)
          .map((m: { parts?: Array<{ type: string; text?: string }>; content?: string }) => {
            if (typeof m.content === 'string') return m.content;
            if (Array.isArray(m.parts)) return m.parts.filter((p) => p.type === 'text').map((p) => p.text ?? '').join(' ');
            return '';
          })
          .join(' ')
          .slice(0, 500);

        const [sessionsRes, creationsRes, docsRes, memoryLinkRes, graphSummaryRes] = await Promise.all([
          sbClient
            .from('chat_sessions')
            .select('id, title')
            .eq('user_id', sbUserId)
            .eq('project_id', projectContext.id)
            .order('updated_at', { ascending: false })
            .limit(4),
          sbClient
            .from('creations')
            .select('id, title, type')
            .eq('user_id', sbUserId)
            .eq('project_id', projectContext.id)
            .order('created_at', { ascending: false })
            .limit(4),
          sbClient
            .from('project_docs')
            .select('id, title, doc_type, updated_at, project_doc_content ( content_text )')
            .eq('user_id', sbUserId)
            .eq('project_id', projectContext.id)
            .order('last_edited_at', { ascending: false })
            .limit(4),
          sbClient
            .from('project_memory_links')
            .select('memory_id')
            .eq('user_id', sbUserId)
            .eq('project_id', projectContext.id)
            .order('created_at', { ascending: false })
            .limit(8),
          sbClient
            .from('project_graph_summaries')
            .select('summary, tags, facts')
            .eq('user_id', sbUserId)
            .eq('project_id', projectContext.id)
            .single(),
        ]);

        const memoryIds = ((memoryLinkRes.data as Array<{ memory_id: string }> | null) ?? []).map((row) => row.memory_id);
        const memoryRes = memoryIds.length > 0
          ? await sbClient
            .from('user_memories')
            .select('id, content, category')
            .in('id', memoryIds)
            .limit(8)
          : { data: [] };

        const retrieval = selectRelevantProjectContext({
          recentContext,
          sessions: ((sessionsRes.data as Array<{ id: string; title: string | null }> | null) ?? []),
          creations: ((creationsRes.data as Array<{ id: string; title: string | null; type: string | null }> | null) ?? []),
          docs: (
            (
              docsRes.data as Array<{
                id: string;
                title: string | null;
                doc_type?: string | null;
                project_doc_content?: Array<{ content_text?: string | null }>;
              }> | null
            ) ?? []
          ).map((doc) => ({
            id: doc.id,
            title: doc.title ?? 'Untitled doc',
            docType: doc.doc_type ?? null,
            excerpt:
              typeof doc.project_doc_content?.[0]?.content_text === 'string'
                ? doc.project_doc_content[0].content_text.slice(0, 220)
                : null,
          })),
          memories: ((memoryRes.data as Array<{ id: string; category?: string | null; content: string }> | null) ?? []),
          graphSummary: (graphSummaryRes.data as { summary?: string | null; tags?: string[] | null; facts?: string[] | null } | null) ?? null,
        });

        projectRetrievalMetadata = buildProjectRetrievalTraceMetadata(retrieval, {
          sessions: ((sessionsRes.data as Array<{ id: string; title: string | null }> | null) ?? []).length,
          creations: ((creationsRes.data as Array<{ id: string; title: string | null; type: string | null }> | null) ?? []).length,
          docs: (
            (
              docsRes.data as Array<{
                id: string;
                title: string | null;
                doc_type?: string | null;
                project_doc_content?: Array<{ content_text?: string | null }>;
              }> | null
            ) ?? []
          ).length,
          memories: ((memoryRes.data as Array<{ id: string; category?: string | null; content: string }> | null) ?? []).length,
        });
        resolvedSystemPrompt = `${buildProjectRetrievalBlock(retrieval)}\n${resolvedSystemPrompt}`;
      } catch (e) {
        console.warn('Failed to load project graph:', e);
      }
    }

    if (projectContext?.id && sbClient && sbUserId && projectRetrievalMetadata) {
      await recordProjectTrace(sbClient, {
        userId: sbUserId,
        projectId: projectContext.id,
        action: 'project_chat_context_loaded',
        metadata: {
          projectTitle: projectContext.title,
          ...projectRetrievalMetadata,
          retrievalMode: projectRetrievalMetadata.hasStoredSummary ? 'graph+selection' : 'selection-only',
        },
      });
    }

    // --- Inject Library wisdom based on active gate ---
    if (activeGates.length > 0 && !systemPrompt) {
      const wisdom = GATE_WISDOM[activeGates[0]];
      if (wisdom) {
        resolvedSystemPrompt += `\n\n[LIBRARY WISDOM]\nFrom the Library of Arcanea:\n"${wisdom}"\nReference this naturally if it enriches the creator's work. Do not quote it unless asked about Arcanea's teachings.\n[/LIBRARY WISDOM]`;
      }
    }

    // --- Inject relevant user memories into system prompt (semantic recall) ---
    try {
      if (sbClient && sbUserId) {
        // Build context from the last few messages for semantic relevance
        const recentContext = messages
          .slice(-3)
          .map((m: { parts?: Array<{ type: string; text?: string }>; content?: string }) => {
            if (typeof m.content === 'string') return m.content;
            if (Array.isArray(m.parts)) return m.parts.filter((p) => p.type === 'text').map((p) => p.text ?? '').join(' ');
            return '';
          })
          .join(' ')
          .slice(0, 500);

        const { recallRelevantMemories } = await import('@/lib/memory/semantic');
        const memories = await recallRelevantMemories(sbClient, sbUserId, recentContext, 15);

        if (memories.length > 0) {
          const memoryBlock = memories
            .map((m) => `- [${m.category}] ${m.content}`)
            .join('\n');
          resolvedSystemPrompt = `[USER MEMORIES]\nFacts about this creator (ranked by relevance to current conversation):\n${memoryBlock}\nUse these naturally when relevant. Don't list them.\n[/USER MEMORIES]\n\n` + resolvedSystemPrompt;
        }
      }
    } catch (e) {
      // Non-fatal: continue without memories
      console.warn('Failed to load user memories:', e);
    }

    // --- Resolve tools (opt-in via enabledTools) ---
    const chatToolSet = createChatTools({
      supabaseClient: sbClient ?? undefined,
      userId: sbUserId,
      searchApiKey: searchApiKey || undefined,
    });

    const toolsToUse = (() => {
      if (!enabledTools || enabledTools.length === 0) return undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const selected: Record<string, any> = {};
      if (enabledTools.includes('image') && chatToolSet.image_generate) selected.image_generate = chatToolSet.image_generate;
      if (enabledTools.includes('search') && chatToolSet.web_search) selected.web_search = chatToolSet.web_search;
      if ((enabledTools.includes('think') || enabledTools.includes('research')) && chatToolSet.deep_research) {
        selected.deep_research = chatToolSet.deep_research;
      }
      if (enabledTools.includes('memory') && chatToolSet.memory_store) selected.memory_store = chatToolSet.memory_store;
      return Object.keys(selected).length > 0 ? selected : undefined;
    })();

    if (projectContext?.id && sbClient && sbUserId) {
      await recordProjectTrace(sbClient, {
        userId: sbUserId,
        projectId: projectContext.id,
        action: 'project_provider_routed',
        metadata: buildProjectProviderRoutingTraceMetadata({
          projectTitle: projectContext.title,
          requestedProvider: requestedProvider ?? null,
          resolvedProvider: resolvedProviderId ?? resolvedGateway?.provider ?? 'unknown',
          routeMode: providerRouteMode,
          apiKeySource: providerApiKeySource,
          gatewayModel: gatewayModel ?? null,
          modelLabel: label,
          enabledTools: enabledTools ?? [],
          focusHint: focusHint ?? null,
          activeGates,
          activeLuminors: activeLuminorIds,
        }),
      });
    }

    // --- Stream response ---
    const result = streamText({
      model,
      system: resolvedSystemPrompt,
      messages: modelMessages,
      temperature: temperature ?? 0.7,
      maxOutputTokens: maxTokens ?? 8192,
      ...(toolsToUse ? { tools: toolsToUse, maxSteps: 5 } : {}),
    });

    const responseHeaders: Record<string, string> = {
      'x-arcanea-gates': activeGates.join(','),
      'x-arcanea-coordination': coordinationMode,
      'x-arcanea-lead': leadGuardian || '',
      'x-arcanea-luminors': activeLuminorIds.join(','),
      ...buildArcaneaRuntimeHeaders({
        modelLabel: label,
        provider: resolvedProviderId ?? resolvedGateway?.provider ?? null,
        routeMode: providerRouteMode,
        apiKeySource: providerApiKeySource,
        retrievalMode: projectRetrievalMetadata
          ? (projectRetrievalMetadata.hasStoredSummary ? 'graph+selection' : 'selection-only')
          : 'none',
        selectedSessionCount: projectRetrievalMetadata?.sessionCount,
        availableSessionCount: projectRetrievalMetadata?.availableSessionCount,
        selectedCreationCount: projectRetrievalMetadata?.creationCount,
        availableCreationCount: projectRetrievalMetadata?.availableCreationCount,
        selectedDocCount: projectRetrievalMetadata?.docCount,
        availableDocCount: projectRetrievalMetadata?.availableDocCount,
        selectedMemoryCount: projectRetrievalMetadata?.memoryCount,
        availableMemoryCount: projectRetrievalMetadata?.availableMemoryCount,
        hasStoredSummary: projectRetrievalMetadata?.hasStoredSummary,
      }),
    };

    const runtimeMetadata = {
      modelLabel: label,
      provider: resolvedProviderId ?? resolvedGateway?.provider ?? null,
      routeMode: providerRouteMode,
      apiKeySource: providerApiKeySource,
      retrievalMode: projectRetrievalMetadata
        ? (projectRetrievalMetadata.hasStoredSummary ? 'graph+selection' : 'selection-only')
        : 'none',
      selectedSessionCount: projectRetrievalMetadata?.sessionCount,
      availableSessionCount: projectRetrievalMetadata?.availableSessionCount,
      selectedCreationCount: projectRetrievalMetadata?.creationCount,
      availableCreationCount: projectRetrievalMetadata?.availableCreationCount,
      selectedDocCount: projectRetrievalMetadata?.docCount,
      availableDocCount: projectRetrievalMetadata?.availableDocCount,
      selectedMemoryCount: projectRetrievalMetadata?.memoryCount,
      availableMemoryCount: projectRetrievalMetadata?.availableMemoryCount,
      hasStoredSummary: projectRetrievalMetadata?.hasStoredSummary,
    };

    return result.toUIMessageStreamResponse({
      headers: responseHeaders,
      messageMetadata: ({ part }) => {
        if (part.type === 'start') {
          return runtimeMetadata;
        }

        return undefined;
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    const message = error instanceof Error ? error.message : 'Internal server error';

    // API key or auth issues
    if (message.includes('API key') || message.includes('401') || message.includes('403')) {
      return new Response(
        'Invalid API key. Check your key in Settings → Providers.',
        { status: 401, headers: { 'Content-Type': 'text/plain' } }
      );
    }

    return new Response(
      message,
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}

// Health check
export async function GET() {
  const configured: Record<string, boolean> = {};
  for (const [id, config] of Object.entries(PROVIDERS)) {
    configured[id] = config.envKeys.some((k) => Boolean(process.env[k]));
  }
  for (const [id, ext] of Object.entries(EXTENDED_PROVIDERS)) {
    configured[id] = ext.envKeys.some((k) => Boolean(process.env[k]));
  }
  const anyConfigured = Object.values(configured).some(Boolean);
  return NextResponse.json({
    status: anyConfigured ? 'ok' : 'no-api-key',
    service: 'arcanea-intelligence-gateway',
    providers: configured,
    gatewayModels: Object.keys(GATEWAY_MODELS).length,
    version: '5.0.0',
  });
}
