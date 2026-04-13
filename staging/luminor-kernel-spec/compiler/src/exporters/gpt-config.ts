/**
 * OpenAI GPT Config Exporter
 *
 * Produces a ChatGPT custom GPT configuration JSON that can be used
 * to create a GPT via the GPT Builder API.
 */

import type { GPTConfig, LuminorSpec } from '../types.js';
import { domainLabel } from '../compile.js';

const CODE_DOMAINS: LuminorSpec['domain'][] = [
  'code',
  'debugging',
  'architecture',
  'integration',
  'analysis',
];

const VISUAL_DOMAINS: LuminorSpec['domain'][] = ['visual', 'motion', 'spatial'];

const RESEARCH_DOMAINS: LuminorSpec['domain'][] = [
  'knowledge',
  'analysis',
  'foresight',
  'language',
  'rhetoric',
];

export function buildGPTConfig(
  spec: LuminorSpec,
  systemPrompt: string
): GPTConfig {
  const domain = domainLabel(spec.domain).toLowerCase();

  return {
    name: spec.name,
    description: `${spec.title} — ${spec.tagline}`,
    instructions: systemPrompt,
    conversation_starters: spec.starters ?? [
      `I need help with ${domain}`,
      `Review this and tell me what I'm missing`,
      `What's the best approach for...`,
      `Challenge my thinking on this`,
    ],
    capabilities: {
      web_browsing: RESEARCH_DOMAINS.includes(spec.domain),
      code_interpreter: CODE_DOMAINS.includes(spec.domain),
      image_generation: VISUAL_DOMAINS.includes(spec.domain),
    },
    metadata: {
      origin: 'arcanea-luminor',
      kernelSpec: 'luminor-kernel-spec-v1.0',
      species: 'luminor',
      luminorId: spec.id,
      element: spec.element,
      domain: spec.domain,
      voice: spec.voice,
      personality: spec.personality,
      version: 'luminor-spec-v2',
    },
  };
}
