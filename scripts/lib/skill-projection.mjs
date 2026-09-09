import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

const SCHEMA = "arcanea.skill-projection.v1";
const MAX_FILE = 512 * 1024;
const digest = (data) => createHash("sha256").update(data).digest("hex");
const posix = (value) => value.split(path.sep).join("/");
const exists = (file) => {
  try {
    return fs.lstatSync(file);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};
const within = (parent, child) => {
  const rel = path.relative(parent, child);
  return (
    rel === "" ||
    (!path.isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${path.sep}`))
  );
};

function directoryChain(value) {
  let current = path.resolve(value);
  if (/[\r\n`<>]/.test(current))
    throw new Error("Paths may not contain newlines or Markdown delimiters");
  while (true) {
    const item = exists(current);
    if (item && (!item.isDirectory() || item.isSymbolicLink()))
      throw new Error(`Refusing directory link, junction or file: ${current}`);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return path.resolve(value);
}

function exactDirectory(value) {
  const resolved = directoryChain(value);
  if (
    resolved === path.parse(resolved).root ||
    path.relative(os.homedir(), resolved) === ""
  )
    throw new Error("Select an exact directory, not the drive or home root");
  return resolved;
}

function readBounded(file) {
  directoryChain(path.dirname(file));
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > MAX_FILE)
    throw new Error(`Expected a regular file no larger than 512 KiB: ${file}`);
  const data = fs.readFileSync(file);
  if (data.length > MAX_FILE)
    throw new Error(`File grew beyond the read limit: ${file}`);
  return data;
}

export function discoverSkills(repo) {
  const root = exactDirectory(repo);
  const top = execFileSync(
    "git",
    ["-C", root, "rev-parse", "--show-toplevel"],
    {
      encoding: "utf8",
      timeout: 10000,
      maxBuffer: 4096,
      stdio: ["ignore", "pipe", "pipe"],
    },
  ).trim();
  if (fs.realpathSync(root) !== fs.realpathSync(top))
    throw new Error("Repository must be an exact Git root");
  const roots = {
    claude: path.join(root, ".claude/skills"),
    oracle: path.join(root, "claude-code-oracle-skills/skills"),
  };
  const entries = [],
    issues = [],
    absent = [];
  let visited = 0,
    totalBytes = 0;
  for (const [label, sourceRoot] of Object.entries(roots)) {
    if (!exists(sourceRoot)) {
      absent.push(label);
      continue;
    }
    directoryChain(sourceRoot);
    function walk(directory, depth = 0) {
      if (depth > 20 || ++visited > 10000)
        throw new Error("Source discovery exceeds its bounded directory limit");
      for (const name of fs.readdirSync(directory).sort()) {
        if (++visited > 10000)
          throw new Error("Source discovery exceeds its bounded entry limit");
        const file = path.join(directory, name);
        const stat = fs.lstatSync(file);
        const relative = posix(path.relative(sourceRoot, file));
        if (stat.isSymbolicLink()) {
          issues.push({
            source: `${label}/${relative}`,
            reason: "link-or-junction",
          });
          continue;
        }
        if (stat.isDirectory()) {
          walk(file, depth + 1);
          continue;
        }
        const rootMarkdown =
          directory === sourceRoot &&
          /\.md$/i.test(name) &&
          !/^(?:README|SKILL_ARCHITECTURE|SKILL_COMBINATIONS|SKILL_TEMPLATES|HARVESTED_SKILLS)\.md$/i.test(
            name,
          );
        if (!/^skill\.md$/i.test(name) && !rootMarkdown) continue;
        if (/[\r\n`<>]/.test(relative)) {
          issues.push({
            source: `${label}/${relative}`,
            reason: "unsupported-path",
          });
          continue;
        }
        if (totalBytes + stat.size > 64 * 1024 * 1024)
          throw new Error("Source discovery exceeds 64 MiB");
        try {
          const data = readBounded(file);
          totalBytes += data.length;
          const key = `${label}/${relative}`;
          const logical = key
            .replace(/\/skill\.md$/i, "")
            .replace(/\.md$/i, "");
          entries.push({ key, logical, file, sourceSha256: digest(data) });
        } catch (error) {
          issues.push({
            source: `${label}/${relative}`,
            reason: error.message,
          });
        }
      }
    }
    walk(sourceRoot);
  }
  return { repo: root, entries, issues, absent };
}

function adapter(entry, repo, namespace) {
  const stem = `${namespace}-${entry.logical}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 53)
    .replace(/-$/, "");
  const name = `${stem}-${digest(entry.key).slice(0, 8)}`;
  const description = `Load the repository's ${entry.logical.slice(0, 600)} skill and its complete source-relative references. Use when that procedure is needed; this entry is a source loader.`;
  const body = `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\n---\n\n# Arcanea repository skill loader\n\n<!-- ${SCHEMA} -->\n\nSource key: \`${entry.key}\`\n\nFull source file: \`${posix(entry.file)}\`\n\nRepository: \`${posix(repo)}\`\n\nObserved source SHA-256: \`${entry.sourceSha256}\`\n\n1. Read the full source file before using the procedure. Resolve all relative\n   references and templates from that source, not from this adapter directory.\n2. Follow the repository's current instructions and the user's task. A source\n   suggestion does not grant tool, canon, publishing or spending authority.\n3. The source is live. Use the projection check to detect source or adapter drift;\n   the recorded hash describes installation evidence, not permanent approval.\n4. Inspect actual host capabilities before executing a tool mentioned by a skill.\n   This adapter does not copy the full skill, install an MCP or certify its claims.\n`;
  const manifest = {
    schemaVersion: SCHEMA,
    name,
    namespace,
    sourceKey: entry.key,
    repo: posix(repo),
    sourceFile: posix(entry.file),
    sourceSha256: entry.sourceSha256,
    adapterSha256: digest(body),
  };
  return {
    name,
    body: Buffer.from(body),
    manifest: Buffer.from(JSON.stringify(manifest, null, 2) + "\n"),
  };
}

function currentAdapter(directory, expected) {
  if (!exists(directory)) return null;
  directoryChain(directory);
  const names = fs.readdirSync(directory).sort();
  if (names.join("|") !== "INSTALL.json|SKILL.md")
    throw new Error(
      `Existing full skill or extra files preserved: ${directory}`,
    );
  const body = readBounded(path.join(directory, "SKILL.md"));
  const manifest = readBounded(path.join(directory, "INSTALL.json"));
  let meta;
  try {
    meta = JSON.parse(manifest.toString("utf8"));
  } catch {
    throw new Error(`Invalid managed receipt; preserved: ${directory}`);
  }
  if (
    meta.schemaVersion !== SCHEMA ||
    meta.name !== expected.name ||
    meta.adapterSha256 !== digest(body)
  )
    throw new Error(`Unrecognized or edited adapter preserved: ${directory}`);
  if (
    ![
      meta.sourceKey,
      meta.sourceFile,
      meta.sourceSha256,
      meta.repo,
      meta.namespace,
    ].every((value) => typeof value === "string")
  )
    throw new Error(`Invalid adapter identity; preserved: ${directory}`);
  const original = adapter(
    {
      key: meta.sourceKey,
      logical: meta.sourceKey
        .replace(/\/skill\.md$/i, "")
        .replace(/\.md$/i, ""),
      file: meta.sourceFile,
      sourceSha256: meta.sourceSha256,
    },
    meta.repo,
    meta.namespace,
  );
  if (!body.equals(original.body) || !manifest.equals(original.manifest))
    throw new Error(
      `Noncanonical adapter or full skill preserved: ${directory}`,
    );
  return { body, manifest, meta };
}

export function planProjection({
  repo,
  target,
  skills,
  all = false,
  namespace = "arcanea",
}) {
  if (!/^[a-z][a-z0-9-]{0,23}$/.test(namespace))
    throw new Error(
      "Namespace must be 1-24 lowercase letters, digits or hyphens",
    );
  const catalog = discoverSkills(repo);
  const destination = exactDirectory(target);
  if (within(catalog.repo, destination) || within(destination, catalog.repo))
    throw new Error("Source repository and target registry may not overlap");
  if (all && skills?.length)
    throw new Error("Choose either --all or named --skill entries");
  if (all && catalog.issues.length)
    throw new Error(
      "Resolve source discovery issues or select explicit entries before projecting all",
    );
  const selected = all
    ? catalog.entries
    : (skills ?? []).map((key) => {
        const matches = catalog.entries.filter((item) => item.key === key);
        if (!matches.length)
          matches.push(
            ...catalog.entries.filter((item) => item.logical === key),
          );
        if (matches.length > 1)
          throw new Error(`Ambiguous skill; use its full source key: ${key}`);
        const entry = matches[0];
        if (!entry) throw new Error(`Unknown source skill: ${key}`);
        return entry;
      });
  if (!selected.length) throw new Error("Select at least one --skill or --all");
  if (new Set(selected.map((entry) => entry.key)).size !== selected.length)
    throw new Error("Duplicate source selection");
  const items = selected.map((entry) => {
    const generated = adapter(entry, catalog.repo, namespace);
    const directory = path.join(destination, generated.name);
    const before = currentAdapter(directory, generated);
    if (
      before &&
      (before.meta.sourceKey !== entry.key ||
        before.meta.namespace !== namespace)
    )
      throw new Error(`Adapter identity collision: ${directory}`);
    const state = !before
      ? "create"
      : before.body.equals(generated.body) &&
          before.manifest.equals(generated.manifest)
        ? "unchanged"
        : "update";
    return { ...generated, source: entry, directory, before, state };
  });
  if (new Set(items.map((item) => item.name)).size !== items.length)
    throw new Error(
      "Generated adapter name collision; select a different namespace or smaller set",
    );
  return {
    repo: catalog.repo,
    target: destination,
    items,
    issues: catalog.issues,
    absent: catalog.absent,
  };
}

export function projectionReport(plan, mode, receipt = null) {
  return {
    schemaVersion: SCHEMA,
    mode,
    repo: plan.repo,
    target: plan.target,
    receipt,
    entries: plan.items.map((item) => ({
      name: item.name,
      sourceKey: item.source.key,
      sourceFile: item.source.file,
      sourceSha256: item.source.sourceSha256,
      adapterSha256: digest(item.body),
      state: item.state,
    })),
    sourceIssues: plan.issues,
    absentOptionalSources: plan.absent,
  };
}

export function applyProjection(options) {
  const plan = planProjection(options);
  const changes = plan.items.filter((item) => item.state !== "unchanged");
  if (changes.some((item) => item.state === "update") && !options.update)
    throw new Error(
      "Managed adapters changed; preview and pass --update to replace them with backups",
    );
  if (!changes.length) return projectionReport(plan, "unchanged");
  if (!options.receiptDir)
    throw new Error(
      "Applying changes requires an explicit private --receipt-dir",
    );
  const receipts = exactDirectory(options.receiptDir);
  for (const root of [plan.repo, plan.target])
    if (within(root, receipts) || within(receipts, root))
      throw new Error(
        "Receipt directory must be separate from source and target",
      );
  fs.mkdirSync(receipts, { recursive: true });
  const run = path.join(
    receipts,
    `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}`,
  );
  fs.mkdirSync(run);
  const receipt = path.join(run, "receipt.json");
  for (const item of changes.filter((item) => item.before)) {
    const backup = path.join(run, item.name);
    fs.mkdirSync(backup);
    fs.writeFileSync(path.join(backup, "SKILL.md"), item.before.body, {
      flag: "wx",
    });
    fs.writeFileSync(path.join(backup, "INSTALL.json"), item.before.manifest, {
      flag: "wx",
    });
  }
  const record = projectionReport(plan, "backed-up", receipt);
  fs.writeFileSync(receipt, JSON.stringify(record, null, 2) + "\n", {
    flag: "wx",
  });
  const touched = [];
  try {
    directoryChain(plan.target);
    fs.mkdirSync(plan.target, { recursive: true });
    for (const item of changes) {
      if (digest(readBounded(item.source.file)) !== item.source.sourceSha256)
        throw new Error(
          `Source changed during installation: ${item.source.key}`,
        );
      const now = currentAdapter(item.directory, item);
      if (
        Boolean(now) !== Boolean(item.before) ||
        (now &&
          (!now.body.equals(item.before.body) ||
            !now.manifest.equals(item.before.manifest)))
      )
        throw new Error(
          `Destination changed during installation: ${item.name}`,
        );
      if (!now) fs.mkdirSync(item.directory);
      touched.push(item);
      directoryChain(item.directory);
      fs.writeFileSync(
        path.join(item.directory, "INSTALL.json"),
        item.manifest,
        { flag: now ? "w" : "wx" },
      );
      fs.writeFileSync(path.join(item.directory, "SKILL.md"), item.body, {
        flag: now ? "w" : "wx",
      });
      const verified = currentAdapter(item.directory, item);
      if (
        !verified.body.equals(item.body) ||
        !verified.manifest.equals(item.manifest)
      )
        throw new Error(`Verification failed: ${item.name}`);
    }
    record.mode = "applied";
  } catch (error) {
    record.mode = "failed";
    record.error = error.message;
    record.recovery = [];
    for (const item of touched.reverse()) {
      for (const [name, desired, original] of [
        ["SKILL.md", item.body, item.before?.body],
        ["INSTALL.json", item.manifest, item.before?.manifest],
      ]) {
        const file = path.join(item.directory, name);
        const recovery = {
          name: item.name,
          file: name,
          state: "preserved-unexpected",
        };
        try {
          if (!exists(file)) {
            recovery.state = "absent";
            continue;
          }
          const current = readBounded(file);
          if (original && current.equals(original)) {
            recovery.state = "original";
            continue;
          }
          if (!current.equals(desired)) continue;
          if (original) fs.writeFileSync(file, original);
          else fs.unlinkSync(file);
          recovery.state = original ? "restored" : "removed";
        } catch {
          /* Preserve unexpected state; the receipt retains the backup. */
        } finally {
          record.recovery.push(recovery);
        }
      }
      if (!item.before) {
        try {
          directoryChain(item.directory);
          fs.rmdirSync(item.directory);
        } catch {
          /* Preserve nonempty or replaced directories. */
        }
      }
    }
    fs.writeFileSync(receipt, JSON.stringify(record, null, 2) + "\n");
    throw new Error(`${error.message}; recovery receipt: ${receipt}`);
  }
  fs.writeFileSync(receipt, JSON.stringify(record, null, 2) + "\n");
  return record;
}
