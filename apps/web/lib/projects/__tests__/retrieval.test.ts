import { strict as assert } from 'node:assert';
import {
  buildProjectRetrievalBlock,
  buildProjectRetrievalTraceMetadata,
  selectRelevantProjectContext,
} from '../retrieval';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(error);
  }
}

async function main() {
  await test('selectRelevantProjectContext prioritizes matching sessions, creations, docs, and memories', () => {
    const selection = selectRelevantProjectContext({
      recentContext: 'Refine the relic engine power budget and atlas city map notes.',
      sessions: [
        { id: 's1', title: 'Atlas city map planning' },
        { id: 's2', title: 'Character naming pass' },
        { id: 's3', title: 'Relic engine power budget' },
      ],
      creations: [
        { id: 'c1', title: 'Atlas city map', type: 'image' },
        { id: 'c2', title: 'House sigils', type: 'image' },
      ],
      docs: [
        { id: 'd1', title: 'Relic engine notes', docType: 'spec', excerpt: 'Power budget for the relic engine and atlas transit core.' },
        { id: 'd2', title: 'Character naming pass', docType: 'note', excerpt: 'Naming notes for the main cast.' },
      ],
      memories: [
        { id: 'm1', content: 'Relic engines rely on harmonic crystal cores.', category: 'worldbuilding' },
        { id: 'm2', content: 'The main cast names follow river constellations.', category: 'characters' },
      ],
      graphSummary: {
        summary: 'Atlas is a science-fantasy project centered on floating cities and relic engines.',
        tags: ['atlas', 'relic-engine'],
        facts: ['Goal: turn Atlas into a playable story world.'],
      },
    });

    assert.deepEqual(selection.sessions.map((item) => item.id), ['s3', 's1', 's2']);
    assert.deepEqual(selection.creations.map((item) => item.id), ['c1', 'c2']);
    assert.deepEqual(selection.docs.map((item) => item.id), ['d1', 'd2']);
    assert.deepEqual(selection.memories.map((item) => item.id), ['m1', 'm2']);
    assert.equal(selection.contextTerms.includes('atlas'), true);
    assert.equal(selection.contextTerms.includes('relic'), true);
  });

  await test('buildProjectRetrievalBlock includes graph summary, facts, and selected items', () => {
    const block = buildProjectRetrievalBlock({
      sessions: [{ id: 's1', title: 'Atlas city map planning' }],
      creations: [{ id: 'c1', title: 'Atlas city map', type: 'image' }],
      docs: [{ id: 'd1', title: 'Relic engine notes', docType: 'spec', excerpt: 'Power budget for the relic engine.' }],
      memories: [{ id: 'm1', content: 'Relic engines rely on harmonic crystal cores.', category: 'worldbuilding' }],
      graphSummary: {
        summary: 'Atlas is a science-fantasy project.',
        tags: ['atlas', 'map'],
        facts: ['Goal: turn Atlas into a playable story world.'],
      },
      contextTerms: ['atlas', 'relic', 'map'],
    });

    assert.equal(block.includes('Summary: Atlas is a science-fantasy project.'), true);
    assert.equal(block.includes('Tags: atlas, map'), true);
    assert.equal(block.includes('- Session: Atlas city map planning'), true);
    assert.equal(block.includes('- Creation: Atlas city map (image)'), true);
    assert.equal(block.includes('- Doc: Relic engine notes (spec)'), true);
    assert.equal(block.includes('Excerpt: Power budget for the relic engine.'), true);
    assert.equal(block.includes('- Memory [worldbuilding]: Relic engines rely on harmonic crystal cores.'), true);
    assert.equal(block.includes('Active retrieval terms: atlas, relic, map'), true);
  });

  await test('buildProjectRetrievalTraceMetadata summarizes retrieval payload shape', () => {
    const metadata = buildProjectRetrievalTraceMetadata({
      sessions: [{ id: 's1', title: 'Atlas city map planning' }],
      creations: [{ id: 'c1', title: 'Atlas city map', type: 'image' }],
      docs: [{ id: 'd1', title: 'Relic engine notes', docType: 'spec', excerpt: 'Power budget for the relic engine.' }],
      memories: [{ id: 'm1', content: 'Relic engines rely on harmonic crystal cores.', category: 'worldbuilding' }],
      graphSummary: {
        summary: 'Atlas is a science-fantasy project.',
        tags: ['atlas', 'map'],
        facts: ['Goal: turn Atlas into a playable story world.'],
      },
      contextTerms: ['atlas', 'relic', 'map'],
    });

    assert.deepEqual(metadata, {
      sessionCount: 1,
      creationCount: 1,
      docCount: 1,
      memoryCount: 1,
      contextTerms: ['atlas', 'relic', 'map'],
      hasStoredSummary: true,
      factCount: 1,
      tagCount: 2,
    });
  });

  if (failed > 0) {
    console.error(`\n${failed} project retrieval test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} project retrieval test(s) passed`);
}

void main();
