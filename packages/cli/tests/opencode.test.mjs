import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const source =
  process.env.ARCANEA_OPENCODE_INSTALLER ?? "src/installers/opencode.ts";
const { OpenCodeProjectInstaller } = await import(
  pathToFileURL(resolve(import.meta.dirname, "..", source)).href
);
const roots = [];
afterEach(() => {
  for (const root of roots.splice(0))
    fs.rmSync(root, { recursive: true, force: true });
});

function fixture() {
  const root = fs.mkdtempSync(join(tmpdir(), "arcanea opencode "));
  roots.push(root);
  const entry = join(root, "installed MCP cli.js");
  fs.writeFileSync(entry, "// Explicit local MCP fixture\n");
  const project = join(root, "creator project");
  fs.mkdirSync(project);
  return {
    root,
    entry,
    project,
    target: join(project, ".opencode", "plugins", "arcanea-creator.ts"),
    installer: new OpenCodeProjectInstaller(entry),
  };
}

test("preview performs no writes and requires an explicit installed entry", async () => {
  const f = fixture();
  const before = fs.readdirSync(f.project);
  assert.equal(
    (await f.installer.preview(f.project, "standard")).filesToCreate.length,
    1,
  );
  assert.deepEqual(fs.readdirSync(f.project), before);
  await assert.rejects(
    new OpenCodeProjectInstaller("").preview(f.project, "standard"),
    /--mcp-entry/,
  );
  await assert.rejects(
    new OpenCodeProjectInstaller(f.project).preview(f.project, "standard"),
    /regular/,
  );
});

test("installation preserves JSONC bytes and other plugins and is idempotent", async () => {
  const f = fixture();
  const config =
    '// Keep comments, model pin and permission\n{"model":"pinned/model", "permission":"ask",}\n';
  fs.writeFileSync(join(f.project, "opencode.jsonc"), config);
  fs.mkdirSync(join(f.project, ".opencode", "plugins"), { recursive: true });
  fs.writeFileSync(
    join(f.project, ".opencode", "plugins", "other.ts"),
    "// User-owned plugin",
  );
  assert.deepEqual(
    (await f.installer.install(f.project, "standard")).filesCreated,
    [f.target],
  );
  const stat = fs.statSync(f.target);
  const installed = fs.readFileSync(f.target, "utf8");
  assert.deepEqual(
    (await f.installer.install(f.project, "standard")).filesCreated,
    [],
  );
  assert.equal(fs.statSync(f.target).mtimeMs, stat.mtimeMs);
  assert.equal(fs.readFileSync(f.target, "utf8"), installed);
  assert.equal(
    fs.readFileSync(join(f.project, "opencode.jsonc"), "utf8"),
    config,
  );
  assert.equal(
    fs.readFileSync(
      join(f.project, ".opencode", "plugins", "other.ts"),
      "utf8",
    ),
    "// User-owned plugin",
  );
});

test("the actual generated plugin adds tools while preserving every other config field", async () => {
  const f = fixture();
  await f.installer.install(f.project, "standard");
  const { default: plugin } = await import(pathToFileURL(f.target).href);
  const config = {
    model: "user/model",
    small_model: "user/small",
    permission: { "*": "ask" },
    provider: { custom: { options: { apiKey: "{env:USER_KEY}" } } },
    agent: { author: { model: "user/author" } },
    mcp: { other: { enabled: false } },
  };
  const before = structuredClone(config);
  const hook = await plugin();
  await hook.config(config);
  const arcanea = config.mcp.arcanea;
  delete config.mcp.arcanea;
  assert.deepEqual(config, before);
  assert.deepEqual(arcanea.command, [
    process.execPath,
    f.entry,
    "--toolsets",
    "core,world",
  ]);
  assert.equal(
    arcanea.environment.ARCANEA_DATA_DIR,
    join(f.project, ".arcanea", "data"),
  );
  assert.equal(arcanea.type, "local");
  assert.equal(arcanea.enabled, true);
});

test("an existing Arcanea server, including a disable, takes precedence", async () => {
  const f = fixture();
  await f.installer.install(f.project, "minimal");
  const { default: plugin } = await import(pathToFileURL(f.target).href);
  for (const arcanea of [
    { enabled: false },
    { type: "remote", url: "https://example.invalid/mcp" },
    null,
  ]) {
    const config = { mcp: { arcanea } };
    await (await plugin()).config(config);
    assert.deepEqual(config, { mcp: { arcanea } });
  }
});

test("minimal installs core tools and unsupported lore levels fail before writing", async () => {
  const f = fixture();
  for (const level of ["full", "luminor", "unknown"])
    await assert.rejects(f.installer.install(f.project, level), /minimal/);
  assert.equal(fs.existsSync(f.target), false);
  await f.installer.install(f.project, "minimal");
  const { default: plugin } = await import(pathToFileURL(f.target).href);
  const config = {};
  await (await plugin()).config(config);
  assert.equal(config.mcp.arcanea.command.at(-1), "core");
});

test("foreign and modified files are preserved during preview, install and removal", async () => {
  const f = fixture();
  await f.installer.install(f.project, "standard");
  fs.appendFileSync(f.target, "// Creator customization\n");
  const content = fs.readFileSync(f.target);
  for (const method of ["preview", "install", "remove"])
    await assert.rejects(
      f.installer[method](f.project, "standard"),
      /Preserving/,
    );
  assert.deepEqual(fs.readFileSync(f.target), content);
});

test("changing an entry or level does not overwrite an existing installation", async () => {
  const f = fixture();
  await f.installer.install(f.project, "standard");
  const content = fs.readFileSync(f.target);
  await assert.rejects(f.installer.install(f.project, "minimal"), /Preserving/);
  const other = join(f.root, "other cli.js");
  fs.writeFileSync(other, "// Other explicit entry");
  await assert.rejects(
    new OpenCodeProjectInstaller(other).install(f.project, "standard"),
    /Preserving/,
  );
  assert.deepEqual(fs.readFileSync(f.target), content);
});

test("scoped removal retains saved worlds, settings and other plugins", async () => {
  const f = fixture();
  await f.installer.install(f.project, "standard");
  fs.mkdirSync(join(f.project, ".arcanea", "data"), { recursive: true });
  fs.writeFileSync(
    join(f.project, ".arcanea", "data", "world.json"),
    '{"creator":"owned"}',
  );
  fs.writeFileSync(join(f.project, "opencode.jsonc"), "// Preserved");
  fs.writeFileSync(
    join(f.project, ".opencode", "plugins", "other.ts"),
    "// Preserved",
  );
  fs.unlinkSync(f.entry); // Removal remains possible after the server is uninstalled.
  await f.installer.remove(f.project, "standard");
  await f.installer.remove(f.project, "standard");
  assert.equal(fs.existsSync(f.target), false);
  assert.equal(
    fs.readFileSync(join(f.project, ".arcanea", "data", "world.json"), "utf8"),
    '{"creator":"owned"}',
  );
  assert.equal(
    fs.readFileSync(join(f.project, "opencode.jsonc"), "utf8"),
    "// Preserved",
  );
  assert.equal(
    fs.readFileSync(
      join(f.project, ".opencode", "plugins", "other.ts"),
      "utf8",
    ),
    "// Preserved",
  );
});

for (const parent of [".opencode", ".opencode/plugins"]) {
  test(`a linked ${parent} directory is denied without writing outside the project`, async () => {
    const f = fixture();
    const outside = join(f.root, "outside");
    fs.mkdirSync(outside);
    const link = join(f.project, parent);
    fs.mkdirSync(resolve(link, ".."), { recursive: true });
    fs.symlinkSync(
      outside,
      link,
      process.platform === "win32" ? "junction" : "dir",
    );
    await assert.rejects(
      f.installer.install(f.project, "standard"),
      /symlinks|junctions/,
    );
    assert.deepEqual(fs.readdirSync(outside), []);
  });
}

test("a project root symlink is denied", async () => {
  const f = fixture();
  const linked = join(f.root, "linked");
  fs.symlinkSync(
    f.project,
    linked,
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    f.installer.install(linked, "standard"),
    /symlink|junction/,
  );
});

test("failed atomic installation exposes no partial plugin and can be retried", async () => {
  const f = fixture();
  const original = fs.linkSync;
  fs.linkSync = () => {
    const error = new Error("Injected interruption before commit");
    error.code = "EIO";
    throw error;
  };
  syncBuiltinESMExports();
  try {
    await assert.rejects(
      f.installer.install(f.project, "standard"),
      /Injected interruption/,
    );
  } finally {
    fs.linkSync = original;
    syncBuiltinESMExports();
  }
  assert.equal(fs.existsSync(f.target), false);
  assert.deepEqual(fs.readdirSync(join(f.project, ".opencode", "plugins")), []);
  await f.installer.install(f.project, "standard");
  assert.equal(fs.existsSync(f.target), true);
});
