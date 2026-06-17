import { describe, it, before } from 'node:test';
import { strict as assert } from 'node:assert';

function parseContent(result) {
  assert.ok(result);
  assert.ok(Array.isArray(result.content));
  assert.equal(result.content[0].type, 'text');
  return JSON.parse(result.content[0].text);
}

describe('Production planning tools', () => {
  let tools;

  before(async () => {
    tools = await import('../dist/tools/production-planning.js');
  });

  it('listArcaneaStudios exposes broad creative studios', () => {
    const data = parseContent(tools.listArcaneaStudios());
    const ids = data.studios.map((studio) => studio.id);
    for (const id of ['world', 'book', 'game', 'music', 'cinema', 'canvas', 'agent-os']) {
      assert.ok(ids.includes(id), `Missing studio: ${id}`);
    }
  });

  it('planGame returns a playable prototype packet', () => {
    const data = parseContent(tools.planGame({ idea: 'cozy relic hunting in a living library' }));
    assert.equal(data.kind, 'game');
    assert.ok(data.deliverables.includes('prototype implementation checklist'));
    assert.ok(data.nextActions.includes('export Codex handoff'));
  });

  it('planMusicProject returns release assets', () => {
    const data = parseContent(tools.planMusicProject({ idea: 'an AI artist recording songs from other timelines' }));
    assert.equal(data.kind, 'music');
    assert.ok(data.deliverables.includes('visualizer or trailer plan'));
  });

  it('generateAssetBrief returns a reusable prompt', () => {
    const data = parseContent(tools.generateAssetBrief({ kind: 'cover', subject: 'moon academy novel' }));
    assert.equal(data.kind, 'cover');
    assert.ok(data.prompt.includes('moon academy novel'));
    assert.ok(Array.isArray(data.productionNotes));
  });

  it('getWorkflowRecipe returns canonical recipes', () => {
    const data = parseContent(tools.getWorkflowRecipe({ recipe: 'world_to_game' }));
    assert.equal(data.recipe, 'world_to_game');
    assert.ok(data.recommendedTools.includes('plan_game'));
  });
});
