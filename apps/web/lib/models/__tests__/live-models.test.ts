import { strict as assert } from "node:assert";
import { test } from "node:test";
import { AI_MODELS } from "../../models-data";
import {
  byRatingDesc,
  mergeExplorerModels,
  type LiveModelSummary,
} from "../live-models";

const unseenLongContext: LiveModelSummary = {
  id: "unknown-lab/unseen-500k",
  name: "Unseen 500K",
  provider: "Unknown Lab",
  context_length: 500_000,
  pricing_prompt_per_mtok: 1,
  pricing_completion_per_mtok: 2,
  is_free: false,
  max_completion: 8_000,
  modality: "text",
  description: "",
};

test("an unreviewed live model gets no rating of any kind", () => {
  const merged = mergeExplorerModels(AI_MODELS, [unseenLongContext]);
  const live = merged.find((m) => m.id === unseenLongContext.id);
  assert.ok(live, "live model should be listed");
  assert.equal(live.worldCraftScore, null);
  assert.equal(live.proseQuality, null);
  assert.equal(live.loreMemory, null);
  assert.equal(live.magicLogic, null);
  assert.equal(live.characterVoice, null);
  assert.equal(live.slopResistance, null);
  assert.equal(live.gateResonance, null);
  assert.equal(live.speed, null);
});

test("curated models keep exactly their hand-assigned ratings", () => {
  const merged = mergeExplorerModels(AI_MODELS, []);
  assert.equal(merged.length, AI_MODELS.length);
  for (const curated of AI_MODELS) {
    const shown = merged.find((m) => m.id === curated.id);
    assert.equal(shown?.worldCraftScore, curated.worldCraftScore);
  }
});

test("a live entry that duplicates a curated model is not added twice", () => {
  const curated = AI_MODELS[0];
  const duplicate = {
    ...unseenLongContext,
    id: `vendor/${curated.id}`,
    name: curated.name,
  };
  const merged = mergeExplorerModels(AI_MODELS, [duplicate]);
  assert.equal(merged.length, AI_MODELS.length);
});

test("unrated models sort after every rated model", () => {
  const sorted = [null, 70, null, 95].sort(byRatingDesc);
  assert.deepEqual(sorted, [95, 70, null, null]);
});
