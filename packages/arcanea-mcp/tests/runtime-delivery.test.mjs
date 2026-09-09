import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// ARCANEA_MCP_ENTRY lets this same test exercise the installed tarball.
const entry =
  process.env.ARCANEA_MCP_ENTRY ??
  fileURLToPath(new URL("../dist/cli.js", import.meta.url));
const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

test("CLI help, version and invalid options terminate without starting a transport", () => {
  for (const args of [
    ["--version"],
    ["-v"],
    ["--help"],
    ["-h"],
    ["--transport", "invalid"],
    ["--port", "3100"],
    ["--transport", "http", "--port", "3100oops"],
    ["--port", "0"],
    ["--help", "--transport", "http"],
    ["--transport"],
    ["--transport", "http", "--port", "65536"],
    ["--transport", "stdio", "--transport", "http"],
  ]) {
    const result = spawnSync(process.execPath, [entry, ...args], {
      encoding: "utf8",
      timeout: 5000,
    });
    assert.equal(result.error, undefined, `${args}: ${result.error}`);
    if (["--version", "-v"].includes(args[0]) && args.length === 1) {
      assert.equal(result.status, 0);
      assert.equal(result.stdout.trim(), manifest.version);
      assert.equal(result.stderr, "");
    } else if (["--help", "-h"].includes(args[0]) && args.length === 1) {
      assert.equal(result.status, 0);
      assert.match(result.stdout, /Usage:/);
      assert.equal(result.stderr, "");
    } else {
      assert.equal(result.status, 1, args.join(" "));
      assert.equal(result.stdout, "");
      assert.ok(result.stderr.trim());
    }
  }
});

test(
  "real stdio clients discover tools and restore a saved world after restart",
  { timeout: 25000 },
  async (t) => {
    const directory = mkdtempSync(join(tmpdir(), "arcanea consumer "));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    async function connect() {
      const client = new Client({
        name: "arcanea-delivery-test",
        version: "1.0.0",
      });
      // Deliberately no provider credentials, user home, or repository-specific env.
      const env = Object.fromEntries(
        ["PATH", "Path", "SystemRoot", "TEMP", "TMP"]
          .filter((key) => process.env[key])
          .map((key) => [key, process.env[key]]),
      );
      const transport = new StdioClientTransport({
        command: process.execPath,
        args: [entry],
        env: { ...env, ARCANEA_DATA_DIR: directory },
        stderr: "pipe",
      });
      await client.connect(transport);
      assert.equal(client.getServerVersion().version, manifest.version);
      return client;
    }
    async function call(client, name, args) {
      const result = await client.callTool({ name, arguments: args });
      assert.notEqual(result.isError, true, JSON.stringify(result));
      return JSON.parse(result.content[0].text);
    }
    let client = await connect();
    try {
      const { tools } = await client.listTools();
      assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length);
      for (const name of [
        "generate_character",
        "save_world",
        "load_world",
        "get_world_graph",
        "search_sovereign_depths",
        "search_weight_of_wonders",
      ]) {
        assert.ok(
          tools.some((tool) => tool.name === name),
          name,
        );
      }
      await call(client, "generate_character", {
        sessionId: "consumer-world",
        primaryElement: "Water",
        gatesOpen: 3,
      });
      const saved = await call(client, "save_world", {
        sessionId: "consumer-world",
      });
      assert.equal(saved.nodeCount, 1);
    } finally {
      await client.close();
    }
    client = await connect();
    try {
      const loaded = await call(client, "load_world", {
        sessionId: "consumer-world",
      });
      assert.equal(loaded.loaded, true);
      assert.equal(loaded.nodeCount, 1);
      const world = await call(client, "get_world_graph", {
        sessionId: "consumer-world",
      });
      assert.equal(world.worldSummary.nodeCount, 1);
    } finally {
      await client.close();
    }
  },
);
