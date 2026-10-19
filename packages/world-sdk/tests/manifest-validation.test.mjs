import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { buildManifest, worldId } from "../src/manifest.mjs";
import { validateManifest } from "../src/validate.mjs";
import { scaffoldWorld, createWorld } from "../src/scaffold.mjs";
import { readWorld } from "../src/fs-world.mjs";

const minimal = () => ({
  schemaVersion: "1.0.0",
  id: worldId("manifest-fixture"),
  name: "A creator world",
  creator: { handle: "creator" },
  content: {},
});
const extensions = () => ({
  game: {
    genre: "adventure",
    mechanics: ["Protect the tide gate"],
    proceduralMap: { seed: 7, tiles: [null, true, { depth: 3 }] },
    higgsfieldAssets: {
      characterRefs: ["media/mara.png"],
      customRef: "metadata only",
    },
    memoryInjection: false,
    lastGenerated: "2026-10-12T00:00:00Z",
  },
  memory: {
    vaults: ["character-states"],
    evolution: [{ character_id: "mara", delta: { gate: "closed" } }],
    persistentStates: {
      mara: { knowledge: ["tide gate"], confidence: 0.5, secret: null },
    },
  },
  meaning: {
    pillars: ["History"],
    coreBeliefs: ["Keep a promise"],
    emotionalAnchors: ["Her mother's voice"],
    tensions: ["Duty and grief"],
  },
  community: {
    contributors: [{ id: "creator", consent: false }],
    forks: [],
    contributionPolicy: "CONTRIBUTING.md",
    reputation: { creator: { points: 2 } },
    events: ["gate kept"],
  },
  mapper: {
    version: "1.1.0",
    harnessesUsed: ["codex"],
    outputs: ["book"],
    lastRun: "2026-10-12T00:00:00Z",
  },
});

test("base and v1.1 manifests validate without defaults, coercion or mutation", () => {
  const input = { ...minimal(), schemaVersion: "1.1.0", ...extensions() };
  const before = JSON.stringify(input);
  assert.deepEqual(validateManifest(minimal()), { valid: true, errors: [] });
  assert.deepEqual(validateManifest(input), { valid: true, errors: [] });
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.hasOwn(input, "visibility"), false);
});

test("builder keeps all declared extensions and explicit version; base default stays 1.0.0", () => {
  const extra = extensions();
  const built = buildManifest({
    name: "A creator world",
    schemaVersion: "1.1.0",
    ...extra,
  });
  assert.equal(built.schemaVersion, "1.1.0");
  for (const field of Object.keys(extra))
    assert.deepEqual(built[field], extra[field]);
  assert.equal(validateManifest(built).valid, true);
  assert.equal(buildManifest({ name: "Base world" }).schemaVersion, "1.0.0");
  for (const field of Object.keys(extra))
    assert.equal(
      Object.hasOwn(buildManifest({ name: "Base world" }), field),
      false,
    );
  assert.equal(
    Object.hasOwn(
      buildManifest({ name: "Base world", game: undefined }),
      "game",
    ),
    false,
  );
});

test("invalid v1.1 sections and nested values refuse with actionable paths", () => {
  const cases = [
    ["game", null],
    ["game", []],
    ["game", { genre: "romance" }],
    ["game", { mechanics: [7] }],
    ["game", { memoryInjection: "false" }],
    ["game", { higgsfieldAssets: { characterRefs: [false] } }],
    ["game", { proceduralMap: [] }],
    ["memory", { vaults: [7] }],
    ["memory", { evolution: ["a private event"] }],
    ["memory", { persistentStates: [] }],
    ["meaning", { coreBeliefs: false }],
    ["meaning", { emotionalAnchors: [null] }],
    ["community", { contributors: [null] }],
    ["community", { reputation: [] }],
    ["community", { events: "event" }],
    ["mapper", { version: 1.1 }],
    ["mapper", { lastRun: 0 }],
    ["mapper", { harnessesUsed: [false] }],
    ["mapper", { outputs: {} }],
  ];
  for (const [field, value] of cases) {
    const result = validateManifest({ ...minimal(), [field]: value });
    assert.equal(result.valid, false, JSON.stringify([field, value]));
    assert.ok(result.errors.some((error) => error.includes(`/${field}`)));
  }
});

test("unknown fields refuse at every closed contract node while open JSON state stays valid", () => {
  const examples = [
    { typo: true },
    { creator: { handle: "creator", tyop: true } },
    { visualDna: { typo: true } },
    { theme: { typo: true } },
    { license: { spdx: "PROPRIETARY", typo: true } },
    { royalty: { typo: true } },
    { royalty: { splits: [{ to: "creator", bps: 10000, typo: true }] } },
    {
      agents: [{ id: "author", role: "author", harness: "codex", typo: true }],
    },
    { index: { typo: true } },
    { snapshot: { typo: true } },
    {
      provenance: [
        {
          contentHash: "sha256:" + "a".repeat(64),
          chain: "other",
          timestamp: "2026-10-12T00:00:00Z",
          typo: true,
        },
      ],
    },
    ...["game", "memory", "meaning", "community", "mapper"].map((field) => ({
      [field]: { typo: true },
    })),
  ];
  for (const example of examples)
    assert.equal(
      validateManifest({ ...minimal(), ...example }).valid,
      false,
      JSON.stringify(example),
    );
  assert.equal(
    validateManifest({
      ...minimal(),
      content: { custom: "custom/" },
      ...extensions(),
    }).valid,
    true,
  );
  assert.equal(
    validateManifest({ ...minimal(), content: { custom: false } }).valid,
    false,
  );
});

test("core fields and nested records obey schema types and bounds", () => {
  const invalid = [
    { name: "x" },
    { name: "a".repeat(81) },
    { id: 7 },
    { schemaVersion: 1 },
    { tagline: "a".repeat(201) },
    { genesisPrompt: "a".repeat(501) },
    { premise: "a".repeat(2001) },
    { laws: "rules" },
    { laws: [true] },
    { laws: Array(8).fill("rule") },
    { creator: [] },
    { creator: { handle: false } },
    { creator: { handle: "creator", wallet: 7 } },
    { content: [] },
    { content: { books: null } },
    { cover: 1 },
    { visualDna: { palette: ["not-a-colour"] } },
    { visualDna: { motifs: [1] } },
    { theme: { audio: true } },
    { license: { spdx: "PROPRIETARY", commercial: "true" } },
    { license: { spdx: "PROPRIETARY", remix: "anything" } },
    { royalty: { splits: [{ to: "creator", bps: 9999 }] } },
    { royalty: { splits: [{ to: "creator", bps: "10000" }] } },
    { agents: false },
    { agents: [{ id: "author", role: "author", harness: "hermes" }] },
    { index: { dim: 0.5 } },
    { provenance: false },
    { snapshot: { ipfs: false } },
  ];
  for (const update of invalid)
    assert.equal(
      validateManifest({ ...minimal(), ...update }).valid,
      false,
      JSON.stringify(update),
    );
  assert.equal(
    validateManifest({
      ...minimal(),
      agents: [{ id: "author", role: "author", harness: "grok" }],
    }).valid,
    true,
  );
});

test("string bounds count Unicode code points, and optional null differs from absence", () => {
  assert.equal(
    validateManifest({ ...minimal(), name: "\u{1f409}" }).valid,
    false,
  );
  assert.equal(
    validateManifest({ ...minimal(), name: "\u{1f409}".repeat(80) }).valid,
    true,
  );
  assert.equal(
    validateManifest({ ...minimal(), name: "\u{1f409}".repeat(81) }).valid,
    false,
  );
  for (const field of [
    "game",
    "license",
    "laws",
    "index",
    "visibility",
    "snapshot",
  ]) {
    assert.equal(
      validateManifest({ ...minimal(), [field]: null }).valid,
      false,
    );
  }
});

test("non-JSON data, cycles and accessors refuse without mutating or invoking a getter", () => {
  let reads = 0;
  const accessor = {};
  Object.defineProperty(accessor, "private", {
    enumerable: true,
    get() {
      reads++;
      throw new Error("private");
    },
  });
  const cycle = {};
  cycle.self = cycle;
  for (const value of [
    NaN,
    Infinity,
    undefined,
    () => {},
    1n,
    new Date(),
    new Map(),
    cycle,
    accessor,
    Array(1),
  ]) {
    const result = validateManifest({
      ...minimal(),
      memory: { persistentStates: { value } },
    });
    assert.equal(result.valid, false);
  }
  assert.equal(reads, 0);
  for (const value of [null, [], "world", 7, true, undefined])
    assert.equal(validateManifest(value).valid, false);
});

test("scaffold/read preserves creator extensions, and actual validate CLI rejects then recovers", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "arcanea-manifest-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const spec = {
    name: "A creator world",
    schemaVersion: "1.1.0",
    ...extensions(),
  };
  await scaffoldWorld(dir, spec, { useWorldEngine: false });
  const world = await readWorld(dir);
  assert.equal(world.manifest.schemaVersion, "1.1.0");
  for (const field of Object.keys(extensions()))
    assert.deepEqual(world.manifest[field], spec[field]);
  const manifestPath = path.join(dir, "world.arcanea.json");
  const validBytes = await fs.readFile(manifestPath);
  const invalid = JSON.parse(validBytes);
  invalid.mapper.outputs = "book";
  const invalidBytes = Buffer.from(JSON.stringify(invalid));
  await fs.writeFile(manifestPath, invalidBytes);
  const cli = fileURLToPath(new URL("../bin/cli.mjs", import.meta.url));
  await assert.rejects(
    promisify(execFile)(process.execPath, [cli, "validate", dir], {
      timeout: 5000,
    }),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stdout, /INVALID/);
      assert.match(error.stdout, /\/mapper\/outputs/);
      return true;
    },
  );
  assert.deepEqual(await fs.readFile(manifestPath), invalidBytes);
  await fs.writeFile(manifestPath, validBytes);
  const result = await promisify(execFile)(
    process.execPath,
    [cli, "validate", dir],
    { timeout: 5000 },
  );
  assert.equal(result.stdout.trim(), "valid world manifest");
  assert.deepEqual(await fs.readFile(manifestPath), validBytes);
});

test("scaffold rejects invalid creator extensions before creating an absent destination", async (t) => {
  const parent = await fs.mkdtemp(
    path.join(os.tmpdir(), "arcanea-invalid-manifest-"),
  );
  t.after(() => fs.rm(parent, { recursive: true, force: true }));
  await assert.rejects(
    scaffoldWorld(
      path.join(parent, "world"),
      { name: "A creator world", game: { genre: 42 } },
      { useWorldEngine: false },
    ),
    { code: "ERR_ARCANEA_WORLD_MANIFEST" },
  );
  assert.deepEqual(await fs.readdir(parent), []);
});

test("scaffold rejects invalid creator extensions without overwriting existing creator work", async (t) => {
  const dir = await fs.mkdtemp(
    path.join(os.tmpdir(), "arcanea-kept-manifest-"),
  );
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const sentinel = Buffer.from("Creator work remains here.\n");
  await fs.writeFile(path.join(dir, "README.md"), sentinel);
  await assert.rejects(
    scaffoldWorld(
      dir,
      { name: "A creator world", mapper: { typo: "private fixture payload" } },
      { useWorldEngine: false },
    ),
    { code: "ERR_ARCANEA_WORLD_MANIFEST" },
  );
  assert.deepEqual(await fs.readdir(dir), ["README.md"]);
  assert.deepEqual(await fs.readFile(path.join(dir, "README.md")), sentinel);
});

test("createWorld refuses malformed synthetic model extensions and succeeds after creator repair", async (t) => {
  const parent = await fs.mkdtemp(
    path.join(os.tmpdir(), "arcanea-model-manifest-"),
  );
  t.after(() => fs.rm(parent, { recursive: true, force: true }));
  const dir = path.join(parent, "world");
  const spec = {
    name: "A creator world",
    schemaVersion: "1.1.0",
    game: { genre: 42 },
  };
  await assert.rejects(
    createWorld(dir, "A tide gate", {
      llm: async () => spec,
      useWorldEngine: false,
    }),
    { code: "ERR_ARCANEA_WORLD_MANIFEST" },
  );
  assert.deepEqual(await fs.readdir(parent), []);
  const repaired = { ...spec, game: { genre: "adventure" } };
  const result = await createWorld(dir, "A tide gate", {
    llm: async () => repaired,
    useWorldEngine: false,
  });
  assert.equal(result.manifest.game.genre, "adventure");
  assert.equal(validateManifest((await readWorld(dir)).manifest).valid, true);
});
