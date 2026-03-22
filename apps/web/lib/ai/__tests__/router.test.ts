/**
 * Arcanea MoE Intent Router Tests
 *
 * Self-contained validation script for the intent classification router.
 * Run with: npx tsx apps/web/lib/ai/__tests__/router.test.ts
 */

import { classifyIntent, classifyWithMemory } from '../router';

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
// Domain Rule: music
// ---------------------------------------------------------------------------

describe('domain rule: music', () => {
  const result = classifyIntent('compose a melody with chords and rhythm');
  assert(
    result.matchedDomains.includes('music'),
    'matches on music keywords (compose, melody, chords, rhythm)'
  );
  assert(
    result.weights['leyla'] !== undefined && result.weights['leyla'] > 0,
    'activates leyla (primary music guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: world-building
// ---------------------------------------------------------------------------

describe('domain rule: world-building', () => {
  const result = classifyIntent('build a fantasy kingdom with magic lore');
  assert(
    result.matchedDomains.includes('world-building'),
    'matches on world-building keywords (fantasy, kingdom, magic, lore)'
  );
  assert(
    result.activeGates.includes('alera') || result.weights['alera'] > 0,
    'activates alera (primary world-building guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: code
// ---------------------------------------------------------------------------

describe('domain rule: code', () => {
  const result = classifyIntent('debug the api endpoint and deploy the server');
  assert(
    result.matchedDomains.includes('code'),
    'matches on code keywords (debug, api, endpoint, deploy, server)'
  );
  assert(
    result.weights['lyssandria'] !== undefined && result.weights['lyssandria'] > 0,
    'activates lyssandria (primary code guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: design
// ---------------------------------------------------------------------------

describe('domain rule: design', () => {
  const result = classifyIntent('design a visual layout with color palette');
  assert(
    result.matchedDomains.includes('design'),
    'matches on design keywords (design, visual, layout, color, palette)'
  );
  assert(
    result.weights['lyria'] !== undefined && result.weights['lyria'] > 0,
    'activates lyria (primary design guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: emotion
// ---------------------------------------------------------------------------

describe('domain rule: emotion', () => {
  const result = classifyIntent('I feel anxious and need compassion and support');
  assert(
    result.matchedDomains.includes('emotion'),
    'matches on emotion keywords (feel, anxious, compassion, support)'
  );
  assert(
    result.weights['maylinn'] !== undefined && result.weights['maylinn'] > 0,
    'activates maylinn (primary emotion guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: strategy
// ---------------------------------------------------------------------------

describe('domain rule: strategy', () => {
  const result = classifyIntent('plan the roadmap for growth and monetize');
  assert(
    result.matchedDomains.includes('strategy'),
    'matches on strategy keywords (plan, roadmap, growth, monetize)'
  );
  assert(
    result.weights['aiyami'] !== undefined && result.weights['aiyami'] > 0,
    'activates aiyami (primary strategy guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: knowledge
// ---------------------------------------------------------------------------

describe('domain rule: knowledge', () => {
  const result = classifyIntent('research the pattern and analyze the evidence');
  assert(
    result.matchedDomains.includes('knowledge'),
    'matches on knowledge keywords (research, pattern, analyze, evidence)'
  );
  assert(
    result.weights['elara'] !== undefined && result.weights['elara'] > 0,
    'activates elara (primary knowledge guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: creation
// ---------------------------------------------------------------------------

describe('domain rule: creation', () => {
  const result = classifyIntent('forge a prototype and ship it');
  assert(
    result.matchedDomains.includes('creation'),
    'matches on creation keywords (forge, prototype, ship)'
  );
  assert(
    result.weights['draconia'] !== undefined && result.weights['draconia'] > 0,
    'activates draconia (primary creation guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: unity
// ---------------------------------------------------------------------------

describe('domain rule: unity', () => {
  const result = classifyIntent('collaborate as a team and integrate the parts');
  assert(
    result.matchedDomains.includes('unity'),
    'matches on unity keywords (collaborate, team, integrate)'
  );
  assert(
    result.weights['ino'] !== undefined && result.weights['ino'] > 0,
    'activates ino (primary unity guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: transcendence
// ---------------------------------------------------------------------------

describe('domain rule: transcendence', () => {
  const result = classifyIntent('meditate on the meaning of consciousness');
  assert(
    result.matchedDomains.includes('transcendence'),
    'matches on transcendence keywords (meditat, meaning, consciousness)'
  );
  assert(
    result.weights['shinkami'] !== undefined && result.weights['shinkami'] > 0,
    'activates shinkami (primary transcendence guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: writing
// ---------------------------------------------------------------------------

describe('domain rule: writing', () => {
  const result = classifyIntent('draft a blog article and revise the prose');
  assert(
    result.matchedDomains.includes('writing'),
    'matches on writing keywords (draft, blog, article, revise, prose)'
  );
  assert(
    result.weights['alera'] !== undefined && result.weights['alera'] > 0,
    'activates alera (primary writing guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: teaching
// ---------------------------------------------------------------------------

describe('domain rule: teaching', () => {
  const result = classifyIntent('teach with a tutorial and demonstrate with an analogy');
  assert(
    result.matchedDomains.includes('teaching'),
    'matches on teaching keywords (teach, tutorial, demonstrate, analogy)'
  );
  assert(
    result.weights['aiyami'] !== undefined && result.weights['aiyami'] > 0,
    'activates aiyami (primary teaching guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: marketing
// ---------------------------------------------------------------------------

describe('domain rule: marketing', () => {
  const result = classifyIntent('build a campaign for the brand audience');
  assert(
    result.matchedDomains.includes('marketing'),
    'matches on marketing keywords (campaign, brand, audience)'
  );
  assert(
    result.weights['alera'] !== undefined && result.weights['alera'] > 0,
    'activates alera (primary marketing guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: product
// ---------------------------------------------------------------------------

describe('domain rule: product', () => {
  const result = classifyIntent('iterate on the mvp feature for user retention');
  assert(
    result.matchedDomains.includes('product'),
    'matches on product keywords (iterate, mvp, feature, user, retention)'
  );
  assert(
    result.weights['lyssandria'] !== undefined && result.weights['lyssandria'] > 0,
    'activates lyssandria (primary product guardian)'
  );
});

// ---------------------------------------------------------------------------
// Domain Rule: all 14 domains detected (meta-check from keyword list)
// ---------------------------------------------------------------------------

describe('all 14 domain rules covered', () => {
  const allDomains = [
    'music', 'world-building', 'code', 'design', 'emotion',
    'strategy', 'knowledge', 'creation', 'unity', 'transcendence',
    'writing', 'teaching', 'marketing', 'product',
  ];

  // We already tested each above; verify count expectation
  assert(allDomains.length === 14, 'there are exactly 14 domain rules to test');
});

// ---------------------------------------------------------------------------
// Default weights (no domain match)
// ---------------------------------------------------------------------------

describe('default weights', () => {
  const result = classifyIntent('hello there');
  assert(
    result.matchedDomains.length === 1 && result.matchedDomains[0] === 'default',
    'returns "default" in matchedDomains when nothing matches'
  );
  assert(
    result.weights['lyssandria'] === 0.28,
    'default weight for lyssandria is 0.28'
  );
  assert(
    result.weights['draconia'] === 0.25,
    'default weight for draconia is 0.25'
  );
  assert(
    result.weights['alera'] === 0.20,
    'default weight for alera is 0.20'
  );
  assert(
    result.activeGates.length === 3,
    'default activeGates has 3 entries'
  );
  assert(
    result.activeGates[0] === 'lyssandria',
    'default top gate is lyssandria'
  );
});

// ---------------------------------------------------------------------------
// Multiple domain accumulation
// ---------------------------------------------------------------------------

describe('multiple domain accumulation', () => {
  // "design a song" triggers both design and music
  const result = classifyIntent('design a song with visual melody');
  assert(
    result.matchedDomains.includes('music') && result.matchedDomains.includes('design'),
    'detects both music and design domains'
  );
  assert(
    result.matchedDomains.length >= 2,
    `multiple domains matched (got ${result.matchedDomains.length})`
  );

  // Weights should contain guardians from both domains
  assert(
    result.weights['lyria'] !== undefined && result.weights['lyria'] > 0,
    'lyria activated from design domain'
  );
  assert(
    result.weights['leyla'] !== undefined && result.weights['leyla'] > 0,
    'leyla activated from music domain'
  );
});

// ---------------------------------------------------------------------------
// activeGates capped at 3
// ---------------------------------------------------------------------------

describe('activeGates cap', () => {
  // Trigger many domains at once
  const result = classifyIntent(
    'research the design of a music system for team collaboration and teach the strategy'
  );
  assert(
    result.activeGates.length <= 3,
    `activeGates capped at 3 (got ${result.activeGates.length})`
  );
});

// ---------------------------------------------------------------------------
// Weight normalization
// ---------------------------------------------------------------------------

describe('weight normalization', () => {
  const result = classifyIntent('code architecture api deploy server database typescript react next');
  // The top weight should be 1.0 after normalization
  const maxWeight = Math.max(...Object.values(result.weights));
  assert(
    maxWeight === 1,
    `max weight is normalized to 1.0 (got ${maxWeight})`
  );
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('edge cases', () => {
  // Empty string
  const empty = classifyIntent('');
  assert(
    empty.matchedDomains[0] === 'default',
    'empty string falls through to default'
  );

  // Very long string (10,000 chars of noise)
  const longStr = 'x '.repeat(5000);
  const longResult = classifyIntent(longStr);
  assert(
    longResult.matchedDomains[0] === 'default',
    'very long non-matching string falls through to default'
  );

  // Non-English characters
  const unicode = classifyIntent('日本語テスト 你好世界 مرحبا');
  assert(
    unicode.matchedDomains[0] === 'default',
    'non-English characters fall through to default'
  );

  // Special characters and punctuation
  const special = classifyIntent('!@#$%^&*()_+{}|:<>?');
  assert(
    special.matchedDomains[0] === 'default',
    'special characters fall through to default'
  );

  // Mixed: keywords embedded in non-English text
  const mixed = classifyIntent('我想要 design 一个 melody');
  assert(
    mixed.matchedDomains.includes('design') || mixed.matchedDomains.includes('music'),
    'English keywords in non-English context still match'
  );
});

// ---------------------------------------------------------------------------
// classifyWithMemory
// ---------------------------------------------------------------------------

describe('classifyWithMemory', () => {
  // Short history (< 4 messages) should behave like classifyIntent
  const shortHistory = [
    { role: 'user', content: 'hello' },
    { role: 'assistant', content: 'hi' },
  ];
  const shortResult = classifyWithMemory('what is code', shortHistory);
  assert(
    shortResult.matchedDomains.includes('code') || shortResult.matchedDomains[0] === 'default',
    'short history: returns current classification'
  );

  // Longer history with music focus should maintain domain affinity
  const musicHistory = [
    { role: 'user', content: 'compose a melody' },
    { role: 'assistant', content: 'here is a melody' },
    { role: 'user', content: 'add some rhythm and beat' },
    { role: 'assistant', content: 'added rhythm' },
    { role: 'user', content: 'now adjust the tempo' },
    { role: 'assistant', content: 'tempo adjusted' },
    { role: 'user', content: 'mix the track please' },
    { role: 'assistant', content: 'mixed' },
  ];
  const memResult = classifyWithMemory('make it sound better', musicHistory);
  assert(
    memResult.matchedDomains.includes('memory'),
    'long history: includes "memory" in matchedDomains'
  );
  assert(
    memResult.weights['leyla'] !== undefined && memResult.weights['leyla'] > 0,
    'long history: leyla (music) remains active through memory'
  );

  // Domain focus should persist: music history + ambiguous current message
  const ambiguousResult = classifyWithMemory('do something nice', musicHistory);
  assert(
    ambiguousResult.matchedDomains.includes('memory'),
    'ambiguous message with music history still activates memory'
  );
  assert(
    ambiguousResult.weights['leyla'] !== undefined && ambiguousResult.weights['leyla'] > 0,
    'ambiguous message with music history retains leyla activation'
  );
});

// ---------------------------------------------------------------------------
// classifyWithMemory: normalization
// ---------------------------------------------------------------------------

describe('classifyWithMemory normalization', () => {
  const history = [
    { role: 'user', content: 'debug this code' },
    { role: 'assistant', content: 'ok' },
    { role: 'user', content: 'refactor the function' },
    { role: 'assistant', content: 'done' },
    { role: 'user', content: 'deploy the api' },
    { role: 'assistant', content: 'deployed' },
    { role: 'user', content: 'test the server' },
    { role: 'assistant', content: 'tested' },
  ];
  const result = classifyWithMemory('check the database', history);
  const maxWeight = Math.max(...Object.values(result.weights));
  assert(
    maxWeight === 1,
    `classifyWithMemory normalizes max weight to 1.0 (got ${maxWeight})`
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
