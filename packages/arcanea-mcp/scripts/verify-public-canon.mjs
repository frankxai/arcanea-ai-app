#!/usr/bin/env node
// Proves a canon file is the PUBLIC mirror's CANON_LOCKED.md at the pinned commit.
// The npm package ships this file, so it must never be the private canon.
//
//   node scripts/verify-public-canon.mjs [file]    compare a local file (default: the snapshot) to the pin
//   node scripts/verify-public-canon.mjs --remote  also compare the pin against GitHub at that commit

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PIN = JSON.parse(
  readFileSync(resolve(pkgRoot, "canon/PUBLIC_CANON.json"), "utf8"),
);
const SNAPSHOT = resolve(pkgRoot, "canon", PIN.snapshot);

function problemWith(bytes, label) {
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual === PIN.sha256 && bytes.length === PIN.bytes) return null;
  return `${label}: sha256 ${actual} (${bytes.length} bytes) is not the public canon ${PIN.repository}@${PIN.commit} sha256 ${PIN.sha256} (${PIN.bytes} bytes)`;
}

const argv = process.argv.slice(2);
const problems = [];

if (argv[0] === "--remote") {
  const url = `https://raw.githubusercontent.com/${PIN.repository}/${PIN.commit}/${PIN.path}`;
  const res = await fetch(url);
  if (!res.ok) problems.push(`${url}: HTTP ${res.status}`);
  else problems.push(problemWith(Buffer.from(await res.arrayBuffer()), url));
  problems.push(problemWith(readFileSync(SNAPSHOT), SNAPSHOT));
} else {
  const file = resolve(argv[0] ?? SNAPSHOT);
  problems.push(problemWith(readFileSync(file), file));
}

const failed = problems.filter(Boolean);
for (const problem of failed) console.error(problem);
if (!failed.length)
  console.error(`public canon OK: ${PIN.repository}@${PIN.commit}`);
process.exitCode = failed.length ? 1 : 0;
