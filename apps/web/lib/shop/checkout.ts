import { editionReleased, findEdition, type ShopEdition } from "./catalog";

export function approvedCheckoutUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "buy.polar.sh" ||
      url.port ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !/^\/[a-zA-Z0-9/_-]+$/.test(url.pathname)
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

export function checkoutUrlForEdition(
  edition: ShopEdition,
  environment: Record<string, string | undefined>,
): string | null {
  if (!editionReleased(edition)) return null;
  return approvedCheckoutUrl(environment[edition.checkoutEnv]);
}

export type CheckoutResult = {
  status: number;
  body: { url?: string; error?: string; code?: string };
};

export function prepareCheckout(
  input: unknown,
  environment: Record<string, string | undefined>,
): CheckoutResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      status: 400,
      body: { error: "Invalid request.", code: "invalid_request" },
    };
  }
  const values = input as Record<string, unknown>;
  if (Object.keys(values).length !== 1 || typeof values.slug !== "string") {
    return {
      status: 400,
      body: { error: "Send only the edition slug.", code: "invalid_request" },
    };
  }
  const edition = findEdition(values.slug);
  if (!edition)
    return {
      status: 404,
      body: { error: "Edition not found.", code: "not_found" },
    };
  const url = checkoutUrlForEdition(edition, environment);
  if (!url)
    return {
      status: 503,
      body: {
        error:
          "This edition is not available for purchase. You can explore the free sample.",
        code: "edition_unavailable",
      },
    };
  return { status: 200, body: { url } };
}

export async function handleCheckoutRequest(
  request: Request,
  environment: Record<string, string | undefined>,
): Promise<Response> {
  const headers = { "Cache-Control": "private, no-store" };
  const reply = (error: string, status: number) =>
    Response.json({ error }, { status, headers });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return reply("Request origin is not permitted.", 403);
  const limit = 2048;
  if (Number(request.headers.get("content-length")) > limit)
    return reply("Request is too large.", 413);
  let input: unknown;
  try {
    // Bound streamed bytes too: Content-Length can be absent or dishonest.
    const reader = request.body?.getReader();
    if (!reader) return reply("Invalid JSON.", 400);
    const decoder = new TextDecoder();
    let bytes = 0;
    let body = "";
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > limit) {
          await reader.cancel();
          return reply("Request is too large.", 413);
        }
        body += decoder.decode(chunk.value, { stream: true });
      }
      body += decoder.decode();
    } finally {
      reader.releaseLock();
    }
    input = JSON.parse(body);
  } catch {
    return reply("Invalid JSON.", 400);
  }
  const result = prepareCheckout(input, environment);
  return Response.json(result.body, { status: result.status, headers });
}
