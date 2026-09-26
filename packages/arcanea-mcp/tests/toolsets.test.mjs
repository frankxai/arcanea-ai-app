import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { PROMPT_TOOLS, TOOLSETS, resolveToolsets } from "../dist/toolsets.js";
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

test("resolveToolsets rejects empty entries and unknown names, even next to all", () => {
  assert.throws(() => resolveToolsets(","), /Empty toolset name/);
  assert.throws(() => resolveToolsets("core,,world"), /Empty toolset name/);
  assert.throws(() => resolveToolsets("all,nope"), /Unknown toolset "nope"/);
});

test("a prompt loads only when every tool it tells the agent to use is enabled", async () => {
  async function prompts(toolsets) {
    const [serverSide, clientSide] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "prompts-test", version: "0.0.0" });
    await Promise.all([
      createRuntimeServer({ toolsets }).connect(serverSide),
      client.connect(clientSide),
    ]);
    const { prompts: list } = await client.listPrompts();
    await client.close();
    return list.map((prompt) => prompt.name);
  }
  const core = await prompts("core");
  assert.ok(core.includes("gate_ritual"));
  assert.ok(!core.includes("worldbuild_session"));
  assert.ok(!core.includes("unblock_session"));
  const all = await prompts("all");
  for (const name of ["worldbuild_session", "unblock_session", "gate_ritual"])
    assert.ok(all.includes(name), name);
});

test("PROMPT_TOOLS declares every tool each prompt mentions (keeps the map in sync)", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(
    new URL("../src/registrations/references.ts", import.meta.url),
    "utf8",
  );
  const blocks = source.split("registerPrompt(").slice(1);
  for (const block of blocks) {
    const name = /^\s*"([a-z_]+)"/.exec(block)[1];
    const mentioned = everyGroupedTool.filter((tool) =>
      new RegExp(`\\b${tool}\\b`).test(block),
    );
    assert.deepEqual(
      [...(PROMPT_TOOLS[name] ?? [])].sort(),
      mentioned.sort(),
      name,
    );
  }
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
