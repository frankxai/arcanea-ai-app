import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { handleMediaTool } from "../dist/tools/media-tools.js";

const cliPath = fileURLToPath(
  new URL("../../media/dist/cli.js", import.meta.url),
);
const scriptPath = fileURLToPath(
  new URL("../../../scripts/media-catalog.ps1", import.meta.url),
);
const root = resolve("media-fixture");
const manifest = resolve("media-fixture.json");

function intercept(
  t,
  available = [root, cliPath],
  execute = () => "scan complete",
) {
  const calls = [];
  t.mock.method(fs, "existsSync", (path) => available.includes(path));
  t.mock.method(childProcess, "execSync", () => {
    assert.fail("A shell must never execute media tool input");
  });
  t.mock.method(childProcess, "execFileSync", (...args) => {
    calls.push(args);
    return execute(...args);
  });
  syncBuiltinESMExports();
  t.after(() => {
    t.mock.restoreAll();
    syncBuiltinESMExports();
  });
  return calls;
}

test("invalid roots and manifests fail before starting a subprocess", async (t) => {
  const calls = intercept(t);
  for (const value of [
    undefined,
    null,
    1,
    true,
    [],
    {},
    "",
    "relative/path",
    `${root}\0`,
  ]) {
    assert.match(
      await handleMediaTool("media_scan", { root_path: value }),
      /ERROR: Invalid root_path/,
    );
  }
  for (const value of [
    1,
    true,
    [],
    {},
    "",
    "relative/manifest.json",
    `${manifest}\0`,
  ]) {
    assert.match(
      await handleMediaTool("media_scan", {
        root_path: root,
        manifest_path: value,
      }),
      /ERROR: Invalid manifest_path/,
    );
  }
  assert.equal(calls.length, 0);
});

test("a missing root never starts a subprocess", async (t) => {
  const calls = intercept(t, [cliPath]);
  assert.equal(
    await handleMediaTool("media_scan", {
      root_path: root,
      manifest_path: manifest,
    }),
    `ERROR: Path not found: ${root}`,
  );
  assert.equal(calls.length, 0);
});

test("Node receives exact inert argv, including quotes, substitutions, spaces and newlines", async (t) => {
  const hostileRoot = `${root} \"; $(echo injected) & \`echo injected\`\nend`;
  const hostileManifest = `${manifest} \"; $(echo injected) & \`echo injected\`\nend`;
  const calls = intercept(t, [hostileRoot, cliPath]);
  assert.equal(
    await handleMediaTool("media_scan", {
      root_path: hostileRoot,
      manifest_path: hostileManifest,
    }),
    "scan complete",
  );
  assert.deepEqual(calls, [
    [
      process.execPath,
      [cliPath, "scan", hostileRoot, "--manifest", hostileManifest],
      { timeout: 300_000, encoding: "utf-8", shell: false },
    ],
  ]);
});

test("PowerShell is selected only when the Node CLI is absent and its script exists", async (t) => {
  const hostileRoot = `${root} \"; $(echo injected) &\nend`;
  const hostileManifest = `${manifest} \"; $(echo injected) &\nend`;
  const calls = intercept(t, [hostileRoot, scriptPath]);
  assert.equal(
    await handleMediaTool("media_scan", {
      root_path: hostileRoot,
      manifest_path: hostileManifest,
    }),
    "Scan complete but manifest unreadable.",
  );
  assert.deepEqual(calls, [
    [
      "powershell.exe",
      [
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        scriptPath,
        "-Root",
        hostileRoot,
        "-Output",
        hostileManifest,
      ],
      { timeout: 300_000, encoding: "utf-8", shell: false },
    ],
  ]);
});

test("a failed or timed-out Node scan is never replayed in PowerShell", async (t) => {
  const calls = intercept(t, [root, cliPath, scriptPath], () => {
    throw new Error("scan timed out");
  });
  assert.equal(
    await handleMediaTool("media_scan", {
      root_path: root,
      manifest_path: manifest,
    }),
    "Scan error: Error: scan timed out",
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], process.execPath);
});

test("missing scan runtimes report unavailable without attempting either process", async (t) => {
  const calls = intercept(t, [root]);
  assert.match(
    await handleMediaTool("media_scan", {
      root_path: root,
      manifest_path: manifest,
    }),
    /ERROR: Media scanner unavailable/,
  );
  assert.equal(calls.length, 0);
});

test("PowerShell failures return one bounded error without retrying", async (t) => {
  const calls = intercept(t, [root, scriptPath], () => {
    throw new Error("x".repeat(500));
  });
  const result = await handleMediaTool("media_scan", {
    root_path: root,
    manifest_path: manifest,
  });
  assert.match(result, /^Scan error: Error:/);
  assert.ok(result.length <= "Scan error: ".length + 200);
  assert.equal(calls.length, 1);
});

test("the default manifest is an absolute file path", async (t) => {
  const calls = intercept(t);
  assert.equal(
    await handleMediaTool("media_scan", { root_path: root }),
    "scan complete",
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1][4], resolve(calls[0][1][4]));
});

test("an available PowerShell scanner returns the saved manifest receipt", async (t) => {
  const calls = intercept(t, [root, scriptPath, manifest]);
  t.mock.method(fs, "readFileSync", () =>
    JSON.stringify({ total_files: 2, total_size_mb: 3 }),
  );
  syncBuiltinESMExports();
  assert.equal(
    await handleMediaTool("media_scan", {
      root_path: root,
      manifest_path: manifest,
    }),
    `Scanned 2 files (3 MB). Manifest: ${manifest}`,
  );
  assert.equal(calls.length, 1);
});
