/**
 * Token auth for the local agent.
 *
 * On first launch the agent generates a random 256-bit token, writes it to
 * ~/.arcanea/agent-token (mode 0600 on POSIX), and requires it on every
 * authenticated request as `Authorization: Bearer <token>`.
 *
 * The dashboard reads the token from the same file (via /api/voice/agent-token,
 * a server route gated to localhost only) and includes it on requests. This
 * prevents arcanea.ai visitors from calling Frank's local agent — the file
 * lives outside any web-accessible directory.
 *
 * `/health` is the one unauthenticated endpoint, used for discovery.
 */

import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  chmodSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { randomBytes } from "node:crypto";

const TOKEN_PATH = join(homedir(), ".arcanea", "agent-token");

export function getOrCreateToken() {
  try {
    const t = readFileSync(TOKEN_PATH, "utf8").trim();
    if (t.length >= 32) {
      // Tokens written before the mode was set at creation time may still sit
      // at the umask default, so repair them on read rather than trusting age.
      try {
        chmodSync(TOKEN_PATH, 0o600);
      } catch {}
      return t;
    }
  } catch (err) {
    if (err && err.code !== "ENOENT") throw err;
  }
  const dir = dirname(TOKEN_PATH);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const token = randomBytes(32).toString("hex");
  // The mode belongs in the write, not a chmod afterwards: a separate chmod
  // leaves the secret readable by the umask default for the window between the
  // two calls, and leaves it readable forever if the chmod fails.
  writeFileSync(TOKEN_PATH, token, { encoding: "utf8", mode: 0o600 });
  return token;
}

export function tokenPath() {
  return TOKEN_PATH;
}

/** Constant-time-ish equality check. */
export function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return res === 0;
}

/** Extract bearer token from Authorization header. Returns null if missing. */
export function extractBearer(req) {
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (!auth || typeof auth !== "string") return null;
  const trimmed = auth.trim();
  if (!/^bearer\s/i.test(trimmed)) return null;
  const token = trimmed.slice(6).trim();
  return token || null;
}
