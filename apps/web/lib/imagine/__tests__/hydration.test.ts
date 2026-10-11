import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { JsxEmit, ModuleKind, ScriptTarget, transpileModule } from "typescript";

function page(actor: string | null, hydrated = false) {
  const token = { actor, revision: 1 };
  const scope = {
    get: () => token,
    isCurrent: (value: unknown) => value === token,
  };
  const empty = () => null;
  const passthrough = ({ children }: { children: React.ReactNode }) => children;
  const imports: Record<string, unknown> = {
    react: hydrated
      ? {
          ...React,
          // Exercise the normal client snapshot with the real React renderer.
          useSyncExternalStore: (
            subscribe: Parameters<typeof React.useSyncExternalStore>[0],
            getSnapshot: () => boolean,
          ) => React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot),
        }
      : React,
    "react/jsx-runtime": jsxRuntime,
    "@/lib/auth/context": { useAuth: () => ({ credentialScope: scope }) },
    "@/lib/imagine/request": {},
    "next/navigation": { useSearchParams: () => new URLSearchParams() },
    "framer-motion": {
      LazyMotion: passthrough,
      AnimatePresence: passthrough,
      domAnimation: {},
      m: new Proxy({}, { get: (_, tag) => tag }),
    },
    "next/link": {
      default: ({ children, ...props }: { children: React.ReactNode }) =>
        React.createElement("a", props, children),
    },
    "@/components/imagine/PromptInput": { PromptInput: empty },
    "@/components/imagine/ImageCard": { ImageCard: empty },
    "@/components/imagine/FavoritesPanel": { FavoritesPanel: empty },
    "@/lib/imagine-favorites": {},
    "@/lib/phosphor-icons": { Heart: empty, X: empty },
  };
  const source = readFileSync(
    new URL("../../../app/imagine/page.tsx", import.meta.url),
    "utf8",
  );
  const compiled = transpileModule(source, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2022,
      jsx: JsxEmit.ReactJSX,
    },
  }).outputText;
  const exports: { default?: React.ComponentType } = {};
  runInNewContext(compiled, {
    exports,
    require: (id: string) => {
      assert.ok(id in imports, `Unexpected component dependency: ${id}`);
      return imports[id];
    },
    URLSearchParams,
    AbortController,
    console: { error() {}, warn() {} },
  });
  assert.ok(exports.default);
  return renderToString(React.createElement(exports.default));
}

test("auth arriving before child hydration preserves the actual server document", () => {
  const initial = page(null);
  assert.match(initial, /Loading your workspace/);
  for (const actor of ["guest", "user:account-a", "user:account-b"])
    assert.equal(page(actor), initial);
});

test("after hydration the workspace opens only with resolved account authority", () => {
  assert.match(page(null, true), /Loading your workspace/);
  for (const actor of ["guest", "user:account-a", "user:account-b"])
    assert.match(page(actor, true), /Turn words into images/);
});
