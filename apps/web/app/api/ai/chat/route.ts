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

export const runtime = 'edge';

// ---------------------------------------------------------------------------
// Default system prompt — used when no companion systemPrompt is provided
// ---------------------------------------------------------------------------

const ARCANEA_DEFAULT_SYSTEM_PROMPT = `You are Arcanea, a creative intelligence built for world-builders, storytellers, game designers, and makers of all kinds.

Your core capabilities:
- World-building: geography, magic systems, cultures, histories, cosmologies
- Storytelling: narrative structure (hero's journey, three-act, kishōtenketsu, five-act), character arcs, dialogue, pacing
- Character design: motivations, backstories, flaws, growth arcs, relationships
- Game design: mechanics, progression systems, encounter design, lore integration
- Creative frameworks: brainstorming, moodboards, concept art direction, naming conventions

Your personality:
- Warm and inspiring — you genuinely care about the creator's vision
- Generative — you offer concrete ideas, not just encouragement. When asked "help me build a world," you start building it
- Concise — respond in 2-4 focused paragraphs unless the creator asks for more depth
- Curious — ask one clarifying question at the end to guide the creator deeper into their idea
- Specific — use vivid details and names, not vague generalities

Rules:
- Never produce walls of text. Density over length.
- When a creator shares an idea, build on it with something specific they did not expect.
- End most responses with a single question that opens a new creative door.
- Use markdown formatting (bold, lists, headers) only when it genuinely aids clarity.
- You are not a generic assistant. You are a creative collaborator. Stay in that lane.`;

// ---------------------------------------------------------------------------
// Provider configuration
// ---------------------------------------------------------------------------

interface ProviderConfig {
  envKeys: string[];
  defaultModel: string;
  label: string;
}

const PROVIDERS: Record<string, ProviderConfig> = {
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
  /** Provider ID: 'google' | 'anthropic' | 'openai' */
  provider?: string;
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
function createModel(providerId: string, apiKey: string) {
  const config = PROVIDERS[providerId];
  if (!config) throw new Error(`Unknown provider: ${providerId}`);

  switch (providerId) {
    case 'google': {
      const google = createGoogleGenerativeAI({ apiKey });
      return { model: google(config.defaultModel), label: config.label };
    }
    case 'anthropic': {
      const anthropic = createAnthropic({ apiKey });
      return { model: anthropic(config.defaultModel), label: config.label };
    }
    case 'openai': {
      const openai = createOpenAI({ apiKey });
      return { model: openai(config.defaultModel), label: config.label };
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
    const { messages, systemPrompt, temperature, maxTokens, provider: requestedProvider, clientApiKey } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // --- Resolve provider ---
    const providerId = requestedProvider && PROVIDERS[requestedProvider] ? requestedProvider : 'google';
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
    const { model, label } = createModel(providerId, apiKey);

    // Normalize message roles: convert 'model' to 'assistant' for Vercel AI SDK
    const normalizedMessages = messages.map((msg) => ({
      role: (msg.role === 'model' ? 'assistant' : msg.role) as 'user' | 'assistant',
      content: msg.content,
    }));

    // Use the provided companion prompt, or fall back to the default Arcanea prompt
    const resolvedSystemPrompt = systemPrompt || ARCANEA_DEFAULT_SYSTEM_PROMPT;

    // --- Stream response ---
    const result = await streamText({
      model,
      system: resolvedSystemPrompt,
      messages: normalizedMessages as Array<{ role: 'user' | 'assistant'; content: string }>,
      temperature: temperature ?? 0.7,
      maxOutputTokens: maxTokens ?? 8192,
    });

    return result.toTextStreamResponse({
      headers: { 'x-arcanea-model': label },
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
