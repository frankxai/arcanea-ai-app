import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { asGatewayError } from "./errors.js";
import { executeWorldContextQuery } from "./engine.js";
import {
  worldContextCompatibilityInputSchema,
  worldContextOutputSchema,
} from "./schema.js";
import type { WorldContextGatewayDependencies } from "./types.js";

export function createWorldContextGatewayServer(
  dependencies: WorldContextGatewayDependencies,
): McpServer {
  const server = new McpServer({
    name: "arcanea-world-context-gateway",
    version: "0.1.0",
  });

  server.registerTool(
    "arcanea_get_world_context",
    {
      title: "Get World Context",
      description:
        "Retrieve only the relevant authorized world state and provenance needed for the current creator job. Compatibility preview supports owner/source-only reads and fails closed for other canon states.",
      inputSchema: worldContextCompatibilityInputSchema,
      outputSchema: worldContextOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: {
        "arcanea/runtime-status": "compatibility-preview",
        "arcanea/contract": "arcanea_get_world_context.v0.3",
      },
    },
    async (input) => {
      try {
        const output = await executeWorldContextQuery(input, dependencies);
        const summary = [
          `World Context returned ${output.coverage.returnedEntities} entities,`,
          `${output.coverage.returnedConflicts} conflicts, and`,
          `${output.coverage.returnedProvenance} provenance records.`,
          `Revision ${output.revision}.`,
          output.coverage.truncated
            ? "The deterministic response budget truncated lower-priority records."
            : "The bounded selection was returned in full.",
          "Use structuredContent for the authorized records.",
        ].join(" ");
        return {
          content: [{ type: "text", text: summary }],
          structuredContent: output,
        };
      } catch (error) {
        const gatewayError = asGatewayError(error);
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: {
                  code: gatewayError.code,
                  message: gatewayError.message,
                },
              }),
            },
          ],
        };
      }
    },
  );

  return server;
}

export interface StatelessMcpRequestOptions {
  parsedBody?: unknown;
}

export async function handleStatelessWorldContextMcpRequest(
  request: Request,
  dependencies: WorldContextGatewayDependencies,
  options: StatelessMcpRequestOptions = {},
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      }),
      {
        status: 405,
        headers: { allow: "POST", "content-type": "application/json" },
      },
    );
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  const server = createWorldContextGatewayServer(dependencies);
  await server.connect(transport);
  return transport.handleRequest(request, { parsedBody: options.parsedBody });
}
