import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";

function getArg(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function resolveEvidencePath(root, value) {
  return resolve(root, value.replaceAll("/", "\\"));
}

function listFiles(path, extension) {
  return readdirSync(path, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && extname(entry.name).toLowerCase() === extension,
    )
    .map((entry) => entry.name)
    .sort();
}

function countBy(items, selector) {
  return items.reduce((counts, item) => {
    const key = selector(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function stableObject(value) {
  return Object.fromEntries(
    Object.entries(value).sort(([left], [right]) => left.localeCompare(right)),
  );
}

try {
  const repoRoot = process.cwd();
  const evidencePath = resolve(
    repoRoot,
    getArg("evidence", "planning-with-files/design-loop-evidence.json"),
  );
  const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
  const artifacts = Array.isArray(evidence.artifacts) ? evidence.artifacts : [];
  const artifactEndingWith = (suffix) => {
    const artifact = artifacts.find(({ path_or_url: value }) =>
      value?.replaceAll("\\", "/").endsWith(suffix),
    );
    if (!artifact)
      throw new Error(`Evidence artifact ending in ${suffix} is missing.`);
    return resolveEvidencePath(repoRoot, artifact.path_or_url);
  };

  const mastersPath = artifactEndingWith("/wave-02/masters");
  const dossiersPath = artifactEndingWith("/wave-02/infographics");
  const atlasPath = artifactEndingWith("/wave-02/hundredfold-atlas.svg");
  const packetPath = artifactEndingWith("/wave-02/media-intake-packet.json");
  const packetRoot = dirname(packetPath);
  const deep = process.argv.includes("--deep");
  const failures = [];
  const requireTruth = (condition, message) => {
    if (!condition) failures.push(message);
  };

  for (const path of [mastersPath, dossiersPath, atlasPath, packetPath]) {
    requireTruth(
      existsSync(path),
      `Required prior-evidence artifact is missing: ${path}`,
    );
  }
  if (failures.length > 0) throw new Error(failures.join("\n"));

  const masterFiles = listFiles(mastersPath, ".png");
  const dossierFiles = listFiles(dossiersPath, ".svg");
  const atlasBytes = readFileSync(atlasPath);
  const atlasText = atlasBytes.toString("utf8");
  const atlasImageCount = [...atlasText.matchAll(/<image\b/g)].length;
  const atlasMasterFiles = [
    ...atlasText.matchAll(/<image\b[^>]*\bhref="masters\/([^"]+)"/g),
  ]
    .map((match) => match[1])
    .sort();
  const packetBytes = readFileSync(packetPath);
  const packet = JSON.parse(packetBytes.toString("utf8"));
  const assets = Array.isArray(packet.assets) ? packet.assets : [];

  requireTruth(
    masterFiles.length === 100,
    `Expected 100 Wave-02 PNG masters, found ${masterFiles.length}.`,
  );
  requireTruth(
    dossierFiles.length === 100,
    `Expected 100 Wave-02 SVG dossiers, found ${dossierFiles.length}.`,
  );
  requireTruth(
    atlasImageCount === 100,
    `Expected 100 atlas image nodes, found ${atlasImageCount}.`,
  );
  requireTruth(
    assets.length === 130,
    `Expected 130 intake records, found ${assets.length}.`,
  );

  const ids = new Set();
  const clientIds = new Set();
  const hashes = new Set();
  const resolvedSources = [];
  const resolvedDossiers = [];
  const wave02MasterFiles = [];
  const wave02DossierFiles = [];
  let legacyDossierFallbacks = 0;
  let verifiedContentBytes = 0;

  for (const asset of assets) {
    const id = asset.visual?.id;
    const clientId = asset.clientAssetId;
    const source = asset.source ?? {};
    const sourcePath = resolve(packetRoot, source.localPath ?? "");
    const expectedHash = source.sha256;
    const primaryDossierPath = resolve(
      packetRoot,
      asset.provenance?.dossierPath ?? "",
    );
    const legacyDossierPath = resolve(
      packetRoot,
      "..",
      asset.provenance?.dossierPath ?? "",
    );
    const dossierPath = existsSync(primaryDossierPath)
      ? primaryDossierPath
      : existsSync(legacyDossierPath)
        ? legacyDossierPath
        : null;

    requireTruth(
      typeof id === "string" && id.length > 0,
      "An intake record has no visual id.",
    );
    requireTruth(!ids.has(id), `Duplicate visual id: ${id}`);
    requireTruth(
      typeof clientId === "string" && clientId.length > 0,
      `${id} has no client asset id.`,
    );
    requireTruth(
      !clientIds.has(clientId),
      `Duplicate client asset id: ${clientId}`,
    );
    requireTruth(
      /^[a-f0-9]{64}$/.test(expectedHash ?? ""),
      `${id} has an invalid source SHA-256.`,
    );
    requireTruth(
      !hashes.has(expectedHash),
      `Duplicate source SHA-256: ${expectedHash}`,
    );
    requireTruth(
      existsSync(sourcePath),
      `${id} source is missing: ${sourcePath}`,
    );
    requireTruth(
      dossierPath !== null,
      `${id} dossier is missing from both packet-relative locations.`,
    );
    requireTruth(
      asset.publicationGate?.publication === "not-authorized",
      `${id} is not held at publication=not-authorized.`,
    );
    requireTruth(
      asset.publicationGate?.rights === "pending-human-clearance",
      `${id} is not held at rights=pending-human-clearance.`,
    );
    requireTruth(
      asset.expectedIngestResult?.sha256 === expectedHash,
      `${id} expected-ingest hash differs from its source hash.`,
    );

    if (existsSync(sourcePath)) {
      const observedBytes = statSync(sourcePath).size;
      requireTruth(
        observedBytes === source.byteSize,
        `${id} byte size changed: expected ${source.byteSize}, observed ${observedBytes}.`,
      );
      verifiedContentBytes += observedBytes;
      if (deep) {
        requireTruth(
          sha256File(sourcePath) === expectedHash,
          `${id} source SHA-256 changed.`,
        );
      }
    }
    if (dossierPath === legacyDossierPath) legacyDossierFallbacks += 1;
    if (asset.provenance?.collectionWave === "wave-02") {
      wave02MasterFiles.push(basename(sourcePath));
      if (dossierPath) wave02DossierFiles.push(basename(dossierPath));
    }

    ids.add(id);
    clientIds.add(clientId);
    hashes.add(expectedHash);
    resolvedSources.push(sourcePath);
    resolvedDossiers.push(dossierPath);
  }

  const byWave = stableObject(
    countBy(assets, (asset) => asset.provenance?.collectionWave ?? "unknown"),
  );
  const byGate = stableObject(
    countBy(assets, (asset) => asset.visual?.gate ?? "unknown"),
  );
  const byKind = stableObject(
    countBy(assets, (asset) => asset.visual?.kind ?? "unknown"),
  );

  requireTruth(
    ids.size === 130,
    `Expected 130 unique visual ids, found ${ids.size}.`,
  );
  requireTruth(
    clientIds.size === 130,
    `Expected 130 unique client ids, found ${clientIds.size}.`,
  );
  requireTruth(
    hashes.size === 130,
    `Expected 130 unique source hashes, found ${hashes.size}.`,
  );
  requireTruth(
    packet.summary?.assets === assets.length,
    `Packet asset summary differs: expected ${packet.summary?.assets}, observed ${assets.length}.`,
  );
  requireTruth(
    verifiedContentBytes === packet.summary?.totalBytes,
    `Packet total bytes differ: expected ${packet.summary?.totalBytes}, observed ${verifiedContentBytes}.`,
  );
  requireTruth(
    JSON.stringify(byWave) ===
      JSON.stringify(stableObject(packet.summary?.byWave ?? {})),
    "Packet wave summary differs from its records.",
  );
  requireTruth(
    JSON.stringify(byGate) ===
      JSON.stringify(stableObject(packet.summary?.byGate ?? {})),
    "Packet Gate summary differs from its records.",
  );
  requireTruth(
    JSON.stringify(byKind) ===
      JSON.stringify(stableObject(packet.summary?.byKind ?? {})),
    "Packet kind summary differs from its records.",
  );
  requireTruth(
    JSON.stringify(wave02MasterFiles.sort()) === JSON.stringify(masterFiles),
    "Wave-02 packet sources do not exactly cover the 100 master files.",
  );
  requireTruth(
    JSON.stringify(wave02DossierFiles.sort()) === JSON.stringify(dossierFiles),
    "Wave-02 packet dossiers do not exactly cover the 100 dossier files.",
  );
  requireTruth(
    JSON.stringify(atlasMasterFiles) === JSON.stringify(masterFiles),
    "The atlas does not reference the exact 100 Wave-02 master files.",
  );

  if (failures.length > 0) throw new Error(failures.join("\n"));

  const result = {
    schemaVersion: "arcanea.prior-visual-evidence-verification.v1",
    verdict:
      legacyDossierFallbacks === 0
        ? "verified"
        : "verified-with-packet-path-repair-required",
    evidenceRecord: evidencePath,
    verificationDepth: deep
      ? "full-source-sha256"
      : "structure-and-source-byte-size",
    collection: {
      wave02Masters: masterFiles.length,
      wave02Dossiers: dossierFiles.length,
      atlasImages: atlasImageCount,
      intakeAssets: assets.length,
      intakeBytes: verifiedContentBytes,
      byWave,
      byGate,
      byKind,
    },
    integrity: {
      uniqueVisualIds: ids.size,
      uniqueClientAssetIds: clientIds.size,
      uniqueSourceHashes: hashes.size,
      resolvedSourceFiles: resolvedSources.length,
      resolvedDossierFiles: resolvedDossiers.length,
      exactWave02PacketCoverage: true,
      exactAtlasMasterCoverage: true,
      legacyDossierFallbacks,
      packetSha256: createHash("sha256").update(packetBytes).digest("hex"),
      atlasSha256: createHash("sha256").update(atlasBytes).digest("hex"),
    },
    releaseBoundary: {
      publicationNotAuthorized: assets.filter(
        (asset) => asset.publicationGate?.publication === "not-authorized",
      ).length,
      rightsPendingHumanClearance: assets.filter(
        (asset) => asset.publicationGate?.rights === "pending-human-clearance",
      ).length,
      importsPerformed: 0,
    },
    warnings:
      legacyDossierFallbacks === 0
        ? []
        : [
            `${legacyDossierFallbacks} Wave-01 dossier references resolve only through the collection-root fallback; regenerate the intake packet before release.`,
          ],
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(
      `Prior visual evidence ${result.verdict}: ${masterFiles.length} Wave-02 masters, ${dossierFiles.length} dossiers, ${assets.length} intake records, ${atlasImageCount} atlas images.`,
    );
    console.log(
      `Verification depth: ${result.verificationDepth}; imports performed: 0; publication authorized: 0.`,
    );
    for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
