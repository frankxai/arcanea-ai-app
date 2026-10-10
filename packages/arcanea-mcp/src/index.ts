#!/usr/bin/env node
/**
 * Arcanea worldbuilding MCP server
 * A worldbuilding toolkit for the Arcanea universe.
 * Making magic through AI-human co-creation.
 *
 * Features:
 * - Worldbuilding generators (characters, magic, locations, creatures, artifacts)
 * - Luminor AI companions with Council mode
 * - Bestiary of creative blocks with deep diagnosis
 * - In-process creative journeys and explicitly saved world graphs
 * - Canon validation and Ten Gates system
 * - Agent orchestration system (inspired by oh-my-opencode)
 * - Creation graph with relationship network
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerGuidanceTools,
  registerCanonTools,
} from "./registrations/guidance.js";
import { registerOrchestrationTools } from "./registrations/orchestration.js";
import { registerVisualStyleTools } from "./registrations/visual-style.js";
import { registerProductionTools } from "./registrations/production.js";
import { registerReferences } from "./registrations/references.js";
import { registerWebVaultTools } from "./registrations/web-vault.js";
import { registerGeneratorTools } from "./registrations/generators.js";
import { registerWorldGraphTools } from "./registrations/world-graph.js";
import { registerWorldIntelligenceTools } from "./registrations/world-intelligence.js";
import { registerWorldPersistenceTools } from "./registrations/world-persistence.js";
import { registerVisualPromptTools } from "./registrations/visual-prompts.js";
import { RUNTIME_INFO } from "./runtime-info.js";
import { catalogServer, resolveToolsets } from "./toolsets.js";

export interface ServerOptions {
  /** Comma list of toolsets or "all". Omitted: every tool, for library callers. */
  toolsets?: string;
}

export function createServer(options: ServerOptions = {}): McpServer {
  const server = new McpServer(RUNTIME_INFO);
  const target = catalogServer(
    server,
    options.toolsets === undefined ? null : resolveToolsets(options.toolsets),
  );
  registerGeneratorTools(target);
  registerGuidanceTools(target);
  registerWorldGraphTools(target);
  registerOrchestrationTools(target);
  registerCanonTools(target);
  registerVisualStyleTools(target);
  registerWorldIntelligenceTools(target);
  registerWorldPersistenceTools(target);
  registerVisualPromptTools(target);
  registerProductionTools(target);
  registerReferences(target);
  registerWebVaultTools(target);
  return server;
}

/** Backwards-compatible library instance. New transports should use createServer(). */
export const server = createServer();
