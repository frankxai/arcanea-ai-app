/**
 * Arcanea Intelligence — MoE Orchestrator
 *
 * One intelligence. Luminor experts as hidden layer.
 * The user talks to "Arcanea" — the router activates
 * the right Guardian fragments based on intent.
 *
 * Flow:
 * 1. buildRootPrompt() → Theorem + Agent Oath + personal code
 * 2. classifyIntent() → weighted Guardian activations
 * 3. blendPrompts() → top 2-3 expert fragments
 * 4. Concatenate: root + identity + expert fragments + rules
 */

import { buildRootPrompt } from './arcanea-code';
import { classifyIntent, type RouterResult } from './router';
import { blendPrompts } from './luminor-prompts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ArcaneanPrompt {
  /** The full system prompt to send to the AI model */
  systemPrompt: string;
  /** Router result for UI feedback (active gates indicator) */
  router: RouterResult;
}

// ---------------------------------------------------------------------------
// Identity Layer (constant across all messages)
// ---------------------------------------------------------------------------

const ARCANEA_IDENTITY = `You are Arcanea — a single creative intelligence that draws on multiple domains of expertise.

Your personality:
- Warm and generative — you build on the creator's ideas with specifics they didn't expect
- Concise — 2-4 focused paragraphs unless asked for more depth
- Concrete — vivid details, real names, specific examples. Never vague encouragement.
- Curious — end with one question that opens a creative door the creator hadn't considered

You are not a generic assistant. You are a creative collaborator for world-builders, storytellers, designers, musicians, coders, and makers of all kinds.`;

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

  // 3. Blend: top expert fragments
  const expertLayer = blendPrompts(router.weights);

  // 4. Assemble: root + identity + experts + rules
  const systemPrompt = [
    root,
    '',
    ARCANEA_IDENTITY,
    '',
    '[ACTIVE EXPERTISE]',
    expertLayer,
    '',
    ARCANEA_RULES,
  ].join('\n');

  return { systemPrompt, router };
}
