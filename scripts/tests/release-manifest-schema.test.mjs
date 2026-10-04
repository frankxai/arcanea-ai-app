import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { validateReleaseManifest } from "../validate-release-manifest.mjs";

const FIXTURES_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures/release-manifest",
);

test("Valid release manifest passes", () => {
  const validData = JSON.parse(
    readFileSync(path.join(FIXTURES_DIR, "valid.json"), "utf8"),
  );
  assert.doesNotThrow(() => validateReleaseManifest(validData, "valid"));
});

test("Missing rights fixture fails", () => {
  const missingRightsData = JSON.parse(
    readFileSync(path.join(FIXTURES_DIR, "missing-rights.json"), "utf8"),
  );
  assert.throws(
    () => validateReleaseManifest(missingRightsData, "missing-rights"),
    /missing-rights\.rights: required/,
  );
});

test("Stale canon fixture fails", () => {
  const staleCanonData = JSON.parse(
    readFileSync(path.join(FIXTURES_DIR, "stale-canon.json"), "utf8"),
  );
  assert.throws(
    () => validateReleaseManifest(staleCanonData, "stale-canon"),
    /must be one of LOCKED, STAGING/,
  );
});
