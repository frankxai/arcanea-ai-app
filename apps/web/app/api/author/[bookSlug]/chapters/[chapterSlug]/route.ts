/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Author Studio v3 — Chapter read/write with Supabase draft storage
 *
 * GET  — Requires auth; returns the owner draft independently of deployment
 *        file timestamps. Published fallback requires public visibility or authorship.
 *
 * POST — Requires auth. Verifies authorship via book_authors (when the book
 *        is registered in Supabase). UPSERTs the draft — never writes to the
 *        filesystem (Vercel is ephemeral).
 */

import { readFile, readdir, access, stat } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBookRoot } from "@/lib/content/book-path";
import { isBookPublic } from "@/lib/content/book-visibility";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

const BOOK_ROOT = getBookRoot();
const SLUG = /^[a-z0-9][a-z0-9-]{0,99}$/;
const PRIVATE_HEADERS = { "Cache-Control": "private, no-store, no-transform" };
function json(body: unknown, options: { status?: number } = {}) {
  return NextResponse.json(body, { ...options, headers: PRIVATE_HEADERS });
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function findFile(slug: string, files: string[]): string | null {
  return files.find((f) => f.replace(/\.md$/, "") === slug) || null;
}

function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

function extractTitle(content: string, fallback: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : fallback;
}

/**
 * Resolve the Supabase book row (if the book has been registered in
 * Open Library). Returns null when the slug only exists in git.
 */
async function resolveBook(
  supabase: DB,
  slug: string,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from("books")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Book lookup unavailable");
  if (!data) return null;
  return data as { id: string };
}

async function readGitChapter(
  bookSlug: string,
  chapterSlug: string,
): Promise<{ filename: string; content: string; mtime: Date } | null> {
  const chaptersDir = join(BOOK_ROOT, bookSlug, "chapters");
  if (!(await exists(chaptersDir))) return null;

  const files = await readdir(chaptersDir);
  const filename = findFile(
    chapterSlug,
    files.filter((f) => f.endsWith(".md")),
  );
  if (!filename) return null;

  const fullPath = join(chaptersDir, filename);
  const [content, st] = await Promise.all([
    readFile(fullPath, "utf-8"),
    stat(fullPath),
  ]);
  return { filename, content, mtime: st.mtime };
}

// ---------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> },
) {
  const { bookSlug, chapterSlug } = await params;
  if (!SLUG.test(bookSlug) || !SLUG.test(chapterSlug))
    return json({ error: "Invalid chapter path" }, { status: 400 });
  try {
    const supabase = (await createClient()) as DB;
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return json(
        { error: "Sign in to load your private draft" },
        { status: 401 },
      );
    const { data: draft, error: draftError } = await supabase
      .from("book_chapter_drafts")
      .select("content, content_json, word_count, updated_at")
      .eq("book_slug", bookSlug)
      .eq("chapter_slug", chapterSlug)
      .eq("author_user_id", user.id)
      .maybeSingle();
    if (draftError)
      return json(
        { error: "Draft lookup failed. Retry before editing." },
        { status: 503 },
      );
    // Deployment file mtimes cannot determine whether an owner's draft is stale.
    if (draft)
      return json({
        slug: chapterSlug,
        filename: `${chapterSlug}.md`,
        title: extractTitle(draft.content, chapterSlug),
        content: draft.content,
        contentJson: draft.content_json,
        wordCount: draft.word_count,
        source: "draft",
        authorId: user.id,
        draftUpdatedAt: draft.updated_at,
      });
    if (!(await isBookPublic(join(BOOK_ROOT, bookSlug)))) {
      const book = await resolveBook(supabase, bookSlug);
      if (!book)
        return json(
          { error: "Private book access has not been registered" },
          { status: 403 },
        );
      const { data: author, error } = await supabase
        .from("book_authors")
        .select("role")
        .eq("book_id", book.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error)
        return json(
          { error: "Book access could not be verified" },
          { status: 503 },
        );
      if (!author)
        return json(
          { error: "This book is private to its authors" },
          { status: 403 },
        );
    }
    const git = await readGitChapter(bookSlug, chapterSlug);
    if (!git) return json({ error: "Chapter not found" }, { status: 404 });
    return json({
      slug: chapterSlug,
      filename: git.filename,
      title: extractTitle(git.content, chapterSlug),
      content: git.content,
      contentJson: null,
      wordCount: countWords(git.content),
      source: "published",
      authorId: user.id,
      draftUpdatedAt: null,
    });
  } catch {
    return json(
      { error: "Draft service unavailable. Retry before editing." },
      { status: 503 },
    );
  }
}

// ---------------------------------------------------------------------
// POST — write to Supabase draft (never filesystem)
// ---------------------------------------------------------------------
export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> },
) {
  const { bookSlug, chapterSlug } = await params;
  if (!SLUG.test(bookSlug) || !SLUG.test(chapterSlug))
    return json({ error: "Invalid chapter path" }, { status: 400 });

  let body: { content?: unknown; contentJson?: unknown; authorId?: unknown };
  try {
    body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.content !== "string" || body.content.length > 200_000) {
    return json(
      { error: "Draft text must be a string of at most 200,000 characters" },
      { status: 400 },
    );
  }
  const content = body.content;
  const contentJson =
    body.contentJson && typeof body.contentJson === "object"
      ? body.contentJson
      : null;

  try {
    const supabase = (await createClient()) as DB;
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return json({ error: "Authentication required" }, { status: 401 });
    }
    if (body.authorId !== undefined && body.authorId !== user.id)
      return json(
        { error: "Account changed. Reload before saving this draft." },
        { status: 409 },
      );

    // Verify authorship when the book is registered in Supabase.
    // Git-only books (not yet in Open Library) fall through — any authenticated
    // user can draft. This matches current expected workflow where books
    // live in git first and get registered later.
    const book = await resolveBook(supabase, bookSlug);
    if (book) {
      const { data: authorship, error: authorError } = await supabase
        .from("book_authors")
        .select("role")
        .eq("book_id", book.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (authorError)
        return json(
          { error: "Book access could not be verified" },
          { status: 503 },
        );
      if (!authorship) {
        return json(
          { error: "You are not an author of this book" },
          { status: 403 },
        );
      }
    }

    if (
      !book &&
      (!(await isBookPublic(join(BOOK_ROOT, bookSlug))) ||
        !(await readGitChapter(bookSlug, chapterSlug)))
    )
      return json(
        { error: "Register private book authorship before saving" },
        { status: 403 },
      );
    if (
      contentJson &&
      (JSON.stringify(contentJson).length > 500_000 ||
        !("type" in contentJson) ||
        contentJson.type !== "doc" ||
        !("content" in contentJson) ||
        !Array.isArray(contentJson.content))
    )
      return json({ error: "Invalid editor document" }, { status: 400 });
    const word_count = countWords(content);

    const { error: upsertError } = await supabase
      .from("book_chapter_drafts")
      .upsert(
        {
          book_slug: bookSlug,
          chapter_slug: chapterSlug,
          author_user_id: user.id,
          content,
          content_json: contentJson,
          word_count,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "book_slug,chapter_slug,author_user_id" },
      );

    if (upsertError) {
      console.error("[chapter POST] draft save failed");
      return json({ error: "Failed to save draft" }, { status: 500 });
    }

    return json({
      success: true,
      wordCount: word_count,
      source: "draft",
    });
  } catch (err) {
    console.error("[chapter POST] draft service unavailable");
    return json(
      { error: "Draft service temporarily unavailable" },
      { status: 503 },
    );
  }
}
