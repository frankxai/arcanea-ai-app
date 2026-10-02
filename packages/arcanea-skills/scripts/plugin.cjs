"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const {
  loadCatalog,
  selectReady,
  validateSources,
  contained,
} = require("./catalog.cjs");

const ORIGIN = "https://github.com/frankxai/arcanea-ai-app.git";
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (value) => Buffer.from(JSON.stringify(value, null, 2) + "\n");

function git(root, args) {
  return execFileSync("git", ["-C", root, ...args], {
    timeout: 10000,
    maxBuffer: 8 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

// Snapshot only catalog-selected source bytes. No source directory or developer
// plugin manifest is copied, and nothing is read again during materialization.
function preparePlugin(packageRoot, sourceCommit) {
  if (!/^[a-f0-9]{40}$/.test(sourceCommit ?? ""))
    throw new Error("Require a full lowercase source commit SHA");
  const stat = fs.lstatSync(packageRoot);
  if (!stat.isDirectory() || stat.isSymbolicLink())
    throw new Error("Unsafe package root");
  packageRoot = fs.realpathSync(packageRoot);
  const root = fs.realpathSync(
    git(packageRoot, ["rev-parse", "--show-toplevel"]).toString().trim(),
  );
  if (
    !contained(root, packageRoot) ||
    path.relative(root, packageRoot).replaceAll("\\", "/") !==
      "packages/arcanea-skills"
  )
    throw new Error("Require the canonical packages/arcanea-skills root");
  if (git(root, ["remote", "get-url", "origin"]).toString().trim() !== ORIGIN)
    throw new Error("Unexpected source repository origin");
  if (git(root, ["rev-parse", "HEAD"]).toString().trim() !== sourceCommit)
    throw new Error("Source commit does not match checkout HEAD");

  const catalog = loadCatalog(packageRoot);
  const sources = validateSources(packageRoot, catalog);
  const ready = selectReady(catalog);
  if (!ready.length) {
    const error = new Error(
      "No skill is cleared for a public plugin; no output created",
    );
    error.exitCode = 2;
    throw error;
  }
  function pinnedBytes(relativePath) {
    const file = path.join(packageRoot, relativePath);
    const fileStat = fs.lstatSync(file);
    if (!fileStat.isFile() || fileStat.isSymbolicLink())
      throw new Error(`Unsafe source file: ${relativePath}`);
    const bytes = fs.readFileSync(file);
    const gitPath = path.relative(root, file).replaceAll("\\", "/");
    const committed = git(root, ["show", `${sourceCommit}:${gitPath}`]);
    if (!bytes.equals(committed))
      throw new Error(
        `Source bytes differ from pinned commit: ${relativePath}`,
      );
    return bytes;
  }
  const catalogBytes = pinnedBytes("catalog.json");
  if (!json(catalog).equals(json(JSON.parse(catalogBytes))))
    throw new Error("Catalog changed during planning");
  const files = [];
  const passports = ready.map((skill) => {
    const source = sources.find((row) => row.name === skill.name);
    const hash = createHash("sha256");
    const members = source.files.map((file) => {
      const bytes = pinnedBytes(`${skill.path}/${file}`);
      const sha256 = digest(bytes);
      hash.update(`${file}\0${sha256}\n`);
      files.push({ path: `skills/${skill.name}/${file}`, bytes });
      return { path: file, sha256 };
    });
    if (hash.digest("hex") !== skill.contentSha256)
      throw new Error(`Reviewed snapshot changed: ${skill.name}`);
    return {
      name: skill.name,
      contentSha256: skill.contentSha256,
      rights: skill.rights,
      evaluation: skill.evaluation,
      review: skill.review,
      files: members,
    };
  });
  const manifest = {
    name: "arcanea",
    version: `1.0.0-${sourceCommit.slice(0, 12)}`,
    description: "Catalog-ready Arcanea creator workflows",
    author: { name: "FrankX", url: "https://arcanea.ai" },
    repository: "https://github.com/frankxai/arcanea-ai-app",
    homepage: "https://arcanea.ai",
  };
  const receipt = {
    schema: "arcanea.plugin-build.v1",
    generator: "arcanea-skills/plugin-v1",
    generatorSha256: digest(fs.readFileSync(__filename)),
    catalogValidatorSha256: digest(
      fs.readFileSync(path.join(__dirname, "catalog.cjs")),
    ),
    source: {
      repository: ORIGIN,
      commit: sourceCommit,
      root: "packages/arcanea-skills",
      catalogSha256: digest(catalogBytes),
    },
    skills: passports,
    scope:
      "Catalog declarations checked, not authenticated rights or reviewer authority. Source commit covers selected input bytes; generator hashes identify the executing implementation. No publication approval.",
  };
  files.push({ path: "release.json", bytes: json(receipt) });
  files.push({ path: ".claude-plugin/plugin.json", bytes: json(manifest) });
  return {
    files: files.sort((a, b) => a.path.localeCompare(b.path, "en")),
    receipt,
  };
}

function checkOutput(output) {
  output = path.resolve(output);
  if (fs.existsSync(output))
    throw new Error(
      "Output already exists; preserve it and choose a new directory",
    );
  // lstat also catches a dangling link that existsSync would miss.
  try {
    fs.lstatSync(output);
    throw new Error("Output already exists");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  for (let parent = path.dirname(output); ; parent = path.dirname(parent)) {
    const stat = fs.lstatSync(parent);
    if (!stat.isDirectory() || stat.isSymbolicLink())
      throw new Error(`Unsafe output parent: ${parent}`);
    if (path.dirname(parent) === parent) break;
  }
  return output;
}

function materializePlugin(plan, output, { dryRun = false } = {}) {
  output = checkOutput(output);
  if (dryRun)
    return {
      pluginRoot: path.join(output, "plugin"),
      files: plan.files.length,
      written: false,
    };
  fs.mkdirSync(output); // Exclusive reservation: existing outputs are never updated.
  const staging = path.join(output, ".staging");
  fs.mkdirSync(staging);
  // A partial failure preserves only this new wrapper. The final plugin path
  // is absent until all bytes are complete. Retry uses a new output directory.
  // Requires a trusted stable destination parent and one writer; no claim of
  // crash-safe durability or protection against malicious parent replacement.
  for (const file of plan.files) {
    const target = path.join(staging, file.path);
    if (!contained(staging, target))
      throw new Error("Output path escapes plugin");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.bytes, { flag: "wx" });
  }
  const pluginRoot = path.join(output, "plugin");
  fs.renameSync(staging, pluginRoot);
  return { pluginRoot, files: plan.files.length, written: true };
}

module.exports = { preparePlugin, materializePlugin };
