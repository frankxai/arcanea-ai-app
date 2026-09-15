#!/usr/bin/env node
// Bundles @arcanea/world-pack and the canon document into dist/vendor so the
// published server has no workspace dependency and checks against a canon that
// ships with it. world-pack has zero runtime dependencies, so a copy is the whole
// dependency.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(pkgRoot, "../..");
const worldPackSrc = join(repoRoot, "packages/world-pack/src");
const canonDoc = join(repoRoot, ".arcanea/lore/CANON_LOCKED.md");
const vendor = join(pkgRoot, "dist/vendor");

for (const required of [worldPackSrc, canonDoc]) {
  if (!existsSync(required)) {
    console.error(`vendor-world-pack: missing ${required}`);
    process.exit(1);
  }
}

rmSync(vendor, { recursive: true, force: true });
mkdirSync(join(vendor, "world-pack"), { recursive: true });
mkdirSync(join(vendor, "canon"), { recursive: true });

const modules = readdirSync(worldPackSrc).filter((f) => f.endsWith(".mjs"));
for (const file of modules) cpSync(join(worldPackSrc, file), join(vendor, "world-pack", file));
cpSync(canonDoc, join(vendor, "canon/CANON_LOCKED.md"));

console.error(`vendor-world-pack: ${modules.length} modules + CANON_LOCKED.md -> dist/vendor`);
