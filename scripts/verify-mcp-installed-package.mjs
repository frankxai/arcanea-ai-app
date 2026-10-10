import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Run through the repository's pinned pnpm: pnpm --dir packages/arcanea-mcp test:consumer.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pnpmEntry = process.env.npm_execpath;
assert.ok(pnpmEntry, "Use the pinned pnpm package script.");
const pnpmPath = realpathSync(pnpmEntry);
// Hosted pnpm can be a native executable; Corepack uses a JS entry on Windows.
const pnpmCommand = /\.(?:c|m)?js$/.test(pnpmPath)
  ? [process.execPath, pnpmPath]
  : [pnpmPath];
const repository = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const manifest = JSON.parse(
  readFileSync(join(root, "packages/arcanea-mcp/package.json"), "utf8"),
);
const output = join(root, "screenshots/mcp-consumer");
mkdirSync(output, { recursive: true });
const temporary = mkdtempSync(join(tmpdir(), "arcanea-installed-consumer-"));
const temporaryParent = realpathSync(tmpdir());
const temporaryRelative = relative(temporaryParent, realpathSync(temporary));
assert.ok(
  temporaryRelative &&
    !temporaryRelative.startsWith("..") &&
    !isAbsolute(temporaryRelative),
);
const receipt = {
  package: manifest.name,
  version: manifest.version,
  status: "RUNNING",
  stages: [],
};

function run(label, command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    timeout: 300_000,
    maxBuffer: 8 * 1024 * 1024,
    ...options,
  });
  writeFileSync(
    join(output, `${label}.log`),
    (result.stdout || "") + (result.stderr || ""),
  );
  assert.equal(result.error, undefined, `${label} did not finish normally`);
  assert.equal(result.status, 0, `${label} failed; see retained log`);
  receipt.stages.push(label);
  return result;
}

try {
  const pinned = run("pnpm-version", pnpmCommand[0], [
    ...pnpmCommand.slice(1),
    "--version",
  ]);
  assert.equal(`pnpm@${pinned.stdout.trim()}`, repository.packageManager);
  const artifacts = join(temporary, "artifacts");
  mkdirSync(artifacts);
  run("pack", pnpmCommand[0], [
    ...pnpmCommand.slice(1),
    "--dir",
    "packages/arcanea-mcp",
    "pack",
    "--pack-destination",
    artifacts,
  ]);
  const archives = readdirSync(artifacts).filter((name) =>
    name.endsWith(".tgz"),
  );
  assert.equal(archives.length, 1, "Expected one fresh package archive");
  const archive = join(artifacts, archives[0]);
  receipt.archiveSha256 = createHash("sha256")
    .update(readFileSync(archive))
    .digest("hex");
  copyFileSync(archive, join(output, archives[0]));
  const consumer = join(temporary, "consumer");
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      packageManager: repository.packageManager,
      dependencies: {
        [manifest.name]: `file:${archive.replaceAll("\\", "/")}`,
      },
    }),
  );
  const userConfig = join(temporary, "empty.npmrc");
  writeFileSync(userConfig, "");
  const cleanEnv = Object.fromEntries(
    [
      "PATH",
      "Path",
      "SystemRoot",
      "TEMP",
      "TMP",
      "HOME",
      "USERPROFILE",
      "APPDATA",
      "LOCALAPPDATA",
    ]
      .filter((key) => process.env[key])
      .map((key) => [key, process.env[key]]),
  );
  cleanEnv.NPM_CONFIG_USERCONFIG = userConfig;
  run(
    "fresh-install",
    pnpmCommand[0],
    [
      ...pnpmCommand.slice(1),
      "install",
      "--ignore-scripts",
      "--lockfile=false",
      "--store-dir",
      join(temporary, "store"),
      "--registry",
      "https://registry.npmjs.org",
    ],
    { cwd: consumer, env: cleanEnv },
  );
  const installed = join(consumer, "node_modules/@arcanea/mcp-server");
  const entry = join(installed, "dist/cli.js");
  const requireInstalled = createRequire(join(installed, "package.json"));
  const sdk = realpathSync(
    requireInstalled.resolve("@modelcontextprotocol/sdk/server/mcp.js"),
  );
  const sdkRelative = relative(realpathSync(consumer), sdk);
  assert.ok(
    sdkRelative && !sdkRelative.startsWith("..") && !isAbsolute(sdkRelative),
    "Installed server must resolve its consumer SDK, not workspace dependencies",
  );
  const version = run(
    "installed-version",
    process.execPath,
    [entry, "--version"],
    { cwd: consumer, env: cleanEnv },
  );
  assert.equal(version.stdout.trim(), manifest.version);
  assert.equal(version.stderr, "");
  const help = run("installed-help", process.execPath, [entry, "--help"], {
    cwd: consumer,
    env: cleanEnv,
  });
  assert.match(help.stdout, /Usage:/);
  assert.equal(help.stderr, "");
  run(
    "installed-stdio-restart",
    process.execPath,
    [
      "--test",
      join(root, "packages/arcanea-mcp/tests/runtime-delivery.test.mjs"),
    ],
    {
      cwd: consumer,
      env: { ...cleanEnv, ARCANEA_MCP_ENTRY: entry },
    },
  );
  receipt.status = "PASS";
  receipt.consumerSdkOutsideWorkspace = true;
} catch (error) {
  receipt.status = "FAIL";
  receipt.failure =
    error instanceof Error ? error.message : "Consumer verification failed";
  process.exitCode = 1;
} finally {
  // Only this mkdtemp-owned directory, checked against the resolved OS temp root.
  rmSync(temporary, { recursive: true, force: true });
  receipt.temporaryConsumerRemoved = true;
  writeFileSync(join(output, "receipt.json"), JSON.stringify(receipt, null, 2));
}
console.log(JSON.stringify(receipt));
