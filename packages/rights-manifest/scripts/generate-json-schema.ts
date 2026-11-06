import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { rightsManifestJsonSchema } from "../src/json-schema.ts";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(
  here,
  "../schema/arcanea.rights_manifest.v0.schema.json",
);
mkdirSync(dirname(target), { recursive: true });
writeFileSync(
  target,
  `${JSON.stringify(rightsManifestJsonSchema(), null, 2)}\n`,
);
console.log(`wrote ${target}`);
