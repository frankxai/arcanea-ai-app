/**
 * A2A Agent Card Exporter
 *
 * Produces a Google A2A-compliant Agent Card with Arcanea extensions.
 * Published at /agents/:id/.well-known/agent-card.json
 *
 * Reference: docs/specs/luminor-kernel-spec-v1.md §4
 */

import type {
  AgentCard,
  DomainModule,
  KernelVersion,
  LuminorSpec,
} from '../types.js';

export function buildAgentCard(
  spec: LuminorSpec,
  kernel: KernelVersion,
  modules: DomainModule[]
): AgentCard {
  const capabilities = spec.tags ?? inferCapabilities(spec);
  const skills = inferSkills(spec);

  const card: AgentCard = {
    name: spec.title,
    description: spec.tagline,
    version: '1.0.0',
    endpoint: `https://arcanea.ai/api/agents/${spec.id}/execute`,
    auth: { type: 'api_key', scope: 'execute' },
    capabilities,
    skills,
    'x-arcanea': {
      species: 'luminor',
      origin: spec.origin,
      kernelVersion: `${kernel.id}@${kernel.version}`,
      modules: modules.map((m) => `${m.id}@${m.version}`),
      element: spec.element,
      ...(spec.guardian ? { guardian: spec.guardian } : {}),
      ...(spec.gate ? { gate: spec.gate } : {}),
    },
  };

  return card;
}

function inferCapabilities(spec: LuminorSpec): string[] {
  const base: Record<LuminorSpec['domain'], string[]> = {
    architecture: ['system-design', 'scalability', 'patterns', 'interfaces'],
    code: ['implementation', 'refactoring', 'code-review', 'tdd'],
    debugging: ['root-cause', 'diagnosis', 'performance', 'tracing'],
    integration: ['api-design', 'data-flow', 'service-mesh', 'auth'],
    visual: ['ui-design', 'color', 'typography', 'composition'],
    music: ['composition', 'sound-design', 'harmony', 'rhythm'],
    motion: ['animation', 'easing', 'motion-principles', 'spatial'],
    spatial: ['3d-modeling', 'lighting', 'topology', 'form'],
    narrative: ['storytelling', 'world-building', 'character-arcs', 'plot'],
    rhetoric: ['persuasion', 'argumentation', 'framing', 'clarity'],
    language: ['etymology', 'translation', 'naming', 'linguistics'],
    poetry: ['verse', 'meter', 'imagery', 'compression'],
    knowledge: ['research', 'synthesis', 'citation', 'literature'],
    analysis: ['pattern-recognition', 'data-analysis', 'insight', 'hypothesis'],
    memory: ['organization', 'recall', 'archival', 'taxonomy'],
    foresight: ['trend-analysis', 'forecasting', 'scenario-planning', 'strategy'],
    custom: ['custom'],
  };
  return base[spec.domain] ?? [];
}

function inferSkills(spec: LuminorSpec): string[] {
  // Default skills per domain — creators can override via spec.tools
  if (spec.tools && spec.tools.length > 0) return spec.tools;

  const map: Record<LuminorSpec['domain'], string[]> = {
    architecture: ['architecture', 'system-design', 'mcp-builder'],
    code: ['refactor', 'tdd', 'code-review'],
    debugging: ['debug', 'systematic-debugging', 'performance'],
    integration: ['api-design', 'mcp-builder', 'agentic-orchestration'],
    visual: ['design', 'canvas-design', 'theme-factory'],
    music: ['suno-ai-mastery', 'suno-prompt-architect', 'music-theory'],
    motion: ['algorithmic-art', 'motion-design', 'spatial-design'],
    spatial: ['world-build', 'world-architect', '3d-design'],
    narrative: ['story', 'story-weave', 'world-build'],
    rhetoric: ['voice-check', 'voice-alchemy', 'copywriting'],
    language: ['voice-check', 'prompt-craft', 'naming'],
    poetry: ['poetica', 'voice-check', 'craft-prompt'],
    knowledge: ['deepresearch', 'research', 'reasoningbank-intelligence'],
    analysis: ['pattern-analysis', 'data-insight', 'verification-quality'],
    memory: ['agentdb-memory-patterns', 'memory-coordinator', 'lore-keeper'],
    foresight: ['futures-thinking', 'trend-analysis', 'content-strategy'],
    custom: [],
  };
  return map[spec.domain] ?? [];
}
