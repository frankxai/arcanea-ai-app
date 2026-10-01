import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SkillDocumentation, {
  resolveSkillMarkdownUrl,
} from "../../../components/skills/SkillDocumentation";
import {
  getAllSkills,
  getCategories,
  getSkillBySlug,
  getSkillsByCategory,
} from "../loader";

const packageRoot = fileURLToPath(
  new URL("../../../../../packages/arcanea-skills/", import.meta.url),
);
const revision = "a".repeat(40);

function fixture(t: { after: (fn: () => void) => void }) {
  const dir = mkdtempSync(join(tmpdir(), "arcanea-web-skills-"));
  t.after(() => {
    const rel = relative(resolve(tmpdir()), resolve(dir));
    assert.ok(rel && !rel.startsWith("..") && !rel.includes(":"));
    rmSync(dir, { recursive: true, force: true });
  });
  const root = join(dir, "package");
  mkdirSync(root);
  copyFileSync(join(packageRoot, "catalog.json"), join(root, "catalog.json"));
  cpSync(join(packageRoot, "skills"), join(root, "skills"), {
    recursive: true,
  });
  const catalog = JSON.parse(readFileSync(join(root, "catalog.json"), "utf8"));
  const save = () =>
    writeFileSync(join(root, "catalog.json"), JSON.stringify(catalog));
  return {
    root,
    catalog,
    save,
    options: { packageRoot: root, sourceRevision: revision },
  };
}

function ready(f: ReturnType<typeof fixture>, index = 0) {
  // Synthetic declarations exercise the validator; they grant no release rights.
  const entry = f.catalog.skills[index];
  const root = join(f.root, entry.path);
  const file = join(root, "SKILL.md");
  writeFileSync(
    file,
    readFileSync(file, "utf8").replace("internal: true", "internal: false"),
  );
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, item.name);
      if (item.isDirectory()) walk(path);
      else files.push(relative(root, path).split("\\").join("/"));
    }
  };
  walk(root);
  const hash = createHash("sha256");
  for (const path of files.sort()) {
    const sha = createHash("sha256")
      .update(readFileSync(join(root, path)))
      .digest("hex");
    hash.update(`${path}\0${sha}\n`);
  }
  entry.status = "ready";
  entry.contentSha256 = hash.digest("hex");
  entry.rights = {
    status: "cleared",
    license: "LicenseRef-test-fixture",
    evidence: "synthetic fixture",
  };
  entry.evaluation = {
    status: "passed",
    evidence: "synthetic fixture",
    contentSha256: entry.contentSha256,
  };
  entry.review = {
    status: "passed",
    evidence: "synthetic fixture",
    maker: "fixture-maker",
    reviewer: "fixture-reviewer",
    contentSha256: entry.contentSha256,
  };
  f.save();
  return entry;
}

test("the actual curated catalog has zero public skills and candidate slugs are absent", async () => {
  assert.deepEqual(await getAllSkills({ packageRoot }), []);
  assert.equal(await getSkillBySlug("world-build", { packageRoot }), null);
});

test("default reads resolve the canonical catalog from both supported execution roots", async () => {
  const previous = process.cwd();
  const repoRoot = resolve(packageRoot, "..", "..");
  try {
    process.chdir(repoRoot);
    assert.deepEqual(await getAllSkills(), []);
    process.chdir(join(repoRoot, "apps/web"));
    assert.deepEqual(await getAllSkills(), []);
  } finally {
    process.chdir(previous);
  }
});

test("only declared ready skills produce body, passport terms and revision-pinned links", async (t) => {
  const f = fixture(t);
  const entry = ready(f);
  const unlisted = join(f.root, "skills/legacy-extra/SKILL.md");
  mkdirSync(dirname(unlisted), { recursive: true });
  writeFileSync(
    unlisted,
    "---\nname: legacy-extra\nlicense: MIT\n---\nUnreviewed body",
  );
  const skills = await getAllSkills(f.options);
  assert.equal(skills.length, 1);
  assert.equal(skills[0].slug, entry.name);
  assert.equal(skills[0].license, "LicenseRef-test-fixture");
  assert.ok(skills[0].description.length > 0);
  assert.match(skills[0].readmeContent, /# Build a world bible/);
  assert.ok(!skills[0].readmeContent.startsWith("---"));
  assert.equal(
    skills[0].sourceUrl,
    `https://github.com/frankxai/arcanea-ai-app/blob/${revision}/packages/arcanea-skills/${entry.path}/SKILL.md`,
  );
  assert.equal(
    skills[0].installGuideUrl,
    `https://github.com/frankxai/arcanea-ai-app/blob/${revision}/packages/arcanea-skills/README.md`,
  );
  assert.deepEqual(getCategories(skills), [entry.category]);
  assert.deepEqual(
    await getSkillsByCategory(entry.category.toUpperCase(), f.options),
    skills,
  );
  assert.deepEqual(await getSkillsByCategory("missing", f.options), []);
  assert.equal(await getSkillBySlug("legacy-extra", f.options), null);
});

test("default discovery refuses missing and duplicate canonical catalogs", async (t) => {
  const f = fixture(t);
  const cwd = join(f.root, "apps", "web");
  mkdirSync(cwd, { recursive: true });
  const previous = process.cwd();
  try {
    process.chdir(cwd);
    await assert.rejects(
      getAllSkills(),
      /Expected one canonical skill catalog/,
    );
    for (const root of [f.root, cwd]) {
      const catalog = join(root, "packages", "arcanea-skills", "catalog.json");
      mkdirSync(dirname(catalog), { recursive: true });
      writeFileSync(catalog, "{}");
    }
    await assert.rejects(
      getAllSkills(),
      /Expected one canonical skill catalog/,
    );
  } finally {
    process.chdir(previous);
  }
});

test("missing rights, evaluation or independent evidence fails the public reader", async (t) => {
  const f = fixture(t);
  const entry = ready(f);
  for (const field of ["rights", "evaluation", "review"]) {
    const previous = entry[field];
    delete entry[field];
    f.save();
    await assert.rejects(getAllSkills(f.options), /Ready skill lacks matching/);
    entry[field] = previous;
  }
});

test("changed support material fails public reads instead of exposing stale reviewed content", async (t) => {
  const f = fixture(t);
  const entry = ready(f);
  const file = join(f.root, entry.path, "references/example.md");
  writeFileSync(
    file,
    readFileSync(file, "utf8") + "\nUnreviewed new material\n",
  );
  await assert.rejects(getAllSkills(f.options), /Reviewed content changed/);
});

test("ready links reject moving refs, malformed revisions and unexpected source repositories", async (t) => {
  const f = fixture(t);
  ready(f);
  for (const sourceRevision of [
    "main",
    "",
    "a".repeat(39),
    "../main",
    "A".repeat(40),
  ]) {
    await assert.rejects(
      getAllSkills({ ...f.options, sourceRevision }),
      /immutable source revision/,
    );
  }
  f.catalog.sourceRepo = "another-owner/another-repo";
  f.save();
  await assert.rejects(
    getAllSkills(f.options),
    /Unexpected skill source repository/,
  );
});

test("the skill documentation renderer pins its worked example to the validated source revision", async (t) => {
  const f = fixture(t);
  const entry = ready(f);
  const skill = (await getAllSkills(f.options))[0];
  const html = renderToStaticMarkup(
    createElement(SkillDocumentation, { skill }),
  );
  assert.ok(
    html.includes(
      `href="https://github.com/frankxai/arcanea-ai-app/blob/${revision}/packages/arcanea-skills/${entry.path}/references/example.md"`,
    ),
    "worked example must link to the same validated skill at the pinned commit",
  );
  assert.ok(!html.includes('href="references/example.md"'));
});

test("resource URLs use the validated file inventory and preserve supported external links", async (t) => {
  const f = fixture(t);
  ready(f);
  const skill = (await getAllSkills(f.options))[0];
  const folder = skill.sourceUrl.slice(0, skill.sourceUrl.lastIndexOf("/") + 1);
  for (const url of [
    "references/example.md",
    "./references/example.md",
    "%72eferences/example.md",
  ]) {
    assert.equal(
      resolveSkillMarkdownUrl(skill, url),
      `${folder}references/example.md`,
    );
  }
  assert.equal(
    resolveSkillMarkdownUrl(skill, "references/example.md?plain=1#example"),
    `${folder}references/example.md?plain=1#example`,
  );
  assert.equal(
    resolveSkillMarkdownUrl(skill, "#output"),
    `${skill.sourceUrl}#output`,
  );
  assert.equal(
    resolveSkillMarkdownUrl(skill, "?plain=1"),
    `${skill.sourceUrl}?plain=1`,
  );
  for (const url of [
    "https://example.com/guide?x=1#output",
    "http://example.com/guide",
    "mailto:author@example.com",
  ]) {
    assert.equal(resolveSkillMarkdownUrl(skill, url), url);
  }
  for (const url of [
    "references/missing.md",
    "../continuity-check/SKILL.md",
    "references/../SKILL.md",
    "%2e%2e/SKILL.md",
    "references%2f..%2fSKILL.md",
    "/references/example.md",
    "//example.com/file",
    "references\\example.md",
    "references%5cexample.md",
    "references/%00example.md",
    "references/%example.md",
    "javascript:alert(1)",
    "data:text/html,example",
    "file:///tmp/example.md",
    "",
  ]) {
    assert.equal(resolveSkillMarkdownUrl(skill, url), "", url);
  }
});

test("Markdown inline and reference-style links use pinned URLs without exposing rejected paths", async (t) => {
  const f = fixture(t);
  ready(f);
  const loaded = (await getAllSkills(f.options))[0];
  const skill = {
    ...loaded,
    readmeContent: [
      "[inline](./references/example.md#example)",
      "[reference][worked-example]",
      "[worked-example]: references/example.md",
      "",
      "[external](https://example.com/guide)",
      "[mail](mailto:author@example.com)",
      "[heading](#output)",
      "[missing](references/missing.md)",
      "[traversal](%2e%2e/SKILL.md)",
      "[unsafe](javascript:alert%281%29)",
    ].join("\n\n"),
  };
  const html = renderToStaticMarkup(
    createElement(SkillDocumentation, { skill }),
  );
  const folder = skill.sourceUrl.slice(0, skill.sourceUrl.lastIndexOf("/") + 1);
  assert.ok(html.includes(`href="${folder}references/example.md#example"`));
  assert.ok(html.includes(`href="${folder}references/example.md"`));
  assert.ok(html.includes('href="https://example.com/guide"'));
  assert.ok(html.includes('href="mailto:author@example.com"'));
  assert.ok(html.includes(`href="${skill.sourceUrl}#output"`));
  assert.ok(!html.includes('href="references/'));
  assert.ok(!html.includes('href="%2e%2e/'));
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(html.includes("<span>missing</span>"));
  assert.ok(html.includes("<span>traversal</span>"));
  assert.ok(html.includes("<span>unsafe</span>"));
  assert.ok(!html.includes('href=""'));
});

test("local images use raw bytes at the same commit and encoded inventory filenames", async (t) => {
  const f = fixture(t);
  const entry = f.catalog.skills[0];
  const filename = "references/example image.png";
  writeFileSync(join(f.root, entry.path, filename), "synthetic image bytes");
  ready(f);
  const loaded = (await getAllSkills(f.options))[0];
  const skill = {
    ...loaded,
    readmeContent: "![example](references/example%20image.png)",
  };
  const expected = `https://raw.githubusercontent.com/frankxai/arcanea-ai-app/${revision}/packages/arcanea-skills/${entry.path}/references/example%20image.png`;
  assert.equal(resolveSkillMarkdownUrl(skill, filename, "src"), expected);
  assert.equal(
    resolveSkillMarkdownUrl(skill, "mailto:author@example.com", "src"),
    "",
  );
  assert.equal(resolveSkillMarkdownUrl(skill, "#example", "src"), "");
  const html = renderToStaticMarkup(
    createElement(SkillDocumentation, { skill }),
  );
  assert.ok(html.includes(`src="${expected}"`));
  assert.ok(html.includes('alt="example"'));
});

test("each current candidate's actual example link renders at its own pinned source folder in a synthetic ready fixture", async (t) => {
  const count = JSON.parse(
    readFileSync(join(packageRoot, "catalog.json"), "utf8"),
  ).skills.length;
  for (let index = 0; index < count; index++) {
    const f = fixture(t);
    const entry = ready(f, index);
    const skill = (await getAllSkills(f.options))[0];
    const html = renderToStaticMarkup(
      createElement(SkillDocumentation, { skill }),
    );
    assert.ok(
      html.includes(
        `href="https://github.com/frankxai/arcanea-ai-app/blob/${revision}/packages/arcanea-skills/${entry.path}/references/example.md"`,
      ),
      entry.name,
    );
  }
});
