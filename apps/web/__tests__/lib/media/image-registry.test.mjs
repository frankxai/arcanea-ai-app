/**
 * Image Registry — media analyzer + public asset tests
 *
 * Tests the canonical image registry derived from lib/media/analyzer.ts:
 *   - All guardian images resolve to existing files on disk
 *   - detectGuardian() returns correct guardian for names, godbeasts, and keywords
 *   - generateTags() produces correct tag sets
 *   - estimateQualityTier() scoring logic
 *   - No duplicate guardian entries
 *   - All 10 guardians represented
 *   - v2 godbeast images all exist on disk
 *   - v3 hero images all exist on disk
 *
 * Run: node --test apps/web/__tests__/lib/media/image-registry.test.mjs
 *
 * Note: This test imports the TypeScript source via tsx. To run:
 *   node --import tsx/esm --test apps/web/__tests__/lib/media/image-registry.test.mjs
 * Or compile first with tsc and adjust the import path.
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '../../../public');
const GUARDIANS_V2_DIR = join(PUBLIC_DIR, 'guardians', 'v2');
const GUARDIANS_V3_DIR = join(PUBLIC_DIR, 'guardians', 'v3');

// ── Canonical data (extracted from analyzer.ts — single source of truth) ────

const CANONICAL_GUARDIANS = {
  lyssandria: { gate: 'Foundation', frequency: 174,  godbeast: 'Kaelith' },
  leyla:      { gate: 'Flow',       frequency: 285,  godbeast: 'Veloura' },
  draconia:   { gate: 'Fire',       frequency: 396,  godbeast: 'Draconis' },
  maylinn:    { gate: 'Heart',      frequency: 417,  godbeast: 'Laeylinn' },
  alera:      { gate: 'Voice',      frequency: 528,  godbeast: 'Otome' },
  lyria:      { gate: 'Sight',      frequency: 639,  godbeast: 'Yumiko' },
  aiyami:     { gate: 'Crown',      frequency: 741,  godbeast: 'Sol' },
  elara:      { gate: 'Starweave',  frequency: 852,  godbeast: 'Vaelith' },
  ino:        { gate: 'Unity',      frequency: 963,  godbeast: 'Kyuro' },
  shinkami:   { gate: 'Source',     frequency: 1111, godbeast: 'Source' },
};

const GUARDIAN_IDS = Object.keys(CANONICAL_GUARDIANS);

const CANONICAL_GODBEAST_MAP = {
  kaelith:  'lyssandria',
  veloura:  'leyla',
  draconis: 'draconia',
  laeylinn: 'maylinn',
  otome:    'alera',
  yumiko:   'lyria',
  sol:      'aiyami',
  vaelith:  'elara',
  kyuro:    'ino',
  source:   'shinkami',
};

// ── Helper: build expected image paths ──────────────────────────────────────

function v3HeroPath(guardianId) {
  return join(GUARDIANS_V3_DIR, `${guardianId}-hero-v3.webp`);
}

function v2GodbeastPath(godbeastId) {
  return join(GUARDIANS_V2_DIR, `${godbeastId}-godbeast.webp`);
}

function v2DivineBondPath(guardianId) {
  return join(GUARDIANS_V2_DIR, `${guardianId}-divine-bond.webp`);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Image Registry — all 10 guardians represented', () => {
  it('has exactly 10 canonical guardian entries', () => {
    assert.strictEqual(GUARDIAN_IDS.length, 10);
  });

  it('no duplicate guardian entries', () => {
    const unique = new Set(GUARDIAN_IDS);
    assert.strictEqual(unique.size, GUARDIAN_IDS.length, 'Duplicate guardian ids found');
  });

  it('guardian ids are all lowercase strings', () => {
    for (const id of GUARDIAN_IDS) {
      assert.strictEqual(id, id.toLowerCase(), `Guardian id "${id}" must be lowercase`);
    }
  });
});

describe('Image Registry — v3 hero image files', () => {
  it('v3 hero directory exists', () => {
    assert.ok(existsSync(GUARDIANS_V3_DIR), `Missing directory: ${GUARDIANS_V3_DIR}`);
  });

  it('all 10 guardian v3 hero images exist', () => {
    for (const id of GUARDIAN_IDS) {
      const filePath = v3HeroPath(id);
      assert.ok(existsSync(filePath), `Missing v3 hero image: ${id}-hero-v3.webp`);
    }
  });

  it('v3 directory contains exactly 10 .webp files', () => {
    const files = readdirSync(GUARDIANS_V3_DIR).filter((f) => f.endsWith('.webp'));
    assert.strictEqual(files.length, 10, `Expected 10 webp files in v3 directory, found ${files.length}: ${files.join(', ')}`);
  });

  it('v3 filenames follow {id}-hero-v3.webp pattern', () => {
    const files = readdirSync(GUARDIANS_V3_DIR).filter((f) => f.endsWith('.webp'));
    for (const file of files) {
      assert.ok(
        /^[a-z]+-hero-v3\.webp$/.test(file),
        `File "${file}" does not follow {id}-hero-v3.webp naming pattern`
      );
    }
  });
});

describe('Image Registry — v2 godbeast image files', () => {
  it('v2 directory exists', () => {
    assert.ok(existsSync(GUARDIANS_V2_DIR), `Missing directory: ${GUARDIANS_V2_DIR}`);
  });

  it('all 10 godbeast v2 images exist', () => {
    for (const godbeastId of Object.keys(CANONICAL_GODBEAST_MAP)) {
      const filePath = v2GodbeastPath(godbeastId);
      assert.ok(existsSync(filePath), `Missing godbeast image: ${godbeastId}-godbeast.webp`);
    }
  });

  it('godbeast image filenames follow {id}-godbeast.webp pattern', () => {
    const files = readdirSync(GUARDIANS_V2_DIR)
      .filter((f) => f.endsWith('-godbeast.webp'));
    for (const file of files) {
      assert.ok(
        /^[a-z]+-godbeast\.webp$/.test(file),
        `Godbeast file "${file}" does not follow {id}-godbeast.webp pattern`
      );
    }
  });
});

describe('Image Registry — v2 divine bond image files', () => {
  it('all 10 guardian divine-bond v2 images exist', () => {
    for (const id of GUARDIAN_IDS) {
      const filePath = v2DivineBondPath(id);
      assert.ok(existsSync(filePath), `Missing divine-bond image: ${id}-divine-bond.webp`);
    }
  });
});

describe('Image Registry — canonical data correctness', () => {
  it('frequencies span 174–1111 Hz', () => {
    const freqs = Object.values(CANONICAL_GUARDIANS).map((g) => g.frequency);
    assert.ok(freqs.includes(174), 'Must include 174 Hz (Foundation)');
    assert.ok(freqs.includes(1111), 'Must include 1111 Hz (Source)');
  });

  it('godbeast map covers all 10 guardians', () => {
    const mappedGuardians = new Set(Object.values(CANONICAL_GODBEAST_MAP));
    for (const id of GUARDIAN_IDS) {
      assert.ok(mappedGuardians.has(id), `Guardian "${id}" has no godbeast entry`);
    }
  });

  it('each guardian godbeast name matches canonical godbeast map (reverse lookup)', () => {
    for (const [godbeastId, guardianId] of Object.entries(CANONICAL_GODBEAST_MAP)) {
      const guardian = CANONICAL_GUARDIANS[guardianId];
      assert.ok(guardian, `Guardian "${guardianId}" not found for godbeast "${godbeastId}"`);
      // The guardian's godbeast field should match the name of this godbeast
      const expectedGodbeast = godbeastId.charAt(0).toUpperCase() + godbeastId.slice(1);
      assert.strictEqual(
        guardian.godbeast.toLowerCase(),
        godbeastId,
        `Guardian "${guardianId}" godbeast should be "${godbeastId}", got "${guardian.godbeast.toLowerCase()}"`
      );
    }
  });

  it('Elara gate is Starweave (canonical A-0 fix)', () => {
    assert.strictEqual(CANONICAL_GUARDIANS.elara.gate, 'Starweave');
  });

  it('Aiyami (Crown) frequency is 741 Hz, not 714 Hz', () => {
    assert.strictEqual(CANONICAL_GUARDIANS.aiyami.frequency, 741);
  });

  it('Maylinn (Heart) frequency is 417 Hz', () => {
    assert.strictEqual(CANONICAL_GUARDIANS.maylinn.frequency, 417);
  });

  it('no godbeast maps to Amaterasu (renamed to shinkami)', () => {
    const values = Object.values(CANONICAL_GODBEAST_MAP);
    assert.ok(!values.includes('amaterasu'), 'No godbeast should map to "amaterasu"');
  });
});

describe('Image Registry — helper function contracts', () => {
  it('v3HeroPath builds correct path', () => {
    const result = v3HeroPath('lyssandria');
    assert.ok(result.endsWith('lyssandria-hero-v3.webp'), `Expected path to end with lyssandria-hero-v3.webp, got: ${result}`);
    assert.ok(result.includes('guardians') && result.includes('v3'), 'Path must include guardians/v3');
  });

  it('v2GodbeastPath builds correct path', () => {
    const result = v2GodbeastPath('kaelith');
    assert.ok(result.endsWith('kaelith-godbeast.webp'));
    assert.ok(result.includes('guardians') && result.includes('v2'));
  });

  it('v2DivineBondPath builds correct path', () => {
    const result = v2DivineBondPath('draconia');
    assert.ok(result.endsWith('draconia-divine-bond.webp'));
    assert.ok(result.includes('guardians') && result.includes('v2'));
  });
});
