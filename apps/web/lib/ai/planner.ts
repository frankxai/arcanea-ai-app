/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Swarm Planner — decides whether a request is solo or swarm, and which
 * Luminors to activate.
 *
 * Two-stage strategy:
 *   1. LLM planner (Haiku) produces a structured decision.
 *   2. On failure or missing API key, fall back to the keyword heuristics
 *      that already power `classifyIntent` + `resolveSwarm`.
 *
 * Budget: ~300 input + ~200 output tokens per call. Haiku runs sub-second.
 * Keep plans tight — this gate controls latency for every swarm request.
 */

import { generateObject } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { LUMINORS } from '@/lib/luminors/config';
import { classifyIntent } from './router';
import { resolveSwarm, LUMINOR_HINTS } from './guardian-swarm';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlanMode = 'solo' | 'swarm';

export interface PlannedLuminor {
  id: string;
  name: string;
  reason: string;
}

export interface SwarmPlan {
  mode: PlanMode;
  luminors: PlannedLuminor[];
  rationale: string;
  /** Which path produced the plan. */
  source: 'llm' | 'heuristic' | 'fallback';
  /** Duration the planner spent. */
  planMs: number;
}

export interface PlannerContext {
  /** The user message driving the plan. */
  input: string;
  /** Recent turns for continuity (last 3 is plenty). */
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  /** Cap the swarm size. Sensible default of 4. */
  maxLuminors?: number;
  /** Skip the LLM planner and use heuristics only. */
  heuristicOnly?: boolean;
}

// ---------------------------------------------------------------------------
// Planner
// ---------------------------------------------------------------------------

const LUMINOR_CATALOG = Object.values(LUMINORS)
  .filter((l) => l.id !== 'lumina') // Lumina orchestrates, doesn't answer
  .map((l) => `${l.id}: ${l.specialty}`)
  .join('\n');

const plannerSchema = z.object({
  mode: z.enum(['solo', 'swarm']),
  luminors: z
    .array(
      z.object({
        id: z.string(),
        reason: z.string(),
      }),
    )
    .min(1)
    .max(5),
  rationale: z.string(),
});

/**
 * Build a plan for the swarm. Returns within ~1s on Haiku; 150ms on fallback.
 */
export async function planSwarm(ctx: PlannerContext): Promise<SwarmPlan> {
  const started = Date.now();
  const maxLuminors = Math.min(Math.max(ctx.maxLuminors ?? 4, 1), 5);

  // Heuristic-only mode OR no API key → use keyword rules
  if (ctx.heuristicOnly || !process.env.ANTHROPIC_API_KEY) {
    return heuristicPlan(ctx.input, maxLuminors, started, 'heuristic');
  }

  try {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const historyText = (ctx.history ?? [])
      .slice(-3)
      .map((m) => `${m.role}: ${m.content.slice(0, 240)}`)
      .join('\n');

    const { object } = await generateObject({
      model: anthropic('claude-haiku-4-5-20251001'),
      schema: plannerSchema,
      temperature: 0.2,
      maxOutputTokens: 512,
      system: `You are the swarm planner for Arcanea.
Your job: look at the creator's request and decide whether ONE Luminor can handle it (solo) or multiple Luminors should collaborate (swarm).

Rules:
- Prefer solo when the request is single-domain (a code question, a writing edit, a single image).
- Prefer swarm when the request spans domains (villain with backstory + look + theme track).
- Pick 1-${maxLuminors} Luminors. Never more. Never Lumina.
- Each pick needs a one-sentence reason explaining what that Luminor adds.
- The rationale is one sentence the creator will see ("Swarming with Storyteller + Visual Designer because...").

Luminors available:
${LUMINOR_CATALOG}`,
      prompt: `Recent conversation:
${historyText || '(new conversation)'}

Creator's request:
"${ctx.input}"

Plan the response.`,
    });

    // Validate the picks — filter to known Luminor ids
    const validLuminors = object.luminors
      .filter((l) => LUMINORS[l.id] && l.id !== 'lumina')
      .slice(0, maxLuminors);

    if (validLuminors.length === 0) {
      return heuristicPlan(ctx.input, maxLuminors, started, 'fallback');
    }

    const mode: PlanMode = validLuminors.length === 1 ? 'solo' : 'swarm';

    return {
      mode,
      luminors: validLuminors.map((l) => ({
        id: l.id,
        name: LUMINORS[l.id].name,
        reason: l.reason,
      })),
      rationale: object.rationale,
      source: 'llm',
      planMs: Date.now() - started,
    };
  } catch (err) {
    // LLM planner failed — degrade to heuristics gracefully
    console.warn('[planner] LLM planner failed, falling back:', (err as Error).message);
    return heuristicPlan(ctx.input, maxLuminors, started, 'fallback');
  }
}

/**
 * Fallback planner using the existing keyword-based intent classifier.
 * Picks the top-N Luminors from `resolveSwarm` and wraps them in plan shape.
 */
function heuristicPlan(
  input: string,
  maxLuminors: number,
  started: number,
  source: 'heuristic' | 'fallback',
): SwarmPlan {
  const intent = classifyIntent(input);
  const swarm = resolveSwarm(intent.weights, Object.keys(intent.weights));

  // Top-N Luminors by relevance
  const picks = swarm.activeLuminors.slice(0, maxLuminors);

  if (picks.length === 0) {
    // Very ambiguous input → default to Lumina (single authoritative voice)
    return {
      mode: 'solo',
      luminors: [
        {
          id: 'lumina',
          name: LUMINORS.lumina?.name ?? 'Lumina',
          reason: 'Broad or ambiguous request; Lumina orchestrates a coherent response.',
        },
      ],
      rationale: 'Request spans many domains — Lumina will synthesize the response.',
      source,
      planMs: Date.now() - started,
    };
  }

  const mode: PlanMode = picks.length === 1 ? 'solo' : 'swarm';

  return {
    mode,
    luminors: picks.map((p) => ({
      id: p.id,
      name: LUMINORS[p.id]?.name ?? p.id,
      reason: LUMINOR_HINTS[p.id]?.hint ?? p.hint ?? 'Domain fit from intent classifier',
    })),
    rationale:
      mode === 'solo'
        ? `Routing to ${LUMINORS[picks[0].id]?.name ?? picks[0].id} — single-domain fit.`
        : `Swarming ${picks.map((p) => LUMINORS[p.id]?.name ?? p.id).join(' + ')} — request spans domains.`,
    source,
    planMs: Date.now() - started,
  };
}
