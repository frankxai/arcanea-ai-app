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
  canonicalBytes,
} = require("./catalog.cjs");

const ORIGIN = "https://github.com/frankxai/arcanea-ai-app.git";
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (value) => Buffer.from(JSON.stringify(value, null, 2) + "\n");

function validateYamlPin(packageBytes, resolvedVersion) {
  const pin = JSON.parse(packageBytes).dependencies?.yaml;
  if (!/^\d+\.\d+\.\d+$/.test(pin ?? "") || resolvedVersion !== pin)
    throw new Error(
      `YAML dependency differs from pinned package: require ${pin}, resolved ${resolvedVersion}`,
    );
}

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
  const origin = git(root, ["config", "--get", "remote.origin.url"])
    .toString()
    .trim();
  const canonicalOrigin = origin
    .replace(/^git@github\.com:/i, "https://github.com/")
    .replace(/^ssh:\/\/git@github\.com\//i, "https://github.com/")
    .replace(/\/?(?:\.git)?\/?$/, "")
    .toLowerCase();
  if (canonicalOrigin !== "https://github.com/frankxai/arcanea-ai-app")
    throw new Error("Unexpected source repository origin");
  if (git(root, ["rev-parse", "HEAD"]).toString().trim() !== sourceCommit)
    throw new Error("Source commit does not match checkout HEAD");

  // The configured origin identifies a repository, not remote authentication.
  // Use immutable blob bytes. Accept CRLF checkout conversion for text only;
  // substantive edits and arbitrary Git clean filters are never accepted/run.
  const snapshot = new Map();
  function pinned(relativePath) {
    if (snapshot.has(relativePath)) return snapshot.get(relativePath);
    const file = path.join(packageRoot, relativePath);
    const fileStat = fs.lstatSync(file);
    if (!fileStat.isFile() || fileStat.isSymbolicLink())
      throw new Error(`Unsafe source file: ${relativePath}`);
    const gitPath = path.relative(root, file).replaceAll("\\", "/");
    const entry = git(root, ["ls-tree", "-z", sourceCommit, "--", gitPath])
      .toString()
      .split("\0")[0];
    const mode = entry.match(/^(100644|100755) blob [a-f0-9]{40}\t/)?.[1];
    if (!mode || entry.split("\t")[1] !== gitPath)
      throw new Error(`Unsupported or untracked source mode: ${relativePath}`);
    const bytes = fs.readFileSync(file);
    const blob = git(root, ["show", `${sourceCommit}:${gitPath}`]);
    if (!canonicalBytes(relativePath, blob).equals(blob))
      throw new Error(`Committed text must use LF: ${relativePath}`);
    if (
      !bytes.equals(blob) &&
      !canonicalBytes(relativePath, bytes).equals(
        canonicalBytes(relativePath, blob),
      )
    )
      throw new Error(
        `Source bytes differ from pinned commit: ${relativePath}`,
      );
    const value = { bytes: blob, mode };
    snapshot.set(relativePath, value);
    return value;
  }
  const engines = [
    "bin/plugin.js",
    "scripts/plugin.cjs",
    "scripts/catalog.cjs",
    "package.json",
    ".gitattributes",
  ];
  const engineHashes = Object.fromEntries(
    engines.map((file) => [file, digest(pinned(file).bytes)]),
  );
  // Refuse a different executing implementation even when testing another root.
  for (const file of engines) {
    const executing = fs.readFileSync(path.join(__dirname, "..", file));
    const normalized = canonicalBytes(file, executing);
    if (
      !executing.equals(pinned(file).bytes) &&
      !normalized.equals(pinned(file).bytes)
    )
      throw new Error(
        `Executing implementation differs from pinned commit: ${file}`,
      );
  }
  const catalogBytes = pinned("catalog.json").bytes;
  const yamlVersion = require("yaml/package.json").version;
  validateYamlPin(pinned("package.json").bytes, yamlVersion);
  const catalog = loadCatalog(packageRoot);
  if (!json(catalog).equals(json(JSON.parse(catalogBytes))))
    throw new Error("Catalog changed during planning");
  const ready = selectReady(catalog);
  if (!ready.length) {
    const error = new Error(
      "No skill is cleared for a public plugin; no output created",
    );
    error.exitCode = 2;
    throw error;
  }
  const readPinned = (file) =>
    pinned(path.relative(packageRoot, file).replaceAll("\\", "/")).bytes;
  for (const skill of ready)
    validatePortablePaths([`skills/${skill.name}/SKILL.md`], skill.name);
  const sources = validateSources(packageRoot, catalog, readPinned);
  const files = [];
  const passports = ready.map((skill) => {
    const source = sources.find((row) => row.name === skill.name);
    const gitPrefix =
      path
        .relative(root, path.join(packageRoot, skill.path))
        .replaceAll("\\", "/") + "/";
    const entries = git(root, ["ls-tree", "-rz", sourceCommit, "--", gitPrefix])
      .toString()
      .split("\0")
      .filter(Boolean);
    const paths = entries
      .map((entry) => entry.split("\t")[1].slice(gitPrefix.length))
      .sort();
    validatePortablePaths(
      paths.map((file) => `skills/${skill.name}/${file}`),
      skill.name,
    );
    if (JSON.stringify(paths) !== JSON.stringify(source.files))
      throw new Error(
        `Committed and checkout file lists differ: ${skill.name}`,
      );
    const members = source.files.map((file) => {
      const { bytes, mode } = pinned(`${skill.path}/${file}`);
      if (mode !== "100644")
        throw new Error(
          `Executable support files require mode-bound review; refused: ${skill.name}/${file}`,
        );
      const sha256 = digest(bytes);
      files.push({ path: `skills/${skill.name}/${file}`, bytes, mode });
      return { path: file, sha256, mode };
    });
    return { ...skill, files: members };
  });
  const manifest = {
    name: "arcanea-creator-skills",
    version: `1.0.0-g${sourceCommit.slice(0, 12)}`,
    description: "Catalog-ready Arcanea creator workflows",
    author: { name: "FrankX", url: "https://arcanea.ai" },
    repository: "https://github.com/frankxai/arcanea-ai-app",
    homepage: "https://arcanea.ai",
  };
  const receipt = {
    schema: "arcanea.plugin-build.v1",
    generator: "arcanea-skills/plugin-v1",
    engineHashes,
    yamlVersion,
    source: {
      repository: ORIGIN,
      commit: sourceCommit,
      root: "packages/arcanea-skills",
      catalogSha256: digest(catalogBytes),
    },
    skills: passports,
    scope:
      "Commit-bound source and generator bytes, declared passports, resolved YAML version. Origin is configured identity, not remote authentication. No authenticated rights/reviewer or publication approval.",
  };
  files.push({ path: "release.json", bytes: json(receipt), mode: "100644" });
  files.push({
    path: ".claude-plugin/plugin.json",
    bytes: json(manifest),
    mode: "100644",
  });
  return {
    sourceRoot: packageRoot,
    repositoryRoot: root,
    files: files.sort((a, b) =>
      a.path < b.path ? -1 : a.path > b.path ? 1 : 0,
    ),
    receipt,
  };
}

function validatePortablePaths(paths, skillName) {
  const seen = new Map();
  for (const file of paths) {
    const segments = file.split("/");
    if (
      segments.some(
        (part) =>
          !part ||
          /[\\:<>"|?*\x00-\x1f]/.test(part) ||
          /[. ]$/.test(part) ||
          /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
      )
    )
      throw new Error(`Nonportable support path: ${skillName}/${file}`);
    for (let i = 1; i <= segments.length; i++) {
      const prefix = segments.slice(0, i).join("/");
      const folded = prefix.toLowerCase();
      if (seen.has(folded) && seen.get(folded) !== prefix)
        throw new Error(`Case-colliding support paths: ${skillName}/${file}`);
      seen.set(folded, prefix);
    }
  }
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
  if (
    contained(plan.sourceRoot, output) ||
    [
      ".git",
      ".claude",
      ".claude-plugin",
      "skills",
      "commands",
      "agents",
      "hooks",
    ].some((directory) =>
      contained(path.join(plan.repositoryRoot, directory), output),
    )
  )
    throw new Error("Output overlaps canonical source or compiler directories");
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
    fs.writeFileSync(target, file.bytes, {
      flag: "wx",
      mode: file.mode === "100755" ? 0o755 : 0o644,
    });
    if (process.platform !== "win32")
      fs.chmodSync(target, file.mode === "100755" ? 0o755 : 0o644);
  }
  const pluginRoot = path.join(output, "plugin");
  fs.renameSync(staging, pluginRoot);
  return { pluginRoot, files: plan.files.length, written: true };
}

module.exports = {
  preparePlugin,
  materializePlugin,
  validatePortablePaths,
  validateYamlPin,
};
