/**
 * Arcanea Web Vault MCP tools — bridge Claude Code / Cursor / Windsurf
 * into the creator's live Arcanea Studio vault.
 *
 * Unlike the local file-based Starlight vault-tools (`vault-tools.ts`), these
 * tools talk to the deployed Arcanea web app over HTTP. The creator configures:
 *
 *   ARCANEA_WEB_URL       = https://arcanea.ai      (or preview URL)
 *   ARCANEA_SESSION_TOKEN = <sb-access-token from a signed-in browser>
 *
 * With those env vars, any MCP host can reach the creator's vault through
 * the same endpoints the /chat Luminors use — one canonical vault, many
 * surfaces. Missing env produces a graceful typed error.
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

interface BridgeConfig {
  baseUrl: string;
  sessionToken: string;
}

function ok(payload: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
  } as unknown as CallToolResult;
}

function fail(message: string, extra?: Record<string, unknown>): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: message, ...(extra ?? {}) }, null, 2),
      },
    ],
    isError: true,
  } as unknown as CallToolResult;
}

function resolveConfig(): BridgeConfig | null {
  const baseUrl = process.env.ARCANEA_WEB_URL;
  const sessionToken = process.env.ARCANEA_SESSION_TOKEN;
  if (!baseUrl || !sessionToken) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), sessionToken };
}

async function authedFetch(path: string, init: RequestInit & { cfg: BridgeConfig }) {
  const { cfg, ...rest } = init;
  // Studio routes resolve auth from the sb-*-auth-token cookie. We synthesize
  // that cookie from the session token the creator exported.
  const cookie = `sb-arcanea-auth-token=${encodeURIComponent(cfg.sessionToken)}`;
  return fetch(`${cfg.baseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookie,
      ...(rest.headers ?? {}),
    },
  });
}

// ---------------------------------------------------------------------------
// search_arcanea_vault
// ---------------------------------------------------------------------------

interface SearchInput {
  query: string;
  limit?: number;
  worldId?: string;
  classification?: string;
}

export async function searchArcaneaVault(input: SearchInput): Promise<CallToolResult> {
  const cfg = resolveConfig();
  if (!cfg) {
    return fail(
      "Arcanea web bridge not configured. Set ARCANEA_WEB_URL and ARCANEA_SESSION_TOKEN env vars.",
      {
        docs: "https://arcanea.ai/docs/mcp#arcanea-web-vault",
      },
    );
  }
  const trimmed = input.query?.trim();
  if (!trimmed || trimmed.length < 2) {
    return fail("query must be at least 2 characters");
  }

  try {
    const res = await authedFetch("/api/studio/search", {
      cfg,
      method: "POST",
      body: JSON.stringify({
        query: trimmed,
        limit: input.limit ?? 8,
        worldId: input.worldId,
        classification: input.classification,
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      return fail(`Vault search failed: ${res.status}`, { detail: text });
    }
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return fail("Vault search returned non-JSON response", { sample: text.slice(0, 200) });
    }
    return ok(data);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Network error");
  }
}

// ---------------------------------------------------------------------------
// save_to_arcanea_vault
// ---------------------------------------------------------------------------

interface SaveInput {
  title: string;
  content: string;
  classification:
    | "character"
    | "location"
    | "magic"
    | "scene"
    | "lore"
    | "reference"
    | "chapter"
    | "note";
  tags?: string[];
  worldId?: string;
}

export async function saveToArcaneaVault(input: SaveInput): Promise<CallToolResult> {
  const cfg = resolveConfig();
  if (!cfg) {
    return fail(
      "Arcanea web bridge not configured. Set ARCANEA_WEB_URL and ARCANEA_SESSION_TOKEN env vars.",
    );
  }
  if (!input.title || !input.content || !input.classification) {
    return fail("title, content, and classification are required");
  }

  try {
    const res = await authedFetch("/api/studio/ingest", {
      cfg,
      method: "POST",
      body: JSON.stringify({
        title: input.title,
        content: input.content,
        classification: input.classification,
        tags: input.tags ?? [],
        worldId: input.worldId,
        source_type: "mcp",
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      return fail(`Vault save failed: ${res.status}`, { detail: text });
    }
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return fail("Vault save returned non-JSON response", { sample: text.slice(0, 200) });
    }
    return ok(data);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Network error");
  }
}

// ---------------------------------------------------------------------------
// list_arcanea_worlds
// ---------------------------------------------------------------------------

export async function listArcaneaWorlds(): Promise<CallToolResult> {
  const cfg = resolveConfig();
  if (!cfg) {
    return fail(
      "Arcanea web bridge not configured. Set ARCANEA_WEB_URL and ARCANEA_SESSION_TOKEN env vars.",
    );
  }
  try {
    const res = await authedFetch("/api/worlds", { cfg, method: "GET" });
    const text = await res.text();
    if (!res.ok) {
      return fail(`World list failed: ${res.status}`, { detail: text });
    }
    try {
      return ok(JSON.parse(text));
    } catch {
      return fail("World list returned non-JSON response", { sample: text.slice(0, 200) });
    }
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Network error");
  }
}

// ---------------------------------------------------------------------------
// get_arcanea_bridge_status — lets users verify env setup from inside any host
// ---------------------------------------------------------------------------

export async function getArcaneaBridgeStatus(): Promise<CallToolResult> {
  const cfg = resolveConfig();
  if (!cfg) {
    return ok({
      configured: false,
      missing: ["ARCANEA_WEB_URL", "ARCANEA_SESSION_TOKEN"].filter(
        (k) => !process.env[k],
      ),
      docs: "https://arcanea.ai/docs/mcp#arcanea-web-vault",
    });
  }
  return ok({
    configured: true,
    baseUrl: cfg.baseUrl,
    sessionTokenSet: Boolean(cfg.sessionToken),
    lastChecked: new Date().toISOString(),
  });
}
