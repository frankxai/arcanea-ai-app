"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { isMap, parseDocument } = require("yaml");

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HASH = /^[a-f0-9]{64}$/;
const present = (value) => typeof value === "string" && value.trim().length > 0;
const contained = (root, target) => {
  const relative = path.relative(root, target);
  return (
    relative === "" ||
    (!path.isAbsolute(relative) &&
      relative !== ".." &&
      !relative.startsWith(`..${path.sep}`))
  );
};

function checkStructure(catalog) {
  if (
    catalog?.schema !== "arcanea.skill-catalog.v1" ||
    catalog.root !== "skills" ||
    !Array.isArray(catalog.skills)
  )
    throw new Error("Invalid skill catalog");
  const names = new Set();
  for (const skill of catalog.skills) {
    if (
      typeof skill.name !== "string" ||
      !ID.test(skill.name) ||
      skill.name.length > 64
    )
      throw new Error("Invalid skill identity");
    if (names.has(skill.name))
      throw new Error(`Duplicate skill: ${skill.name}`);
    names.add(skill.name);
    if (skill.path !== `skills/${skill.name}`)
      throw new Error(`Invalid skill path: ${skill.path}`);
    if (!["candidate", "ready"].includes(skill.status))
      throw new Error(`Invalid status: ${skill.name}`);
    if (
      !present(skill.owner) ||
      !present(skill.category) ||
      skill.mode !== "creator-owned" ||
      !Array.isArray(skill.resources) ||
      !Array.isArray(skill.sourceHistory)
    ) {
      throw new Error(`Missing passport fields: ${skill.name}`);
    }
  }
}

function loadCatalog(packageRoot) {
  const catalog = JSON.parse(
    fs.readFileSync(path.join(packageRoot, "catalog.json"), "utf8"),
  );
  checkStructure(catalog);
  return catalog;
}

function selectReady(catalog) {
  checkStructure(catalog);
  return catalog.skills.filter((skill) => {
    if (skill.status !== "ready") return false;
    if (
      !HASH.test(skill.contentSha256) ||
      skill.rights?.status !== "cleared" ||
      !present(skill.rights.license) ||
      !present(skill.rights.evidence) ||
      skill.evaluation?.status !== "passed" ||
      !present(skill.evaluation.evidence) ||
      skill.evaluation.contentSha256 !== skill.contentSha256 ||
      skill.review?.status !== "passed" ||
      !present(skill.review.evidence) ||
      !present(skill.review.maker) ||
      !present(skill.review.reviewer) ||
      skill.review.maker === skill.review.reviewer ||
      skill.review.contentSha256 !== skill.contentSha256
    ) {
      throw new Error(
        `Ready skill lacks matching rights/content/independent evidence: ${skill.name}`,
      );
    }
    return true;
  });
}

function regularFiles(root) {
  const files = [];
  const walk = (dir) => {
    const stat = fs.lstatSync(dir);
    if (stat.isSymbolicLink() || !stat.isDirectory())
      throw new Error(`Unsafe source directory: ${dir}`);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name);
      if (
        entry.name.startsWith(".") ||
        entry.name === "node_modules" ||
        entry.isSymbolicLink()
      ) {
        throw new Error(`Unsafe skill source: ${target}`);
      }
      if (entry.isDirectory()) walk(target);
      else if (entry.isFile())
        files.push(path.relative(root, target).split(path.sep).join("/"));
      else throw new Error(`Nonregular skill source: ${target}`);
    }
  };
  walk(root);
  return files.sort();
}

function validateSources(packageRoot, catalog) {
  checkStructure(catalog);
  const sourceRoot = path.join(packageRoot, "skills");
  const sourceStat = fs.lstatSync(sourceRoot);
  if (sourceStat.isSymbolicLink() || !sourceStat.isDirectory())
    throw new Error("Unsafe skill root");
  const ready = new Set(selectReady(catalog).map((skill) => skill.name));
  return catalog.skills.map((skill) => {
    const root = path.join(packageRoot, skill.path);
    const files = regularFiles(root);
    if (!files.includes("SKILL.md"))
      throw new Error(`Missing SKILL.md: ${skill.name}`);
    const text = fs.readFileSync(path.join(root, "SKILL.md"), "utf8");
    const frontmatter = text.match(
      /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
    )?.[1];
    const document = parseDocument(frontmatter ?? "", {
      strict: true,
      uniqueKeys: true,
      stringKeys: true,
    });
    if (
      !isMap(document.contents) ||
      document.errors.length ||
      document.warnings.length
    ) {
      throw new Error(`Invalid skill frontmatter: ${skill.name}`);
    }
    const data = document.toJS();
    if (data.name !== skill.name || !present(data.description)) {
      throw new Error(`Skill frontmatter mismatch: ${skill.name}`);
    }
    const metadata = data.metadata;
    const internal =
      metadata !== null &&
      typeof metadata === "object" &&
      !Array.isArray(metadata) &&
      metadata.internal === true;
    if (ready.has(skill.name) && internal)
      throw new Error(`Ready skill is hidden from discovery: ${skill.name}`);
    if (skill.status === "candidate" && !internal)
      throw new Error(`Candidate must remain internal: ${skill.name}`);
    for (const resource of skill.resources) {
      if (!files.includes(resource))
        throw new Error(`Missing declared resource: ${skill.name}/${resource}`);
    }
    const hash = createHash("sha256");
    for (const file of files) {
      const content = fs.readFileSync(path.join(root, file));
      hash.update(
        `${file}\0${createHash("sha256").update(content).digest("hex")}\n`,
      );
      if (!file.endsWith(".md")) continue;
      for (const match of content.toString("utf8").matchAll(/\]\(([^)]+)\)/g)) {
        const link = match[1];
        if (/^(?:https?:|mailto:|#)/.test(link)) continue;
        const target = path.resolve(
          path.dirname(path.join(root, file)),
          link.split("#")[0],
        );
        if (!contained(root, target))
          throw new Error(`Reference outside skill: ${skill.name}/${file}`);
        if (!fs.existsSync(target))
          throw new Error(`Missing local reference: ${skill.name}/${file}`);
      }
    }
    const sha256 = hash.digest("hex");
    if (ready.has(skill.name) && sha256 !== skill.contentSha256) {
      throw new Error(`Reviewed content changed: ${skill.name}`);
    }
    return {
      name: skill.name,
      path: skill.path,
      sha256,
      files,
      description: data.description,
      body: text.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, ""),
    };
  });
}

module.exports = { loadCatalog, selectReady, validateSources, contained };

if (require.main === module) {
  try {
    const packageRoot = path.resolve(__dirname, "..");
    const catalog = loadCatalog(packageRoot);
    const sources = validateSources(packageRoot, catalog);
    console.log(
      JSON.stringify(
        {
          ready: selectReady(catalog).length,
          candidates: catalog.skills.filter(
            (skill) => skill.status === "candidate",
          ).length,
          sources,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
