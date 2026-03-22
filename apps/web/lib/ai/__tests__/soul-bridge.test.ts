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
    allLuminorIds.length === 16,
    `LUMINOR_HINTS has exactly 16 entries (got ${allLuminorIds.length})`
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
  // Dev team mappings
  const logicusAgent = getSoulAgentForLuminor('logicus');
  assert(
    logicusAgent !== undefined && logicusAgent.id === 'architect',
    'logicus maps to architect'
  );
  assert(
    logicusAgent !== undefined && logicusAgent.team === 'dev',
    'architect is on dev team'
  );

  const debugonAgent = getSoulAgentForLuminor('debugon');
  assert(
    debugonAgent !== undefined && debugonAgent.id === 'debugger',
    'debugon maps to debugger'
  );

  const synthraAgent = getSoulAgentForLuminor('synthra');
  assert(
    synthraAgent !== undefined && synthraAgent.id === 'coder',
    'synthra maps to coder'
  );

  const nexusAgent = getSoulAgentForLuminor('nexus');
  assert(
    nexusAgent !== undefined && nexusAgent.id === 'reviewer',
    'nexus maps to reviewer'
  );

  // Writing team mappings
  const chronicaAgent = getSoulAgentForLuminor('chronica');
  assert(
    chronicaAgent !== undefined && chronicaAgent.id === 'drafter',
    'chronica maps to drafter'
  );
  assert(
    chronicaAgent !== undefined && chronicaAgent.team === 'writing',
    'drafter is on writing team'
  );

  const veritasAgent = getSoulAgentForLuminor('veritas');
  assert(
    veritasAgent !== undefined && veritasAgent.id === 'dialogue',
    'veritas maps to dialogue'
  );

  const lexiconAgent = getSoulAgentForLuminor('lexicon');
  assert(
    lexiconAgent !== undefined && lexiconAgent.id === 'editor',
    'lexicon maps to editor'
  );

  const poeticaAgent = getSoulAgentForLuminor('poetica');
  assert(
    poeticaAgent !== undefined && poeticaAgent.id === 'continuity',
    'poetica maps to continuity'
  );

  // Creative team mappings
  const prismaticAgent = getSoulAgentForLuminor('prismatic');
  assert(
    prismaticAgent !== undefined && prismaticAgent.id === 'character',
    'prismatic maps to character'
  );
  assert(
    prismaticAgent !== undefined && prismaticAgent.team === 'creative',
    'character is on creative team'
  );

  const motioAgent = getSoulAgentForLuminor('motio');
  assert(
    motioAgent !== undefined && motioAgent.id === 'story',
    'motio maps to story'
  );

  const formisAgent = getSoulAgentForLuminor('formis');
  assert(
    formisAgent !== undefined && formisAgent.id === 'world',
    'formis maps to world'
  );

  const melodiaAgent = getSoulAgentForLuminor('melodia');
  assert(
    melodiaAgent !== undefined && melodiaAgent.id === 'lore',
    'melodia maps to lore'
  );

  // Research team mappings
  const oracleAgent = getSoulAgentForLuminor('oracle');
  assert(
    oracleAgent !== undefined && oracleAgent.id === 'sage',
    'oracle maps to sage'
  );
  assert(
    oracleAgent !== undefined && oracleAgent.team === 'research',
    'sage is on research team'
  );

  const analyticaAgent = getSoulAgentForLuminor('analytica');
  assert(
    analyticaAgent !== undefined && analyticaAgent.id === 'muse',
    'analytica maps to muse'
  );

  const futuraAgent = getSoulAgentForLuminor('futura');
  assert(
    futuraAgent !== undefined && futuraAgent.id === 'scout',
    'futura maps to scout'
  );

  const memoriaAgent = getSoulAgentForLuminor('memoria');
  assert(
    memoriaAgent !== undefined && memoriaAgent.id === 'archivist',
    'memoria maps to archivist'
  );
});

// ---------------------------------------------------------------------------
// getSoulAgentForLuminor: agent data structure
// ---------------------------------------------------------------------------

describe('getSoulAgentForLuminor data structure', () => {
  // Check that returned agents have all required fields
  const agent = getSoulAgentForLuminor('logicus');
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
  const hint = enrichLuminorHint('logicus');
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
  const debugHint = enrichLuminorHint('debugon');
  assert(
    debugHint.includes('persistent diagnosis') && debugHint.includes('Soul:'),
    'debugon hint combines base hint with soul perspective'
  );

  // All 16 luminors should produce non-empty enriched hints
  const allLuminorIds = Object.keys(LUMINOR_HINTS);
  let allNonEmpty = true;
  for (const id of allLuminorIds) {
    if (enrichLuminorHint(id).length === 0) {
      console.error(`    enrichLuminorHint("${id}") returned empty string`);
      allNonEmpty = false;
    }
  }
  assert(allNonEmpty, 'all 16 luminors produce non-empty enriched hints');
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
  const hint = enrichLuminorHint('logicus');
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
