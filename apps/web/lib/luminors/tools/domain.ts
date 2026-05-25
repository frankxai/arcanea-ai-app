/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Domain-specific tool helpers for the per-Luminor executor path.
 *
 * These are lightweight "capability hints" that ship with Luminors whose
 * domain matches. Power users reach for MCP tools instead; these cover the
 * baseline without external dependencies.
 */

import { tool } from 'ai';
import { z } from 'zod';
import type { LuminorToolSet } from './types';

export function buildDomainTools(domain: string): LuminorToolSet {
  const tools: LuminorToolSet = {};

  if (['code', 'architecture', 'debugging', 'integration'].includes(domain)) {
    tools.suggest_code = tool({
      description:
        'Generate a code suggestion with language, filename, and explanation. Use when the creator needs a concrete implementation.',
      inputSchema: z.object({
        language: z.string().describe('Programming language (e.g., typescript, python)'),
        filename: z.string().describe('Suggested filename'),
        code: z.string().describe('The code to suggest'),
        explanation: z.string().describe('Brief explanation of what the code does and why'),
      }),
      execute: async (params: {
        language: string;
        filename: string;
        code: string;
        explanation: string;
      }) => ({
        type: 'code_suggestion' as const,
        ...params,
      }),
    });
  }

  if (['visual', 'music', 'motion', 'spatial'].includes(domain)) {
    tools.describe_asset = tool({
      description:
        'Describe a visual or audio asset in detail for generation. Use when the creator needs an image, sound, or animation concept.',
      inputSchema: z.object({
        assetType: z.enum(['image', 'audio', 'animation', '3d-model']),
        description: z.string().describe('Detailed description for generation'),
        style: z.string().describe('Style reference (e.g., "cinematic", "minimal", "watercolor")'),
        mood: z.string().describe('Emotional quality of the asset'),
      }),
      execute: async (params: {
        assetType: string;
        description: string;
        style: string;
        mood: string;
      }) => ({
        type: 'asset_description' as const,
        ...params,
        note:
          'Asset description generated. In production, this triggers ComfyUI or image gen pipeline.',
      }),
    });
  }

  if (['narrative', 'rhetoric', 'language', 'poetry'].includes(domain)) {
    tools.create_outline = tool({
      description:
        'Create a structured outline for a piece of writing. Use when the creator needs to organize ideas before drafting.',
      inputSchema: z.object({
        title: z.string().describe('Working title'),
        sections: z
          .array(
            z.object({
              heading: z.string(),
              keyPoints: z.array(z.string()),
            }),
          )
          .describe('Ordered sections with key points'),
        targetLength: z
          .string()
          .describe('Approximate target length (e.g., "500 words", "3 chapters")'),
      }),
      execute: async (params: {
        title: string;
        sections: Array<{ heading: string; keyPoints: string[] }>;
        targetLength: string;
      }) => ({
        type: 'writing_outline' as const,
        ...params,
      }),
    });
  }

  if (['knowledge', 'analysis', 'foresight'].includes(domain)) {
    tools.cite_source = tool({
      description:
        'Record a source citation for a claim. Use when making specific factual claims that should be traceable.',
      inputSchema: z.object({
        claim: z.string().describe('The specific claim being made'),
        source: z.string().describe('Source name, URL, or reference'),
        confidence: z.enum(['high', 'medium', 'low']).describe('How confident you are in this source'),
        note: z.string().optional().describe('Additional context about the source'),
      }),
      execute: async (params: {
        claim: string;
        source: string;
        confidence: string;
        note?: string;
      }) => ({
        type: 'source_citation' as const,
        ...params,
      }),
    });
  }

  return tools;
}

/** Map team names (from config.ts) to domain strings. */
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
