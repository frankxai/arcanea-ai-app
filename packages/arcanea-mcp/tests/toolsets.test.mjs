import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { TOOLSETS, resolveToolsets } from "../dist/toolsets.js";
import { createServer } from "../dist/index.js";
import { createRuntimeServer } from "../dist/runtime-server.js";
import { parseCliOptions } from "../dist/cli-options.js";

const everyGroupedTool = Object.values(TOOLSETS).flat();

async function servedTools(server) {
  const [serverSide, clientSide] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "toolsets-test", version: "0.0.0" });
  await Promise.all([server.connect(serverSide), client.connect(clientSide)]);
  const { tools } = await client.listTools();
  await client.close();
  return tools.map((tool) => tool.name).sort();
}

test("core stays small and no tool sits in two toolsets", () => {
  assert.ok(
    TOOLSETS.core.length <= 12,
    `core has ${TOOLSETS.core.length} tools`,
  );
  assert.equal(new Set(everyGroupedTool).size, everyGroupedTool.length);
});

test("resolveToolsets: default core, lists, all, unknown", () => {
  assert.deepEqual(
    [...resolveToolsets(undefined)].sort(),
    [...TOOLSETS.core].sort(),
  );
  assert.deepEqual(
    [...resolveToolsets("  ")].sort(),
    [...TOOLSETS.core].sort(),
  );
  assert.equal(
    resolveToolsets("core,world").size,
    TOOLSETS.core.length + TOOLSETS.world.length,
  );
  assert.equal(resolveToolsets("all").size, everyGroupedTool.length);
  assert.throws(
    () => resolveToolsets("core,nope"),
    /Unknown toolset "nope"\. Available: core, world/,
  );
});

test("all: every served tool has a group and every grouped tool is served", async () => {
  const served = await servedTools(createRuntimeServer({ toolsets: "all" }));
  assert.deepEqual(served, [...everyGroupedTool].sort());
});

test("core: the runtime server serves exactly the core set", async () => {
  assert.deepEqual(
    await servedTools(createRuntimeServer({ toolsets: "core" })),
    [...TOOLSETS.core].sort(),
  );
});

test("a selection adds groups, including the runtime-only library tools", async () => {
  const served = await servedTools(
    createRuntimeServer({ toolsets: "core,library" }),
  );
  assert.deepEqual(served, [...TOOLSETS.core, ...TOOLSETS.library].sort());
});

test("library API default is unchanged: createServer() serves every non-runtime tool", async () => {
  const served = await servedTools(createServer());
  assert.deepEqual(
    served,
    everyGroupedTool.filter((name) => !TOOLSETS.library.includes(name)).sort(),
  );
});

test("cli: --toolsets is parsed and validated; default comes from ARCANEA_TOOLSETS or core", () => {
  assert.deepEqual(parseCliOptions([]), {
    action: "serve",
    transport: "stdio",
    port: 3100,
    toolsets: undefined,
  });
  assert.equal(
    parseCliOptions(["--toolsets", "core,world"]).toolsets,
    "core,world",
  );
  assert.throws(
    () => parseCliOptions(["--toolsets", "nope"]),
    /Unknown toolset "nope"/,
  );
  assert.throws(
    () => parseCliOptions(["--toolsets"]),
    /Missing value for --toolsets/,
  );
});

test("the built CLI serves core by default and all with ARCANEA_TOOLSETS=all", async () => {
  const entry = fileURLToPath(new URL("../dist/cli.js", import.meta.url));
  for (const [env, expected] of [
    [{}, TOOLSETS.core.length],
    [{ ARCANEA_TOOLSETS: "all" }, everyGroupedTool.length],
  ]) {
    const client = new Client({ name: "toolsets-cli-test", version: "0.0.0" });
    await client.connect(
      new StdioClientTransport({
        command: process.execPath,
        args: [entry],
        env: { ...process.env, ARCANEA_TOOLSETS: "", ...env },
        stderr: "pipe",
      }),
    );
    try {
      assert.equal((await client.listTools()).tools.length, expected);
    } finally {
      await client.close();
    }
  }
});
