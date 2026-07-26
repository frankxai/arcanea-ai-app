import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import semver from "semver";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const contracts = [
  {
    consumer: "package.json",
    dependencies: [
      ["package.json", "next"],
      ["package.json", "glob"],
      ["apps/web/package.json", "next"],
      ["apps/web/package.json", "sharp"],
    ],
  },
  {
    consumer: "apps/web/package.json",
    dependencies: [
      ["apps/web/package.json", "next"],
      ["apps/web/package.json", "sharp"],
    ],
  },
  {
    consumer: "packages/media/package.json",
    dependencies: [
      ["packages/media/package.json", "glob"],
      ["packages/media/package.json", "sharp"],
    ],
  },
];

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(repositoryRoot, relativePath), "utf8"));
}

function findDependencyManifest(ownerManifest, dependencyName) {
  const ownerPath = join(repositoryRoot, ownerManifest);
  const requireFromOwner = createRequire(ownerPath);

  try {
    return requireFromOwner.resolve(`${dependencyName}/package.json`);
  } catch {
    let current = dirname(requireFromOwner.resolve(dependencyName));

    while (true) {
      const candidate = join(current, "package.json");
      try {
        if (
          JSON.parse(readFileSync(candidate, "utf8")).name === dependencyName
        ) {
          return candidate;
        }
      } catch {
        // Keep walking until the dependency package root is found.
      }
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }

  throw new Error(
    `Could not resolve ${dependencyName} from ${ownerManifest}; run pnpm install first.`,
  );
}

const failures = [];

for (const contract of contracts) {
  const consumerManifest = readJson(contract.consumer);
  const consumerRange = consumerManifest.engines?.node;

  if (!consumerRange || !semver.validRange(consumerRange)) {
    failures.push(
      `${contract.consumer} must declare a valid engines.node range; received ${JSON.stringify(consumerRange)}.`,
    );
    continue;
  }

  for (const [ownerManifest, dependencyName] of contract.dependencies) {
    const dependencyManifestPath = findDependencyManifest(
      ownerManifest,
      dependencyName,
    );
    const dependencyManifest = JSON.parse(
      readFileSync(dependencyManifestPath, "utf8"),
    );
    const dependencyRange = dependencyManifest.engines?.node;

    if (!dependencyRange || !semver.validRange(dependencyRange)) {
      failures.push(
        `${dependencyManifest.name} must expose a valid engines.node range; received ${JSON.stringify(dependencyRange)}.`,
      );
      continue;
    }

    if (!semver.subset(consumerRange, dependencyRange)) {
      failures.push(
        `${contract.consumer} advertises Node ${consumerRange}, but ${dependencyManifest.name}@${dependencyManifest.version} requires ${dependencyRange}.`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("Runtime engine contract verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Runtime engine contracts verified for ${contracts.length} workspace surfaces.`,
);
