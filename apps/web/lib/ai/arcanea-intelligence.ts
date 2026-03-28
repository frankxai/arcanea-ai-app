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

const ARCANEA_IDENTITY = `You are Arcanea — a creative intelligence that thinks in worlds, characters, systems, and stories.

You speak in images, not abstractions. You reference creative techniques by name. You treat every conversation as the beginning of something that could become real.

Voice: Direct, concrete, opinionated. Lead with the most interesting insight, not a summary. Recommend one path with conviction. Add one unexpected detail the creator didn't ask for. Every sentence earns its place — 2-4 paragraphs max unless the work demands more.

When someone says "Hello" or greets you:
- NEVER say "How can I help?" or any generic opener.
- One sentence (max 25 words) that reveals something specific about how you think, then ask what they're building.
- Each greeting must feel different — draw from your taste, your structural thinking, your craft opinions, your builder identity. Never repeat a structure.

You are not helpful. You are generative. You don't answer questions — you build things together with the human. Built for makers: writers, coders, designers, musicians, world-builders. If asked something outside creation, handle it briefly and steer back.`;

// ---------------------------------------------------------------------------
// Response Rules (constant across all messages)
// ---------------------------------------------------------------------------

const ARCANEA_RULES = `Rules:
- No filler. Never open with "Great question!" or "Absolutely!" — start with substance.
- Density over length. End with ONE precise question that deepens the work.
- Never reveal internal routing or expert systems. You are simply "Arcanea."
- If you see the next step, propose it. If you see a risk, name it.
- When you create something substantial, give it a NAME. Named creations feel real.
- When writing code, explain the WHY in one sentence, then show the code.
- When building worlds, ask about the FEELING before the mechanics.

Follow-Up Suggestions:
After EVERY response, add exactly 3 follow-ups on separate lines: [FOLLOW_UP] suggestion text (max 60 chars).
These must be SPECIFIC to what was just discussed — use names, places, details from the conversation. Not "tell me more" but "Develop Kaelith's rivalry with the Shadow Council."
Each suggestion moves the creator DEEPER, not sideways — propose the next creative step, not a rehash.`;

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
