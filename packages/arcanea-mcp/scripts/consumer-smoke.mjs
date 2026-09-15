#!/usr/bin/env node
// Installs the package the way a stranger would and talks MCP to it.
//
//   pnpm pack -> npm i --ignore-scripts <tarball> in an empty dir -> spawn the bin
//   -> initialize + tools/list -> worldpack_check a forged and a clean pack
//
// Flags:
//   --no-build                 skip `pnpm run build` (dist already fresh)
//   --pack-destination <dir>   keep the tarball there (the publish workflow publishes it)
//
// 0.7.0 shipped with a workspace:* dependency and could not be installed by anyone.
// This script is the gate that makes that impossible to repeat.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const destIdx = argv.indexOf("--pack-destination");
const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));

// npm and pnpm are .cmd shims on Windows, which execFile can only start through a shell.
const sh = (cmd, args, cwd) =>
  execFileSync(cmd, args, {
    cwd,
    stdio: ["ignore", "pipe", "inherit"],
    shell: process.platform === "win32",
    encoding: "utf8",
  });

function fail(message) {
  throw new Error(`consumer-smoke: ${message}`);
}

const work = mkdtempSync(join(tmpdir(), "arcanea-mcp-smoke-"));
const packDir = destIdx >= 0 ? resolve(argv[destIdx + 1]) : join(work, "pack");
let client;

try {
  mkdirSync(packDir, { recursive: true });
  if (!argv.includes("--no-build")) sh("pnpm", ["run", "build"], pkgRoot);
  sh("pnpm", ["pack", "--pack-destination", packDir], pkgRoot);
  const tarball = join(
    packDir,
    `${pkg.name.replace(/^@/, "").replace("/", "-")}-${pkg.version}.tgz`,
  );
  if (!existsSync(tarball)) fail(`pnpm pack did not produce ${tarball}`);

  const consumer = join(work, "consumer");
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({ name: "consumer-smoke", version: "0.0.0", private: true }),
  );
  sh(
    "npm",
    [
      "i",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--loglevel=error",
      tarball,
    ],
    consumer,
  );

  const installed = join(consumer, "node_modules", ...pkg.name.split("/"));
  const manifestText = readFileSync(join(installed, "package.json"), "utf8");
  const local = manifestText.match(/"(?:workspace|link|file):[^"]*"/g);
  if (local)
    fail(`packed manifest carries local specifiers: ${local.join(", ")}`);
  const manifest = JSON.parse(manifestText);

  const bin = join(installed, manifest.bin["arcanea-mcp"]);
  const sdk = join(consumer, "node_modules/@modelcontextprotocol/sdk/dist/esm");
  const { Client } = await import(
    pathToFileURL(join(sdk, "client/index.js")).href
  );
  const { StdioClientTransport } = await import(
    pathToFileURL(join(sdk, "client/stdio.js")).href
  );

  client = new Client({ name: "consumer-smoke", version: "1.0.0" });
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [bin],
      cwd: consumer,
      stderr: "inherit",
    }),
  );
  const server = client.getServerVersion();
  if (server?.version !== pkg.version)
    fail(
      `server reports version ${server?.version}, package is ${pkg.version}`,
    );

  const tools = [];
  let cursor;
  do {
    const page = await client.listTools(cursor ? { cursor } : {});
    tools.push(...page.tools);
    cursor = page.nextCursor;
  } while (cursor);
  for (const name of ["worldpack_check", "worldpack_verify", "worldpack_rules"])
    if (!tools.some((t) => t.name === name))
      fail(`${name} missing from tools/list`);

  const shippedCanon = readFileSync(
    join(installed, "dist/vendor/canon/CANON_LOCKED.md"),
  );
  if (shippedCanon.toString("utf8").includes("What is NOT a Sister-World"))
    fail("the installed package carries private-only canon");
  const { packDigest } = await import(
    pathToFileURL(join(installed, "dist/vendor/world-pack/pack.mjs")).href
  );
  const canonHash = `sha256:${createHash("sha256").update(shippedCanon).digest("hex")}`;
  // The fixture was cleared against the repo canon; rebind it to the canon this
  // package ships and reseal, as a creator re-exporting it would.
  const fixturePack = () => {
    const pack = JSON.parse(
      readFileSync(
        resolve(pkgRoot, "../world-pack/fixtures/slow-chart.worldpack.json"),
        "utf8",
      ),
    );
    pack.canon.sourceHash = canonHash;
    pack.digest = packDigest(pack);
    return pack;
  };
  const check = async (pack) => {
    const result = await client.callTool({
      name: "worldpack_check",
      arguments: { pack },
    });
    return JSON.parse(result.content[0].text);
  };

  const clean = await check(fixturePack());
  if (clean.verdict !== "pass")
    fail(`clean pack: expected pass, got ${clean.headline}`);

  const forged = fixturePack();
  const gov = forged.nodes.find((n) => n.type === "World").governance;
  forged.nodes.push({
    id: "chr_forged",
    type: "Character",
    name: "Veyra Coldwater",
    layer: "canon",
    attributes: {},
    governance: {
      ...gov,
      owner: "arcanea",
      canonStatus: "locked",
      rights: { state: "arcanea-owned" },
      evalRule: "canon-immutable",
    },
  });
  const blocked = await check(forged);
  const claim = blocked.findings?.find((f) => f.ruleId === "canon.layer-claim");
  if (blocked.verdict !== "blocked" || claim?.severity !== "blocker")
    fail(
      `forged pack: expected a canon.layer-claim blocker, got ${blocked.headline}`,
    );

  console.log(
    [
      "consumer-smoke: OK",
      `  tarball          ${tarball}`,
      "  manifest         no workspace:/link:/file: specifiers",
      `  initialize       ${server.name} ${server.version}`,
      `  tools/list       ${tools.length} tools`,
      "  worldpack_check  clean pack -> pass; forged canon claim -> blocked (canon.layer-claim)",
    ].join("\n"),
  );

  if (process.env.GITHUB_OUTPUT)
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `tool_count=${tools.length}\ntarball=${tarball}\n`,
    );
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await client?.close();
  rmSync(work, { recursive: true, force: true });
}
