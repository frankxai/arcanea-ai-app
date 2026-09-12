import { strict as assert } from 'node:assert';
import {
  AI_MODELS,
  ARCANEAN_WORKFLOWS,
  IMAGE_MODELS,
  getModelById,
  getFreeModels,
  getCuratedBestModels,
  getModelsByGate,
  getModelsSortedByWorldCraft,
  getWorkflowsForModel,
} from '../../models-data';
import { DEFAULT_FAVORITES } from '@/hooks/use-model-favorites';

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

async function run() {
  console.log('--- Running Worldbuilding Models Data Contract Tests ---');

  await test('AI_MODELS contains populated models with complete creative attributes', () => {
    assert.ok(AI_MODELS.length >= 15, 'expected at least 15 tracked models');

    for (const m of AI_MODELS) {
      assert.ok(m.id, `model should have id: ${JSON.stringify(m)}`);
      assert.ok(m.name, `model ${m.id} should have name`);
      assert.ok(m.provider, `model ${m.id} should have provider`);
      assert.ok(m.contextWindow > 0, `model ${m.id} should have context window`);
      assert.ok(typeof m.speed === 'number', `model ${m.id} should have speed`);
      assert.ok(
        m.worldCraftScore >= 50 && m.worldCraftScore <= 100,
        `model ${m.id} should have valid worldCraftScore (50-100), got ${m.worldCraftScore}`,
      );
      assert.ok(
        m.proseQuality >= 50 && m.proseQuality <= 100,
        `model ${m.id} should have valid proseQuality (50-100), got ${m.proseQuality}`,
      );
      assert.ok(
        m.loreMemory >= 50 && m.loreMemory <= 100,
        `model ${m.id} should have valid loreMemory (50-100), got ${m.loreMemory}`,
      );
      assert.ok(
        m.magicLogic >= 50 && m.magicLogic <= 100,
        `model ${m.id} should have valid magicLogic (50-100), got ${m.magicLogic}`,
      );
      assert.ok(
        m.characterVoice >= 50 && m.characterVoice <= 100,
        `model ${m.id} should have valid characterVoice (50-100), got ${m.characterVoice}`,
      );
      assert.ok(m.gateResonance, `model ${m.id} should have gateResonance`);
      assert.ok(m.gateFrequency, `model ${m.id} should have gateFrequency`);
      assert.ok(m.guardian, `model ${m.id} should have guardian`);
      assert.ok(m.curatedRole, `model ${m.id} should have curatedRole`);
      assert.ok(
        ['S', 'A', 'B', 'C'].includes(m.slopResistance),
        `model ${m.id} should have valid slopResistance ('S'|'A'|'B'|'C'), got ${m.slopResistance}`,
      );
      assert.ok(
        m.worldbuildingSweetSpot.length > 20,
        `model ${m.id} should have descriptive worldbuildingSweetSpot`,
      );
    }
  });

  await test('Curated award winners meet the high fantasy criteria', () => {
    const curated = getCuratedBestModels();
    assert.ok(curated.length >= 5, 'expected at least 5 curated award models');

    const editorsChoice = curated.find((m) => m.curatedAward === 'editors-choice');
    assert.ok(editorsChoice, 'expected an editors-choice award winner');
    assert.equal(editorsChoice.id, 'claude-sonnet-4');
    assert.ok(editorsChoice.worldCraftScore >= 95);
    assert.ok(editorsChoice.proseQuality >= 95);
    assert.equal(editorsChoice.slopResistance, 'S');

    const bestLore = curated.find((m) => m.curatedAward === 'best-lore');
    assert.ok(bestLore, 'expected best-lore award winner');
    assert.equal(bestLore.id, 'gemini-2.0-pro');
    assert.ok(bestLore.contextWindow >= 1_000_000);
    assert.ok(bestLore.loreMemory >= 95);

    const bestMagic = curated.find((m) => m.curatedAward === 'best-magic');
    assert.ok(bestMagic, 'expected best-magic award winner');
    assert.equal(bestMagic.id, 'deepseek-r1');
    assert.ok(bestMagic.magicLogic >= 95);

    const bestFree = curated.find((m) => m.curatedAward === 'best-free');
    assert.ok(bestFree, 'expected best-free award winner');
    assert.equal(bestFree.id, 'qwen-3.6-plus-free');
    assert.equal(bestFree.pricing.input, 'free');
    assert.ok(bestFree.contextWindow >= 1_000_000);

    const bestDialogue = curated.find((m) => m.curatedAward === 'best-dialogue');
    assert.ok(bestDialogue, 'expected best-dialogue award winner');
    assert.equal(bestDialogue.id, 'mistral-large-2');
    assert.ok(bestDialogue.characterVoice >= 95);
  });

  await test('Default favorites exist in the AI_MODELS catalog', () => {
    assert.ok(DEFAULT_FAVORITES.length >= 4, 'expected at least 4 default favorites');
    for (const favId of DEFAULT_FAVORITES) {
      const model = getModelById(favId);
      assert.ok(model, `default favorite ${favId} must exist in AI_MODELS`);
    }
  });

  await test('Arcanean Worldbuilding Workflows map to all Ten Gates', () => {
    assert.equal(ARCANEAN_WORKFLOWS.length, 10, 'expected 10 workflows for the 10 Gates');

    const gates = new Set(ARCANEAN_WORKFLOWS.map((w) => w.gate));
    const requiredGates = [
      'Foundation',
      'Flow',
      'Fire',
      'Heart',
      'Voice',
      'Sight',
      'Crown',
      'Starweave',
      'Unity',
      'Source',
    ];

    for (const gate of requiredGates) {
      assert.ok(gates.has(gate), `missing workflow for Gate: ${gate}`);
    }

    for (const wf of ARCANEAN_WORKFLOWS) {
      const primary = getModelById(wf.model);
      assert.ok(primary, `primary model ${wf.model} for workflow ${wf.name} must exist`);
      assert.ok(wf.fallbackModels.length >= 2, `workflow ${wf.name} must have fallback models`);
      for (const fb of wf.fallbackModels) {
        assert.ok(getModelById(fb), `fallback model ${fb} for workflow ${wf.name} must exist`);
      }
    }
  });

  await test('Helper functions sort and filter models accurately', () => {
    const sorted = getModelsSortedByWorldCraft();
    for (let i = 0; i < sorted.length - 1; i++) {
      assert.ok(
        sorted[i].worldCraftScore >= sorted[i + 1].worldCraftScore,
        'models should be sorted descending by worldCraftScore',
      );
    }

    const freeModels = getFreeModels();
    assert.ok(freeModels.length >= 5, 'expected multiple free models');
    for (const m of freeModels) {
      assert.equal(m.pricing.input, 'free');
      assert.equal(m.pricing.output, 'free');
    }

    const voiceModels = getModelsByGate('Voice');
    assert.ok(voiceModels.length >= 1, 'expected at least 1 Voice gate model');
    assert.ok(voiceModels.every((m) => m.gateResonance === 'Voice'));

    assert.ok(IMAGE_MODELS.length >= 5, 'expected visual worldbuilding image models');
    const workflowsForSonnet = getWorkflowsForModel('claude-sonnet-4');
    assert.ok(workflowsForSonnet.length >= 1, 'expected workflows referencing claude-sonnet-4');
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

run();
