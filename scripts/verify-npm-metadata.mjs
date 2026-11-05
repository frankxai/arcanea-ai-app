import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repository = "https://github.com/frankxai/arcanea-ai-app";

export function metadataErrors(pkg, directory) {
  const errors = [];
  if (
    pkg.repository?.type !== "git" ||
    pkg.repository?.url !== `${repository}.git` ||
    pkg.repository?.directory !== directory
  ) {
    errors.push(
      "repository must identify the canonical publisher and workspace directory",
    );
  }
  if (pkg.bugs?.url !== `${repository}/issues`)
    errors.push("bugs must use the canonical issue tracker");
  if (pkg.homepage !== `${repository}/tree/main/${directory}`)
    errors.push("homepage must link to this package");
  return errors;
}

export function verify(root) {
  const failures = [];
  let checked = 0;
  for (const entry of readdirSync(join(root, "packages"), {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    let pkg;
    try {
      pkg = JSON.parse(
        readFileSync(
          join(root, "packages", entry.name, "package.json"),
          "utf8",
        ),
      );
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    if (pkg.private === true || !pkg.name?.startsWith("@arcanea/")) continue;
    checked++;
    for (const error of metadataErrors(pkg, `packages/${entry.name}`))
      failures.push(`${pkg.name}: ${error}`);
  }
  if (checked === 0)
    failures.push("No publishable Arcanea packages were checked");
  return { checked, failures };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = verify(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.failures.length ? 1 : 0;
}
