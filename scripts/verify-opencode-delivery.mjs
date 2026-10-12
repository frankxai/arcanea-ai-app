import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const output = join(root, "screenshots/opencode-consumer");
mkdirSync(output, { recursive: true });
const temporary = realpathSync(
  mkdtempSync(join(tmpdir(), "arcanea opencode consumer ")),
);
const containment = relative(realpathSync(tmpdir()), temporary);
assert.ok(
  containment && !containment.startsWith("..") && !isAbsolute(containment),
);
const pnpmPath = realpathSync(process.env.npm_execpath);
const pnpm = /\.(?:c|m)?js$/.test(pnpmPath)
  ? [process.execPath, pnpmPath]
  : [pnpmPath];
const metadata = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const cliMetadata = JSON.parse(
  readFileSync(join(root, "packages/cli/package.json"), "utf8"),
);
const receipt = {
  status: "RUNNING",
  stages: [],
  modelCalls: 0,
  npmPublication: false,
  nativeAgentInference: false,
};
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const env = Object.fromEntries(
  [
    "PATH",
    "Path",
    "SystemRoot",
    "TEMP",
    "TMP",
    "USERPROFILE",
    "APPDATA",
    "LOCALAPPDATA",
  ]
    .filter((key) => process.env[key])
    .map((key) => [key, process.env[key]]),
);
Object.assign(env, {
  NO_COLOR: "1",
  NPM_CONFIG_USERCONFIG: join(temporary, "empty.npmrc"),
  XDG_CONFIG_HOME: join(temporary, "config"),
  XDG_DATA_HOME: join(temporary, "data"),
  XDG_CACHE_HOME: join(temporary, "cache"),
  XDG_STATE_HOME: join(temporary, "state"),
  OPENCODE_DISABLE_AUTOUPDATE: "true",
  OPENCODE_DISABLE_DEFAULT_PLUGINS: "true",
});
writeFileSync(env.NPM_CONFIG_USERCONFIG, "");

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
  assert.equal(result.error, undefined, `${label}: process error`);
  assert.equal(result.status, 0, `${label}: see retained log`);
  receipt.stages.push(label);
  return result.stdout;
}

try {
  receipt.sourceSha = run("source", "git", ["rev-parse", "HEAD"]).trim();
  assert.equal(
    `pnpm@${run("pnpm-version", pnpm[0], [...pnpm.slice(1), "--version"]).trim()}`,
    metadata.packageManager,
  );

  // Execute the immutable original installer module in the actual compiled CLI.
  // This is an installer baseline, not a claim of a whole historical runtime.
  const baselineSha = "1e8421d51c2467cf0475ece811f58d7a62d472eb";
  let baseline = spawnSync(
    "git",
    ["show", `${baselineSha}:packages/cli/src/commands/install.ts`],
    { cwd: root, encoding: "utf8" },
  );
  if (baseline.status !== 0) {
    const response = await fetch(
      `https://raw.githubusercontent.com/frankxai/arcanea-ai-app/${baselineSha}/packages/cli/src/commands/install.ts`,
    );
    assert.equal(response.status, 200);
    baseline = { status: 0, stdout: await response.text() };
  }
  assert.equal(baseline.status, 0);
  assert.equal(
    digest(baseline.stdout),
    "a849a5be481db469f7e10fb0d8018a3ac8280fc5dee573a0e4fd1a5d2ad40657",
  );
  const cliRequire = createRequire(join(root, "packages/cli/package.json"));
  const esbuild = cliRequire("esbuild");
  const compiledInstaller = join(root, "packages/cli/dist/commands/install.js");
  const candidateInstaller = readFileSync(compiledInstaller);
  const project = join(temporary, "creator project");
  mkdirSync(project);
  try {
    writeFileSync(
      compiledInstaller,
      esbuild.transformSync(baseline.stdout, { loader: "ts", format: "esm" })
        .code,
    );
    run("baseline-build", process.execPath, [
      join(root, "packages/cli/build.mjs"),
    ]);
    const result = spawnSync(
      process.execPath,
      [
        join(root, "packages/cli/dist/arcanea.cjs"),
        "install",
        "opencode",
        "--dry-run",
        "--dir",
        project,
      ],
      { encoding: "utf8", cwd: project, timeout: 10_000, env },
    );
    writeFileSync(
      join(output, "baseline-install.log"),
      (result.stdout || "") + (result.stderr || ""),
    );
    assert.equal(result.error, undefined);
    assert.equal(result.status, 1);
    assert.match(
      (result.stdout || "") + (result.stderr || ""),
      /Unknown provider: opencode/,
    );
    assert.equal(existsSync(join(project, ".opencode")), false);
    receipt.baseline = {
      sourceSha: baselineSha,
      installerSha256: digest(baseline.stdout),
      failure: "Unknown provider: opencode",
      exactOriginalInstallerModule: true,
    };
  } finally {
    writeFileSync(compiledInstaller, candidateInstaller);
    run("candidate-build", process.execPath, [
      join(root, "packages/cli/build.mjs"),
    ]);
  }

  const artifacts = join(temporary, "artifacts");
  mkdirSync(artifacts);
  for (const name of ["cli", "arcanea-mcp"])
    run(`pack-${name}`, pnpm[0], [
      ...pnpm.slice(1),
      "--dir",
      `packages/${name}`,
      "pack",
      "--pack-destination",
      artifacts,
    ]);
  const archives = readdirSync(artifacts).filter((name) =>
    name.endsWith(".tgz"),
  );
  assert.equal(archives.length, 2);
  const cliArchive = archives.find((name) => name.startsWith("arcanea-cli-"));
  const mcpArchive = archives.find((name) =>
    name.startsWith("arcanea-mcp-server-"),
  );
  assert.ok(cliArchive && mcpArchive);
  receipt.archives = archives.map((name) => {
    copyFileSync(join(artifacts, name), join(output, name));
    return { name, sha256: digest(readFileSync(join(artifacts, name))) };
  });
  const consumer = join(temporary, "consumer");
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      packageManager: metadata.packageManager,
      dependencies: {
        "@arcanea/cli": `file:${join(artifacts, cliArchive).replaceAll("\\", "/")}`,
        "@arcanea/mcp-server": `file:${join(artifacts, mcpArchive).replaceAll("\\", "/")}`,
        "opencode-ai": "1.18.35",
      },
    }),
  );
  run(
    "fresh-install",
    pnpm[0],
    [
      ...pnpm.slice(1),
      "install",
      "--ignore-scripts",
      "--lockfile=false",
      "--store-dir",
      join(temporary, "store"),
      "--registry",
      "https://registry.npmjs.org",
    ],
    { cwd: consumer, env },
  );
  const requireConsumer = createRequire(join(consumer, "package.json"));
  const installedCli = dirname(
    realpathSync(requireConsumer.resolve("@arcanea/cli")),
  );
  const cli = join(installedCli, "arcanea.cjs");
  const installedManifest = JSON.parse(
    readFileSync(join(installedCli, "../package.json"), "utf8"),
  );
  assert.equal(installedManifest.name, cliMetadata.name);
  assert.equal(installedManifest.dependencies, undefined);
  assert.equal(installedManifest.scripts, undefined);
  assert.equal(
    run("installed-version", process.execPath, [cli, "--version"], {
      cwd: project,
      env,
    }).trim(),
    cliMetadata.version,
  );
  const mcp = realpathSync(requireConsumer.resolve("@arcanea/mcp-server"));
  const mcpEntry = join(dirname(mcp), "cli.js");
  const serverRequire = createRequire(mcp);
  const sdkEntry = realpathSync(
    serverRequire.resolve("@modelcontextprotocol/sdk/client/index.js"),
  );
  for (const path of [realpathSync(cli), mcpEntry, sdkEntry]) {
    const within = relative(temporary, path);
    assert.ok(within && !within.startsWith("..") && !isAbsolute(within));
  }
  const opencodeRequire = createRequire(
    requireConsumer.resolve("opencode-ai/package.json"),
  );
  const platform = process.platform === "win32" ? "windows" : process.platform;
  const nativePackage = `opencode-${platform}-${process.arch}`;
  const nativeManifestPath = opencodeRequire.resolve(
    `${nativePackage}/package.json`,
  );
  assert.equal(
    JSON.parse(readFileSync(nativeManifestPath, "utf8")).version,
    "1.18.35",
  );
  const binary = ["opencode.exe", "opencode"]
    .map((name) => join(dirname(nativeManifestPath), "bin", name))
    .find(existsSync);
  assert.ok(
    binary,
    "The pinned native platform package must contain its executable",
  );
  assert.equal(
    run("opencode-version", binary, ["--version"], {
      cwd: project,
      env,
    }).trim(),
    "1.18.35",
  );

  const configPath = join(project, "opencode.jsonc");
  const configBytes =
    "// Creator-owned comments and model choices\n" +
    JSON.stringify(
      {
        model: "user/pinned",
        small_model: "user/small",
        permission: { "*": "ask" },
        autoupdate: false,
        mcp: {
          preserved: {
            type: "local",
            command: ["unused-disabled-server"],
            enabled: false,
          },
        },
      },
      null,
      2,
    ) +
    "\n";
  writeFileSync(configPath, configBytes);
  const install = [
    "install",
    "opencode",
    "--mcp-entry",
    mcpEntry,
    "--dir",
    project,
  ];
  run("installed-preview", process.execPath, [cli, ...install, "--dry-run"], {
    cwd: project,
    env,
  });
  assert.equal(existsSync(join(project, ".opencode")), false);
  run("installed-adapter", process.execPath, [cli, ...install], {
    cwd: project,
    env,
  });
  const pluginPath = join(project, ".opencode/plugins/arcanea-creator.ts");
  const originalPlugin = readFileSync(pluginPath);
  run("installed-idempotence", process.execPath, [cli, ...install], {
    cwd: project,
    env,
  });
  assert.deepEqual(readFileSync(pluginPath), originalPlugin);
  const effective = JSON.parse(
    run("native-config", binary, ["debug", "config"], { cwd: project, env }),
  );
  assert.equal(effective.model, "user/pinned");
  assert.equal(effective.small_model, "user/small");
  assert.equal(effective.permission["*"], "ask");
  assert.equal(effective.mcp.preserved.enabled, false);
  assert.deepEqual(effective.mcp.arcanea.command, [
    process.execPath,
    mcpEntry,
    "--toolsets",
    "core,world",
  ]);
  assert.equal(
    effective.mcp.arcanea.environment.ARCANEA_DATA_DIR,
    join(project, ".arcanea", "data"),
  );
  const statuses = run("native-mcp-connection", binary, ["mcp", "list"], {
    cwd: project,
    env,
  });
  assert.match(
    statuses.replace(/\x1b\[[0-9;]*m/g, ""),
    /arcanea[^\n]*connected/,
  );
  assert.equal(readFileSync(configPath, "utf8"), configBytes);

  // Real tool invocation through the freshly installed SDK and exactly the
  // command/environment resolved by OpenCode. No language model is invoked.
  const { Client } = await import(pathToFileURL(sdkEntry).href);
  const { StdioClientTransport } = await import(
    pathToFileURL(
      serverRequire.resolve("@modelcontextprotocol/sdk/client/stdio.js"),
    ).href
  );
  async function connect() {
    const client = new Client({
      name: "arcanea-opencode-consumer",
      version: "1.0.0",
    });
    const [command, ...args] = effective.mcp.arcanea.command;
    await client.connect(
      new StdioClientTransport({
        command,
        args,
        cwd: project,
        env: { ...env, ...effective.mcp.arcanea.environment },
        stderr: "pipe",
      }),
    );
    return client;
  }
  async function call(client, name, args) {
    const result = await client.callTool({ name, arguments: args });
    assert.notEqual(result.isError, true);
    return JSON.parse(result.content[0].text);
  }
  let client = await connect();
  try {
    const { tools } = await client.listTools();
    assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length);
    for (const name of [
      "validate_canon",
      "generate_character",
      "save_world",
      "load_world",
      "get_world_graph",
    ])
      assert.ok(
        tools.some((tool) => tool.name === name),
        name,
      );
    const screen = await call(client, "validate_canon", {
      content: "Shinkami is Guardian of Gate 10.",
    });
    assert.equal(screen.valid, true);
    assert.equal(screen.canonApproval, false);
    await call(client, "generate_character", {
      sessionId: "opencode-delivery-fixture",
      primaryElement: "Water",
      gatesOpen: 3,
    });
    assert.equal(
      (
        await call(client, "save_world", {
          sessionId: "opencode-delivery-fixture",
        })
      ).nodeCount,
      1,
    );
    receipt.toolNames = tools.map((tool) => tool.name);
  } finally {
    await client.close();
  }
  client = await connect();
  try {
    const world = await call(client, "load_world", {
      sessionId: "opencode-delivery-fixture",
    });
    assert.equal(world.loaded, true);
    assert.equal(world.nodeCount, 1);
    assert.equal(
      (
        await call(client, "get_world_graph", {
          sessionId: "opencode-delivery-fixture",
        })
      ).worldSummary.nodeCount,
      1,
    );
  } finally {
    await client.close();
  }
  receipt.stages.push("installed-sdk-tools-and-restart");

  writeFileSync(
    configPath,
    JSON.stringify({
      autoupdate: false,
      mcp: {
        arcanea: { type: "local", command: ["must-not-run"], enabled: false },
      },
    }),
  );
  const disabledBytes = readFileSync(configPath);
  const disabled = JSON.parse(
    run("native-explicit-disable", binary, ["debug", "config"], {
      cwd: project,
      env,
    }),
  );
  assert.equal(disabled.mcp.arcanea.enabled, false);
  assert.deepEqual(disabled.mcp.arcanea.command, ["must-not-run"]);
  assert.deepEqual(readFileSync(configPath), disabledBytes);
  writeFileSync(
    pluginPath,
    Buffer.concat([originalPlugin, Buffer.from("// User edit\n")]),
  );
  const refusal = spawnSync(process.execPath, [cli, ...install], {
    cwd: project,
    env,
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.equal(refusal.status, 1);
  assert.match((refusal.stdout || "") + (refusal.stderr || ""), /Preserving/);
  writeFileSync(pluginPath, originalPlugin);
  run(
    "installed-scoped-removal",
    process.execPath,
    [cli, ...install, "--remove"],
    { cwd: project, env },
  );
  assert.equal(existsSync(pluginPath), false);
  assert.deepEqual(readFileSync(configPath), disabledBytes);
  assert.ok(existsSync(join(project, ".arcanea", "data")));
  receipt.status = "PASS";
  receipt.nativeHarness = {
    package: "opencode-ai",
    version: "1.18.35",
    pluginLoaded: true,
    mcpConnected: true,
  };
  receipt.consumerDependenciesOutsideWorkspace = true;
  receipt.proofScope =
    "Native plugin configuration and MCP connection; installed SDK tool calls and restart. Deterministic fixture only; no model inference, literary or customer approval.";
} catch (error) {
  receipt.status = "FAIL";
  receipt.failure = error instanceof Error ? error.message : String(error);
  process.exitCode = 1;
} finally {
  assert.equal(realpathSync(temporary), temporary);
  rmSync(temporary, { recursive: true, force: true });
  receipt.temporaryConsumerRemoved = true;
  writeFileSync(
    join(output, "receipt.json"),
    JSON.stringify(receipt, null, 2) + "\n",
  );
}
console.log(JSON.stringify(receipt));
