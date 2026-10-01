// Supply-chain shape of the npm publish workflow. The job that holds an OIDC
// token must run nothing mutable and publish only a verified, pre-built artifact.
// Run: pnpm --dir packages/arcanea-mcp test:worldpack

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const WORKFLOW = readFileSync(
  resolve(here, "../../../.github/workflows/publish-mcp-server.yml"),
  "utf8",
);
const lines = WORKFLOW.split(/\r?\n/);

function jobs() {
  const start = lines.findIndex((line) => /^jobs:\s*$/.test(line));
  assert.ok(start >= 0, "workflow has a jobs block");
  const found = {};
  let current = null;
  for (const line of lines.slice(start + 1)) {
    const header = line.match(/^  ([\w-]+):\s*$/);
    if (header) {
      current = header[1];
      found[current] = [];
    } else if (current) {
      found[current].push(line);
    }
  }
  return Object.fromEntries(
    Object.entries(found).map(([name, body]) => [name, body.join("\n")]),
  );
}

test("P2-9 every action is pinned to a full commit SHA with a version comment", () => {
  const uses = lines.filter((line) => /^\s*(?:-\s+)?uses:/.test(line));
  assert.ok(uses.length > 0);
  for (const line of uses)
    assert.match(
      line,
      /uses:\s+[\w.-]+\/[\w.-]+@[0-9a-f]{40}\s+#\s*v\d/,
      `not pinned: ${line.trim()}`,
    );
});

test("P2-9 only a publish-only job holds id-token, and it publishes the verified build artifact", () => {
  const header = WORKFLOW.slice(0, WORKFLOW.search(/^jobs:/m));
  // Comments cannot grant permissions; only YAML keys are checked.
  assert.doesNotMatch(
    header.replace(/^\s*#.*$/gm, ""),
    /id-token/,
    "no workflow-wide id-token permission",
  );

  const all = jobs();
  const holders = Object.entries(all).filter(([, body]) =>
    /id-token:\s*write/.test(body),
  );
  assert.equal(holders.length, 1, "exactly one job may request id-token");
  const [publishName, publish] = holders[0];

  const builders = Object.entries(all).filter(([name]) => name !== publishName);
  assert.ok(builders.length >= 1, "a separate build/test job exists");
  const [buildName, build] = builders[0];
  assert.match(build, /actions\/upload-artifact@/, "build uploads the tarball");
  assert.match(build, /sha256/, "build records the tarball sha256");

  assert.match(publish, new RegExp(`needs:\\s*\\[?\\s*${buildName}`));
  assert.match(publish, /actions\/download-artifact@/);
  assert.match(
    publish,
    /sha256sum\s+(?:-c|--check)|sha256/,
    "publish checks the sha256",
  );
  assert.doesNotMatch(
    publish,
    /actions\/checkout@/,
    "publish job checks out no code",
  );
  assert.doesNotMatch(
    publish,
    /pnpm install|npm ci|npm install(?! -g npm)/,
    "publish job installs no dependencies",
  );
  assert.match(publish, /npm publish/);
});
