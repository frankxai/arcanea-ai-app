import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { createWorld } from "../src/scaffold.mjs";
import { readWorld } from "../src/fs-world.mjs";
import { validateManifest } from "../src/validate.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { buildIndex } from "../src/index-build.mjs";
import { handlePush, verifySignature } from "../src/webhook.mjs";
import { assignmentsFor, addCharacter } from "../src/harness.mjs";
import { claimWorldProof, mockChain } from "../src/proof.mjs";
import {
  recordMemory,
  listMemories,
  distillOffline,
} from "../src/evolution.mjs";
import { evolve, evolveCharacter } from "../src/index.mjs";

const SENTENCE = "a drowned city where memory is currency";
const NOW = "2026-06-07T00:00:00.000Z";
const opts = {
  idSeed: SENTENCE,
  creator: { handle: "frankx" },
  useWorldEngine: false,
};

const tmp = () => fs.mkdtemp(path.join(os.tmpdir(), "arcanea-world-"));

test("genesis -> scaffold produces a valid, conforming world", async () => {
  const dir = await tmp();
  const { manifest } = await createWorld(dir, SENTENCE, opts);
  assert.match(manifest.id, /^wld_[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(manifest.genesisPrompt, SENTENCE);
  assert.equal(manifest.laws.length, 3);
  const { valid, errors } = validateManifest(manifest);
  assert.ok(valid, "manifest invalid: " + errors.join("; "));

  const world = await readWorld(dir);
  const paths = world.files.map((f) => f.path);
  assert.ok(
    paths.some((p) => p.startsWith("canon/")),
    "has canon",
  );
  assert.ok(
    paths.some((p) => p.startsWith("characters/")),
    "has characters",
  );
  assert.ok(paths.includes("licenses/royalty.json"), "has royalty policy");
});

test("scaffold + content hash are deterministic for a given seed", async () => {
  const d1 = await tmp();
  const d2 = await tmp();
  const a = await createWorld(d1, SENTENCE, opts);
  const b = await createWorld(d2, SENTENCE, opts);
  assert.equal(a.manifest.id, b.manifest.id);
  const ha = contentHash((await readWorld(d1)).files, a.manifest);
  const hb = contentHash((await readWorld(d2)).files, b.manifest);
  assert.match(ha, /^sha256:[0-9a-f]{64}$/);
  assert.equal(ha, hb, "content hash must be reproducible");
});

test("private content is excluded from the content hash", async () => {
  const dir = await tmp();
  const { manifest } = await createWorld(dir, SENTENCE, opts);
  const base = contentHash((await readWorld(dir)).files, manifest);
  await addCharacter(dir, {
    name: "Secret Keeper",
    visibility: "private",
    persona: "hidden",
  });
  const withPrivate = contentHash((await readWorld(dir)).files, manifest);
  assert.equal(
    base,
    withPrivate,
    "private files must not change the public content hash",
  );
});

test("index build yields world + character nodes and embed-ready chunks", async () => {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);
  const idx = buildIndex(await readWorld(dir));
  assert.equal(idx.embedding.dim, 768);
  assert.ok(
    idx.nodes.find((n) => n.type === "world"),
    "world node",
  );
  assert.ok(
    idx.nodes.some((n) => n.type === "character"),
    "character node",
  );
  assert.ok(idx.chunks.length > 0, "has chunks");
});

test("harness adapter resolves assignments from the manifest", async () => {
  const dir = await tmp();
  const { manifest } = await createWorld(dir, SENTENCE, opts);
  const claudeJobs = assignmentsFor(manifest, "claude");
  assert.ok(
    claudeJobs.some((a) => a.id === "lore-keeper"),
    "claude gets lore-keeper",
  );
  assert.ok(
    claudeJobs.some((a) => a.harness === "any"),
    "claude also sees 'any' agents",
  );
});

test("push webhook rebuilds the index (with signature verification)", async () => {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);
  const world = await readWorld(dir);

  const secret = "shh";
  const body = JSON.stringify({
    after: "abc123",
    repository: { full_name: "frankx/drowned" },
  });
  const sig =
    "sha256=" +
    (await import("node:crypto"))
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
  assert.ok(verifySignature(secret, body, sig), "signature verifies");

  let persisted = null;
  const res = await handlePush({
    rawBody: body,
    signature: sig,
    secret,
    loadWorld: async () => world,
    persistIndex: async (index, meta) => {
      persisted = { index, meta };
    },
  });
  assert.ok(res.ok);
  assert.equal(res.sha, "abc123");
  assert.ok(res.chunks > 0);
  assert.equal(persisted.meta.repo, "frankx/drowned");
});

test("claim proof appends provenance; content hash stable across claim", async () => {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);

  const before = await readWorld(dir);
  const hashBefore = contentHash(before.files, before.manifest);

  const res = await claimWorldProof({
    dir,
    adapter: mockChain("solana"),
    now: NOW,
  });
  assert.match(res.contentHash, /^sha256:[0-9a-f]{64}$/);
  assert.equal(res.entry.chain, "solana");
  assert.equal(res.entry.standard, "metaplex-core");
  assert.equal(res.manifest.provenance.length, 1);
  assert.ok(res.wallet.startsWith("So1"), "embedded wallet minted");

  const after = await readWorld(dir);
  const hashAfter = contentHash(after.files, after.manifest);
  assert.equal(
    hashBefore,
    hashAfter,
    "provenance + wallet excluded from content hash",
  );
  assert.ok(
    validateManifest(after.manifest).valid,
    "manifest valid after claim",
  );
});

test("recordMemory writes to .arcanea/memories (never affects public content hash)", async () => {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);
  const before = await readWorld(dir);
  const h0 = contentHash(before.files, before.manifest);
  await recordMemory(dir, {
    characterId: "sister-lethe",
    content: "She opened the tide-gate for a dying diver.",
    salience: 0.9,
  });
  await recordMemory(dir, {
    content: "She spoke her mother's voice and did not sell it.",
    salience: 0.85,
    meaningImpact: "core",
  });
  const mems = await listMemories(dir);
  assert.equal(mems.length, 2);
  const after = await readWorld(dir);
  const h1 = contentHash(after.files, after.manifest);
  assert.equal(h0, h1, "memories in .arcanea/ must not move the public hash");
  const d = distillOffline(mems);
  assert.ok(
    d.includes("tide-gate") || d.includes("mother"),
    "distill produces salient summary",
  );
});

async function worldSnapshot(dir) {
  const world = await readWorld(dir);
  return {
    files: world.files
      .map((file) => ({ path: file.path, bytes: file.bytes.toString("hex") }))
      .sort((a, b) => a.path.localeCompare(b.path)),
    publicHash: contentHash(world.files, world.manifest),
    publicIndex: buildIndex(world),
  };
}

test("exported evolution helpers refuse memory-to-canon promotion and preserve the world", async (t) => {
  const dir = await tmp();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  await createWorld(dir, SENTENCE, opts);
  const w0 = await readWorld(dir);
  const firstChar = w0.files.find((f) => f.path.startsWith("characters/"));
  assert.ok(firstChar, "fixture includes a real character");
  const slug = firstChar.path.split("/")[1].replace(/\.md$/, "");
  await recordMemory(dir, {
    characterId: slug,
    content: "A private choice that has not been approved as canon.",
    ts: NOW,
  });
  const before = await worldSnapshot(dir);
  const memories = await listMemories(dir);
  for (const promote of [evolveCharacter, evolve]) {
    for (const options of [
      {},
      {
        summary: "Publish this.",
        approved: true,
        canonApproval: { approved: true },
      },
    ]) {
      await assert.rejects(promote(dir, slug, options), {
        code: "ERR_ARCANEA_HUMAN_PROMOTION_REQUIRED",
      });
      assert.deepEqual(
        await worldSnapshot(dir),
        before,
        "all world and memory bytes, public hash and index stay unchanged",
      );
      assert.deepEqual(await listMemories(dir), memories);
    }
  }
});

test("evolution refuses before accessing paths or caller-supplied approval options", async (t) => {
  const parent = await tmp();
  t.after(() => fs.rm(parent, { recursive: true, force: true }));
  const absent = path.join(parent, "missing-world");
  const poisonedOptions = new Proxy(
    {},
    {
      get() {
        throw new Error("caller options must not be read");
      },
    },
  );
  for (const promote of [evolveCharacter, evolve]) {
    await assert.rejects(promote(absent, "../../escape", poisonedOptions), {
      code: "ERR_ARCANEA_HUMAN_PROMOTION_REQUIRED",
    });
    await assert.rejects(promote(null, undefined, null), {
      code: "ERR_ARCANEA_HUMAN_PROMOTION_REQUIRED",
    });
  }
  assert.deepEqual(
    await fs.readdir(parent),
    [],
    "no missing world or escaped file is created",
  );
});

test("actual evolve CLI exits with an actionable refusal and preserves private memory", async (t) => {
  const dir = await tmp();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  await createWorld(dir, SENTENCE, opts);
  await recordMemory(dir, {
    characterId: "sister-lethe",
    content: "This memory remains private.",
    ts: NOW,
  });
  const before = await worldSnapshot(dir);
  const cli = fileURLToPath(new URL("../bin/cli.mjs", import.meta.url));
  await assert.rejects(
    promisify(execFile)(
      process.execPath,
      [cli, "evolve", "sister-lethe", dir],
      {
        timeout: 5000,
        maxBuffer: 8192,
      },
    ),
    (error) => {
      assert.equal(error.code, 1);
      assert.equal(error.stdout, "");
      assert.match(error.stderr, /ERR_ARCANEA_HUMAN_PROMOTION_REQUIRED/);
      assert.match(error.stderr, /scene/);
      assert.doesNotMatch(error.stderr, /new canon:/);
      return true;
    },
  );
  assert.deepEqual(await worldSnapshot(dir), before);
});
