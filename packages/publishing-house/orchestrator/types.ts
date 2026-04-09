/**
 * Arcanea Publishing House — Orchestrator Types
 *
 * All types for the Maestro publish orchestrator, session management,
 * and the dual deploy model (Managed Agents vs local Claude Code).
 */

import type { TasteResult } from "../quality/types.js";
import type { FormatResult, TranslateResult, Platform } from "../claws/scribe/types.js";
import type { SocialDraft } from "../claws/herald/types.js";
import type { ClawName, Session } from "../agents/types.js";

export type { TasteResult, FormatResult, TranslateResult, Platform, SocialDraft, ClawName };

// ---------------------------------------------------------------------------
// Deploy Mode
// ---------------------------------------------------------------------------

export type DeployMode = "managed" | "local";

// ---------------------------------------------------------------------------
// Publish Input / Output
// ---------------------------------------------------------------------------

export interface PublishInput {
  /** Path to the source markdown file */
  sourcePath: string;
  /** Content title */
  title: string;
  /** Author name */
  author: string;
  /** Arcanea collection this content belongs to */
  collection?: string;
  /** Source language (ISO 639-1, default "en") */
  language?: string;
  /** Target distribution platforms */
  platforms: Platform[];
  /** Optional cover image path — if absent, Media Claw generates one */
  coverImage?: string;
  /** ISO 639-1 language codes to translate into */
  translateTo?: string[];
  /** When true, runs quality gate only and shows what would happen */
  dryRun?: boolean;
}

export interface PublishResult {
  /** Quality gate scores */
  qualityScore: TasteResult;
  /** Formatted output paths (EPUB, PDF, DOCX, HTML) */
  formatResult?: FormatResult;
  /** Per-platform distribution statuses */
  distributeResults?: DistributeResult[];
  /** Social campaign drafts from Herald Claw */
  socialDrafts?: SocialDraft[];
  /** Translation outputs per target language */
  translationResults?: TranslateResult[];
  /** ISO timestamp of publish completion */
  publishedAt: string;
}

export interface DryRunResult {
  /** Quality gate scores */
  qualityScore: TasteResult;
  /** Whether the content would pass the gate */
  wouldPublish: boolean;
  /** Platforms that would receive the content */
  targetPlatforms: Platform[];
  /** Languages that would be translated */
  targetLanguages: string[];
  /** Steps that would execute */
  plannedSteps: string[];
}

export interface DistributeResult {
  platform: Platform;
  status: "submitted" | "live" | "failed";
  url?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Session Manager Types
// ---------------------------------------------------------------------------

export interface ManagedSession {
  /** Underlying API session (or synthetic for local mode) */
  session: Session;
  /** Deploy mode this session runs under */
  mode: DeployMode;
  /** Accumulated output text from the session */
  output: string;
}

export interface SessionResult {
  /** Final output text from the agent */
  output: string;
  /** Whether the session completed successfully */
  success: boolean;
  /** Error message if the session failed */
  error?: string;
  /** Duration in milliseconds */
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Publish Log Entry (persisted to SQLite or Supabase)
// ---------------------------------------------------------------------------

export interface PublishLogEntry {
  id: string;
  title: string;
  author: string;
  sourcePath: string;
  qualityScore: number;
  qualityTier: string;
  platforms: string;
  status: "success" | "partial" | "failed" | "dry-run";
  publishedAt: string;
  createdAt: string;
  metadata?: string;
}
