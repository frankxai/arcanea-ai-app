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

import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { randomBytes } from 'node:crypto';

const TOKEN_PATH = join(homedir(), '.arcanea', 'agent-token');

export function getOrCreateToken() {
  if (existsSync(TOKEN_PATH)) {
    const t = readFileSync(TOKEN_PATH, 'utf8').trim();
    if (t.length >= 32) return t;
  }
  const dir = dirname(TOKEN_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const token = randomBytes(32).toString('hex');
  writeFileSync(TOKEN_PATH, token, 'utf8');
  try { chmodSync(TOKEN_PATH, 0o600); } catch {}
  return token;
}

export function tokenPath() {
  return TOKEN_PATH;
}

/** Constant-time-ish equality check. */
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return res === 0;
}

/** Extract bearer token from Authorization header. Returns null if missing. */
export function extractBearer(req) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth || typeof auth !== 'string') return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}
