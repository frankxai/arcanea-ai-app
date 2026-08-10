import 'server-only';

import { VISUAL_ENCYCLOPEDIA_ENTRIES } from './catalog';
import type { VisualEncyclopediaEntry } from './schema';

interface PublishedVisualReceipt {
  visualId: string;
  registryAssetId: string;
  state: 'published';
  url: string;
  publicKey: string;
  sha256: string;
  publishedAt: string;
}

interface PublicationReceipt {
  schemaVersion: 'starlight.media-publication-receipt.v1';
  brandSlug: 'arcanea';
  assets: PublishedVisualReceipt[];
}

export async function getVisualEncyclopediaEntries(): Promise<VisualEncyclopediaEntry[]> {
  const receiptUrl = process.env.ARCANEA_MEDIA_PUBLICATION_MANIFEST_URL;
  const publicOrigin = process.env.ARCANEA_MEDIA_PUBLIC_ORIGIN;
  if (!receiptUrl || !publicOrigin) return VISUAL_ENCYCLOPEDIA_ENTRIES;

  try {
    const receiptOrigin = new URL(receiptUrl).origin;
    const expectedPublicOrigin = new URL(publicOrigin).origin;
    if (receiptOrigin !== expectedPublicOrigin) {
      throw new Error('Publication receipt must be served from the configured media origin.');
    }

    const response = await fetch(receiptUrl, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`Publication receipt returned ${response.status}.`);

    const receipt = (await response.json()) as PublicationReceipt;
    if (
      receipt.schemaVersion !== 'starlight.media-publication-receipt.v1' ||
      receipt.brandSlug !== 'arcanea' ||
      !Array.isArray(receipt.assets)
    ) {
      throw new Error('Publication receipt has an unsupported shape.');
    }

    const publishedByVisualId = new Map(
      receipt.assets.flatMap((asset) => {
        if (asset.state !== 'published') return [];
        if (new URL(asset.url).origin !== expectedPublicOrigin) return [];
        return [[asset.visualId, asset] as const];
      }),
    );

    return VISUAL_ENCYCLOPEDIA_ENTRIES.map((entry) => {
      const published = publishedByVisualId.get(entry.id);
      if (!published || (entry.media.sha256 && entry.media.sha256 !== published.sha256)) return entry;

      return {
        ...entry,
        review: { ...entry.review, state: 'published' },
        media: {
          ...entry.media,
          status: 'published',
          url: published.url,
          deliveryKey: published.publicKey,
          registryAssetId: published.registryAssetId,
          publishedAt: published.publishedAt,
        },
      };
    });
  } catch (error) {
    console.error('Unable to hydrate the visual encyclopedia from its publication receipt.', {
      type: error instanceof Error ? error.name : 'unknown',
    });
    return VISUAL_ENCYCLOPEDIA_ENTRIES;
  }
}
