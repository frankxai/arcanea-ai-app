import { after, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

const directory = mkdtempSync(path.join(tmpdir(), "arcanea identity "));
assert.ok(
  realpathSync(directory).startsWith(realpathSync(tmpdir()) + path.sep),
);
const previousData = process.env.ARCANEA_DATA_DIR;
process.env.ARCANEA_DATA_DIR = directory;
after(() => {
  if (previousData === undefined) delete process.env.ARCANEA_DATA_DIR;
  else process.env.ARCANEA_DATA_DIR = previousData;
  rmSync(directory, { recursive: true, force: true });
});

const { createServer } = await import("../dist/index.js");
const { getGraphNodes, getGraphEdges, restoreGraph } =
  await import("../dist/tools/creation-graph.js");
const { getOrCreateSession } = await import("../dist/memory/index.js");
const {
  createAgentTasks,
  getTask,
  orchestrateCreativeSession,
  getSessionStatus,
} = await import("../dist/agents/orchestrator.js");

test("a frozen clock cannot lose generated creations or their saved relationships", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: 1788976800000 });
  const server = createServer();
  const client = new Client({
    name: "creation-identity-test",
    version: "1.0.0",
  });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  t.after(async () => {
    await client.close();
    await server.close();
  });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  async function call(name, args) {
    const result = await client.callTool({ name, arguments: args });
    assert.notEqual(result.isError, true, JSON.stringify(result));
    return JSON.parse(result.content[0].text);
  }
  const sessionId = "frozen-creation-world";
  const requests = [
    ["generate_character", { primaryElement: "Water", gatesOpen: 3 }],
    ["generate_location", { dominantElement: "Water" }],
    ["generate_creature", { element: "Water" }],
    ["generate_artifact", { element: "Water" }],
  ];
  for (let batch = 0; batch < 3; batch++) {
    await Promise.all(
      requests.map(([name, args]) => call(name, { ...args, sessionId })),
    );
  }
  // Compare the persisted JSON representation; optional undefined fields are omitted.
  const nodes = JSON.parse(JSON.stringify(getGraphNodes(sessionId)));
  const edges = JSON.parse(JSON.stringify(getGraphEdges(sessionId)));
  assert.equal(nodes.length, 12);
  assert.equal(new Set(nodes.map((node) => node.id)).size, 12);
  assert.equal(new Set(nodes.map((node) => node.createdAt)).size, 1);
  assert.equal(getOrCreateSession(sessionId).creations.length, 12);
  assert.deepEqual(
    new Set(nodes.map((node) => node.type)),
    new Set(["character", "location", "creature", "artifact"]),
  );
  assert.ok(edges.length > 0);
  assert.ok(
    edges.every(
      (edge) =>
        nodes.some((node) => node.id === edge.sourceId) &&
        nodes.some((node) => node.id === edge.targetId),
    ),
  );
  const saved = await call("save_world", { sessionId });
  assert.equal(saved.nodeCount, 12);
  restoreGraph(sessionId, [], []);
  const loaded = await call("load_world", { sessionId });
  assert.equal(loaded.loaded, true);
  assert.deepEqual(getGraphNodes(sessionId), nodes);
  assert.deepEqual(getGraphEdges(sessionId), edges);
});

test("same-clock planning tasks remain separately addressable", (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: 1788976800000 });
  const decision = {
    phase: "delegation",
    action: "build_world",
    agents: ["worldsmith"],
    parallel: false,
    reasoning: "identity fixture",
  };
  const first = createAgentTasks(decision, "First request", "same-world")[0];
  const second = createAgentTasks(decision, "Second request", "same-world")[0];
  assert.ok(first && second);
  assert.notEqual(first.id, second.id);
  assert.equal(getTask(first.id), first);
  assert.equal(getTask(second.id), second);
});

test("same-clock planning sessions remain separately addressable", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: 1788976800000 });
  // The current planner returns scaffolding; this does not launch an AI agent.
  const first = await orchestrateCreativeSession(
    "Plan a character",
    "first-world",
  );
  const second = await orchestrateCreativeSession(
    "Plan a character",
    "second-world",
  );
  assert.notEqual(first.session.id, second.session.id);
  assert.equal(getSessionStatus(first.session.id), first.session);
  assert.equal(getSessionStatus(second.session.id), second.session);
});
