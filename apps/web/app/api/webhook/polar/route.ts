import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";

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

  let event: ReturnType<typeof validateEvent>;
  try {
    event = validateEvent(body, {
      "webhook-id": request.headers.get("webhook-id") ?? "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": request.headers.get("webhook-signature") ?? "",
    }, secret);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return Response.json({ error: "Invalid signature" }, { status: 403 });
    }
    throw error;
  }

  switch (event.type) {
    case "order.paid":
      // Paid-book access is reconciled against Polar Orders by external customer
      // ID on every protected request. The signed webhook is intentionally an
      // idempotent acknowledgement, not a second entitlement authority.
      break;
    case "customer.state_changed":
      // No local customer state is cached for book access.
      break;
    default:
      break;
  }

  return Response.json({ received: true });
}
