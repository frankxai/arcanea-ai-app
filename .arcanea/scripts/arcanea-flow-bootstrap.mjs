import path from "path";
import { pathToFileURL } from "url";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");
const entrypoint = path.join(
  repoRoot,
  "arcanea-flow",
  "dist",
  "v3",
  "@arcanea-flow",
  "cli",
  "src",
  "index.js",
);

const { default: CLI } = await import(pathToFileURL(entrypoint).href);
const cli = new CLI({
  name: "arcanea-flow",
  description: "Arcanea Flow V3 - AI Agent Orchestration Platform",
});

await cli.run(process.argv.slice(2));
