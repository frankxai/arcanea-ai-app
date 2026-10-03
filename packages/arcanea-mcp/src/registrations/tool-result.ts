import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function toolResult(r: {
  content: Array<{ type: string; text: string }>;
}): CallToolResult {
  return r as unknown as CallToolResult;
}
