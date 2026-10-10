import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Hephaestus, Calliope, Apollo, Mnemosyne } from '../src/pantheon/index';

test('Hephaestus outline generation and validation', async () => {
  const agent = new Hephaestus();
  const outline = await agent.generateOutline('Arcanea');
  assert.equal(outline.chapters.length, 3);
  assert.equal(outline.chapters[0].povCharacter, 'Ariona');

  const check = await agent.validateStructure(outline);
  assert.equal(check.valid, true);
  assert.equal(check.issues.length, 0);
});

test('Calliope dialogue and voice consistency', async () => {
  const agent = new Calliope();
  const dialogue = await agent.generateDialogue(['Ariona', 'Mera'], 'Exploring the ruins');
  assert.match(dialogue, /Ariona/);
  assert.match(dialogue, /Mera/);

  const check = await agent.checkVoiceConsistency(dialogue, 'Ariona');
  assert.equal(check.score > 0.5, true);
});

test('Apollo prose editing and pronoun audit', async () => {
  const agent = new Apollo();
  const rawText = 'Kael is a boy. He was walking to Luminari Academy. Mira followed him.';
  const registry = { 'Kael': 'Ariona', 'Mira': 'Mera' };

  const audit = await agent.auditNamesAndPronouns(rawText, registry);
  assert.match(audit.corrected, /Ariona/);
  assert.match(audit.corrected, /she was/);
  assert.match(audit.corrected, /Mera/);
  assert.match(audit.corrected, /The Luminary/);
});

test('Mnemosyne embedding generation similarity', async () => {
  const agent = new Mnemosyne();
  const embed1 = await agent.generateEmbedding('hello world');
  const embed2 = await agent.generateEmbedding('hello world');
  assert.equal(embed1.length, 1024);
  assert.equal(embed2.length, 1024);

  // Normalization checks
  const magnitude = Math.sqrt(embed1.reduce((sum, v) => sum + v * v, 0));
  assert.ok(Math.abs(magnitude - 1.0) < 0.0001);
});
