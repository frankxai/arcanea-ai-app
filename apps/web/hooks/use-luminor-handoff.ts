/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

/**
 * useLuminorHandoff — watches chat messages for a `luminor_handoff` tool
 * output and triggers a seamless agent switch + brief re-submission.
 *
 * Flow:
 *   1. Model calls handoff_to_luminor → tool execute returns
 *      { type: 'luminor_handoff', to, reason, brief }
 *   2. This hook detects the payload on the latest assistant message
 *   3. Loads the target Luminor config from getLuminor()
 *   4. Calls onSelectLuminor() to switch the active agent
 *   5. Calls onSendMessage() with the brief prefixed by a marker so the
 *      new Luminor knows it was handed off to
 *   6. Marks the handoff id as consumed so it doesn't fire twice
 */

import { useEffect, useRef } from 'react';
import { getLuminor, type LuminorConfig } from '@/lib/luminors/config';
import type { UIMessage } from 'ai';

export interface LuminorHandoffPayload {
  type: 'luminor_handoff';
  to: string;
  reason: string;
  brief: string;
}

interface MessagePartLike {
  type?: string;
  toolCallId?: string;
  state?: string;
  output?: unknown;
}

function extractHandoffPayload(
  message: UIMessage,
): { payload: LuminorHandoffPayload; toolCallId: string } | null {
  // UIMessage.parts can contain tool-<name> parts with state='output-available'.
  const parts = (message as unknown as { parts?: MessagePartLike[] }).parts;
  if (!Array.isArray(parts)) return null;

  for (const part of parts) {
    const type = part?.type;
    if (typeof type !== 'string') continue;
    const isNamedTool = type.startsWith('tool-');
    const isDynamicTool = type === 'dynamic-tool';
    if (!isNamedTool && !isDynamicTool) continue;
    if (part.state !== 'output-available') continue;
    const output = part.output as unknown;
    if (
      output &&
      typeof output === 'object' &&
      (output as { type?: string }).type === 'luminor_handoff'
    ) {
      const p = output as LuminorHandoffPayload;
      const toolCallId =
        typeof part.toolCallId === 'string' ? part.toolCallId : `${type}-${JSON.stringify(p).slice(0, 40)}`;
      if (p.to && p.brief) return { payload: p, toolCallId };
    }
  }
  return null;
}

export interface UseLuminorHandoffOptions {
  messages: UIMessage[];
  isStreaming?: boolean;
  onSelectLuminor: (luminor: LuminorConfig) => void;
  onSendMessage: (text: string) => void;
  /** Current active Luminor id — if the handoff targets the same one, skip */
  currentLuminorId?: string | null;
  /** Notify UI so it can show a handoff banner or toast */
  onHandoff?: (payload: LuminorHandoffPayload) => void;
}

export function useLuminorHandoff({
  messages,
  isStreaming = false,
  onSelectLuminor,
  onSendMessage,
  currentLuminorId,
  onHandoff,
}: UseLuminorHandoffOptions) {
  // Track handoff tool-call ids we've already acted on
  const consumedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (isStreaming) return;
    if (!messages.length) return;

    // Walk from newest → find any unconsumed handoff
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role !== 'assistant') continue;
      const extracted = extractHandoffPayload(m);
      if (!extracted) continue;
      if (consumedRef.current.has(extracted.toolCallId)) break;

      const target = getLuminor(extracted.payload.to);
      if (!target) {
        console.warn('[handoff] unknown Luminor:', extracted.payload.to);
        consumedRef.current.add(extracted.toolCallId);
        break;
      }
      if (currentLuminorId === target.id) {
        // Already on target — just mark consumed, no switch needed
        consumedRef.current.add(extracted.toolCallId);
        break;
      }

      consumedRef.current.add(extracted.toolCallId);
      onHandoff?.(extracted.payload);
      onSelectLuminor(target);

      // Re-submit the brief as the new Luminor's starting context.
      // Marker at top so the model knows it's a continuation, not a fresh ask.
      const handoffMessage = [
        `[HANDOFF FROM ${messages[i - 1]?.role === 'assistant' ? 'previous Luminor' : 'orchestrator'}]`,
        `Reason: ${extracted.payload.reason}`,
        '',
        extracted.payload.brief,
      ].join('\n');

      // Small delay so React commits the Luminor switch before sending
      setTimeout(() => {
        onSendMessage(handoffMessage);
      }, 50);

      break;
    }
  }, [messages, isStreaming, currentLuminorId, onSelectLuminor, onSendMessage, onHandoff]);
}
