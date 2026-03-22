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
import { GATEWAY_MODELS, EXTENDED_PROVIDERS } from '@/lib/gateway/catalog';

export const runtime = 'edge';

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

// Rate limiting handled by Vercel's built-in Edge rate limiting
// For custom limits, use Vercel KV: https://vercel.com/docs/storage/vercel-kv
// TODO: Add Vercel KV rate limiting when scaling beyond MVP

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
    // --- Parse request ---
    const body: ChatRequest = await req.json();
    const { messages, systemPrompt, temperature, maxTokens, provider: requestedProvider, model: modelOverride, gatewayModel, focusHint, clientApiKey } = body;

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400, headers: { 'Content-Type': 'text/plain' } });
    }

    // --- Resolve model/provider ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let model: any;
    let label: string;

    // Gateway model path: arcanea-* model IDs
    let resolvedGateway = gatewayModel && gatewayModel !== 'arcanea-auto' ? GATEWAY_MODELS[gatewayModel] : null;

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
          `No API key configured. Set ${providerConfig.envKeys[0]} on Vercel or add a key in Settings → Providers.`,
          { status: 503, headers: { 'Content-Type': 'text/plain' } }
        );
      }

      const created = createModel(providerId, apiKey, modelOverride);
      model = created.model;
      label = created.label;
    }

    // Normalize messages: AI SDK v6 UIMessages use `parts` array, not `content` string.
    // Extract text from parts[].text, fall back to content for legacy format.
    const normalizedMessages = messages.map((msg: any) => {
      let text = '';
      if (msg.parts && Array.isArray(msg.parts)) {
        text = msg.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text ?? '')
          .join('');
      }
      if (!text && typeof msg.content === 'string') {
        text = msg.content;
      }
      return {
        role: (msg.role === 'model' ? 'assistant' : msg.role) as 'user' | 'assistant',
        content: text,
      };
    });

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
      const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user');
      // Extract text from parts or content (AI SDK v6 UIMessage compat)
      let messageText = '';
      if (lastUserMessage?.parts && Array.isArray(lastUserMessage.parts)) {
        messageText = lastUserMessage.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text ?? '').join('');
      }
      if (!messageText && typeof lastUserMessage?.content === 'string') {
        messageText = lastUserMessage.content;
      }
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
        'x-arcanea-coordination': coordinationMode,
        'x-arcanea-lead': leadGuardian || '',
        'x-arcanea-luminors': activeLuminorIds.join(','),
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
