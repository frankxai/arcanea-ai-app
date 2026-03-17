/**
 * Arc Protocol — Comprehensive Tests
 *
 * Tests for all core operations: createArc, advanceStage, bond,
 * toAgentContext, serialize, parse, validate, createId.
 */

import {
  createArc, createId, advanceStage, bond,
  toAgentContext, serialize, parse, validate,
  type Arc, type ArcStage, type ArcBond, type ValidationResult,
} from './index';

// ── Test Infrastructure ─────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(message);
    console.error(`  FAIL: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual === expected) {
    passed++;
  } else {
    failed++;
    const msg = `${message} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`;
    failures.push(msg);
    console.error(`  FAIL: ${msg}`);
  }
}

function assertDeepEqual(actual: unknown, expected: unknown, message: string): void {
  const a = JSON.stringify(actual, null, 2);
  const e = JSON.stringify(expected, null, 2);
  if (a === e) {
    passed++;
  } else {
    failed++;
    const msg = `${message}\n    expected: ${e}\n    actual:   ${a}`;
    failures.push(msg);
    console.error(`  FAIL: ${msg}`);
  }
}

function assertIncludes(haystack: string, needle: string, message: string): void {
  if (haystack.includes(needle)) {
    passed++;
  } else {
    failed++;
    const msg = `${message} — string does not contain "${needle}"`;
    failures.push(msg);
    console.error(`  FAIL: ${msg}`);
  }
}

function assertNotIncludes(haystack: string, needle: string, message: string): void {
  if (!haystack.includes(needle)) {
    passed++;
  } else {
    failed++;
    const msg = `${message} — string unexpectedly contains "${needle}"`;
    failures.push(msg);
    console.error(`  FAIL: ${msg}`);
  }
}

function describe(name: string, fn: () => void): void {
  console.log(`\n${name}`);
  fn();
}

function it(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    const msg = `${name} — threw: ${e instanceof Error ? e.message : String(e)}`;
    failures.push(msg);
    console.error(`  FAIL: ${msg}`);
  }
}

// ── createId Tests ──────────────────────────────────────────────────────────

describe('createId', () => {
  it('generates IDs with arc_ prefix by default', () => {
    const id = createId();
    assert(id.startsWith('arc_'), 'createId() should start with arc_');
  });

  it('generates IDs with arc_ prefix explicitly', () => {
    const id = createId('arc');
    assert(id.startsWith('arc_'), 'createId("arc") should start with arc_');
  });

  it('generates IDs with nea_ prefix', () => {
    const id = createId('nea');
    assert(id.startsWith('nea_'), 'createId("nea") should start with nea_');
  });

  it('generates IDs of correct length (prefix + 8 chars)', () => {
    const arcId = createId('arc');
    assertEqual(arcId.length, 12, 'arc ID length should be 12 (arc_ + 8)');

    const neaId = createId('nea');
    assertEqual(neaId.length, 12, 'nea ID length should be 12 (nea_ + 8)');
  });

  it('generates unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) ids.add(createId());
    assertEqual(ids.size, 100, '100 generated IDs should all be unique');
  });

  it('uses only lowercase alphanumeric characters after prefix', () => {
    for (let i = 0; i < 20; i++) {
      const id = createId();
      const suffix = id.slice(4);
      assert(/^[a-z0-9]+$/.test(suffix), `ID suffix "${suffix}" should be lowercase alphanumeric`);
    }
  });
});

// ── createArc Tests ─────────────────────────────────────────────────────────

describe('createArc', () => {
  it('creates a valid arc with required fields', () => {
    const arc = createArc({ type: 'character', creator: 'test-user' });
    assertEqual(arc.arc, '1.0', 'version should be 1.0');
    assert(arc.id.startsWith('arc_'), 'id should start with arc_');
    assertEqual(arc.type, 'character', 'type should be character');
    assertEqual(arc.stage, 'potential', 'initial stage should be potential');
    assertEqual(arc.creator, 'test-user', 'creator should match');
    assert(typeof arc.created === 'string', 'created should be a string');
    assert(arc.created.includes('T'), 'created should be ISO 8601');
  });

  it('creates unique IDs for each arc', () => {
    const a = createArc({ type: 'world', creator: 'u1' });
    const b = createArc({ type: 'world', creator: 'u1' });
    assert(a.id !== b.id, 'two arcs should have different IDs');
  });

  it('includes APL when spark is provided', () => {
    const arc = createArc({ type: 'story', creator: 'u1', spark: 'A dragon who paints' });
    assert(arc.apl !== undefined, 'apl should exist when spark provided');
    assertEqual(arc.apl!.spark, 'A dragon who paints', 'spark should match');
  });

  it('includes APL when palette is provided', () => {
    const arc = createArc({ type: 'image', creator: 'u1', palette: 'forge' });
    assert(arc.apl !== undefined, 'apl should exist when palette provided');
    assertEqual(arc.apl!.palette, 'forge', 'palette should be forge');
    assertEqual(arc.apl!.spark, '', 'spark should default to empty string');
  });

  it('includes APL when sharpen is provided', () => {
    const arc = createArc({ type: 'music', creator: 'u1', sharpen: ['generic', 'cliche'] });
    assert(arc.apl !== undefined, 'apl should exist when sharpen provided');
    assertDeepEqual(arc.apl!.sharpen, ['generic', 'cliche'], 'sharpen should match');
  });

  it('does not include APL when no APL options provided', () => {
    const arc = createArc({ type: 'code', creator: 'u1' });
    assertEqual(arc.apl, undefined, 'apl should be undefined when no APL options');
  });

  it('initializes history with one potential entry', () => {
    const arc = createArc({ type: 'scene', creator: 'u1', spark: 'a spark' });
    assert(Array.isArray(arc.history), 'history should be an array');
    assertEqual(arc.history!.length, 1, 'history should have one entry');
    assertEqual(arc.history![0].stage, 'potential', 'first history stage should be potential');
    assertEqual(arc.history![0].input, 'a spark', 'first history input should be the spark');
  });

  it('includes tags when provided', () => {
    const arc = createArc({ type: 'world', creator: 'u1', tags: ['fantasy', 'dark'] });
    assertDeepEqual(arc.tags, ['fantasy', 'dark'], 'tags should match');
  });

  it('includes gate when provided', () => {
    const arc = createArc({ type: 'character', creator: 'u1', gate: 5 });
    assertEqual(arc.gate, 5, 'gate should be 5');
  });

  it('includes element when provided', () => {
    const arc = createArc({ type: 'creature', creator: 'u1', element: 'fire' });
    assertEqual(arc.element, 'fire', 'element should be fire');
  });

  it('supports all ArcType values', () => {
    const types = [
      'character', 'world', 'location', 'creature', 'artifact',
      'scene', 'story', 'image', 'music', 'video',
      'code', 'agent', 'system', 'collection'
    ] as const;
    for (const t of types) {
      const arc = createArc({ type: t, creator: 'u1' });
      assertEqual(arc.type, t, `type should be ${t}`);
    }
  });
});

// ── advanceStage Tests ──────────────────────────────────────────────────────

describe('advanceStage', () => {
  it('advances from potential to manifestation', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    const advanced = advanceStage(arc, { at: new Date().toISOString(), model: 'claude-opus-4.6' });
    assertEqual(advanced.stage, 'manifestation', 'stage should be manifestation');
  });

  it('advances from manifestation to experience', () => {
    let arc = createArc({ type: 'story', creator: 'u1' });
    arc = advanceStage(arc, { at: new Date().toISOString() });
    const advanced = advanceStage(arc, { at: new Date().toISOString(), note: 'shared' });
    assertEqual(advanced.stage, 'experience', 'stage should be experience');
  });

  it('advances from experience to dissolution', () => {
    let arc = createArc({ type: 'story', creator: 'u1' });
    arc = advanceStage(arc, { at: new Date().toISOString() });
    arc = advanceStage(arc, { at: new Date().toISOString() });
    const advanced = advanceStage(arc, { at: new Date().toISOString() });
    assertEqual(advanced.stage, 'dissolution', 'stage should be dissolution');
  });

  it('advances from dissolution to evolved', () => {
    let arc = createArc({ type: 'story', creator: 'u1' });
    arc = advanceStage(arc, { at: new Date().toISOString() });
    arc = advanceStage(arc, { at: new Date().toISOString() });
    arc = advanceStage(arc, { at: new Date().toISOString() });
    const advanced = advanceStage(arc, { at: new Date().toISOString() });
    assertEqual(advanced.stage, 'evolved', 'stage should be evolved');
  });

  it('cycles from evolved back to potential', () => {
    let arc = createArc({ type: 'story', creator: 'u1' });
    arc = advanceStage(arc, { at: new Date().toISOString() }); // manifestation
    arc = advanceStage(arc, { at: new Date().toISOString() }); // experience
    arc = advanceStage(arc, { at: new Date().toISOString() }); // dissolution
    arc = advanceStage(arc, { at: new Date().toISOString() }); // evolved
    const cycled = advanceStage(arc, { at: new Date().toISOString() }); // back to potential
    assertEqual(cycled.stage, 'potential', 'stage should cycle back to potential');
  });

  it('full cycle: potential -> manifestation -> experience -> dissolution -> evolved -> potential', () => {
    const stages: ArcStage[] = ['manifestation', 'experience', 'dissolution', 'evolved', 'potential'];
    let arc = createArc({ type: 'world', creator: 'u1' });

    for (const expected of stages) {
      arc = advanceStage(arc, { at: new Date().toISOString() });
      assertEqual(arc.stage, expected, `stage should be ${expected}`);
    }
  });

  it('appends history entry with correct stage', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    const entry = { at: '2026-03-17T00:00:00Z', model: 'gemini-3.1', note: 'generated' };
    const advanced = advanceStage(arc, entry);
    const last = advanced.history![advanced.history!.length - 1];
    assertEqual(last.stage, 'manifestation', 'history entry stage should be manifestation');
    assertEqual(last.model, 'gemini-3.1', 'history entry model should match');
    assertEqual(last.note, 'generated', 'history entry note should match');
  });

  it('sets updated timestamp', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    const advanced = advanceStage(arc, { at: new Date().toISOString() });
    assert(advanced.updated !== undefined, 'updated should be set after advancing');
  });

  it('does not mutate the original arc', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    const originalStage = arc.stage;
    const originalHistoryLength = arc.history!.length;
    advanceStage(arc, { at: new Date().toISOString() });
    assertEqual(arc.stage, originalStage, 'original arc stage should not change');
    assertEqual(arc.history!.length, originalHistoryLength, 'original history length should not change');
  });
});

// ── bond Tests ──────────────────────────────────────────────────────────────

describe('bond', () => {
  it('adds a bond to an arc with no existing bonds', () => {
    const arc = createArc({ type: 'character', creator: 'u1' });
    const bonded = bond(arc, { target: 'arc_world1', relation: 'inhabits' });
    assertEqual(bonded.bonds!.length, 1, 'should have 1 bond');
    assertEqual(bonded.bonds![0].target, 'arc_world1', 'target should match');
    assertEqual(bonded.bonds![0].relation, 'inhabits', 'relation should match');
  });

  it('adds a bond with a note', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    const bonded = bond(arc, { target: 'arc_music1', relation: 'soundtrack', note: 'theme song' });
    assertEqual(bonded.bonds![0].note, 'theme song', 'note should match');
  });

  it('adds multiple bonds', () => {
    let arc = createArc({ type: 'character', creator: 'u1' });
    arc = bond(arc, { target: 'arc_world1', relation: 'inhabits' });
    arc = bond(arc, { target: 'arc_char2', relation: 'opposes' });
    assertEqual(arc.bonds!.length, 2, 'should have 2 bonds');
  });

  it('prevents duplicate bonds (same target + relation)', () => {
    let arc = createArc({ type: 'character', creator: 'u1' });
    arc = bond(arc, { target: 'arc_world1', relation: 'inhabits' });
    const result = bond(arc, { target: 'arc_world1', relation: 'inhabits' });
    assertEqual(result.bonds!.length, 1, 'duplicate bond should not be added');
  });

  it('allows same target with different relation', () => {
    let arc = createArc({ type: 'character', creator: 'u1' });
    arc = bond(arc, { target: 'arc_world1', relation: 'inhabits' });
    arc = bond(arc, { target: 'arc_world1', relation: 'creates' });
    assertEqual(arc.bonds!.length, 2, 'same target different relation should be allowed');
  });

  it('allows same relation with different target', () => {
    let arc = createArc({ type: 'story', creator: 'u1' });
    arc = bond(arc, { target: 'arc_img1', relation: 'illustrates' });
    arc = bond(arc, { target: 'arc_img2', relation: 'illustrates' });
    assertEqual(arc.bonds!.length, 2, 'same relation different target should be allowed');
  });

  it('sets updated timestamp', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    const bonded = bond(arc, { target: 'arc_x', relation: 'forks' });
    assert(bonded.updated !== undefined, 'updated should be set after bonding');
  });

  it('returns same arc reference for duplicate bond', () => {
    let arc = createArc({ type: 'story', creator: 'u1' });
    arc = bond(arc, { target: 'arc_x', relation: 'forks' });
    const result = bond(arc, { target: 'arc_x', relation: 'forks' });
    assert(result === arc, 'should return same arc reference for duplicate');
  });

  it('does not mutate the original arc', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    bond(arc, { target: 'arc_x', relation: 'forks' });
    assertEqual(arc.bonds, undefined, 'original arc bonds should remain undefined');
  });
});

// ── toAgentContext Tests ────────────────────────────────────────────────────

describe('toAgentContext', () => {
  it('includes ARC CONTEXT header with type and id', () => {
    const arc = createArc({ type: 'character', creator: 'u1' });
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, `[ARC CONTEXT — character: ${arc.id}]`, 'should have header');
  });

  it('includes stage and creator', () => {
    const arc = createArc({ type: 'world', creator: 'frankx' });
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, 'Stage: potential', 'should include stage');
    assertIncludes(ctx, 'Creator: frankx', 'should include creator');
  });

  it('includes SPARK from APL', () => {
    const arc = createArc({ type: 'story', creator: 'u1', spark: 'A lonely king' });
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, 'SPARK: A lonely king', 'should include spark');
  });

  it('includes PALETTE in uppercase', () => {
    const arc = createArc({ type: 'image', creator: 'u1', palette: 'tide' });
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, 'PALETTE: TIDE', 'should include palette in uppercase');
  });

  it('includes SHARPEN with NOT prefix', () => {
    const arc = createArc({ type: 'story', creator: 'u1', sharpen: ['generic', 'cliche'] });
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, 'SHARPEN: NOT generic. NOT cliche', 'should include sharpen with NOT');
  });

  it('includes agent context when present', () => {
    const arc = createArc({ type: 'character', creator: 'u1' });
    arc.agent = {
      context: 'This character is complex',
      next_step: 'Write dialogue',
      constraints: ['No exposition', 'Show, do not tell'],
    };
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, 'CONTEXT: This character is complex', 'should include agent context');
    assertIncludes(ctx, 'NEXT: Write dialogue', 'should include next_step');
    assertIncludes(ctx, 'CONSTRAINTS:', 'should include constraints header');
    assertIncludes(ctx, '  - No exposition', 'should include first constraint');
    assertIncludes(ctx, '  - Show, do not tell', 'should include second constraint');
  });

  it('includes bonds when present', () => {
    let arc = createArc({ type: 'character', creator: 'u1' });
    arc = bond(arc, { target: 'arc_world1', relation: 'inhabits' });
    arc = bond(arc, { target: 'arc_music1', relation: 'soundtrack' });
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, 'BONDS: inhabits → arc_world1, soundtrack → arc_music1', 'should include bonds');
  });

  it('includes last model from history', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    const advanced = advanceStage(arc, { at: new Date().toISOString(), model: 'claude-opus-4.6' });
    const ctx = toAgentContext(advanced);
    assertIncludes(ctx, 'Last model: claude-opus-4.6', 'should include last model');
  });

  it('handles minimal arc without optional fields', () => {
    const arc = createArc({ type: 'code', creator: 'u1' });
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, '[ARC CONTEXT', 'should have header');
    assertIncludes(ctx, 'Stage: potential', 'should have stage');
    assertNotIncludes(ctx, 'SPARK:', 'should not have SPARK without APL');
    assertNotIncludes(ctx, 'BONDS:', 'should not have BONDS without bonds');
  });
});

// ── serialize Tests ─────────────────────────────────────────────────────────

describe('serialize', () => {
  it('produces YAML frontmatter with --- delimiters', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    const out = serialize(arc);
    assert(out.startsWith('---\n'), 'should start with ---');
    assert(out.includes('\n---\n'), 'should have closing ---');
  });

  it('includes all required fields', () => {
    const arc = createArc({ type: 'character', creator: 'frankx' });
    const out = serialize(arc);
    assertIncludes(out, 'arc: "1.0"', 'should include arc version');
    assertIncludes(out, `id: "${arc.id}"`, 'should include id');
    assertIncludes(out, 'type: "character"', 'should include type');
    assertIncludes(out, 'stage: "potential"', 'should include stage');
    assertIncludes(out, 'creator: "frankx"', 'should include creator');
  });

  it('includes body after frontmatter', () => {
    const arc = createArc({ type: 'story', creator: 'u1' });
    arc.body = 'This is the story content.\n\nWith multiple paragraphs.';
    const out = serialize(arc);
    assertIncludes(out, '---\n\nThis is the story content.', 'body should follow frontmatter');
  });

  it('handles arc without body', () => {
    const arc = createArc({ type: 'code', creator: 'u1' });
    const out = serialize(arc);
    assert(out.endsWith('---\n'), 'should end with --- when no body');
  });

  it('serializes tags as YAML array', () => {
    const arc = createArc({ type: 'world', creator: 'u1', tags: ['fantasy', 'dark'] });
    const out = serialize(arc);
    assertIncludes(out, 'tags:', 'should include tags key');
    assertIncludes(out, '- "fantasy"', 'should include first tag');
    assertIncludes(out, '- "dark"', 'should include second tag');
  });

  it('serializes gate as number', () => {
    const arc = createArc({ type: 'world', creator: 'u1', gate: 7 });
    const out = serialize(arc);
    assertIncludes(out, 'gate: 7', 'should include gate as number');
  });

  it('serializes APL block', () => {
    const arc = createArc({
      type: 'story', creator: 'u1',
      spark: 'A dragon', palette: 'forge', sharpen: ['generic'],
    });
    const out = serialize(arc);
    assertIncludes(out, 'apl:', 'should include apl key');
    assertIncludes(out, 'spark: "A dragon"', 'should include spark');
    assertIncludes(out, 'palette: "forge"', 'should include palette');
    assertIncludes(out, 'sharpen:', 'should include sharpen key');
    assertIncludes(out, '- "generic"', 'should include sharpen item');
  });

  it('serializes history array of objects', () => {
    const arc = createArc({ type: 'story', creator: 'u1', spark: 'test' });
    const out = serialize(arc);
    assertIncludes(out, 'history:', 'should include history key');
    assertIncludes(out, 'stage: "potential"', 'should include history stage');
  });
});

// ── parse Tests ─────────────────────────────────────────────────────────────

describe('parse', () => {
  it('parses a minimal arc file', () => {
    const input = `---
arc: "1.0"
id: "arc_test1234"
type: "character"
stage: "potential"
created: "2026-03-17T00:00:00Z"
creator: "testuser"
---
`;
    const arc = parse(input);
    assertEqual(arc.arc, '1.0', 'arc version should be 1.0');
    assertEqual(arc.id, 'arc_test1234', 'id should match');
    assertEqual(arc.type, 'character', 'type should match');
    assertEqual(arc.stage, 'potential', 'stage should match');
    assertEqual(arc.creator, 'testuser', 'creator should match');
  });

  it('parses body after frontmatter', () => {
    const input = `---
arc: "1.0"
id: "arc_test1234"
type: "story"
stage: "potential"
created: "2026-03-17T00:00:00Z"
creator: "testuser"
---

This is the story body.

With multiple paragraphs.`;
    const arc = parse(input);
    assertEqual(arc.body, 'This is the story body.\n\nWith multiple paragraphs.', 'body should match');
  });

  it('parses numbers correctly', () => {
    const input = `---
arc: "1.0"
id: "arc_test1234"
type: "world"
stage: "potential"
created: "2026-03-17T00:00:00Z"
creator: "testuser"
gate: 5
---
`;
    const arc = parse(input);
    assertEqual(arc.gate, 5, 'gate should be number 5');
  });

  it('parses string arrays', () => {
    const input = `---
arc: "1.0"
id: "arc_test1234"
type: "world"
stage: "potential"
created: "2026-03-17T00:00:00Z"
creator: "testuser"
tags:
  - "fantasy"
  - "dark"
---
`;
    const arc = parse(input);
    assertDeepEqual(arc.tags, ['fantasy', 'dark'], 'tags should parse as string array');
  });

  it('parses nested objects (apl block)', () => {
    const input = `---
arc: "1.0"
id: "arc_test1234"
type: "story"
stage: "potential"
created: "2026-03-17T00:00:00Z"
creator: "testuser"
apl:
  spark: "A dragon who paints"
  palette: "forge"
  sharpen:
    - "generic"
    - "cliche"
---
`;
    const arc = parse(input);
    assert(arc.apl !== undefined, 'apl should exist');
    assertEqual(arc.apl!.spark, 'A dragon who paints', 'spark should match');
    assertEqual(arc.apl!.palette, 'forge', 'palette should match');
    assertDeepEqual(arc.apl!.sharpen, ['generic', 'cliche'], 'sharpen should match');
  });

  it('throws on invalid file without frontmatter', () => {
    let threw = false;
    try {
      parse('no frontmatter here');
    } catch (e) {
      threw = true;
      assert(e instanceof Error, 'should throw Error');
      assertIncludes((e as Error).message, 'no frontmatter', 'error should mention frontmatter');
    }
    assert(threw, 'should have thrown for invalid file');
  });

  it('parses the lonely-king example file format', () => {
    const input = `---
arc: "1.0"
id: "arc_lonely_king"
type: "character"
stage: "experience"
created: "2026-03-14T10:00:00Z"
creator: "frankx"
apl:
  spark: "A king who eats dinner alone"
  palette: "tide"
  sharpen:
    - "noble king mourning nobly"
    - "dramatic monologue about loss"
tags:
  - "character"
  - "king"
  - "grief"
gate: 2
element: "water"
---

# The Lonely King`;
    const arc = parse(input);
    assertEqual(arc.id, 'arc_lonely_king', 'id should match');
    assertEqual(arc.stage, 'experience', 'stage should match');
    assertEqual(arc.apl!.palette, 'tide', 'palette should match');
    assertDeepEqual(arc.apl!.sharpen, ['noble king mourning nobly', 'dramatic monologue about loss'], 'sharpen should match');
    assertEqual(arc.gate, 2, 'gate should be 2');
    assertEqual(arc.element, 'water', 'element should match');
    assertIncludes(arc.body!, '# The Lonely King', 'body should contain heading');
  });
});

// ── Round-trip (serialize then parse) Tests ─────────────────────────────────

describe('round-trip (serialize -> parse)', () => {
  it('round-trips a minimal arc', () => {
    const original = createArc({ type: 'world', creator: 'u1' });
    const serialized = serialize(original);
    const parsed = parse(serialized);
    assertEqual(parsed.arc, original.arc, 'arc version should round-trip');
    assertEqual(parsed.id, original.id, 'id should round-trip');
    assertEqual(parsed.type, original.type, 'type should round-trip');
    assertEqual(parsed.stage, original.stage, 'stage should round-trip');
    assertEqual(parsed.creator, original.creator, 'creator should round-trip');
  });

  it('round-trips an arc with APL', () => {
    const original = createArc({
      type: 'story', creator: 'u1',
      spark: 'A dragon who paints', palette: 'forge', sharpen: ['generic', 'cliche'],
    });
    const parsed = parse(serialize(original));
    assertEqual(parsed.apl!.spark, 'A dragon who paints', 'spark should round-trip');
    assertEqual(parsed.apl!.palette, 'forge', 'palette should round-trip');
    assertDeepEqual(parsed.apl!.sharpen, ['generic', 'cliche'], 'sharpen should round-trip');
  });

  it('round-trips tags', () => {
    const original = createArc({ type: 'world', creator: 'u1', tags: ['fantasy', 'dark', 'epic'] });
    const parsed = parse(serialize(original));
    assertDeepEqual(parsed.tags, ['fantasy', 'dark', 'epic'], 'tags should round-trip');
  });

  it('round-trips gate and element', () => {
    const original = createArc({ type: 'creature', creator: 'u1', gate: 7, element: 'fire' });
    const parsed = parse(serialize(original));
    assertEqual(parsed.gate, 7, 'gate should round-trip');
    assertEqual(parsed.element, 'fire', 'element should round-trip');
  });

  it('round-trips body content', () => {
    const original = createArc({ type: 'story', creator: 'u1' });
    original.body = 'Story content here.\n\nSecond paragraph.';
    const parsed = parse(serialize(original));
    assertEqual(parsed.body, 'Story content here.\n\nSecond paragraph.', 'body should round-trip');
  });

  it('round-trips an arc after advancement with bonds', () => {
    let original = createArc({
      type: 'character', creator: 'frankx',
      spark: 'A warrior poet', palette: 'drift',
      tags: ['warrior', 'poet'], gate: 3, element: 'wind',
    });
    original = advanceStage(original, { at: '2026-03-17T01:00:00Z', model: 'claude-opus-4.6', note: 'generated' });
    original = bond(original, { target: 'arc_world1', relation: 'inhabits', note: 'home world' });
    original.body = 'Character notes here.';

    const parsed = parse(serialize(original));
    assertEqual(parsed.stage, 'manifestation', 'advanced stage should round-trip');
    assertEqual(parsed.apl!.spark, 'A warrior poet', 'spark should round-trip');
    assertEqual(parsed.gate, 3, 'gate should round-trip');
    assertEqual(parsed.body, 'Character notes here.', 'body should round-trip');
  });
});

// ── validate Tests ──────────────────────────────────────────────────────────

describe('validate', () => {
  it('validates a correct arc as valid', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    const result = validate(arc);
    assertEqual(result.valid, true, 'should be valid');
    assertEqual(result.errors.length, 0, 'should have no errors');
  });

  it('catches missing id', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    (arc as any).id = '';
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('id')), 'should report missing id');
  });

  it('catches missing type', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    (arc as any).type = '';
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('type')), 'should report missing type');
  });

  it('catches missing stage', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    (arc as any).stage = '';
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('stage')), 'should report missing stage');
  });

  it('catches missing created', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    (arc as any).created = '';
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('created')), 'should report missing created');
  });

  it('catches missing creator', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    (arc as any).creator = '';
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('creator')), 'should report missing creator');
  });

  it('catches wrong arc version', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    (arc as any).arc = '2.0';
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('version')), 'should report unknown version');
  });

  it('catches invalid stage value', () => {
    const arc = createArc({ type: 'world', creator: 'u1' });
    (arc as any).stage = 'invalid_stage';
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('Invalid stage')), 'should report invalid stage');
  });

  it('catches gate out of range (too low)', () => {
    const arc = createArc({ type: 'world', creator: 'u1', gate: 0 });
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('Gate')), 'should report invalid gate');
  });

  it('catches gate out of range (too high)', () => {
    const arc = createArc({ type: 'world', creator: 'u1', gate: 11 });
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.some(e => e.includes('Gate')), 'should report invalid gate');
  });

  it('accepts valid gates 1-10', () => {
    for (let g = 1; g <= 10; g++) {
      const arc = createArc({ type: 'world', creator: 'u1', gate: g });
      const result = validate(arc);
      assertEqual(result.valid, true, `gate ${g} should be valid`);
    }
  });

  it('warns on empty spark in APL block', () => {
    const arc = createArc({ type: 'story', creator: 'u1', palette: 'forge' });
    // This creates APL with empty spark
    const result = validate(arc);
    assertEqual(result.valid, true, 'should still be valid (warning, not error)');
    assert(result.warnings.some(w => w.includes('spark')), 'should warn about empty spark');
  });

  it('warns on past-potential stage with no history', () => {
    const arc: Arc = {
      arc: '1.0',
      id: 'arc_test1234',
      type: 'character',
      stage: 'manifestation',
      created: '2026-03-17T00:00:00Z',
      creator: 'u1',
    };
    const result = validate(arc);
    assertEqual(result.valid, true, 'should still be valid (warning, not error)');
    assert(result.warnings.some(w => w.includes('history')), 'should warn about missing history');
  });

  it('does not warn about history for potential stage', () => {
    const arc: Arc = {
      arc: '1.0',
      id: 'arc_test1234',
      type: 'character',
      stage: 'potential',
      created: '2026-03-17T00:00:00Z',
      creator: 'u1',
    };
    const result = validate(arc);
    assertEqual(result.warnings.length, 0, 'potential stage with no history should not warn');
  });

  it('reports multiple errors at once', () => {
    const arc = {
      arc: '2.0',
      id: '',
      type: '',
      stage: '',
      created: '',
      creator: '',
    } as unknown as Arc;
    const result = validate(arc);
    assertEqual(result.valid, false, 'should be invalid');
    assert(result.errors.length >= 5, `should have at least 5 errors, got ${result.errors.length}`);
  });
});

// ── Edge Cases ──────────────────────────────────────────────────────────────

describe('edge cases', () => {
  it('handles arc with all optional fields populated', () => {
    let arc = createArc({
      type: 'character', creator: 'frankx',
      spark: 'A lonely king', palette: 'tide',
      sharpen: ['noble', 'dramatic'], tags: ['king', 'grief'],
      gate: 2, element: 'water',
    });
    arc = advanceStage(arc, { at: '2026-03-17T01:00:00Z', model: 'claude-opus-4.6', quality: 92 });
    arc = bond(arc, { target: 'arc_music1', relation: 'soundtrack', note: 'theme' });
    arc.agent = { context: 'The king is pathetic', next_step: 'Servant perspective', constraints: ['No dialogue'] };
    arc.provenance = { models_used: [{ id: 'claude-opus-4.6', role: 'narrative' }], license: 'CC-BY-4.0' };
    arc.body = '# The Lonely King\n\nHe pours the wine anyway.';

    // Should serialize without errors
    const serialized = serialize(arc);
    assert(serialized.length > 100, 'serialized should be substantial');

    // Should validate
    const result = validate(arc);
    assertEqual(result.valid, true, 'fully populated arc should be valid');

    // Should generate agent context
    const ctx = toAgentContext(arc);
    assertIncludes(ctx, 'SPARK:', 'context should include SPARK');
    assertIncludes(ctx, 'PALETTE: TIDE', 'context should include PALETTE');
    assertIncludes(ctx, 'BONDS:', 'context should include BONDS');
  });

  it('handles special characters in strings', () => {
    const arc = createArc({
      type: 'story', creator: 'u1',
      spark: 'A king who says "hello" & waves',
    });
    const serialized = serialize(arc);
    const parsed = parse(serialized);
    // The spark should survive the round-trip (quotes get escaped)
    assert(parsed.apl!.spark.includes('hello'), 'spark with quotes should survive round-trip');
  });

  it('handles empty tags array gracefully', () => {
    const arc = createArc({ type: 'world', creator: 'u1', tags: [] });
    // Empty tags should be set but toYaml skips empty arrays
    const serialized = serialize(arc);
    // The key point: it should not crash
    assert(typeof serialized === 'string', 'serialize should produce a string');
  });
});

// ── Summary ─────────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log(`  - ${f}`));
}
console.log('='.repeat(60));

if (failed > 0) process.exit(1);
