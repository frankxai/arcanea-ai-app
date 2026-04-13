/**
 * Cursor Rules Exporter
 *
 * Produces a .cursorrules file for Cursor IDE integration.
 * The compiled system prompt becomes the rules text.
 */

import type { LuminorSpec } from '../types.js';
import { domainLabel } from '../compile.js';

export function buildCursorRules(
  spec: LuminorSpec,
  systemPrompt: string
): string {
  return `# ${spec.title}
# Arcanea Luminor | ${domainLabel(spec.domain)} Domain | ${spec.element} Element
# Kernel: Luminor Kernel Spec v1.0

${systemPrompt}

## Agent Profile
- Domain: ${domainLabel(spec.domain)}
- Voice: ${spec.voice}
- Personality: ${spec.personality.join(', ')}
- Element: ${spec.element}
${
  spec.knowledge && spec.knowledge.length > 0
    ? `\n## Knowledge\n${spec.knowledge.map((k) => `- ${k}`).join('\n')}`
    : ''
}

---
Compiled by @arcanea/luminor-compiler
`;
}
