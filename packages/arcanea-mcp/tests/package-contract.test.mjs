import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyPackage } from "../scripts/verify-package.mjs";

test("built package has consumer-resolvable dependencies and entrypoints", () => {
  const report = verifyPackage(fileURLToPath(new URL("..", import.meta.url)));
  assert.equal(report.name, "@arcanea/mcp-server");
  assert.ok(report.entrypoints >= 7);
});

test("release gate rejects the published workspace dependency regression and missing or escaping files", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "arcanea package gate "));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(join(directory, "dist"));
  writeFileSync(join(directory, "dist", "index.js"), "");
  const base = {
    name: "@arcanea/mcp-server",
    version: "1.0.0",
    main: "dist/index.js",
    types: "dist/index.js",
    files: ["dist/"],
    exports: { ".": "./dist/index.js" },
  };
  const set = (value) =>
    writeFileSync(join(directory, "package.json"), JSON.stringify(value));
  set(base);
  assert.equal(verifyPackage(directory).version, "1.0.0");
  for (const spec of ["workspace:*", "file:../os", "link:../os", "../os"]) {
    set({ ...base, dependencies: { "@arcanea/os": spec } });
    assert.throws(() => verifyPackage(directory), /Consumer cannot resolve/);
  }
  set({ ...base, bin: { "arcanea-mcp": "./dist/missing.js" } });
  assert.throws(() => verifyPackage(directory));
  set({ ...base, exports: { "./escape": "./dist/../../outside.js" } });
  assert.throws(() => verifyPackage(directory));
  set({ ...base, files: ["dist/", ".env"] });
  assert.throws(() => verifyPackage(directory), /allowlist/);
});
