// Push webhook — framework-agnostic. A repo pushes, we rebuild its index slice.
// Wire this into a Next.js route, a serverless fn, or a worker.

import { createHmac, timingSafeEqual } from "node:crypto";
import { buildIndex } from "./index-build.mjs";

/** GitHub-style HMAC verification: header is "sha256=<hex>". */
export function verifySignature(secret, rawBody, signatureHeader) {
  if (!secret || !signatureHeader) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * @param {object} args
 * @param {string|Buffer} args.rawBody     raw request body (for signature + parse)
 * @param {string} [args.signature]        x-hub-signature-256 header
 * @param {string} [args.secret]           webhook secret (skip verify in dev by omitting both)
 * @param {(payload:object)=>Promise<{manifest:object,files:object[]}>} args.loadWorld
 *        fetch the world at the pushed ref (clone/tarball/api) and return readWorld() shape
 * @param {(index:object, meta:object)=>Promise<void>} args.persistIndex
 *        upsert nodes/chunks into Supabase (embedding happens in the caller)
 */
export async function handlePush({ rawBody, signature, secret, loadWorld, persistIndex }) {
  if (secret && !verifySignature(secret, rawBody, signature)) {
    return { ok: false, status: 401, error: "bad signature" };
  }
  const payload = typeof rawBody === "string" ? JSON.parse(rawBody) : JSON.parse(rawBody.toString("utf8"));
  const after = payload.after || payload.head_commit?.id;
  const repo = payload.repository?.full_name;

  const world = await loadWorld(payload);
  const index = buildIndex(world);
  await persistIndex(index, { repo, sha: after });

  return { ok: true, status: 200, worldId: index.worldId, sha: after, nodes: index.nodes.length, chunks: index.chunks.length };
}
