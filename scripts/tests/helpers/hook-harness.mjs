// Lightweight logic harness. Executes the real component with mocked hooks;
// browser integration remains a separate release gate.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

export function mountComponent(
  path,
  exportName,
  { modules = {}, globals = {}, props = {} } = {},
) {
  const slots = [];
  let cursor = 0;
  let pending = [];
  let tree;
  const same = (a, b) =>
    a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const hooks = {
    useState(initial) {
      const i = cursor++;
      if (!slots[i])
        slots[i] = {
          value: typeof initial === "function" ? initial() : initial,
        };
      return [
        slots[i].value,
        (value) => {
          slots[i].value =
            typeof value === "function" ? value(slots[i].value) : value;
        },
      ];
    },
    useRef(initial) {
      const i = cursor++;
      if (!slots[i]) slots[i] = { current: initial };
      return slots[i];
    },
    useCallback(callback, deps) {
      const i = cursor++;
      if (!slots[i] || !same(slots[i].deps, deps))
        slots[i] = { value: callback, deps };
      return slots[i].value;
    },
    useEffect(effect, deps) {
      const i = cursor++;
      if (!slots[i] || !same(slots[i].deps, deps)) {
        const previous = slots[i];
        slots[i] = { deps, cleanup: previous?.cleanup };
        pending.push(() => {
          previous?.cleanup?.();
          slots[i].cleanup = effect();
        });
      }
    },
  };
  const jsx = (type, props) => ({ type, props });
  const realRequire = createRequire(import.meta.url);
  const output = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const exported = {};
  const context = {
    exports: exported,
    console,
    setTimeout,
    clearTimeout,
    URL,
    Blob,
    Date,
    require(name) {
      if (name === "react") return hooks;
      if (name === "react/jsx-runtime")
        return { jsx, jsxs: jsx, Fragment: "fragment" };
      if (name in modules) return modules[name];
      return realRequire(name);
    },
    ...globals,
  };
  vm.runInNewContext(output, context, { filename: path });
  function render(nextProps = props) {
    props = nextProps;
    cursor = 0;
    tree = exported[exportName](props);
    const effects = pending;
    pending = [];
    effects.forEach((effect) => effect());
    return tree;
  }
  function nodes(node) {
    if (Array.isArray(node)) return node.flatMap((item) => nodes(item));
    if (node === null || node === undefined || typeof node === "boolean")
      return [];
    if (typeof node !== "object") return [node];
    return [node, ...nodes(node.props?.children)];
  }
  render();
  return {
    render,
    find(type) {
      return nodes(tree).find((node) => node?.type === type);
    },
    findButton(label) {
      return nodes(tree).find(
        (node) =>
          node?.type === "button" &&
          nodes(node.props.children).join("") === label,
      );
    },
    text() {
      return nodes(tree)
        .filter((node) => typeof node === "string" || typeof node === "number")
        .join(" ");
    },
    unmount() {
      slots.forEach((slot) => slot?.cleanup?.());
    },
  };
}
