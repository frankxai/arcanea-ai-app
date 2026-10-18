const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const vm = require("node:vm");
const ts = createRequire(resolve("apps/web/package.json"))("typescript");
const sourceExports = {};
vm.runInNewContext(
  ts.transpileModule(
    fs.readFileSync("apps/web/lib/worlds/elements.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText,
  { exports: sourceExports },
);
const { readWorldElements, worldDisplayPalette } = sourceExports;
test("generated object elements produce actual names and their saved colors", () => {
  const items = readWorldElements([
    { name: "Salt", domain: "Memory", color: "#e8dcc0" },
    { name: "Tide", domain: "Debt", color: "#146878" },
  ]);
  assert.equal(items[0].name, "Salt");
  assert.equal(items[1].name, "Tide");
  assert.equal(worldDisplayPalette(items, {}).primary, "#e8dcc0");
  assert.equal(worldDisplayPalette(items, {}).secondary, "#146878");
});
test("legacy names remain usable and duplicate React keys are removed", () => {
  const items = readWorldElements([
    "Fire",
    { name: "Fire", color: "#ffffff" },
    "Water",
  ]);
  assert.equal(items.length, 2);
  assert.equal(items[0].name.charAt(0), "F");
  assert.match(worldDisplayPalette(items, {}).primary, /arc-fire/);
});
test("malformed names and CSS values never reach badges or style strings", () => {
  const items = readWorldElements([
    null,
    {},
    2,
    { name: 42 },
    { name: "", color: "#ffffff" },
    { name: "Salt", color: "url(https://private.invalid)" },
  ]);
  assert.equal(items.length, 1);
  assert.equal(items[0].name, "Salt");
  const palette = worldDisplayPalette(items, {
    primary: "red);url(https://private.invalid)",
    secondary: "#ffffff",
    accent: "#000000",
  });
  assert.doesNotMatch(palette.gradient, /private.invalid|url\(/);
});
test("a complete validated stored palette retains the creator's chosen colors", () => {
  const palette = worldDisplayPalette([], {
    primary: "#123456",
    secondary: "#abcdef",
    accent: "#987654",
  });
  assert.equal(palette.primary, "#123456");
  assert.equal(palette.secondary, "#abcdef");
  assert.match(palette.gradient, /#987654/);
});
