import {
  GatewayError,
  handleStatelessWorldContextMcpRequest,
  type WorldContextActor,
  type WorldContextAdmissionLimiter,
  type WorldContextAuditSink,
  type WorldContextAuthority,
  type WorldContextRepository,
} from "@arcanea/mcp-server/gateway";

const MAX_REQUEST_BYTES = 65_536;

export interface AuthenticatedWorldContextSession {
  actor: WorldContextActor;
  repository: WorldContextRepository;
}

export interface WorldContextMcpHttpDependencies {
  getMode(): string | undefined;
  authenticate(
    request: Request,
  ): Promise<AuthenticatedWorldContextSession | null>;
  admissionLimiter: WorldContextAdmissionLimiter;
  authority: WorldContextAuthority;
  audit?: WorldContextAuditSink;
  handleMcpRequest?: typeof handleStatelessWorldContextMcpRequest;
}

function jsonResponse(
  status: number,
  code: string,
  message: string,
  headers?: HeadersInit,
): Response {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "cross-origin-resource-policy": "same-origin",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      ...headers,
    },
  });
}

function originAllowed(request: Request): boolean {
  const rawOrigin = request.headers.get("origin");
  if (!rawOrigin) return true;
  let origin: string;
  try {
    origin = new URL(rawOrigin).origin;
  } catch {
    return false;
  }
  const requestOrigin = new URL(request.url).origin;
  return origin === requestOrigin;
}

function isWorldContextToolCall(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const request = value as {
    method?: unknown;
    params?: { name?: unknown };
  };
  return (
    request.method === "tools/call" &&
    request.params?.name === "arcanea_get_world_context"
  );
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    throw new GatewayError("context-bound-mismatch");
  }
  if (!request.body) throw new SyntaxError("Missing request body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new GatewayError("context-bound-mismatch");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

function secureResponse(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store");
  headers.set("cross-origin-resource-policy", "same-origin");
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "no-referrer");
  headers.set("vary", "Authorization, Origin, MCP-Protocol-Version");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function createWorldContextMcpHttpHandler(
  dependencies: WorldContextMcpHttpDependencies,
): (request: Request) => Promise<Response> {
  const handleMcpRequest =
    dependencies.handleMcpRequest ?? handleStatelessWorldContextMcpRequest;

  return async (request: Request): Promise<Response> => {
    if (dependencies.getMode() !== "compatibility-preview") {
      return jsonResponse(
        503,
        "adapter-required",
        "World Context Gateway is not connected.",
      );
    }
    if (request.method !== "POST") {
      return jsonResponse(
        405,
        "method-not-allowed",
        "Only POST is supported.",
        { allow: "POST" },
      );
    }
    if (!originAllowed(request)) {
      return jsonResponse(403, "origin-denied", "Origin is not allowed.");
    }

    let session: AuthenticatedWorldContextSession | null;
    try {
      session = await dependencies.authenticate(request);
    } catch (error) {
      if (error instanceof GatewayError && error.code === "adapter-required") {
        return jsonResponse(503, error.code, error.message);
      }
      return jsonResponse(
        503,
        "adapter-required",
        "World Context authentication is unavailable.",
      );
    }
    if (!session) {
      return jsonResponse(
        401,
        "authentication-required",
        "Authentication is required.",
        {
          "www-authenticate": "Bearer",
        },
      );
    }

    const contentType = request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      ?.trim()
      .toLowerCase();
    if (contentType !== "application/json") {
      return jsonResponse(
        415,
        "unsupported-media-type",
        "Content-Type must be application/json.",
      );
    }

    let parsedBody: unknown;
    try {
      parsedBody = await readBoundedJson(request);
    } catch (error) {
      if (
        error instanceof GatewayError &&
        error.code === "context-bound-mismatch"
      ) {
        return jsonResponse(
          413,
          error.code,
          "Request body exceeds the allowed bound.",
        );
      }
      return jsonResponse(
        400,
        "invalid-json",
        "Request body must be valid JSON.",
      );
    }

    if (Array.isArray(parsedBody)) {
      return jsonResponse(
        400,
        "json-rpc-batch-unsupported",
        "JSON-RPC batch requests are not supported.",
      );
    }
    if (isWorldContextToolCall(parsedBody)) {
      try {
        await dependencies.admissionLimiter.consume(session.actor);
      } catch (error) {
        if (
          error instanceof GatewayError &&
          error.code === "context-query-rate-limited"
        ) {
          try {
            await dependencies.audit?.record({
              schemaVersion: "arcanea.world-context-audit.v1",
              outcome: "denied",
              code: error.code,
              authenticatedTenantId: session.actor.tenantId,
              authenticatedActorId: session.actor.actorId,
            });
          } catch {
            // Admission remains fail-closed even if preview receipt logging fails.
          }
          return jsonResponse(429, error.code, error.message, {
            "retry-after": "60",
          });
        }
        return jsonResponse(
          503,
          "admission-unavailable",
          "World Context admission control is unavailable.",
        );
      }
    }

    try {
      const response = await handleMcpRequest(
        request,
        {
          actor: session.actor,
          repository: session.repository,
          authority: dependencies.authority,
          audit: dependencies.audit,
        },
        { parsedBody },
      );
      return secureResponse(response);
    } catch {
      return jsonResponse(
        500,
        "mcp-transport-error",
        "The MCP request could not be completed.",
      );
    }
  };
}
