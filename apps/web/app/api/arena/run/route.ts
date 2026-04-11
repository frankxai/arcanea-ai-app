/**
 * POST /api/arena/run — Eval Arena runner
 *
 * Runs a Luminor against a benchmark, uses Claude Opus 4.6 as judge,
 * returns a score 0-100 + per-task breakdown.
 *
 * Reference: Luminor Kernel Spec v1.0 §8 (Quality Gates), Sprint 3 plan
 *
 * Request:
 *   { luminorId: string, benchmarkId: string }
 *
 * Response:
 *   {
 *     luminorId, benchmarkId, overallScore,
 *     taskResults: [
 *       { taskId, response, score, judgeNotes }
 *     ],
 *     durationMs, tokensUsed
 *   }
 */

import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { LUMINORS } from '@/lib/luminors/config';
import { BENCHMARKS } from '@/lib/eval/benchmarks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

interface ArenaRequest {
  luminorId: string;
  benchmarkId: string;
}

interface TaskResult {
  taskId: string;
  prompt: string;
  response: string;
  score: number;
  judgeNotes: string;
  durationMs: number;
  tokensIn: number;
  tokensOut: number;
}

export async function POST(request: Request) {
  const started = Date.now();

  let body: ArenaRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const luminor = LUMINORS[body.luminorId];
  if (!luminor) {
    return NextResponse.json(
      { error: `Luminor "${body.luminorId}" not found` },
      { status: 404 }
    );
  }

  const benchmark = BENCHMARKS.find((b) => b.id === body.benchmarkId);
  if (!benchmark) {
    return NextResponse.json(
      { error: `Benchmark "${body.benchmarkId}" not found` },
      { status: 404 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 503 }
    );
  }
  const anthropic = createAnthropic({ apiKey });

  // Sonnet for the Luminor under test (representative quality)
  const testModel = anthropic('claude-sonnet-4-6');
  // Opus for the judge (highest quality evaluation)
  const judgeModel = anthropic('claude-opus-4-6');

  // Run all tasks in parallel for speed
  const taskResults = await Promise.all(
    benchmark.tasks.map(async (task) => {
      const taskStarted = Date.now();

      // 1. Run the Luminor
      const response = await generateText({
        model: testModel,
        system: luminor.systemPrompt,
        prompt: task.prompt,
        temperature: 0.7,
      });

      // 2. Judge the response
      const judgment = await generateText({
        model: judgeModel,
        system: `You are the Luminor Eval Judge. You evaluate agent responses against a rubric and return a JSON object with score (0-100) and notes.

Be strict. A score of 70 is "solid". A score of 90 is "exceptional". Most responses should land in 60-80.

Respond ONLY with valid JSON in this exact format:
{"score": <number 0-100>, "notes": "<1-2 sentence explanation>"}`,
        prompt: `## Rubric
${benchmark.rubric}

## Task
${task.prompt}

## Agent Response
${response.text}

## Your Evaluation (JSON only)`,
        temperature: 0.2,
      });

      // Parse judge output
      let score = 0;
      let judgeNotes = 'Judge failed to return valid JSON';
      try {
        const match = judgment.text.match(/\{[\s\S]*?\}/);
        if (match) {
          const parsed = JSON.parse(match[0]) as { score: number; notes: string };
          score = Math.min(100, Math.max(0, parsed.score));
          judgeNotes = parsed.notes;
        }
      } catch {
        // keep defaults
      }

      return {
        taskId: task.id,
        prompt: task.prompt,
        response: response.text,
        score,
        judgeNotes,
        durationMs: Date.now() - taskStarted,
        tokensIn: response.usage?.inputTokens ?? 0,
        tokensOut: response.usage?.outputTokens ?? 0,
      } satisfies TaskResult;
    })
  );

  const overallScore = Math.round(
    taskResults.reduce((sum, r) => sum + r.score, 0) / taskResults.length
  );

  const tokensUsed = taskResults.reduce(
    (sum, r) => sum + r.tokensIn + r.tokensOut,
    0
  );

  return NextResponse.json({
    luminorId: body.luminorId,
    luminorName: luminor.name,
    benchmarkId: body.benchmarkId,
    benchmarkTitle: benchmark.title,
    overallScore,
    taskResults,
    durationMs: Date.now() - started,
    tokensUsed,
  });
}

export async function GET() {
  return NextResponse.json({
    benchmarks: BENCHMARKS.map((b) => ({
      id: b.id,
      domain: b.domain,
      title: b.title,
      description: b.description,
      taskCount: b.tasks.length,
    })),
  });
}
