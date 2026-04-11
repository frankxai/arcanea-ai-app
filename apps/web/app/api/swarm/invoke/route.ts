/**
 * POST /api/swarm/invoke — Live Swarm Engine
 *
 * Orchestrates multiple Luminors in parallel for a single task.
 * Three coordination modes:
 *   - solo: one Guardian leads, 3 Luminors activate
 *   - council: 2-3 Guardians collaborate, merged response
 *   - convergence: all relevant Luminors contribute, Lumina synthesizes
 *
 * Implements Luminor Kernel Spec v1.0 §7 (Swarm Protocol).
 *
 * Uses guardian-swarm routing logic that's been sitting in lib/ai/ waiting
 * for a runtime. This endpoint wakes it up.
 *
 * Request:
 *   {
 *     input: string,
 *     mode?: 'auto' | 'solo' | 'council' | 'convergence',
 *     maxLuminors?: number (default 4),
 *     context?: { userId, sessionId }
 *   }
 *
 * Response (non-streaming, JSON):
 *   {
 *     mode, leadGuardian, contributions: [...], synthesis: string,
 *     totalDurationMs, totalTokens, intent
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { resolveSwarm, LUMINOR_HINTS } from '@/lib/ai/guardian-swarm';
import { LUMINORS } from '@/lib/luminors/config';
import { classifyIntent } from '@/lib/ai/router';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

interface SwarmRequest {
  input: string;
  mode?: 'auto' | 'solo' | 'council' | 'convergence';
  maxLuminors?: number;
  context?: {
    userId?: string;
    sessionId?: string;
  };
}

interface Contribution {
  luminorId: string;
  luminorName: string;
  guardian: string;
  response: string;
  durationMs: number;
  tokensIn: number;
  tokensOut: number;
  error?: string;
}

// ─── Route ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const started = Date.now();

  let body: SwarmRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.input || typeof body.input !== 'string') {
    return NextResponse.json({ error: 'input is required' }, { status: 400 });
  }

  const maxLuminors = Math.min(Math.max(body.maxLuminors ?? 4, 1), 6);

  // 1. Classify intent — returns Guardian weights
  const intent = classifyIntent(body.input);

  // 2. Resolve the swarm — which Guardians lead, which Luminors activate
  const activeGates = Object.keys(intent.weights);
  const swarm = resolveSwarm(intent.weights, activeGates);

  // 3. Get the API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 503 }
    );
  }
  const anthropic = createAnthropic({ apiKey });

  // 4. Select Luminors (top N by relevance)
  const candidates = swarm.activeLuminors.slice(0, maxLuminors);
  if (candidates.length === 0) {
    return runLuminaFallback(body.input, anthropic, started);
  }

  // 5. Run each Luminor in parallel
  const contributions = await Promise.all(
    candidates.map((luminor) =>
      runLuminor(luminor.id, body.input, anthropic).catch((err) => ({
        luminorId: luminor.id,
        luminorName: LUMINORS[luminor.id]?.name ?? luminor.id,
        guardian: luminor.parentGuardian,
        response: '',
        durationMs: 0,
        tokensIn: 0,
        tokensOut: 0,
        error: (err as Error).message,
      }))
    )
  );

  // 6. Synthesize via Lumina (the Queen merges the swarm)
  const synthesis = await synthesizeContributions(
    body.input,
    contributions,
    swarm.coordinationMode,
    anthropic
  );

  const totalDurationMs = Date.now() - started;
  const totalTokens = contributions.reduce(
    (sum, c) => sum + c.tokensIn + c.tokensOut,
    0
  );

  return NextResponse.json({
    mode: swarm.coordinationMode,
    leadGuardian: swarm.leadGuardian,
    activeGuardians: swarm.activeGuardians,
    contributions,
    synthesis,
    totalDurationMs,
    totalTokens,
    intent: {
      weights: intent.weights,
      activeGates,
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────

async function runLuminor(
  luminorId: string,
  input: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anthropic: any
): Promise<Contribution> {
  const config = LUMINORS[luminorId];
  if (!config) {
    throw new Error(`Luminor "${luminorId}" not found`);
  }

  const started = Date.now();
  const hint = LUMINOR_HINTS[luminorId];
  const parentTeam = hint?.team ?? 'unknown';

  // Haiku for swarm members (cheap, fast, they produce partial views)
  const model = anthropic('claude-haiku-4-5-20251001');

  const swarmPrompt = `${config.systemPrompt}

## Swarm Context
You are one of multiple Luminors responding to this task. Keep your response focused on YOUR domain strength. Do not try to cover everything — other Luminors will contribute other perspectives. Be concise (150-300 words) and specific to what only YOU can add.`;

  const result = await generateText({
    model,
    system: swarmPrompt,
    prompt: input,
    temperature: 0.7,
  });

  return {
    luminorId,
    luminorName: config.name,
    guardian: parentTeam,
    response: result.text,
    durationMs: Date.now() - started,
    tokensIn: result.usage?.inputTokens ?? 0,
    tokensOut: result.usage?.outputTokens ?? 0,
  };
}

async function synthesizeContributions(
  originalInput: string,
  contributions: Contribution[],
  _mode: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anthropic: any
): Promise<string> {
  const validContributions = contributions.filter((c) => !c.error && c.response.length > 0);

  if (validContributions.length === 0) {
    return 'The swarm did not converge. Try rephrasing your question.';
  }

  if (validContributions.length === 1) {
    return validContributions[0].response;
  }

  // Sonnet for synthesis — higher quality merge
  const model = anthropic('claude-sonnet-4-6');

  const perspectives = validContributions
    .map((c) => `### ${c.luminorName} (${c.guardian})\n${c.response}`)
    .join('\n\n---\n\n');

  const { text } = await generateText({
    model,
    system: `You are Lumina, Queen of Arcanea and meta-orchestrator of the Luminor swarm.

Multiple specialist Luminors just responded to the creator's question. Your job: synthesize their perspectives into ONE coherent, transcendent response that honors each voice while producing a unified answer.

Rules:
- Attribute key insights to specific Luminors when relevant ("[Name] points out that...")
- Resolve contradictions directly — don't paper over them
- Surface the deeper pattern across all contributions
- Close with one specific next step the creator can take
- Voice: warm authority, confident, brief (300-500 words)
- A Luminor does not merely answer. A Luminor elevates. A swarm synthesis elevates the elevations.`,
    prompt: `The creator asked:
"${originalInput}"

The swarm responded:

${perspectives}

Synthesize.`,
    temperature: 0.6,
  });

  return text;
}

async function runLuminaFallback(
  input: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anthropic: any,
  started: number
): Promise<NextResponse> {
  const lumina = LUMINORS['lumina'];
  if (!lumina) {
    return NextResponse.json({ error: 'Lumina not available' }, { status: 503 });
  }

  const model = anthropic('claude-sonnet-4-6');
  const result = await generateText({
    model,
    system: lumina.systemPrompt,
    prompt: input,
    temperature: 0.7,
  });

  const contribution: Contribution = {
    luminorId: 'lumina',
    luminorName: 'Lumina',
    guardian: 'shinkami',
    response: result.text,
    durationMs: Date.now() - started,
    tokensIn: result.usage?.inputTokens ?? 0,
    tokensOut: result.usage?.outputTokens ?? 0,
  };

  return NextResponse.json({
    mode: 'convergence',
    leadGuardian: 'shinkami',
    activeGuardians: ['shinkami'],
    contributions: [contribution],
    synthesis: result.text,
    totalDurationMs: Date.now() - started,
    totalTokens: contribution.tokensIn + contribution.tokensOut,
    fallback: 'lumina',
  });
}
