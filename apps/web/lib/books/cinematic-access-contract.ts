export interface CinematicOrder {
  paid?: boolean;
  product_id?: string;
  total_amount?: number;
  refunded_amount?: number;
  metadata?: Record<string, unknown>;
}

export interface CinematicOrderIdentity {
  productId: string;
  bookId: string;
  editionId: string;
}

interface CinematicCheckoutRequirements {
  salesEnabled: boolean;
  editionReleased: boolean;
  downloadsEnabled: boolean;
  hasAccessToken: boolean;
  hasProductId: boolean;
}

export type CinematicAccessStatus =
  | 'granted'
  | 'not-purchased'
  | 'signed-out'
  | 'not-released'
  | 'not-configured'
  | 'unavailable';

interface CinematicAccessPreflightInput {
  editionReleased: boolean;
  userId: string | null;
  hasAccessToken: boolean;
  hasProductId: boolean;
}

interface CinematicOrderResponse {
  ok: boolean;
  json(): Promise<unknown>;
}

export function hasCinematicOrderAccess(
  orders: readonly CinematicOrder[],
  identity: CinematicOrderIdentity,
): boolean {
  return orders.some((order) => {
    const total = order.total_amount ?? 0;
    const refunded = order.refunded_amount ?? 0;
    const fullyRefunded = total > 0 && refunded >= total;

    return order.paid === true
      && order.product_id === identity.productId
      && !fullyRefunded
      && order.metadata?.book_id === identity.bookId
      && order.metadata?.edition_id === identity.editionId;
  });
}

export function isCinematicCheckoutReady(
  requirements: CinematicCheckoutRequirements,
): boolean {
  return requirements.salesEnabled
    && requirements.editionReleased
    && requirements.downloadsEnabled
    && requirements.hasAccessToken
    && requirements.hasProductId;
}

export function cinematicAccessPreflight(
  input: CinematicAccessPreflightInput,
): 'ready' | Exclude<CinematicAccessStatus, 'granted' | 'not-purchased' | 'unavailable'> {
  if (!input.editionReleased) return 'not-released';
  if (!input.userId) return 'signed-out';
  if (!input.hasAccessToken || !input.hasProductId) return 'not-configured';
  return 'ready';
}

export async function verifyCinematicOrderAccess(
  loadOrders: () => Promise<CinematicOrderResponse>,
  identity: CinematicOrderIdentity,
): Promise<'granted' | 'not-purchased' | 'unavailable'> {
  try {
    const response = await loadOrders();
    if (!response.ok) return 'unavailable';

    const payload = await response.json();
    if (
      !payload
      || typeof payload !== 'object'
      || !Array.isArray((payload as { items?: unknown }).items)
    ) {
      return 'unavailable';
    }

    return hasCinematicOrderAccess(
      (payload as { items: CinematicOrder[] }).items,
      identity,
    )
      ? 'granted'
      : 'not-purchased';
  } catch {
    return 'unavailable';
  }
}

export function canReadCinematicChapter(
  chapterAccess: 'free' | 'paid',
  accessStatus: CinematicAccessStatus,
): boolean {
  return chapterAccess === 'free' || accessStatus === 'granted';
}

export function cinematicDownloadHttpStatus(
  accessStatus: CinematicAccessStatus,
  downloadsEnabled: boolean,
): 200 | 401 | 403 | 503 {
  if (accessStatus === 'signed-out') return 401;
  if (accessStatus === 'unavailable') return 503;
  if (accessStatus !== 'granted') return 403;
  return downloadsEnabled ? 200 : 503;
}
