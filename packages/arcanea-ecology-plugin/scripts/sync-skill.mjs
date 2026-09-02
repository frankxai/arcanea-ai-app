import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repositoryRoot = resolve(pluginRoot, "../..");
const source = resolve(
  repositoryRoot,
  "oss/skills/arcanea/arcanea-ecology-forge",
);
const target = resolve(
  pluginRoot,
  "skills/arcanea-ecology-forge",
);

await rm(target, { recursive: true, force: true });
await mkdir(dirname(target), { recursive: true });
await cp(source, target, { recursive: true });

console.log(`Synced canonical Ecology Forge skill into ${target}`);
