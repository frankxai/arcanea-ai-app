const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");

const repo = path.resolve(__dirname, "../..");
const dependencyRequire = createRequire(
  path.join(
    process.env.ARCANEA_TEST_DEPENDENCY_ROOT || repo,
    "apps/web/package.json",
  ),
);
const ts = dependencyRequire("typescript");
const React = dependencyRequire("react");
const { renderToStaticMarkup } = dependencyRequire("react-dom/server");

function source(file) {
  return fs.readFileSync(path.join(repo, file), "utf8");
}

function mainLandmarks(file) {
  const ast = ts.createSourceFile(
    file,
    source(file),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const landmarks = [];
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(ast);
      const mainRole = node.attributes.properties.some(
        (attribute) =>
          ts.isJsxAttribute(attribute) &&
          attribute.name.getText(ast) === "role" &&
          attribute.initializer &&
          ts.isStringLiteral(attribute.initializer) &&
          attribute.initializer.text === "main",
      );
      if (tag === "main" || mainRole) landmarks.push(node);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return landmarks;
}

test("the application owns one persistent content landmark", () => {
  const file = "apps/web/app/layout.tsx";
  const landmarks = mainLandmarks(file);
  assert.equal(landmarks.length, 1);
  assert.match(landmarks[0].getText(), /id="main-content"/);
});

for (const file of [
  "apps/web/app/worlds/loading.tsx",
  "apps/web/app/worlds/create/loading.tsx",
  "apps/web/app/worlds/[slug]/loading.tsx",
]) {
  test(`${file} preserves the content landmark while loading`, () => {
    const compiled = ts.transpileModule(source(file), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    const exports = {};
    vm.runInNewContext(
      compiled,
      { exports, require: dependencyRequire },
      { filename: file },
    );
    // Real React rendering of the actual fallback in the app's inherited shell;
    // this needs no browser, account, network or provider fixture.
    const markup = renderToStaticMarkup(
      React.createElement(
        "main",
        { id: "main-content" },
        React.createElement(exports.default),
      ),
    );
    const count =
      [...markup.matchAll(/<main(?:\s|>)/g)].length +
      [...markup.matchAll(/\brole="main"/g)].length;
    assert.equal(
      count,
      1,
      "Loading must not add a nested or alternate main landmark",
    );
  });
}

for (const file of [
  "apps/web/app/worlds/worlds-client.tsx",
  "apps/web/app/worlds/[slug]/page.tsx",
]) {
  test(`${file} leaves landmark ownership with the application shell`, () => {
    assert.equal(
      mainLandmarks(file).length,
      0,
      "Loaded world content must not add a second main",
    );
  });
}
