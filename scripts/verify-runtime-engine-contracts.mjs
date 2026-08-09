import { readFileSync } from "node:fs";
import { createServer } from "node:http";
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

const lockfileContracts = [
  {
    dependency: "undici",
    consumers: ["package.json", "apps/web/package.json"],
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

function findLockfileDependencyRanges(dependencyName) {
  const lines = readFileSync(
    join(repositoryRoot, "pnpm-lock.yaml"),
    "utf8",
  ).split(/\r?\n/);
  const header = `  /${dependencyName}@`;
  const ranges = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].startsWith(header)) continue;

    const version = lines[index].slice(header.length, -1);
    let dependencyRange = null;
    for (let blockIndex = index + 1; blockIndex < lines.length; blockIndex += 1) {
      const line = lines[blockIndex];
      if (line.startsWith("  /") || line.startsWith("snapshots:")) break;
      const match = line.match(/^    engines: \{node: ['"]([^'"]+)['"]\}$/);
      if (match) {
        dependencyRange = match[1];
        break;
      }
    }

    ranges.push({ version, dependencyRange });
  }

  return ranges;
}

async function verifyActionsHttpClientCompatibility() {
  const actionRequire = createRequire(
    join(repositoryRoot, "packages/taste-score-action/package.json"),
  );
  const coreRequire = createRequire(
    actionRequire.resolve("@actions/core/package.json"),
  );
  const httpClientRequire = createRequire(
    coreRequire.resolve("@actions/http-client/package.json"),
  );
  const { HttpClient } = httpClientRequire("@actions/http-client");
  const undiciManifest = httpClientRequire("undici/package.json");

  if (!semver.satisfies(undiciManifest.version, ">=6.28.0 <7")) {
    throw new Error(
      `@actions/http-client must resolve the patched Undici 6 boundary; received ${undiciManifest.version}.`,
    );
  }

  const server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end("ok");
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Loopback runtime-contract server did not expose a port.");
    }

    const client = new HttpClient("arcanea-runtime-contract-smoke");
    try {
      const response = await client.get(
        `http://127.0.0.1:${address.port}/health`,
      );
      const body = await response.readBody();
      if (response.message.statusCode !== 200 || body !== "ok") {
        throw new Error(
          `@actions/http-client smoke returned ${response.message.statusCode} ${JSON.stringify(body)}.`,
        );
      }
    } finally {
      client.dispose();
    }
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
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

for (const contract of lockfileContracts) {
  const dependencyRanges = findLockfileDependencyRanges(contract.dependency);
  if (dependencyRanges.length === 0) {
    failures.push(
      `pnpm-lock.yaml must resolve ${contract.dependency} for its runtime contract.`,
    );
    continue;
  }

  for (const consumer of contract.consumers) {
    const consumerRange = readJson(consumer).engines?.node;
    if (!consumerRange || !semver.validRange(consumerRange)) {
      failures.push(
        `${consumer} must declare a valid engines.node range; received ${JSON.stringify(consumerRange)}.`,
      );
      continue;
    }

    for (const dependency of dependencyRanges) {
      if (
        !dependency.dependencyRange ||
        !semver.validRange(dependency.dependencyRange)
      ) {
        failures.push(
          `${contract.dependency}@${dependency.version} must expose a valid engines.node range in pnpm-lock.yaml; received ${JSON.stringify(dependency.dependencyRange)}.`,
        );
        continue;
      }

      if (!semver.subset(consumerRange, dependency.dependencyRange)) {
        failures.push(
          `${consumer} advertises Node ${consumerRange}, but ${contract.dependency}@${dependency.version} requires ${dependency.dependencyRange}.`,
        );
      }
    }
  }
}

try {
  await verifyActionsHttpClientCompatibility();
} catch (error) {
  failures.push(`Action HTTP client compatibility failed: ${error.message}`);
}

if (failures.length > 0) {
  console.error("Runtime engine contract verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Runtime engine contracts verified for ${contracts.length} workspace surfaces.`,
);
