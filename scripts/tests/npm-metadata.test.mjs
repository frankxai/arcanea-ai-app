import test from "node:test";
import assert from "node:assert/strict";
import { metadataErrors } from "../verify-npm-metadata.mjs";

const base = "https://github.com/frankxai/arcanea-ai-app";
const pkg = {
  repository: { type: "git", url: `${base}.git`, directory: "packages/core" },
  homepage: `${base}/tree/main/packages/core`,
  bugs: { url: `${base}/issues` },
};

test("accepts the canonical package source and rejects mirror and legacy sources", () => {
  assert.deepEqual(metadataErrors(pkg, "packages/core"), []);
  for (const url of [
    "https://github.com/frankxai/arcanea.git",
    "https://github.com/Arcanea-Labs/arcanea-ai-app.git",
    `${base}.git/other`,
  ]) {
    assert.match(
      metadataErrors(
        { ...pkg, repository: { ...pkg.repository, url } },
        "packages/core",
      ).join(),
      /canonical publisher/,
    );
  }
});

test("rejects missing metadata, another package directory and an unrelated support tracker", () => {
  assert.equal(metadataErrors({}, "packages/core").length, 3);
  assert.match(
    metadataErrors(pkg, "packages/cli").join(),
    /workspace directory/,
  );
  assert.match(
    metadataErrors(
      { ...pkg, bugs: { url: "https://example.com/issues" } },
      "packages/core",
    ).join(),
    /issue tracker/,
  );
});
