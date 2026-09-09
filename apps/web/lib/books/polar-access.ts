import 'server-only';

import { createClient } from '@/lib/supabase/server';
import {
  CINEMATIC_BOOK_ID,
  CINEMATIC_EDITION_ID,
  isCinematicEditionReleased,
} from '@/lib/books/cinematic-edition';
import { areCinematicDownloadsEnabled } from '@/lib/books/downloads';
import { loadCinematicReleaseFiles, verifyCinematicReleaseManifest } from '@/lib/books/release-manifest';
import type { CinematicReleaseFiles } from '@/lib/books/cinematic-release-manifest-contract';
import {
  cinematicAccessPreflight,
  isCinematicCheckoutReady,
  verifyCinematicOrderAccess,
} from '@/lib/books/cinematic-access-contract';

export type BookAccessState =
  | { status: 'granted'; userId: string; releaseFiles: CinematicReleaseFiles }
  | { status: 'not-purchased'; userId: string }
  | { status: 'signed-out'; userId: null }
  | { status: 'not-released'; userId: null }
  | { status: 'not-configured'; userId: string }
  | { status: 'unavailable'; userId: string };

function polarApiBase(): string {
  return process.env.POLAR_MODE === 'sandbox'
    ? 'https://sandbox-api.polar.sh'
    : 'https://api.polar.sh';
}

export async function isCinematicCheckoutConfigured(): Promise<boolean> {
  const salesEnabled = process.env.CINEMATIC_BOOK_SALES_ENABLED === 'true';
  const editionReleased = isCinematicEditionReleased();
  const downloadsEnabled = areCinematicDownloadsEnabled();
  const hasAccessToken = Boolean(process.env.POLAR_ACCESS_TOKEN?.trim());
  const hasProductId = Boolean(process.env.POLAR_BOOK_PRODUCT_ID?.trim());
  if (!salesEnabled || !editionReleased || !downloadsEnabled || !hasAccessToken || !hasProductId) {
    return false;
  }

  return isCinematicCheckoutReady({
    salesEnabled,
    editionReleased,
    downloadsEnabled,
    releaseManifestVerified: await verifyCinematicReleaseManifest(),
    hasAccessToken,
    hasProductId,
  });
}

export async function getCinematicBookAccess(): Promise<BookAccessState> {
  const editionReleased = isCinematicEditionReleased();
  if (!editionReleased) {
    return { status: 'not-released', userId: null };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const accessToken = process.env.POLAR_ACCESS_TOKEN?.trim();
  const productId = process.env.POLAR_BOOK_PRODUCT_ID?.trim();

  const preflight = cinematicAccessPreflight({
    editionReleased,
    userId: user?.id ?? null,
    hasAccessToken: Boolean(accessToken),
    hasProductId: Boolean(productId),
  });
  if (preflight === 'signed-out' || !user) return { status: 'signed-out', userId: null };
  if (preflight === 'not-released') return { status: 'not-released', userId: null };
  if (preflight === 'not-configured' || !accessToken || !productId) {
    return { status: 'not-configured', userId: user.id };
  }
  const releaseFiles = await loadCinematicReleaseFiles();
  if (!releaseFiles) {
    return { status: 'unavailable', userId: user.id };
  }

  const query = new URLSearchParams({
    external_customer_id: user.id,
    product_id: productId,
    product_billing_type: 'one_time',
    limit: '100',
  });

  const verification = await verifyCinematicOrderAccess(
    () => fetch(`${polarApiBase()}/v1/orders?${query.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    }),
    {
      productId,
      bookId: CINEMATIC_BOOK_ID,
      editionId: CINEMATIC_EDITION_ID,
    },
  );

  return verification === 'granted'
    ? { status: verification, userId: user.id, releaseFiles }
    : { status: verification, userId: user.id };
}
