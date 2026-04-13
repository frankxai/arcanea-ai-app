/**
 * Luminor Tool Resolver
 *
 * Maps each Luminor's domain to the set of Vercel AI SDK tools it can call.
 * The executor calls resolveToolsForLuminor() before streamText() to give
 * each Luminor the right capabilities.
 *
 * Tool categories:
 *   1. Handoff tool (inter-Luminor delegation) — all Luminors get this
 *   2. Memory edit tool (Letta self-editing) — all authenticated Luminors
 *   3. Domain-specific tools — resolved per Luminor domain
 *
 * Reference: Luminor Kernel Spec v1.0 §5 (Runtime Protocol)
 */

import { tool } from 'ai';
import { z } from 'zod';
import { buildHandoffTool } from './handoff-tool';
import { buildMemoryEditTool } from './memory-edit-tool';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LuminorToolSet = Record<string, any>;

interface ToolResolverContext {
  luminorId: string;
  domain: string;
  userId?: string | null;
  authenticated: boolean;
}

/**
 * Resolve the full tool set for a Luminor invocation.
 *
 * Every Luminor gets:
 *   - handoff_to_luminor (delegate to another Luminor)
 *   - web_search (search the web for current information)
 *
 * Authenticated Luminors also get:
 *   - update_memory (Letta-style self-editing memory block)
 *
 * Domain-specific tools are layered on top based on the Luminor's specialty.
 */
export function resolveToolsForLuminor(ctx: ToolResolverContext): LuminorToolSet {
  const tools: LuminorToolSet = {};

  // 1. Universal: handoff to another Luminor
  tools.handoff_to_luminor = buildHandoffTool();

  // 2. Universal: web search (lightweight — just returns a summary prompt)
  tools.web_search = tool({
    description: 'Search the web for current information on a topic. Use when you need facts, recent events, or data you do not have.',
    inputSchema: z.object({
      query: z.string().describe('The search query'),
    }),
    execute: async ({ query }: { query: string }) => {
      // Delegates to the search endpoint if available, else returns guidance
      return {
        result: `[Web search for "${query}" — in production this calls the search API. For now, use your training knowledge and note that you searched.]`,
        note: 'Web search integration pending. Use your knowledge and flag uncertainty.',
      };
    },
  });

  // 3. Authenticated: self-editing memory
  if (ctx.authenticated && ctx.userId) {
    tools.update_memory = buildMemoryEditTool(ctx.luminorId, ctx.userId);
  }

  // 4. Domain-specific tools
  const domainTools = getDomainTools(ctx.domain);
  for (const [name, t] of Object.entries(domainTools)) {
    tools[name] = t;
  }

  return tools;
}

/**
 * Domain-specific tool sets.
 *
 * These are lightweight "capability hints" — the real power comes from
 * MCP tools (wired in P3). For now, these give Luminors useful primitives
 * that work without external dependencies.
 */
function getDomainTools(domain: string): LuminorToolSet {
  const tools: LuminorToolSet = {};

  // Code-adjacent domains get a code execution hint tool
  if (['code', 'architecture', 'debugging', 'integration'].includes(domain)) {
    tools.suggest_code = tool({
      description: 'Generate a code suggestion with language, filename, and explanation. Use when the creator needs a concrete implementation.',
      inputSchema: z.object({
        language: z.string().describe('Programming language (e.g., typescript, python)'),
        filename: z.string().describe('Suggested filename'),
        code: z.string().describe('The code to suggest'),
        explanation: z.string().describe('Brief explanation of what the code does and why'),
      }),
      execute: async (params: { language: string; filename: string; code: string; explanation: string }) => ({
        type: 'code_suggestion' as const,
        ...params,
      }),
    });
  }

  // Creative domains get a visual/audio reference tool
  if (['visual', 'music', 'motion', 'spatial'].includes(domain)) {
    tools.describe_asset = tool({
      description: 'Describe a visual or audio asset in detail for generation. Use when the creator needs an image, sound, or animation concept.',
      inputSchema: z.object({
        assetType: z.enum(['image', 'audio', 'animation', '3d-model']),
        description: z.string().describe('Detailed description for generation'),
        style: z.string().describe('Style reference (e.g., "cinematic", "minimal", "watercolor")'),
        mood: z.string().describe('Emotional quality of the asset'),
      }),
      execute: async (params: { assetType: string; description: string; style: string; mood: string }) => ({
        type: 'asset_description' as const,
        ...params,
        note: 'Asset description generated. In production, this triggers ComfyUI or image gen pipeline.',
      }),
    });
  }

  // Writing domains get a structure/outline tool
  if (['narrative', 'rhetoric', 'language', 'poetry'].includes(domain)) {
    tools.create_outline = tool({
      description: 'Create a structured outline for a piece of writing. Use when the creator needs to organize ideas before drafting.',
      inputSchema: z.object({
        title: z.string().describe('Working title'),
        sections: z.array(z.object({
          heading: z.string(),
          keyPoints: z.array(z.string()),
        })).describe('Ordered sections with key points'),
        targetLength: z.string().describe('Approximate target length (e.g., "500 words", "3 chapters")'),
      }),
      execute: async (params: { title: string; sections: Array<{ heading: string; keyPoints: string[] }>; targetLength: string }) => ({
        type: 'writing_outline' as const,
        ...params,
      }),
    });
  }

  // Research domains get a source citation tool
  if (['knowledge', 'analysis', 'foresight'].includes(domain)) {
    tools.cite_source = tool({
      description: 'Record a source citation for a claim. Use when making specific factual claims that should be traceable.',
      inputSchema: z.object({
        claim: z.string().describe('The specific claim being made'),
        source: z.string().describe('Source name, URL, or reference'),
        confidence: z.enum(['high', 'medium', 'low']).describe('How confident you are in this source'),
        note: z.string().optional().describe('Additional context about the source'),
      }),
      execute: async (params: { claim: string; source: string; confidence: string; note?: string }) => ({
        type: 'source_citation' as const,
        ...params,
      }),
    });
  }

  return tools;
}

/**
 * Map team names (from config.ts) to domain strings (for tool resolution).
 */
export function teamToDomain(team: string): string {
  const map: Record<string, string> = {
    development: 'code',
    creative: 'visual',
    writing: 'narrative',
    research: 'knowledge',
    orchestrator: 'custom',
  };
  return map[team] ?? 'custom';
}
