import type { VisualEncyclopediaEntry } from './schema';

export interface PublishedVisualReceipt {
  visualId: string;
  registryAssetId: string;
  renditionId: string;
  publicationReviewId: string;
  rightsRecordId: string;
  state: 'published';
  url: string;
  publicKey: string;
  sourceSha256: string;
  renditionSha256: string;
  publishedAt: string;
}

export interface PublicationReceipt {
  schemaVersion: 'starlight.media-publication-receipt.v1';
  brandSlug: 'arcanea';
  generatedAt: string;
  assets: PublishedVisualReceipt[];
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const PUBLIC_KEY_PATTERN = /^v1\/arcanea\/images\/([a-f0-9]{64})\.(avif|gif|jpg|png|webp)$/u;

export function applyPublicationReceipt(
  entries: VisualEncyclopediaEntry[],
  receipt: PublicationReceipt,
  publicOrigin: string,
): VisualEncyclopediaEntry[] {
  if (
    receipt.schemaVersion !== 'starlight.media-publication-receipt.v1' ||
    receipt.brandSlug !== 'arcanea' ||
    !Array.isArray(receipt.assets) ||
    !isIsoDate(receipt.generatedAt)
  ) {
    throw new Error('Publication receipt has an unsupported shape.');
  }

  const expectedOrigin = new URL(publicOrigin).origin;
  const entriesById = new Map(entries.map((entry) => [entry.id, entry] as const));
  const publishedByVisualId = new Map<string, PublishedVisualReceipt>();

  for (const asset of receipt.assets) {
    if (publishedByVisualId.has(asset.visualId)) {
      throw new Error(`Duplicate publication receipt entry: ${asset.visualId}.`);
    }

    const entry = entriesById.get(asset.visualId);
    if (!entry) throw new Error(`Unknown publication receipt entry: ${asset.visualId}.`);
    if (asset.state !== 'published') throw new Error(`${asset.visualId}: invalid publication state.`);
    for (const id of [
      asset.registryAssetId,
      asset.renditionId,
      asset.publicationReviewId,
      asset.rightsRecordId,
    ]) {
      if (!UUID_PATTERN.test(id)) throw new Error(`${asset.visualId}: invalid registry evidence ID.`);
    }
    if (!SHA256_PATTERN.test(asset.sourceSha256) || !SHA256_PATTERN.test(asset.renditionSha256)) {
      throw new Error(`${asset.visualId}: invalid publication checksum.`);
    }
    if (!entry.media.sha256 || entry.media.sha256 !== asset.sourceSha256) {
      throw new Error(`${asset.visualId}: source master checksum mismatch.`);
    }

    const keyMatch = asset.publicKey.match(PUBLIC_KEY_PATTERN);
    if (!keyMatch || keyMatch[1] !== asset.renditionSha256) {
      throw new Error(`${asset.visualId}: public key does not match the rendition checksum.`);
    }

    const url = new URL(asset.url);
    if (
      url.protocol !== 'https:' ||
      url.origin !== expectedOrigin ||
      url.pathname.replace(/^\//u, '') !== asset.publicKey ||
      url.search ||
      url.hash
    ) {
      throw new Error(`${asset.visualId}: public delivery URL violates the configured origin or key.`);
    }
    if (!isIsoDate(asset.publishedAt)) throw new Error(`${asset.visualId}: invalid publication date.`);

    publishedByVisualId.set(asset.visualId, asset);
  }

  return entries.map((entry) => {
    const published = publishedByVisualId.get(entry.id);
    if (!published) return entry;

    return {
      ...entry,
      review: { ...entry.review, state: 'published' },
      media: {
        ...entry.media,
        status: 'published',
        url: published.url,
        deliveryKey: published.publicKey,
        registryAssetId: published.registryAssetId,
        renditionId: published.renditionId,
        renditionSha256: published.renditionSha256,
        publicationReviewId: published.publicationReviewId,
        rightsRecordId: published.rightsRecordId,
        publishedAt: published.publishedAt,
      },
    };
  });
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 64 && !Number.isNaN(Date.parse(value));
}
