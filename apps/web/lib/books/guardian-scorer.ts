/**
 * Guardian Scorer — runs the 5 Guardian prompts against a book and
 * persists the results to the `guardian_reviews` table.
 *
 * Data flow:
 *   1. Load book metadata from Supabase (books + book_chapters).
 *   2. Load full chapter content from filesystem (book/{slug}/chapters/*.md)
 *      — git is the source of truth for prose.
 *   3. Run all 5 Guardians in parallel via Vercel AI SDK + Anthropic.
 *   4. Parse JSON verdicts (with graceful fallback on parse error).
 *   5. Upsert into guardian_reviews via admin client.
 *   6. Return a GuardianReport (the trigger on the DB also updates
 *      books.guardian_score).
 *
 * Uses the AI SDK's `generateText` + `createAnthropic` pattern, which is
 * the established convention across apps/web. Model defaults to
 * claude-opus-4-6, overridable via GUARDIAN_REVIEW_MODEL env var.
 */

import { readFile, readdir } from 'fs/promises';
import { access } from 'fs/promises';
import { join } from 'path';
import { generateText } from 'ai';
import matter from 'gray-matter';
import { createAdminClient } from '@/lib/supabase/server';
import {
  GUARDIANS,
  GUARDIAN_IDS,
  PROMPT_VERSION,
  getGuardianPrompt,
  type BookInput,
  type GuardianDimension,
  type GuardianId,
  type GuardianPrompt,
  type BookTier,
} from './guardian-prompts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GuardianScore {
  guardian: GuardianId;
  dimension: GuardianDimension;
  score: number;
  assessment: string;
  detailedNotes: string;
  modelId: string;
  durationMs: number;
}

export type Grade = 'luminor' | 'master' | 'apprentice' | 'none';

export interface GuardianReport {
  bookSlug: string;
  bookId: string;
  scores: GuardianScore[];
  composite: number;
  grade: Grade;
  assessedAt: string;
  promptVersion: string;
}

export class GuardianScorerError extends Error {
  constructor(
    message: string,
    public code:
      | 'book_not_found'
      | 'no_chapters'
      | 'missing_api_key'
      | 'llm_failed'
      | 'db_write_failed'
      | 'parse_failed',
  ) {
    super(message);
    this.name = 'GuardianScorerError';
  }
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DEFAULT_MODEL = 'claude-opus-4-6';
const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');
const MAX_OUTPUT_TOKENS = 1024;

function getModelId(): string {
  return process.env.GUARDIAN_REVIEW_MODEL || DEFAULT_MODEL;
}

// ---------------------------------------------------------------------------
// Grade calculation
// ---------------------------------------------------------------------------

export function gradeFromComposite(composite: number): Grade {
  if (composite >= 8.0) return 'luminor';
  if (composite >= 6.0) return 'master';
  if (composite >= 4.0) return 'apprentice';
  return 'none';
}

// ---------------------------------------------------------------------------
// Filesystem loaders
// ---------------------------------------------------------------------------

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function extractChapterTitle(content: string, filename: string): string {
  const chapterHeading = content.match(/^##\s+(?:Chapter\s+\w+:\s+)?(.+)$/m);
  if (chapterHeading) return chapterHeading[1].trim();
  const prologueHeading = content.match(/^##\s+Prologue:\s*(.+)$/m);
  if (prologueHeading) return `Prologue: ${prologueHeading[1].trim()}`;
  return filename
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Load full chapter bodies from the filesystem. Git is the source of truth
 * for prose; the DB just holds the index.
 */
async function loadChaptersFromFS(
  slug: string,
): Promise<{ title: string; content: string }[]> {
  const chaptersDir = join(BOOK_ROOT, slug, 'chapters');
  if (!(await fileExists(chaptersDir))) return [];

  const files = (await readdir(chaptersDir))
    .filter((f) => f.endsWith('.md'))
    .sort();

  const out: { title: string; content: string }[] = [];
  for (const file of files) {
    try {
      const raw = await readFile(join(chaptersDir, file), 'utf-8');
      // strip frontmatter if present
      const { content } = matter(raw);
      const title = extractChapterTitle(content || raw, file);
      out.push({ title, content: (content || raw).trim() });
    } catch (err) {
      console.warn(`[guardian-scorer] failed to read ${file}:`, err);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Book loader
// ---------------------------------------------------------------------------

interface BookRow {
  id: string;
  slug: string;
  title: string;
  tier: BookTier;
  genre: string | null;
  tags: string[] | null;
  acknowledgments: string | null;
}

async function loadBook(
  bookSlug: string,
): Promise<{ row: BookRow; input: BookInput }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;
  const { data, error } = await admin
    .from('books')
    .select('id, slug, title, tier, genre, tags, acknowledgments')
    .eq('slug', bookSlug)
    .maybeSingle();

  if (error || !data) {
    throw new GuardianScorerError(
      `Book '${bookSlug}' not found`,
      'book_not_found',
    );
  }

  const row = data as BookRow;
  const chapters = await loadChaptersFromFS(bookSlug);
  if (chapters.length === 0) {
    throw new GuardianScorerError(
      `No chapters found for '${bookSlug}' (expected at book/${bookSlug}/chapters/*.md)`,
      'no_chapters',
    );
  }

  const input: BookInput = {
    title: row.title,
    tier: row.tier,
    genre: row.genre ?? 'fiction',
    tags: row.tags ?? [],
    chapters,
    acknowledgments: row.acknowledgments ?? undefined,
  };

  return { row, input };
}

// ---------------------------------------------------------------------------
// LLM call + parse
// ---------------------------------------------------------------------------

/**
 * Extract the first JSON object from a model response. Claude sometimes
 * wraps JSON in code fences despite instructions to the contrary — we
 * tolerate both.
 */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim();

  // 1. Try as-is
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  // 2. Strip markdown code fences
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1]);
    } catch {
      // fall through
    }
  }

  // 3. Find the first {...} span
  const objMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch {
      // fall through
    }
  }

  throw new GuardianScorerError(
    `Failed to extract JSON from response: ${trimmed.slice(0, 200)}`,
    'parse_failed',
  );
}

interface RawVerdict {
  score?: unknown;
  assessment?: unknown;
  detailed_notes?: unknown;
}

function validateVerdict(parsed: unknown): {
  score: number;
  assessment: string;
  detailedNotes: string;
} {
  if (!parsed || typeof parsed !== 'object') {
    throw new GuardianScorerError(
      'Verdict is not an object',
      'parse_failed',
    );
  }
  const v = parsed as RawVerdict;

  const rawScore =
    typeof v.score === 'string' ? Number(v.score) : (v.score as number);
  if (typeof rawScore !== 'number' || !Number.isFinite(rawScore)) {
    throw new GuardianScorerError(
      'Verdict score is not a number',
      'parse_failed',
    );
  }
  const score = Math.min(10, Math.max(0, Math.round(rawScore * 10) / 10));

  const assessment =
    typeof v.assessment === 'string' && v.assessment.trim().length > 0
      ? v.assessment.trim()
      : 'No assessment returned.';
  const detailedNotes =
    typeof v.detailed_notes === 'string' && v.detailed_notes.trim().length > 0
      ? v.detailed_notes.trim()
      : 'No detailed notes returned.';

  return { score, assessment, detailedNotes };
}

async function runGuardian(
  prompt: GuardianPrompt,
  input: BookInput,
): Promise<GuardianScore> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new GuardianScorerError(
      'ANTHROPIC_API_KEY not set — cannot run Guardian review',
      'missing_api_key',
    );
  }

  const modelId = getModelId();
  const { createAnthropic } = await import('@ai-sdk/anthropic');
  const anthropic = createAnthropic({ apiKey });
  const model = anthropic(modelId);

  const start = Date.now();
  try {
    const { text } = await generateText({
      model,
      system: prompt.systemPrompt,
      prompt: prompt.userPromptTemplate(input),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      temperature: 0.3,
    });
    const durationMs = Date.now() - start;

    let parsed: unknown;
    try {
      parsed = extractJson(text);
    } catch (err) {
      // Graceful fallback: return a low-confidence verdict with the raw text
      console.warn(
        `[guardian-scorer] parse failed for ${prompt.guardian}:`,
        err,
      );
      return {
        guardian: prompt.guardian,
        dimension: prompt.dimension,
        score: 5.0,
        assessment: `${prompt.displayName} could not return a structured verdict.`,
        detailedNotes: `Parse error. Raw output begins: ${text.slice(0, 400)}`,
        modelId,
        durationMs,
      };
    }

    const { score, assessment, detailedNotes } = validateVerdict(parsed);
    return {
      guardian: prompt.guardian,
      dimension: prompt.dimension,
      score,
      assessment,
      detailedNotes,
      modelId,
      durationMs,
    };
  } catch (err) {
    if (err instanceof GuardianScorerError) throw err;
    throw new GuardianScorerError(
      `${prompt.displayName} failed: ${err instanceof Error ? err.message : String(err)}`,
      'llm_failed',
    );
  }
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

async function persistScores(
  bookId: string,
  scores: GuardianScore[],
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;
  const now = new Date().toISOString();

  const rows = scores.map((s) => ({
    book_id: bookId,
    guardian: s.guardian,
    dimension: s.dimension,
    score: s.score,
    assessment: s.assessment,
    detailed_notes: s.detailedNotes,
    model_id: s.modelId,
    prompt_version: PROMPT_VERSION,
    assessed_at: now,
  }));

  const { error } = await admin
    .from('guardian_reviews')
    .upsert(rows, { onConflict: 'book_id,guardian,dimension' });

  if (error) {
    throw new GuardianScorerError(
      `Failed to persist Guardian reviews: ${error.message}`,
      'db_write_failed',
    );
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Run all 5 Guardians against a book and persist the scores.
 */
export async function scoreBook(bookSlug: string): Promise<GuardianReport> {
  const { row, input } = await loadBook(bookSlug);

  // Run all 5 Guardians in parallel.
  const settled = await Promise.allSettled(
    GUARDIANS.map((g) => runGuardian(g, input)),
  );

  const scores: GuardianScore[] = [];
  const errors: string[] = [];
  for (let i = 0; i < settled.length; i++) {
    const r = settled[i];
    if (r.status === 'fulfilled') {
      scores.push(r.value);
    } else {
      const guardian = GUARDIANS[i].guardian;
      const reason = r.reason instanceof Error ? r.reason.message : String(r.reason);
      errors.push(`${guardian}: ${reason}`);
      console.error(`[guardian-scorer] ${guardian} failed:`, reason);
    }
  }

  if (scores.length === 0) {
    throw new GuardianScorerError(
      `All Guardians failed. Errors: ${errors.join('; ')}`,
      'llm_failed',
    );
  }

  // Persist whatever succeeded
  await persistScores(row.id, scores);

  const composite =
    Math.round(
      (scores.reduce((acc, s) => acc + s.score, 0) / scores.length) * 10,
    ) / 10;

  return {
    bookSlug,
    bookId: row.id,
    scores,
    composite,
    grade: gradeFromComposite(composite),
    assessedAt: new Date().toISOString(),
    promptVersion: PROMPT_VERSION,
  };
}

/**
 * Run a single Guardian dimension — useful for incremental re-scoring
 * or debugging a specific Guardian's prompt.
 */
export async function scoreSingleDimension(
  bookSlug: string,
  guardian: GuardianId,
): Promise<GuardianScore> {
  const { row, input } = await loadBook(bookSlug);
  const prompt = getGuardianPrompt(guardian);
  const score = await runGuardian(prompt, input);
  await persistScores(row.id, [score]);
  return score;
}

/**
 * Load the most recent Guardian report for a book, without running new
 * scoring. Returns null if the book exists but has no reviews yet.
 */
export async function loadLatestReport(
  bookSlug: string,
): Promise<GuardianReport | null> {
  const admin = createAdminClient();

  const { data: book, error: bookErr } = await admin
    .from('books')
    .select('id, slug')
    .eq('slug', bookSlug)
    .maybeSingle();
  if (bookErr || !book) return null;

  const { data: reviews, error: revErr } = await admin
    .from('guardian_reviews')
    .select(
      'guardian, dimension, score, assessment, detailed_notes, model_id, assessed_at',
    )
    .eq('book_id', book.id)
    .order('assessed_at', { ascending: false });
  if (revErr || !reviews || reviews.length === 0) return null;

  // Keep only the newest row per (guardian, dimension)
  const seen = new Set<string>();
  const latest: typeof reviews = [];
  for (const r of reviews) {
    const key = `${r.guardian}:${r.dimension}`;
    if (seen.has(key)) continue;
    seen.add(key);
    latest.push(r);
  }

  const scores: GuardianScore[] = latest.map((r) => ({
    guardian: r.guardian as GuardianId,
    dimension: r.dimension as GuardianDimension,
    score: Number(r.score),
    assessment: r.assessment ?? '',
    detailedNotes: r.detailed_notes ?? '',
    modelId: r.model_id ?? 'unknown',
    durationMs: 0,
  }));

  // Sort by canonical Guardian order for stable presentation
  scores.sort(
    (a, b) =>
      GUARDIAN_IDS.indexOf(a.guardian) - GUARDIAN_IDS.indexOf(b.guardian),
  );

  const composite =
    Math.round(
      (scores.reduce((acc, s) => acc + s.score, 0) / scores.length) * 10,
    ) / 10;

  return {
    bookSlug,
    bookId: book.id,
    scores,
    composite,
    grade: gradeFromComposite(composite),
    assessedAt: latest[0].assessed_at,
    promptVersion: PROMPT_VERSION,
  };
}
