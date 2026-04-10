/**
 * Deep Research SSE Endpoint
 *
 * Accepts a research question and streams progress events as the engine
 * decomposes, searches, and synthesizes a report.
 *
 * POST /api/ai/research
 * Body: { question: string, maxSearches?: number }
 *
 * Response: Server-Sent Events stream
 */

import { NextRequest } from 'next/server';
import { conductResearch } from '@/lib/ai/research';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

export const runtime = 'edge';
export const maxDuration = 120;

// Research is expensive — strict rate limit to prevent abuse
const RESEARCH_RATE_LIMIT = { maxRequests: 5, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  // Rate limit check
  const clientId = getClientIdentifier(req);
  const rl = checkRateLimit(clientId, RESEARCH_RATE_LIMIT);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Try again in a minute.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)),
        },
      }
    );
  }

  let body: { question?: string; maxSearches?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { question, maxSearches = 5 } = body;

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: 'A non-empty "question" field is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        send({
          step: 'planning',
          detail: 'Analyzing your question and planning research strategy...',
          progress: 5,
        });

        const clampedMax = Math.min(Math.max(maxSearches ?? 5, 1), 10);

        send({
          step: 'searching',
          detail: `Searching up to ${clampedMax} sources in parallel...`,
          progress: 20,
        });

        const result = await conductResearch(question.trim(), clampedMax);

        send({
          step: 'synthesizing',
          detail: 'Compiling findings into a structured report...',
          progress: 85,
        });

        send({
          step: 'complete',
          detail: 'Research complete',
          progress: 100,
          data: result,
        });

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error: unknown) {
        console.error('Research stream error:', error);
        send({ step: 'error', detail: 'Research failed. Please try again.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
