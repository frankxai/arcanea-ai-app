#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const order = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const key = (entry) => `${entry.type}:${entry.object}`;
const categories = [
  "same-path-same-object-mode",
  "same-path-diverged",
  "path-only-object-elsewhere",
  "path-only-object-absent",
];

function validateEntries(entries) {
  const paths = new Set();
  for (const entry of entries) {
    const validMode =
      (entry.type === "blob" &&
        ["100644", "100755", "120000"].includes(entry.mode)) ||
      (entry.type === "commit" && entry.mode === "160000");
    if (
      !validMode ||
      !/^[0-9a-f]{40}$/.test(entry.object) ||
      typeof entry.path !== "string" ||
      !entry.path ||
      entry.path.includes("\0") ||
      entry.path
        .split("/")
        .some((part) => !part || part === "." || part === "..") ||
      paths.has(entry.path)
    ) {
      throw new Error("Invalid or duplicate Git tree entry");
    }
    paths.add(entry.path);
  }
}

export function parseTree(bytes) {
  // Git paths are NUL-delimited. Tabs, newlines, spaces and Unicode stay intact.
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (text && !text.endsWith("\0")) {
    throw new Error("Incomplete Git tree response");
  }
  const entries = text
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const match = line.match(
        /^(\d{6}) (blob|commit) ([0-9a-f]{40})\t([\s\S]+)$/,
      );
      if (!match) throw new Error("Invalid Git tree response");
      return {
        mode: match[1],
        type: match[2],
        object: match[3],
        path: match[4],
      };
    });
  validateEntries(entries);
  return entries.sort((a, b) => order(a.path, b.path));
}

export function readSnapshot(repo, commit) {
  if (!/^[0-9a-f]{40}$/.test(commit)) {
    throw new Error("Use a full, lowercase 40-character commit SHA");
  }
  const git = (args) =>
    execFileSync("git", ["--no-replace-objects", ...args], {
      cwd: resolve(repo),
      maxBuffer: 32 * 1024 * 1024,
      timeout: 30000,
      env: { ...process.env, GIT_NO_LAZY_FETCH: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
  const resolved = git([
    "rev-parse",
    "--verify",
    "--end-of-options",
    `${commit}^{commit}`,
  ])
    .toString("utf8")
    .trim();
  if (resolved !== commit)
    throw new Error("Requested object is not that commit");
  return {
    commit,
    entries: parseTree(git(["ls-tree", "-rz", "--full-tree", commit])),
  };
}

export function compareTrees(source, target) {
  validateEntries(source);
  validateEntries(target);
  const byPath = new Map(target.map((entry) => [entry.path, entry]));
  const sourcePaths = new Set(source.map((entry) => entry.path));
  const byObject = new Map();
  for (const entry of target) {
    const object = key(entry);
    if (!byObject.has(object)) byObject.set(object, []);
    byObject.get(object).push(entry);
  }
  const counts = Object.fromEntries(
    categories.map((category) => [category, 0]),
  );
  const absentRoots = new Map();
  const absentObjects = new Set();
  const entries = [...source]
    .sort((a, b) => order(a.path, b.path))
    .map((entry) => {
      const samePath = byPath.get(entry.path);
      // A missing lookup must never mutate the target index. Repeated missing
      // source objects are still missing, even after their first occurrence.
      const identical = byObject.get(key(entry)) ?? [];
      const category = samePath
        ? key(entry) === key(samePath) && entry.mode === samePath.mode
          ? categories[0]
          : categories[1]
        : identical.length
          ? categories[2]
          : categories[3];
      counts[category]++;
      if (!identical.length) absentObjects.add(key(entry));
      if (category === categories[3]) {
        const root = entry.path.split("/")[0];
        absentRoots.set(root, (absentRoots.get(root) ?? 0) + 1);
      }
      return {
        ...entry,
        category,
        targetSamePath: samePath ?? null,
        identicalObjectTargets: identical
          .map(({ path, mode }) => ({ path, mode }))
          .sort((a, b) => order(a.path, b.path)),
      };
    });
  return {
    sourceEntries: source.length,
    targetEntries: target.length,
    counts,
    targetOnlyPaths: target.filter((entry) => !sourcePaths.has(entry.path))
      .length,
    sourceObjectsAbsentFromTarget: absentObjects.size,
    sourcePathsWithAbsentObjects: entries.filter(
      (entry) => !entry.identicalObjectTargets.length,
    ).length,
    specialSourceEntries: source.filter(
      (entry) => !["100644", "100755"].includes(entry.mode),
    ).length,
    pathOnlyAbsentRoots: Object.fromEntries(
      [...absentRoots].sort(([a], [b]) => order(a, b)),
    ),
    entries,
  };
}

export function auditRepos({ sourceRepo, sourceRef, targetRepo, targetRef }) {
  const source = readSnapshot(sourceRepo, sourceRef);
  const target = readSnapshot(targetRepo, targetRef);
  return {
    schemaVersion: 1,
    sourceCommit: source.commit,
    targetCommit: target.commit,
    scope:
      "Git object/type/mode identity only. No semantic, rights, consumer, canon, archive or release approval. Symlinks and Gitlinks are recorded, never followed.",
    ...compareTrees(source.entries, target.entries),
  };
}

export function parseArgs(args) {
  const names = new Map([
    ["--source-repo", "sourceRepo"],
    ["--source-ref", "sourceRef"],
    ["--target-repo", "targetRepo"],
    ["--target-ref", "targetRef"],
  ]);
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    const name = names.get(args[i]);
    const value = args[i + 1];
    if (!name || name in result || !value || value.startsWith("--")) {
      throw new Error("Expected each source/target repo and ref exactly once");
    }
    result[name] = value;
  }
  if (Object.keys(result).length !== names.size) {
    throw new Error("Both repository paths and full commit SHAs are required");
  }
  return result;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const report = auditRepos(parseArgs(process.argv.slice(2)));
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`Salvage audit refused: ${error.message}\n`);
    process.exitCode = 1;
  }
}
