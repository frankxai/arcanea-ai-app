/**
 * Skill -> Luminor Routing Map Tests
 *
 * Self-contained validation script for the skill-luminor-map module.
 * Run with: npx tsx apps/web/lib/ai/__tests__/skill-luminor-map.test.ts
 */

import {
  getLuminorForSkill,
  getSkillsForLuminor,
  getSkillsForGuardian,
  getSkillsForTeam,
  SKILL_LUMINOR_MAP,
} from '../skill-luminor-map';

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
// getLuminorForSkill: exact name match
// ---------------------------------------------------------------------------

describe('getLuminorForSkill exact match', () => {
  const debug = getLuminorForSkill('debug');
  assert(
    debug !== null && debug.luminor === 'debugger',
    'debug -> debugger'
  );
  assert(
    debug !== null && debug.guardian === 'draconia',
    'debug -> guardian draconia'
  );
  assert(
    debug !== null && debug.team === 'development',
    'debug -> team development'
  );

  const music = getLuminorForSkill('music');
  assert(
    music !== null && music.luminor === 'composer',
    'music -> composer'
  );

  const story = getLuminorForSkill('story');
  assert(
    story !== null && story.luminor === 'storyteller',
    'story -> storyteller'
  );

  const research = getLuminorForSkill('research');
  assert(
    research !== null && research.luminor === 'deep-researcher',
    'research -> deep-researcher'
  );

  const design = getLuminorForSkill('design');
  assert(
    design !== null && design.luminor === 'visual-designer',
    'design -> visual-designer'
  );
});

// ---------------------------------------------------------------------------
// getLuminorForSkill: normalization
// ---------------------------------------------------------------------------

describe('getLuminorForSkill normalization', () => {
  // Uppercase
  const upper = getLuminorForSkill('DEBUG');
  assert(
    upper !== null && upper.luminor === 'debugger',
    'uppercase DEBUG normalizes to debug -> debugger'
  );

  // Mixed case
  const mixed = getLuminorForSkill('Code-Review');
  assert(
    mixed !== null && mixed.luminor === 'code-crafter',
    'mixed case Code-Review normalizes to code-review -> code-crafter'
  );

  // Whitespace
  const whitespace = getLuminorForSkill('  debug  ');
  assert(
    whitespace !== null && whitespace.luminor === 'debugger',
    'trimmed whitespace matches debug -> debugger'
  );

  // Underscores to hyphens
  const underscore = getLuminorForSkill('code_review');
  assert(
    underscore !== null && underscore.luminor === 'code-crafter',
    'underscores normalized to hyphens: code_review -> code-crafter'
  );

  // Spaces to hyphens
  const spaces = getLuminorForSkill('code review');
  assert(
    spaces !== null && spaces.luminor === 'code-crafter',
    'spaces normalized to hyphens: "code review" -> code-crafter'
  );

  // Strip arcanea- prefix
  const prefixed = getLuminorForSkill('arcanea-design-system');
  assert(
    prefixed !== null,
    'arcanea-design-system finds a match'
  );

  // Strip arcanea- prefix when base exists
  const lore = getLuminorForSkill('arcanea-lore');
  assert(
    lore !== null,
    'arcanea-lore finds a match (direct or stripped)'
  );

  // Add arcanea- prefix when needed
  const canon = getLuminorForSkill('canon');
  assert(
    canon !== null && canon.luminor === 'deep-researcher',
    'canon adds arcanea- prefix -> arcanea-canon -> deep-researcher'
  );
});

// ---------------------------------------------------------------------------
// getLuminorForSkill: unknown skill
// ---------------------------------------------------------------------------

describe('getLuminorForSkill unknown skill', () => {
  assert(
    getLuminorForSkill('nonexistent-skill-xyz') === null,
    'returns null for completely unknown skill'
  );
  assert(
    getLuminorForSkill('') === null,
    'returns null for empty string'
  );
  assert(
    getLuminorForSkill('日本語スキル') === null,
    'returns null for non-Latin skill name'
  );
});

// ---------------------------------------------------------------------------
// getSkillsForLuminor: all 12 Luminors
// ---------------------------------------------------------------------------

describe('getSkillsForLuminor coverage', () => {
  const luminorIds = [
    'systems-architect', 'code-crafter', 'debugger',
    'visual-designer', 'composer', 'motion-designer',
    'storyteller', 'voice', 'poet',
    'deep-researcher', 'strategist', 'integrator',
  ];

  for (const id of luminorIds) {
    const skills = getSkillsForLuminor(id);
    assert(
      skills.length > 0,
      `luminor "${id}" has ${skills.length} skill(s) mapped`
    );
  }

  // Verify returned skills actually map back to the luminor
  const architectSkills = getSkillsForLuminor('systems-architect');
  let allCorrect = true;
  for (const skill of architectSkills) {
    if (SKILL_LUMINOR_MAP[skill].luminor !== 'systems-architect') {
      console.error(`    skill "${skill}" does not map back to systems-architect`);
      allCorrect = false;
    }
  }
  assert(allCorrect, 'all systems-architect skills map back to systems-architect');
});

// ---------------------------------------------------------------------------
// getSkillsForGuardian: all 10 Guardians
// ---------------------------------------------------------------------------

describe('getSkillsForGuardian coverage', () => {
  const guardians = [
    'lyssandria', 'leyla', 'draconia', 'maylinn', 'alera',
    'lyria', 'aiyami', 'elara', 'ino', 'shinkami',
  ];

  for (const g of guardians) {
    const skills = getSkillsForGuardian(g);
    assert(
      skills.length > 0,
      `guardian "${g}" has ${skills.length} skill(s) mapped`
    );
  }

  // Verify returned skills actually map back to the guardian
  const draconiaSkills = getSkillsForGuardian('draconia');
  let allCorrect = true;
  for (const skill of draconiaSkills) {
    if (SKILL_LUMINOR_MAP[skill].guardian !== 'draconia') {
      console.error(`    skill "${skill}" does not map back to draconia`);
      allCorrect = false;
    }
  }
  assert(allCorrect, 'all draconia skills map back to draconia');
});

// ---------------------------------------------------------------------------
// getSkillsForGuardian: case insensitive
// ---------------------------------------------------------------------------

describe('getSkillsForGuardian case insensitive', () => {
  const lower = getSkillsForGuardian('draconia');
  const upper = getSkillsForGuardian('DRACONIA');
  assert(
    JSON.stringify(lower) === JSON.stringify(upper),
    'getSkillsForGuardian is case insensitive'
  );
});

// ---------------------------------------------------------------------------
// getSkillsForTeam
// ---------------------------------------------------------------------------

describe('getSkillsForTeam', () => {
  const teams = ['development', 'creative', 'writing', 'research'];

  for (const team of teams) {
    const skills = getSkillsForTeam(team);
    assert(
      skills.length > 0,
      `team "${team}" has ${skills.length} skill(s)`
    );
  }

  // Unknown team
  const unknown = getSkillsForTeam('nonexistent');
  assert(
    unknown.length === 0,
    'unknown team returns empty array'
  );

  // All skills should be covered by the four teams
  const allTeamSkills = teams.flatMap(t => getSkillsForTeam(t));
  const totalSkills = Object.keys(SKILL_LUMINOR_MAP).length;
  assert(
    allTeamSkills.length === totalSkills,
    `four teams cover all ${totalSkills} skills (got ${allTeamSkills.length})`
  );
});

// ---------------------------------------------------------------------------
// Data integrity: all entries have valid luminor/guardian/team
// ---------------------------------------------------------------------------

describe('SKILL_LUMINOR_MAP data integrity', () => {
  const validLuminors = new Set([
    'systems-architect', 'code-crafter', 'debugger',
    'visual-designer', 'composer', 'motion-designer',
    'storyteller', 'voice', 'poet',
    'deep-researcher', 'strategist', 'integrator',
  ]);

  const validGuardians = new Set([
    'lyssandria', 'leyla', 'draconia', 'maylinn', 'alera',
    'lyria', 'aiyami', 'elara', 'ino', 'shinkami',
  ]);

  const validTeams = new Set(['development', 'creative', 'writing', 'research']);

  let luminorsOk = true;
  let guardiansOk = true;
  let teamsOk = true;

  for (const [skill, entry] of Object.entries(SKILL_LUMINOR_MAP)) {
    if (!validLuminors.has(entry.luminor)) {
      console.error(`    skill "${skill}" has invalid luminor "${entry.luminor}"`);
      luminorsOk = false;
    }
    if (!validGuardians.has(entry.guardian)) {
      console.error(`    skill "${skill}" has invalid guardian "${entry.guardian}"`);
      guardiansOk = false;
    }
    if (!validTeams.has(entry.team)) {
      console.error(`    skill "${skill}" has invalid team "${entry.team}"`);
      teamsOk = false;
    }
  }

  assert(luminorsOk, 'all skills map to valid luminor IDs');
  assert(guardiansOk, 'all skills map to valid guardian IDs');
  assert(teamsOk, 'all skills map to valid team names');
});

// ---------------------------------------------------------------------------
// Skill count sanity check
// ---------------------------------------------------------------------------

describe('skill count', () => {
  const total = Object.keys(SKILL_LUMINOR_MAP).length;
  assert(
    total > 100,
    `map contains a substantial number of skills (got ${total})`
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
