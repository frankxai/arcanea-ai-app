import { readFile, writeFile, mkdir, readdir, lstat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { createBrief, renderTemplate, renderGallery } from "../src/render.mjs";

export const pluginRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const marker = ".creator-starters-output.json";
const slugs = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export function validateCatalog(catalog) {
  if (
    catalog.version !== 1 ||
    !Array.isArray(catalog.templates) ||
    !catalog.templates.length
  )
    throw new Error("Invalid catalog version or templates");
  const ids = new Set();
  for (const t of catalog.templates) {
    if (
      !slugs.test(t.id) ||
      /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(t.id) ||
      ids.has(t.id)
    )
      throw new Error(`Invalid or duplicate template id: ${t.id}`);
    ids.add(t.id);
    if (
      !["music", "labs", "tools"].includes(t.category) ||
      !["record", "research", "tool"].includes(t.layout) ||
      !["ember", "paper", "sage", "ink", "peach", "midnight"].includes(t.theme)
    )
      throw new Error(`Unknown composition for ${t.id}`);
    for (const field of [
      "name",
      "kind",
      "eyebrow",
      "headline",
      "description",
      "detail",
      "action",
      "proof",
      "brief",
    ]) {
      if (
        typeof t[field] !== "string" ||
        !t[field].trim() ||
        /<\/script/i.test(t[field])
      )
        throw new Error(`Invalid ${field} for ${t.id}`);
    }
    for (const field of ["items", "sections", "inputs"])
      if (
        !Array.isArray(t[field]) ||
        t[field].length !== 3 ||
        t[field].some((v) => typeof v !== "string" || !v.trim())
      )
        throw new Error(`Expected three ${field} for ${t.id}`);
  }
  return catalog.templates;
}

export function compatibilityManifest(manifest) {
  const { name, version, description, author, keywords } = manifest;
  return {
    name,
    version,
    description,
    author,
    keywords,
    skills: "./skills/",
    ...manifest.extensions["com.openai"],
  };
}

export async function artifacts() {
  const [catalog, styles, script, guide] = await Promise.all([
    readFile(path.join(pluginRoot, "catalog.json"), "utf8").then(JSON.parse),
    readFile(path.join(pluginRoot, "src/styles.css"), "utf8"),
    readFile(path.join(pluginRoot, "src/interactions.js"), "utf8"),
    readFile(path.join(pluginRoot, "README.md"), "utf8"),
  ]);
  const templates = validateCatalog(catalog);
  const files = new Map([
    ["index.html", renderGallery(templates, styles, script)],
    ["README.md", guide],
  ]);
  for (const template of templates) {
    files.set(`${template.id}.html`, renderTemplate(template, styles, script));
    files.set(`${template.id}.html.txt`, files.get(`${template.id}.html`));
    files.set(`${template.id}.md`, createBrief(template));
  }
  for (const [name, content] of files)
    files.set(name, content.replace(/[ \t]+$/gm, ""));
  const hashes = Object.fromEntries(
    [...files].map(([name, content]) => [
      name,
      createHash("sha256").update(content).digest("hex"),
    ]),
  );
  files.set(
    marker,
    JSON.stringify(
      { generator: "arcanea-creator-starters", version: 1, files: hashes },
      null,
      2,
    ) + "\n",
  );
  return files;
}

export async function build(output, { check = false } = {}) {
  if (!output || !path.isAbsolute(output))
    throw new Error("--out must be an absolute directory");
  const dest = path.resolve(output);
  if (
    dest === path.parse(dest).root ||
    pluginRoot === dest ||
    pluginRoot.startsWith(dest + path.sep) ||
    dest.startsWith(pluginRoot + path.sep)
  )
    throw new Error(
      "Output must be separate from the plugin source and its ancestors",
    );
  // Reject link/junction traversal, including existing parent components.
  for (let cursor = dest; ; cursor = path.dirname(cursor)) {
    const info = await lstat(cursor).catch((e) => {
      if (e.code === "ENOENT") return null;
      throw e;
    });
    if (info?.isSymbolicLink())
      throw new Error("Output may not traverse a symlink or junction");
    if (cursor === path.dirname(cursor)) break;
  }
  const files = await artifacts();
  const existing = await readdir(dest).catch((e) => {
    if (e.code === "ENOENT") return [];
    throw e;
  });
  if (existing.some((name) => !files.has(name)))
    throw new Error(
      "Output contains unrelated files; choose a dedicated directory",
    );
  for (const name of existing) {
    const info = await lstat(path.join(dest, name));
    if (info.isSymbolicLink() || !info.isFile())
      throw new Error(
        "Output entries must be regular files, not links or directories",
      );
  }
  if (existing.length && !existing.includes(marker))
    throw new Error("Refusing to overwrite an unmarked output directory");
  if (existing.includes(marker)) {
    const receipt = JSON.parse(await readFile(path.join(dest, marker), "utf8"));
    if (
      receipt.generator !== "arcanea-creator-starters" ||
      receipt.version !== 1
    )
      throw new Error("Invalid output ownership marker");
    // Preserve local edits in built output. Rebuild only untouched generated files.
    if (!check)
      for (const name of existing.filter((n) => n !== marker)) {
        const actual = await readFile(path.join(dest, name));
        if (
          createHash("sha256").update(actual).digest("hex") !==
          receipt.files[name]
        )
          throw new Error(
            `Locally modified output: ${name}; preserve it and choose a new directory`,
          );
      }
  }
  const differences = [];
  for (const [name, content] of files) {
    const before = await readFile(path.join(dest, name), "utf8").catch((e) => {
      if (e.code === "ENOENT") return null;
      throw e;
    });
    if (before !== content) differences.push(name);
  }
  if (check) {
    if (differences.length)
      throw new Error(`Generated output differs: ${differences.join(", ")}`);
  } else {
    await mkdir(dest, { recursive: true });
    for (const [name, content] of files)
      await writeFile(path.join(dest, name), content, "utf8");
  }
  return {
    templates: [...files.keys()].filter(
      (name) => name.endsWith(".html") && name !== "index.html",
    ).length,
    files: files.size,
    output: dest,
    check,
    differences: check ? 0 : differences.length,
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const args = process.argv.slice(2);
    if (args.includes("--compat")) {
      const manifest = JSON.parse(
        await readFile(path.join(pluginRoot, "plugin.json"), "utf8"),
      );
      const dest = path.join(pluginRoot, ".codex-plugin", "plugin.json");
      const expected =
        JSON.stringify(compatibilityManifest(manifest), null, 2) + "\n";
      if (args.includes("--check")) {
        if ((await readFile(dest, "utf8")) !== expected)
          throw new Error("Compatibility manifest drift");
      } else {
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest, expected);
      }
      console.log(
        "Codex compatibility manifest matches the portable manifest.",
      );
    } else {
      const outIndex = args.indexOf("--out");
      if (outIndex === -1)
        throw new Error(
          "Usage: node scripts/build.mjs --out <absolute-directory> [--check] | --compat [--check]",
        );
      console.log(
        JSON.stringify(
          await build(args[outIndex + 1], { check: args.includes("--check") }),
        ),
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
