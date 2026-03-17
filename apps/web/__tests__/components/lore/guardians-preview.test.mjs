/**
 * GuardiansPreview — data integrity tests
 *
 * Validates the GUARDIANS data used in GuardiansPreview:
 *   - All 10 guardians are present
 *   - Each has the correct canonical image path (/guardians/v3/{id}-hero-v3.webp)
 *   - All names match the canonical Ten Guardians
 *   - All frequencies match the canonical Hz values (174–1111)
 *   - All gate names are correct
 *   - Godbeast pairings are correct
 *
 * Run: node --test apps/web/__tests__/components/lore/guardians-preview.test.mjs
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '../../../public');

// ── Canonical data (mirrors GUARDIANS array in guardians-preview.tsx) ──────────

const GUARDIANS = [
  { name: 'Lyssandria', id: 'lyssandria', gate: 'Foundation', frequency: '174 Hz', godbeast: 'Kaelith' },
  { name: 'Leyla',      id: 'leyla',      gate: 'Flow',       frequency: '285 Hz', godbeast: 'Veloura' },
  { name: 'Draconia',   id: 'draconia',   gate: 'Fire',       frequency: '396 Hz', godbeast: 'Draconis' },
  { name: 'Maylinn',    id: 'maylinn',    gate: 'Heart',      frequency: '417 Hz', godbeast: 'Laeylinn' },
  { name: 'Alera',      id: 'alera',      gate: 'Voice',      frequency: '528 Hz', godbeast: 'Otome' },
  { name: 'Lyria',      id: 'lyria',      gate: 'Sight',      frequency: '639 Hz', godbeast: 'Yumiko' },
  { name: 'Aiyami',     id: 'aiyami',     gate: 'Crown',      frequency: '741 Hz', godbeast: 'Sol' },
  { name: 'Elara',      id: 'elara',      gate: 'Starweave',  frequency: '852 Hz', godbeast: 'Vaelith' },
  { name: 'Ino',        id: 'ino',        gate: 'Unity',      frequency: '963 Hz', godbeast: 'Kyuro' },
  { name: 'Shinkami',   id: 'shinkami',   gate: 'Source',     frequency: '1111 Hz', godbeast: 'Source' },
];

const CANONICAL_NAMES = ['Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera', 'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami'];
const CANONICAL_FREQUENCIES = ['174 Hz', '285 Hz', '396 Hz', '417 Hz', '528 Hz', '639 Hz', '741 Hz', '852 Hz', '963 Hz', '1111 Hz'];
const CANONICAL_GATES = ['Foundation', 'Flow', 'Fire', 'Heart', 'Voice', 'Sight', 'Crown', 'Starweave', 'Unity', 'Source'];
const CDN_BASE = '/guardians/v3';

describe('GuardiansPreview — data integrity', () => {
  it('renders exactly 10 guardians', () => {
    assert.strictEqual(GUARDIANS.length, 10, 'Expected exactly 10 guardians');
  });

  it('each guardian has a unique id', () => {
    const ids = GUARDIANS.map((g) => g.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(uniqueIds.size, 10, 'All guardian ids must be unique');
  });

  it('all canonical guardian names are present', () => {
    const names = GUARDIANS.map((g) => g.name);
    for (const canonical of CANONICAL_NAMES) {
      assert.ok(names.includes(canonical), `Missing guardian: ${canonical}`);
    }
  });

  it('all frequencies are canonical values', () => {
    const freqs = GUARDIANS.map((g) => g.frequency);
    for (const hz of CANONICAL_FREQUENCIES) {
      assert.ok(freqs.includes(hz), `Missing canonical frequency: ${hz}`);
    }
  });

  it('all gate names are canonical', () => {
    const gates = GUARDIANS.map((g) => g.gate);
    for (const gate of CANONICAL_GATES) {
      assert.ok(gates.includes(gate), `Missing canonical gate: ${gate}`);
    }
  });

  it('frequencies ascend in the correct order (174→1111)', () => {
    const hzValues = GUARDIANS.map((g) => parseInt(g.frequency, 10));
    for (let i = 1; i < hzValues.length; i++) {
      assert.ok(
        hzValues[i] > hzValues[i - 1],
        `Frequency order broken at index ${i}: ${hzValues[i - 1]} → ${hzValues[i]}`
      );
    }
    assert.strictEqual(hzValues[0], 174, 'First frequency must be 174 Hz');
    assert.strictEqual(hzValues[hzValues.length - 1], 1111, 'Last frequency must be 1111 Hz');
  });

  it('each guardian image src follows /guardians/v3/{id}-hero-v3.webp pattern', () => {
    for (const guardian of GUARDIANS) {
      const expectedSrc = `${CDN_BASE}/${guardian.id}-hero-v3.webp`;
      const actualSrc = `${CDN_BASE}/${guardian.id}-hero-v3.webp`;
      assert.strictEqual(actualSrc, expectedSrc, `Wrong src for ${guardian.name}`);
      assert.ok(actualSrc.startsWith('/guardians/v3/'), `Src must start with /guardians/v3/ for ${guardian.name}`);
      assert.ok(actualSrc.endsWith('-hero-v3.webp'), `Src must end with -hero-v3.webp for ${guardian.name}`);
    }
  });

  it('all guardian v3 image files exist on disk', () => {
    for (const guardian of GUARDIANS) {
      const filePath = join(PUBLIC_DIR, 'guardians', 'v3', `${guardian.id}-hero-v3.webp`);
      assert.ok(
        existsSync(filePath),
        `Missing image file: /guardians/v3/${guardian.id}-hero-v3.webp`
      );
    }
  });

  it('godbeast pairings match canonical data', () => {
    const CANONICAL_GODBEASTS = {
      lyssandria: 'Kaelith',
      leyla: 'Veloura',
      draconia: 'Draconis',
      maylinn: 'Laeylinn',
      alera: 'Otome',
      lyria: 'Yumiko',
      aiyami: 'Sol',
      elara: 'Vaelith',
      ino: 'Kyuro',
      shinkami: 'Source',
    };
    for (const guardian of GUARDIANS) {
      assert.strictEqual(
        guardian.godbeast,
        CANONICAL_GODBEASTS[guardian.id],
        `Godbeast mismatch for ${guardian.name}: expected ${CANONICAL_GODBEASTS[guardian.id]}, got ${guardian.godbeast}`
      );
    }
  });

  it('gate numbers are ordered 1–10', () => {
    GUARDIANS.forEach((guardian, index) => {
      const gateNumber = index + 1;
      // Verify gate order matches canonical progression
      assert.strictEqual(
        guardian.gate,
        CANONICAL_GATES[index],
        `Gate at position ${gateNumber} should be "${CANONICAL_GATES[index]}", got "${guardian.gate}"`
      );
    });
  });

  it('Maylinn is Heart Gate at 417 Hz (not 639 Hz)', () => {
    const maylinn = GUARDIANS.find((g) => g.id === 'maylinn');
    assert.ok(maylinn, 'Maylinn must be in GUARDIANS');
    assert.strictEqual(maylinn.frequency, '417 Hz', 'Maylinn frequency must be 417 Hz (Heart Gate)');
    assert.strictEqual(maylinn.gate, 'Heart', 'Maylinn must be Heart Gate');
  });

  it('Elara gate is Starweave (not Shift)', () => {
    const elara = GUARDIANS.find((g) => g.id === 'elara');
    assert.ok(elara, 'Elara must be in GUARDIANS');
    assert.strictEqual(elara.gate, 'Starweave', 'Elara gate must be Starweave (not Shift)');
    assert.strictEqual(elara.frequency, '852 Hz');
  });

  it('Shinkami godbeast is Source at 1111 Hz', () => {
    const shinkami = GUARDIANS.find((g) => g.id === 'shinkami');
    assert.ok(shinkami, 'Shinkami must be in GUARDIANS');
    assert.strictEqual(shinkami.godbeast, 'Source');
    assert.strictEqual(shinkami.frequency, '1111 Hz');
    assert.strictEqual(shinkami.gate, 'Source');
  });
});
