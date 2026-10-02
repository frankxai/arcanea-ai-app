import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { buildManifest } from "../src/manifest.mjs";
import { createWorld, scaffoldWorld } from "../src/scaffold.mjs";
import { readWorld } from "../src/fs-world.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { computeProof } from "../src/proof.mjs";
import { evolve, evolveCharacter } from "../src/evolution.mjs";

const run = promisify(execFile);
const cli = fileURLToPath(new URL("../bin/cli.mjs", import.meta.url));
const sentence = "a drowned city where memory is currency";
const licence = { spdx: "CC-BY-4.0", commercial: false, remix: "deny" };
const royalty = { splits: [{ to: "creator", bps: 10000 }] };

async function fixture(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "arcanea-sdk-policy-"));
  t.after(async () => {
    assert.equal(path.dirname(dir), path.resolve(os.tmpdir()));
    assert.ok(path.basename(dir).startsWith("arcanea-sdk-policy-"));
    await fs.rm(dir, { recursive: true, force: true });
  });
  return dir;
}

test("manifest construction leaves content rights and royalties unselected", () => {
  const manifest = buildManifest({ name: "Tideglass" });
  assert.equal(Object.hasOwn(manifest, "license"), false);
  assert.equal(Object.hasOwn(manifest, "royalty"), false);
});

test("scaffold writes no licence or royalty files without explicit policies", async (t) => {
  const dir = await fixture(t);
  const { manifest } = await createWorld(dir, sentence, {
    useWorldEngine: false,
  });
  assert.equal(Object.hasOwn(manifest, "license"), false);
  assert.equal(Object.hasOwn(manifest, "royalty"), false);
  await assert.rejects(fs.stat(path.join(dir, "licenses")), { code: "ENOENT" });
});

test("explicit caller policies survive scaffolding without invented file pointers", async (t) => {
  const dir = await fixture(t);
  const manifest = await scaffoldWorld(
    dir,
    { name: "Tideglass", license: licence, royalty },
    { useWorldEngine: false },
  );
  assert.deepEqual(manifest.license, licence);
  assert.deepEqual(manifest.royalty, royalty);
  await assert.rejects(fs.stat(path.join(dir, "licenses")), { code: "ENOENT" });
  const proof = computeProof({ manifest, hash: "sha256:" + "0".repeat(64) });
  assert.equal(Object.hasOwn(proof, "licensePointer"), false);
  assert.equal(Object.hasOwn(proof, "royaltyPolicy"), false);
});

test("proof does not invent policy pointers when rights are unselected", () => {
  const proof = computeProof({
    manifest: buildManifest({ name: "Tideglass" }),
    hash: "sha256:" + "0".repeat(64),
  });
  assert.equal(Object.hasOwn(proof, "licensePointer"), false);
  assert.equal(Object.hasOwn(proof, "royaltyPolicy"), false);
});

test("model output cannot select commercial rights or royalties for createWorld", async (t) => {
  const dir = await fixture(t);
  const { manifest } = await createWorld(dir, sentence, {
    useWorldEngine: false,
    llm: async () => ({ license: licence, royalty }),
  });
  assert.equal(Object.hasOwn(manifest, "license"), false);
  assert.equal(Object.hasOwn(manifest, "royalty"), false);
});

test("createWorld preserves policies explicitly supplied by the caller", async (t) => {
  const dir = await fixture(t);
  const { manifest } = await createWorld(dir, sentence, {
    useWorldEngine: false,
    license: licence,
    royalty,
  });
  assert.deepEqual(manifest.license, licence);
  assert.deepEqual(manifest.royalty, royalty);
});

test("explicit standard policy pointers generate only the declared summaries", async (t) => {
  const dir = await fixture(t);
  const explicitLicence = { ...licence, pointer: "licenses/LICENSE.md" };
  const explicitRoyalty = { ...royalty, policy: "licenses/royalty.json" };
  const { manifest } = await createWorld(dir, sentence, {
    useWorldEngine: false,
    license: explicitLicence,
    royalty: explicitRoyalty,
  });
  assert.deepEqual(manifest.license, explicitLicence);
  assert.deepEqual(manifest.royalty, explicitRoyalty);
  const summary = await fs.readFile(
    path.join(dir, "licenses/LICENSE.md"),
    "utf8",
  );
  assert.match(summary, /Commercial: false/);
  assert.match(summary, /Remix: deny/);
  assert.match(summary, /does not include the licence text/);
  assert.deepEqual(
    JSON.parse(
      await fs.readFile(path.join(dir, "licenses/royalty.json"), "utf8"),
    ),
    explicitRoyalty,
  );
  const proof = computeProof({ manifest, hash: "sha256:" + "0".repeat(64) });
  assert.equal(proof.licensePointer, explicitLicence.pointer);
  assert.equal(proof.royaltyPolicy, explicitRoyalty.policy);
});

test("custom policy pointers remain metadata and cannot escape through scaffold writes", async (t) => {
  const root = await fixture(t);
  const dir = path.join(root, "world");
  const manifest = await scaffoldWorld(
    dir,
    {
      name: "Tideglass",
      license: { ...licence, pointer: "../licence.md" },
      royalty: { ...royalty, policy: "../royalty.json" },
    },
    { useWorldEngine: false },
  );
  assert.equal(manifest.license.pointer, "../licence.md");
  assert.equal(manifest.royalty.policy, "../royalty.json");
  await assert.rejects(fs.stat(path.join(root, "licence.md")), {
    code: "ENOENT",
  });
  await assert.rejects(fs.stat(path.join(root, "royalty.json")), {
    code: "ENOENT",
  });
  await assert.rejects(fs.stat(path.join(dir, "licenses")), { code: "ENOENT" });
});

for (const operation of [evolveCharacter, evolve]) {
  test(`${operation.name} blocks promotion and preserves every world byte and hash`, async (t) => {
    const dir = await fixture(t);
    await createWorld(dir, sentence, { useWorldEngine: false });
    const before = await readWorld(dir);
    const char = before.files.find((f) =>
      f.path.startsWith("characters/"),
    ).path;
    const slug = path.basename(char, ".md");
    await assert.rejects(
      operation(dir, slug, { summary: "A candidate change", approved: true }),
      { code: "CANON_PROMOTION_REQUIRES_REVIEW" },
    );
    const after = await readWorld(dir);
    assert.deepEqual(after.manifest, before.manifest);
    assert.deepEqual(after.files, before.files);
    assert.equal(
      contentHash(after.files, after.manifest),
      contentHash(before.files, before.manifest),
    );
  });

  test(`${operation.name} blocks before reading or creating even a missing world`, async (t) => {
    const dir = path.join(await fixture(t), "missing");
    await assert.rejects(
      operation(dir, "../../outside", { summary: "Candidate" }),
      { code: "CANON_PROMOTION_REQUIRES_REVIEW" },
    );
    await assert.rejects(fs.stat(dir), { code: "ENOENT" });
  });
}

test("CLI evolve exits unsuccessfully with the review boundary and leaves the world unchanged", async (t) => {
  const dir = await fixture(t);
  await createWorld(dir, sentence, { useWorldEngine: false });
  const before = await readWorld(dir);
  await assert.rejects(
    run(process.execPath, [cli, "evolve", "wanderer", dir]),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /CANON_PROMOTION_REQUIRES_REVIEW/);
      assert.equal(error.stdout, "");
      return true;
    },
  );
  assert.deepEqual(await readWorld(dir), before);
});
