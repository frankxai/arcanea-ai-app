/**
 * Token file permissions.
 *
 * The module docstring promises mode 0600 on POSIX. These tests hold it to
 * that, including for a token file left behind by an older version that
 * wrote with the umask default.
 *
 * Mode assertions are skipped on Windows, where fs mode bits are not POSIX
 * permissions.
 */

import assert from "node:assert";
import { test } from "node:test";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const POSIX = process.platform !== "win32";

// auth.mjs resolves TOKEN_PATH from homedir() at import time, so HOME is
// redirected before the import to keep the real token untouched.
const home = mkdtempSync(join(tmpdir(), "arcanea-auth-"));
process.env.HOME = home;
process.env.USERPROFILE = home;

const { getOrCreateToken, tokenPath } = await import("../src/auth.mjs");

test("creates a token that is not group or world readable", () => {
  const token = getOrCreateToken();
  assert.ok(token.length >= 32, "token should be at least 32 chars");
  assert.equal(readFileSync(tokenPath(), "utf8").trim(), token);
  if (POSIX) {
    assert.equal(statSync(tokenPath()).mode & 0o077, 0, "no group/other bits");
  }
});

test("returns the same token on a second call", () => {
  assert.equal(getOrCreateToken(), getOrCreateToken());
});

test(
  "repairs a pre-existing world-readable token file",
  { skip: !POSIX },
  () => {
    const path = tokenPath();
    const legacy = "a".repeat(64);
    writeFileSync(path, legacy, "utf8");
    chmodSync(path, 0o644);

    const token = getOrCreateToken();

    assert.equal(token, legacy, "an existing valid token is kept");
    assert.equal(
      statSync(path).mode & 0o077,
      0,
      "loose permissions are repaired",
    );
  },
);
