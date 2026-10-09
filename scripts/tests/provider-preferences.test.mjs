import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

test("arena model copy carries no rankings or unsourced benchmark figures", () => {
  const source = readFileSync(
    new URL("../../apps/web/lib/models-data.ts", import.meta.url),
    "utf8",
  );
  // Descriptive copy only: double-quoted strings containing a space. Award
  // IDs (best-*) and the numeric score fields are not checked here.
  const copy = [...source.matchAll(/"((?:[^"\\\n]|\\.)*)"/g)]
    .map((match) => match[1])
    .filter((text) => /\s/.test(text));
  assert.ok(copy.length > 100, "expected the arena copy strings");
  const claims = [
    /#1\b/,
    /\bbest\b/i,
    /best-in-class/i,
    /\bfastest\b/i,
    /\bsmartest\b/i,
    /most (powerful|capable)/i,
    /\bflagship\b/i,
    /\bunmatched\b/i,
    /\bunrivall?ed\b/i,
    /\bflawless/i,
    /\bperfect\b/i,
    /gold standard/i,
    /\bsupreme\b/i,
    /\bultimate\b/i,
    /in the world/i,
    /on earth/i,
    /SWE-?bench/i,
    /\bElo\b/,
    /tok\/s/,
    /\d+(\.\d+)?%/,
  ];
  for (const text of copy) {
    for (const pattern of claims) {
      assert.doesNotMatch(text, pattern, `models-data.ts copy: ${text}`);
    }
  }
});

test("arena scores without a source stay null and are not presented as benchmarks", () => {
  const read = (path) =>
    readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
  const data = read("apps/web/lib/models-data.ts");
  const models = data
    .split("export const IMAGE_MODELS")[0]
    .split(/\n {2}\{\n/)
    .slice(1);
  assert.ok(models.length > 10, "expected the arena model entries");
  for (const model of models) {
    if (/sweBench: (?!null)/.test(model)) {
      assert.match(
        model,
        /sweBenchSource: "https:\/\//,
        `sweBench without a source in: ${model.slice(0, 80)}`,
      );
    }
  }
  const provenance = read("apps/web/app/models/data-provenance.tsx");
  assert.ok(
    !provenance.includes("Public leaderboards are cited where they exist"),
  );
  assert.ok(!provenance.includes("IFEval & RULER"));
  assert.ok(
    !read("apps/web/app/models/models-arena-components.tsx").includes(
      "Creative Writing Elo",
    ),
  );
});
