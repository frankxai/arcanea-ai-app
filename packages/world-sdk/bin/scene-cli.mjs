import { promises as fs } from "node:fs";
import path from "node:path";
import {
  createSceneDraft,
  readSceneDraft,
  reviseSceneDraft,
  scenePrompt,
  exportSceneDraft,
} from "../src/scene-drafts.mjs";

async function inputFile(file, maxBytes) {
  const handle = await fs.open(file, "r");
  try {
    if (!(await handle.stat()).isFile())
      throw new Error("Input must be a regular file.");
    const buffer = Buffer.alloc(maxBytes + 1);
    let count = 0;
    while (count <= maxBytes) {
      const { bytesRead } = await handle.read(
        buffer,
        count,
        buffer.length - count,
        null,
      );
      if (!bytesRead) break;
      count += bytesRead;
    }
    if (count > maxBytes) throw new Error("Input exceeds its byte limit.");
    return new TextDecoder("utf-8", { fatal: true }).decode(
      buffer.subarray(0, count),
    );
  } finally {
    await handle.close();
  }
}

/** Execute scene commands without opening a provider connection or reading env keys. */
export async function runSceneCommand(args) {
  const [action, dir, sceneOrSpec, proseFile, expectedSha256, producerFile] =
    args;
  if (action === "start" && args.length === 3) {
    return JSON.stringify(
      await createSceneDraft(
        dir,
        JSON.parse(await inputFile(sceneOrSpec, 16_000)),
      ),
      null,
      2,
    );
  }
  if (action === "show" && args.length === 3)
    return JSON.stringify(await readSceneDraft(dir, sceneOrSpec), null, 2);
  if (action === "prompt" && args.length === 3)
    return scenePrompt(dir, sceneOrSpec);
  if (action === "revise" && args.length === 6) {
    return JSON.stringify(
      await reviseSceneDraft(dir, sceneOrSpec, {
        expectedSha256,
        prose: await inputFile(proseFile, 128_000),
        producer: JSON.parse(await inputFile(producerFile, 2000)),
      }),
      null,
      2,
    );
  }
  if (action === "export" && args.length === 4) {
    const payload = await exportSceneDraft(dir, sceneOrSpec);
    const root = await fs.realpath(dir);
    const parent = await fs.realpath(path.dirname(path.resolve(proseFile)));
    const output = path.join(parent, path.basename(path.resolve(proseFile)));
    const relative = path.relative(root, output);
    if (
      !relative ||
      (!relative.startsWith(".." + path.sep) &&
        relative !== ".." &&
        !path.isAbsolute(relative))
    ) {
      throw new Error(
        "Export into a new directory outside the source world; publication remains unapproved.",
      );
    }
    // Claim a fresh directory. An existing output is always preserved, including a
    // previous interrupted export. Receipt is written last to mark a complete pair.
    await fs.mkdir(output, { mode: 0o700 });
    await fs.writeFile(path.join(output, "scene.md"), payload.markdown, {
      flag: "wx",
      mode: 0o600,
    });
    await fs.writeFile(
      path.join(output, "scene.provenance.json"),
      payload.receipt,
      { flag: "wx", mode: 0o600 },
    );
    return JSON.stringify({
      exported: true,
      directory: output,
      files: ["scene.md", "scene.provenance.json"],
      canonApproved: false,
      publicationApproved: false,
    });
  }
  throw new Error(
    "usage: arcanea-world scene start <world> <spec.json> | show|prompt <world> <scene-id> | revise <world> <scene-id> <prose.md> <parent-sha256> <producer.json> | export <world> <scene-id> <new-directory-outside-world>",
  );
}
