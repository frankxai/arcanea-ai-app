/**
 * POST /api/webhook/polar — verified Polar events → ledger.
 *
 * Processing order per delivery:
 *   1. verify signature (Standard Webhooks headers) or 403
 *   2. apply verified ledger intents and mark the event in one transaction
 *   3. acknowledge only a committed event; failed processing remains retryable
 */

import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { mapPolarEvent, type PolarEventLike } from "@/lib/billing/polar";
import { applyEvent } from "@/lib/billing/ledger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.POLAR_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return Response.json(
      { error: "POLAR_WEBHOOK_SECRET is not set" },
      { status: 503 },
    );
  }

  const body = await request.text();
  const deliveryId = request.headers.get("webhook-id") ?? "";

  let event: PolarEventLike;
  try {
    event = validateEvent(
      body,
      {
        "webhook-id": deliveryId,
        "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
        "webhook-signature": request.headers.get("webhook-signature") ?? "",
      },
      secret,
    ) as unknown as PolarEventLike;
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return Response.json({ error: "Invalid signature" }, { status: 403 });
    }
    throw error;
  }

  if (!deliveryId) {
    return Response.json({ error: "Missing webhook-id" }, { status: 400 });
  }

  try {
    const outcome = await applyEvent(
      deliveryId,
      event.type,
      event,
      mapPolarEvent(event),
    );
    return Response.json({ received: true, type: event.type, ...outcome });
  } catch {
    // A failed transaction leaves the event eligible for the provider's retry.
    return Response.json(
      { error: "Ledger processing unavailable" },
      { status: 503 },
    );
  }
}
