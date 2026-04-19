#!/usr/bin/env node
// Persona config invariant tests.
// Run: node test/persona.test.mjs

import assert from 'node:assert/strict';
import { PERSONAS, DEFAULT_PERSONA, resolvePersona, personaList } from '../src/persona.mjs';

const GREEN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m', RESET = '\x1b[0m';
const suite = [];
const test = (name, fn) => suite.push({ name, fn });

const EXPECTED = ['jarvis','lumina','draconia','lyria','alera','shinkami','nero'];

test('PERSONAS has all seven entries', () => {
  assert.deepEqual(Object.keys(PERSONAS).sort(), EXPECTED.slice().sort());
});

test('every persona has the required shape', () => {
  for (const id of EXPECTED) {
    const p = PERSONAS[id];
    assert.equal(typeof p.name, 'string');
    assert.ok(p.name.length > 0, `${id}.name empty`);
    assert.equal(typeof p.tagline, 'string');
    assert.ok(/^#[0-9a-fA-F]{3,8}$/.test(p.color), `${id}.color not hex`);
    assert.ok(/^#[0-9a-fA-F]{3,8}$/.test(p.accent), `${id}.accent not hex`);
    assert.equal(typeof p.voice, 'string');
    assert.ok(typeof p.temperature === 'number' && p.temperature > 0 && p.temperature < 2,
      `${id}.temperature out of range`);
    assert.equal(typeof p.prompt, 'string');
    assert.ok(p.prompt.length > 40, `${id}.prompt too short`);
    assert.ok(p.prompt.length < 2000, `${id}.prompt too long — voice latency`);
  }
});

test('prompts include tool hint (persona knows it can chain tools)', () => {
  for (const id of EXPECTED) {
    const p = PERSONAS[id];
    assert.ok(
      /tools|claude_prompt|claude_code_launch|shell_run/i.test(p.prompt),
      `${id} prompt missing tool hint`,
    );
  }
});

test('DEFAULT_PERSONA points to a real persona', () => {
  assert.ok(PERSONAS[DEFAULT_PERSONA], `DEFAULT_PERSONA "${DEFAULT_PERSONA}" not in PERSONAS`);
});

test('resolvePersona returns DEFAULT on unknown', () => {
  const p = resolvePersona('totally-not-real-persona');
  assert.equal(p, PERSONAS[DEFAULT_PERSONA]);
});

test('resolvePersona is case-insensitive', () => {
  assert.equal(resolvePersona('JARVIS'), PERSONAS.jarvis);
  assert.equal(resolvePersona('Lumina'), PERSONAS.lumina);
  assert.equal(resolvePersona('dRaCoNiA'), PERSONAS.draconia);
});

test('resolvePersona with null/undefined returns default', () => {
  assert.equal(resolvePersona(null), PERSONAS[DEFAULT_PERSONA]);
  assert.equal(resolvePersona(undefined), PERSONAS[DEFAULT_PERSONA]);
  assert.equal(resolvePersona(''), PERSONAS[DEFAULT_PERSONA]);
});

test('personaList exposes all seven ids', () => {
  assert.deepEqual(personaList().sort(), EXPECTED.slice().sort());
});

test('no two personas share a color (distinct visual identity)', () => {
  const colors = EXPECTED.map(id => PERSONAS[id].color);
  const unique = new Set(colors);
  assert.equal(unique.size, colors.length, 'personas share colors');
});

// ---------------------------------------------------------------------------

let passed = 0, failed = 0;
for (const { name, fn } of suite) {
  try {
    fn();
    passed++;
    console.log(`  ${GREEN}ok${RESET} ${DIM}${name}${RESET}`);
  } catch (e) {
    failed++;
    console.log(`  ${RED}FAIL${RESET} ${name}`);
    console.log(`       ${RED}${e.message}${RESET}`);
  }
}
console.log(`\n  ${passed + failed} tests, ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
