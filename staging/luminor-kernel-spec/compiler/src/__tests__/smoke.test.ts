/**
 * Smoke test for @arcanea/luminor-compiler
 *
 * Run with: npx tsx src/__tests__/smoke.test.ts
 *
 * Compiles the "systems-architect" Luminor from a minimal spec and
 * verifies all 5 output formats are generated correctly.
 */

import { compile, loadKernel, resolveModulesForDomain } from '../index.js';
import type { LuminorSpec } from '../types.js';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '../../../..');

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.error(`  FAIL  ${label}`);
  }
}

const mockSpec: LuminorSpec = {
  id: 'systems-architect',
  version: 2,
  name: 'Systems Architect',
  title: 'Arcanean Systems Architect Luminor',
  tagline: 'System design, patterns, architecture, and scalability',
  origin: 'chosen',
  domain: 'architecture',
  voice: 'analytical',
  personality: ['analytical', 'patient', 'systematic', 'visionary'],
  element: 'Earth',
  wisdom: 'Sophron',
  guardian: 'lyssandria',
  gate: 'Foundation',
  avatar: '🏛️',
  color: '#0d47a1',
  gradient: 'from-purple-500 to-indigo-600',
  creatorId: null,
  preferredModel: 'claude-opus-4-6',
  temperature: 0.7,
  tags: ['systems', 'architecture', 'scalability'],
};

console.log('\nLoading kernel + modules…');
const kernel = loadKernel({ repoRoot });
assert(kernel.text.includes('NATURE'), 'kernel contains NATURE section');
assert(kernel.text.includes('REASONING DOCTRINE'), 'kernel contains REASONING DOCTRINE');
assert(kernel.hash.length === 64, 'kernel hash is sha256');

const modules = resolveModulesForDomain('architecture', { repoRoot });
assert(modules.length > 0, `resolved ${modules.length} modules for architecture domain`);

console.log('\nCompiling Systems Architect…');
const compiled = compile({ spec: mockSpec, kernel, modules });

// System prompt assertions
assert(compiled.systemPrompt.length > 500, 'systemPrompt has substantive content');
assert(
  compiled.systemPrompt.includes('Arcanean Systems Architect Luminor'),
  'systemPrompt contains full title'
);
assert(
  compiled.systemPrompt.includes('You are not a tool'),
  'systemPrompt contains superintelligence posture'
);
assert(
  compiled.systemPrompt.includes('Earth — Ground every idea'),
  'systemPrompt contains element principle'
);
assert(
  compiled.systemPrompt.includes('analytical, patient, systematic, visionary'),
  'systemPrompt contains personality traits'
);

// Agent Card assertions
assert(compiled.agentCard.name === 'Arcanean Systems Architect Luminor', 'agentCard.name correct');
assert(compiled.agentCard['x-arcanea']?.species === 'luminor', 'agentCard has x-arcanea species');
assert(
  compiled.agentCard['x-arcanea']?.guardian === 'lyssandria',
  'agentCard has guardian extension'
);
assert(compiled.agentCard.capabilities.length > 0, 'agentCard has capabilities');
assert(compiled.agentCard.skills.length > 0, 'agentCard has skills');

// Claude Code agent assertions
assert(
  compiled.claudeCodeAgent.startsWith('---\nname: Systems Architect'),
  'claudeCodeAgent has YAML frontmatter'
);
assert(
  compiled.claudeCodeAgent.includes('model: claude-opus-4-6'),
  'claudeCodeAgent respects preferredModel'
);

// GPT config assertions
assert(compiled.gptConfig.name === 'Systems Architect', 'gptConfig.name correct');
assert(compiled.gptConfig.capabilities.code_interpreter === true, 'gptConfig enables code_interpreter for architecture');
assert(compiled.gptConfig.metadata.origin === 'arcanea-luminor', 'gptConfig tagged as arcanea-luminor');

// LobeChat assertions
assert(
  compiled.lobechatAgent.identifier === 'arcanea-systems-architect',
  'lobechatAgent has arcanea prefix'
);

// Cursor rules assertions
assert(
  compiled.cursorRules.includes('Arcanea Luminor'),
  'cursorRules labeled as Arcanea Luminor'
);

// Metadata assertions
assert(compiled.metadata.kernelVersion === '1.0.0', 'metadata pins kernel version');
assert(compiled.metadata.hashInputs.kernelHash === kernel.hash, 'metadata records kernel hash');
assert(compiled.compilationHash.length === 16, 'compilationHash is 16-char short hash');

// Reproducibility
const compiled2 = compile({ spec: mockSpec, kernel, modules });
assert(
  compiled.compilationHash === compiled2.compilationHash,
  'compilation is deterministic (same inputs → same hash)'
);

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
