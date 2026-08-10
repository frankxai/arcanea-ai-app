import 'server-only';

import { VISUAL_ENCYCLOPEDIA_ENTRIES } from './catalog';
import { applyPublicationReceipt, type PublicationReceipt } from './publication-contract';
import type { VisualEncyclopediaEntry } from './schema';

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
    return applyPublicationReceipt(VISUAL_ENCYCLOPEDIA_ENTRIES, receipt, expectedPublicOrigin);
  } catch (error) {
    console.error('Unable to hydrate the visual encyclopedia from its publication receipt.', {
      type: error instanceof Error ? error.name : 'unknown',
    });
    return VISUAL_ENCYCLOPEDIA_ENTRIES;
  }
}
