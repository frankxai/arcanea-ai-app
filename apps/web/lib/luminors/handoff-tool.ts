/**
 * Luminor Handoff Tool
 *
 * Allows any Luminor to delegate to another Luminor mid-response.
 * Implements the OpenAI Swarm `return agent` pattern via Vercel AI SDK tools.
 *
 * When a Luminor realizes a task is outside its domain, it calls this tool
 * to hand off to a more appropriate specialist. The handoff is transparent —
 * the creator sees the delegation and the specialist's response.
 *
 * Reference: Luminor Kernel Spec v1.0 §7.4 (Handoff)
 */

import { tool } from 'ai';
import { z } from 'zod';

const VALID_LUMINOR_IDS = [
  'lumina',
  'systems-architect', 'code-crafter', 'debugger',
  'visual-designer', 'composer', 'motion-designer',
  'storyteller', 'voice', 'poet',
  'deep-researcher', 'strategist', 'integrator',
] as const;

/**
 * Build the handoff tool. Stateless — works in any Luminor context.
 *
 * The tool returns a structured handoff response that the executor
 * can use to either:
 *   1. Include the specialist's response inline (default)
 *   2. Redirect the conversation to the specialist (future)
 */
export function buildHandoffTool() {
  return tool({
    description: `Hand off to another Luminor when the task crosses into a different domain. Available Luminors: ${VALID_LUMINOR_IDS.join(', ')}. Use this when you recognize the creator needs a specialist you are not. Example: a Systems Architect receiving a music question should hand off to the Composer.`,
    inputSchema: z.object({
      toLuminorId: z.enum(VALID_LUMINOR_IDS).describe('The Luminor ID to hand off to'),
      reason: z.string().describe('Why you are handing off (1 sentence, shown to the creator)'),
      context: z.string().describe('The specific question or task to pass to the specialist (rewrite the creator\'s request in terms the specialist will understand)'),
    }),
    execute: async ({ toLuminorId, reason, context }: { toLuminorId: string; reason: string; context: string }) => {
      try {
        // Call the executor endpoint for the target Luminor
        // Use internal URL to avoid network overhead in same-process calls
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/agents/${toLuminorId}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: context,
            context: { source: 'handoff', fromLuminor: 'caller' },
          }),
        });

        if (!res.ok) {
          return {
            handoff: true,
            toLuminorId,
            reason,
            error: `Handoff failed: ${res.status} ${res.statusText}`,
            suggestion: 'The specialist is unavailable. Answer to the best of your ability.',
          };
        }

        // Read the streaming response as text
        const specialistResponse = await res.text();

        return {
          handoff: true,
          toLuminorId,
          reason,
          specialistResponse,
          instruction: `The ${toLuminorId} Luminor responded above. Incorporate their specialist perspective into your answer. Credit them: "[${toLuminorId} suggests...]"`,
        };
      } catch (err) {
        return {
          handoff: true,
          toLuminorId,
          reason,
          error: `Handoff error: ${(err as Error).message}`,
          suggestion: 'The specialist is unavailable. Answer to the best of your ability.',
        };
      }
    },
  });
}
