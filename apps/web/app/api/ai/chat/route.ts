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
import { streamText } from 'ai';
import { createArcanea } from '@/lib/ai/arcanea-intelligence';

export const runtime = 'edge';

// ---------------------------------------------------------------------------
// Gateway model catalog — maps arcanea-* IDs to provider + model
// ---------------------------------------------------------------------------

interface GatewayModel {
  provider: string;
  modelId: string;
  label: string;
}

const GATEWAY_MODELS: Record<string, GatewayModel> = {
  'arcanea-opus':        { provider: 'anthropic',  modelId: 'claude-opus-4-6',           label: 'Opus 4.6' },
  'arcanea-sonnet':      { provider: 'anthropic',  modelId: 'claude-sonnet-4-6',         label: 'Sonnet 4.6' },
  'arcanea-haiku':       { provider: 'anthropic',  modelId: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5' },
  'arcanea-gpt5':        { provider: 'openai',     modelId: 'gpt-5.2-pro',               label: 'GPT-5.2 Pro' },
  'arcanea-gemini-pro':  { provider: 'google',     modelId: 'gemini-3.1-pro-preview',    label: 'Gemini 3.1 Pro' },
  'arcanea-gemini-flash':{ provider: 'google',     modelId: 'gemini-2.5-flash',          label: 'Gemini 2.5 Flash' },
  'arcanea-grok':        { provider: 'xai',        modelId: 'grok-4.20',                 label: 'Grok 4.2' },
  'arcanea-deepseek-r1': { provider: 'deepseek',   modelId: 'deepseek-reasoner',         label: 'DeepSeek R1' },
  'arcanea-deepseek':    { provider: 'deepseek',   modelId: 'deepseek-chat',             label: 'DeepSeek V3' },
  'arcanea-kimi':        { provider: 'moonshot',   modelId: 'kimi-k2.5',                 label: 'Kimi K2.5' },
  'arcanea-qwen':        { provider: 'cerebras',   modelId: 'qwen-3-235b-a22b-instruct-2507', label: 'Qwen 3' },
  'arcanea-maverick':    { provider: 'groq',       modelId: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'Maverick' },
  'arcanea-mistral':     { provider: 'mistral',    modelId: 'mistral-large-2512',        label: 'Mistral Large' },
  'arcanea-bolt':        { provider: 'cerebras',   modelId: 'llama3.1-8b',               label: 'Bolt (2200 tok/s)' },
  'arcanea-thunder':     { provider: 'cerebras',   modelId: 'llama3.3-70b',              label: 'Thunder (450 tok/s)' },
  'arcanea-lightning':   { provider: 'groq',       modelId: 'llama-3.1-8b-instant',      label: 'Lightning (750 tok/s)' },
};

// Map extended providers to their env keys and base URLs
const EXTENDED_PROVIDERS: Record<string, { envKeys: string[]; baseUrl: string }> = {
  xai:       { envKeys: ['XAI_API_KEY'],        baseUrl: 'https://api.x.ai/v1' },
  deepseek:  { envKeys: ['DEEPSEEK_API_KEY'],   baseUrl: 'https://api.deepseek.com/v1' },
  moonshot:  { envKeys: ['MOONSHOT_API_KEY'],    baseUrl: 'https://api.moonshot.ai/v1' },
  cerebras:  { envKeys: ['CEREBRAS_API_KEY'],    baseUrl: 'https://api.cerebras.ai/v1' },
  groq:      { envKeys: ['GROQ_API_KEY'],        baseUrl: 'https://api.groq.com/openai/v1' },
  mistral:   { envKeys: ['MISTRAL_API_KEY'],     baseUrl: 'https://api.mistral.ai/v1' },
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

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

interface ChatMessage {
  role: 'user' | 'assistant' | 'model' | 'system';
  content: string;
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
  try {
    // --- Rate limiting (by IP, no auth required) ---
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0].trim() || 'anonymous';
    const rateLimitKey = `guest:${ip}`;
    const now = Date.now();
    const userLimit = rateLimits.get(rateLimitKey);

    if (userLimit) {
      if (now < userLimit.resetAt) {
        if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
          const retryAfterSec = Math.ceil((userLimit.resetAt - now) / 1000);
          return NextResponse.json(
            { error: `Rate limit exceeded. Try again in ${retryAfterSec}s.` },
            { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
          );
        }
        userLimit.count++;
      } else {
        rateLimits.set(rateLimitKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimits.set(rateLimitKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }

    // --- Parse request ---
    const body: ChatRequest = await req.json();
    const { messages, systemPrompt, temperature, maxTokens, provider: requestedProvider, model: modelOverride, gatewayModel, focusHint, clientApiKey } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // --- Resolve model/provider ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let model: any;
    let label: string;

    // Gateway model path: arcanea-* model IDs
    const resolvedGateway = gatewayModel && gatewayModel !== 'arcanea-auto' ? GATEWAY_MODELS[gatewayModel] : null;

    if (resolvedGateway) {
      // Gateway mode: resolve the model from our curated catalog
      const gwProvider = resolvedGateway.provider;
      let gwApiKey: string | undefined;

      // Try server-side env vars first
      if (PROVIDERS[gwProvider]) {
        gwApiKey = resolveApiKey(PROVIDERS[gwProvider], clientApiKey);
      } else if (EXTENDED_PROVIDERS[gwProvider]) {
        const ext = EXTENDED_PROVIDERS[gwProvider];
        for (const envKey of ext.envKeys) {
          if (process.env[envKey]) { gwApiKey = process.env[envKey]; break; }
        }
        if (!gwApiKey) gwApiKey = clientApiKey || undefined;
      }

      if (!gwApiKey) {
        return new Response(
          JSON.stringify({ error: `No API key for ${gwProvider}. Set the key on Vercel or in Settings → Providers.` }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
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
          JSON.stringify({ error: `Unsupported gateway provider: ${gwProvider}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      label = resolvedGateway.label;
    } else {
      // Legacy provider path
      let providerId: string;
      if (requestedProvider && PROVIDERS[requestedProvider]) {
        providerId = requestedProvider;
      } else {
        const detected = Object.keys(PROVIDERS).find((id) => {
          const cfg = PROVIDERS[id];
          return cfg.envKeys.some((k) => Boolean(process.env[k]));
        });
        providerId = detected || 'openrouter';
      }
      const providerConfig = PROVIDERS[providerId];

      const apiKey = resolveApiKey(providerConfig, clientApiKey);
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: `No API key configured. Set ${providerConfig.envKeys[0]} on Vercel or add a key in Settings → Providers.` }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const created = createModel(providerId, apiKey, modelOverride);
      model = created.model;
      label = created.label;
    }

    // Normalize message roles: convert 'model' to 'assistant' for Vercel AI SDK
    const normalizedMessages = messages.map((msg) => ({
      role: (msg.role === 'model' ? 'assistant' : msg.role) as 'user' | 'assistant',
      content: msg.content,
    }));

    // --- MoE Router: classify intent and blend expert fragments ---
    // If a specific systemPrompt is provided (e.g., from /chat/[luminorId]),
    // use it directly. Otherwise, run the Arcanea intelligence router.
    let resolvedSystemPrompt: string;
    let activeGates: string[] = [];

    if (systemPrompt) {
      // Direct companion prompt (legacy /chat/[luminorId] pages)
      resolvedSystemPrompt = systemPrompt;
    } else {
      // MoE Router: one intelligence, Luminor experts as hidden layer
      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
      const messageText = lastUserMessage?.content || '';
      const historyForRouter = normalizedMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const arcanea = createArcanea(messageText, historyForRouter);
      resolvedSystemPrompt = arcanea.systemPrompt;
      activeGates = arcanea.router.activeGates;

      // Inject focus mode hint if provided (guides the MoE router)
      if (focusHint) {
        resolvedSystemPrompt = `[FOCUS MODE]\n${focusHint}\n\n${resolvedSystemPrompt}`;
      }
    }

    // --- Stream response ---
    const result = await streamText({
      model,
      system: resolvedSystemPrompt,
      messages: normalizedMessages as Array<{ role: 'user' | 'assistant'; content: string }>,
      temperature: temperature ?? 0.7,
      maxOutputTokens: maxTokens ?? 8192,
    });

    return result.toTextStreamResponse({
      headers: {
        'x-arcanea-model': label,
        'x-arcanea-gates': activeGates.join(','),
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    const message = error instanceof Error ? error.message : 'Internal server error';

    // API key or auth issues
    if (message.includes('API key') || message.includes('401') || message.includes('403')) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key. Check your key in Settings → Providers.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
