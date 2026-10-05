/**
 * POST /api/webhook/polar — verified Polar events → ledger.
 *
 * Processing order per delivery:
 *   1. verify signature (Standard Webhooks headers) or 403
 *   2. record the delivery id; a repeat delivery returns 200 without re-applying
 *   3. map the event to ledger intents (pure) and apply each one
 *   4. mark the delivery processed, with the error text if any intent failed
 *
 * Every ledger write is idempotent on its own reference, so even a crash between
 * steps 3 and 4 cannot double-grant credits on redelivery.
 */

import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { mapPolarEvent, type PolarEventLike } from "@/lib/billing/polar";
import {
  grantCredits,
  markEvent,
  recordEvent,
  setPlan,
} from "@/lib/billing/ledger";

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

  const firstDelivery = await recordEvent(deliveryId, event.type, event);
  if (!firstDelivery) {
    return Response.json({ received: true, duplicate: true });
  }

  const intents = mapPolarEvent(event);
  const applied: string[] = [];
  let failure: string | undefined;

  for (const intent of intents) {
    try {
      if (intent.kind === "grant") {
        await grantCredits({
          userId: intent.userId,
          amount: intent.amount,
          kind: intent.grantKind,
          reference: intent.reference,
          metadata: intent.metadata,
        });
      } else {
        await setPlan({
          userId: intent.userId,
          plan: intent.plan,
          status: intent.status,
          polarCustomerId: intent.polarCustomerId,
          polarSubscriptionId: intent.polarSubscriptionId,
          polarProductId: intent.polarProductId,
          currentPeriodEnd: intent.currentPeriodEnd,
          cancelAtPeriodEnd: intent.cancelAtPeriodEnd,
        });
      }
      applied.push(intent.kind);
    } catch (error) {
      failure = error instanceof Error ? error.message : String(error);
      console.error("[webhook/polar] intent failed", {
        type: event.type,
        intent: intent.kind,
        failure,
      });
      break;
    }
  }

  await markEvent(deliveryId, failure).catch(() => undefined);

  if (failure) {
    // 500 makes Polar retry. The delivery row keeps the error for the operator.
    return Response.json(
      { error: "Ledger write failed", applied },
      { status: 500 },
    );
  }
  return Response.json({
    received: true,
    type: event.type,
    applied,
    ignored: intents.length === 0,
  });
}
