"use strict";

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { createHash } = require("node:crypto");

const DEFAULT_SOURCE = path.join(__dirname, "..", "skills");
const MAX_BYTES = 32 * 1024 * 1024;
const MAX_FILES = 4096;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function info(file) {
  try {
    return fs.lstatSync(file);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function ordinaryAncestors(file) {
  let current = path.resolve(file);
  while (true) {
    const item = info(current);
    if (item && (item.isSymbolicLink() || !item.isDirectory())) {
      throw new Error(
        `Expected an ordinary directory, not a link or file: ${current}`,
      );
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

function inside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) &&
      relative !== ".." &&
      !path.isAbsolute(relative))
  );
}

function inventory(root) {
  ordinaryAncestors(root);
  if (!info(root)) throw new Error(`Skill directory is missing: ${root}`);
  const files = [];
  let totalBytes = 0;
  let directoryCount = 0;
  function visit(directory, prefix = "", depth = 0) {
    if (depth > 32 || ++directoryCount > MAX_FILES)
      throw new Error(
        `Skill directory tree exceeds the bounded limit: ${root}`,
      );
    for (const entry of fs.readdirSync(directory).sort()) {
      const absolute = path.join(directory, entry);
      const relative = prefix ? `${prefix}/${entry}` : entry;
      const item = fs.lstatSync(absolute);
      if (item.isSymbolicLink())
        throw new Error(`Links and junctions are not installable: ${absolute}`);
      if (item.isDirectory()) {
        visit(absolute, relative, depth + 1);
        continue;
      }
      if (!item.isFile())
        throw new Error(`Not a regular skill file: ${absolute}`);
      totalBytes += item.size;
      if (totalBytes > MAX_BYTES || files.length >= MAX_FILES)
        throw new Error(`Skill exceeds the bounded inventory limit: ${root}`);
      const data = fs.readFileSync(absolute);
      files.push({
        relative,
        data,
        sha256: createHash("sha256").update(data).digest("hex"),
      });
    }
  }
  visit(root);
  if (!files.some((file) => file.relative === "SKILL.md"))
    throw new Error(`Missing SKILL.md: ${root}`);
  return files;
}

function availableSkills(sourceRoot = DEFAULT_SOURCE) {
  const source = path.resolve(sourceRoot);
  ordinaryAncestors(source);
  if (!info(source)) throw new Error(`Skill bundle is missing: ${source}`);
  const names = fs.readdirSync(source).sort();
  if (!names.length) throw new Error("The skill bundle is empty");
  for (const name of names) {
    const directory = path.join(source, name);
    if (!slug.test(name))
      throw new Error(`Invalid bundled skill directory: ${name}`);
    ordinaryAncestors(directory);
    const entry = info(path.join(directory, "SKILL.md"));
    if (!entry || !entry.isFile() || entry.isSymbolicLink())
      throw new Error(`Missing regular SKILL.md for ${name}`);
  }
  return names;
}

function planInstallation({
  sourceRoot = DEFAULT_SOURCE,
  target,
  skills,
  all = false,
} = {}) {
  const source = path.resolve(sourceRoot);
  const destination = path.resolve(
    target ?? path.join(os.homedir(), ".claude", "skills"),
  );
  if (
    destination === path.parse(destination).root ||
    destination === path.resolve(os.homedir())
  ) {
    throw new Error(
      "Choose an exact skill registry, not the drive or home root",
    );
  }
  if (inside(source, destination) || inside(destination, source))
    throw new Error("Source and destination may not overlap");
  ordinaryAncestors(destination);
  const available = availableSkills(source);
  if (all && skills?.length)
    throw new Error("Choose either --all or named skills");
  const selected = all ? available : skills;
  if (!Array.isArray(selected) || !selected.length)
    throw new Error("Select --all or at least one --skill");
  if (new Set(selected).size !== selected.length)
    throw new Error("Duplicate skill selection");
  const items = selected.map((name) => {
    if (
      typeof name !== "string" ||
      !slug.test(name) ||
      !available.includes(name)
    )
      throw new Error(`Unknown bundled skill: ${name}`);
    const files = inventory(path.join(source, name));
    const directory = path.join(destination, name);
    let state = "install";
    if (info(directory)) {
      const existing = inventory(directory);
      const same =
        existing.length === files.length &&
        existing.every(
          (file, index) =>
            file.relative === files[index].relative &&
            file.data.equals(files[index].data),
        );
      if (!same)
        throw new Error(
          `Existing skill differs; preserved without changes: ${directory}`,
        );
      state = "unchanged";
    }
    return { name, directory, state, files };
  });
  return { source, destination, items };
}

function publicReport(plan, mode) {
  return {
    schemaVersion: "arcanea.skills-install.v1",
    mode,
    destination: plan.destination,
    skills: plan.items.map((item) => ({
      name: item.name,
      state:
        item.state === "install" && mode === "applied"
          ? "installed"
          : item.state,
      files: item.files.map((file) => ({
        path: file.relative,
        bytes: file.data.length,
        sha256: file.sha256,
      })),
    })),
  };
}

function installSkills(options = {}) {
  // Inspect every selected source and destination before creating anything.
  const plan = planInstallation(options);
  if (options.dryRun) return publicReport(plan, "dry-run");
  const addedFiles = [];
  const addedDirectories = [];
  function mkdir(directory) {
    ordinaryAncestors(path.dirname(directory));
    if (info(directory)) {
      ordinaryAncestors(directory);
      return;
    }
    const parent = path.dirname(directory);
    if (!info(parent)) mkdir(parent);
    fs.mkdirSync(directory);
    addedDirectories.push(directory);
  }
  try {
    for (const item of plan.items.filter((item) => item.state === "install")) {
      mkdir(plan.destination);
      ordinaryAncestors(plan.destination);
      // Exclusive reservation: never adopt a directory created after planning.
      fs.mkdirSync(item.directory);
      addedDirectories.push(item.directory);
      // Publish the entrypoint last, after its reference files exist.
      const ordered = [...item.files].sort(
        (a, b) =>
          Number(a.relative === "SKILL.md") - Number(b.relative === "SKILL.md"),
      );
      for (const file of ordered) {
        const output = path.join(item.directory, file.relative);
        mkdir(path.dirname(output));
        ordinaryAncestors(path.dirname(output));
        fs.writeFileSync(output, file.data, { flag: "wx" });
        addedFiles.push({ output, data: file.data });
      }
    }
    for (const item of plan.items) {
      const current = inventory(item.directory);
      if (
        current.length !== item.files.length ||
        current.some(
          (file, index) =>
            file.relative !== item.files[index].relative ||
            !file.data.equals(item.files[index].data),
        )
      ) {
        throw new Error(`Post-install verification failed: ${item.name}`);
      }
    }
  } catch (error) {
    // Roll back only bytes created here and still unchanged; never recursive-delete.
    for (const { output, data } of addedFiles.reverse()) {
      try {
        ordinaryAncestors(path.dirname(output));
        const item = info(output);
        if (
          item?.isFile() &&
          !item.isSymbolicLink() &&
          fs.readFileSync(output).equals(data)
        )
          fs.unlinkSync(output);
      } catch {
        /* Preserve anything whose ownership is now uncertain. */
      }
    }
    for (const directory of addedDirectories.reverse()) {
      try {
        ordinaryAncestors(directory);
        fs.rmdirSync(directory);
      } catch {
        /* Nonempty or replaced directories belong to the user. */
      }
    }
    throw error;
  }
  return publicReport(plan, "applied");
}

module.exports = { availableSkills, planInstallation, installSkills };
