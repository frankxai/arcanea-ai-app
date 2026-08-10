import { describe, expect, it } from 'vitest';

import { VISUAL_ENCYCLOPEDIA_ENTRIES } from './catalog';
import { applyPublicationReceipt, type PublicationReceipt } from './publication-contract';

const publicOrigin = 'https://media.starlightintelligence.org';
const source = VISUAL_ENCYCLOPEDIA_ENTRIES.find((entry) => entry.id === 'K01');
if (!source?.media.sha256) throw new Error('K01 source receipt is required for this test.');

const renditionSha256 = 'a'.repeat(64);
const publishedAsset = {
  visualId: 'K01',
  registryAssetId: '11111111-1111-4111-8111-111111111111',
  renditionId: '22222222-2222-4222-8222-222222222222',
  publicationReviewId: '33333333-3333-4333-8333-333333333333',
  rightsRecordId: '44444444-4444-4444-8444-444444444444',
  state: 'published' as const,
  url: `${publicOrigin}/v1/arcanea/images/${renditionSha256}.webp`,
  publicKey: `v1/arcanea/images/${renditionSha256}.webp`,
  sourceSha256: source.media.sha256,
  renditionSha256,
  publishedAt: '2026-08-10T06:00:00.000Z',
};

function receipt(overrides: Partial<PublicationReceipt> = {}): PublicationReceipt {
  return {
    schemaVersion: 'starlight.media-publication-receipt.v1',
    brandSlug: 'arcanea',
    generatedAt: '2026-08-10T06:01:00.000Z',
    assets: [publishedAsset],
    ...overrides,
  };
}

describe('visual encyclopedia publication receipt', () => {
  it('hydrates a registry-published rendition with release evidence', () => {
    const entries = applyPublicationReceipt(VISUAL_ENCYCLOPEDIA_ENTRIES, receipt(), publicOrigin);
    const published = entries.find((entry) => entry.id === 'K01');

    expect(published?.review.state).toBe('published');
    expect(published?.media).toMatchObject({
      status: 'published',
      registryAssetId: publishedAsset.registryAssetId,
      renditionId: publishedAsset.renditionId,
      publicationReviewId: publishedAsset.publicationReviewId,
      rightsRecordId: publishedAsset.rightsRecordId,
      renditionSha256,
    });
  });

  it('rejects duplicate visual IDs', () => {
    expect(() =>
      applyPublicationReceipt(
        VISUAL_ENCYCLOPEDIA_ENTRIES,
        receipt({ assets: [publishedAsset, publishedAsset] }),
        publicOrigin,
      ),
    ).toThrow(/Duplicate publication receipt/u);
  });

  it('rejects source checksum and public-key drift', () => {
    expect(() =>
      applyPublicationReceipt(
        VISUAL_ENCYCLOPEDIA_ENTRIES,
        receipt({ assets: [{ ...publishedAsset, sourceSha256: 'b'.repeat(64) }] }),
        publicOrigin,
      ),
    ).toThrow(/source master checksum mismatch/u);

    expect(() =>
      applyPublicationReceipt(
        VISUAL_ENCYCLOPEDIA_ENTRIES,
        receipt({ assets: [{ ...publishedAsset, publicKey: `v1/arcanea/images/${'b'.repeat(64)}.webp` }] }),
        publicOrigin,
      ),
    ).toThrow(/public key does not match/u);
  });

  it('rejects an untrusted delivery origin or missing evidence ID', () => {
    expect(() =>
      applyPublicationReceipt(
        VISUAL_ENCYCLOPEDIA_ENTRIES,
        receipt({ assets: [{ ...publishedAsset, url: publishedAsset.url.replace(publicOrigin, 'https://example.com') }] }),
        publicOrigin,
      ),
    ).toThrow(/configured origin/u);

    expect(() =>
      applyPublicationReceipt(
        VISUAL_ENCYCLOPEDIA_ENTRIES,
        receipt({ assets: [{ ...publishedAsset, rightsRecordId: '' }] }),
        publicOrigin,
      ),
    ).toThrow(/registry evidence ID/u);
  });
});
