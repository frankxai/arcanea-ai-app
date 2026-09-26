import { createServer, type ServerOptions } from "./index.js";
import { gateTools, resolveToolsets } from "./toolsets.js";

import {
  searchSovereignDepths,
  sovereignDepthsQuerySchema,
} from "./tools/sovereign-depths.js";
import {
  searchWeightOfWonders,
  weightOfWondersQuerySchema,
} from "./tools/weight-of-wonders.js";

export function createRuntimeServer(options: ServerOptions = {}) {
  const server = createServer(options);
  const target =
    options.toolsets === undefined
      ? server
      : gateTools(server, resolveToolsets(options.toolsets));

  target.registerTool(
    "search_sovereign_depths",
    {
      description:
        "Read Arcanea's Sovereign Depths bosses, dungeons, encounter designs and book-development links. Records are STAGING or EXPERIMENTAL proposals; explicit includeProposals=true is required, and experimental records or stories additionally require includeExperimental=true. Does not access creator-private worlds or promote canon.",
      inputSchema: sovereignDepthsQuerySchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    searchSovereignDepths,
  );

  target.registerTool(
    "search_weight_of_wonders",
    {
      description:
        "Read Arcanea's Weight of Wonders boss, place, encounter and story concepts. Every record is EXPERIMENTAL; both includeProposals=true and includeExperimental=true are required. Does not access creator-private worlds or promote canon.",
      inputSchema: weightOfWondersQuerySchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    searchWeightOfWonders,
  );

  return server;
}
