/**
 * Guardian Swarm Coordination Tests
 *
 * Self-contained validation script for the guardian-swarm coordination logic.
 * Run with: npx tsx apps/web/lib/ai/__tests__/guardian-swarm.test.ts
 */

import {
  resolveSwarm,
  classifyCoordinationMode,
  buildLuminorLayer,
  GUARDIAN_LUMINOR_MAP,
  LUMINOR_HINTS,
} from '../guardian-swarm';

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
// classifyCoordinationMode
// ---------------------------------------------------------------------------

describe('classifyCoordinationMode', () => {
  assert(
    classifyCoordinationMode({ draconia: 0.9, lyssandria: 0.3 }) === 'solo',
    'returns solo when one guardian dominates'
  );

  assert(
    classifyCoordinationMode({ leyla: 0.7, alera: 0.6, draconia: 0.5 }) === 'council',
    'returns council when 2-3 guardians are strong'
  );

  assert(
    classifyCoordinationMode({ lyssandria: 0.3, draconia: 0.3, alera: 0.2 }) === 'convergence',
    'returns convergence when no dominant'
  );

  assert(
    classifyCoordinationMode({}) === 'convergence',
    'returns convergence for empty weights'
  );
});

// ---------------------------------------------------------------------------
// resolveSwarm
// ---------------------------------------------------------------------------

describe('resolveSwarm', () => {
  const soloResult = resolveSwarm({ draconia: 0.95, lyssandria: 0.2 }, ['draconia']);

  assert(
    soloResult.coordinationMode === 'solo',
    'solo mode: coordinationMode is solo'
  );

  assert(
    soloResult.leadGuardian === 'draconia',
    'solo mode: leadGuardian is draconia'
  );

  assert(
    soloResult.activeLuminors.length === 4,
    `solo mode: activates 4 luminors (got ${soloResult.activeLuminors.length})`
  );

  const expectedLuminors = ['debugon', 'motio', 'chronica', 'analytica'];
  const actualIds = soloResult.activeLuminors.map(l => l.id).sort();
  assert(
    JSON.stringify(actualIds) === JSON.stringify(expectedLuminors.sort()),
    `solo mode: correct luminors [${actualIds.join(', ')}]`
  );

  // Council mode: deduplication
  const councilResult = resolveSwarm({ leyla: 0.7, alera: 0.6 }, ['leyla', 'alera']);

  assert(
    councilResult.coordinationMode === 'council',
    'council mode: coordinationMode is council'
  );

  const councilIds = councilResult.activeLuminors.map(l => l.id);
  const uniqueIds = [...new Set(councilIds)];
  assert(
    councilIds.length === uniqueIds.length,
    `council mode: no duplicate luminors (${councilIds.length} total, ${uniqueIds.length} unique)`
  );

  // Convergence mode
  const convResult = resolveSwarm({ lyssandria: 0.3, draconia: 0.3 }, ['lyssandria', 'draconia']);

  assert(
    convResult.coordinationMode === 'convergence',
    'convergence mode: coordinationMode is convergence'
  );

  assert(
    convResult.activeLuminors.length === 0,
    'convergence mode: no activated luminors'
  );
});

// ---------------------------------------------------------------------------
// buildLuminorLayer
// ---------------------------------------------------------------------------

describe('buildLuminorLayer', () => {
  const convSwarm = resolveSwarm({ lyssandria: 0.3 }, ['lyssandria']);
  assert(
    buildLuminorLayer(convSwarm) === '',
    'convergence: returns empty string'
  );

  const soloSwarm = resolveSwarm({ draconia: 0.95 }, ['draconia']);
  const soloLayer = buildLuminorLayer(soloSwarm);
  assert(
    soloLayer.includes('Draconia') && soloLayer.includes('leads'),
    'solo mode: includes guardian name and "leads"'
  );
  assert(
    soloLayer.includes('Primary:'),
    'solo mode: includes "Primary:" section'
  );

  const councilSwarm = resolveSwarm({ leyla: 0.7, alera: 0.6 }, ['leyla', 'alera']);
  const councilLayer = buildLuminorLayer(councilSwarm);
  assert(
    councilLayer.includes('coordinate'),
    'council mode: includes "coordinate"'
  );
});

// ---------------------------------------------------------------------------
// Data Integrity
// ---------------------------------------------------------------------------

describe('data integrity', () => {
  const guardians = [
    'lyssandria', 'leyla', 'draconia', 'maylinn', 'alera',
    'lyria', 'aiyami', 'elara', 'ino', 'shinkami',
  ];

  for (const g of guardians) {
    assert(
      GUARDIAN_LUMINOR_MAP[g] !== undefined,
      `guardian "${g}" has luminor mapping`
    );
  }

  assert(
    Object.keys(GUARDIAN_LUMINOR_MAP).length === 10,
    `exactly 10 guardians (got ${Object.keys(GUARDIAN_LUMINOR_MAP).length})`
  );

  assert(
    Object.keys(LUMINOR_HINTS).length === 16,
    `exactly 16 luminors (got ${Object.keys(LUMINOR_HINTS).length})`
  );

  // All mapped luminors have hints
  let allHintsOk = true;
  for (const [guardian, luminorIds] of Object.entries(GUARDIAN_LUMINOR_MAP)) {
    for (const id of luminorIds) {
      if (!LUMINOR_HINTS[id] || !LUMINOR_HINTS[id].hint || !LUMINOR_HINTS[id].team) {
        console.error(`    Missing hint for luminor "${id}" under guardian "${guardian}"`);
        allHintsOk = false;
      }
    }
  }
  assert(allHintsOk, 'all mapped luminors have valid hints and teams');
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
