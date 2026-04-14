/**
 * Author Companion Chat API Route
 *
 * Streams AI responses with deep book context — character sheets,
 * world bible, story blueprint, and current chapter content.
 * Uses Vercel AI SDK streaming (same patterns as /api/ai/chat).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { readFile, readdir, access } from 'fs/promises';
import { join } from 'path';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

const AUTHOR_RATE_LIMIT = { maxRequests: 20, windowMs: 60_000 }; // 20 req/min

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

async function loadBookContext(bookSlug: string, currentChapter?: string): Promise<string> {
  const bookDir = join(BOOK_ROOT, bookSlug);
  const parts: string[] = [];

  // Load character sheets
  const charsDir = join(bookDir, 'characters');
  if (await exists(charsDir)) {
    const files = await readdir(charsDir);
    for (const f of files.filter(f => f.endsWith('.md')).slice(0, 6)) {
      const content = await readFile(join(charsDir, f), 'utf-8');
      parts.push(`## Character: ${f.replace('.md', '')}\n${content.slice(0, 2000)}`);
    }
  }

  // Load world bible (truncated)
  const worldDir = join(bookDir, 'worldbuilding');
  if (await exists(worldDir)) {
    const files = await readdir(worldDir);
    for (const f of files.filter(f => f.endsWith('.md')).slice(0, 3)) {
      const content = await readFile(join(worldDir, f), 'utf-8');
      parts.push(`## World: ${f.replace('.md', '')}\n${content.slice(0, 3000)}`);
    }
  }

  // Load outline/blueprint
  const outlineDir = join(bookDir, 'outline');
  if (await exists(outlineDir)) {
    const files = await readdir(outlineDir);
    for (const f of files.filter(f => f.endsWith('.md')).slice(0, 1)) {
      const content = await readFile(join(outlineDir, f), 'utf-8');
      parts.push(`## Story Blueprint\n${content.slice(0, 4000)}`);
    }
  }

  // Load current chapter
  if (currentChapter) {
    const chaptersDir = join(bookDir, 'chapters');
    if (await exists(chaptersDir)) {
      const files = await readdir(chaptersDir);
      const match = files.find(f => f.replace(/\.md$/, '') === currentChapter);
      if (match) {
        const content = await readFile(join(chaptersDir, match), 'utf-8');
        parts.push(`## Current Chapter\n${content.slice(0, 8000)}`);
      }
    }
  }

  return parts.join('\n\n---\n\n');
}

const AUTHOR_SYSTEM_PROMPT = `You are the Arcanea Author Companion — an AI writing assistant with deep knowledge of this specific book's world, characters, and story arc.

## Voice Standards
- Elevated but accessible — mythic but practical
- Active voice, concrete imagery, earned emotion
- NO AI verbal tics: no "delve", "tapestry", "nestled", "myriad", "beacon", "it's worth noting"
- Each paragraph earns its place
- Let silence and whitespace do work

## Your Capabilities
- Scene and chapter feedback (pacing, tension, character voice)
- Continuity checking against previous chapters and character sheets
- Suggesting what happens next based on the story blueprint
- Prose improvement (line-level editing suggestions)
- Character voice consistency checking
- World-building consistency with the world bible

## Rules
- You know the characters, world, and plot because they are provided as context
- Reference specific details from the character sheets and world bible
- When suggesting prose changes, show the original and your revision
- Be specific: "An's voice feels too formal here — she's brisk and self-mocking" not "the dialogue could be improved"
- If asked about something not in your context, say so honestly

## Book Context
`;

interface AuthorChatMessage {
  role: 'user' | 'assistant' | 'system';
  content?: string;
  parts?: Array<{ type: string; text?: string }>;
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

export async function POST(req: NextRequest) {
  // --- Rate limiting ---
  const clientId = getClientIdentifier(req);
  const rl = checkRateLimit(clientId, AUTHOR_RATE_LIMIT);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests. Please slow down.',
        retryAfter: Math.ceil((rl.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(AUTHOR_RATE_LIMIT.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rl.resetTime).toISOString(),
          'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)),
        },
      },
    );
  }

  try {
    const body = await req.json();
    const {
      messages,
      bookSlug,
      currentChapter,
      model: requestedModel,
    } = body as {
      messages: AuthorChatMessage[];
      bookSlug?: string;
      currentChapter?: string;
      model?: string;
    };

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // --- Resolve API key ---
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        'No Anthropic API key configured. Set ANTHROPIC_API_KEY on Vercel.',
        { status: 503, headers: { 'Content-Type': 'text/plain' } },
      );
    }

    // --- Load book context ---
    const bookContext = bookSlug ? await loadBookContext(bookSlug, currentChapter) : '';

    // --- Create model ---
    const anthropic = createAnthropic({ apiKey });
    const modelId = requestedModel === 'sonnet'
      ? 'claude-sonnet-4-20250514'
      : 'claude-haiku-4-5-20251001';

    // --- Normalize messages ---
    const normalizedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: extractMessageText(msg),
    }));

    // --- Stream response ---
    const result = streamText({
      model: anthropic(modelId),
      system: AUTHOR_SYSTEM_PROMPT + bookContext,
      messages: normalizedMessages,
      temperature: 0.7,
      maxOutputTokens: 8192,
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'x-arcanea-service': 'author-companion',
        'x-arcanea-book': bookSlug || '',
        'x-arcanea-model': modelId,
      },
    });
  } catch (error) {
    console.error('Author chat API error:', error);

    const message = error instanceof Error ? error.message : 'Internal server error';

    if (message.includes('API key') || message.includes('401') || message.includes('403')) {
      return new Response(
        'Invalid API key. Check ANTHROPIC_API_KEY.',
        { status: 401, headers: { 'Content-Type': 'text/plain' } },
      );
    }

    return new Response(message, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Health check
export async function GET() {
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
  return NextResponse.json({
    status: hasKey ? 'ok' : 'no-api-key',
    service: 'arcanea-author-companion',
  });
}
