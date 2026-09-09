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
 * - Multi-agent parallel execution
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
import { registerLibraryTools } from "./registrations/library.js";

export function createServer(): McpServer {
  const server = new McpServer(RUNTIME_INFO);
  registerGeneratorTools(server);
  registerGuidanceTools(server);
  registerWorldGraphTools(server);
  registerOrchestrationTools(server);
  registerCanonTools(server);
  registerVisualStyleTools(server);
  registerWorldIntelligenceTools(server);
  registerWorldPersistenceTools(server);
  registerVisualPromptTools(server);
  registerProductionTools(server);
  registerReferences(server);
  registerWebVaultTools(server);
  registerLibraryTools(server);
  return server;
}

/** Backwards-compatible library instance. New transports should use createServer(). */
export const server = createServer();
