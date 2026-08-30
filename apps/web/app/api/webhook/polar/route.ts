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
      // TODO: grant access for the paid order. Do not invent entitlements here.
      break;
    case "customer.state_changed":
      // TODO: sync Polar customer state to the app user. Do not invent mapping here.
      break;
    default:
      break;
  }

  return Response.json({ received: true });
}
