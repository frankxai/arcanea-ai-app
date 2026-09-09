/**
 * Author Studio v3 — Chapter read/write with Supabase draft storage
 *
 * GET  — Restores the current account's draft, including rich-text data.
 *        Published content is returned only when no account draft exists.
 *        Lookup failure is reported explicitly; filesystem mtimes are ignored.
 *
 * POST — Requires auth. Verifies authorship via book_authors (when the book
 *        is registered in Supabase). UPSERTs the draft — never writes to the
 *        filesystem (Vercel is ephemeral).
 */

import { readFile, readdir, access } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBookRoot } from "@/lib/content/book-path";
import { readAuthorDraft } from "@/lib/author/read-draft";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

const BOOK_ROOT = getBookRoot();

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
  if (error || !data) return null;
  return data as { id: string };
}

async function readGitChapter(
  bookSlug: string,
  chapterSlug: string,
): Promise<{ filename: string; content: string } | null> {
  if (!(await exists(BOOK_ROOT))) return null;
  const books = await readdir(BOOK_ROOT, { withFileTypes: true });
  const book = books.find(
    (entry) => entry.isDirectory() && entry.name === bookSlug,
  );
  if (!book) return null;

  const chaptersDir = join(BOOK_ROOT, book.name, "chapters");
  if (!(await exists(chaptersDir))) return null;
  const files = await readdir(chaptersDir);
  const filename = findFile(
    chapterSlug,
    files.filter(
      (file) =>
        file.endsWith(".md") && !["CLAUDE.md", "AGENTS.md"].includes(file),
    ),
  );
  if (!filename) return null;
  return {
    filename,
    content: await readFile(join(chaptersDir, filename), "utf-8"),
  };
}

// ---------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> },
) {
  const { bookSlug, chapterSlug } = await params;
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const result = await readAuthorDraft(bookSlug, chapterSlug);
    if (result.status === "unavailable") {
      return NextResponse.json(
        {
          error:
            "Your saved draft could not be loaded. Try again before editing.",
        },
        { status: 503, headers },
      );
    }
    if (result.status === "found") {
      const draft = result.draft;
      return NextResponse.json(
        {
          slug: chapterSlug,
          filename: `${chapterSlug}.md`,
          title: extractTitle(draft.content, chapterSlug),
          content: draft.content,
          contentJson: draft.contentJson,
          wordCount: draft.wordCount,
          source: "draft",
          draftUpdatedAt: draft.updatedAt,
        },
        { headers },
      );
    }

    const git = await readGitChapter(bookSlug, chapterSlug);
    if (!git) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404, headers },
      );
    }
    return NextResponse.json(
      {
        slug: chapterSlug,
        filename: git.filename,
        title: extractTitle(git.content, chapterSlug),
        content: git.content,
        contentJson: null,
        wordCount: countWords(git.content),
        source: "published",
        draftUpdatedAt: null,
      },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { error: "Chapter temporarily unavailable. Try again before editing." },
      { status: 503, headers },
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

  let body: { content?: unknown; contentJson?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.content !== "string") {
    return NextResponse.json(
      { error: "content must be a string" },
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
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Verify authorship when the book is registered in Supabase.
    // Git-only books (not yet in Open Library) fall through — any authenticated
    // user can draft. This matches current expected workflow where books
    // live in git first and get registered later.
    const book = await resolveBook(supabase, bookSlug);
    if (book) {
      const { data: authorship } = await supabase
        .from("book_authors")
        .select("role")
        .eq("book_id", book.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!authorship) {
        return NextResponse.json(
          { error: "You are not an author of this book" },
          { status: 403 },
        );
      }
    }

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
      console.error("[chapter POST] upsert failed:", upsertError);
      return NextResponse.json(
        { error: "Failed to save draft" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      wordCount: word_count,
      source: "draft",
    });
  } catch (err) {
    console.error("[chapter POST] error:", err);
    return NextResponse.json(
      { error: "Draft service temporarily unavailable" },
      { status: 503 },
    );
  }
}
