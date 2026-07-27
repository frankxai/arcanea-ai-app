import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = join(repositoryRoot, "apps/web");
const requireFromWeb = createRequire(join(webRoot, "package.json"));
const eslintEntry = requireFromWeb.resolve("eslint");
const requireFromEslint = createRequire(eslintEntry);
const configArrayEntry = requireFromEslint.resolve("@eslint/config-array");
const requireFromConfigArray = createRequire(configArrayEntry);
const minimatch = requireFromConfigArray("minimatch");
const minimatchManifest = requireFromConfigArray("minimatch/package.json");

if (minimatchManifest.version !== "3.1.5") {
  throw new Error(
    `Expected @eslint/config-array to resolve minimatch 3.1.5; received ${minimatchManifest.version}.`,
  );
}

if (
  typeof minimatch !== "function" ||
  !minimatch("lint-runtime-smoke.ts", "{lint-runtime-smoke,other}.ts")
) {
  throw new Error(
    "The ESLint minimatch adapter cannot execute brace expansion.",
  );
}

const { ESLint } = requireFromWeb("eslint");
const eslint = new ESLint({ cwd: webRoot });
const [result] = await eslint.lintText(
  "export const lintRuntimeSmoke = true;\n",
  { filePath: "lint-runtime-smoke.ts" },
);

if (!result || result.errorCount > 0 || result.fatalErrorCount > 0) {
  const messages = result?.messages
    ?.map(({ line, column, ruleId, message }) =>
      `${line ?? 0}:${column ?? 0} ${ruleId ?? "fatal"} ${message}`,
    )
    .join("\n");
  console.error(messages || "ESLint did not return a lint result.");
  process.exit(1);
}

console.log(
  `Web lint runtime verified with ESLint ${ESLint.version} and minimatch ${minimatchManifest.version}.`,
);
