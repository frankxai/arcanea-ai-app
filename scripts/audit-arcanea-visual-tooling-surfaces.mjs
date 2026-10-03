import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { auditVisualToolingSurfaces } from "./lib/arcanea-visual-tooling-surfaces.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(
  root,
  "docs/design/arcanea-visual-tooling-surface-registry.v1.json",
);
const report = auditVisualToolingSurfaces({ root, registryPath });
const failures = [
  ...report.unregisteredDetectedPaths.map(
    (path) => `unregistered provider-call surface: ${path}`,
  ),
  ...report.missingRegisteredPaths.map(
    (path) => `registered path is missing: ${path}`,
  ),
  ...report.duplicateRegisteredPaths.map(
    (path) => `path is registered more than once: ${path}`,
  ),
  ...report.credentialInUrlPaths.map(
    (path) => `active web code places a provider credential in a URL: ${path}`,
  ),
];
if (report.canonicalLaneCount !== 1) {
  failures.push(
    `expected exactly one canonical lane, found ${report.canonicalLaneCount}`,
  );
}

if (failures.length > 0) {
  console.error(
    `Arcanea visual tooling surface audit failed (${failures.length}):`,
  );
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Arcanea visual tooling surface audit passed: ${report.detectedPaths.length} provider-adjacent code surfaces detected, ${report.registeredPaths.length} paths classified across ${report.registry.surfaces.length} boundaries, 1 canonical campaign lane.`,
);
