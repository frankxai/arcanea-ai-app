import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(
  root,
  "apps/web/lib/visual-encyclopedia/sovereign-depths",
);
const readData = async (name) =>
  JSON.parse(await readFile(join(dataRoot, `${name}.json`), "utf8"));
const [metadata, bossesA, bossesB, dungeons] = await Promise.all(
  ["metadata", "bosses-a", "bosses-b", "dungeons"].map(readData),
);
const collection = { ...metadata, bosses: [...bossesA, ...bossesB], dungeons };
const entries = [...collection.bosses, ...collection.dungeons];
const gitBlobs = JSON.parse(
  await readFile(
    join(root, "docs/worldbuilding/sovereign-depths/git-blobs.json"),
    "utf8",
  ),
);
assert.equal(gitBlobs.length, 36, "36 immutable Git asset receipts");
assert.equal(
  new Set(gitBlobs.map((blob) => blob.id)).size,
  36,
  "Unique Git receipt IDs",
);
assert.equal(collection.canonStatus, "STAGING");
assert.equal(collection.bosses.length, 24);
assert.equal(collection.dungeons.length, 12);
assert.equal(new Set(entries.map((entry) => entry.id)).size, 36);
assert.equal(new Set(entries.map((entry) => entry.slug)).size, 36);
const hashes = new Set();
let totalBytes = 0;

function webpDimensions(bytes) {
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const type = bytes.toString("ascii", offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    assert.ok(data + size <= bytes.length, "Truncated WebP chunk");
    if (type === "VP8X")
      return [
        bytes.readUIntLE(data + 4, 3) + 1,
        bytes.readUIntLE(data + 7, 3) + 1,
      ];
    if (type === "VP8 ")
      return [
        bytes.readUInt16LE(data + 6) & 0x3fff,
        bytes.readUInt16LE(data + 8) & 0x3fff,
      ];
    if (type === "VP8L") {
      const bits = bytes.readUInt32LE(data + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    offset = data + size + (size % 2);
  }
  throw new Error("WebP dimensions unavailable");
}

for (const entry of entries) {
  assert.equal(
    entry.image.src,
    `/images/sovereign-depths/${entry.id}.webp`,
    `${entry.id}: image path`,
  );
  assert.match(
    entry.image.renditionSha256,
    /^[a-f0-9]{64}$/u,
    `${entry.id}: rendition checksum`,
  );
  assert.match(
    entry.image.sourceSha256,
    /^[a-f0-9]{64}$/u,
    `${entry.id}: source checksum`,
  );
  assert.ok(
    entry.image.alt.length > 20,
    `${entry.id}: descriptive alternative text`,
  );
  const file = join(root, "apps/web/public", entry.image.src);
  const bytes = await readFile(file);
  const info = await stat(file);
  const receipt = gitBlobs.find((blob) => blob.id === entry.id);
  assert.ok(receipt, `${entry.id}: immutable Git receipt`);
  assert.equal(receipt.repository, "frankxai/arcanea-ai-app");
  assert.equal(
    receipt.path,
    `apps/web/public/images/sovereign-depths/${entry.id}.webp`,
  );
  const gitSha = createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
  assert.equal(
    gitSha,
    receipt.sha,
    `${entry.id}: uploaded Git blob matches delivered bytes`,
  );
  assert.equal(
    bytes.toString("ascii", 0, 4),
    "RIFF",
    `${entry.id}: WebP RIFF header`,
  );
  assert.equal(
    bytes.toString("ascii", 8, 12),
    "WEBP",
    `${entry.id}: WebP format`,
  );
  assert.deepEqual(
    webpDimensions(bytes),
    [entry.image.width, entry.image.height],
    `${entry.id}: actual image dimensions`,
  );
  const hash = createHash("sha256").update(bytes).digest("hex");
  assert.equal(
    hash,
    entry.image.renditionSha256,
    `${entry.id}: actual rendition checksum`,
  );
  assert.ok(!hashes.has(hash), `${entry.id}: duplicate image`);
  hashes.add(hash);
  assert.ok(
    entry.image.width >= 1000 && entry.image.height >= 600,
    `${entry.id}: display resolution`,
  );
  totalBytes += info.size;
}

for (const boss of collection.bosses) {
  const dungeon = collection.dungeons.find(
    (entry) => entry.id === boss.dungeonId,
  );
  assert.ok(
    dungeon?.bossIds.includes(boss.id),
    `${boss.id}: reciprocal dungeon link`,
  );
}
for (const dungeon of collection.dungeons) {
  assert.equal(dungeon.bossIds.length, 2);
  for (const id of dungeon.bossIds)
    assert.equal(
      collection.bosses.find((entry) => entry.id === id)?.dungeonId,
      dungeon.id,
    );
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      images: hashes.size,
      bosses: collection.bosses.length,
      dungeons: collection.dungeons.length,
      renditionBytes: totalBytes,
      canonStatus: collection.canonStatus,
    },
    null,
    2,
  ),
);
