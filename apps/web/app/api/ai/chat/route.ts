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

// ---------------------------------------------------------------------------
// Default system prompt — used when no specialist systemPrompt is provided
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

const MODEL_NAME = 'gemini-2.0-flash';

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
    ? `Hello. I'm ${luminorName}, one of the Arcanea intelligences.`
    : `Hello. I'm one of the Arcanea intelligences.`;

  const body = [
    greeting,
    '',
    'The AI service is not configured on this deployment yet.',
    '',
    'To activate chat, set this environment variable:',
    '- `GOOGLE_GENERATIVE_AI_API_KEY` (Google Gemini)',
    '',
    'Once configured, I can help with writing, code, design, research, and more.',
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
    const model = google(MODEL_NAME);

    // Normalize message roles: convert 'model' to 'assistant' for Vercel AI SDK
    const normalizedMessages = messages.map((msg) => ({
      role: (msg.role === 'model' ? 'assistant' : msg.role) as 'user' | 'assistant',
      content: msg.content,
    }));

    // Use the provided specialist prompt, or fall back to the default Arcanea prompt
    const resolvedSystemPrompt = systemPrompt || ARCANEA_DEFAULT_SYSTEM_PROMPT;

    // --- Stream response ---
    const result = streamText({
      model,
      system: resolvedSystemPrompt,
      messages: normalizedMessages as Array<{ role: 'user' | 'assistant'; content: string }>,
      temperature: temperature ?? 0.7,
      maxOutputTokens: maxTokens ?? 8192,
    });

    const response = result.toTextStreamResponse();
    // Task 2: expose the model name so the frontend can display it
    response.headers.set('x-arcanea-model', MODEL_NAME);
    return response;
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
    model: MODEL_NAME,
    version: '3.0.0',
    configured: hasKey,
  });
}
