"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const path = require("node:path");
const test = require("node:test");

function installedSourceMap() {
  const astro = createRequire(fs.realpathSync(path.resolve(__dirname, "../../docs/atlas/node_modules/astro/package.json")));
  const vite = createRequire(astro.resolve("vite"));
  return createRequire(vite.resolve("postcss")).resolve("source-map-js");
}
// The override permits a baseline using verified registry fixtures.
// Hosted verification leaves it unset and follows Atlas's installed graph.
const modulePath = process.env.ARCANEA_ATLAS_SOURCE_MAP_MODULE || installedSourceMap();
const { SourceMapConsumer, SourceMapGenerator, SourceNode } = require(modulePath);
const basic = () => ({ version: 3, sources: ["a.ts"], names: [], mappings: "AAAA", sourcesContent: ["let a = 1;"] });
const indexed = (line, column, map = basic()) => ({ version: 3, sections: [{ offset: { line, column }, map }] });

test("indexed maps reject invalid line and column quantities before traversal", () => {
  for (const value of [-1, 1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1, "1", null, undefined, {}]) {
    for (const field of ["line", "column"]) {
      const map = indexed(0, 0);
      map.sections[0].offset[field] = value;
      assert.throws(() => new SourceMapConsumer(map), Error, `${field}: ${String(value)}`);
    }
  }
});

test("oversized indexed offsets are rejected without serializing the gap", () => {
  assert.throws(() => new SourceMapConsumer(indexed(10_000_001, 0)), Error);
});

test("nested individually valid offsets cannot exceed the cumulative bound", () => {
  assert.throws(() => new SourceMapConsumer(indexed(6_000_000, 0, indexed(5_000_000, 0))), Error);
});

test("valid basic and indexed mappings retain the original source position", () => {
  const plain = new SourceMapConsumer(basic());
  const shifted = new SourceMapConsumer(indexed(3, 0));
  assert.deepEqual(plain.originalPositionFor({ line: 1, column: 0 }), { source: "a.ts", line: 1, column: 0, name: null });
  // Both versions return null at the indexed column-zero boundary.
  // Query within the segment; this patch does not change that inherited behavior.
  assert.deepEqual(shifted.originalPositionFor({ line: 4, column: 1 }), { source: "a.ts", line: 1, column: 0, name: null });
  assert.equal(shifted.sourceContentFor("a.ts"), "let a = 1;");
});

test("normal generation and source-node reconstruction preserve code", () => {
  const generator = new SourceMapGenerator({ file: "out.js" });
  generator.addMapping({ generated: { line: 1, column: 0 }, source: "a.ts", original: { line: 1, column: 0 } });
  generator.addMapping({ generated: { line: 3, column: 0 }, source: "a.ts", original: { line: 2, column: 0 } });
  generator.setSourceContent("a.ts", "one\ntwo\n");
  const code = "one\n\ntwo\n";
  const consumer = new SourceMapConsumer(generator.toJSON());
  assert.equal(SourceNode.fromStringWithSourceMap(code, consumer).toString(), code);
  assert.deepEqual(consumer.originalPositionFor({ line: 3, column: 0 }), { source: "a.ts", line: 2, column: 0, name: null });
});
