/**
 * handoff_to_luminor — inter-Luminor delegation mid-response.
 *
 * Canonical definition. Replaces the older `lib/luminors/handoff-tool.ts`
 * which performed an external fetch — this shape returns a structured
 * payload the client uses to switch the active Luminor, matching the
 * OpenAI Agents SDK handoff primitive.
 */

import { tool } from 'ai';
import { z } from 'zod';

export const LUMINOR_IDS = [
  'lumina',
  'systems-architect',
  'code-crafter',
  'debugger',
  'visual-designer',
  'composer',
  'motion-designer',
  'storyteller',
  'voice',
  'poet',
  'deep-researcher',
  'strategist',
  'integrator',
] as const;

export type LuminorId = (typeof LUMINOR_IDS)[number];

export const handoffInputSchema = z.object({
  to: z
    .enum(LUMINOR_IDS)
    .describe(
      'Which Luminor to hand off to. Choose based on fit: code-crafter (clean code), debugger (root cause), visual-designer (UI/color), composer (music/audio), motion-designer (animation), storyteller (narrative arcs), voice (copy/naming), poet (lyrics/verse), deep-researcher (synthesis), strategist (direction), integrator (connection), systems-architect (architecture), or lumina (orchestrator when unsure).',
    ),
  reason: z
    .string()
    .min(10)
    .max(400)
    .describe('One sentence: why this specialist is the right next step.'),
  brief: z
    .string()
    .min(10)
    .max(2000)
    .describe(
      'What the target Luminor should pick up with — summarize done work, user wants, and vault context.',
    ),
});

export type HandoffInput = z.infer<typeof handoffInputSchema>;

export function buildHandoffTool() {
  return tool({
    description:
      "Hand off the current conversation to a different specialist Luminor. Use when the next step needs expertise you don't have — e.g., Storyteller drafts a scene, then hands off to Composer for a soundtrack. Returns a structured handoff payload the client uses to switch the active Luminor. Include enough brief so the new Luminor picks up seamlessly.",
    inputSchema: handoffInputSchema,
    execute: async ({ to, reason, brief }: HandoffInput) => {
      return { type: 'luminor_handoff' as const, to, reason, brief };
    },
  });
}
