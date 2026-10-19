import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const DEFAULT_SCAN_ROOTS = ["apps/web", "scripts"];
const CODE_EXTENSIONS = new Set([".cjs", ".js", ".mjs", ".ts", ".tsx"]);
const PROVIDER_CALL_MARKERS = [
  "api.openai.com/v1/images",
  "generativelanguage.googleapis.com",
  "api.x.ai/v1/images",
  "api.stability.ai",
  "openrouter.ai/api/v1/chat/completions",
  "imagen.generateImage(",
  "generateImages({",
  "buildImageGenerateTool",
];
const URL_CREDENTIAL_MARKERS = [
  "?key=",
  "&key=",
  "?api_key=",
  "&api_key=",
  'searchParams.set("key"',
  "searchParams.set('key'",
  'searchParams.set("api_key"',
  "searchParams.set('api_key'",
  'searchParams.append("key"',
  "searchParams.append('key'",
  'searchParams.append("api_key"',
  "searchParams.append('api_key'",
];
const EXCLUDED_RELATIVE_PATHS = new Set([
  "scripts/lib/arcanea-visual-tooling-surfaces.mjs",
]);
const EXCLUDED_DIRECTORY_NAMES = new Set([".git", ".next", "node_modules"]);

const normalize = (value) => value.replaceAll("\\", "/").replace(/^\.\//, "");

function walkCodeFiles(root, start) {
  if (!existsSync(start)) return [];
  const files = [];
  for (const entry of readdirSync(start, { withFileTypes: true })) {
    if (entry.isDirectory() && EXCLUDED_DIRECTORY_NAMES.has(entry.name))
      continue;
    const path = join(start, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkCodeFiles(root, path));
      continue;
    }
    if (!entry.isFile() || !CODE_EXTENSIONS.has(extname(entry.name))) continue;
    const relativePath = normalize(relative(root, path));
    if (
      EXCLUDED_RELATIVE_PATHS.has(relativePath) ||
      relativePath.startsWith("scripts/tests/")
    ) {
      continue;
    }
    files.push({ path, relativePath });
  }
  return files;
}

export function detectVisualToolingSurfaces({
  root,
  scanRoots = DEFAULT_SCAN_ROOTS,
}) {
  return detectCodePathsWithMarkers({
    root,
    scanRoots,
    markers: PROVIDER_CALL_MARKERS,
  });
}

function detectCodePathsWithMarkers({ root, scanRoots, markers }) {
  const resolvedRoot = resolve(root);
  const detected = new Set();
  for (const scanRoot of scanRoots) {
    const start = resolve(resolvedRoot, scanRoot);
    for (const file of walkCodeFiles(resolvedRoot, start)) {
      const source = readFileSync(file.path, "utf8");
      if (markers.some((marker) => source.includes(marker))) {
        detected.add(file.relativePath);
      }
    }
  }
  return [...detected].sort();
}

export function auditVisualToolingSurfaces({
  root,
  registryPath,
  scanRoots = DEFAULT_SCAN_ROOTS,
  credentialScanRoots = ["apps/web"],
}) {
  const resolvedRoot = resolve(root);
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));
  const registrations = [];
  for (const surface of registry.surfaces ?? []) {
    for (const path of surface.paths ?? []) {
      registrations.push({
        path: normalize(path),
        surfaceId: surface.id,
        classification: surface.classification,
      });
    }
  }

  const counts = new Map();
  for (const registration of registrations) {
    counts.set(registration.path, (counts.get(registration.path) ?? 0) + 1);
  }

  const registeredPaths = new Set(registrations.map(({ path }) => path));
  const detectedPaths = detectVisualToolingSurfaces({
    root: resolvedRoot,
    scanRoots,
  });
  const credentialInUrlPaths = detectCodePathsWithMarkers({
    root: resolvedRoot,
    scanRoots: credentialScanRoots,
    markers: URL_CREDENTIAL_MARKERS,
  });
  const unregisteredDetectedPaths = detectedPaths.filter(
    (path) => !registeredPaths.has(path),
  );
  const missingRegisteredPaths = [...registeredPaths]
    .filter((path) => !existsSync(resolve(resolvedRoot, path)))
    .sort();
  const duplicateRegisteredPaths = [...counts]
    .filter(([, count]) => count > 1)
    .map(([path]) => path)
    .sort();
  const canonicalLaneCount = (registry.surfaces ?? []).filter(
    ({ id }) => id === registry.canonicalLaneId,
  ).length;

  return {
    registry,
    detectedPaths,
    registeredPaths: [...registeredPaths].sort(),
    unregisteredDetectedPaths,
    missingRegisteredPaths,
    duplicateRegisteredPaths,
    canonicalLaneCount,
    credentialInUrlPaths,
  };
}
