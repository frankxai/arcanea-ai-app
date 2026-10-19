import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  createSceneDraft,
  readSceneDraft,
  reviseSceneDraft,
  scenePrompt,
  exportSceneDraft,
} from "../src/scene-drafts.mjs";
import { buildManifest } from "../src/manifest.mjs";
import { readWorld, parseFrontmatter } from "../src/fs-world.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { buildIndex } from "../src/index-build.mjs";
import { recordMemory, listMemories } from "../src/evolution.mjs";

const exec = promisify(execFile);
const cli = fileURLToPath(new URL("../bin/cli.mjs", import.meta.url));

test("frontmatter preserves fields and bounds malicious whitespace parsing", async () => {
  assert.deepEqual(
    parseFrontmatter(
      "---\nname:   'Mara'\nvisibility:\tprivate\nempty:\nnot a field\n0:\u2028value\n---\nbody",
    ),
    {
      data: { name: "Mara", visibility: "private", empty: "", 0: "value" },
      body: "body",
    },
  );
  assert.deepEqual(parseFrontmatter("no frontmatter"), {
    data: {},
    body: "no frontmatter",
  });
  const modulePath = new URL("../src/fs-world.mjs", import.meta.url).href;
  const code = `import {parseFrontmatter} from ${JSON.stringify(modulePath)};
    const text = "---\\n0:" + "\\t".repeat(200000) + "a\\u2028x\\n---\\nbody";
    const result = parseFrontmatter(text);
    if (Object.keys(result.data).length || result.body !== "body") process.exit(2);`;
  await exec(process.execPath, ["--input-type=module", "-e", code], {
    timeout: 2000,
    maxBuffer: 1000,
  });
});

async function fixture(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "arcanea-scenes-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  await fs.mkdir(path.join(dir, "characters"));
  await fs.mkdir(path.join(dir, "canon"));
  await fs.writeFile(
    path.join(dir, "world.arcanea.json"),
    JSON.stringify(
      buildManifest({
        name: "The Salt Ledger",
        premise: "Memories pay for passage.",
        creator: { handle: "test-author" },
      }),
    ),
  );
  await fs.writeFile(
    path.join(dir, "characters", "mara.md"),
    "# Mara\nA ferryman who refuses to sell her daughter's name.\nVoice: terse; never calls a passenger cargo.\n",
  );
  await fs.writeFile(
    path.join(dir, "canon", "rules.md"),
    "# Rules\nA traded memory cannot be recovered.\n",
  );
  return dir;
}
const spec = {
  sceneId: "the-last-crossing",
  title: "The last crossing",
  characterPath: "characters/mara.md",
  sourcePaths: ["canon/rules.md"],
  brief:
    "Mara must carry a stranger before the gates shut; the fare will cost a memory.",
  author: "test-author",
};

test("equal-timestamp memories are distinct even under simultaneous writes", async (t) => {
  const dir = await fixture(t);
  const timestamp = "2026-10-11T21:00:00.000Z";
  const writes = await Promise.all(
    ["first", "second", "third", "fourth"].map((content) =>
      recordMemory(dir, { ts: timestamp, content }),
    ),
  );
  assert.equal(new Set(writes.map((write) => write.path)).size, 4);
  assert.deepEqual(
    (await listMemories(dir)).map((record) => record.content).sort(),
    ["first", "fourth", "second", "third"],
  );
});
const prose =
  "Mara held the boat against the stone. 'Your fare,' she said. The stranger offered a memory of home. She left the coin on the quay.";
const revision = (draft, text = prose) => ({
  expectedSha256: draft.sha256,
  prose: text,
  producer: { kind: "author", name: "test-author" },
});

test("world → character → prompt → scene → revision → exact export leaves public sources unchanged", async (t) => {
  const dir = await fixture(t);
  const before = await readWorld(dir);
  const hash = contentHash(before.files, before.manifest);
  const initial = await createSceneDraft(dir, spec);
  assert.equal(initial.record.revision, 0);
  const prompt = await scenePrompt(dir, spec.sceneId);
  assert.match(prompt, /Mara/);
  assert.match(prompt, /cannot be recovered/);
  assert.match(prompt, /creator-working-source/);
  const one = await reviseSceneDraft(dir, spec.sceneId, revision(initial));
  const two = await reviseSceneDraft(
    dir,
    spec.sceneId,
    revision(one, prose + " She pushed away."),
  );
  assert.equal(two.record.parentSha256, one.sha256);
  assert.equal(two.record.prose, prose + " She pushed away.");
  assert.equal((await readSceneDraft(dir, spec.sceneId)).sha256, two.sha256);
  const exported = await exportSceneDraft(dir, spec.sceneId);
  assert.equal(
    exported.markdown,
    "# The last crossing\n\n" + two.record.prose + "\n",
  );
  assert.equal(JSON.parse(exported.receipt).revisionSha256, two.sha256);
  assert.equal(JSON.parse(exported.receipt).approval.publication, false);
  const after = await readWorld(dir);
  assert.equal(contentHash(after.files, after.manifest), hash);
  assert.deepEqual(
    buildIndex(after),
    buildIndex(before),
    "private scene prose and source copies must not enter the public index",
  );
  for (const file of before.files)
    assert.deepEqual(
      after.files.find((f) => f.path === file.path).bytes,
      file.bytes,
    );
});

test("stale writers and simultaneous retries cannot replace the accepted revision", async (t) => {
  const dir = await fixture(t);
  const first = await createSceneDraft(dir, spec);
  const writes = await Promise.allSettled([
    reviseSceneDraft(dir, spec.sceneId, revision(first)),
    reviseSceneDraft(
      dir,
      spec.sceneId,
      revision(first, prose + " Different ending."),
    ),
  ]);
  assert.equal(writes.filter((r) => r.status === "fulfilled").length, 1);
  assert.match(
    writes.find((r) => r.status === "rejected").reason.message,
    /changed|conflict/i,
  );
  const accepted = await readSceneDraft(dir, spec.sceneId);
  await assert.rejects(
    reviseSceneDraft(dir, spec.sceneId, revision(first)),
    /changed|conflict/i,
  );
  assert.equal(
    (await readSceneDraft(dir, spec.sceneId)).sha256,
    accepted.sha256,
  );
});

test("changed sources stop further drafting; the captured revision remains exportable", async (t) => {
  const dir = await fixture(t);
  const draft = await createSceneDraft(dir, spec);
  await fs.writeFile(
    path.join(dir, "characters", "mara.md"),
    "# Different character\n",
  );
  await assert.rejects(scenePrompt(dir, spec.sceneId), /source.*changed/i);
  await assert.rejects(
    reviseSceneDraft(dir, spec.sceneId, revision(draft)),
    /source.*changed/i,
  );
  const exported = await exportSceneDraft(dir, spec.sceneId);
  assert.match(exported.receipt, /A ferryman/);
});

test("traversal, hidden inputs, duplicate identities and oversized text are denied", async (t) => {
  const dir = await fixture(t);
  for (const characterPath of [
    "../outside.md",
    "characters/../world.arcanea.json",
    "characters\\mara.md",
    ".arcanea/secret.md",
    "/characters/mara.md",
  ]) {
    await assert.rejects(createSceneDraft(dir, { ...spec, characterPath }));
  }
  await assert.rejects(
    createSceneDraft(dir, { ...spec, sceneId: "../escape" }),
  );
  await assert.rejects(
    createSceneDraft(dir, { ...spec, brief: "x".repeat(8001) }),
  );
  const draft = await createSceneDraft(dir, spec);
  await assert.rejects(createSceneDraft(dir, spec), /exists|conflict/i);
  await assert.rejects(
    reviseSceneDraft(dir, spec.sceneId, revision(draft, "x".repeat(128001))),
    /large|limit/i,
  );
  assert.equal((await readSceneDraft(dir, spec.sceneId)).record.revision, 0);
});

test("directory symlinks cannot read another world or redirect draft writes", async (t) => {
  const dir = await fixture(t);
  const other = await fixture(t);
  await fs.symlink(
    path.join(other, "characters"),
    path.join(dir, "canon", "borrowed"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    createSceneDraft(dir, { ...spec, sourcePaths: ["canon/borrowed/mara.md"] }),
    /link/i,
  );
  await fs.symlink(
    other,
    path.join(dir, ".arcanea"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(createSceneDraft(dir, spec), /link/i);
  await assert.rejects(fs.access(path.join(other, "drafts")));
});

test("interrupted pending writes are ignored; corrupted accepted revisions fail closed", async (t) => {
  const dir = await fixture(t);
  const draft = await createSceneDraft(dir, spec);
  const store = path.join(dir, ".arcanea", "drafts", "scenes", spec.sceneId);
  await fs.writeFile(path.join(store, ".pending-interrupted"), "{incomplete");
  assert.equal((await readSceneDraft(dir, spec.sceneId)).sha256, draft.sha256);
  const one = await reviseSceneDraft(dir, spec.sceneId, revision(draft));
  const zero = path.join(store, "000000.json");
  await fs.appendFile(zero, " ");
  await assert.rejects(readSceneDraft(dir, spec.sceneId), /integrity|chain/i);
  assert.equal(
    createHash("sha256")
      .update(await fs.readFile(path.join(store, "000001.json")))
      .digest("hex"),
    one.sha256,
  );
});

test("an absent scene read creates no directories; source snapshots preserve CRLF bytes", async (t) => {
  const dir = await fixture(t);
  await assert.rejects(readSceneDraft(dir, spec.sceneId));
  await assert.rejects(fs.access(path.join(dir, ".arcanea")));
  const bytes = Buffer.from("# Mara\r\nKeeps the name.\r\n");
  await fs.writeFile(path.join(dir, "characters", "mara.md"), bytes);
  const draft = await createSceneDraft(dir, spec);
  assert.equal(
    draft.record.sources[1].sha256,
    createHash("sha256").update(bytes).digest("hex"),
  );
  assert.deepEqual(Buffer.from(draft.record.sources[1].utf8), bytes);
});

test("UTF-8 BOM world and character documents retain their exact captured bytes", async (t) => {
  const dir = await fixture(t);
  for (const relative of ["world.arcanea.json", "characters/mara.md"]) {
    const file = path.join(dir, relative);
    await fs.writeFile(
      file,
      Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), await fs.readFile(file)]),
    );
  }
  const draft = await createSceneDraft(dir, spec);
  for (const source of draft.record.sources)
    assert.deepEqual(
      Buffer.from(source.utf8),
      await fs.readFile(path.join(dir, source.path)),
    );
  assert.match(await scenePrompt(dir, spec.sceneId), /Mara/);
});

test("real CLI capture, prompt, revision and export preserve provenance and refuse overwrites", async (t) => {
  const dir = await fixture(t);
  const outside = await fixture(t);
  const specification = path.join(outside, "scene.json");
  const producer = path.join(outside, "producer.json");
  const proseFile = path.join(outside, "draft.md");
  await fs.writeFile(specification, JSON.stringify(spec));
  await fs.writeFile(
    producer,
    JSON.stringify({
      kind: "model",
      name: "test-only synthetic writer",
      harness: "fixture",
      model: "fixture-no-provider-call",
    }),
  );
  await fs.writeFile(proseFile, prose);
  const run = (...args) =>
    exec(process.execPath, [cli, "scene", ...args], {
      timeout: 10_000,
      maxBuffer: 1_000_000,
    });
  const initial = JSON.parse((await run("start", dir, specification)).stdout);
  assert.match((await run("prompt", dir, spec.sceneId)).stdout, /Mara/);
  const revised = JSON.parse(
    (
      await run(
        "revise",
        dir,
        spec.sceneId,
        proseFile,
        initial.sha256,
        producer,
      )
    ).stdout,
  );
  assert.equal(revised.record.prose, prose);
  await assert.rejects(
    run("export", dir, spec.sceneId, path.join(dir, "books", "export")),
    /ENOENT|outside/,
  );
  await assert.rejects(
    run("export", dir, spec.sceneId, path.join(dir, "canon", "export")),
    /outside/,
  );
  const output = path.join(outside, "export");
  const result = JSON.parse(
    (await run("export", dir, spec.sceneId, output)).stdout,
  );
  assert.equal(result.exported, true);
  const markdown = await fs.readFile(path.join(output, "scene.md"), "utf8");
  const receipt = JSON.parse(
    await fs.readFile(path.join(output, "scene.provenance.json"), "utf8"),
  );
  assert.equal(markdown, "# The last crossing\n\n" + prose + "\n");
  assert.equal(
    receipt.markdownSha256,
    createHash("sha256").update(markdown).digest("hex"),
  );
  assert.equal(receipt.revisionSha256, revised.sha256);
  await assert.rejects(run("export", dir, spec.sceneId, output), /EEXIST/);
  assert.equal(
    await fs.readFile(path.join(output, "scene.md"), "utf8"),
    markdown,
  );
});
