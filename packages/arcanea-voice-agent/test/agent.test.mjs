/**
 * Smoke test for @arcanea/voice-agent v0.1.0.
 * Runs: agent boots, /health responds, /intent rejects unauthed,
 *       /intent accepts authed clap intent.
 */

import assert from "node:assert";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { startAgent } from "../src/server.mjs";

const AUTH_TEST = fileURLToPath(new URL("./auth.test.mjs", import.meta.url));

async function main() {
  const handle = await startAgent({ tenants: ["arcanea"] });
  const base = `http://127.0.0.1:${handle.port}`;

  // /health no-auth ok
  {
    const r = await fetch(`${base}/health`);
    assert.equal(r.status, 200, "/health should return 200");
    const body = await r.json();
    assert.equal(body.ok, true);
    assert.equal(body.version, "0.1.0");
    console.log("✓ /health ok");
  }

  // /intent without token → 401
  {
    const r = await fetch(`${base}/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "clap", persona: "lumina" }),
    });
    assert.equal(r.status, 401, "/intent without auth must 401");
    console.log("✓ /intent rejects unauthed");
  }

  // /intent with token → 200
  {
    const r = await fetch(`${base}/intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${handle.token}`,
      },
      body: JSON.stringify({
        kind: "clap",
        persona: "lumina",
        tenant: "arcanea",
      }),
    });
    assert.equal(r.status, 200, "/intent with auth must 200");
    const body = await r.json();
    assert.equal(body.ok, true);
    assert.equal(body.persona, "lumina");
    console.log("✓ /intent accepts authed clap");
  }

  // /summon/:persona shorthand
  {
    const r = await fetch(`${base}/summon/lumina?tenant=sis`, {
      method: "POST",
      headers: { Authorization: `Bearer ${handle.token}` },
    });
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.equal(body.tenant, "sis");
    console.log("✓ /summon/:persona ok");
  }

  // Unknown intent → 400
  {
    const r = await fetch(`${base}/intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${handle.token}`,
      },
      body: JSON.stringify({ kind: "nope" }),
    });
    assert.equal(r.status, 400);
    console.log("✓ unknown intent → 400");
  }

  handle.shutdown();
  console.log("\nall tests passed.");
}

main().catch((e) => {
  console.error("test failed:", e);
  process.exit(1);
});
