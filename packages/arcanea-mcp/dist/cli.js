#!/usr/bin/env node
/**
 * CLI entry point for Arcanea MCP Server.
 *
 * Usage:
 *   node dist/cli.js                          # stdio (default)
 *   node dist/cli.js --transport stdio        # stdio (explicit)
 *   node dist/cli.js --transport http         # HTTP/SSE on port 3100
 *   node dist/cli.js --transport http --port 8080
 */
import { createServer } from "./index.js";
import { runStdio, runHttp } from "./transport.js";
import { searchSovereignDepths, sovereignDepthsQuerySchema, } from "./tools/sovereign-depths.js";
import { searchWeightOfWonders, weightOfWondersQuerySchema, } from "./tools/weight-of-wonders.js";
const args = process.argv.slice(2);
function getArg(flag) {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
}
const transportType = getArg("--transport") ?? "stdio";
const portRaw = getArg("--port");
const port = portRaw ? parseInt(portRaw, 10) : 3100;
if (!["stdio", "http"].includes(transportType)) {
    console.error(`Unknown transport "${transportType}". Use "stdio" or "http".`);
    process.exit(1);
}
if (portRaw && isNaN(port)) {
    console.error(`Invalid port "${portRaw}". Must be a number.`);
    process.exit(1);
}
const server = createServer();
server.registerTool("search_sovereign_depths", {
    description: "Read Arcanea's Sovereign Depths bosses, dungeons, encounter designs and book-development links. Records are STAGING or EXPERIMENTAL proposals; explicit includeProposals=true is required, and experimental records or stories additionally require includeExperimental=true. Does not access creator-private worlds or promote canon.",
    inputSchema: sovereignDepthsQuerySchema.shape,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
    },
}, searchSovereignDepths);
server.registerTool("search_weight_of_wonders", {
    description: "Read Arcanea's Weight of Wonders boss, place, encounter and story concepts. Every record is EXPERIMENTAL; both includeProposals=true and includeExperimental=true are required. Does not access creator-private worlds or promote canon.",
    inputSchema: weightOfWondersQuerySchema.shape,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
    },
}, searchWeightOfWonders);
if (transportType === "http") {
    runHttp(server, port).catch((err) => {
        console.error("Failed to start HTTP transport:", err);
        process.exit(1);
    });
}
else {
    runStdio(server).catch((err) => {
        console.error("Failed to start stdio transport:", err);
        process.exit(1);
    });
}
//# sourceMappingURL=cli.js.map