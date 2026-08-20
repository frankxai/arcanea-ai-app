import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

const args = parseArgs(process.argv.slice(2));
if (!args.packet) fail('Usage: node scripts/validate-visual-encyclopedia-publication.mjs --packet <packet.json> [--receipt-template <template.json>] [--export-request <request.json>]');

const packetPath = resolve(args.packet);
const packetRoot = dirname(packetPath);
const collectionRoot = resolve(packetRoot, '..');
const packet = JSON.parse(await readFile(packetPath, 'utf8'));
const errors = [];
const seenVisualIds = new Set();
const seenClientIds = new Set();
const seenHashes = new Set();
const actualByKind = {};
const actualByWave = {};
let totalBytes = 0;

check(packet.schemaVersion === 'starlight.media-intake-packet.v1', 'Unsupported packet schema.');
check(packet.state === 'prepared-for-private-ingest', 'Packet is not held at private ingest.');
check(packet.safety?.cloudResourcesMutated === false, 'Packet claims a cloud mutation.');
check(packet.safety?.rightsGrantedByThisPacket === false, 'Packet claims rights clearance.');
check(packet.safety?.publicationApprovedByThisPacket === false, 'Packet claims publication approval.');
check(Array.isArray(packet.assets) && packet.assets.length === 130, 'Expected 130 packet assets.');

for (const asset of packet.assets ?? []) {
  const id = asset.visual?.id;
  check(typeof id === 'string' && id.length > 0, 'Asset is missing a visual ID.');
  check(!seenVisualIds.has(id), `${id}: duplicate visual ID.`);
  seenVisualIds.add(id);
  check(UUID_PATTERN.test(asset.clientAssetId), `${id}: invalid deterministic client asset ID.`);
  check(!seenClientIds.has(asset.clientAssetId), `${id}: duplicate client asset ID.`);
  seenClientIds.add(asset.clientAssetId);

  const sourcePath = resolve(packetRoot, asset.source?.localPath ?? '');
  const collectionRelative = relative(collectionRoot, sourcePath);
  check(
    collectionRelative && !collectionRelative.startsWith('..') && !isAbsolute(collectionRelative),
    `${id}: source path escapes the collection root.`,
  );
  let body;
  try {
    body = await readFile(sourcePath);
  } catch {
    error(`${id}: source file is unavailable.`);
    continue;
  }
  const sha256 = createHash('sha256').update(body).digest('hex');
  check(sha256 === asset.source.sha256, `${id}: source checksum mismatch.`);
  check(!seenHashes.has(sha256), `${id}: duplicate master bytes.`);
  seenHashes.add(sha256);
  check(body.byteLength === asset.source.byteSize, `${id}: source byte-size mismatch.`);
  check(body.byteLength <= 25 * 1024 * 1024, `${id}: exceeds the Control Worker ingest limit.`);

  const request = asset.ingestRequest;
  const headers = request?.headers ?? {};
  check(request?.method === 'POST' && request?.path === '/v1/ingest', `${id}: invalid ingest route.`);
  check(request?.authorizationCapability === 'MEDIA_INGEST_TOKEN', `${id}: invalid ingest capability.`);
  check(resolve(packetRoot, request?.bodyFile ?? '') === sourcePath, `${id}: request body path drift.`);
  check(headers['content-length'] === String(body.byteLength), `${id}: Content-Length drift.`);
  check(headers['content-type'] === 'image/png', `${id}: invalid content type.`);
  check(headers['x-media-brand'] === 'arcanea', `${id}: invalid media brand.`);
  check(
    headers['x-media-asset-type'] === `visual-encyclopedia-${asset.visual.kind}`,
    `${id}: invalid asset-type header.`,
  );
  check(headers['x-media-owner-subject'] === 'service:arcanea-studio', `${id}: invalid owner subject.`);
  check(headers['x-media-actor-subject'] === 'service:arcanea-studio', `${id}: invalid actor subject.`);
  check(headers['x-media-title'] === asset.visual.name, `${id}: title header drift.`);

  try {
    const provenance = JSON.parse(headers['x-media-provenance']);
    check(headers['x-media-provenance'].length <= 4_096, `${id}: provenance header is too large.`);
    check(provenance.client_asset_id === asset.clientAssetId, `${id}: provenance client ID drift.`);
    check(provenance.visual_id === id, `${id}: provenance visual ID drift.`);
    check(provenance.canon_state === 'proposal', `${id}: provenance canon state drift.`);
  } catch {
    error(`${id}: invalid provenance header.`);
  }

  check(asset.expectedIngestResult?.category === 'images', `${id}: invalid expected registry category.`);
  check(
    asset.expectedIngestResult?.sourceKey === `v1/arcanea/images/${sha256}.png`,
    `${id}: content-addressed source key drift.`,
  );
  check(
    asset.deliveryPolicy?.publicKeyTemplate === 'v1/arcanea/images/{prepared-rendition-sha256}.{extension}',
    `${id}: public-key policy drift.`,
  );
  check(asset.publicationGate?.preparedRendition === 'required', `${id}: prepared rendition gate missing.`);
  check(asset.publicationGate?.rights === 'pending-human-clearance', `${id}: rights gate drift.`);
  check(asset.publicationGate?.publicationReview === 'pending-independent-human-review', `${id}: review gate drift.`);
  check(asset.publicationGate?.publication === 'not-authorized', `${id}: publication gate drift.`);

  totalBytes += body.byteLength;
  actualByKind[asset.visual.kind] = (actualByKind[asset.visual.kind] ?? 0) + 1;
  actualByWave[asset.provenance.collectionWave] = (actualByWave[asset.provenance.collectionWave] ?? 0) + 1;
}

check(totalBytes === packet.summary?.totalBytes, 'Packet total-byte summary drift.');
check(JSON.stringify(actualByKind) === JSON.stringify(packet.summary?.byKind), 'Packet kind summary drift.');
check(JSON.stringify(actualByWave) === JSON.stringify(packet.summary?.byWave), 'Packet wave summary drift.');

if (args.receiptTemplate) {
  const template = JSON.parse(await readFile(resolve(args.receiptTemplate), 'utf8'));
  check(template.schemaVersion === 'starlight.media-publication-receipt.v1', 'Invalid receipt template schema.');
  check(template.brandSlug === 'arcanea', 'Invalid receipt template brand.');
  check(template.generatedAt === null, 'Unpublished receipt template must not claim a generation date.');
  check(Array.isArray(template.assets) && template.assets.length === 0, 'Receipt template must be empty before registry publication.');
  check(
    Array.isArray(template.withdrawals) && template.withdrawals.length === 0,
    'Receipt template withdrawals must be empty before registry publication.',
  );
}

if (args.exportRequest) {
  const request = JSON.parse(await readFile(resolve(args.exportRequest), 'utf8'));
  const expectedVisualIds = [...seenVisualIds];
  const withdrawnVisualIds = Array.isArray(request.withdrawnVisualIds) ? request.withdrawnVisualIds : [];
  check(request.brandSlug === 'arcanea', 'Invalid export-request brand.');
  check(request.collectionSlug === 'visual-encyclopedia', 'Invalid export-request collection.');
  check(request.assetTypePrefix === 'visual-encyclopedia', 'Invalid export-request asset prefix.');
  check(request.renditionKind === 'gallery', 'Invalid export-request rendition kind.');
  check(
    JSON.stringify(request.expectedVisualIds) === JSON.stringify(expectedVisualIds),
    'Export-request visual IDs do not exactly match packet order.',
  );
  check(Array.isArray(request.withdrawnVisualIds), 'Export request must declare withdrawnVisualIds.');
  check(
    new Set(withdrawnVisualIds).size === withdrawnVisualIds.length,
    'Export-request withdrawals contain duplicates.',
  );
  check(
    withdrawnVisualIds.every((visualId) => seenVisualIds.has(visualId)),
    'Export-request withdrawals must be a subset of packet IDs.',
  );
  check(
    request.publicOrigin === 'https://media.starlightintelligence.org',
    'Invalid export-request public origin.',
  );
}

const report = {
  valid: errors.length === 0,
  assets: seenVisualIds.size,
  uniqueClientAssetIds: seenClientIds.size,
  uniqueSourceHashes: seenHashes.size,
  totalBytes,
  byKind: actualByKind,
  byWave: actualByWave,
  errors,
};
console.log(JSON.stringify(report));
if (errors.length) process.exitCode = 1;

function check(condition, message) {
  if (!condition) error(message);
}

function error(message) {
  errors.push(message);
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] === '--packet') parsed.packet = values[index + 1];
    if (values[index] === '--receipt-template') parsed.receiptTemplate = values[index + 1];
    if (values[index] === '--export-request') parsed.exportRequest = values[index + 1];
  }
  return parsed;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
