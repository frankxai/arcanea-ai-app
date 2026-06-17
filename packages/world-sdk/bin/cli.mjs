#!/usr/bin/env node
// arcanea-world — the World Repo Standard from your terminal.
//   arcanea-world create "<sentence>" [dir]
//   arcanea-world validate|hash|index|claim <dir>

import path from "node:path";
import { createWorld } from "../src/scaffold.mjs";
import { readWorld } from "../src/fs-world.mjs";
import { validateManifest } from "../src/validate.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { buildIndex } from "../src/index-build.mjs";
import { claimWorldProof, mockChain } from "../src/proof.mjs";
import { slugify } from "../src/manifest.mjs";
import { remember, evolve, listMemories, distillOffline } from "../src/evolution.mjs";

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
  case "remember": {
    const [who, ...msgParts] = rest;
    const content = msgParts.join(" ") || who;
    const charId = msgParts.length ? who : null;
    const { record, distilled } = await remember(rest[0] || ".", content, { characterId: charId });
    console.log(`📝 memory recorded → ${record.path}`);
    if (distilled) console.log(`   distilled: ${distilled.slice(0, 120)}…`);
    break;
  }
  case "evolve": {
    const slug = rest[0];
    if (!slug) die("usage: arcanea-world evolve <character-slug> [dir]");
    const dir = rest[1] || ".";
    const { character, lore, summary, world } = await evolve(dir, slug);
    console.log(`🌱 ${world.name} evolved`);
    console.log(`   ${character} updated`);
    console.log(`   new canon: ${lore}`);
    console.log(`   ${summary.slice(0, 140)}…`);
    break;
  }
  case "memories": {
    const dir = rest[0] || ".";
    const mems = await listMemories(dir);
    console.log(`${mems.length} memories`);
    mems.slice(-3).forEach((m) => console.log(`  ${m.ts.slice(0,16)} ${m.characterId || ""} ${m.content.slice(0,60)}`));
    break;
  }
  default:
    die('commands: create "<sentence>" [dir] | validate <dir> | hash <dir> | index <dir> | claim <dir> | remember [char] "moment..." [dir] | evolve <char-slug> [dir] | memories [dir]');
}
