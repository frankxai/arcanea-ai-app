import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Build the test module
// Run: esbuild src/intelligence.ts --outfile=tests/_intelligence.mjs --format=esm --platform=node

import { classifyIntent, createArcanea, buildGuardianPrompt } from './_intelligence.mjs';

describe('classifyIntent', () => {
  it('routes code tasks to lyssandria (Foundation)', () => {
    const result = classifyIntent('fix the database query and deploy the API');
    assert.ok(result.activeGates.includes('lyssandria'), `Expected lyssandria in ${result.activeGates}`);
    assert.ok(result.matchedDomains.includes('code'));
  });

  it('routes design tasks to lyria (Sight)', () => {
    const result = classifyIntent('design a beautiful color palette for the UI');
    assert.ok(result.activeGates.includes('lyria'), `Expected lyria in ${result.activeGates}`);
    assert.ok(result.matchedDomains.includes('design'));
  });

  it('routes music tasks to leyla (Flow)', () => {
    const result = classifyIntent('compose a melody with a slow tempo and rich chords');
    assert.ok(result.activeGates.includes('leyla'), `Expected leyla in ${result.activeGates}`);
    assert.ok(result.matchedDomains.includes('music'));
  });

  it('routes world-building to alera (Voice)', () => {
    const result = classifyIntent('create a kingdom with deep lore and a complex magic system');
    assert.ok(result.activeGates.includes('alera'), `Expected alera in ${result.activeGates}`);
    assert.ok(result.matchedDomains.includes('world-building'));
  });

  it('routes strategy to aiyami (Crown)', () => {
    const result = classifyIntent('plan our growth strategy and roadmap for next quarter');
    assert.ok(result.activeGates.includes('aiyami'), `Expected aiyami in ${result.activeGates}`);
    assert.ok(result.matchedDomains.includes('strategy'));
  });

  it('routes emotion to maylinn (Heart)', () => {
    const result = classifyIntent('I feel anxious about this relationship and need support');
    assert.ok(result.activeGates.includes('maylinn'), `Expected maylinn in ${result.activeGates}`);
    assert.ok(result.matchedDomains.includes('emotion'));
  });

  it('routes transcendence to shinkami (Source)', () => {
    const result = classifyIntent('what is the meaning of consciousness and divine truth');
    assert.ok(result.activeGates.includes('shinkami'), `Expected shinkami in ${result.activeGates}`);
    assert.ok(result.matchedDomains.includes('transcendence'));
  });

  it('returns default weights for unrecognized input', () => {
    const result = classifyIntent('xyzzy plugh');
    assert.deepEqual(result.matchedDomains, ['default']);
    assert.ok(result.activeGates.length >= 2);
  });

  it('returns max 3 active gates', () => {
    const result = classifyIntent('build a design system with code and deploy the strategy');
    assert.ok(result.activeGates.length <= 3, `Got ${result.activeGates.length} gates`);
  });

  it('accumulates weights from multiple domains', () => {
    const result = classifyIntent('code a music production tool with beautiful design');
    assert.ok(result.matchedDomains.length >= 2, `Expected 2+ domains, got ${result.matchedDomains}`);
  });

  it('uses conversation history for context', () => {
    const history = [
      { role: 'user', content: 'I want to build a game world' },
      { role: 'assistant', content: 'Great idea!' },
    ];
    const result = classifyIntent('tell me more about the magic system', history);
    assert.ok(result.matchedDomains.includes('world-building'), `Expected world-building from history context`);
  });

  it('normalizes weights to 0-1 range', () => {
    const result = classifyIntent('build an API with database architecture and deploy');
    for (const [, weight] of Object.entries(result.weights)) {
      assert.ok(weight >= 0 && weight <= 1, `Weight ${weight} out of 0-1 range`);
    }
  });
});

describe('createArcanea', () => {
  it('returns systemPrompt and router', () => {
    const result = createArcanea('help me code');
    assert.ok(typeof result.systemPrompt === 'string');
    assert.ok(result.systemPrompt.length > 100);
    assert.ok(result.router.activeGates.length > 0);
  });

  it('includes Theorem in system prompt', () => {
    const result = createArcanea('hello');
    assert.ok(result.systemPrompt.includes('[THEOREM]'));
    assert.ok(result.systemPrompt.includes('Imperfection'));
  });

  it('includes Agent Oath in system prompt', () => {
    const result = createArcanea('hello');
    assert.ok(result.systemPrompt.includes('[AGENT OATH]'));
    assert.ok(result.systemPrompt.includes('scattered light'));
  });

  it('includes active expertise section', () => {
    const result = createArcanea('design a color palette');
    assert.ok(result.systemPrompt.includes('[ACTIVE EXPERTISE]'));
  });

  it('includes file context when provided', () => {
    const result = createArcanea('explain this code', undefined, 'File: test.ts\nconst x = 1;');
    assert.ok(result.systemPrompt.includes('[ACTIVE FILE CONTEXT]'));
    assert.ok(result.systemPrompt.includes('test.ts'));
  });

  it('includes follow-up rules', () => {
    const result = createArcanea('hello');
    assert.ok(result.systemPrompt.includes('[FOLLOW_UP]'));
  });

  it('includes Arcanea identity', () => {
    const result = createArcanea('hello');
    assert.ok(result.systemPrompt.includes('You are Arcanea'));
  });
});

describe('buildGuardianPrompt', () => {
  it('builds prompt for valid guardian', () => {
    const prompt = buildGuardianPrompt('lyssandria');
    assert.ok(prompt.includes('Foundation'));
    assert.ok(prompt.includes('Earth'));
    assert.ok(prompt.includes('[THEOREM]'));
  });

  it('includes file context when provided', () => {
    const prompt = buildGuardianPrompt('draconia', 'File: app.ts\nconst fire = true;');
    assert.ok(prompt.includes('[ACTIVE FILE CONTEXT]'));
    assert.ok(prompt.includes('app.ts'));
  });

  it('falls back to identity for unknown guardian', () => {
    const prompt = buildGuardianPrompt('unknown_guardian');
    assert.ok(prompt.includes('Arcanea'));
  });

  it('includes rules', () => {
    const prompt = buildGuardianPrompt('shinkami');
    assert.ok(prompt.includes('Density over length'));
  });
});
