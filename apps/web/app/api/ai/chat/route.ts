/**
 * Multi-Provider Chat API Route for Arcanea
 *
 * Streams AI responses using Vercel AI SDK.
 * Supports Google Gemini, Anthropic Claude, and OpenAI GPT.
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
// Provider configuration
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
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
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
    const { messages, systemPrompt, temperature, maxTokens, provider: requestedProvider, model: modelOverride, clientApiKey } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // --- Resolve provider (priority: requested > auto-detect with OpenRouter first) ---
    let providerId: string;
    if (requestedProvider && PROVIDERS[requestedProvider]) {
      providerId = requestedProvider;
    } else {
      // Auto-detect: try providers in order (openrouter first)
      const detected = Object.keys(PROVIDERS).find((id) => {
        const cfg = PROVIDERS[id];
        return cfg.envKeys.some((k) => Boolean(process.env[k]));
      });
      providerId = detected || 'openrouter';
    }
    const providerConfig = PROVIDERS[providerId];

    // --- Resolve API key (server env var > client key) ---
    const apiKey = resolveApiKey(providerConfig, clientApiKey);

    if (!apiKey) {
      return Response.json(
        { error: `No API key found for ${providerConfig.label}. Add one in Settings → Providers or set ${providerConfig.envKeys[0]} on the server.` },
        { status: 503 }
      );
    }

    // --- Create model ---
    const { model, label } = createModel(providerId, apiKey, modelOverride);

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
      return Response.json(
        { error: 'Invalid API key. Check your key in Settings → Providers.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const configured: Record<string, boolean> = {};
  for (const [id, config] of Object.entries(PROVIDERS)) {
    configured[id] = config.envKeys.some((k) => Boolean(process.env[k]));
  }
  const anyConfigured = Object.values(configured).some(Boolean);
  return NextResponse.json({
    status: anyConfigured ? 'ok' : 'no-api-key',
    service: 'multi-provider-chat',
    providers: configured,
    version: '4.0.0',
  });
}
