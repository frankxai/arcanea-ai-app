import { fileURLToPath } from "node:url";
import { build } from "../packages/arcanea-creator-starters/scripts/build.mjs";

// Resolve from this adapter, never from the shell's working directory.
const output = fileURLToPath(
  new URL("../apps/web/public/creator-starters/", import.meta.url),
);
console.log(
  JSON.stringify(
    await build(output, { check: process.argv.includes("--check") }),
  ),
);
