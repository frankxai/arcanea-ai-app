import { readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

export function verifyPackage(directory) {
  const root = resolve(directory);
  const manifest = JSON.parse(
    readFileSync(resolve(root, "package.json"), "utf8"),
  );
  if (manifest.name !== "@arcanea/mcp-server" || manifest.private === true)
    throw new Error("Unexpected package identity.");
  if (!/^\d+\.\d+\.\d+(?:-[\da-zA-Z.-]+)?$/.test(manifest.version ?? ""))
    throw new Error("Invalid package version.");
  for (const group of [
    "dependencies",
    "optionalDependencies",
    "peerDependencies",
  ]) {
    for (const [name, spec] of Object.entries(manifest[group] ?? {})) {
      if (
        typeof spec !== "string" ||
        /^(workspace:|file:|link:|portal:)|^(\.\.?[/\\])/.test(spec)
      ) {
        throw new Error(`Consumer cannot resolve ${group}.${name}: ${spec}`);
      }
    }
  }
  const targets = [
    manifest.main,
    manifest.types,
    ...Object.values(manifest.bin ?? {}),
  ];
  const collect = (value) => {
    if (typeof value === "string") targets.push(value);
    else if (value && typeof value === "object")
      Object.values(value).forEach(collect);
  };
  collect(manifest.exports);
  for (const target of targets) {
    if (
      typeof target !== "string" ||
      (!target.startsWith("dist/") && !target.startsWith("./dist/"))
    )
      throw new Error(`Entrypoint must be in dist: ${target}`);
    const file = resolve(root, target);
    const local = relative(root, file);
    if (local.startsWith("..") || isAbsolute(local) || !statSync(file).isFile())
      throw new Error(`Invalid entrypoint: ${target}`);
  }
  if (
    !Array.isArray(manifest.files) ||
    !manifest.files.includes("dist/") ||
    manifest.files.some(
      (file) => !["dist/", "README.md", "LICENSE"].includes(file),
    )
  ) {
    throw new Error(
      "Package file allowlist must contain dist and documentation only.",
    );
  }
  return {
    name: manifest.name,
    version: manifest.version,
    entrypoints: [...new Set(targets)].length,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const report = verifyPackage(root);
  const version = spawnSync(
    process.execPath,
    [resolve(root, "dist/cli.js"), "--version"],
    { encoding: "utf8", timeout: 5000 },
  );
  if (
    version.error ||
    version.status !== 0 ||
    version.stdout.trim() !== report.version ||
    version.stderr
  )
    throw new Error("Packaged CLI version check failed.");
  console.log(JSON.stringify({ ...report, status: "pass" }));
}
