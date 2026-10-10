import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  saveWorldToDisk,
  loadWorldFromDisk,
  listSavedWorlds,
} from "../dist/tools/world-persistence.js";
import {
  restoreGraph,
  getGraphNodes,
  getGraphEdges,
} from "../dist/tools/creation-graph.js";
import { getDataDirectory } from "../dist/storage-paths.js";

const nodes = ["one", "two"].map((id) => ({
  id,
  name: id,
  type: "character",
  createdAt: "2026-09-09T00:00:00.000Z",
  metadata: { detail: id },
}));
const edges = [
  {
    id: "relationship",
    sourceId: "one",
    targetId: "two",
    relationship: "allies_with",
    strength: 0.5,
  },
];

test("saved worlds survive restoration and reject damaged snapshots without changing data", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "arcanea world persistence "));
  const previous = process.env.ARCANEA_DATA_DIR;
  process.env.ARCANEA_DATA_DIR = directory;
  t.after(() => {
    if (previous === undefined) delete process.env.ARCANEA_DATA_DIR;
    else process.env.ARCANEA_DATA_DIR = previous;
    rmSync(directory, { recursive: true, force: true });
  });
  assert.equal(getDataDirectory(), directory);
  assert.equal(loadWorldFromDisk("missing"), null);
  const saved = saveWorldToDisk("my-world", nodes, edges);
  assert.equal(saved.filePath, join(directory, "worlds", "my-world.json"));
  const before = readFileSync(saved.filePath, "utf8");
  const snapshot = loadWorldFromDisk("my-world");
  assert.deepEqual(snapshot.nodes, nodes);
  assert.deepEqual(snapshot.edges, edges);
  assert.equal(listSavedWorlds()[0].sessionId, "my-world");
  restoreGraph("restore-test", snapshot.nodes, snapshot.edges);
  assert.deepEqual(getGraphNodes("restore-test"), nodes);
  assert.deepEqual(getGraphEdges("restore-test"), edges);
  assert.throws(
    () =>
      restoreGraph("restore-test", nodes, [
        { ...edges[0], targetId: "absent" },
      ]),
    /missing creation/,
  );
  assert.deepEqual(getGraphEdges("restore-test"), edges);
  assert.throws(
    () => saveWorldToDisk("my-world", [...nodes, nodes[0]], edges),
    /duplicate/,
  );
  assert.equal(readFileSync(saved.filePath, "utf8"), before);
  for (const id of ["../escape", "a/b", "a.b", "", "con", "A".repeat(129)]) {
    assert.throws(() => saveWorldToDisk(id, nodes, edges), /session id/);
    assert.throws(() => loadWorldFromDisk(id), /session id/);
  }
  assert.deepEqual(readdirSync(join(directory, "worlds")), ["my-world.json"]);
  for (const damage of [
    "{",
    JSON.stringify({ ...snapshot, sessionId: "wrong" }),
    JSON.stringify({ ...snapshot, nodes: [{ id: "one" }] }),
  ]) {
    writeFileSync(saved.filePath, damage);
    assert.throws(() => loadWorldFromDisk("my-world"), /unreadable or invalid/);
    assert.throws(() => listSavedWorlds(), /unreadable or invalid/);
    assert.throws(
      () => saveWorldToDisk("my-world", nodes, edges),
      /unreadable or invalid/,
    );
    assert.equal(readFileSync(saved.filePath, "utf8"), damage);
  }
  process.env.ARCANEA_DATA_DIR = "relative";
  assert.throws(() => getDataDirectory(), /absolute/);
});
