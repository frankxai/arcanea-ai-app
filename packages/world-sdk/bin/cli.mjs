#!/usr/bin/env node
// arcanea-world — the World Repo Standard from your terminal.
//   arcanea-world create "<sentence>" [dir]
//   arcanea-world validate|hash|index|claim <dir>

import path from "node:path";
import { promises as fs } from "node:fs";
import { createWorld } from "../src/scaffold.mjs";
import { ingestCharacter } from "../src/ingest.mjs";
import { readWorld } from "../src/fs-world.mjs";
import { validateManifest } from "../src/validate.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { buildIndex } from "../src/index-build.mjs";
import { claimWorldProof, mockChain } from "../src/proof.mjs";
import { slugify } from "../src/manifest.mjs";

const [cmd, ...rest] = process.argv.slice(2);

function die(msg) {
  console.error(msg);
  process.exit(1);
}

switch (cmd) {
  case "create": {
    const sentence = rest[0];
    if (!sentence) die('usage: arcanea-world create "<sentence>" [dir]');
    const dir = rest[1] || path.resolve(slugify(sentence));
    const { manifest } = await createWorld(dir, sentence, {});
    console.log(`✨ ${manifest.name}  (${manifest.id})`);
    console.log(`   ${manifest.tagline}`);
    console.log(`   → ${dir}`);
    break;
  }
  case "ingest": {
    const dir = rest[0];
    const charPath = rest[1];
    const imagePath = rest[2];
    if (!dir || !charPath) die("usage: arcanea-world ingest <dir> <character.json> [imagePath]");
    const input = JSON.parse(await fs.readFile(charPath, "utf8"));
    const image = imagePath ? await fs.readFile(imagePath) : undefined;
    const imageName = imagePath ? path.basename(imagePath) : undefined;
    const res = await ingestCharacter({ dir, input, image, imageName });
    console.log(`✨ ${res.character.name}  → ${res.characterFile}`);
    if (res.assetFile) console.log(`   asset → ${res.assetFile}`);
    for (const w of res.warnings) console.log(`   ⚠ ${w}`);
    break;
  }
  case "validate": {
    const { manifest } = await readWorld(rest[0] || ".");
    const { valid, errors } = validateManifest(manifest);
    console.log(valid ? "valid world manifest" : "INVALID:\n - " + errors.join("\n - "));
    process.exit(valid ? 0 : 1);
  }
  case "hash": {
    const w = await readWorld(rest[0] || ".");
    console.log(contentHash(w.files, w.manifest));
    break;
  }
  case "index": {
    const idx = buildIndex(await readWorld(rest[0] || "."));
    console.log(`world ${idx.worldId}: ${idx.nodes.length} nodes, ${idx.chunks.length} chunks → embed with ${idx.embedding.model} (${idx.embedding.dim}d)`);
    break;
  }
  case "claim": {
    const res = await claimWorldProof({ dir: rest[0] || ".", adapter: mockChain("solana") });
    console.log(`🔏 proof on ${res.entry.chain} (${res.entry.standard})`);
    console.log(`   contentHash ${res.contentHash}`);
    console.log(`   wallet ${res.wallet}  ref ${res.entry.ref.slice(0, 16)}…`);
    break;
  }
  default:
    die('commands: create "<sentence>" [dir] | ingest <dir> <character.json> [imagePath] | validate <dir> | hash <dir> | index <dir> | claim <dir>');
}
