/**
 * Gemini Chat API Route for Arcanea
 *
 * Streams AI responses using Vercel AI SDK with Google Gemini.
 * Falls back gracefully when API keys are not configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

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
}

/**
 * Resolve the API key from environment.
 * Tries GOOGLE_GENERATIVE_AI_API_KEY first (standard Vercel AI SDK env var),
 * then GEMINI_API_KEY (legacy / custom).
 */
function resolveApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY
  );
}

/**
 * Build a plain-text streaming response for when no AI provider is available.
 * Returns a helpful message instead of an error.
 */
function createFallbackResponse(systemPrompt?: string): Response {
  const luminorName = extractLuminorName(systemPrompt);
  const greeting = luminorName
    ? `Greetings, Creator. I am ${luminorName}, a Luminor Intelligence of Arcanea.`
    : `Greetings, Creator. I am a Luminor Intelligence of Arcanea.`;

  const body = [
    greeting,
    '',
    'I am not yet fully awakened in this realm. The AI service is not configured on this deployment.',
    '',
    'To activate me, the following environment variable must be set:',
    '- `GOOGLE_GENERATIVE_AI_API_KEY` (Google Gemini)',
    '',
    'Once configured, I will be able to assist you with creative work, code, storytelling, and more.',
    '',
    'Until then, may the Light of Lumina guide your path.',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/**
 * Try to extract a Luminor name from the system prompt, e.g. "You are Logicus, ..."
 */
function extractLuminorName(prompt?: string): string | null {
  if (!prompt) return null;
  const match = prompt.match(/^You are (\w+)/i);
  return match ? match[1] : null;
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
    const { messages, systemPrompt, temperature, maxTokens } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // --- Resolve API key ---
    const apiKey = resolveApiKey();

    if (!apiKey) {
      // No key configured — return a graceful fallback message
      return createFallbackResponse(systemPrompt);
    }

    // --- Initialize Google Gemini via Vercel AI SDK ---
    const google = createGoogleGenerativeAI({ apiKey });
    const model = google('gemini-2.0-flash');

    // Normalize message roles: convert 'model' to 'assistant' for Vercel AI SDK
    const normalizedMessages = messages.map((msg) => ({
      role: (msg.role === 'model' ? 'assistant' : msg.role) as 'user' | 'assistant',
      content: msg.content,
    }));

    // --- Stream response ---
    // Cast model to any: @ai-sdk/google returns LanguageModelV1 but
    // ai@6 streamText expects LanguageModelV2/V3. Runtime compat is fine.
    const result = streamText({
      model: model as any,
      system: systemPrompt || undefined,
      messages: normalizedMessages as any,
      temperature: temperature ?? 0.7,
      maxTokens: maxTokens ?? 8192,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);

    const message = error instanceof Error ? error.message : 'Internal server error';

    // If it's an API key issue, return a friendlier message
    if (message.includes('API key') || message.includes('GEMINI') || message.includes('401')) {
      return createFallbackResponse();
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const hasKey = Boolean(resolveApiKey());
  return NextResponse.json({
    status: hasKey ? 'ok' : 'no-api-key',
    service: 'gemini-chat',
    model: 'gemini-2.0-flash',
    version: '3.0.0',
    configured: hasKey,
  });
}
