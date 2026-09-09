import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canReadCinematicChapter,
  cinematicAccessPreflight,
  cinematicDownloadHttpStatus,
  hasCinematicOrderAccess,
  isCinematicCheckoutReady,
  verifyCinematicOrderAccess,
  type CinematicOrder,
} from '../cinematic-access-contract';
import {
  cinematicAssetPath,
  isCinematicDownloadId,
} from '../cinematic-download-contract';

const identity = {
  productId: 'product-book-one',
  bookId: 'the-last-free-path',
  editionId: 'book-01-founding-cinematic',
};

function order(overrides: CinematicOrder = {}): CinematicOrder {
  return {
    paid: true,
    product_id: identity.productId,
    total_amount: 1700,
    refunded_amount: 0,
    metadata: {
      book_id: identity.bookId,
      edition_id: identity.editionId,
    },
    ...overrides,
  };
}

test('grants access only for the exact paid book edition', () => {
  assert.equal(hasCinematicOrderAccess([order()], identity), true);
  assert.equal(hasCinematicOrderAccess([order({ paid: false })], identity), false);
  assert.equal(hasCinematicOrderAccess([order({ product_id: 'another-product' })], identity), false);
  assert.equal(hasCinematicOrderAccess([order({ metadata: {} })], identity), false);
  assert.equal(hasCinematicOrderAccess([
    order({ metadata: { book_id: identity.bookId, edition_id: 'another-edition' } }),
  ], identity), false);
});

test('revokes fully refunded orders and preserves partially refunded orders', () => {
  assert.equal(hasCinematicOrderAccess([
    order({ refunded_amount: 1700 }),
  ], identity), false);
  assert.equal(hasCinematicOrderAccess([
    order({ refunded_amount: 2200 }),
  ], identity), false);
  assert.equal(hasCinematicOrderAccess([
    order({ refunded_amount: 500 }),
  ], identity), true);
});

test('accepts a paid zero-total order such as an approved full discount', () => {
  assert.equal(hasCinematicOrderAccess([
    order({ total_amount: 0, refunded_amount: 0 }),
  ], identity), true);
});

test('checkout opens only when every release requirement is ready', () => {
  const ready = {
    salesEnabled: true,
    editionReleased: true,
    downloadsEnabled: true,
    releaseManifestVerified: true,
    hasAccessToken: true,
    hasProductId: true,
  };
  assert.equal(isCinematicCheckoutReady(ready), true);

  for (const key of Object.keys(ready) as Array<keyof typeof ready>) {
    assert.equal(
      isCinematicCheckoutReady({ ...ready, [key]: false }),
      false,
      `${key} must fail closed`,
    );
  }
});

test('access preflight denies unreleased, signed-out, and unconfigured requests', () => {
  const ready = {
    editionReleased: true,
    userId: 'user-one',
    hasAccessToken: true,
    hasProductId: true,
  };
  assert.equal(cinematicAccessPreflight(ready), 'ready');
  assert.equal(cinematicAccessPreflight({ ...ready, editionReleased: false }), 'not-released');
  assert.equal(cinematicAccessPreflight({ ...ready, userId: null }), 'signed-out');
  assert.equal(cinematicAccessPreflight({ ...ready, hasAccessToken: false }), 'not-configured');
  assert.equal(cinematicAccessPreflight({ ...ready, hasProductId: false }), 'not-configured');
});

test('live reconciliation fails closed on network, HTTP, and payload errors', async () => {
  assert.equal(await verifyCinematicOrderAccess(
    async () => ({ ok: true, json: async () => ({ items: [order()] }) }),
    identity,
  ), 'granted');
  assert.equal(await verifyCinematicOrderAccess(
    async () => ({ ok: true, json: async () => ({ items: [] }) }),
    identity,
  ), 'not-purchased');
  assert.equal(await verifyCinematicOrderAccess(
    async () => ({ ok: false, json: async () => ({ items: [order()] }) }),
    identity,
  ), 'unavailable');
  assert.equal(await verifyCinematicOrderAccess(
    async () => ({ ok: true, json: async () => ({ unexpected: [] }) }),
    identity,
  ), 'unavailable');
  assert.equal(await verifyCinematicOrderAccess(
    async () => { throw new Error('network down'); },
    identity,
  ), 'unavailable');
  assert.equal(await verifyCinematicOrderAccess(
    async () => ({ ok: true, json: async () => { throw new Error('invalid json'); } }),
    identity,
  ), 'unavailable');
});

test('paid prose and private downloads obey the resolved access state', () => {
  assert.equal(canReadCinematicChapter('free', 'not-released'), true);
  assert.equal(canReadCinematicChapter('paid', 'granted'), true);
  for (const denied of ['not-released', 'signed-out', 'not-configured', 'not-purchased', 'unavailable'] as const) {
    assert.equal(canReadCinematicChapter('paid', denied), false);
  }

  assert.equal(cinematicDownloadHttpStatus('signed-out', true), 401);
  assert.equal(cinematicDownloadHttpStatus('unavailable', true), 503);
  assert.equal(cinematicDownloadHttpStatus('not-released', true), 403);
  assert.equal(cinematicDownloadHttpStatus('not-purchased', true), 403);
  assert.equal(cinematicDownloadHttpStatus('granted', false), 503);
  assert.equal(cinematicDownloadHttpStatus('granted', true), 200);
});

test('download IDs are an own-property allow-list with fixed edition paths', () => {
  assert.equal(isCinematicDownloadId('epub'), true);
  assert.equal(isCinematicDownloadId('screen-pdf'), true);
  assert.equal(isCinematicDownloadId('toString'), false);
  assert.equal(isCinematicDownloadId('__proto__'), false);
  assert.equal(isCinematicDownloadId('../manifest.json'), false);
  assert.equal(
    cinematicAssetPath(identity.bookId, identity.editionId, 'epub'),
    'editions/the-last-free-path/book-01-founding-cinematic/the-last-free-path.epub',
  );
});
