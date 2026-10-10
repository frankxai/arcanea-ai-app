import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { buildManifest } from "../src/manifest.mjs";

export const exec = promisify(execFile);
export async function fixture(t) {
  const root = await fs.mkdtemp(
    path.join(os.tmpdir(), "arcanea-sdk-boundary-"),
  );
  t.after(async () => {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith("arcanea-sdk-boundary-"));
    await fs.rm(root, { recursive: true, force: true });
  });
  return root;
}

export async function authoredWorld(root, spec = {}) {
  await fs.mkdir(root, { recursive: true });
  const manifest = buildManifest({ name: "Tideglass", ...spec });
  await fs.writeFile(
    path.join(root, "world.arcanea.json"),
    JSON.stringify(manifest),
  );
  await fs.mkdir(path.join(root, "canon"), { recursive: true });
  await fs.writeFile(
    path.join(root, "canon/bridge.md"),
    "---\nvisibility: public\n---\n\n# Bridge\n\nGlass forms only at low tide.\n",
  );
  return manifest;
}

export async function git(root, ...args) {
  return (await exec("git", ["-C", root, ...args])).stdout;
}

export async function gitWorld(t) {
  const root = await fixture(t);
  await authoredWorld(root);
  await git(root, "init", "-b", "main");
  await git(root, "config", "user.name", "SDK fixture");
  await git(root, "config", "user.email", "sdk-fixture@example.invalid");
  await git(root, "add", "--", "world.arcanea.json", "canon/bridge.md");
  await git(root, "commit", "-m", "Authored fixture base");
  return root;
}
