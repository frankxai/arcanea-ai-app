/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Author Companion Chat API Route
 *
 * Streams AI responses with deep book context — character sheets,
 * world bible, story blueprint, and current chapter content.
 * Uses Vercel AI SDK streaming (same patterns as /api/ai/chat).
 */

import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { z } from "zod";
import { readFile, access, realpath } from "fs/promises";
import { join, resolve, sep } from "path";
import yaml from "js-yaml";
import {
  getClientIdentifier,
  checkRateLimit,
} from "@/lib/rate-limit/rate-limiter";
import { getBookRoot } from "@/lib/content/book-path";
import { createClient } from "@/lib/supabase/server";
import { isBookPublic } from "@/lib/content/book-visibility";
import {
  readBookContextFile,
  listBookContextFiles,
} from "@/lib/author/book-files";
import {
  extractCustomerKeys,
  validateCustomerKey,
} from "@/lib/gateway/credential-policy.mjs";

export const runtime = "nodejs";
export const maxDuration = 60;
const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, no-transform",
  "X-Accel-Buffering": "no",
};
function refusal(status: number, message: string, cta = "retry") {
  return NextResponse.json(
    { error: message, cta },
    { status, headers: PRIVATE_HEADERS },
  );
}

const BOOK_ROOT = getBookRoot();

const AUTHOR_RATE_LIMIT = { maxRequests: 20, windowMs: 60_000 }; // 20 req/min

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

// Book directories are lowercase slugs. Anything else (`..`, slashes, absolute
// paths) would let a request read files outside BOOK_ROOT into the prompt.
const BOOK_SLUG = /^[a-z0-9][a-z0-9-]{0,99}$/;

function isBookSlug(value: unknown): value is string {
  return typeof value === "string" && BOOK_SLUG.test(value);
}

interface BookManifest {
  curated_context?: {
    characters?: boolean;
    worldbuilding?: boolean;
    outline?: boolean;
    canon?: boolean;
  };
}

async function loadBookManifest(bookSlug: string): Promise<BookManifest> {
  const yamlPath = join(BOOK_ROOT, bookSlug, "book.yaml");
  try {
    const raw = await readBookContextFile(BOOK_ROOT, yamlPath);
    return (yaml.load(raw) as BookManifest) ?? {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

async function contextFiles(directory: string) {
  try {
    return await listBookContextFiles(BOOK_ROOT, directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function loadBookContext(
  bookSlug: string,
  currentChapter?: string,
  editorText?: string,
): Promise<string> {
  const bookDir = join(BOOK_ROOT, bookSlug);
  const parts: string[] = [];

  // Load book manifest for curated context flags
  const manifest = await loadBookManifest(bookSlug);
  const curated = manifest.curated_context ?? {};

  // Load CANON (trusted, human-curated) — always loaded regardless of flags
  const canonPath = join(
    process.cwd(),
    "..",
    "..",
    ".arcanea",
    "lore",
    "CANON_LOCKED.md",
  );
  if (await exists(canonPath)) {
    const content = await readFile(canonPath, "utf-8");
    parts.push(`## CANON (Trusted — Human-Curated)\n${content.slice(0, 3000)}`);
  }

  // Load current chapter (the actual text being edited — always relevant)
  if (editorText !== undefined) {
    parts.push(
      `## Current editor draft (private working text, not canon)\n${editorText}`,
    );
  } else if (currentChapter) {
    const chaptersDir = join(bookDir, "chapters");
    {
      const files = await contextFiles(chaptersDir);
      const match = files.find(
        (f) => f.replace(/\.md$/, "") === currentChapter,
      );
      if (match) {
        const content = await readBookContextFile(
          BOOK_ROOT,
          join(chaptersDir, match),
        );
        parts.push(
          `## Published chapter excerpt (not the current editor draft)\n${content.slice(0, 8000)}`,
        );
      }
    }
  }

  // Load outline — default behavior is to load as DRAFT unless explicitly disabled
  if (curated.outline !== false) {
    const outlineDir = join(bookDir, "outline");
    {
      const files = await contextFiles(outlineDir);
      for (const f of files.filter((f) => f.endsWith(".md")).slice(0, 1)) {
        const content = await readBookContextFile(
          BOOK_ROOT,
          join(outlineDir, f),
        );
        parts.push(
          `## Story Blueprint (DRAFT — author's working notes, not yet reviewed)\n${content.slice(0, 3000)}`,
        );
      }
    }
  }

  // Load character sheets only if curated by the author
  if (curated.characters) {
    const charsDir = join(bookDir, "characters");
    {
      const files = await contextFiles(charsDir);
      const mdFiles = files.filter((f) => f.endsWith(".md")).slice(0, 5);
      for (const f of mdFiles) {
        const content = await readBookContextFile(BOOK_ROOT, join(charsDir, f));
        parts.push(
          `## Character Sheet — CURATED (${f.replace(/\.md$/, "")})\n${content.slice(0, 2000)}`,
        );
      }
    }
  }

  // Load worldbuilding only if curated by the author
  if (curated.worldbuilding) {
    const worldDir = join(bookDir, "worldbuilding");
    {
      const files = await contextFiles(worldDir);
      const mdFiles = files.filter((f) => f.endsWith(".md")).slice(0, 3);
      for (const f of mdFiles) {
        const content = await readBookContextFile(BOOK_ROOT, join(worldDir, f));
        parts.push(
          `## World Bible — CURATED (${f.replace(/\.md$/, "")})\n${content.slice(0, 3000)}`,
        );
      }
    }
  }

  return parts.join("\n\n---\n\n");
}

const AUTHOR_SYSTEM_PROMPT = `You are the Arcanea Author Companion — an AI writing assistant with deep knowledge of this specific book's world, characters, and story arc.

## Voice Standards
- Elevated but accessible — mythic but practical
- Active voice, concrete imagery, earned emotion
- NO AI verbal tics: no "delve", "tapestry", "nestled", "myriad", "beacon", "it's worth noting"
- Each paragraph earns its place
- Let silence and whitespace do work

## Your Capabilities
- Scene and chapter feedback (pacing, tension, character voice)
- Continuity checking against previous chapters and character sheets
- Suggesting what happens next based on the story blueprint
- Prose improvement (line-level editing suggestions)
- Character voice consistency checking
- World-building consistency with the world bible
- **Quality scoring via the score_draft tool** — when the author asks for a heuristic quality checklist of the current chapter, call score_draft with the chapter text. Returns the 5D TASTE breakdown (Technical, Aesthetic, Story/Canon, Transformative Impact, Experiential Uniqueness) plus a tier (hero/gallery/thumbnail/reject) and gate-pass status (≥60). Quote the lowest-scoring dimensions and use the feedback array to suggest targeted fixes.

## Context Trust
- CANON sections are human-curated truth — treat as authoritative
- DRAFT sections are working notes that may change — reference them but flag uncertainty
- Say "based on your draft outline" not "according to the story" when citing draft material
- The current chapter text is what the author is actively editing — focus feedback here
- Character sheets and world bible are NOT loaded until the author curates them
- If asked about characters or world details not in your context, say honestly that those notes haven't been reviewed yet

## Rules
- When suggesting prose changes, show the original and your revision
- Be specific: "An's voice feels too formal here — she's brisk and self-mocking" not "the dialogue could be improved"
- If asked about something not in your context, say so honestly

## Book Context
`;

interface AuthorChatMessage {
  role: "user" | "assistant" | "system";
  content?: string;
  parts?: Array<{ type: string; text?: string }>;
}

function extractMessageText(message: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}): string {
  if (Array.isArray(message.parts)) {
    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("");
    if (text) return text;
  }
  return typeof message.content === "string" ? message.content : "";
}

export async function POST(req: NextRequest) {
  let headerKey: string | undefined;
  try {
    headerKey = extractCustomerKeys(req.headers).anthropic;
  } catch {
    return refusal(
      400,
      "Your provider credential settings are invalid.",
      "byok",
    );
  }
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return headerKey
      ? refusal(400, "Author request is invalid.")
      : refusal(
          401,
          "Connect your Anthropic key in Settings → Providers.",
          "byok",
        );
  }
  let effectiveApiKey: string;
  try {
    const key = headerKey || body.userApiKey;
    if (!key)
      return refusal(
        401,
        "Connect your Anthropic key in Settings → Providers.",
        "byok",
      );
    effectiveApiKey = validateCustomerKey(key);
  } catch {
    return refusal(
      400,
      "Your Anthropic credential settings are invalid.",
      "byok",
    );
  }
  const {
    bookSlug,
    currentChapter,
    editorText,
    model: requestedModel,
    messages,
  } = body;
  if (
    (bookSlug !== undefined && !isBookSlug(bookSlug)) ||
    (currentChapter !== undefined && !isBookSlug(currentChapter)) ||
    (currentChapter !== undefined && bookSlug === undefined) ||
    (editorText !== undefined &&
      (typeof editorText !== "string" || editorText.length > 32000)) ||
    (requestedModel !== undefined &&
      !["haiku", "sonnet", "opus"].includes(String(requestedModel))) ||
    !Array.isArray(messages) ||
    !messages.length ||
    messages.length > 40
  ) {
    return refusal(
      400,
      "Choose a supported model and send up to 40 messages and a chapter draft of at most 32,000 characters.",
    );
  }
  const normalizedMessages: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];
  let total = typeof editorText === "string" ? editorText.length : 0;
  for (const msg of messages) {
    if (
      !msg ||
      typeof msg !== "object" ||
      !["user", "assistant"].includes(msg.role) ||
      (msg.parts !== undefined &&
        (!Array.isArray(msg.parts) ||
          msg.parts.some(
            (p: unknown) =>
              !p ||
              typeof p !== "object" ||
              !("type" in p) ||
              p.type !== "text" ||
              !("text" in p) ||
              typeof p.text !== "string",
          )))
    ) {
      return refusal(400, "Send text messages with user or assistant roles.");
    }
    const text = extractMessageText(msg);
    total += text.length;
    if (!text.trim() || total > 64000)
      return refusal(
        400,
        "Author context is empty or exceeds 64,000 characters.",
      );
    normalizedMessages.push({ role: msg.role, content: text });
  }
  const limit = checkRateLimit(
    `author:${getClientIdentifier(req)}`,
    AUTHOR_RATE_LIMIT,
  );
  if (!limit.allowed) {
    const response = refusal(
      429,
      "Too many author requests. Try again in a minute.",
    );
    response.headers.set("Retry-After", "60");
    return response;
  }
  if (req.signal.aborted) return refusal(408, "Author request was stopped.");
  try {
    let publicBook = true;
    if (typeof bookSlug === "string") {
      const root = await realpath(BOOK_ROOT);
      const lexicalRoot = resolve(BOOK_ROOT);
      const lexicalDirectory = resolve(BOOK_ROOT, bookSlug);
      if (!lexicalDirectory.startsWith(lexicalRoot + sep))
        return refusal(403, "This book is outside the content workspace.");
      const directory = await realpath(lexicalDirectory);
      if (!directory.startsWith(root + sep))
        return refusal(403, "This book is outside the content workspace.");
      publicBook = await isBookPublic(directory);
    }
    if (!publicBook) {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user)
        return refusal(401, "Sign in to access this private book.");
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("id")
        .eq("slug", bookSlug)
        .maybeSingle();
      if (bookError)
        return refusal(503, "Book access could not be verified. Try again.");
      if (!book)
        return refusal(
          403,
          "Private book access must be registered before requesting feedback.",
        );
      const { data: author, error: authorError } = await supabase
        .from("book_authors")
        .select("role")
        .eq("book_id", book.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (authorError)
        return refusal(503, "Book access could not be verified. Try again.");
      if (!author) return refusal(403, "This book is private to its authors.");
    }
    const bookContext =
      typeof bookSlug === "string"
        ? await loadBookContext(
            bookSlug,
            currentChapter as string | undefined,
            editorText as string | undefined,
          )
        : typeof editorText === "string"
          ? `## Current editor draft (private working text)\n${editorText}`
          : "";
    const anthropic = createAnthropic({ apiKey: effectiveApiKey });
    const modelId =
      requestedModel === "opus"
        ? "claude-opus-4-6"
        : requestedModel === "sonnet"
          ? "claude-sonnet-4-6"
          : "claude-haiku-4-5-20251001";
    // --- Tools ---
    const tools = {
      score_draft: tool({
        description:
          "Run the deterministic TASTE heuristic checklist on a chapter draft. This is not an objective editorial assessment or publication approval. Returns Technical, Aesthetic, Story/Canon, Impact, and Uniqueness scores (0-100 each), composite total, tier (hero ≥80 / gallery ≥60 / thumbnail ≥40 / reject), passesGate flag (≥60), and per-dimension feedback. Use this when the author asks for the heuristic checklist; distinguish its estimates from your editorial judgment.",
        inputSchema: z.object({
          content: z
            .string()
            .min(50, "Need at least 50 characters of draft text to score")
            .describe("The chapter draft text to score (markdown allowed)."),
          title: z
            .string()
            .optional()
            .describe(
              "Chapter or piece title. Defaults to the current chapter slug.",
            ),
        }),
        execute: async ({ content, title }) => {
          const { scoreTASTE } =
            await import("@arcanea/publishing-house/quality/taste-gate");
          const result = await scoreTASTE({
            content,
            metadata: {
              title: title || currentChapter || "Untitled draft",
              author: "Arcanea Author",
              language: "en",
              wordCount: content.split(/\s+/).filter(Boolean).length,
            },
          });
          return result;
        },
      }),
    };

    // --- Stream response ---
    const result = streamText({
      model: anthropic(modelId),
      system: AUTHOR_SYSTEM_PROMPT + bookContext,
      messages: normalizedMessages,
      temperature: 0.7,
      maxOutputTokens: 8192,
      tools,
      maxRetries: 0,
      abortSignal: req.signal,
      timeout: 50_000,
      onError: () => {
        console.error("[author-chat] provider request failed");
      },
    });

    return result.toUIMessageStreamResponse({
      onError: () =>
        "Author provider request failed. Your chapter is unchanged; retry or check Settings → Providers.",
      headers: {
        ...PRIVATE_HEADERS,
        "x-arcanea-service": "author-companion",
        "x-arcanea-book": bookSlug || "",
        "x-arcanea-model": modelId,
      },
    });
  } catch {
    return refusal(
      req.signal.aborted ? 408 : 502,
      req.signal.aborted
        ? "Author request was stopped."
        : "Author request failed. Your chapter is unchanged; retry or check Settings → Providers.",
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { service: "arcanea-author-companion", credentialMode: "customer-byok" },
    { headers: PRIVATE_HEADERS },
  );
}
