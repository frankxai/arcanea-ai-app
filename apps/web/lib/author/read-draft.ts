import type { JSONContent } from "novel";
import { createClient } from "@/lib/supabase/server";
import { withAbortDeadline } from "@/lib/async-deadline";

export interface AuthorDraft {
  content: string;
  contentJson: JSONContent;
  wordCount: number;
  updatedAt: string | null;
}

export type AuthorDraftRead =
  | { status: "found"; draft: AuthorDraft }
  | { status: "none" }
  | { status: "unavailable" };

// These nodes and marks match the extensions enabled by DocEditor. Unknown
// structures stay unavailable instead of silently losing content during parsing.
const nodeTypes = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "blockquote",
  "bulletList",
  "orderedList",
  "listItem",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "taskList",
  "taskItem",
  "image",
]);
const markTypes = new Set([
  "bold",
  "italic",
  "strike",
  "code",
  "underline",
  "link",
  "textStyle",
  "highlight",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDocument(value: unknown): value is JSONContent {
  let remaining = 100_000;
  const validNode = (node: unknown, depth: number): boolean => {
    if (
      --remaining < 0 ||
      depth > 60 ||
      !isRecord(node) ||
      typeof node.type !== "string" ||
      !nodeTypes.has(node.type)
    )
      return false;
    if ((node.type === "doc") !== (depth === 0)) return false;
    if (node.attrs !== undefined && !isRecord(node.attrs)) return false;
    if (
      node.type === "text" &&
      (typeof node.text !== "string" || node.text.length === 0)
    )
      return false;
    if (
      node.content !== undefined &&
      (!Array.isArray(node.content) ||
        !node.content.every((child) => validNode(child, depth + 1)))
    )
      return false;
    if (
      node.marks !== undefined &&
      (!Array.isArray(node.marks) ||
        !node.marks.every(
          (mark) =>
            isRecord(mark) &&
            typeof mark.type === "string" &&
            markTypes.has(mark.type) &&
            (mark.attrs === undefined || isRecord(mark.attrs)),
        ))
    )
      return false;
    return true;
  };
  return (
    isRecord(value) &&
    value.type === "doc" &&
    Array.isArray(value.content) &&
    validNode(value, 0)
  );
}

function textDocument(text: string): JSONContent {
  return {
    type: "doc",
    content: text.split(/\r?\n/).map((line) => ({
      type: "paragraph",
      content: line ? [{ type: "text", text: line }] : [],
    })),
  };
}

/**
 * Read only the current account's draft. Checkout mtimes are deployment
 * artifacts, so they never decide whether a creator's draft may be restored.
 * Lookup failure is distinct from absence: callers must not open an editable
 * published fallback when the account's saved state is unknown.
 */
export async function readAuthorDraft(
  bookSlug: string,
  chapterSlug: string,
): Promise<AuthorDraftRead> {
  try {
    return await withAbortDeadline(
      "Author draft read",
      4000,
      async (signal) => {
        const supabase = await createClient();
        signal.throwIfAborted();
        const { data: auth, error: authError } = await supabase.auth.getUser();
        signal.throwIfAborted();
        if (authError?.name === "AuthSessionMissingError")
          return { status: "none" } as const;
        if (authError) throw new Error("Draft account lookup failed");
        if (!auth?.user) return { status: "none" } as const;
        if (typeof auth.user.id !== "string" || !auth.user.id) {
          throw new Error("Invalid draft account");
        }

        const { data, error } = await supabase
          .from("book_chapter_drafts")
          .select("content, content_json, updated_at")
          .eq("book_slug", bookSlug)
          .eq("chapter_slug", chapterSlug)
          .eq("author_user_id", auth.user.id)
          .abortSignal(signal)
          .maybeSingle();
        if (error) throw new Error("Draft lookup failed");
        if (!data) return { status: "none" } as const;

        const row: Record<string, unknown> = data;
        if (typeof row.content !== "string")
          throw new Error("Invalid saved draft");
        if (row.content_json != null && !isDocument(row.content_json)) {
          throw new Error("Invalid saved draft document");
        }
        return {
          status: "found",
          draft: {
            content: row.content,
            contentJson:
              row.content_json == null
                ? textDocument(row.content)
                : row.content_json,
            wordCount: row.content.split(/\s+/).filter(Boolean).length,
            updatedAt:
              typeof row.updated_at === "string" &&
              Number.isFinite(Date.parse(row.updated_at))
                ? row.updated_at
                : null,
          },
        } as const;
      },
    );
  } catch {
    return { status: "unavailable" };
  }
}
