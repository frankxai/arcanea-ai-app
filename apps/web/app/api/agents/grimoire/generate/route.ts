/**
 * Grimoire Generate — Streaming generation endpoint
 *
 * POST /api/agents/grimoire/generate
 *   Body: { answers: Record<string, string>, tier: string, email: string }
 *   Returns: Streaming text with progress markers + section content
 *
 * Stream format:
 *   [PROGRESS] Generating: <section title>...
 *   [SECTION:<section-id>]
 *   <content>
 *   [/SECTION]
 *   ...
 *   [COMPLETE]
 *
 * Uses Edge runtime for low-latency streaming.
 */

import { NextRequest } from 'next/server';
import {
  runGrimoireOrchestrator,
  type GrimoireInput,
  type GrimoireProgressCallback,
} from '@/lib/agents/grimoire/orchestrator';
import { formatGrimoire } from '@/lib/agents/grimoire/formatter';

export const runtime = 'edge';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_TIERS = new Set<string>(['apprentice', 'mage', 'archmage']);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<Response> {
  // ── 1. Parse body ────────────────────────────────────────────────────────
  let body: { answers?: unknown; tier?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON in request body', { status: 400 });
  }

  // ── 2. Validate inputs ───────────────────────────────────────────────────
  if (
    typeof body.answers !== 'object' ||
    body.answers === null ||
    Array.isArray(body.answers)
  ) {
    return new Response('"answers" must be a non-null object', { status: 400 });
  }

  const rawAnswers = body.answers as Record<string, unknown>;
  const answers: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawAnswers)) {
    if (typeof v === 'string') answers[k] = v;
  }

  if (Object.keys(answers).length === 0) {
    return new Response('"answers" must contain at least one non-empty field', { status: 400 });
  }

  if (typeof body.tier !== 'string' || !VALID_TIERS.has(body.tier)) {
    return new Response(
      `"tier" must be one of: ${[...VALID_TIERS].join(', ')}`,
      { status: 400 },
    );
  }

  if (typeof body.email !== 'string' || !isValidEmail(body.email)) {
    return new Response('"email" must be a valid email address', { status: 400 });
  }

  const input: GrimoireInput = {
    answers,
    tier: body.tier as GrimoireInput['tier'],
    email: body.email,
  };

  // ── 3. Set up TransformStream for streaming ──────────────────────────────
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  function write(text: string): void {
    // Best-effort write — stream may already be closed on client disconnect
    try {
      writer.write(encoder.encode(text));
    } catch {
      // Ignore write-after-close errors
    }
  }

  // ── 4. Run orchestrator in background, streaming progress ────────────────
  (async () => {
    try {
      const onProgress: GrimoireProgressCallback = (event) => {
        if (event.type === 'section-start') {
          write(`[PROGRESS] Generating: ${event.sectionTitle}...\n`);
        } else if (event.type === 'section-complete' && event.content) {
          write(`[SECTION:${event.sectionId}]\n`);
          write(event.content);
          write(`\n[/SECTION]\n\n`);
        } else if (event.type === 'section-error') {
          write(
            `[PROGRESS] Warning: "${event.sectionTitle}" encountered an error — continuing.\n`,
          );
        }
      };

      const result = await runGrimoireOrchestrator(input, onProgress);

      // Stream the formatted full document
      const formatted = formatGrimoire(result, answers);
      write('[GRIMOIRE-DOCUMENT]\n');
      write(formatted);
      write('\n[/GRIMOIRE-DOCUMENT]\n\n');

      // Emit completion with metadata
      write(
        `[COMPLETE] ${JSON.stringify({
          worldName: result.metadata.worldName,
          tier: result.metadata.tier,
          agentsUsed: result.metadata.agentsUsed,
          tokensUsed: result.metadata.tokensUsed,
          generatedAt: result.metadata.generatedAt,
          sectionCount: result.sections.length,
        })}\n`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Grimoire API] Orchestration failed:', message);
      write(`[ERROR] ${message}\n`);
    } finally {
      try {
        await writer.close();
      } catch {
        // Already closed
      }
    }
  })();

  // ── 5. Return streaming response ─────────────────────────────────────────
  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'x-arcanea-grimoire': 'true',
      'x-arcanea-tier': input.tier,
    },
  });
}
