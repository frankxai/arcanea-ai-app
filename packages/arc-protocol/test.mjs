/**
 * Arc Protocol — Node.js Test Runner
 *
 * Imports from dist/ and runs all tests with assert statements.
 * Run: node test.mjs
 */

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  createArc, createId, advanceStage, bond,
  toAgentContext, serialize, parse, validate,
} = require('./dist/index.js');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  \u2713 ${name}`);
  } catch (e) {
    failed++;
    const msg = `${name}: ${e.message}`;
    failures.push(msg);
    console.error(`  FAIL ${name}: ${e.message}`);
  }
}

function section(name) {
  console.log(`\n${name}`);
}

// ── createId ────────────────────────────────────────────────────────────────

section('createId');

test('generates IDs with arc_ prefix', () => {
  const id = createId();
  assert.ok(id.startsWith('arc_'), `expected arc_ prefix, got ${id}`);
});

test('generates IDs with nea_ prefix', () => {
  const id = createId('nea');
  assert.ok(id.startsWith('nea_'), `expected nea_ prefix, got ${id}`);
});

test('generates IDs of length 12 (prefix + 8)', () => {
  assert.equal(createId('arc').length, 12);
  assert.equal(createId('nea').length, 12);
});

test('generates 100 unique IDs', () => {
  const ids = new Set();
  for (let i = 0; i < 100; i++) ids.add(createId());
  assert.equal(ids.size, 100);
});

test('only lowercase alphanumeric after prefix', () => {
  for (let i = 0; i < 20; i++) {
    const suffix = createId().slice(4);
    assert.match(suffix, /^[a-z0-9]{8}$/);
  }
});

// ── createArc ───────────────────────────────────────────────────────────────

section('createArc');

test('creates valid arc with all required fields', () => {
  const arc = createArc({ type: 'character', creator: 'test-user' });
  assert.equal(arc.arc, '1.0');
  assert.ok(arc.id.startsWith('arc_'));
  assert.equal(arc.type, 'character');
  assert.equal(arc.stage, 'potential');
  assert.equal(arc.creator, 'test-user');
  assert.ok(arc.created.includes('T'));
});

test('creates unique IDs for each arc', () => {
  const a = createArc({ type: 'world', creator: 'u1' });
  const b = createArc({ type: 'world', creator: 'u1' });
  assert.notEqual(a.id, b.id);
});

test('includes APL when spark provided', () => {
  const arc = createArc({ type: 'story', creator: 'u1', spark: 'A dragon' });
  assert.ok(arc.apl);
  assert.equal(arc.apl.spark, 'A dragon');
});

test('includes APL when palette provided', () => {
  const arc = createArc({ type: 'image', creator: 'u1', palette: 'forge' });
  assert.ok(arc.apl);
  assert.equal(arc.apl.palette, 'forge');
  assert.equal(arc.apl.spark, '');
});

test('includes APL when sharpen provided', () => {
  const arc = createArc({ type: 'music', creator: 'u1', sharpen: ['generic'] });
  assert.ok(arc.apl);
  assert.deepEqual(arc.apl.sharpen, ['generic']);
});

test('no APL when no APL options', () => {
  const arc = createArc({ type: 'code', creator: 'u1' });
  assert.equal(arc.apl, undefined);
});

test('initializes history with potential entry', () => {
  const arc = createArc({ type: 'scene', creator: 'u1', spark: 'a spark' });
  assert.ok(Array.isArray(arc.history));
  assert.equal(arc.history.length, 1);
  assert.equal(arc.history[0].stage, 'potential');
  assert.equal(arc.history[0].input, 'a spark');
});

test('includes tags, gate, element when provided', () => {
  const arc = createArc({ type: 'creature', creator: 'u1', tags: ['x'], gate: 5, element: 'fire' });
  assert.deepEqual(arc.tags, ['x']);
  assert.equal(arc.gate, 5);
  assert.equal(arc.element, 'fire');
});

test('supports all 14 ArcType values', () => {
  const types = [
    'character', 'world', 'location', 'creature', 'artifact',
    'scene', 'story', 'image', 'music', 'video',
    'code', 'agent', 'system', 'collection',
  ];
  for (const t of types) {
    const arc = createArc({ type: t, creator: 'u1' });
    assert.equal(arc.type, t);
  }
});

// ── advanceStage ────────────────────────────────────────────────────────────

section('advanceStage');

test('potential -> manifestation', () => {
  const arc = createArc({ type: 'story', creator: 'u1' });
  const next = advanceStage(arc, { at: new Date().toISOString() });
  assert.equal(next.stage, 'manifestation');
});

test('full cycle: potential -> ... -> evolved -> potential', () => {
  const stages = ['manifestation', 'experience', 'dissolution', 'evolved', 'potential'];
  let arc = createArc({ type: 'world', creator: 'u1' });
  for (const expected of stages) {
    arc = advanceStage(arc, { at: new Date().toISOString() });
    assert.equal(arc.stage, expected);
  }
});

test('appends history entry with correct stage and metadata', () => {
  const arc = createArc({ type: 'story', creator: 'u1' });
  const advanced = advanceStage(arc, { at: '2026-03-17T00:00:00Z', model: 'gemini-3.1', note: 'gen' });
  const last = advanced.history[advanced.history.length - 1];
  assert.equal(last.stage, 'manifestation');
  assert.equal(last.model, 'gemini-3.1');
  assert.equal(last.note, 'gen');
});

test('sets updated timestamp', () => {
  const arc = createArc({ type: 'story', creator: 'u1' });
  const advanced = advanceStage(arc, { at: new Date().toISOString() });
  assert.ok(advanced.updated);
});

test('does not mutate original arc', () => {
  const arc = createArc({ type: 'story', creator: 'u1' });
  const origStage = arc.stage;
  const origLen = arc.history.length;
  advanceStage(arc, { at: new Date().toISOString() });
  assert.equal(arc.stage, origStage);
  assert.equal(arc.history.length, origLen);
});

// ── bond ────────────────────────────────────────────────────────────────────

section('bond');

test('adds bond to arc with no bonds', () => {
  const arc = createArc({ type: 'character', creator: 'u1' });
  const bonded = bond(arc, { target: 'arc_world1', relation: 'inhabits' });
  assert.equal(bonded.bonds.length, 1);
  assert.equal(bonded.bonds[0].target, 'arc_world1');
  assert.equal(bonded.bonds[0].relation, 'inhabits');
});

test('adds bond with note', () => {
  const arc = createArc({ type: 'story', creator: 'u1' });
  const bonded = bond(arc, { target: 'arc_m1', relation: 'soundtrack', note: 'theme' });
  assert.equal(bonded.bonds[0].note, 'theme');
});

test('prevents duplicate bonds', () => {
  let arc = createArc({ type: 'character', creator: 'u1' });
  arc = bond(arc, { target: 'arc_w1', relation: 'inhabits' });
  const result = bond(arc, { target: 'arc_w1', relation: 'inhabits' });
  assert.equal(result.bonds.length, 1);
});

test('allows same target different relation', () => {
  let arc = createArc({ type: 'character', creator: 'u1' });
  arc = bond(arc, { target: 'arc_w1', relation: 'inhabits' });
  arc = bond(arc, { target: 'arc_w1', relation: 'creates' });
  assert.equal(arc.bonds.length, 2);
});

test('returns same reference for duplicate bond', () => {
  let arc = createArc({ type: 'story', creator: 'u1' });
  arc = bond(arc, { target: 'arc_x', relation: 'forks' });
  const result = bond(arc, { target: 'arc_x', relation: 'forks' });
  assert.ok(result === arc);
});

test('does not mutate original arc', () => {
  const arc = createArc({ type: 'story', creator: 'u1' });
  bond(arc, { target: 'arc_x', relation: 'forks' });
  assert.equal(arc.bonds, undefined);
});

// ── toAgentContext ──────────────────────────────────────────────────────────

section('toAgentContext');

test('includes header with type and id', () => {
  const arc = createArc({ type: 'character', creator: 'u1' });
  const ctx = toAgentContext(arc);
  assert.ok(ctx.includes(`[ARC CONTEXT \u2014 character: ${arc.id}]`));
});

test('includes stage and creator', () => {
  const arc = createArc({ type: 'world', creator: 'frankx' });
  const ctx = toAgentContext(arc);
  assert.ok(ctx.includes('Stage: potential'));
  assert.ok(ctx.includes('Creator: frankx'));
});

test('includes SPARK, PALETTE (uppercase), SHARPEN (NOT prefix)', () => {
  const arc = createArc({
    type: 'story', creator: 'u1',
    spark: 'A lonely king', palette: 'tide', sharpen: ['generic', 'cliche'],
  });
  const ctx = toAgentContext(arc);
  assert.ok(ctx.includes('SPARK: A lonely king'));
  assert.ok(ctx.includes('PALETTE: TIDE'));
  assert.ok(ctx.includes('SHARPEN: NOT generic. NOT cliche'));
});

test('includes agent context, next_step, constraints', () => {
  const arc = createArc({ type: 'character', creator: 'u1' });
  arc.agent = {
    context: 'Complex character',
    next_step: 'Write dialogue',
    constraints: ['No exposition'],
  };
  const ctx = toAgentContext(arc);
  assert.ok(ctx.includes('CONTEXT: Complex character'));
  assert.ok(ctx.includes('NEXT: Write dialogue'));
  assert.ok(ctx.includes('- No exposition'));
});

test('includes bonds', () => {
  let arc = createArc({ type: 'character', creator: 'u1' });
  arc = bond(arc, { target: 'arc_w1', relation: 'inhabits' });
  const ctx = toAgentContext(arc);
  assert.ok(ctx.includes('BONDS: inhabits \u2192 arc_w1'));
});

test('includes last model from history', () => {
  const arc = createArc({ type: 'story', creator: 'u1' });
  const advanced = advanceStage(arc, { at: new Date().toISOString(), model: 'claude-opus-4.6' });
  const ctx = toAgentContext(advanced);
  assert.ok(ctx.includes('Last model: claude-opus-4.6'));
});

test('handles minimal arc without optional fields', () => {
  const arc = createArc({ type: 'code', creator: 'u1' });
  const ctx = toAgentContext(arc);
  assert.ok(ctx.includes('[ARC CONTEXT'));
  assert.ok(!ctx.includes('SPARK:'));
  assert.ok(!ctx.includes('BONDS:'));
});

// ── serialize ───────────────────────────────────────────────────────────────

section('serialize');

test('produces YAML frontmatter with --- delimiters', () => {
  const arc = createArc({ type: 'world', creator: 'u1' });
  const out = serialize(arc);
  assert.ok(out.startsWith('---\n'));
  assert.ok(out.includes('\n---\n'));
});

test('includes all required fields', () => {
  const arc = createArc({ type: 'character', creator: 'frankx' });
  const out = serialize(arc);
  assert.ok(out.includes('arc: "1.0"'));
  assert.ok(out.includes(`id: "${arc.id}"`));
  assert.ok(out.includes('type: "character"'));
  assert.ok(out.includes('stage: "potential"'));
  assert.ok(out.includes('creator: "frankx"'));
});

test('includes body after frontmatter', () => {
  const arc = createArc({ type: 'story', creator: 'u1' });
  arc.body = 'Story content here.';
  const out = serialize(arc);
  assert.ok(out.includes('---\n\nStory content here.'));
});

test('ends with --- when no body', () => {
  const arc = createArc({ type: 'code', creator: 'u1' });
  const out = serialize(arc);
  assert.ok(out.endsWith('---\n'));
});

test('serializes tags as YAML array', () => {
  const arc = createArc({ type: 'world', creator: 'u1', tags: ['fantasy', 'dark'] });
  const out = serialize(arc);
  assert.ok(out.includes('tags:'));
  assert.ok(out.includes('- "fantasy"'));
  assert.ok(out.includes('- "dark"'));
});

test('serializes gate as number', () => {
  const arc = createArc({ type: 'world', creator: 'u1', gate: 7 });
  const out = serialize(arc);
  assert.ok(out.includes('gate: 7'));
});

// ── parse ───────────────────────────────────────────────────────────────────

section('parse');

test('parses minimal arc file', () => {
  const input = '---\narc: "1.0"\nid: "arc_test1234"\ntype: "character"\nstage: "potential"\ncreated: "2026-03-17T00:00:00Z"\ncreator: "testuser"\n---\n';
  const arc = parse(input);
  assert.equal(arc.arc, '1.0');
  assert.equal(arc.id, 'arc_test1234');
  assert.equal(arc.type, 'character');
  assert.equal(arc.stage, 'potential');
  assert.equal(arc.creator, 'testuser');
});

test('parses body after frontmatter', () => {
  const input = '---\narc: "1.0"\nid: "arc_t"\ntype: "story"\nstage: "potential"\ncreated: "2026-03-17T00:00:00Z"\ncreator: "u1"\n---\n\nBody text here.';
  const arc = parse(input);
  assert.equal(arc.body, 'Body text here.');
});

test('parses numbers', () => {
  const input = '---\narc: "1.0"\nid: "arc_t"\ntype: "world"\nstage: "potential"\ncreated: "2026-03-17T00:00:00Z"\ncreator: "u1"\ngate: 5\n---\n';
  const arc = parse(input);
  assert.equal(arc.gate, 5);
});

test('parses string arrays', () => {
  const input = '---\narc: "1.0"\nid: "arc_t"\ntype: "world"\nstage: "potential"\ncreated: "2026-03-17T00:00:00Z"\ncreator: "u1"\ntags:\n  - "fantasy"\n  - "dark"\n---\n';
  const arc = parse(input);
  assert.deepEqual(arc.tags, ['fantasy', 'dark']);
});

test('parses nested objects (apl block)', () => {
  const input = '---\narc: "1.0"\nid: "arc_t"\ntype: "story"\nstage: "potential"\ncreated: "2026-03-17T00:00:00Z"\ncreator: "u1"\napl:\n  spark: "A dragon"\n  palette: "forge"\n  sharpen:\n    - "generic"\n---\n';
  const arc = parse(input);
  assert.ok(arc.apl);
  assert.equal(arc.apl.spark, 'A dragon');
  assert.equal(arc.apl.palette, 'forge');
  assert.deepEqual(arc.apl.sharpen, ['generic']);
});

test('throws on invalid file', () => {
  assert.throws(() => parse('no frontmatter'), /no frontmatter/);
});

// ── round-trip ──────────────────────────────────────────────────────────────

section('round-trip (serialize -> parse)');

test('round-trips minimal arc', () => {
  const original = createArc({ type: 'world', creator: 'u1' });
  const parsed = parse(serialize(original));
  assert.equal(parsed.arc, original.arc);
  assert.equal(parsed.id, original.id);
  assert.equal(parsed.type, original.type);
  assert.equal(parsed.stage, original.stage);
  assert.equal(parsed.creator, original.creator);
});

test('round-trips arc with APL', () => {
  const original = createArc({
    type: 'story', creator: 'u1',
    spark: 'A dragon', palette: 'forge', sharpen: ['generic', 'cliche'],
  });
  const parsed = parse(serialize(original));
  assert.equal(parsed.apl.spark, 'A dragon');
  assert.equal(parsed.apl.palette, 'forge');
  assert.deepEqual(parsed.apl.sharpen, ['generic', 'cliche']);
});

test('round-trips tags, gate, element', () => {
  const original = createArc({ type: 'creature', creator: 'u1', tags: ['a', 'b'], gate: 7, element: 'fire' });
  const parsed = parse(serialize(original));
  assert.deepEqual(parsed.tags, ['a', 'b']);
  assert.equal(parsed.gate, 7);
  assert.equal(parsed.element, 'fire');
});

test('round-trips body', () => {
  const original = createArc({ type: 'story', creator: 'u1' });
  original.body = 'Story content.\n\nSecond paragraph.';
  const parsed = parse(serialize(original));
  assert.equal(parsed.body, 'Story content.\n\nSecond paragraph.');
});

test('round-trips advanced arc with bonds', () => {
  let original = createArc({
    type: 'character', creator: 'frankx',
    spark: 'A warrior poet', palette: 'drift', gate: 3,
  });
  original = advanceStage(original, { at: '2026-03-17T01:00:00Z', model: 'claude-opus-4.6' });
  original = bond(original, { target: 'arc_world1', relation: 'inhabits' });
  original.body = 'Notes.';

  const parsed = parse(serialize(original));
  assert.equal(parsed.stage, 'manifestation');
  assert.equal(parsed.apl.spark, 'A warrior poet');
  assert.equal(parsed.gate, 3);
  assert.equal(parsed.body, 'Notes.');
});

// ── validate ────────────────────────────────────────────────────────────────

section('validate');

test('validates correct arc', () => {
  const arc = createArc({ type: 'world', creator: 'u1' });
  const result = validate(arc);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test('catches missing id', () => {
  const arc = createArc({ type: 'world', creator: 'u1' });
  arc.id = '';
  const result = validate(arc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('id')));
});

test('catches missing type', () => {
  const arc = createArc({ type: 'world', creator: 'u1' });
  arc.type = '';
  const result = validate(arc);
  assert.equal(result.valid, false);
});

test('catches wrong arc version', () => {
  const arc = createArc({ type: 'world', creator: 'u1' });
  arc.arc = '2.0';
  const result = validate(arc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('version')));
});

test('catches invalid stage', () => {
  const arc = createArc({ type: 'world', creator: 'u1' });
  arc.stage = 'invalid';
  const result = validate(arc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Invalid stage')));
});

test('catches gate out of range (0)', () => {
  const arc = createArc({ type: 'world', creator: 'u1', gate: 0 });
  const result = validate(arc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Gate')));
});

test('catches gate out of range (11)', () => {
  const arc = createArc({ type: 'world', creator: 'u1', gate: 11 });
  const result = validate(arc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Gate')));
});

test('accepts valid gates 1-10', () => {
  for (let g = 1; g <= 10; g++) {
    const arc = createArc({ type: 'world', creator: 'u1', gate: g });
    assert.equal(validate(arc).valid, true);
  }
});

test('warns on empty spark in APL', () => {
  const arc = createArc({ type: 'story', creator: 'u1', palette: 'forge' });
  const result = validate(arc);
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some(w => w.includes('spark')));
});

test('warns on past-potential with no history', () => {
  const arc = {
    arc: '1.0', id: 'arc_t', type: 'character',
    stage: 'manifestation', created: '2026-03-17T00:00:00Z', creator: 'u1',
  };
  const result = validate(arc);
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some(w => w.includes('history')));
});

test('reports multiple errors at once', () => {
  const arc = { arc: '2.0', id: '', type: '', stage: '', created: '', creator: '' };
  const result = validate(arc);
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 5);
});

// ── Summary ─────────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log(`  - ${f}`));
}
console.log('='.repeat(60));

process.exit(failed > 0 ? 1 : 0);
