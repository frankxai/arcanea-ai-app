/**
 * Orchestrator Utilities — JSON parsing and local-mode helpers.
 */

import type { TasteResult } from "../quality/types.js";

/**
 * Extract and parse JSON from an agent's text response.
 *
 * Handles responses that contain markdown code fences or
 * have surrounding prose around the JSON payload.
 */
export function parseJsonResponse<T>(raw: string, context: string): T {
  // Try direct parse first
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Ignore — try extraction
  }

  // Extract from markdown code fence
  const fenceMatch = /```(?:json)?\s*\n?([\s\S]*?)```/.exec(raw);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as T;
    } catch {
      // Fall through
    }
  }

  // Extract first JSON object or array
  const jsonMatch = /[\[{][\s\S]*[\]}]/.exec(raw);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]) as T;
    } catch {
      // Fall through
    }
  }

  throw new Error(
    `Failed to parse JSON from ${context} response. Raw output:\n${raw.slice(0, 500)}`,
  );
}

/**
 * Build a minimal TasteResult when running locally without an API.
 *
 * In local mode the quality scoring is deferred to the human operator
 * or a subsequent Claude Code session. This returns a "needs-review"
 * placeholder so the pipeline can still report meaningful structure.
 */
export function buildLocalTasteResult(_prompt: string): TasteResult {
  return {
    technical: 0,
    aesthetic: 0,
    canon: 0,
    impact: 0,
    uniqueness: 0,
    total: 0,
    tier: "reject",
    feedback: [
      "Local mode: quality scoring requires a Claude Code session or ANTHROPIC_API_KEY.",
      "Run with --dry-run to preview, or set ANTHROPIC_API_KEY for automated scoring.",
    ],
    passesGate: false,
  };
}
