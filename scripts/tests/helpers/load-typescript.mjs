import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

// Execute a real server module with explicit boundary doubles. This is not a
// substitute for authenticated browser or real database integration checks.
export function loadTypescript(path, modules = {}) {
  const exported = {};
  const realRequire = createRequire(import.meta.url);
  const jsx = (type, props, key) => ({ type, props, key });
  const source = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext(
    source,
    {
      exports: exported,
      console,
      setTimeout,
      clearTimeout,
      AbortController,
      Date,
      require(name) {
        if (name === "react/jsx-runtime")
          return { jsx, jsxs: jsx, Fragment: "fragment" };
        return name in modules ? modules[name] : realRequire(name);
      },
    },
    { filename: path },
  );
  return exported;
}

export function flatten(node) {
  if (Array.isArray(node)) return node.flatMap(flatten);
  if (node === null || node === undefined || typeof node === "boolean")
    return [];
  return typeof node === "object"
    ? [node, ...flatten(node.props?.children)]
    : [node];
}
