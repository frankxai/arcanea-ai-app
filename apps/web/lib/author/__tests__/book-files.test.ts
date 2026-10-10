import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mkdtemp,
  mkdir,
  writeFile,
  symlink,
  unlink,
  rmdir,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readBookContextFile, listBookContextFiles } from "../book-files";

test("author context allows in-root files and refuses traversal, sibling prefixes and symlinks", async (t) => {
  const fixture = await mkdtemp(join(tmpdir(), "arcanea-author-path-"));
  const root = join(fixture, "book");
  const sibling = join(fixture, "book-private");
  const link = join(root, "linked.md");
  let linked = false;
  try {
    await mkdir(root);
    await mkdir(join(root, "chapters"));
    await mkdir(sibling);
    await writeFile(join(root, "chapters", "chapter.md"), "owned chapter");
    await writeFile(join(sibling, "secret.md"), "private outside content");
    assert.equal(
      await readBookContextFile(root, "chapters/chapter.md"),
      "owned chapter",
    );
    assert.deepEqual(
      await listBookContextFiles(root, join(root, "chapters")),
      ["chapter.md"].sort(),
    );
    for (const outside of [
      "../book-private/secret.md",
      join(sibling, "secret.md"),
    ]) {
      await assert.rejects(
        readBookContextFile(root, outside),
        /outside its root/,
      );
    }
    await assert.rejects(
      listBookContextFiles(root, sibling),
      /outside its root/,
    );
    try {
      await symlink(join(sibling, "secret.md"), link, "file");
      linked = true;
      await assert.rejects(readBookContextFile(root, link), /outside its root/);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error;
      t.diagnostic(
        "Windows denied fixture symlink creation; CI must exercise this assertion.",
      );
    }
  } finally {
    if (linked) await unlink(link);
    await unlink(join(root, "chapters", "chapter.md"));
    await unlink(join(sibling, "secret.md"));
    await rmdir(join(root, "chapters"));
    await rmdir(root);
    await rmdir(sibling);
    await rmdir(fixture);
  }
});
