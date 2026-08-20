import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const args = parseArgs(process.argv.slice(2));
for (const key of ['foundationManifest', 'waveManifest', 'waveLedger', 'out']) {
  if (!args[key]) fail(`Missing --${toKebabCase(key)}.`);
}

const outputPath = resolve(args.out);
const receiptTemplatePath = args.receiptTemplate
  ? resolve(args.receiptTemplate)
  : resolve(dirname(outputPath), 'visual-encyclopedia-publication-receipt.template.json');
const foundationPath = resolve(args.foundationManifest);
const wavePath = resolve(args.waveManifest);
const ledgerPath = resolve(args.waveLedger);
const [foundation, wave, ledger] = await Promise.all([
  readJson(foundationPath),
  readJson(wavePath),
  readJson(ledgerPath),
]);

const candidates = [
  ...foundation.entries
    .filter((entry) => String(entry.status).startsWith('approved') && entry.master)
    .map((entry) => ({
      visualId: entry.id,
      slug: entry.slug,
      name: entry.name,
      kind: entry.category,
      gate: inferFoundationGate(entry),
      batch: 0,
      role: entry.role,
      canonState: foundation.canon_state ?? 'proposal',
      sourcePath: resolve(dirname(foundationPath), entry.master),
      sourceManifest: relative(dirname(outputPath), foundationPath),
      dossierPath: entry.dossier,
      score: null,
      generatedAt: '2026-08-09',
      wave: 'wave-01',
      expectedSha256: null,
      expectedWidth: null,
      expectedHeight: null,
    })),
  ...wave.entries.map((entry) => {
    const ledgerAsset = ledger.assets?.[entry.id];
    if (!ledgerAsset || ledgerAsset.state !== 'approved') {
      fail(`${entry.id}: missing approved production-ledger record.`);
    }
    return {
      visualId: entry.id,
      slug: entry.slug,
      name: entry.name,
      kind: entry.kind,
      gate: entry.gate,
      batch: entry.batch,
      role: entry.role,
      canonState: entry.canonState,
      sourcePath: resolve(dirname(wavePath), entry.master),
      sourceManifest: relative(dirname(outputPath), wavePath),
      dossierPath: entry.dossier,
      score: entry.score,
      generatedAt: wave.generatedAt,
      wave: 'wave-02',
      expectedSha256: ledgerAsset.sha256,
      expectedWidth: ledgerAsset.width,
      expectedHeight: ledgerAsset.height,
    };
  }),
];

if (candidates.length !== 130) fail(`Expected 130 approved masters, found ${candidates.length}.`);

const assets = [];
const seenVisualIds = new Set();
const seenClientAssetIds = new Set();
const seenHashes = new Map();
const MAX_INGEST_BYTES = 25 * 1024 * 1024;

for (const candidate of candidates) {
  if (seenVisualIds.has(candidate.visualId)) fail(`Duplicate visual ID: ${candidate.visualId}.`);
  seenVisualIds.add(candidate.visualId);

  const body = await readFile(candidate.sourcePath);
  const sha256 = createHash('sha256').update(body).digest('hex');
  if (candidate.expectedSha256 && candidate.expectedSha256 !== sha256) {
    fail(`${candidate.visualId}: SHA-256 mismatch.`);
  }

  const duplicateVisualId = seenHashes.get(sha256);
  if (duplicateVisualId) {
    fail(`${candidate.visualId}: duplicates ${duplicateVisualId} at the byte level.`);
  }
  seenHashes.set(sha256, candidate.visualId);

  const { width, height } = readPngDimensions(body, candidate.visualId);
  if (candidate.expectedWidth && candidate.expectedWidth !== width) {
    fail(`${candidate.visualId}: width mismatch.`);
  }
  if (candidate.expectedHeight && candidate.expectedHeight !== height) {
    fail(`${candidate.visualId}: height mismatch.`);
  }

  if (body.byteLength > MAX_INGEST_BYTES) {
    fail(`${candidate.visualId}: exceeds the Media Control Worker 25 MiB ingest limit.`);
  }

  const clientAssetId = uuidFromSeed(`arcanea:visual-encyclopedia:${candidate.visualId}`);
  if (seenClientAssetIds.has(clientAssetId)) fail(`Client asset UUID collision: ${clientAssetId}.`);
  seenClientAssetIds.add(clientAssetId);

  const assetType = `visual-encyclopedia-${candidate.kind}`;
  const provenanceHeader = JSON.stringify({
    client_asset_id: clientAssetId,
    visual_id: candidate.visualId,
    slug: candidate.slug,
    gate: candidate.gate,
    batch: candidate.batch,
    canon_state: candidate.canonState,
    collection_wave: candidate.wave,
    source_manifest: toPosix(candidate.sourceManifest),
    quality_score: candidate.score,
    quality_maximum: candidate.score === null ? null : 30,
    generator: 'openai-codex-imagegen',
    generated_at: candidate.generatedAt,
  });
  if (provenanceHeader.length > 4_096) {
    fail(`${candidate.visualId}: x-media-provenance exceeds the 4,096 character contract.`);
  }

  const expectedSourceKey = `v1/arcanea/images/${sha256}.png`;
  assets.push({
    visual: {
      id: candidate.visualId,
      slug: candidate.slug,
      name: candidate.name,
      kind: candidate.kind,
      gate: candidate.gate,
      batch: candidate.batch,
      role: candidate.role,
      canonState: candidate.canonState,
    },
    clientAssetId,
    ingestRequest: {
      method: 'POST',
      path: '/v1/ingest',
      authorizationCapability: 'MEDIA_INGEST_TOKEN',
      headers: {
        'content-length': String(body.byteLength),
        'content-type': 'image/png',
        'x-media-brand': 'arcanea',
        'x-media-asset-type': assetType,
        'x-media-owner-subject': 'service:arcanea-studio',
        'x-media-actor-subject': 'service:arcanea-studio',
        'x-media-title': candidate.name,
        'x-media-provenance': provenanceHeader,
      },
      bodyFile: toPosix(relative(dirname(outputPath), candidate.sourcePath)),
    },
    source: {
      localPath: toPosix(relative(dirname(outputPath), candidate.sourcePath)),
      contentType: 'image/png',
      byteSize: body.byteLength,
      sha256,
      width,
      height,
    },
    provenance: {
      sourceManifest: toPosix(candidate.sourceManifest),
      dossierPath: candidate.dossierPath,
      generatedBy: 'OpenAI image generation via Codex imagegen',
      generatedAt: candidate.generatedAt,
      canonState: candidate.canonState,
      collectionWave: candidate.wave,
      qualityReview: {
        status: 'agent-approved-proposal-master',
        score: candidate.score,
        maximum: candidate.score === null ? null : 30,
      },
    },
    expectedIngestResult: {
      registryAssetId: 'assigned-by-media-control-worker',
      category: 'images',
      sourceKey: expectedSourceKey,
      sha256,
      reconciliationKey: `arcanea:${sha256}`,
    },
    deliveryPolicy: {
      provider: 'cloudflare-r2',
      publicOrigin: 'https://media.starlightintelligence.org',
      publicKeyTemplate: 'v1/arcanea/images/{prepared-rendition-sha256}.{extension}',
      note: 'The Control Worker derives the final immutable key from the prepared rendition; the source filename never becomes the canonical public key.',
    },
    publicationGate: {
      sourceIngest: 'prepared-not-executed',
      preparedRendition: 'required',
      rights: 'pending-human-clearance',
      publicationReview: 'pending-independent-human-review',
      publication: 'not-authorized',
    },
    usageLink: {
      registryAssetId: 'from-ingest-response',
      targetType: 'arcanea.visual-encyclopedia',
      targetId: candidate.visualId,
      placement: 'gallery',
    },
  });
}

const summary = assets.reduce(
  (value, asset) => {
    value.totalBytes += asset.source.byteSize;
    value.byKind[asset.visual.kind] = (value.byKind[asset.visual.kind] ?? 0) + 1;
    value.byGate[asset.visual.gate] = (value.byGate[asset.visual.gate] ?? 0) + 1;
    value.byWave[asset.provenance.collectionWave] =
      (value.byWave[asset.provenance.collectionWave] ?? 0) + 1;
    return value;
  },
  { assets: assets.length, totalBytes: 0, byKind: {}, byGate: {}, byWave: {} },
);

const packet = {
  schemaVersion: 'starlight.media-intake-packet.v1',
  generatedAt: new Date().toISOString(),
  brandSlug: 'arcanea',
  collection: 'Arcanea Visual Encyclopedia — Resonant Kinforms + Hundredfold Wave',
  state: 'prepared-for-private-ingest',
  authority: {
    canonicalMediaPlatform: 'frankxai/agentic-ops/media-platform',
    controlPlanePr: 'https://github.com/frankxai/agentic-ops/pull/14',
    arcaneaBoundaryPr: 'https://github.com/frankxai/arcanea-ai-app/pull/241',
    canonicalBytes: 'Cloudflare R2',
    canonicalMetadata: 'Dedicated shared Starlight Supabase registry',
    controlWorkerContract: 'media-platform/src/control.ts@agent/codex/media-control-plane',
  },
  safety: {
    cloudResourcesMutated: false,
    rawAiOutputPublic: false,
    rightsGrantedByThisPacket: false,
    publicationApprovedByThisPacket: false,
  },
  requiredReleaseSequence: [
    'private source ingest',
    'prepared rendition creation',
    'agent publication proposal',
    'independent human publication review',
    'human rights clearance',
    'registry publication authorization',
    'public R2 copy',
    'publication receipt export',
  ],
  summary,
  assets,
};

const receiptTemplate = {
  schemaVersion: 'starlight.media-publication-receipt.v1',
  brandSlug: 'arcanea',
  generatedAt: null,
  note: 'Populate only from registry-confirmed published renditions. sourceSha256 identifies the approved master; renditionSha256 identifies the delivered bytes.',
  assets: [],
  withdrawals: [],
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(packet, null, 2)}\n`, 'utf8');
await writeFile(receiptTemplatePath, `${JSON.stringify(receiptTemplate, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputPath, receiptTemplatePath, summary }));

function readPngDimensions(body, visualId) {
  const signature = body.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a' || body.subarray(12, 16).toString('ascii') !== 'IHDR') {
    fail(`${visualId}: expected a PNG master.`);
  }
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) };
}

function uuidFromSeed(seed) {
  const bytes = createHash('sha256').update(seed).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function inferFoundationGate(entry) {
  const gatesById = {
    K01: 'Foundation', K02: 'Flow', K03: 'Fire', K04: 'Heart', K05: 'Voice',
    K06: 'Sight', K07: 'Crown', K08: 'Starweave', K09: 'Unity', K10: 'Source',
    K11: 'Source', K12: 'Source', C13: 'Foundation', C14: 'Flow', C15: 'Fire',
    C16: 'Starweave', C17: 'Voice', C18: 'Voice', C19: 'Sight', C20: 'Source',
    B21: 'Flow', B22: 'Foundation', B23: 'Fire', B24: 'Source', B25: 'Starweave',
    S26: 'Source', S27: 'Flow', S28: 'Fire', S29: 'Source', S30: 'Unity',
  };
  const gate = gatesById[entry.id];
  if (gate) return gate;
  fail(`${entry.id}: missing explicit foundation Gate mapping.`);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function toPosix(path) {
  return path.replaceAll('\\', '/');
}

function parseArgs(values) {
  const parsed = {};
  const keys = {
    '--foundation-manifest': 'foundationManifest',
    '--wave-manifest': 'waveManifest',
    '--wave-ledger': 'waveLedger',
    '--out': 'out',
    '--receipt-template': 'receiptTemplate',
  };
  for (let index = 0; index < values.length; index += 1) {
    const key = keys[values[index]];
    if (key) parsed[key] = values[index + 1];
  }
  return parsed;
}

function toKebabCase(value) {
  return value.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
