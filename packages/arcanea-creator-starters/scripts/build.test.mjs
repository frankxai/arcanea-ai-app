import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import {
  artifacts,
  build,
  validateCatalog,
  compatibilityManifest,
  pluginRoot,
  scriptHash,
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
test("catalog provides three examples per requested audience", () => {
  const rows = validateCatalog(catalog);
  assert.equal(rows.length, 9);
  for (const category of ["music", "labs", "tools"])
    assert.equal(rows.filter((t) => t.category === category).length, 3);
});
test("CSP hash matches the exact inline script in all ten generated pages", async () => {
  const expected = await scriptHash();
  let pages = 0;
  for (const [name, html] of await artifacts()) {
    if (!name.endsWith(".html")) continue;
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1, name);
    const hash = (script) =>
      `sha256-${createHash("sha256").update(script, "utf8").digest("base64")}`;
    assert.equal(hash(scripts[0][1]), expected, name);
    assert.notEqual(hash(scripts[0][1] + "\nalert(1)"), expected, name);
    pages++;
  }
  assert.equal(pages, 10);
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
  assert.equal(files.size, 3 + catalog.templates.length * 4);
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

test("v0 bundles carry exact source and brief under bounded import targets", async () => {
  const files = await artifacts();
  const targets = new Set();
  for (const t of catalog.templates) {
    const item = JSON.parse(files.get(`${t.id}.registry.json`));
    assert.equal(item.type, "registry:block");
    assert.equal(item.files.length, 2);
    assert.equal(item.files[0].content, files.get(`${t.id}.html`));
    assert.equal(item.files[1].content, files.get(`${t.id}.md`));
    for (const f of item.files) {
      assert.equal(f.type, "registry:file");
      assert.ok(f.target.startsWith(`~/creator-starters/${t.id}/`));
      assert.ok(!f.target.includes(".."));
      assert.ok(!targets.has(f.target));
      targets.add(f.target);
    }
    for (const key of [
      "dependencies",
      "registryDependencies",
      "envVars",
      "css",
      "cssVars",
    ])
      assert.equal(item[key], undefined);
  }
});

test("extended artifacts render native controls and research evidence without orbit filler", async () => {
  const files = await artifacts();
  for (const id of ["fieldwork", "open-model"]) {
    const html = files.get(`${id}.html`);
    assert.match(html, /<table class="evidence-table"/);
    assert.match(html, /<caption>/);
    assert.doesNotMatch(html, /<ellipse|mini-orbit|class="research-figure"/);
  }
  assert.match(files.get("session.html"), /data-audio="2"/);
  assert.match(files.get("margin.html"), /data-copy-paper/);
  assert.match(files.get("patch.html"), /data-json-form/);
  for (const id of ["session", "margin", "patch"]) {
    const html = files.get(`${id}.html`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${id}: duplicate element ids`);
  }
});
