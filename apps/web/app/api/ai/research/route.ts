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

export const runtime = 'edge';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
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
        const message =
          error instanceof Error ? error.message : 'Research failed';
        send({ step: 'error', detail: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
