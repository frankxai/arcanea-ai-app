import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  artifacts,
  build,
  validateCatalog,
  compatibilityManifest,
  pluginRoot,
} from "./build.mjs";
import { escapeHtml, renderTemplate, createBrief } from "../src/render.mjs";

const catalog = JSON.parse(
  await readFile(path.join(pluginRoot, "catalog.json"), "utf8"),
);
async function withOutput(fn) {
  const base = await mkdtemp(path.join(tmpdir(), "arcanea-starter-test-"));
  try {
    await fn(path.join(base, "output"));
  } finally {
    const resolved = path.resolve(base),
      parent = path.resolve(tmpdir());
    assert.equal(path.dirname(resolved), parent);
    assert.ok(path.basename(resolved).startsWith("arcanea-starter-test-"));
    await rm(resolved, { recursive: true, force: true });
  }
}
test("catalog provides two real examples per requested audience", () => {
  const rows = validateCatalog(catalog);
  assert.equal(rows.length, 6);
  for (const category of ["music", "labs", "tools"])
    assert.equal(rows.filter((t) => t.category === category).length, 2);
});
test("catalog rejects traversal, duplicates, unknown templates and Windows device paths", () => {
  for (const badId of [
    "../outside",
    "/absolute",
    "a/b",
    "a\\b",
    "con",
    "NUL",
  ]) {
    const bad = structuredClone(catalog);
    bad.templates[0].id = badId;
    assert.throws(() => validateCatalog(bad));
  }
  const duplicate = structuredClone(catalog);
  duplicate.templates.push(duplicate.templates[0]);
  assert.throws(() => validateCatalog(duplicate));
  const unknown = structuredClone(catalog);
  unknown.templates[0].layout = "unknown";
  assert.throws(() => validateCatalog(unknown));
});
test("HTML escapes content and brief uses the matching source file", () => {
  const t = { ...catalog.templates[0], name: "<img src=x onerror=alert(1)>" };
  const html = renderTemplate(t, "", "");
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<img src=x"));
  assert.equal(escapeHtml("\"&<>'"), "&quot;&amp;&lt;&gt;&#39;");
  assert.match(createBrief(t), /resonant\.html/);
});
test("every local destination and anchor resolves in generated output", async () => {
  const files = await artifacts();
  assert.equal(files.size, 21);
  for (const [name, html] of files)
    if (name.endsWith(".html")) {
      for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
        if (href.startsWith("https://")) continue;
        if (href.startsWith("#"))
          assert.ok(html.includes(`id="${href.slice(1)}"`), `${name}: ${href}`);
        else assert.ok(files.has(href), `${name}: missing ${href}`);
      }
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
      assert.ok(
        Buffer.byteLength(html) < 100_000,
        `${name} exceeds 100KB budget`,
      );
    }
});
test("deterministic build and check agree, then check detects drift", () =>
  withOutput(async (output) => {
    await build(output);
    await build(output, { check: true });
    const before = await readFile(path.join(output, "resonant.html"), "utf8");
    await build(output);
    assert.equal(
      await readFile(path.join(output, "resonant.html"), "utf8"),
      before,
    );
    await writeFile(path.join(output, "resonant.html"), "local work");
    await assert.rejects(build(output, { check: true }), /differs/);
    await assert.rejects(build(output), /Locally modified/);
    assert.equal(
      await readFile(path.join(output, "resonant.html"), "utf8"),
      "local work",
    );
  }));
test("builder preserves unmarked output and unrelated files", () =>
  withOutput(async (output) => {
    await mkdir(output);
    await writeFile(path.join(output, "index.html"), "user work");
    await assert.rejects(build(output), /unmarked/);
    await writeFile(path.join(output, "unrelated.txt"), "preserve me");
    await assert.rejects(build(output), /unrelated/);
    assert.equal(
      await readFile(path.join(output, "index.html"), "utf8"),
      "user work",
    );
  }));
test("builder refuses source paths, ancestors and relative destinations", async () => {
  for (const output of [
    pluginRoot,
    path.dirname(pluginRoot),
    path.join(pluginRoot, "output"),
    "relative",
  ])
    await assert.rejects(build(output));
});
test("builder rejects nested directories pretending to be files", () =>
  withOutput(async (output) => {
    await mkdir(path.join(output, "index.html"), { recursive: true });
    await assert.rejects(build(output), /regular files/);
  }));
test("compatibility metadata derives from the portable manifest", async () => {
  const manifest = JSON.parse(
    await readFile(path.join(pluginRoot, "plugin.json"), "utf8"),
  );
  const compat = JSON.parse(
    await readFile(path.join(pluginRoot, ".codex-plugin/plugin.json"), "utf8"),
  );
  assert.deepEqual(compat, compatibilityManifest(manifest));
  assert.ok(!compat.mcpServers);
  assert.ok(!compat.apps);
  assert.ok(!compat.hooks);
});

test("download source is byte-identical to its standalone HTML", async () => {
  const files = await artifacts();
  for (const t of catalog.templates)
    assert.equal(files.get(`${t.id}.html.txt`), files.get(`${t.id}.html`));
});

test("generated files have no trailing whitespace", async () => {
  for (const [name, content] of await artifacts())
    assert.ok(!/[ \t]+$/m.test(content), name);
});
