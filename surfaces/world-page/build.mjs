// Build the flagship world page from a world repo — the argument, rendered.
//   node build.mjs [worldDir] [outFile]
// Static data, no secrets. Consumes the world through @arcanea/world-sdk.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readWorld, buildIndex, validateManifest } from "../../packages/world-sdk/src/index.mjs";
import { renderWorldPage } from "./render.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const worldDir = path.resolve(here, process.argv[2] || "worlds/the-drowned-archive");
const outFile = path.resolve(here, process.argv[3] || "dist/index.html");

const world = await readWorld(worldDir);
const { valid, errors } = validateManifest(world.manifest);
if (!valid) {
  console.error("✗ world manifest invalid:\n - " + errors.join("\n - "));
  process.exit(1);
}

const idx = buildIndex(world);
const tokensCss = await fs.readFile(path.join(here, "tokens.css"), "utf8");
const html = renderWorldPage(world, tokensCss);

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, html, "utf8");

console.log(`✨ ${world.manifest.name}`);
console.log(`   ${idx.nodes.length} nodes · ${idx.chunks.length} chunks · ${(html.length / 1024).toFixed(1)} KB`);
console.log(`   → ${outFile}`);
