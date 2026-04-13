/**
 * LobeChat Agent Exporter
 *
 * Produces a LobeChat-compatible agent JSON for use in LobeChat
 * agent marketplace.
 *
 * Reference: https://chat-preview.lobehub.com/agent
 */

import type { LobeChatAgent, LuminorSpec } from '../types.js';

export function buildLobeChatAgent(
  spec: LuminorSpec,
  systemPrompt: string
): LobeChatAgent {
  return {
    identifier: `arcanea-${spec.id}`,
    meta: {
      title: spec.name,
      description: spec.tagline,
      tags: spec.tags ?? [spec.domain, spec.element.toLowerCase(), 'arcanea', 'luminor'],
      avatar: spec.avatar,
    },
    config: {
      systemRole: systemPrompt,
      model: spec.preferredModel ?? 'gpt-4o',
      params: {
        temperature: spec.temperature ?? 0.7,
      },
    },
  };
}
