/**
 * Arcanea Publishing House — Maestro Orchestrator
 *
 * The core publish pipeline. Detects deploy mode (Managed Agents vs local),
 * runs the TASTE quality gate, then fans out to Scribe (format), Media (cover),
 * and Herald (social) claws in parallel. Distributes to specified platforms and
 * logs everything.
 *
 * Entry points:
 *   publishContent(input) — full publish pipeline
 *   publishDryRun(input)  — quality gate + preview, no side effects
 */

import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

import type { TasteResult } from "../quality/types.js";
import { GATE_PASS_THRESHOLD } from "../quality/types.js";
import type { FormatResult, TranslateResult } from "../claws/scribe/types.js";
import type { SocialDraft } from "../claws/herald/types.js";

import type {
  PublishInput,
  PublishResult,
  DryRunResult,
  DistributeResult,
  DeployMode,
  PublishLogEntry,
} from "./types.js";

import {
  detectDeployMode,
  runClaw,
  runClawLocal,
} from "./session-manager.js";

import { logPublish } from "./logging.js";
import { parseJsonResponse, buildLocalTasteResult } from "./utils.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const QUALITY_GATE_THRESHOLD = GATE_PASS_THRESHOLD; // 60

// ---------------------------------------------------------------------------
// Quality Gate
// ---------------------------------------------------------------------------

/**
 * Run the TASTE 5D quality gate on content.
 *
 * Uses the Scribe Claw (managed or local) to score the content across
 * five dimensions: Technical, Aesthetic, Canon, Impact, Uniqueness.
 */
async function runQualityGate(
  content: string,
  title: string,
  author: string,
  mode: DeployMode,
): Promise<TasteResult> {
  const task = [
    "Score this content using the TASTE 5D quality framework.",
    "Return valid JSON matching TasteResult: { technical, aesthetic, canon, impact, uniqueness, total, tier, feedback, passesGate }.",
    `Title: "${title}" by ${author}`,
    "",
    "Content (first 3000 chars):",
    content.slice(0, 3000),
  ].join("\n");

  if (mode === "managed") {
    const raw = await runClaw("scout-claw", task);
    return parseJsonResponse<TasteResult>(raw, "quality gate");
  }

  // Local fallback: return the prompt for Claude Code Agent tool
  const prompt = runClawLocal("scout-claw", task);
  return buildLocalTasteResult(prompt);
}

// ---------------------------------------------------------------------------
// Main Entry: publishContent
// ---------------------------------------------------------------------------

/**
 * Full publish pipeline.
 *
 * 1. Detect deploy mode
 * 2. Read source content
 * 3. Run quality gate — reject if score < 60
 * 4. Fan out: Scribe (format) + Media (cover) + Herald (social)
 * 5. Distribute to platforms
 * 6. Log to publish_log
 * 7. Return PublishResult
 */
export async function publishContent(
  input: PublishInput,
): Promise<PublishResult> {
  // Short-circuit to dry run if flag is set
  if (input.dryRun) {
    const dryResult = await publishDryRun(input);
    return {
      qualityScore: dryResult.qualityScore,
      publishedAt: new Date().toISOString(),
    };
  }

  const mode = detectDeployMode();
  const content = await readFile(input.sourcePath, "utf-8");
  const language = input.language ?? "en";

  // Step 1: Quality gate
  const qualityScore = await runQualityGate(
    content,
    input.title,
    input.author,
    mode,
  );

  if (qualityScore.total < QUALITY_GATE_THRESHOLD) {
    await logPublish({
      id: randomUUID(),
      title: input.title,
      author: input.author,
      sourcePath: input.sourcePath,
      qualityScore: qualityScore.total,
      qualityTier: qualityScore.tier,
      platforms: input.platforms.join(","),
      status: "failed",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      metadata: JSON.stringify({ feedback: qualityScore.feedback }),
    });

    return {
      qualityScore,
      publishedAt: new Date().toISOString(),
    };
  }

  // Step 2: Fan out — Scribe + Media + Herald in parallel
  const [formatResult, coverImage, socialDrafts] = await Promise.all([
    runFormatPipeline(content, input, mode),
    runCoverPipeline(input, mode),
    runSocialPipeline(content, input, mode),
  ]);

  // Step 3: Translate if requested
  let translationResults: TranslateResult[] | undefined;
  if (input.translateTo?.length) {
    translationResults = await runTranslationPipeline(
      content,
      language,
      input.translateTo,
      mode,
    );
  }

  // Step 4: Distribute to platforms
  const distributeResults = await runDistribution(input, formatResult, mode);

  // Step 5: Log
  const publishedAt = new Date().toISOString();
  const allSucceeded = distributeResults.every((r) => r.status !== "failed");

  await logPublish({
    id: randomUUID(),
    title: input.title,
    author: input.author,
    sourcePath: input.sourcePath,
    qualityScore: qualityScore.total,
    qualityTier: qualityScore.tier,
    platforms: input.platforms.join(","),
    status: allSucceeded ? "success" : "partial",
    publishedAt,
    createdAt: publishedAt,
    metadata: JSON.stringify({
      coverImage,
      translateTo: input.translateTo,
    }),
  });

  return {
    qualityScore,
    formatResult,
    distributeResults,
    socialDrafts,
    translationResults,
    publishedAt,
  };
}

// ---------------------------------------------------------------------------
// Dry Run
// ---------------------------------------------------------------------------

/**
 * Runs quality gate + previews what would happen, without side effects.
 */
export async function publishDryRun(
  input: PublishInput,
): Promise<DryRunResult> {
  const mode = detectDeployMode();
  const content = await readFile(input.sourcePath, "utf-8");

  const qualityScore = await runQualityGate(
    content,
    input.title,
    input.author,
    mode,
  );

  const wouldPublish = qualityScore.total >= QUALITY_GATE_THRESHOLD;
  const plannedSteps: string[] = ["quality-gate"];

  if (wouldPublish) {
    plannedSteps.push("format (Scribe Claw)");
    if (!input.coverImage) {
      plannedSteps.push("cover-generation (Media Claw)");
    }
    plannedSteps.push("social-campaign (Herald Claw)");
    for (const platform of input.platforms) {
      plannedSteps.push(`distribute:${platform}`);
    }
    if (input.translateTo?.length) {
      for (const lang of input.translateTo) {
        plannedSteps.push(`translate:${lang}`);
      }
    }
    plannedSteps.push("log-to-publish-log");
  }

  await logPublish({
    id: randomUUID(),
    title: input.title,
    author: input.author,
    sourcePath: input.sourcePath,
    qualityScore: qualityScore.total,
    qualityTier: qualityScore.tier,
    platforms: input.platforms.join(","),
    status: "dry-run",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  return {
    qualityScore,
    wouldPublish,
    targetPlatforms: input.platforms,
    targetLanguages: input.translateTo ?? [],
    plannedSteps,
  };
}

// ---------------------------------------------------------------------------
// Pipeline Stages
// ---------------------------------------------------------------------------

async function runFormatPipeline(
  content: string,
  input: PublishInput,
  mode: DeployMode,
): Promise<FormatResult | undefined> {
  const task = [
    "Format this markdown content into EPUB, PDF, DOCX, and HTML.",
    `Title: "${input.title}" by ${input.author}`,
    `Language: ${input.language ?? "en"}`,
    input.coverImage ? `Cover: ${input.coverImage}` : "No cover provided.",
    "",
    "Content (first 5000 chars):",
    content.slice(0, 5000),
  ].join("\n");

  if (mode === "managed") {
    const raw = await runClaw("scribe-claw", task);
    return parseJsonResponse<FormatResult>(raw, "format pipeline");
  }

  // Local mode: return placeholder paths — actual formatting handled by caller
  const prompt = runClawLocal("scribe-claw", task);
  void prompt; // logged but not executed in this context
  return undefined;
}

async function runCoverPipeline(
  input: PublishInput,
  mode: DeployMode,
): Promise<string | undefined> {
  if (input.coverImage) return input.coverImage;

  const task = [
    "Generate a cover image concept for this publication.",
    `Title: "${input.title}" by ${input.author}`,
    input.collection ? `Collection: ${input.collection}` : "",
    "",
    "Return JSON: { imagePath: string, prompt: string, style: string }",
  ]
    .filter(Boolean)
    .join("\n");

  if (mode === "managed") {
    const raw = await runClaw("media-claw", task);
    const parsed = parseJsonResponse<{ imagePath: string }>(raw, "cover pipeline");
    return parsed.imagePath;
  }

  // Local: generate prompt but no actual image
  void runClawLocal("media-claw", task);
  return undefined;
}

async function runSocialPipeline(
  content: string,
  input: PublishInput,
  mode: DeployMode,
): Promise<SocialDraft[] | undefined> {
  const task = [
    "Draft a social media campaign for this publication.",
    `Title: "${input.title}" by ${input.author}`,
    `Platforms: X (thread), Instagram, LinkedIn`,
    input.collection ? `Collection: ${input.collection}` : "",
    "",
    "Summary (first 1500 chars):",
    content.slice(0, 1500),
    "",
    "Return JSON array of SocialDraft objects: [{ platform, posts, hashtags, suggestedImages }]",
  ]
    .filter(Boolean)
    .join("\n");

  if (mode === "managed") {
    const raw = await runClaw("herald-claw", task);
    return parseJsonResponse<SocialDraft[]>(raw, "social pipeline");
  }

  void runClawLocal("herald-claw", task);
  return undefined;
}

async function runTranslationPipeline(
  content: string,
  sourceLang: string,
  targetLangs: string[],
  mode: DeployMode,
): Promise<TranslateResult[]> {
  const results: TranslateResult[] = [];

  for (const targetLang of targetLangs) {
    const task = [
      `Translate this content from ${sourceLang} to ${targetLang}.`,
      "Preserve all markdown formatting, front matter, and code blocks.",
      "Return JSON: { translatedText, sourceLang, targetLang, provider, wordCount, chunkCount }",
      "",
      "Content (first 5000 chars):",
      content.slice(0, 5000),
    ].join("\n");

    if (mode === "managed") {
      const raw = await runClaw("scribe-claw", task);
      const parsed = parseJsonResponse<TranslateResult>(raw, `translate:${targetLang}`);
      results.push(parsed);
    }
    // Local mode: translations require the managed API
  }

  return results;
}

async function runDistribution(
  input: PublishInput,
  formatResult: FormatResult | undefined,
  mode: DeployMode,
): Promise<DistributeResult[]> {
  const results: DistributeResult[] = [];

  for (const platform of input.platforms) {
    const task = [
      `Distribute "${input.title}" to ${platform}.`,
      `Author: ${input.author}`,
      formatResult?.epub ? `EPUB: ${formatResult.epub}` : "",
      formatResult?.pdf ? `PDF: ${formatResult.pdf}` : "",
      input.coverImage ? `Cover: ${input.coverImage}` : "",
      "",
      "Return JSON: { platform, status, url?, error? }",
    ]
      .filter(Boolean)
      .join("\n");

    if (mode === "managed") {
      try {
        const raw = await runClaw("scribe-claw", task);
        const parsed = parseJsonResponse<DistributeResult>(raw, `distribute:${platform}`);
        results.push(parsed);
      } catch (err) {
        results.push({
          platform,
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    } else {
      // Local mode: mark as submitted (actual distribution deferred)
      results.push({
        platform,
        status: "submitted",
      });
    }
  }

  return results;
}

// Logging, JSON parsing, and local-mode helpers are imported from
// ./logging.js and ./utils.js to keep this file focused on pipeline flow.
