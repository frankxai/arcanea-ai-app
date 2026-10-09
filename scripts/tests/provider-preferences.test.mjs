import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import {
  parseProviderKeys,
  readProviderPreferences,
  saveProviderPreferences,
  getModelKey,
} from "../../apps/web/lib/ai/provider-preferences.ts";

const readRepo = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

// Every string the parser sees: single, double and template quotes, plus
// JSX text, so copy cannot slip past the guard by changing quote style.
function stringLiterals(path) {
  const kind = path.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const file = ts.createSourceFile(
    path,
    readRepo(path),
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const texts = [];
  const visit = (node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node) ||
      ts.isJsxText(node)
    ) {
      const text = node.text.trim();
      if (text) texts.push(text);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return texts;
}

// The page plus every local module it renders copy from.
const ARENA_RENDER_FILES = [
  "apps/web/app/models/page.tsx",
  "apps/web/app/models/models-arena-components.tsx",
  "apps/web/app/models/model-explorer.tsx",
  "apps/web/app/models/model-comparator.tsx",
  "apps/web/app/models/data-provenance.tsx",
  "apps/web/lib/models-data.ts",
  "apps/web/lib/models/live-models.ts",
  "apps/web/lib/openrouter-live.ts",
];

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
  // Descriptive copy only: strings containing a space, in any quote style.
  // Award IDs (best-*) and the numeric score fields are not checked here.
  const copy = stringLiterals("apps/web/lib/models-data.ts").filter((text) =>
    /\s/.test(text),
  );
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

test("everything /models renders is free of superlative ranking claims", () => {
  const page = readRepo("apps/web/app/models/page.tsx");
  for (const [, spec] of page.matchAll(/from "((?:\.\/|@\/lib\/)[^"]+)"/g)) {
    const path = spec.startsWith("./")
      ? `apps/web/app/models/${spec.slice(2)}`
      : `apps/web/${spec.slice(2)}`;
    assert.ok(
      ARENA_RENDER_FILES.some((file) => file.replace(/\.tsx?$/, "") === path),
      `/models imports ${spec}; add it to ARENA_RENDER_FILES`,
    );
  }
  const superlatives = [
    /#1\b/,
    /\bbest\b/i,
    /\bfastest\b/i,
    /\bpeak\b(?!\s+(?:hours|traffic))/i,
    /\bsupreme\b/i,
    /\bunmatched\b/i,
    /gold standard/i,
    /\bunrivall?ed\b/i,
    /\bunparalleled\b/i,
    /\bunbeatable\b/i,
    /\bworld-class\b/i,
    /state[- ]of[- ]the[- ]art/i,
    /\bsmartest\b/i,
    /\bstrongest\b/i,
    /\bnumber one\b/i,
    /\bno\. ?1\b/i,
    /hall of fame/i,
    /editor['’]s choice/i,
    /\btitans?\b/i,
  ];
  // Only known identifiers are exempt: the curated award IDs from the
  // CuratedAward type and the showcase anchor. Any other string, hyphenated
  // or not, is treated as copy.
  const awardType = readRepo("apps/web/lib/models-data.ts").match(
    /export type CuratedAward =([^;]+);/,
  );
  assert.ok(awardType, "expected the CuratedAward type");
  const awardIds = [...awardType[1].matchAll(/"([^"]+)"/g)].map(([, id]) => id);
  const identifiers = new Set([...awardIds, "curated-best", "#curated-best"]);
  // Every award has its own neutral label, so no showcase card borrows the
  // label of another award.
  const components = readRepo(
    "apps/web/app/models/models-arena-components.tsx",
  );
  for (const id of awardIds) {
    assert.ok(components.includes(`"${id}": "`), `no neutral label for ${id}`);
  }
  assert.doesNotMatch(
    components,
    /\|\|\s*awardMeta\["editors-choice"\]/,
    "showcase must not fall back to the editors-choice label",
  );
  for (const path of ARENA_RENDER_FILES) {
    const texts = stringLiterals(path).filter((text) => !identifiers.has(text));
    assert.ok(texts.length > 0, `expected strings in ${path}`);
    for (const text of texts) {
      for (const pattern of superlatives) {
        assert.doesNotMatch(text, pattern, `${path}: ${text}`);
      }
    }
  }
  // Live OpenRouter descriptions are runtime provider copy the scan above
  // cannot see, so the explorer must not render them.
  assert.doesNotMatch(
    readRepo("apps/web/lib/models/live-models.ts"),
    /lm\.description/,
  );
});

test("arena scores without a source stay null and are not presented as benchmarks", () => {
  const read = readRepo;
  // Parse AI_MODELS so comments or stray text cannot stand in for a value.
  // No SWE-bench figure here has a reviewed primary source, and a test cannot
  // judge whether a URL is one, so every sweBench (top level and under
  // benchmarks) must be null. Adding a sourced score means changing this test
  // in a reviewed PR.
  const file = ts.createSourceFile(
    "models-data.ts",
    read("apps/web/lib/models-data.ts"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const prop = (obj, name) =>
    obj.properties.find(
      (p) => ts.isPropertyAssignment(p) && p.name.getText() === name,
    )?.initializer;
  let models = [];
  ts.forEachChild(file, function find(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText() === "AI_MODELS" &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      models = node.initializer.elements.filter(ts.isObjectLiteralExpression);
    }
    ts.forEachChild(node, find);
  });
  assert.ok(models.length > 10, "expected the arena model entries");
  for (const model of models) {
    const name = prop(model, "name")?.getText();
    const benchmarks = prop(model, "benchmarks");
    for (const obj of [model, benchmarks]) {
      if (!obj || !ts.isObjectLiteralExpression(obj)) continue;
      const score = prop(obj, "sweBench");
      assert.ok(
        !score || score.kind === ts.SyntaxKind.NullKeyword,
        `sweBench must stay null in ${name}`,
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
  // The public OpenRouter API must not lift SWE-bench figures out of
  // provider descriptions, which carry no dated primary source.
  const route = read("apps/web/app/api/models/openrouter/route.ts");
  assert.doesNotMatch(route, /SWE_BENCH_RE|parseSweScore/);
  assert.match(route, /sweBench: null,/);
});

test("cuts from the second /models review stay cut", () => {
  const files = Object.fromEntries(
    ARENA_RENDER_FILES.map((path) => [path, readRepo(path)]),
  );
  for (const [path, source] of Object.entries(files)) {
    for (const cut of [
      "tok/s",
      "\u{1F3C6}",
      "WorldCraft Index =",
      "regex scans",
      "Creative Elo",
      "Needle Recall",
      "Newer model with",
    ]) {
      assert.ok(!source.includes(cut), `${path} still contains ${cut}`);
    }
  }
  // Speed figures carry no source, so neither the row nor the sort renders.
  assert.ok(
    !files["apps/web/app/models/model-comparator.tsx"].includes(
      "Generation Speed",
    ),
  );
  assert.ok(
    !files["apps/web/app/models/model-explorer.tsx"].includes('value="speed"'),
  );
  assert.ok(
    files["apps/web/app/models/models-arena-components.tsx"].includes(
      "Sorted by editorial WorldCraft rating.",
    ),
  );
});
