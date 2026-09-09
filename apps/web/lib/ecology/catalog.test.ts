import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import {
  ECOLOGY_ENTRIES,
  ECOLOGY_RECORDS,
  HERO_PLANT_SLUGS,
  validateEcologyCatalog,
} from './catalog';
import { atlasLightContract, atlasMediaUrl, isAtlasVisualReady } from './schema';

const GENERATED_AT_BY_SLUG: Record<(typeof HERO_PLANT_SLUGS)[number], string> = {
  stonegrass: '2026-09-02T21:44:59.500Z',
  tideplant: '2026-09-02T20:54:17.159Z',
  'heartbound-emberlily': '2026-09-02T20:53:10.085Z',
  'choirheart-rose': '2026-09-02T20:50:24.037Z',
  'floracion-azul': '2026-09-02T20:56:42.422Z',
  'espejo-de-agua': '2026-09-02T20:57:08.403Z',
  'granada-luminica': '2026-09-02T20:57:39.900Z',
  'aevor-threadvine': '2026-09-02T21:45:29.789Z',
  sombraluz: '2026-09-02T21:46:33.834Z',
  'firstseed-of-shinkami': '2026-09-02T22:02:54.947Z',
};

describe('Living Atlas catalog', () => {
  it('has unique canonical records and complete light contracts', () => {
    assert.deepEqual(validateEcologyCatalog(), []);
    assert.equal(ECOLOGY_ENTRIES.length, ECOLOGY_RECORDS.length);
    assert.ok(ECOLOGY_ENTRIES.every((entry, index) => entry.record === ECOLOGY_RECORDS[index]));
  });

  it('keeps every new Wave 01 record in proposal state', () => {
    assert.ok(ECOLOGY_RECORDS.every((record) => record.canon.state === 'proposal'));
  });

  it('contains the complete ten-plant hero collection', () => {
    const slugs = new Set(ECOLOGY_RECORDS.map((record) => record.slug));
    assert.equal(HERO_PLANT_SLUGS.length, 10);
    for (const slug of HERO_PLANT_SLUGS) assert.equal(slugs.has(slug), true, slug);
  });

  it('selects canonical hero-role media and verifies every staged asset receipt', () => {
    const heroEntries = ECOLOGY_ENTRIES.filter((entry) =>
      HERO_PLANT_SLUGS.includes(entry.record.slug as (typeof HERO_PLANT_SLUGS)[number]),
    );
    assert.equal(heroEntries.length, HERO_PLANT_SLUGS.length);
    for (const entry of heroEntries) {
      const { heroMedia, record } = entry;
      const slug = record.slug as (typeof HERO_PLANT_SLUGS)[number];
      const mediaUrl = atlasMediaUrl(entry);
      assert.equal(heroMedia.role, 'habitat-hero');
      assert.equal(heroMedia.status, 'staged');
      assert.equal(heroMedia.url, undefined, 'root-relative delivery paths must not masquerade as absolute URIs');
      assert.equal(heroMedia.deliveryKey, `/images/ecology/${slug}-hero.webp`);
      assert.equal(mediaUrl, `/images/ecology/${slug}-hero.webp`);
      assert.equal(heroMedia.width, 1448);
      assert.equal(heroMedia.height, 1086);
      assert.equal(heroMedia.mimeType, 'image/webp');
      assert.match(heroMedia.sha256 ?? '', /^[a-f0-9]{64}$/);
      assert.equal(heroMedia.generationModel, undefined, 'image_gen is the interface; the underlying model was not reported');
      assert.equal(heroMedia.generatedAt, GENERATED_AT_BY_SLUG[slug]);
      assert.equal(isAtlasVisualReady(entry), true);
      assert.equal(record.media?.find((asset) => asset.role === 'habitat-hero'), heroMedia);

      assert.equal(typeof mediaUrl, 'string');
      const mediaPath = join(process.cwd(), 'public', mediaUrl?.replace(/^\//, '') ?? '');
      const digest = createHash('sha256').update(readFileSync(mediaPath)).digest('hex');
      assert.equal(digest, heroMedia.sha256, mediaPath);
    }
  });

  it('keeps the four unillustrated support organisms graph-only', () => {
    const heroes = new Set<string>(HERO_PLANT_SLUGS);
    const support = ECOLOGY_ENTRIES.filter((entry) => !heroes.has(entry.record.slug));
    assert.deepEqual(
      support.map((entry) => entry.record.slug).sort(),
      ['bractling', 'ledgerroot', 'pulseward', 'serein-moth'],
    );
    for (const entry of support) {
      assert.equal(entry.heroMedia.role, 'habitat-hero');
      assert.equal(entry.heroMedia.status, 'planned');
      assert.equal(atlasMediaUrl(entry), undefined);
      assert.equal(isAtlasVisualReady(entry), false);
    }
  });

  it('freezes the Wave 01 mechanisms depicted by the staged art', () => {
    const bySlug = new Map(ECOLOGY_ENTRIES.map((entry) => [entry.record.slug, entry]));
    const light = (slug: string) => {
      const entry = bySlug.get(slug);
      assert.ok(entry, slug);
      return atlasLightContract(entry);
    };
    assert.match(light('stonegrass').failureMode, /mineralizes .* inert seasonal pavement/i);
    assert.equal(bySlug.get('stonegrass')?.record.radiance?.mechanism, 'mechanoluminescence');
    assert.match(light('tideplant').cost, /newest memory .* oldest/i);
    assert.match(
      bySlug.get('heartbound-emberlily')?.record.lifeCycle.growth ?? '',
      /one bloom .*cold obsidian ring.*exactly one seed/i,
    );
    assert.match(light('floracion-azul').failureMode, /conflicting tone closes .* suppresses/i);
    assert.equal(bySlug.get('espejo-de-agua')?.record.radiance, undefined);
    assert.match(light('espejo-de-agua').failureMode, /fold .* until the next tide/i);
    assert.match(
      bySlug.get('granada-luminica')?.record.lifeCycle.growth ?? '',
      /branch goes dark .* dormant for one full year/i,
    );
    assert.match(light('aevor-threadvine').signal, /one route lights .* every alternative vein extinguishes/i);
    assert.match(bySlug.get('sombraluz')?.record.taxonomy.dimensions.description ?? '', /eighteen-metre/i);
    assert.match(light('sombraluz').failureMode, /severing one root spoke .* canopy sector .* inert/i);
    assert.match(
      bySlug.get('firstseed-of-shinkami')?.record.lifeCycle.growth ?? '',
      /exactly one of 10 potential germ layers.*other nine.*erased/i,
    );
    assert.match(
      bySlug.get('firstseed-of-shinkami')?.record.lifeCycle.reproduction ?? '',
      /no cutting, tissue sample, or daughter seed can clone/i,
    );
  });

  it('resolves every canonical relationship target', () => {
    const ids = new Set(ECOLOGY_RECORDS.map((record) => record.id));
    for (const record of ECOLOGY_RECORDS) {
      for (const relationship of record.ecology.relationships) {
        assert.equal(ids.has(relationship.targetId), true, `${record.id} -> ${relationship.targetId}`);
      }
    }
  });

  it('preserves measurable scale so colossal biology cannot bypass structural review', () => {
    const bySlug = new Map(ECOLOGY_RECORDS.map((record) => [record.slug, record]));
    assert.equal(bySlug.get('choirheart-rose')?.taxonomy.dimensions.heightM, 28);
    assert.equal(bySlug.get('aevor-threadvine')?.taxonomy.dimensions.spanM, 40);
    assert.equal(bySlug.get('sombraluz')?.taxonomy.dimensions.heightM, 18);
    assert.equal(bySlug.get('pulseward')?.taxonomy.dimensions.spanM, 6);
    assert.equal(bySlug.get('stonegrass')?.taxonomy.dimensions.spanM, 1000);
  });

  it('keeps source claims separate from generated proposal mechanics', () => {
    const sourceBacked = ECOLOGY_RECORDS.filter((record) => record.provenance.sourceClaims.length > 0);
    assert.ok(sourceBacked.length > 0);
    for (const record of sourceBacked) {
      const sources = new Map(record.provenance.sources.map((source) => [source.id, source]));
      for (const claim of record.provenance.sourceClaims) {
        assert.ok(claim.fieldPaths.length > 0);
        assert.ok(claim.sourceIds.every((sourceId) => sources.get(sourceId)?.type === 'staging-lore'));
      }
      assert.ok(record.provenance.proposalMechanics.length > 0);
      assert.ok(record.provenance.proposalMechanics.every((mechanic) => mechanic.state === 'proposal'));
      assert.equal(record.canon.state, 'proposal');
    }
  });
});
