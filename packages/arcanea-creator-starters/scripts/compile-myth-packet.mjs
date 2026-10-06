#!/usr/bin/env node
import { open } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { compilePacket, packetMarkdown } from "../src/myth-packets.mjs";

async function readJSON(filename) {
  const handle = await open(
    filename,
    constants.O_RDONLY | constants.O_NONBLOCK,
  );
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > 262144)
      throw new Error(
        "Input must be a regular JSON file no larger than 256KiB",
      );
    const buffer = Buffer.alloc(262145);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await handle.read(
        buffer,
        length,
        buffer.length - length,
        length,
      );
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > 262144) throw new Error("Input grew beyond 256KiB");
    return JSON.parse(buffer.subarray(0, length).toString("utf8"));
  } finally {
    await handle.close();
  }
}

export async function run(args) {
  const flags = new Map();
  for (let i = 0; i < args.length; i += 2) {
    if (
      !["--brief", "--atlas", "--format"].includes(args[i]) ||
      flags.has(args[i]) ||
      !args[i + 1] ||
      args[i + 1].startsWith("--")
    )
      throw new Error(
        "Usage: --brief <file> [--atlas <file>] [--format json|md]",
      );
    flags.set(args[i], args[i + 1]);
  }
  if (!flags.has("--brief")) throw new Error("--brief is required");
  const format = flags.get("--format") ?? "json";
  if (!["json", "md"].includes(format))
    throw new Error("Format must be json or md");
  const atlasPath =
    flags.get("--atlas") ??
    fileURLToPath(new URL("../myth-atlas.v1.json", import.meta.url));
  const [brief, atlas] = await Promise.all([
    readJSON(flags.get("--brief")),
    readJSON(atlasPath),
  ]);
  const packet = compilePacket(brief, atlas);
  return format === "md"
    ? packetMarkdown(packet)
    : JSON.stringify(packet, null, 2) + "\n";
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    process.stdout.write(await run(process.argv.slice(2)));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
