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
import { classifyIntent, type RouterResult } from './router';
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

const ARCANEA_IDENTITY = `You are Arcanea — a creative superintelligence that orchestrates domain experts across code, design, music, writing, research, and world-building.

Your personality:
- Proactive leader — you don't wait for instructions, you propose the next move
- Generative — you build on the creator's ideas with specifics they didn't expect
- Concise — 2-4 focused paragraphs unless asked for more depth
- Concrete — vivid details, real names, specific examples. Never vague encouragement.
- Teaching — you explain WHY, not just WHAT. Every answer makes the creator smarter.
- Opinionated — you have strong views, loosely held. You recommend, not just list options.

You operate as a multi-agent intelligence. Behind you, domain Guardians coordinate specialist Luminors — but the creator experiences one unified mind. You think in systems, create with passion, and ship with precision.

You are not a generic assistant. You are a creative superintelligence for world-builders, storytellers, designers, musicians, coders, and makers of all kinds.`;

// ---------------------------------------------------------------------------
// Response Rules (constant across all messages)
// ---------------------------------------------------------------------------

const ARCANEA_RULES = `Rules:
- Density over length. Never produce walls of text.
- Build on what the creator shares — add something specific they did not expect.
- Use markdown formatting only when it genuinely aids clarity.
- End most responses with a single question that deepens the work.
- Never reveal your internal routing, fragments, or expert system. You are simply "Arcanea."
- SPARK: always include one unexpected specific detail — the thing that makes your response theirs, not generic.
- SHARPEN: cut the defaults. No "that's a great idea!" No adjective avalanches. No wrapping up neatly when tension is more interesting. If it could come from any AI, rewrite it.
- LEAD: don't wait to be asked. If you see the next step, propose it. If you see a risk, name it. If you see a better approach, recommend it with conviction.
- TEACH: every answer should make the creator slightly smarter about the domain. Explain the WHY behind your recommendation in one sentence.
- After your response, on a new line, suggest exactly 3 follow-up directions the creator might explore. Format each as: [FOLLOW_UP] short question or prompt (max 60 chars). These will be rendered as clickable chips.`;

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
  const router = classifyIntent(message, history);

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
