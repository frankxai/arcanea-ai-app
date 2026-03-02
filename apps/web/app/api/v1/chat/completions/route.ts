/**
 * Arcanea Intelligence Gateway — Chat Completions API
 *
 * OpenAI-compatible endpoint: POST /api/v1/chat/completions
 *
 * This single endpoint makes Arcanea a provider in 30+ tools:
 * LobeChat, Open WebUI, Cursor, Continue, LiteLLM, LangChain, etc.
 *
 * BYOK: Users provide their own provider API keys.
 * Smart Routing: Use model "arcanea-auto" for automatic best-model selection.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ChatCompletionRequest, GatewayConfig } from '@/lib/gateway/types';
import { getModelById, CURATED_MODELS } from '@/lib/gateway/models';
import { routeRequest, classifyTask, selectModel } from '@/lib/gateway/router';
import { dispatchToProvider, resolveApiKey } from '@/lib/gateway/providers';
import { generateCompletionId } from '@/lib/gateway/streaming';

export const runtime = 'edge';

// ─── Rate Limiting (simple in-memory, replace with KV/Redis in prod) ─

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS = 60;    // 60 req/min default

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now >= entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

// ─── Key Extraction ──────────────────────────────────────────────────

/**
 * Extract provider keys from the request.
 * Keys can come from:
 *   1. Authorization header: "Bearer arc_xxx" (Arcanea API key — future)
 *   2. X-Provider-Keys header: JSON object of provider keys
 *   3. Individual headers: X-Anthropic-Key, X-OpenAI-Key, etc.
 *   4. Environment variables (server-managed)
 */
function extractGatewayConfig(req: NextRequest): GatewayConfig {
  const providerKeys: GatewayConfig['providerKeys'] = {};

  // Strategy 1: JSON provider keys header
  const keysHeader = req.headers.get('x-provider-keys');
  if (keysHeader) {
    try {
      const parsed = JSON.parse(keysHeader);
      Object.assign(providerKeys, parsed);
    } catch { /* ignore parse errors */ }
  }

  // Strategy 2: Individual provider key headers
  const headerMap: Record<string, string> = {
    'x-anthropic-key': 'anthropic',
    'x-openai-key': 'openai',
    'x-google-key': 'google',
    'x-xai-key': 'xai',
    'x-groq-key': 'groq',
    'x-cerebras-key': 'cerebras',
    'x-sambanova-key': 'sambanova',
    'x-replicate-key': 'replicate',
    'x-together-key': 'together',
    'x-deepseek-key': 'deepseek',
    'x-moonshot-key': 'moonshot',
    'x-mistral-key': 'mistral',
    'x-openrouter-key': 'openrouter',
  };

  for (const [header, provider] of Object.entries(headerMap)) {
    const value = req.headers.get(header);
    if (value) {
      providerKeys[provider as keyof typeof providerKeys] = value;
    }
  }

  // Strategy 3: Bearer token as a specific provider key
  // If the bearer token starts with a known prefix, route it
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    if (token.startsWith('sk-ant-')) providerKeys.anthropic = token;
    else if (token.startsWith('sk-')) providerKeys.openai = token;
    else if (token.startsWith('gsk_')) providerKeys.groq = token;
    else if (token.startsWith('xai-')) providerKeys.xai = token;
    // arc_ prefix = Arcanea API key (future managed keys)
  }

  // Strategy 4: Environment variables (fallback)
  const envMap: Record<string, string> = {
    ANTHROPIC_API_KEY: 'anthropic',
    OPENAI_API_KEY: 'openai',
    GOOGLE_GENERATIVE_AI_API_KEY: 'google',
    GEMINI_API_KEY: 'google',
    XAI_API_KEY: 'xai',
    GROQ_API_KEY: 'groq',
    CEREBRAS_API_KEY: 'cerebras',
    SAMBANOVA_API_KEY: 'sambanova',
    REPLICATE_API_TOKEN: 'replicate',
    TOGETHER_API_KEY: 'together',
    DEEPSEEK_API_KEY: 'deepseek',
    MOONSHOT_API_KEY: 'moonshot',
    MISTRAL_API_KEY: 'mistral',
    OPENROUTER_API_KEY: 'openrouter',
  };

  for (const [envVar, provider] of Object.entries(envMap)) {
    if (!providerKeys[provider as keyof typeof providerKeys]) {
      const val = process.env[envVar];
      if (val) {
        providerKeys[provider as keyof typeof providerKeys] = val;
      }
    }
  }

  return {
    providerKeys,
    smartRouting: true,
  };
}

// ─── POST Handler ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anon';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: { message: 'Rate limit exceeded. Please try again later.', type: 'rate_limit_error' } },
        { status: 429 },
      );
    }

    // Parse request
    const body = await req.json() as ChatCompletionRequest;

    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json(
        { error: { message: 'messages is required and must not be empty', type: 'invalid_request_error' } },
        { status: 400 },
      );
    }

    if (!body.model) {
      return NextResponse.json(
        { error: { message: 'model is required', type: 'invalid_request_error' } },
        { status: 400 },
      );
    }

    // Build gateway config from request
    const config = extractGatewayConfig(req);

    // Resolve model
    const modelId = body.model;
    const streaming = body.stream ?? false;

    // Route the request
    const route = routeRequest(modelId, body.messages, config);

    if (!route) {
      // If model not found in catalog, try treating it as a passthrough
      // (user specified a raw provider model ID like "gpt-4o")
      return NextResponse.json(
        {
          error: {
            message: `Model "${modelId}" not found. Use GET /api/v1/models to see available models, or use "arcanea-auto" for smart routing.`,
            type: 'invalid_request_error',
            hint: 'Available models: ' + CURATED_MODELS.slice(0, 5).map((m) => m.id).join(', ') + '...',
          },
        },
        { status: 400 },
      );
    }

    // Check we have a key for this provider
    const apiKey = config.providerKeys[route.model.provider];
    if (!apiKey) {
      return NextResponse.json(
        {
          error: {
            message: `No API key found for provider "${route.model.provider}". Provide it via X-${route.model.provider}-Key header or environment variable.`,
            type: 'authentication_error',
            provider: route.model.provider,
          },
        },
        { status: 401 },
      );
    }

    // Dispatch to provider
    const response = await dispatchToProvider(
      route.model.provider,
      route.model.providerModelId,
      apiKey,
      body,
      route.model.id,
      streaming,
    );

    // Add gateway metadata headers
    const finalResponse = new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });

    finalResponse.headers.set('X-Arcanea-Model', route.model.id);
    finalResponse.headers.set('X-Arcanea-Provider', route.model.provider);
    finalResponse.headers.set('X-Arcanea-Route-Reason', route.reason);

    return finalResponse;

  } catch (error) {
    console.error('Gateway error:', error);
    const message = error instanceof Error ? error.message : 'Internal gateway error';

    return NextResponse.json(
      { error: { message, type: 'internal_error' } },
      { status: 500 },
    );
  }
}

// ─── GET Handler (Health Check) ──────────────────────────────────────

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Arcanea Intelligence Gateway',
    version: '1.0.0',
    models: CURATED_MODELS.length,
    endpoints: {
      chat: '/api/v1/chat/completions',
      models: '/api/v1/models',
    },
    documentation: 'https://arcanea.ai/docs/api',
  });
}
