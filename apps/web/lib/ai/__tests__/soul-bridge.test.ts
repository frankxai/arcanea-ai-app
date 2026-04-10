/**
 * Soul Bridge Tests
 *
 * Self-contained validation script for the soul-bridge module.
 * Run with: npx tsx apps/web/lib/ai/__tests__/soul-bridge.test.ts
 */

import {
  getSoulAgentForLuminor,
  enrichLuminorHint,
  SOUL_AGENT_MAP,
} from '../soul-bridge';
import { LUMINOR_HINTS } from '../guardian-swarm';

// ---------------------------------------------------------------------------
// Minimal test harness (no jest/vitest dependency)
// ---------------------------------------------------------------------------

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

function describe(suite: string, fn: () => void) {
  console.log(`\n${suite}`);
  fn();
}

// ---------------------------------------------------------------------------
// All 16 Luminor IDs have soul agent mappings
// ---------------------------------------------------------------------------

describe('SOUL_AGENT_MAP coverage', () => {
  const allLuminorIds = Object.keys(LUMINOR_HINTS);
  assert(
    allLuminorIds.length === 12,
    `LUMINOR_HINTS has exactly 12 entries (got ${allLuminorIds.length})`
  );

  assert(
    Object.keys(SOUL_AGENT_MAP).length === 16,
    `SOUL_AGENT_MAP has exactly 16 soul agents (got ${Object.keys(SOUL_AGENT_MAP).length})`
  );

  // Every Luminor ID should be a target of at least one soul agent mapping
  const mappedLuminors = new Set(Object.values(SOUL_AGENT_MAP));
  for (const luminorId of allLuminorIds) {
    assert(
      mappedLuminors.has(luminorId),
      `luminor "${luminorId}" has a soul agent mapping`
    );
  }

  // Every soul agent mapping should point to a valid Luminor
  for (const [soulId, luminorId] of Object.entries(SOUL_AGENT_MAP)) {
    assert(
      LUMINOR_HINTS[luminorId] !== undefined,
      `soul agent "${soulId}" maps to valid luminor "${luminorId}"`
    );
  }
});

// ---------------------------------------------------------------------------
// getSoulAgentForLuminor returns correct data
// ---------------------------------------------------------------------------

describe('getSoulAgentForLuminor', () => {
  // Dev team mappings (1:1)
  const architectAgent = getSoulAgentForLuminor('systems-architect');
  assert(
    architectAgent !== undefined && architectAgent.id === 'architect',
    'systems-architect maps to architect'
  );
  assert(
    architectAgent !== undefined && architectAgent.team === 'dev',
    'architect is on dev team'
  );

  const debuggerAgent = getSoulAgentForLuminor('debugger');
  assert(
    debuggerAgent !== undefined && debuggerAgent.id === 'debugger',
    'debugger maps to debugger'
  );

  const coderAgent = getSoulAgentForLuminor('code-crafter');
  assert(
    coderAgent !== undefined && coderAgent.id === 'coder',
    'code-crafter maps to coder'
  );

  const integratorAgent = getSoulAgentForLuminor('integrator');
  assert(
    integratorAgent !== undefined && integratorAgent.id === 'reviewer',
    'integrator maps to reviewer'
  );

  // Writing team mappings (voice absorbs editor/dialogue — editor wins)
  const storytellerAgent = getSoulAgentForLuminor('storyteller');
  assert(
    storytellerAgent !== undefined && storytellerAgent.id === 'drafter',
    'storyteller maps to drafter'
  );
  assert(
    storytellerAgent !== undefined && storytellerAgent.team === 'writing',
    'drafter is on writing team'
  );

  const voiceAgent = getSoulAgentForLuminor('voice');
  assert(
    voiceAgent !== undefined && voiceAgent.id === 'editor',
    'voice maps to editor (word mastery wins over dialogue)'
  );

  const poetAgent = getSoulAgentForLuminor('poet');
  assert(
    poetAgent !== undefined && poetAgent.id === 'continuity',
    'poet maps to continuity'
  );

  // Creative team mappings (motion-designer absorbs story/world — world wins)
  const visualDesignerAgent = getSoulAgentForLuminor('visual-designer');
  assert(
    visualDesignerAgent !== undefined && visualDesignerAgent.id === 'character',
    'visual-designer maps to character'
  );
  assert(
    visualDesignerAgent !== undefined && visualDesignerAgent.team === 'creative',
    'character is on creative team'
  );

  const motionDesignerAgent = getSoulAgentForLuminor('motion-designer');
  assert(
    motionDesignerAgent !== undefined && motionDesignerAgent.id === 'world',
    'motion-designer maps to world (spatial wins over story)'
  );

  const composerAgent = getSoulAgentForLuminor('composer');
  assert(
    composerAgent !== undefined && composerAgent.id === 'lore',
    'composer maps to lore'
  );

  // Research team mappings (deep-researcher absorbs sage/muse/archivist — sage wins)
  const deepResearcherAgent = getSoulAgentForLuminor('deep-researcher');
  assert(
    deepResearcherAgent !== undefined && deepResearcherAgent.id === 'sage',
    'deep-researcher maps to sage (synthesis wins)'
  );
  assert(
    deepResearcherAgent !== undefined && deepResearcherAgent.team === 'research',
    'sage is on research team'
  );

  const strategistAgent = getSoulAgentForLuminor('strategist');
  assert(
    strategistAgent !== undefined && strategistAgent.id === 'scout',
    'strategist maps to scout'
  );
});

// ---------------------------------------------------------------------------
// getSoulAgentForLuminor: agent data structure
// ---------------------------------------------------------------------------

describe('getSoulAgentForLuminor data structure', () => {
  // Check that returned agents have all required fields
  const agent = getSoulAgentForLuminor('systems-architect');
  assert(agent !== undefined, 'returns an agent object');
  assert(
    typeof agent!.id === 'string' && agent!.id.length > 0,
    'agent has non-empty id'
  );
  assert(
    typeof agent!.title === 'string' && agent!.title.length > 0,
    'agent has non-empty title'
  );
  assert(
    ['dev', 'creative', 'writing', 'research'].includes(agent!.team),
    `agent team is valid (got "${agent!.team}")`
  );
  assert(
    typeof agent!.gate === 'string' && agent!.gate.length > 0,
    'agent has non-empty gate'
  );
  assert(
    typeof agent!.perspective === 'string' && agent!.perspective.length > 10,
    'agent has substantive perspective'
  );
  assert(
    typeof agent!.approach === 'string' && agent!.approach.length > 10,
    'agent has substantive approach'
  );
});

// ---------------------------------------------------------------------------
// getSoulAgentForLuminor: unknown ID
// ---------------------------------------------------------------------------

describe('getSoulAgentForLuminor unknown ID', () => {
  assert(
    getSoulAgentForLuminor('nonexistent') === undefined,
    'returns undefined for unknown luminor id'
  );
  assert(
    getSoulAgentForLuminor('') === undefined,
    'returns undefined for empty string'
  );
  assert(
    getSoulAgentForLuminor('LOGICUS') === undefined,
    'returns undefined for wrong case (case-sensitive)'
  );
});

// ---------------------------------------------------------------------------
// enrichLuminorHint
// ---------------------------------------------------------------------------

describe('enrichLuminorHint', () => {
  // Valid luminor with soul agent
  const hint = enrichLuminorHint('systems-architect');
  assert(
    hint.length > 0,
    'returns non-empty string for valid luminor'
  );
  assert(
    hint.includes('systematic architecture'),
    'includes the base LUMINOR_HINTS hint text'
  );
  assert(
    hint.includes('Soul:'),
    'includes "Soul:" marker for soul perspective'
  );
  assert(
    hint.includes('"'),
    'includes quoted soul perspective'
  );

  // Verify the enriched hint combines base + soul perspective
  const debugHint = enrichLuminorHint('debugger');
  assert(
    debugHint.includes('persistent diagnosis') && debugHint.includes('Soul:'),
    'debugger hint combines base hint with soul perspective'
  );

  // All 12 luminors should produce non-empty enriched hints
  const allLuminorIds = Object.keys(LUMINOR_HINTS);
  let allNonEmpty = true;
  for (const id of allLuminorIds) {
    if (enrichLuminorHint(id).length === 0) {
      console.error(`    enrichLuminorHint("${id}") returned empty string`);
      allNonEmpty = false;
    }
  }
  assert(allNonEmpty, 'all 12 luminors produce non-empty enriched hints');
});

// ---------------------------------------------------------------------------
// enrichLuminorHint: unknown luminor
// ---------------------------------------------------------------------------

describe('enrichLuminorHint unknown luminor', () => {
  assert(
    enrichLuminorHint('nonexistent') === '',
    'returns empty string for unknown luminor id'
  );
  assert(
    enrichLuminorHint('') === '',
    'returns empty string for empty string'
  );
});

// ---------------------------------------------------------------------------
// enrichLuminorHint: soul perspective is first sentence
// ---------------------------------------------------------------------------

describe('enrichLuminorHint perspective extraction', () => {
  const hint = enrichLuminorHint('systems-architect');
  // architect's perspective starts: "I see systems the way a master builder sees a cathedral."
  assert(
    hint.includes('I see systems the way a master builder sees a cathedral.'),
    'extracts first sentence of soul perspective'
  );
  // Should NOT contain the second sentence
  assert(
    !hint.includes('The best architecture is not clever'),
    'does not include second sentence of perspective'
  );
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
