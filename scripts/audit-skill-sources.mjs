#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const git = (cwd, args, options = {}) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    timeout: 30000,
    ...options,
  });

// This is an inventory, not a YAML validator or a redistribution clearance.
export function skillName(text) {
  const frontmatter = text
    .replace(/^\uFEFF/, "")
    .match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!frontmatter) return null;
  const values = [...frontmatter.matchAll(/^name:[ \t]*(.*?)[ \t]*$/gm)];
  if (values.length !== 1) return null;
  const value = values[0][1].replace(/^(['"])(.*)\1$/, "$2");
  return /^[a-z0-9][a-z0-9_.-]*$/.test(value) ? value : null;
}

export function summarize(entries) {
  const byName = new Map();
  const roots = new Map();
  for (const entry of entries) {
    roots.set(entry.root, (roots.get(entry.root) ?? 0) + 1);
    if (entry.name)
      byName.set(entry.name, [...(byName.get(entry.name) ?? []), entry]);
  }
  return {
    files: entries.length,
    namedFiles: entries.filter((entry) => entry.name).length,
    uniqueNames: byName.size,
    roots: Object.fromEntries([...roots].sort(([a], [b]) => compare(a, b))),
    duplicates: [...byName]
      .filter(([, rows]) => rows.length > 1)
      .sort(([a], [b]) => compare(a, b))
      .map(([name, rows]) => ({
        name,
        identicalSkillText: new Set(rows.map((row) => row.sha256)).size === 1,
        paths: rows.map((row) => row.path).sort(compare),
      })),
  };
}

const rootOf = (path) => {
  const roots = [
    "packages/arcanea-skills/skills",
    "arcanea-skills-opensource",
    ".claude/skills",
    ".arcanea/skills",
    "oss/skills",
    "skills",
  ];
  return (
    roots.find((root) => path.startsWith(`${root}/`)) ?? path.split("/")[0]
  );
};

export function auditSnapshot({
  cwd = process.cwd(),
  ref = "HEAD",
  root = "",
} = {}) {
  if (
    root &&
    (root.startsWith("/") ||
      root.includes("\\") ||
      root.includes(":") ||
      root.split("/").some((part) => !part || part === "." || part === ".."))
  ) {
    throw new Error(
      "root must be a repository-relative directory without traversal",
    );
  }
  const commit = git(cwd, [
    "rev-parse",
    "--verify",
    "--end-of-options",
    `${ref}^{commit}`,
  ]).trim();
  if (!/^[0-9a-f]{40}$/.test(commit))
    throw new Error("expected a full commit SHA");
  const tree = git(cwd, ["ls-tree", "-rz", "--full-tree", commit])
    .split("\0")
    .filter(Boolean)
    .map((row) => {
      const [mode, type, blob, path] = row
        .match(/^(\d+) (\w+) ([0-9a-f]+)\t([\s\S]+)$/)
        .slice(1);
      return { mode, type, blob, path };
    });
  const licenses = tree
    .filter(
      (row) =>
        row.type === "blob" &&
        row.mode !== "120000" &&
        /^(?:licen[sc]e|copying)(?:[._-].*)?$/i.test(posix.basename(row.path)),
    )
    .map((row) => row.path)
    .sort(compare);
  const skills = tree
    .filter(
      (row) =>
        row.type === "blob" &&
        posix.basename(row.path) === "SKILL.md" &&
        (!root || row.path.startsWith(`${root}/`)),
    )
    .sort((a, b) => compare(a.path, b.path));
  if (root && !tree.some((row) => row.path.startsWith(`${root}/`))) {
    throw new Error(`root does not exist at ${commit}: ${root}`);
  }
  const blobs = [...new Set(skills.map((row) => row.blob))];
  const bytes = blobs.length
    ? git(cwd, ["cat-file", "--batch"], {
        encoding: null,
        input: Buffer.from(`${blobs.join("\n")}\n`),
      })
    : Buffer.alloc(0);
  let offset = 0;
  const contents = new Map();
  for (const blob of blobs) {
    const newline = bytes.indexOf(10, offset);
    const [id, type, sizeText] = bytes
      .subarray(offset, newline)
      .toString("utf8")
      .split(" ");
    const size = Number(sizeText);
    if (
      id !== blob ||
      type !== "blob" ||
      !Number.isSafeInteger(size) ||
      size < 0 ||
      newline + 1 + size >= bytes.length ||
      bytes[newline + 1 + size] !== 10
    ) {
      throw new Error("invalid git blob response");
    }
    contents.set(blob, bytes.subarray(newline + 1, newline + 1 + size));
    offset = newline + size + 2;
  }
  const entries = skills.map((row) => {
    const bytes = contents.get(row.blob);
    const name =
      row.mode === "120000" ? null : skillName(bytes.toString("utf8"));
    return {
      path: row.path,
      root: rootOf(row.path),
      name,
      blob: row.blob,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      review:
        row.mode === "120000"
          ? "symlink-unresolved"
          : name
            ? "unreviewed"
            : "name-needs-review",
      ancestorLicenseFiles: licenses.filter((license) => {
        const parent = posix.dirname(license);
        return parent === "." || row.path.startsWith(`${parent}/`);
      }),
    };
  });
  return {
    schema: "arcanea.skill-source-audit.v1",
    commit,
    root: root || null,
    scope:
      "All tracked SKILL.md paths in a committed snapshot; not installer discovery.",
    rights:
      "License paths are evidence to review, not a license grant or clearance.",
    rootLicenseFiles: licenses.filter((path) => !path.includes("/")),
    ...summarize(entries),
    entries,
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const options = {};
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i += 2) {
      if (!["--ref", "--root"].includes(args[i]) || !args[i + 1]) {
        throw new Error(
          "usage: node scripts/audit-skill-sources.mjs [--ref commit] [--root directory]",
        );
      }
      options[args[i].slice(2)] = args[i + 1];
    }
    process.stdout.write(
      `${JSON.stringify(auditSnapshot(options), null, 2)}\n`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
