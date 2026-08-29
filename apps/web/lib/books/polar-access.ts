import 'server-only';

import { createClient } from '@/lib/supabase/server';
import {
  CINEMATIC_BOOK_ID,
  CINEMATIC_EDITION_ID,
} from '@/lib/books/cinematic-edition';

export type BookAccessState =
  | { status: 'granted'; userId: string }
  | { status: 'not-purchased'; userId: string }
  | { status: 'signed-out'; userId: null }
  | { status: 'not-configured'; userId: string }
  | { status: 'unavailable'; userId: string };

interface PolarOrder {
  paid?: boolean;
  product_id?: string;
  total_amount?: number;
  refunded_amount?: number;
  metadata?: Record<string, unknown>;
}

interface PolarOrderList {
  items?: PolarOrder[];
}

function polarApiBase(): string {
  return process.env.POLAR_MODE === 'sandbox'
    ? 'https://sandbox-api.polar.sh'
    : 'https://api.polar.sh';
}

export function isCinematicCheckoutConfigured(): boolean {
  return Boolean(
    process.env.CINEMATIC_BOOK_SALES_ENABLED === 'true'
    && process.env.POLAR_ACCESS_TOKEN?.trim()
    && process.env.POLAR_BOOK_PRODUCT_ID?.trim(),
  );
}

export async function getCinematicBookAccess(): Promise<BookAccessState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { status: 'signed-out', userId: null };

  const accessToken = process.env.POLAR_ACCESS_TOKEN?.trim();
  const productId = process.env.POLAR_BOOK_PRODUCT_ID?.trim();
  if (!accessToken || !productId) {
    return { status: 'not-configured', userId: user.id };
  }

  const query = new URLSearchParams({
    external_customer_id: user.id,
    product_id: productId,
    product_billing_type: 'one_time',
    limit: '100',
  });

  try {
    const response = await fetch(`${polarApiBase()}/v1/orders?${query.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!response.ok) return { status: 'unavailable', userId: user.id };

    const payload = await response.json() as PolarOrderList;
    const hasActiveOrder = (payload.items ?? []).some((order) => {
      const total = order.total_amount ?? 0;
      const refunded = order.refunded_amount ?? 0;
      const fullyRefunded = total > 0 && refunded >= total;
      const metadataMatches = !order.metadata?.book_id
        || order.metadata.book_id === CINEMATIC_BOOK_ID;
      const editionMatches = !order.metadata?.edition_id
        || order.metadata.edition_id === CINEMATIC_EDITION_ID;

      return order.paid === true
        && order.product_id === productId
        && !fullyRefunded
        && metadataMatches
        && editionMatches;
    });

    return hasActiveOrder
      ? { status: 'granted', userId: user.id }
      : { status: 'not-purchased', userId: user.id };
  } catch {
    return { status: 'unavailable', userId: user.id };
  }
}
