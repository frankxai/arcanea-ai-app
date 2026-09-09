import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(
  root,
  "apps/web/lib/visual-encyclopedia/weight-of-wonders.json",
);
const data = JSON.parse(await readFile(dataPath, "utf8"));
const { collection, entries } = data;

assert.equal(collection.id, "weight-of-wonders");
assert.equal(collection.canonStatus, "EXPERIMENTAL");
assert.equal(collection.trilogy.length, 3, "three-part proposed trilogy");
assert.equal(entries.length, 6, "six independent concept records");
assert.equal(entries.filter((entry) => entry.kind === "boss").length, 3);
assert.equal(entries.filter((entry) => entry.kind === "dungeon").length, 3);
assert.equal(new Set(entries.map((entry) => entry.id)).size, 6, "unique IDs");
assert.equal(
  new Set(entries.map((entry) => entry.slug)).size,
  6,
  "unique slugs",
);

function webpDimensions(bytes) {
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const type = bytes.toString("ascii", offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;
    assert.ok(dataOffset + size <= bytes.length, "truncated WebP chunk");
    if (type === "VP8X")
      return [
        bytes.readUIntLE(dataOffset + 4, 3) + 1,
        bytes.readUIntLE(dataOffset + 7, 3) + 1,
      ];
    if (type === "VP8 ")
      return [
        bytes.readUInt16LE(dataOffset + 6) & 0x3fff,
        bytes.readUInt16LE(dataOffset + 8) & 0x3fff,
      ];
    if (type === "VP8L") {
      const bits = bytes.readUInt32LE(dataOffset + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    offset = dataOffset + size + (size % 2);
  }
  throw new Error("WebP dimensions unavailable");
}

const hashes = new Set();
let totalBytes = 0;
for (const entry of entries) {
  assert.equal(entry.canonStatus, "EXPERIMENTAL", `${entry.id}: status`);
  assert.match(entry.id, /^wow-[bd]0[1-3]$/u, `${entry.id}: stable ID`);
  assert.match(entry.slug, /^[a-z0-9-]+$/u, `${entry.id}: route slug`);
  assert.ok(entry.history.length > 0, `${entry.id}: history`);
  assert.ok(entry.storySeeds.length > 0, `${entry.id}: story seeds`);
  assert.ok(entry.sessionKit.prompt.length > 80, `${entry.id}: useful prompt`);
  assert.ok(entry.sessionKit.beats.length >= 3, `${entry.id}: session beats`);
  assert.ok(entry.artNote.length > 20, `${entry.id}: artwork limits`);
  if (entry.kind === "boss") {
    assert.equal(entry.encounter.phases.length, 3, `${entry.id}: phases`);
    assert.equal(entry.encounter.endings.length, 3, `${entry.id}: endings`);
  } else {
    assert.ok(entry.place.routes.length >= 3, `${entry.id}: routes`);
    assert.ok(entry.place.consequence.length > 40, `${entry.id}: consequence`);
  }
  const related = entries.find(
    (candidate) => candidate.slug === entry.relatedSlug,
  );
  assert.ok(related, `${entry.id}: related route exists`);
  assert.equal(
    related.relatedSlug,
    entry.slug,
    `${entry.id}: reciprocal route`,
  );
  assert.notEqual(related.kind, entry.kind, `${entry.id}: boss/place pair`);

  assert.equal(
    entry.image.src,
    `/images/weight-of-wonders/${entry.slug}.webp`,
    `${entry.id}: stable image route`,
  );
  assert.match(entry.image.sha256, /^[a-f0-9]{64}$/u, `${entry.id}: hash`);
  assert.ok(entry.image.alt.length > 30, `${entry.id}: descriptive alt text`);
  const file = join(root, "apps/web/public", entry.image.src);
  const bytes = await readFile(file);
  const fileInfo = await stat(file);
  assert.equal(fileInfo.size, entry.image.bytes, `${entry.id}: byte count`);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", `${entry.id}: RIFF`);
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `${entry.id}: WebP`);
  assert.deepEqual(
    webpDimensions(bytes),
    [entry.image.width, entry.image.height],
    `${entry.id}: dimensions`,
  );
  const hash = createHash("sha256").update(bytes).digest("hex");
  assert.equal(hash, entry.image.sha256, `${entry.id}: delivered checksum`);
  assert.ok(!hashes.has(hash), `${entry.id}: duplicate artwork`);
  hashes.add(hash);
  totalBytes += bytes.length;
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      records: entries.length,
      bosses: 3,
      dungeons: 3,
      images: hashes.size,
      renditionBytes: totalBytes,
      canonStatus: collection.canonStatus,
    },
    null,
    2,
  ),
);
