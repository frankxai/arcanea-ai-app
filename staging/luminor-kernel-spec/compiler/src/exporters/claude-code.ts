/**
 * Claude Code Agent Exporter
 *
 * Produces a Claude Code `.md` agent file with YAML frontmatter,
 * compatible with `.claude/agents/` directory loading.
 *
 * Reference: https://docs.anthropic.com/claude-code/agents
 */

import type { LuminorSpec } from '../types.js';
import { domainLabel } from '../compile.js';

const TOOL_HINTS: Record<LuminorSpec['domain'], string[]> = {
  architecture: ['Read', 'Glob', 'Grep', 'Agent'],
  code: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'],
  debugging: ['Read', 'Bash', 'Grep', 'Glob'],
  integration: ['Read', 'Write', 'Bash', 'WebFetch'],
  visual: ['Read', 'Write', 'Bash'],
  music: ['Read', 'Write', 'Bash'],
  motion: ['Read', 'Write', 'Edit'],
  spatial: ['Read', 'Write', 'Edit'],
  narrative: ['Read', 'Write', 'Edit'],
  rhetoric: ['Read', 'Write', 'Edit'],
  language: ['Read', 'Write', 'Edit'],
  poetry: ['Read', 'Write', 'Edit'],
  knowledge: ['Read', 'WebSearch', 'WebFetch', 'Grep'],
  analysis: ['Read', 'Bash', 'Grep', 'WebSearch'],
  memory: ['Read', 'Glob', 'Grep'],
  foresight: ['Read', 'WebSearch', 'WebFetch'],
  custom: ['Read', 'Grep', 'Glob'],
};

export function buildClaudeCodeAgent(
  spec: LuminorSpec,
  systemPrompt: string
): string {
  const tools = TOOL_HINTS[spec.domain] ?? ['Read', 'Grep', 'Glob'];
  const model = spec.preferredModel ?? 'sonnet';
  const starters = spec.starters ?? [
    `Help me with ${domainLabel(spec.domain).toLowerCase()}`,
    `Review my work`,
    `What am I missing?`,
  ];

  return `---
name: ${spec.name}
description: ${spec.tagline}
model: ${model}
---

# ${spec.title}

${systemPrompt}

## Agent Profile
- **Domain:** ${domainLabel(spec.domain)}
- **Voice:** ${spec.voice}
- **Element:** ${spec.element}
- **Personality:** ${spec.personality.join(', ')}
- **Temperature:** ${spec.temperature ?? 0.7}

## Preferred Tools
${tools.map((t) => `- ${t}`).join('\n')}

## Conversation Starters
${starters.map((s) => `- "${s}"`).join('\n')}
${
  spec.knowledge && spec.knowledge.length > 0
    ? `\n## Knowledge\n${spec.knowledge.map((k) => `- ${k}`).join('\n')}`
    : ''
}

---
*Compiled by @arcanea/luminor-compiler · Luminor Kernel Spec v1.0 · ${spec.element} Element*
`;
}
