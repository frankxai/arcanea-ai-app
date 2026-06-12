#!/usr/bin/env node
// arcanea-world — the World Repo Standard from your terminal.
//   arcanea-world create "<sentence>" [dir]
//   arcanea-world validate|hash|index|claim <dir>

import path from "node:path";
import { promises as fs } from "node:fs";
import { ingestCharacter } from "../src/ingest.mjs";
import { createWorldWithProviders } from "../src/providers.mjs";
import { readWorld } from "../src/fs-world.mjs";
import { validateManifest } from "../src/validate.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { buildIndex } from "../src/index-build.mjs";
import { claimWorldProof, mockChain } from "../src/proof.mjs";
import { renderBook } from "../src/render-book.mjs";
import { recordMemory, evolveCharacter, evolveWorld } from "../src/evolve.mjs";
import { slugify } from "../src/manifest.mjs";

const argv = process.argv.slice(2);

function takeFlag(name) {
  const i = argv.indexOf(name);
  if (i === -1) return undefined;
  const val = argv[i + 1];
  argv.splice(i, 2);
  return val;
}

const renderTarget = takeFlag("--target");
const renderFormat = takeFlag("--format");

const [cmd, ...rest] = argv;

function die(msg) {
  console.error(msg);
  process.exit(1);
}

switch (cmd) {
  case "create": {
    const sentence = rest[0];
    if (!sentence) die('usage: arcanea-world create "<sentence>" [dir]');
    const dir = rest[1] || path.resolve(slugify(sentence));
    const { manifest, usedLLM, usedCover, usedTheme } = await createWorldWithProviders(dir, sentence, process.env, {});
    console.log(`✨ ${manifest.name}  (${manifest.id})`);
    console.log(`   ${manifest.tagline}`);
    console.log(`   → ${dir}`);
    const used = [usedLLM && "llm", usedCover && "cover", usedTheme && "theme"].filter(Boolean);
    console.log(`   providers: ${used.length ? used.join(", ") : "offline (no keys)"}`);
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
  case "render": {
    if (renderTarget !== "book") die('usage: arcanea-world render --target book <dir> [bookSlug] [--format md|html|pdf]');
    const dir = rest[0] || ".";
    const bookSlug = rest[1];
    const format = renderFormat || "md";
    const { outFile, target, bytes } = await renderBook({ dir, bookSlug, target: format });
    console.log(`📖 rendered book (${target}) → ${outFile} (${bytes} bytes)`);
    break;
  }
  case "remember": {
    const [dir, character, content, salience] = rest;
    if (!dir || !character || !content) die('usage: arcanea-world remember <dir> <character> "<moment>" [salience]');
    const rec = await recordMemory(dir, { character, content, salience: salience ? Number(salience) : undefined });
    console.log(`🫧 ${rec.character} will remember: "${rec.content}" (salience ${rec.salience})`);
    break;
  }
  case "evolve": {
    const dir = rest[0];
    if (!dir) die("usage: arcanea-world evolve <dir> [character]");
    if (rest[1]) {
      const res = await evolveCharacter({ dir, character: rest[1] });
      if (!res.evolved) die(`nothing to evolve: ${res.reason}`);
      console.log(`🌱 ${rest[1]} is ${res.state.disposition} — ${res.state.summary}`);
      console.log(`   canon grew → ${res.loreFile}`);
    } else {
      const { evolved } = await evolveWorld({ dir });
      if (!evolved.length) die("nothing to evolve: no memories recorded");
      for (const e of evolved) console.log(`🌱 ${e.character} is ${e.state.disposition} → ${e.loreFile}`);
    }
    break;
  }
  default:
    die('commands: create "<sentence>" [dir] | ingest <dir> <character.json> [imagePath] | render --target book <dir> [bookSlug] [--format md|html|pdf] | remember <dir> <character> "<moment>" [salience] | evolve <dir> [character] | validate <dir> | hash <dir> | index <dir> | claim <dir>');
}
