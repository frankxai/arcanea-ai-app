import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSearchTool } from './tools/search.js';
import { registerPublishTool } from './tools/publish.js';
import { registerDeployTool } from './tools/deploy.js';
import { registerStatusTool } from './tools/status.js';
import { registerUsageTool } from './tools/usage.js';
import { registerAttributionTool } from './tools/attribution.js';
import { registerSkillsTool } from './tools/skills.js';
import { registerPlatformsTool } from './tools/platforms.js';

export function createRegistryServer(): McpServer {
  const server = new McpServer({
    name: 'arcanea-registry',
    version: '0.2.0',
  });

  // Discovery & publishing
  registerSearchTool(server);
  registerPublishTool(server);

  // Deployment
  registerDeployTool(server);
  registerStatusTool(server);

  // Analytics & attribution (abundance model — pure reach, no money splits)
  registerUsageTool(server);
  registerAttributionTool(server);

  // Skills & platforms
  registerSkillsTool(server);
  registerPlatformsTool(server);

  return server;
}
