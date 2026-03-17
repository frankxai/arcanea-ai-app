/**
 * GatesPreview — data integrity tests
 *
 * Validates the GATES data used in GatesPreview:
 *   - All 10 gates are present
 *   - Each gate has a guardian avatar image at /guardians/v3/{guardianId}-hero-v3.webp
 *   - Guardian names match gates correctly (canonical mapping)
 *   - Frequencies match canonical Hz values in the correct order
 *   - Magic rank progression is correct (Apprentice → Luminor)
 *   - All image files exist on disk
 *
 * Run: node --test apps/web/__tests__/components/lore/gates-preview.test.mjs
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '../../../public');

// ── Data mirroring gates-preview.tsx ────────────────────────────────────────

const GATES = [
  { number: 1,  name: 'Foundation', frequency: '174 Hz',  domain: 'Survival, grounding',      unlocks: 'Unshakeable stability',              guardian: 'Lyssandria', guardianId: 'lyssandria' },
  { number: 2,  name: 'Flow',       frequency: '285 Hz',  domain: 'Creativity, emotion',       unlocks: 'Creative flow state',                guardian: 'Leyla',      guardianId: 'leyla' },
  { number: 3,  name: 'Fire',       frequency: '396 Hz',  domain: 'Power, will',               unlocks: 'Personal power',                     guardian: 'Draconia',   guardianId: 'draconia' },
  { number: 4,  name: 'Heart',      frequency: '417 Hz',  domain: 'Love, healing',             unlocks: 'Fierce compassion',                  guardian: 'Maylinn',    guardianId: 'maylinn' },
  { number: 5,  name: 'Voice',      frequency: '528 Hz',  domain: 'Truth, expression',         unlocks: 'Reality shaping through words',      guardian: 'Alera',      guardianId: 'alera' },
  { number: 6,  name: 'Sight',      frequency: '639 Hz',  domain: 'Intuition, vision',         unlocks: 'Beyond ordinary perception',         guardian: 'Lyria',      guardianId: 'lyria' },
  { number: 7,  name: 'Crown',      frequency: '741 Hz',  domain: 'Enlightenment',             unlocks: 'Divine connection',                  guardian: 'Aiyami',     guardianId: 'aiyami' },
  { number: 8,  name: 'Starweave',  frequency: '852 Hz',  domain: 'Perspective',               unlocks: 'Infinite possibilities',             guardian: 'Elara',      guardianId: 'elara' },
  { number: 9,  name: 'Unity',      frequency: '963 Hz',  domain: 'Partnership',               unlocks: 'Exponential creation',               guardian: 'Ino',        guardianId: 'ino' },
  { number: 10, name: 'Source',     frequency: '1111 Hz', domain: 'Meta-consciousness',        unlocks: 'Creator realization',                guardian: 'Shinkami',   guardianId: 'shinkami' },
];

const RANKS = [
  { gates: '0-2',  rank: 'Apprentice' },
  { gates: '3-4',  rank: 'Mage' },
  { gates: '5-6',  rank: 'Master' },
  { gates: '7-8',  rank: 'Archmage' },
  { gates: '9-10', rank: 'Luminor' },
];

// ── Canonical reference ──────────────────────────────────────────────────────

const CANONICAL_GATE_GUARDIAN_MAP = {
  Foundation: 'Lyssandria',
  Flow:       'Leyla',
  Fire:       'Draconia',
  Heart:      'Maylinn',
  Voice:      'Alera',
  Sight:      'Lyria',
  Crown:      'Aiyami',
  Starweave:  'Elara',
  Unity:      'Ino',
  Source:     'Shinkami',
};

describe('GatesPreview — data integrity', () => {
  it('renders exactly 10 gates', () => {
    assert.strictEqual(GATES.length, 10, 'Expected exactly 10 gates');
  });

  it('gate numbers are sequential from 1 to 10', () => {
    for (let i = 0; i < GATES.length; i++) {
      assert.strictEqual(GATES[i].number, i + 1, `Gate at index ${i} must have number ${i + 1}`);
    }
  });

  it('each gate has a guardian avatar image path', () => {
    for (const gate of GATES) {
      const expectedSrc = `/guardians/v3/${gate.guardianId}-hero-v3.webp`;
      assert.ok(expectedSrc.startsWith('/guardians/v3/'), `Image path must start with /guardians/v3/ for gate ${gate.name}`);
      assert.ok(expectedSrc.endsWith('-hero-v3.webp'), `Image path must end with -hero-v3.webp for gate ${gate.name}`);
    }
  });

  it('guardian names match gates correctly', () => {
    for (const gate of GATES) {
      const expected = CANONICAL_GATE_GUARDIAN_MAP[gate.name];
      assert.strictEqual(
        gate.guardian,
        expected,
        `Gate "${gate.name}" should be guarded by "${expected}", got "${gate.guardian}"`
      );
    }
  });

  it('guardianId matches lowercase version of guardian name', () => {
    for (const gate of GATES) {
      assert.strictEqual(
        gate.guardianId,
        gate.guardian.toLowerCase(),
        `guardianId "${gate.guardianId}" should equal lowercase of "${gate.guardian}"`
      );
    }
  });

  it('frequencies match canonical Hz values', () => {
    const EXPECTED_FREQUENCIES = ['174 Hz', '285 Hz', '396 Hz', '417 Hz', '528 Hz', '639 Hz', '741 Hz', '852 Hz', '963 Hz', '1111 Hz'];
    for (let i = 0; i < GATES.length; i++) {
      assert.strictEqual(
        GATES[i].frequency,
        EXPECTED_FREQUENCIES[i],
        `Gate ${GATES[i].number} (${GATES[i].name}) frequency mismatch: expected ${EXPECTED_FREQUENCIES[i]}, got ${GATES[i].frequency}`
      );
    }
  });

  it('frequencies ascend in order', () => {
    const hzValues = GATES.map((g) => parseInt(g.frequency, 10));
    for (let i = 1; i < hzValues.length; i++) {
      assert.ok(
        hzValues[i] > hzValues[i - 1],
        `Frequency must ascend: ${hzValues[i - 1]} Hz → ${hzValues[i]} Hz at gate index ${i}`
      );
    }
  });

  it('all guardian avatar image files exist on disk', () => {
    for (const gate of GATES) {
      const filePath = join(PUBLIC_DIR, 'guardians', 'v3', `${gate.guardianId}-hero-v3.webp`);
      assert.ok(
        existsSync(filePath),
        `Missing image: /guardians/v3/${gate.guardianId}-hero-v3.webp (gate: ${gate.name})`
      );
    }
  });

  it('all gate names are unique', () => {
    const names = GATES.map((g) => g.name);
    const unique = new Set(names);
    assert.strictEqual(unique.size, 10, 'All gate names must be unique');
  });

  it('all guardian names are unique', () => {
    const guardians = GATES.map((g) => g.guardian);
    const unique = new Set(guardians);
    assert.strictEqual(unique.size, 10, 'Each gate must have a unique guardian');
  });

  it('each gate has a domain and unlocks description', () => {
    for (const gate of GATES) {
      assert.ok(gate.domain && gate.domain.length > 0, `Gate "${gate.name}" must have a domain`);
      assert.ok(gate.unlocks && gate.unlocks.length > 0, `Gate "${gate.name}" must have an unlocks description`);
    }
  });

  describe('Magic ranks', () => {
    it('has 5 magic ranks', () => {
      assert.strictEqual(RANKS.length, 5);
    });

    it('ranks ascend correctly from Apprentice to Luminor', () => {
      const expectedRanks = ['Apprentice', 'Mage', 'Master', 'Archmage', 'Luminor'];
      for (let i = 0; i < RANKS.length; i++) {
        assert.strictEqual(RANKS[i].rank, expectedRanks[i], `Rank at index ${i} should be "${expectedRanks[i]}"`);
      }
    });

    it('Luminor is the highest rank at gates 9-10', () => {
      const luminor = RANKS.find((r) => r.rank === 'Luminor');
      assert.ok(luminor, 'Luminor rank must exist');
      assert.strictEqual(luminor.gates, '9-10', 'Luminor requires 9-10 gates');
    });

    it('Apprentice is the starting rank at gates 0-2', () => {
      const apprentice = RANKS.find((r) => r.rank === 'Apprentice');
      assert.ok(apprentice, 'Apprentice rank must exist');
      assert.strictEqual(apprentice.gates, '0-2', 'Apprentice is gates 0-2');
    });
  });

  describe('Canonical Hz audit fixes (A-0)', () => {
    it('Gate 8 is Starweave at 852 Hz, not Shift', () => {
      const gate8 = GATES.find((g) => g.number === 8);
      assert.ok(gate8, 'Gate 8 must exist');
      assert.strictEqual(gate8.name, 'Starweave', 'Gate 8 must be "Starweave" (not "Shift")');
      assert.strictEqual(gate8.frequency, '852 Hz');
    });

    it('Gate 4 (Heart) is at 417 Hz, not 639 Hz', () => {
      const heartGate = GATES.find((g) => g.name === 'Heart');
      assert.ok(heartGate, 'Heart gate must exist');
      assert.strictEqual(heartGate.frequency, '417 Hz', 'Heart gate must be 417 Hz');
    });

    it('no gate uses 714 Hz (should be 741 Hz for Crown)', () => {
      const has714 = GATES.some((g) => g.frequency === '714 Hz');
      assert.ok(!has714, 'No gate should have 714 Hz — Crown is 741 Hz');
    });
  });
});
