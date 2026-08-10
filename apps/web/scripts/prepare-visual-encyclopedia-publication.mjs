import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, relative, resolve } from 'node:path';

const args = parseArgs(process.argv.slice(2));
for (const key of ['foundationManifest', 'waveManifest', 'waveLedger', 'out']) {
  if (!args[key]) fail(`Missing --${toKebabCase(key)}.`);
}

const outputPath = resolve(args.out);
const receiptTemplatePath = resolve(
  args.receiptTemplate ?? dirname(outputPath),
  args.receiptTemplate ? '' : 'visual-encyclopedia-publication-receipt.template.json',
);
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
const seenRegistryIds = new Set();
const seenHashes = new Map();

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

  const registryAssetId = uuidFromSeed(`arcanea:visual-encyclopedia:${candidate.visualId}`);
  if (seenRegistryIds.has(registryAssetId)) fail(`Registry UUID collision: ${registryAssetId}.`);
  seenRegistryIds.add(registryAssetId);

  const publicKey = `arcanea/visual-encyclopedia/${candidate.wave}/${basename(candidate.sourcePath)}`;
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
    registryInput: {
      id: registryAssetId,
      brandSlug: 'arcanea',
      ownerSubject: 'service:arcanea-studio',
      assetType: 'image',
      category: `visual-encyclopedia.${candidate.kind}`,
      title: candidate.name,
      actorSubject: 'service:arcanea-studio',
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
    proposedDelivery: {
      provider: 'cloudflare-r2',
      publicKey,
      publicOrigin: 'https://media.starlightintelligence.org',
    },
    publicationGate: {
      sourceIngest: 'prepared-not-executed',
      preparedRendition: 'required',
      rights: 'pending-human-clearance',
      publicationReview: 'pending-independent-human-review',
      publication: 'not-authorized',
    },
    usageLink: {
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
  note: 'Populate only from registry-confirmed published renditions. The gallery rejects unlisted assets.',
  assets: [],
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
