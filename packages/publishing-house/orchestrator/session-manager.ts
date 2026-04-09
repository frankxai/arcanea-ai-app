/**
 * Arcanea Publishing House — Session Manager
 *
 * Abstracts the dual deploy model: Managed Agents API (cloud) vs
 * Claude Code subagent prompts (local). The caller never needs to
 * know which path is active.
 *
 * Cloud path: create agent + environment + session via Anthropic API,
 *   send tasks, stream/poll until idle.
 * Local path: generate a structured prompt string that Claude Code
 *   can execute as a subagent via the Agent tool.
 */

import { loadAgent, createSession, streamEvents } from "../agents/index.js";
import type { AgentEvent, EnvironmentConfig } from "../agents/types.js";
import type {
  ClawName,
  DeployMode,
  ManagedSession,
  SessionResult,
} from "./types.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 2_000;
const DEFAULT_BASE_URL = "https://api.anthropic.com";

// ---------------------------------------------------------------------------
// Deploy Mode Detection
// ---------------------------------------------------------------------------

/**
 * Detect whether we can use Managed Agents or must fall back to local.
 */
export function detectDeployMode(): DeployMode {
  return process.env["ANTHROPIC_API_KEY"] ? "managed" : "local";
}

// ---------------------------------------------------------------------------
// Managed Agent Sessions (Cloud Path)
// ---------------------------------------------------------------------------

/**
 * Create a Managed Agent session for a given Claw.
 *
 * Loads the agent definition JSON, resolves environment variables,
 * and calls the Anthropic API to create an agent + session pair.
 */
export async function createClawSession(
  clawName: ClawName,
  task: string,
): Promise<ManagedSession> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      `Cannot create managed session for "${clawName}" — ANTHROPIC_API_KEY not set. Use runClawLocal() instead.`,
    );
  }

  const agentConfig = loadAgent(clawName);
  const envConfig: EnvironmentConfig = {
    apiKey,
    baseUrl: process.env["ANTHROPIC_BASE_URL"] ?? DEFAULT_BASE_URL,
    env: {},
  };

  const session = await createSession(agentConfig, envConfig);

  return {
    session,
    mode: "managed",
    output: "",
  };
}

/**
 * Send a user message / task to an active Managed Agent session.
 */
export async function sendTask(
  managedSession: ManagedSession,
  message: string,
): Promise<void> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY required for sendTask");
  }

  const baseUrl = process.env["ANTHROPIC_BASE_URL"] ?? DEFAULT_BASE_URL;
  const { sessionId } = managedSession.session;

  const response = await fetch(`${baseUrl}/v1/sessions/${sessionId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2024-01-01",
    },
    body: JSON.stringify({
      type: "user_message",
      content: message,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to send task to session "${sessionId}": ${response.status} ${body}`,
    );
  }
}

/**
 * Wait for a Managed Agent session to reach idle or terminated state.
 *
 * Streams SSE events and accumulates text output. Returns when the
 * agent sends `message_stop` or the timeout is reached.
 */
export async function waitForCompletion(
  managedSession: ManagedSession,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<SessionResult> {
  const start = Date.now();
  let output = "";
  let success = true;
  let error: string | undefined;

  try {
    const events = streamEvents(managedSession.session.sessionId, {
      apiKey: process.env["ANTHROPIC_API_KEY"],
      baseUrl: process.env["ANTHROPIC_BASE_URL"],
    });

    for await (const event of events) {
      if (Date.now() - start > timeoutMs) {
        error = `Session timed out after ${timeoutMs}ms`;
        success = false;
        break;
      }

      output += extractText(event);
    }
  } catch (err) {
    success = false;
    error = err instanceof Error ? err.message : String(err);
  }

  managedSession.output = output;

  return {
    output,
    success,
    error,
    durationMs: Date.now() - start,
  };
}

/**
 * Convenience: create session + send task + wait for completion.
 *
 * Returns the final text output from the agent.
 */
export async function runClaw(
  clawName: ClawName,
  task: string,
): Promise<string> {
  const session = await createClawSession(clawName, task);
  await sendTask(session, task);
  const result = await waitForCompletion(session);

  if (!result.success) {
    throw new Error(
      `Claw "${clawName}" failed: ${result.error ?? "unknown error"}`,
    );
  }

  return result.output;
}

// ---------------------------------------------------------------------------
// Local Fallback (Claude Code Subagent Path)
// ---------------------------------------------------------------------------

/**
 * Claw system prompts keyed by name — used for local subagent prompts
 * when no API key is available.
 */
const CLAW_ROLE_DESCRIPTIONS: Record<ClawName, string> = {
  "scribe-claw":
    "You are the Scribe Claw, an expert content formatter. " +
    "Convert markdown to polished EPUB/PDF/DOCX using Pandoc. " +
    "Extract front matter, inject metadata, validate output quality.",
  "media-claw":
    "You are the Media Claw, an expert visual asset creator. " +
    "Generate cover art, banners, and illustrations. " +
    "Match Arcanea design tokens: teal #00bcd4, blue #0d47a1, gold #ffd700, bg #09090b.",
  "herald-claw":
    "You are the Herald Claw, a social marketing specialist. " +
    "Draft platform-optimized social campaigns (X threads, IG captions, LinkedIn articles). " +
    "Match tone per platform. Include hashtags and scheduling recommendations.",
  "forge-claw":
    "You are the Forge Claw, an NFT and digital collectible specialist. " +
    "Generate unique on-chain artifacts from published content. " +
    "Create metadata, trait matrices, and collection manifests.",
  "scout-claw":
    "You are the Scout Claw, a market intelligence analyst. " +
    "Research comparable titles, pricing, audience segments, and distribution channels. " +
    "Provide data-backed recommendations.",
};

/**
 * Generate a structured prompt for Claude Code to execute as a subagent.
 *
 * This is the local fallback when no ANTHROPIC_API_KEY is available.
 * The returned string is designed to be passed to Claude Code's Agent tool.
 */
export function runClawLocal(
  clawName: ClawName,
  task: string,
): string {
  const roleDescription = CLAW_ROLE_DESCRIPTIONS[clawName];

  return [
    `## ${clawName} — Local Subagent Task`,
    "",
    `**Role:** ${roleDescription}`,
    "",
    "**Task:**",
    task,
    "",
    "**Constraints:**",
    "- Return structured output (JSON preferred)",
    "- Do not create files unless the task explicitly requires it",
    "- Follow Arcanea design system tokens",
    "- Be concise and actionable",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/**
 * Extract text content from an SSE event.
 */
function extractText(event: AgentEvent): string {
  if (event.type === "content_block_delta") {
    const delta = event.data["delta"] as Record<string, unknown> | undefined;
    if (delta && typeof delta["text"] === "string") {
      return delta["text"];
    }
  }
  return "";
}
