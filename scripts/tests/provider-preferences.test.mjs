import test from "node:test";
import assert from "node:assert/strict";
import {
  parseProviderKeys,
  readProviderPreferences,
  saveProviderPreferences,
  getModelKey,
} from "../../apps/web/lib/ai/provider-preferences.ts";

function storage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem: (k) => values.get(k) ?? null,
    setItem: (k, v) => values.set(k, v),
    removeItem: (k) => values.delete(k),
  };
}
test("corrupt or non-object storage cannot become credentials", () => {
  for (const raw of ["bad", "null", "[]", "42"])
    assert.deepEqual(parseProviderKeys(raw), {});
  assert.deepEqual(
    parseProviderKeys('{"openai":" key ","google":42,"constructor":"bad"}'),
    { openai: "key" },
  );
});
test("a selected model receives only its own provider key", () => {
  assert.equal(getModelKey({ openai: "only-openai" }, "google"), undefined);
  assert.equal(getModelKey({ openai: "only-openai" }, "openai"), "only-openai");
});
test("saving provider preferences clears an overriding model selection", () => {
  const s = storage({ "arcanea-active-model": "old-model" });
  saveProviderPreferences(s, { openai: "test-only" }, "openai");
  assert.equal(s.getItem("arcanea-active-model"), null);
  assert.deepEqual(readProviderPreferences(s), {
    keys: { openai: "test-only" },
    activeId: "openai",
  });
});
test("blocked storage reports failure and does not pretend to save", () => {
  const s = storage({
    "arcanea-provider-keys": '{"google":"original"}',
    "arcanea-active-provider": "google",
  });
  const write = s.setItem;
  let calls = 0;
  s.setItem = (k, v) => {
    if (++calls === 2) throw new Error("Quota exceeded");
    return write(k, v);
  };
  assert.throws(() => saveProviderPreferences(s, { openai: "new" }, "openai"));
  assert.deepEqual(readProviderPreferences(s), {
    keys: { google: "original" },
    activeId: "google",
  });
});
test("a stale form cannot restore a key removed in another tab", () => {
  const s = storage({
    "arcanea-provider-keys": '{"openai":"removed-key"}',
    "arcanea-active-provider": "openai",
  });
  const expectedState = JSON.stringify(readProviderPreferences(s));
  s.setItem("arcanea-provider-keys", "{}");
  assert.throws(
    () =>
      saveProviderPreferences(
        s,
        { openai: "removed-key" },
        "openai",
        expectedState,
      ),
    /another tab/,
  );
  assert.deepEqual(readProviderPreferences(s).keys, {});
});
