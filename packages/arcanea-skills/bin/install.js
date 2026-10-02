#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { homedir } = require("node:os");
const {
  loadCatalog,
  selectReady,
  validateSources,
  contained,
  canonicalBytes,
} = require("../scripts/catalog.cjs");

function existingStat(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function checkParents(homeDir, destination) {
  for (const parent of [path.join(homeDir, ".claude"), destination]) {
    const stat = existingStat(parent);
    if (
      stat &&
      (stat.isSymbolicLink() ||
        !stat.isDirectory() ||
        !contained(homeDir, fs.realpathSync(parent)))
    )
      throw new Error(`Unsafe destination: ${parent}`);
  }
}

function run(args) {
  const allowed = new Set([
    "--help",
    "-h",
    "--list",
    "-l",
    "--category",
    "-c",
    "--dry-run",
  ]);
  for (const arg of args)
    if (!allowed.has(arg)) throw new Error(`Unknown option: ${arg}`);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      "arcanea-skills [--list | --category | --dry-run | --help]\n" +
        "Installs only catalog-ready skills to ~/.claude/skills; existing directories are preserved.",
    );
    return 0;
  }
  const packageRoot = path.resolve(__dirname, "..");
  const catalog = loadCatalog(packageRoot);
  // Preserve the bytes read during validation; copying cannot reread changed sources.
  const sourceBytes = new Map();
  const sources = validateSources(packageRoot, catalog, (file) => {
    if (!sourceBytes.has(file)) sourceBytes.set(file, fs.readFileSync(file));
    return sourceBytes.get(file);
  });
  const ready = selectReady(catalog);
  if (args.includes("--list") || args.includes("-l")) {
    console.log(
      `${ready.length} ready; ${catalog.skills.length - ready.length} candidates`,
    );
    for (const skill of catalog.skills)
      console.log(`${skill.status} ${skill.name} (${skill.category})`);
    return 0;
  }
  if (args.includes("--category") || args.includes("-c")) {
    console.log(
      [...new Set(catalog.skills.map((skill) => skill.category))].join(", "),
    );
    return 0;
  }
  if (!ready.length) {
    console.error(
      "No skill is cleared for installation. See --list and the catalog's release blockers.",
    );
    return 2;
  }
  const homeDir = fs.realpathSync(homedir());
  const destination = path.join(homeDir, ".claude", "skills");
  checkParents(homeDir, destination);
  // Complete the plan before copying; a conflict cannot leave earlier skills overwritten.
  const plan = ready.map((skill) => {
    const target = path.join(destination, skill.name);
    if (existingStat(target))
      throw new Error(
        `Destination already exists; preserve or relocate it explicitly: ${target}`,
      );
    return {
      skill,
      target,
      source: sources.find((row) => row.name === skill.name),
    };
  });
  if (args.includes("--dry-run")) {
    for (const row of plan)
      console.log(
        `Would install ${row.skill.name} (${row.source.files.length} files) to ${row.target}`,
      );
    return 0;
  }
  // Path checks cannot prevent another local process swapping a parent during mkdir/copy.
  // Install only with a trusted, stable home and source tree; the postcheck detects static links.
  fs.mkdirSync(destination, { recursive: true });
  checkParents(homeDir, destination);
  for (const row of plan) {
    checkParents(homeDir, destination);
    fs.mkdirSync(row.target); // Exclusive mkdir also rejects a destination created after preflight.
    for (const file of row.source.files) {
      const target = path.join(row.target, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(
        target,
        canonicalBytes(
          file,
          sourceBytes.get(path.join(packageRoot, row.skill.path, file)),
        ),
        { flag: "wx", mode: 0o644 },
      );
    }
    console.log(
      `Installed ${row.skill.name} (${row.source.files.length} files)`,
    );
  }
  return 0;
}

try {
  process.exitCode = run(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
