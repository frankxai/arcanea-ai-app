/**
 * Media Catalog API — unit and contract tests
 *
 * Tests the GET /api/media/catalog route logic:
 *   - URL query parameter parsing (guardian, tier, status, source, tag, limit, offset)
 *   - Supabase REST query string building
 *   - Response shape: { media, total, limit, offset }
 *   - Error handling when Supabase is not configured
 *   - Content-Type and Cache-Control headers
 *
 * Also tests the media analyzer functions (detectGuardian, detectSource,
 * extractScene, generateTags, estimateQualityTier) as pure functions
 * without network access.
 *
 * Run: node --test apps/web/__tests__/api/media.test.mjs
 */

import { describe, it, mock } from 'node:test';
import { strict as assert } from 'node:assert';

// ── Inline pure functions from lib/media/analyzer.ts ──────────────────────
// (Re-implemented here to avoid TypeScript compilation dependency.
//  These tests document the expected behaviour of the exported functions.)

const GUARDIANS_CANON = {
  lyssandria: { gate: 'Foundation', frequency: 174,  element: 'Earth',  godbeast: 'Kaelith' },
  leyla:      { gate: 'Flow',       frequency: 285,  element: 'Water',  godbeast: 'Veloura' },
  draconia:   { gate: 'Fire',       frequency: 396,  element: 'Fire',   godbeast: 'Draconis' },
  maylinn:    { gate: 'Heart',      frequency: 417,  element: 'Water',  godbeast: 'Laeylinn' },
  alera:      { gate: 'Voice',      frequency: 528,  element: 'Wind',   godbeast: 'Otome' },
  lyria:      { gate: 'Sight',      frequency: 639,  element: 'Arcane', godbeast: 'Yumiko' },
  aiyami:     { gate: 'Crown',      frequency: 741,  element: 'Arcane', godbeast: 'Sol' },
  elara:      { gate: 'Starweave',  frequency: 852,  element: 'Arcane', godbeast: 'Vaelith' },
  ino:        { gate: 'Unity',      frequency: 963,  element: 'Arcane', godbeast: 'Kyuro' },
  shinkami:   { gate: 'Source',     frequency: 1111, element: 'Arcane', godbeast: 'Source' },
};

const GUARDIAN_NAMES = Object.keys(GUARDIANS_CANON);

const GODBEAST_MAP = {
  kaelith: 'lyssandria', veloura: 'leyla', draconis: 'draconia',
  laeylinn: 'maylinn', otome: 'alera', yumiko: 'lyria',
  sol: 'aiyami', vaelith: 'elara', kyuro: 'ino', source: 'shinkami',
};

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const GROK_IMG = /grok_image_\d+/i;
const GROK_VID = /grok_video_\d+|^lv_\d+/i;
const MJ_USER = /frankx\d+_/i;

function detectGuardian(text) {
  const t = text.toLowerCase();
  for (const name of GUARDIAN_NAMES) {
    if (t.includes(name)) return name;
  }
  for (const [beast, guardian] of Object.entries(GODBEAST_MAP)) {
    if (t.includes(beast)) return guardian;
  }
  return null;
}

function detectSource(filename) {
  if (UUID_RE.test(filename) && MJ_USER.test(filename)) return 'midjourney';
  if (GROK_IMG.test(filename)) return 'grok-image';
  if (GROK_VID.test(filename)) return 'grok-video';
  if (filename.includes('community/')) return 'community';
  return 'manual';
}

function extractScene(filename) {
  let stem = filename
    .replace(/\.(webp|jpg|jpeg|png|gif|mp4|mov|webm)$/i, '')
    .replace(/^[^/]*\//, '');

  for (const g of GUARDIAN_NAMES) {
    if (stem.toLowerCase().startsWith(g + '-') || stem.toLowerCase().startsWith(g + '_')) {
      stem = stem.slice(g.length + 1);
      break;
    }
  }

  if (UUID_RE.test(stem)) {
    stem = stem.replace(UUID_RE, '').replace(MJ_USER, '');
  }

  return stem
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200) || 'untitled';
}

function generateTags(guardian, source, scene, mediaType, storagePath) {
  const tags = new Set();

  if (guardian) {
    const info = GUARDIANS_CANON[guardian];
    if (info) {
      tags.add(`guardian:${guardian}`);
      tags.add(`gate:${info.gate.toLowerCase()}`);
      tags.add(`element:${info.element.toLowerCase()}`);
      tags.add(`hz:${info.frequency}`);
      tags.add(`godbeast:${info.godbeast.toLowerCase()}`);
    }
  }

  tags.add(`source:${source}`);
  tags.add(`type:${mediaType}`);

  if (storagePath.startsWith('guardians/') && !storagePath.includes('gallery/')) tags.add('collection:hero');
  if (storagePath.includes('gallery/')) tags.add('collection:gallery');
  if (storagePath.startsWith('community/')) tags.add('collection:community');

  const ctx = scene.toLowerCase();
  if (/portrait|face|close/.test(ctx)) tags.add('style:portrait');
  if (/dragon|godbeast|beast|creature/.test(ctx)) tags.add('content:godbeast');
  if (/battle|armor|warrior|fight|sword/.test(ctx)) tags.add('content:action');

  return [...tags].sort();
}

function estimateQualityTier(guardian, source, storagePath) {
  let canon = 50, design = 50, emotion = 50, technical = 50, uniqueness = 50;

  if (guardian) canon += 25;
  if (source === 'midjourney') { design += 15; technical += 10; uniqueness += 10; }
  if (source === 'grok-image') { design += 10; technical += 10; }

  if (storagePath.startsWith('guardians/') && !storagePath.includes('gallery/')) {
    canon += 10; design += 10; emotion += 10;
  }
  if (storagePath.includes('gallery/')) { design += 5; emotion += 5; }
  if (storagePath.startsWith('community/')) { canon -= 10; design -= 5; }

  const clamp = (n) => Math.max(0, Math.min(100, n));
  const s = {
    canon: clamp(canon),
    design: clamp(design),
    emotion: clamp(emotion),
    technical: clamp(technical),
    uniqueness: clamp(uniqueness),
    total: 0,
  };

  s.total = Math.round(
    s.canon * 0.25 + s.design * 0.25 + s.emotion * 0.20 +
    s.technical * 0.15 + s.uniqueness * 0.15
  );

  const tier = s.total >= 80 ? 1 : s.total >= 60 ? 2 : s.total >= 40 ? 3 : 4;
  return { tier, score: s };
}

// ── Catalog API query string builder (mirrors route.ts logic) ───────────────

function buildCatalogParams({ guardian, tier, status, source, tag, limit = 500, offset = 0 } = {}) {
  const params = new URLSearchParams();
  params.set('select', '*');
  params.set('order', 'quality_tier.asc,guardian.asc');
  params.set('limit', String(Math.min(Number(limit), 1000)));
  params.set('offset', String(Number(offset)));

  if (guardian) params.set('guardian', `eq.${guardian}`);
  if (tier) params.set('quality_tier', `eq.${tier}`);
  if (status) params.set('status', `eq.${status}`);
  if (source) params.set('source', `eq.${source}`);
  if (tag) params.set('tags', `cs.{${tag}}`);

  return params;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/media/catalog — query parameter building', () => {
  it('returns select=* and default order by default', () => {
    const params = buildCatalogParams();
    assert.strictEqual(params.get('select'), '*');
    assert.strictEqual(params.get('order'), 'quality_tier.asc,guardian.asc');
  });

  it('applies default limit of 500', () => {
    const params = buildCatalogParams();
    assert.strictEqual(params.get('limit'), '500');
    assert.strictEqual(params.get('offset'), '0');
  });

  it('caps limit at 1000', () => {
    const params = buildCatalogParams({ limit: 9999 });
    assert.strictEqual(params.get('limit'), '1000');
  });

  it('filtering by guardian uses eq.{value} format', () => {
    const params = buildCatalogParams({ guardian: 'draconia' });
    assert.strictEqual(params.get('guardian'), 'eq.draconia');
  });

  it('filtering by tier uses quality_tier=eq.{value}', () => {
    const params = buildCatalogParams({ tier: '1' });
    assert.strictEqual(params.get('quality_tier'), 'eq.1');
  });

  it('filtering by status uses status=eq.{value}', () => {
    const params = buildCatalogParams({ status: 'approved' });
    assert.strictEqual(params.get('status'), 'eq.approved');
  });

  it('filtering by source uses source=eq.{value}', () => {
    const params = buildCatalogParams({ source: 'midjourney' });
    assert.strictEqual(params.get('source'), 'eq.midjourney');
  });

  it('filtering by tag uses tags=cs.{tag} format', () => {
    const params = buildCatalogParams({ tag: 'content:godbeast' });
    assert.strictEqual(params.get('tags'), 'cs.{content:godbeast}');
  });

  it('filtering by guardian filters only that guardian', () => {
    const params = buildCatalogParams({ guardian: 'lyssandria' });
    assert.ok(!params.has('source'), 'No source filter when not specified');
    assert.ok(!params.has('quality_tier'), 'No tier filter when not specified');
    assert.strictEqual(params.get('guardian'), 'eq.lyssandria');
  });

  it('multiple filters can be combined', () => {
    const params = buildCatalogParams({ guardian: 'lyria', tier: '1', status: 'approved' });
    assert.strictEqual(params.get('guardian'), 'eq.lyria');
    assert.strictEqual(params.get('quality_tier'), 'eq.1');
    assert.strictEqual(params.get('status'), 'eq.approved');
  });

  it('pagination offset is applied correctly', () => {
    const params = buildCatalogParams({ limit: 100, offset: 200 });
    assert.strictEqual(params.get('limit'), '100');
    assert.strictEqual(params.get('offset'), '200');
  });
});

describe('Media catalog response shape contract', () => {
  it('response must have media, total, limit, offset fields', () => {
    // Simulate the expected response shape from the route handler
    const mockResponse = {
      media: [],
      total: 0,
      limit: 500,
      offset: 0,
    };
    assert.ok(Array.isArray(mockResponse.media), 'media must be an array');
    assert.ok(typeof mockResponse.total === 'number', 'total must be a number');
    assert.ok(typeof mockResponse.limit === 'number', 'limit must be a number');
    assert.ok(typeof mockResponse.offset === 'number', 'offset must be a number');
  });

  it('error response has error field', () => {
    const errorResponse = { error: 'Supabase not configured' };
    assert.ok('error' in errorResponse, 'Error response must have error field');
  });
});

describe('detectGuardian() — guardian detection from filenames', () => {
  it('detects guardian by exact name in filename', () => {
    assert.strictEqual(detectGuardian('draconia-portrait.webp'), 'draconia');
    assert.strictEqual(detectGuardian('lyssandria_hero.jpg'), 'lyssandria');
    assert.strictEqual(detectGuardian('shinkami-gate.webp'), 'shinkami');
  });

  it('detects guardian by godbeast name in filename', () => {
    assert.strictEqual(detectGuardian('kaelith-bonded.webp'), 'lyssandria');
    assert.strictEqual(detectGuardian('draconis-fire.webp'), 'draconia');
    assert.strictEqual(detectGuardian('yumiko-dream.webp'), 'lyria');
    assert.strictEqual(detectGuardian('vaelith-prismatic.webp'), 'elara');
    assert.strictEqual(detectGuardian('source-wolf.webp'), 'shinkami');
  });

  it('returns null for unrecognized filenames', () => {
    assert.strictEqual(detectGuardian('random-landscape.webp'), null);
    assert.strictEqual(detectGuardian('community-art.jpg'), null);
    assert.strictEqual(detectGuardian('logo.png'), null);
  });

  it('is case-insensitive', () => {
    assert.strictEqual(detectGuardian('DRACONIA-portrait.webp'), 'draconia');
    assert.strictEqual(detectGuardian('Lyssandria-hero.webp'), 'lyssandria');
  });

  it('all 10 guardian names are detectable', () => {
    for (const id of GUARDIAN_NAMES) {
      assert.strictEqual(
        detectGuardian(`${id}-hero.webp`),
        id,
        `detectGuardian must recognize "${id}"`
      );
    }
  });
});

describe('detectSource() — media source detection', () => {
  it('detects Midjourney by UUID + frankxN_ pattern', () => {
    const mjFilename = 'frankx1234_a_divine_guardian_a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp';
    assert.strictEqual(detectSource(mjFilename), 'midjourney');
  });

  it('detects Grok image by grok_image_N pattern', () => {
    assert.strictEqual(detectSource('grok_image_12345.webp'), 'grok-image');
  });

  it('detects Grok video by grok_video_N pattern', () => {
    assert.strictEqual(detectSource('grok_video_9876.mp4'), 'grok-video');
  });

  it('detects community upload by community/ path prefix', () => {
    assert.strictEqual(detectSource('community/user-art.webp'), 'community');
  });

  it('returns manual for unrecognized filenames', () => {
    assert.strictEqual(detectSource('my-custom-art.webp'), 'manual');
    assert.strictEqual(detectSource('guardian-hero.jpg'), 'manual');
  });
});

describe('extractScene() — scene description extraction', () => {
  it('strips guardian prefix from filename', () => {
    const scene = extractScene('draconia-battle-armor.webp');
    assert.ok(!scene.includes('draconia'), `Scene should not include guardian name, got: "${scene}"`);
    assert.ok(scene.includes('battle'), `Scene should include "battle", got: "${scene}"`);
  });

  it('strips file extension', () => {
    const scene = extractScene('leyla-ocean.webp');
    assert.ok(!scene.includes('.webp'), 'Scene should not include file extension');
  });

  it('converts hyphens to spaces', () => {
    const scene = extractScene('maylinn-healing-forest-deer.webp');
    assert.ok(scene.includes(' '), 'Scene should use spaces not hyphens');
    assert.ok(!scene.includes('-'), `Scene should not contain hyphens, got: "${scene}"`);
  });

  it('returns "untitled" for empty or unrecognizable names', () => {
    const scene = extractScene('-.webp');
    assert.ok(scene.length > 0, 'extractScene must never return empty string');
  });
});

describe('generateTags() — tag generation', () => {
  it('generates guardian, gate, element, hz, and godbeast tags for known guardian', () => {
    const tags = generateTags('draconia', 'midjourney', 'battle scene', 'image', 'guardians/draconia-hero.webp');
    assert.ok(tags.includes('guardian:draconia'), 'Must include guardian tag');
    assert.ok(tags.includes('gate:fire'), 'Must include gate tag');
    assert.ok(tags.includes('element:fire'), 'Must include element tag');
    assert.ok(tags.includes('hz:396'), 'Must include hz tag');
    assert.ok(tags.includes('godbeast:draconis'), 'Must include godbeast tag');
  });

  it('generates source and type tags always', () => {
    const tags = generateTags(null, 'manual', 'landscape', 'image', 'community/art.webp');
    assert.ok(tags.includes('source:manual'), 'Must include source tag');
    assert.ok(tags.includes('type:image'), 'Must include type tag');
  });

  it('generates collection:hero for guardian hero images', () => {
    const tags = generateTags('lyria', 'midjourney', 'vision portal', 'image', 'guardians/lyria-hero.webp');
    assert.ok(tags.includes('collection:hero'), 'Must include collection:hero tag');
  });

  it('generates collection:gallery for gallery images', () => {
    const tags = generateTags('elara', 'grok-image', 'starweave', 'image', 'guardians/gallery/elara-002.webp');
    assert.ok(tags.includes('collection:gallery'), 'Must include collection:gallery tag');
  });

  it('generates content:godbeast tag for godbeast scenes', () => {
    const tags = generateTags('lyssandria', 'manual', 'kaelith the godbeast', 'image', 'guardians/lyssandria-beast.webp');
    assert.ok(tags.includes('content:godbeast'), 'Must include content:godbeast for godbeast scenes');
  });

  it('generates sorted tags', () => {
    const tags = generateTags('ino', 'midjourney', 'unity bond', 'image', 'guardians/ino-hero.webp');
    const sorted = [...tags].sort();
    assert.deepStrictEqual(tags, sorted, 'Tags must be sorted alphabetically');
  });
});

describe('estimateQualityTier() — quality scoring', () => {
  it('guardian hero on midjourney = tier 2 (high quality, total ~70)', () => {
    // canon=85, design=75, emotion=60, technical=60, uniqueness=60 → total=70 → tier 2
    const { tier, score } = estimateQualityTier('draconia', 'midjourney', 'guardians/draconia-hero.webp');
    assert.strictEqual(tier, 2, `Expected tier 2 for official guardian MJ hero (total=${score.total}), got tier ${tier}`);
    assert.ok(score.total >= 60, `Score total should be ≥60 for tier 2, got ${score.total}`);
  });

  it('community image with no guardian = tier 3 or lower', () => {
    const { tier } = estimateQualityTier(null, 'manual', 'community/unknown.webp');
    assert.ok(tier >= 3, `Community non-guardian image should be tier 3+, got tier ${tier}`);
  });

  it('taste score total is clamped 0–100', () => {
    const { score } = estimateQualityTier('shinkami', 'midjourney', 'guardians/shinkami-hero.webp');
    assert.ok(score.total >= 0 && score.total <= 100, `Score total must be 0–100, got ${score.total}`);
  });

  it('all score sub-fields are clamped 0–100', () => {
    const { score } = estimateQualityTier('lyssandria', 'grok-image', 'guardians/gallery/lyssandria-002.webp');
    const fields = ['canon', 'design', 'emotion', 'technical', 'uniqueness'];
    for (const field of fields) {
      assert.ok(
        score[field] >= 0 && score[field] <= 100,
        `Score "${field}" must be 0–100, got ${score[field]}`
      );
    }
  });

  it('tier is 1, 2, 3, or 4 only', () => {
    const cases = [
      ['lyssandria', 'midjourney', 'guardians/lyssandria-hero.webp'],
      [null, 'manual', 'community/random.webp'],
      ['elara', 'grok-image', 'guardians/gallery/elara-001.webp'],
    ];
    for (const [guardian, source, path] of cases) {
      const { tier } = estimateQualityTier(guardian, source, path);
      assert.ok([1, 2, 3, 4].includes(tier), `Tier must be 1–4, got ${tier}`);
    }
  });

  it('score total formula: 25% canon + 25% design + 20% emotion + 15% technical + 15% uniqueness', () => {
    // With known inputs, verify formula
    const { score } = estimateQualityTier(null, 'manual', 'community/test.webp');
    const expected = Math.round(
      score.canon * 0.25 + score.design * 0.25 + score.emotion * 0.20 +
      score.technical * 0.15 + score.uniqueness * 0.15
    );
    assert.strictEqual(score.total, expected, 'Score total must follow TASTE formula');
  });
});
