import { readFileSync } from "node:fs";

const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { name?: unknown; version?: unknown };

if (
  manifest.name !== "@arcanea/mcp-server" ||
  typeof manifest.version !== "string" ||
  !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(
    manifest.version,
  )
) {
  throw new Error("Invalid Arcanea MCP package identity or version.");
}

/** Package metadata is the single version authority in source and installed builds. */
export const RUNTIME_INFO = Object.freeze({
  name: "arcanea-mcp",
  version: manifest.version,
});
