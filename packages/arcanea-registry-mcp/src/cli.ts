#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createRegistryServer } from './index.js';

const server = createRegistryServer();
const transport = new StdioServerTransport();
await server.connect(transport);
