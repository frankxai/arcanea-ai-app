import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSearchTool } from './tools/search.js';
import { registerPublishTool } from './tools/publish.js';
import { registerDeployTool } from './tools/deploy.js';
import { registerStatusTool } from './tools/status.js';
import { registerUsageTool } from './tools/usage.js';
import { registerEarnTool } from './tools/earn.js';
import { registerSkillsTool } from './tools/skills.js';
import { registerPlatformsTool } from './tools/platforms.js';

export function createRegistryServer(): McpServer {
  const server = new McpServer({
    name: 'arcanea-registry',
    version: '0.1.0',
  });

  // Core registry operations
  registerSearchTool(server);
  registerPublishTool(server);
  registerDeployTool(server);
  registerStatusTool(server);

  // Analytics & revenue
  registerUsageTool(server);
  registerEarnTool(server);

  // Skills & platforms
  registerSkillsTool(server);
  registerPlatformsTool(server);

  return server;
}
