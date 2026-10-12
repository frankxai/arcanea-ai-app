#!/usr/bin/env node

/**
 * @arcanea/cli — Standalone Bundle Builder
 *
 * Bundles the entire CLI (all @arcanea/* packages, commander, picocolors)
 * into a single standalone file with zero runtime dependencies.
 *
 * Usage: node build.mjs
 * Output: dist/arcanea.cjs
 */

import { buildSync } from "esbuild";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "dist");
const entryPoint = resolve(distDir, "index.js");
const outFile = resolve(distDir, "arcanea.cjs");

if (process.argv.includes("--standalone-package-only")) {
  console.error(
    "Build @arcanea/core and @arcanea/cli first, then pack the standalone directory with: pnpm --dir packages/cli/dist/package pack",
  );
  process.exit(1);
}

// ── Pre-flight checks ──────────────────────────────────────────────
if (!existsSync(entryPoint)) {
  console.error(
    "  ERROR: dist/index.js not found.\n" +
      "  Run `tsc` first to compile TypeScript, then run this script.\n",
  );
  process.exit(1);
}

// ── Bundle ──────────────────────────────────────────────────────────
console.log("  Bundling @arcanea/cli...\n");

try {
  const result = buildSync({
    absWorkingDir: __dirname,
    entryPoints: [entryPoint],
    outfile: outFile,
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    packages: "bundle",
    alias: { "@arcanea/core": resolve(__dirname, "../core/dist/index.js") },
    metafile: true,
    logLevel: "info",
  });
  const inputs = Object.keys(result.metafile.inputs);
  if (inputs.some((path) => /@arcanea(?:\+|\/)core@/.test(path))) {
    throw new Error(
      "The standalone CLI must bundle the workspace core, not a stale registry copy.",
    );
  }
  writeFileSync(
    resolve(distDir, "bundle-metadata.json"),
    JSON.stringify(result.metafile, null, 2) + "\n",
  );
} catch (err) {
  console.error("\n  Bundle failed:\n");
  console.error(err.stderr || err.message);
  process.exit(1);
}

// ── Verify ──────────────────────────────────────────────────────────
const bundle = readFileSync(outFile);
const sizeKb = (bundle.byteLength / 1024).toFixed(1);

// Verify shebang
const head = bundle.toString("utf8").slice(0, 100);
const hasShebang = head.startsWith("#!/usr/bin/env node");
if (!hasShebang)
  throw new Error("The standalone CLI requires its Node shebang.");

// Development keeps the frozen workspace dependencies. Consumers install the
// complete standalone bundle, without fetching unpublished workspace packages.
const sourceManifest = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf8"),
);
const { dependencies, devDependencies, scripts, publishConfig, ...metadata } =
  sourceManifest;
const packageDir = resolve(distDir, "package");
mkdirSync(resolve(packageDir, "dist"), { recursive: true });
writeFileSync(resolve(packageDir, "dist/arcanea.cjs"), bundle);
copyFileSync(
  resolve(distDir, "index.d.ts"),
  resolve(packageDir, "dist/index.d.ts"),
);
copyFileSync(resolve(__dirname, "README.md"), resolve(packageDir, "README.md"));
writeFileSync(
  resolve(packageDir, "package.json"),
  JSON.stringify(
    {
      ...metadata,
      main: "./dist/arcanea.cjs",
      exports: {
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/arcanea.cjs",
          require: "./dist/arcanea.cjs",
        },
      },
      files: ["dist/arcanea.cjs", "dist/index.d.ts", "README.md"],
      publishConfig: { access: publishConfig.access },
    },
    null,
    2,
  ) + "\n",
);

console.log(`\n  Output: dist/arcanea.cjs (${sizeKb} KB)`);
console.log(`  Shebang: ${hasShebang ? "yes" : "MISSING"}`);
console.log(`\n  Run with: node dist/arcanea.cjs --help`);
console.log(`  Or:       node dist/arcanea.cjs status`);
console.log(`  Or:       node dist/arcanea.cjs init\n`);
