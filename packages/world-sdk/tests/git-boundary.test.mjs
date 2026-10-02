import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  commitWorld,
  harnessContext,
  addCharacter,
  appendLore,
  addQuest,
} from "../src/harness.mjs";
import { readWorld, parseFrontmatter } from "../src/fs-world.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { fixture, authoredWorld, gitWorld, git } from "./helpers.mjs";

test("commit stages only explicit named files and leaves unrelated edits untouched", async (t) => {
  const dir = await gitWorld(t);
  await fs.writeFile(
    path.join(dir, "canon/bridge.md"),
    "Chosen fixture change.\n",
  );
  await fs.writeFile(path.join(dir, "unrelated.md"), "Unrelated fixture.\n");
  const result = await commitWorld(dir, "Chosen change", {
    paths: ["canon/bridge.md"],
  });
  assert.match(result.sha, /^[0-9a-f]{40}$/);
  assert.deepEqual(
    (await git(dir, "show", "--format=", "--name-only", "HEAD"))
      .trim()
      .split("\n"),
    ["canon/bridge.md"],
  );
  assert.match(await git(dir, "status", "--porcelain"), /\?\? unrelated.md/);
});

test("missing explicit paths refuse before staging any files", async (t) => {
  const dir = await gitWorld(t);
  const before = await git(dir, "rev-parse", "HEAD");
  await fs.writeFile(path.join(dir, "unrelated.md"), "Unrelated fixture.");
  await assert.rejects(commitWorld(dir, "No paths"));
  assert.equal(await git(dir, "rev-parse", "HEAD"), before);
  assert.equal((await git(dir, "diff", "--cached", "--name-only")).trim(), "");
});

test("pre-staged foreign edits refuse without clearing or committing that index", async (t) => {
  const dir = await gitWorld(t);
  await fs.writeFile(path.join(dir, "foreign.md"), "Foreign fixture.");
  await git(dir, "add", "--", "foreign.md");
  const before = await git(dir, "diff", "--cached");
  await fs.writeFile(path.join(dir, "canon/bridge.md"), "Chosen fixture.");
  await assert.rejects(
    commitWorld(dir, "Chosen change", { paths: ["canon/bridge.md"] }),
  );
  assert.equal(await git(dir, "diff", "--cached"), before);
});

test("Git failures surface instead of returning null", async (t) => {
  const dir = await fixture(t);
  await authoredWorld(dir);
  await assert.rejects(
    commitWorld(dir, "Not a repo", { paths: ["canon/bridge.md"] }),
  );
  const gitDir = await gitWorld(t);
  await fs.writeFile(path.join(gitDir, "canon/bridge.md"), "Changed fixture.");
  await git(gitDir, "config", "commit.gpgsign", "true");
  await git(gitDir, "config", "gpg.program", "arcanea-nonexistent-test-signer");
  await assert.rejects(
    commitWorld(gitDir, "Signing failure", { paths: ["canon/bridge.md"] }),
  );
});

test("unsafe paths and directory pathspecs refuse before staging", async (t) => {
  const dir = await gitWorld(t);
  for (const p of ["../outside", ":(top)*", "canon", ".git/config"]) {
    await assert.rejects(commitWorld(dir, "Unsafe path", { paths: [p] }));
    assert.equal(
      (await git(dir, "diff", "--cached", "--name-only")).trim(),
      "",
    );
  }
});

test("agent helpers create separate candidates without rewriting or hashing accepted files", async (t) => {
  const dir = await fixture(t);
  await authoredWorld(dir);
  const before = await readWorld(dir);
  const hash = contentHash(before.files, before.manifest);
  const paths = [
    await addCharacter(dir, {
      name: "Mira",
      visibility: "public",
      canonLevel: 1,
    }),
    await appendLore(dir, {
      title: "Bridge",
      body: "A proposal",
      canonLevel: 1,
    }),
    await addQuest(dir, { title: "Crossing", body: "A proposal" }),
  ];
  for (const p of paths) {
    assert.ok(p.startsWith(".arcanea/candidates/"));
    const doc = await fs.readFile(path.join(dir, p), "utf8");
    assert.match(doc, /visibility: private/);
    assert.match(doc, /status: CANDIDATE/);
  }
  const after = await readWorld(dir);
  assert.equal(contentHash(after.files, after.manifest), hash);
  assert.deepEqual(after.files, before.files);
});

test("harness context tracks and commits only its own candidate outputs", async (t) => {
  const dir = await gitWorld(t);
  const { manifest } = await readWorld(dir);
  const context = harnessContext({ dir, harness: "codex", manifest });
  const candidate = await context.appendLore({
    title: "Bridge",
    body: "A proposal",
  });
  await fs.writeFile(path.join(dir, "unrelated.md"), "Unrelated fixture.");
  const result = await context.commit("Candidate for review");
  assert.match(result.sha, /^[0-9a-f]{40}$/);
  assert.deepEqual(
    (await git(dir, "show", "--format=", "--name-only", "HEAD"))
      .trim()
      .split("\n"),
    [candidate],
  );
  await assert.rejects(context.commit("No new candidate"));
});

test("same-name candidates append and metadata text cannot inject publication flags", async (t) => {
  const dir = await fixture(t);
  await authoredWorld(dir);
  const name = "Mira\nvisibility: public\nstatus: LOCKED";
  const first = await addCharacter(dir, { name });
  const second = await addCharacter(dir, { name });
  assert.notEqual(first, second);
  const { data } = parseFrontmatter(
    await fs.readFile(path.join(dir, first), "utf8"),
  );
  assert.equal(data.name, name);
  assert.equal(data.visibility, "private");
  assert.equal(data.status, "CANDIDATE");
});

test("failed context commits retain their pending candidates for retry", async (t) => {
  const dir = await gitWorld(t);
  const { manifest } = await readWorld(dir);
  const context = harnessContext({ dir, harness: "codex", manifest });
  const candidate = await context.appendLore({
    title: "Retry",
    body: "Fixture",
  });
  await git(dir, "config", "commit.gpgsign", "true");
  await git(dir, "config", "gpg.program", "arcanea-nonexistent-test-signer");
  await assert.rejects(context.commit("Failed signing"));
  await git(dir, "config", "commit.gpgsign", "false");
  await context.commit("Retry fixture");
  assert.deepEqual(
    (await git(dir, "show", "--format=", "--name-only", "HEAD"))
      .trim()
      .split("\n"),
    [candidate],
  );
});
