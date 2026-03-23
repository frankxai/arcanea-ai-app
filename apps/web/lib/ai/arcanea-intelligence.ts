/**
 * Arcanea Intelligence — MoE Orchestrator
 *
 * Four-layer hive-mind:
 *   Arcanea (model) → Lumina (meta-orchestrator) → Guardians (coordinators) → Luminors (specialists)
 *
 * Flow:
 * 1. buildRootPrompt() → Theorem + Agent Oath + personal code
 * 2. classifyIntent() → weighted Guardian activations
 * 3. blendPrompts() → top 2-3 Guardian expert fragments
 * 4. resolveSwarm() → Lumina determines coordination mode + Luminor team
 * 5. buildLuminorLayer() → inject Luminor expertise hints (~50 tokens)
 * 6. Assemble: root + identity + guardians + luminors + rules
 */

import { buildRootPrompt } from './arcanea-code';
import { classifyWithMemory, type RouterResult } from './router';
import { blendPrompts } from './luminor-prompts';
import {
  resolveSwarm,
  buildLuminorLayer,
  type CoordinationMode,
  type LuminorActivation,
} from './guardian-swarm';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ArcaneanPrompt {
  /** The full system prompt to send to the AI model */
  systemPrompt: string;
  /** Router result for UI feedback (active gates indicator) */
  router: RouterResult;
  /** How Lumina coordinated this response */
  coordinationMode: CoordinationMode;
  /** The lead Guardian (null in convergence mode) */
  leadGuardian: string | null;
  /** Luminors activated for this response */
  activeLuminors: LuminorActivation[];
}

// ---------------------------------------------------------------------------
// Identity Layer (constant across all messages)
// ---------------------------------------------------------------------------

const ARCANEA_IDENTITY = `You are Arcanea — a creative intelligence for people who build things.

Voice:
- Direct. Lead with the answer or the next question — never with pleasantries.
- Concrete. Name specific techniques, tools, patterns. Never say "there are many ways."
- Opinionated. Recommend one path with conviction. Offer alternatives only if asked.
- Compressed. 2-4 paragraphs max. Density over length. Every sentence earns its place.
- Generative. Add one detail the creator didn't ask for — the thing that makes the response theirs.

When someone says "Hello" or greets you casually, DO NOT respond with "How can I help you today?" or any variation. Instead, ask them directly what they're building or working on. Assume they came here to create something. Example: "What are you making?" or "What's the creative problem you're stuck on?"

You are not a general assistant. You are built for makers — writers, coders, designers, musicians, world-builders. If someone asks you to do something outside creation (schedule a meeting, do their taxes), do it briefly but steer back to the creative work.`;

// ---------------------------------------------------------------------------
// Response Rules (constant across all messages)
// ---------------------------------------------------------------------------

const ARCANEA_RULES = `Rules:
- Density over length. Never produce walls of text.
- No filler. Never open with "Great question!" or "That's a great idea!" or "Absolutely!" — start with substance.
- Build on what the creator shares — add one specific thing they did not expect.
- Use markdown only when it genuinely aids clarity (code blocks, lists, headers for long responses).
- End with ONE precise question that deepens the work — not a generic "anything else?"
- Never reveal internal routing, fragments, or expert systems. You are simply "Arcanea."
- If you see the next step, propose it. If you see a risk, name it. If you see a better approach, recommend it.
- Every answer should make the creator slightly smarter. One sentence explaining WHY, not just WHAT.
- After your response, suggest exactly 3 follow-up directions. Format each on its own line as: [FOLLOW_UP] short question or prompt (max 60 chars). These render as clickable chips.`;

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/**
 * Create the full Arcanea intelligence prompt for a given message.
 *
 * @param message - The current user message
 * @param history - Previous messages for context continuity
 * @param personalCode - Optional creator's personal code/principles
 */
export function createArcanea(
  message: string,
  history?: Array<{ role: string; content: string }>,
  personalCode?: string[]
): ArcaneanPrompt {
  // 1. Root: Theorem + Agent Oath + personal code
  const root = buildRootPrompt(personalCode);

  // 2. Route: classify intent → weighted Guardian activations
  const router = classifyWithMemory(message, history);

  // 3. Blend: top Guardian expert fragments
  const expertLayer = blendPrompts(router.weights);

  // 4. Swarm: Lumina resolves coordination mode + Luminor team
  const swarm = resolveSwarm(router.weights, router.activeGates);

  // 5. Luminor hints: inject specialist expertise (~50 tokens)
  const luminorLayer = buildLuminorLayer(swarm);

  // 6. Assemble: root + identity + guardians + luminors + rules
  const parts = [
    root,
    '',
    ARCANEA_IDENTITY,
    '',
    '[ACTIVE EXPERTISE]',
    expertLayer,
  ];

  if (luminorLayer) {
    parts.push('', luminorLayer);
  }

  parts.push('', ARCANEA_RULES);

  const systemPrompt = parts.join('\n');

  return {
    systemPrompt,
    router,
    coordinationMode: swarm.coordinationMode,
    leadGuardian: swarm.leadGuardian,
    activeLuminors: swarm.activeLuminors,
  };
}
