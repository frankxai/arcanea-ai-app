// The npm package may only ever carry the PUBLIC canon. The private
// CANON_LOCKED.md in this repo holds lore that is not published anywhere.
// Run: pnpm --dir packages/arcanea-mcp test:worldpack

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const PIN = JSON.parse(
  readFileSync(resolve(pkgRoot, "canon/PUBLIC_CANON.json"), "utf8"),
);
const VENDORED = resolve(pkgRoot, "dist/vendor/canon/CANON_LOCKED.md");
const SNAPSHOT = resolve(pkgRoot, "canon", PIN.snapshot);
const PRIVATE = resolve(pkgRoot, "../../.arcanea/lore/CANON_LOCKED.md");
const VERIFY = resolve(pkgRoot, "scripts/verify-public-canon.mjs");

const sha256 = (file) =>
  createHash("sha256").update(readFileSync(file)).digest("hex");

// Headings that exist only in the private canon. If either ever appears in the
// vendored file, private lore is about to ship.
const PRIVATE_ONLY = [
  "What is NOT a Sister-World",
  "What is NOT a Mirror Realm",
];

test("P1-5 the pinned snapshot is the public mirror's file at the pinned commit", () => {
  assert.match(PIN.commit, /^[0-9a-f]{40}$/);
  assert.equal(PIN.repository, "frankxai/arcanea");
  assert.equal(sha256(SNAPSHOT), PIN.sha256);
  assert.equal(readFileSync(SNAPSHOT).length, PIN.bytes);
});

test("P1-5 the vendored canon is byte-identical to the pinned public snapshot", () => {
  assert.equal(
    sha256(VENDORED),
    PIN.sha256,
    "dist/vendor must ship the public canon, not the private file",
  );
  const text = readFileSync(VENDORED, "utf8");
  for (const marker of PRIVATE_ONLY)
    assert.ok(!text.includes(marker), `private-only lore shipped: ${marker}`);
});

test("P1-5 the canon check passes the public snapshot and fails anything else", () => {
  const ok = spawnSync(process.execPath, [VERIFY, SNAPSHOT], {
    encoding: "utf8",
  });
  assert.equal(ok.status, 0, ok.stderr);
  const bad = spawnSync(process.execPath, [VERIFY, PRIVATE], {
    encoding: "utf8",
  });
  assert.equal(
    bad.status,
    1,
    "the private canon must fail the public-canon check",
  );
  assert.match(bad.stderr, /sha256/);
});
