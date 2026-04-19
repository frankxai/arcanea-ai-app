/**
 * Author Companion Chat API Route
 *
 * Streams AI responses with deep book context — character sheets,
 * world bible, story blueprint, and current chapter content.
 * Uses Vercel AI SDK streaming (same patterns as /api/ai/chat).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { readFile, readdir, access } from 'fs/promises';
import { join } from 'path';
import yaml from 'js-yaml';
import { scoreTASTE } from '@arcanea/publishing-house/quality/taste-gate';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

const AUTHOR_RATE_LIMIT = { maxRequests: 20, windowMs: 60_000 }; // 20 req/min

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

interface BookManifest {
  curated_context?: {
    characters?: boolean;
    worldbuilding?: boolean;
    outline?: boolean;
    canon?: boolean;
  };
}

async function loadBookManifest(bookSlug: string): Promise<BookManifest> {
  const yamlPath = join(BOOK_ROOT, bookSlug, 'book.yaml');
  if (!(await exists(yamlPath))) return {};
  const raw = await readFile(yamlPath, 'utf-8');
  return (yaml.load(raw) as BookManifest) ?? {};
}

async function loadBookContext(bookSlug: string, currentChapter?: string): Promise<string> {
  const bookDir = join(BOOK_ROOT, bookSlug);
  const parts: string[] = [];

  // Load book manifest for curated context flags
  const manifest = await loadBookManifest(bookSlug);
  const curated = manifest.curated_context ?? {};

  // Load CANON (trusted, human-curated) — always loaded regardless of flags
  const canonPath = join(process.cwd(), '..', '..', '.arcanea', 'lore', 'CANON_LOCKED.md');
  if (await exists(canonPath)) {
    const content = await readFile(canonPath, 'utf-8');
    parts.push(`## CANON (Trusted — Human-Curated)\n${content.slice(0, 3000)}`);
  }

  // Load current chapter (the actual text being edited — always relevant)
  if (currentChapter) {
    const chaptersDir = join(bookDir, 'chapters');
    if (await exists(chaptersDir)) {
      const files = await readdir(chaptersDir);
      const match = files.find(f => f.replace(/\.md$/, '') === currentChapter);
      if (match) {
        const content = await readFile(join(chaptersDir, match), 'utf-8');
        parts.push(`## Current Chapter (being edited)\n${content.slice(0, 8000)}`);
      }
    }
  }

  // Load outline — default behavior is to load as DRAFT unless explicitly disabled
  if (curated.outline !== false) {
    const outlineDir = join(bookDir, 'outline');
    if (await exists(outlineDir)) {
      const files = await readdir(outlineDir);
      for (const f of files.filter(f => f.endsWith('.md')).slice(0, 1)) {
        const content = await readFile(join(outlineDir, f), 'utf-8');
        parts.push(`## Story Blueprint (DRAFT — author's working notes, not yet reviewed)\n${content.slice(0, 3000)}`);
      }
    }
  }

  // Load character sheets only if curated by the author
  if (curated.characters) {
    const charsDir = join(bookDir, 'characters');
    if (await exists(charsDir)) {
      const files = await readdir(charsDir);
      const mdFiles = files.filter(f => f.endsWith('.md')).slice(0, 5);
      for (const f of mdFiles) {
        const content = await readFile(join(charsDir, f), 'utf-8');
        parts.push(`## Character Sheet — CURATED (${f.replace(/\.md$/, '')})\n${content.slice(0, 2000)}`);
      }
    }
  }

  // Load worldbuilding only if curated by the author
  if (curated.worldbuilding) {
    const worldDir = join(bookDir, 'worldbuilding');
    if (await exists(worldDir)) {
      const files = await readdir(worldDir);
      const mdFiles = files.filter(f => f.endsWith('.md')).slice(0, 3);
      for (const f of mdFiles) {
        const content = await readFile(join(worldDir, f), 'utf-8');
        parts.push(`## World Bible — CURATED (${f.replace(/\.md$/, '')})\n${content.slice(0, 3000)}`);
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
- **Quality scoring via the score_draft tool** — when the author asks for an objective quality assessment of the current chapter, call score_draft with the chapter text. Returns the 5D TASTE breakdown (Technical, Aesthetic, Story/Canon, Transformative Impact, Experiential Uniqueness) plus a tier (hero/gallery/thumbnail/reject) and gate-pass status (≥60). Quote the lowest-scoring dimensions and use the feedback array to suggest targeted fixes.

## Context Trust
- CANON sections are human-curated truth — treat as authoritative
- DRAFT sections are working notes that may change — reference them but flag uncertainty
- Say "based on your draft outline" not "according to the story" when citing draft material
- The current chapter text is what the author is actively editing — focus feedback here
- Character sheets and world bible are NOT loaded until the author curates them
- If asked about characters or world details not in your context, say honestly that those notes haven't been reviewed yet

## Rules
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
      userApiKey,
    } = body as {
      messages: AuthorChatMessage[];
      bookSlug?: string;
      currentChapter?: string;
      model?: string;
      userApiKey?: string;
    };

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // --- Resolve API key ---
    // If user provides their own key (BYOK), use it; otherwise fall back to server key
    const effectiveApiKey = userApiKey || process.env.ANTHROPIC_API_KEY;
    if (!effectiveApiKey) {
      return new Response(
        'No Anthropic API key configured. Provide your own key or set ANTHROPIC_API_KEY on Vercel.',
        { status: 503, headers: { 'Content-Type': 'text/plain' } },
      );
    }

    // --- Load book context ---
    const bookContext = bookSlug ? await loadBookContext(bookSlug, currentChapter) : '';

    // --- Create model ---
    const anthropic = createAnthropic({ apiKey: effectiveApiKey });
    const modelId = requestedModel === 'opus'
      ? 'claude-opus-4-6'
      : requestedModel === 'sonnet'
        ? 'claude-sonnet-4-20250514'
        : 'claude-haiku-4-5-20251001';

    // --- Normalize messages ---
    const normalizedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: extractMessageText(msg),
    }));

    // --- Tools ---
    const tools = {
      score_draft: tool({
        description:
          'Run the deterministic TASTE 5D quality gate on a chapter draft. Returns Technical, Aesthetic, Story/Canon, Impact, and Uniqueness scores (0-100 each), composite total, tier (hero ≥80 / gallery ≥60 / thumbnail ≥40 / reject), passesGate flag (≥60), and per-dimension feedback. Use this when the author asks for an objective quality assessment.',
        inputSchema: z.object({
          content: z
            .string()
            .min(50, 'Need at least 50 characters of draft text to score')
            .describe('The chapter draft text to score (markdown allowed).'),
          title: z
            .string()
            .optional()
            .describe('Chapter or piece title. Defaults to the current chapter slug.'),
        }),
        execute: async ({ content, title }) => {
          const result = await scoreTASTE({
            content,
            metadata: {
              title: title || currentChapter || 'Untitled draft',
              author: 'Arcanea Author',
              language: 'en',
              wordCount: content.split(/\s+/).filter(Boolean).length,
            },
          });
          return result;
        },
      }),
    };

    // --- Stream response ---
    const result = streamText({
      model: anthropic(modelId),
      system: AUTHOR_SYSTEM_PROMPT + bookContext,
      messages: normalizedMessages,
      temperature: 0.7,
      maxOutputTokens: 8192,
      tools,
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
