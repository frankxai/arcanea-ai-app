import { test } from "node:test";
import assert from "node:assert/strict";
import {
  GENTLE_POWERS,
  isGentlePowersPublished,
  filterGentleEntries,
  type GentleCollection,
} from "./gentle-powers";

function fixture(): GentleCollection {
  const value = structuredClone(GENTLE_POWERS);
  value.visibility = "public";
  value.releaseState = "published";
  value.sourceCommit = "a".repeat(40);
  for (const entry of value.entries)
    if (entry.asset) {
      const asset = entry.asset;
      asset.deliveryState = "verified";
      asset.reviewState = "release-approved";
      asset.url = `https://example.public.blob.vercel-storage.com/arcanea/gentle-powers/${asset.sha256}.webp`;
      asset.approval = {
        reviewer: "test reviewer",
        authorizationRef: "test-only",
        masterSha256: asset.masterSha256,
        renditionSha256: asset.sha256,
      };
    }
  return value;
}

test("current draft cannot publish or promote canon", () => {
  assert.equal(isGentlePowersPublished(GENTLE_POWERS), false);
  const value = fixture();
  assert.equal(isGentlePowersPublished(value), true);
  value.canonState = "accepted";
  assert.equal(isGentlePowersPublished(value), false);
});
test("reject missing storage, unbound approval and malicious delivery origins", () => {
  for (const badUrl of [
    null,
    "https://drive.google.com/file/image",
    "https://example.public.blob.vercel-storage.com.evil.test/a",
    "https://u:p@example.public.blob.vercel-storage.com/a",
    "https://example.public.blob.vercel-storage.com/a?token=x",
  ]) {
    const value = fixture();
    value.entries[0].asset!.url = badUrl;
    assert.equal(isGentlePowersPublished(value), false);
  }
  const value = fixture();
  value.entries[0].asset!.approval!.masterSha256 = "0".repeat(64);
  assert.equal(isGentlePowersPublished(value), false);
});
test("reject duplicate results, missing source pins, and prompt-only assets", () => {
  const value = fixture();
  value.entries[1].asset = structuredClone(value.entries[0].asset);
  assert.equal(isGentlePowersPublished(value), false);
  const unpinned = fixture();
  unpinned.sourceCommit = null;
  assert.equal(isGentlePowersPublished(unpinned), false);
  const mislabeled = fixture();
  mislabeled.entries[3].asset = structuredClone(mislabeled.entries[0].asset);
  assert.equal(isGentlePowersPublished(mislabeled), false);
});
test("search handles multiple words, empty results and generated-only filter", () => {
  assert.equal(
    filterGentleEntries(GENTLE_POWERS.entries, "  reciprocity  child ", false)
      .length,
    1,
  );
  assert.equal(filterGentleEntries(GENTLE_POWERS.entries, "", true).length, 3);
  assert.equal(
    filterGentleEntries(GENTLE_POWERS.entries, "no-such-study", false).length,
    0,
  );
});
