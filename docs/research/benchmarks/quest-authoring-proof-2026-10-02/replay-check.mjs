// Diagnostic for this one authoring fixture. Not a game engine or world contract.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
assert(
  args.every((arg) => arg === "--verify-source"),
  "Only --verify-source is supported",
);
const read = (name) => readFileSync(new URL(name, import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const manifest = JSON.parse(read("source-manifest.json"));
const bytes = read("encounter.json");
const cases = JSON.parse(read("replay-cases.json"));
const bind = (input) =>
  assert.equal(
    hash(input),
    manifest.packetSha256,
    "Packet byte drift; re-review required",
  );
bind(bytes);
const packet = JSON.parse(bytes);
const scalar = (value) =>
  typeof value === "string" ||
  typeof value === "boolean" ||
  (typeof value === "number" && Number.isFinite(value));
const safeId = (value) =>
  typeof value === "string" &&
  /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value) &&
  !["constructor", "prototype", "__proto__"].includes(value);
const index = (items, key) => {
  assert(Array.isArray(items));
  const result = new Map();
  for (const item of items) {
    assert(safeId(item[key]), "Invalid local identifier");
    assert(!result.has(item[key]), "Duplicate local identifier");
    result.set(item[key], item);
  }
  return result;
};
function inspect(input) {
  assert(input.states.length <= 14, "Bounded fixture only");
  const states = index(input.states, "id");
  const variables = index(input.variables, "id");
  const transitions = index(input.transitions, "id");
  const endings = index(input.endings, "state");
  assert(states.has(input.start));
  for (const variable of variables.values()) assert(scalar(variable.initial));
  for (const state of states.values()) {
    assert.equal(typeof state.text, "string");
    for (const line of state.dialogue) {
      assert(
        manifest.actors.includes(line.speaker),
        "Unknown source-local speaker",
      );
      assert.equal(typeof line.text, "string");
    }
  }
  for (const transition of transitions.values()) {
    assert(
      states.has(transition.from) && states.has(transition.to),
      "Unknown state target",
    );
    assert.equal(transition.when, true, "No expression/predicate evaluator");
    assert.equal(typeof transition.action, "string");
    assert(
      transition.set &&
        typeof transition.set === "object" &&
        !Array.isArray(transition.set),
    );
    for (const [key, value] of Object.entries(transition.set)) {
      assert(variables.has(key), "Unknown variable");
      assert(
        !manifest.readonlyVariables.includes(key),
        "Readonly variable write",
      );
      assert(
        scalar(value) && typeof value === typeof variables.get(key).initial,
        "Variable type changed",
      );
    }
  }
  for (const ending of endings.values()) {
    assert(states.has(ending.state));
    assert.equal(typeof ending.result, "string");
    assert(
      !input.transitions.some((t) => t.from === ending.state),
      "Ending has outgoing action",
    );
  }
  const initial = {
    state: input.start,
    variables: Object.fromEntries(
      input.variables.map((v) => [v.id, v.initial]),
    ),
  };
  const move = (snapshot, action) => {
    const transition = transitions.get(action);
    if (
      !transition ||
      transition.from !== snapshot.state ||
      endings.has(snapshot.state)
    )
      return { accepted: false, snapshot: structuredClone(snapshot) };
    return {
      accepted: true,
      snapshot: {
        state: transition.to,
        variables: { ...snapshot.variables, ...transition.set },
      },
    };
  };
  const walk = (snapshot, actions = [], visited = new Set()) => {
    assert(
      !visited.has(snapshot.state),
      "Cycle unsupported in this finite fixture",
    );
    if (endings.has(snapshot.state)) return [{ ...snapshot, actions }];
    const available = input.transitions.filter(
      (t) => t.from === snapshot.state,
    );
    assert(available.length, "Nonterminal dead end");
    const nextVisited = new Set([...visited, snapshot.state]);
    return available.flatMap((t) =>
      walk(move(snapshot, t.id).snapshot, [...actions, t.id], nextVisited),
    );
  };
  const paths = walk(initial);
  const reached = new Set(
    paths.flatMap((path) => [
      input.start,
      ...path.actions.map((id) => transitions.get(id).to),
    ]),
  );
  assert.equal(reached.size, states.size, "Unreachable state");
  assert.equal(
    new Set(paths.map((path) => path.state)).size,
    endings.size,
    "Unreachable ending",
  );
  return { initial, move, paths };
}
const diagnostic = inspect(packet);
assert.equal(diagnostic.paths.length, 6);
for (const expected of cases.paths) {
  let snapshot = structuredClone(diagnostic.initial);
  for (const action of expected.actions) {
    const result = diagnostic.move(snapshot, action);
    assert(result.accepted);
    snapshot = result.snapshot;
  }
  assert.equal(snapshot.state, expected.expectedState);
  assert.deepEqual(snapshot.variables, expected.expectedVariables);
  assert.equal(snapshot.variables.destination, "Atlantean");
  assert.equal(snapshot.variables.historicalFileChanged, false);
  assert.equal(snapshot.variables.notesScope, "new-kael-observations-only");
  assert.equal(snapshot.variables.notesSharingAllowed, false);
  assert.equal(snapshot.variables.notesRevocable, true);
  assert.equal(snapshot.variables.stopAgreement, true);
}
for (const denial of cases.denials) {
  let snapshot = structuredClone(diagnostic.initial);
  for (const action of denial.prefix)
    snapshot = diagnostic.move(snapshot, action).snapshot;
  const before = structuredClone(snapshot);
  const result = diagnostic.move(snapshot, denial.action);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.snapshot, before);
  assert.deepEqual(snapshot, before);
}
assert.deepEqual(
  inspect(packet).initial,
  diagnostic.initial,
  "Fresh diagnostic reset",
);
assert.deepEqual(JSON.parse(bytes), packet, "Original configuration preserved");
const mutations = [
  (p) => {
    p.transitions[0].when = "true || malicious()";
  },
  (p) => {
    p.transitions[0].to = "missing";
  },
  (p) => {
    p.transitions[0].set.destination = "Draconian";
  },
  (p) => {
    p.transitions[0].set.undeclared = true;
  },
  (p) => {
    p.transitions[0].to = p.start;
  },
];
for (const mutate of mutations) {
  const changed = structuredClone(packet);
  mutate(changed);
  assert.throws(() => inspect(changed));
}
assert.throws(
  () => bind(Buffer.concat([bytes, Buffer.from(" ")])),
  /Packet byte drift/,
);
let sourceChecks = 0;
if (args.includes("--verify-source")) {
  assert.match(manifest.sourceCommit, /^[0-9a-f]{40}$/);
  const cwd = fileURLToPath(new URL("../../../../", import.meta.url));
  const gitBlob = (revision, path) =>
    execFileSync(
      "git",
      ["--no-replace-objects", "cat-file", "blob", `${revision}:${path}`],
      { cwd, timeout: 10000, maxBuffer: 2 * 1024 * 1024 },
    );
  for (const [path, expected] of Object.entries(manifest.sourceHashes)) {
    assert.equal(
      hash(gitBlob(manifest.sourceCommit, path)),
      expected,
      `Pinned source drift: ${path}`,
    );
    sourceChecks++;
  }
  for (const path of manifest.mainEquivalentSources) {
    assert.equal(
      hash(gitBlob("HEAD", path)),
      manifest.sourceHashes[path],
      `Current source drift: ${path}`,
    );
    sourceChecks++;
  }
  assert.throws(() =>
    assert.equal(
      hash(Buffer.from("changed locked fact")),
      manifest.sourceHashes[".arcanea/lore/CANON_LOCKED.md"],
    ),
  );
}
console.log(
  JSON.stringify(
    {
      scope:
        "Finite fixture diagnostic; not game import/playtest or signed canon authority",
      packetSha256: manifest.packetSha256,
      states: packet.states.length,
      transitions: packet.transitions.length,
      endings: diagnostic.paths.length,
      deniedActions: cases.denials.length,
      mutationRefusals: mutations.length + 1,
      reset: "in-memory initial snapshot only",
      sourceChecks,
      paths: diagnostic.paths,
    },
    null,
    2,
  ),
);
