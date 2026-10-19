/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from "next/server";
import {
  errorResponse,
  handleApiError,
  successResponse,
} from "@/lib/api-utils";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { DocumentSaveError, readDocumentJson } from "@/lib/docs/save";

const creationSchema = z
  .object({
    title: z.string().max(500).default("Untitled"),
    doc_type: z
      .enum([
        "note",
        "brief",
        "outline",
        "lore",
        "research",
        "prompt_book",
        "spec",
        "journal",
      ])
      .default("note"),
    status: z
      .enum(["draft", "active", "archived", "published"])
      .default("draft"),
    icon: z.string().max(100).nullable().optional(),
  })
  .strict();

type AuthContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  // Temporary bridge until real generated types include docs tables.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
  user: { id: string } | null;
};

async function getDocsAuthContext(): Promise<AuthContext> {
  const supabase = await projectDocsRouteDeps.createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && !isAuthSessionMissingError(error)) {
    throw error;
  }

  return {
    supabase,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db: supabase as any,
    user: user ? { id: user.id } : null,
  };
}

export const projectDocsRouteDeps = {
  createClient,
  getDocsAuthContext,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;
    const { db, user } = await projectDocsRouteDeps.getDocsAuthContext();

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const { data: docs, error } = await db
      .from("project_docs")
      .select(
        `
        id, title, slug, icon, status, doc_type, sort_order,
        created_at, updated_at, last_edited_at, metadata,
        project_doc_content ( word_count )
      `,
      )
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return errorResponse("INTERNAL_ERROR", error.message, 500);
    }

    const normalised = (docs ?? []).map(
      (
        doc: Record<string, unknown> & {
          project_doc_content?: { word_count?: number }[];
        },
      ) => ({
        ...doc,
        word_count: doc.project_doc_content?.[0]?.word_count ?? 0,
        project_doc_content: undefined,
      }),
    );

    return successResponse({ docs: normalised });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;
    const { db, user } = await projectDocsRouteDeps.getDocsAuthContext();

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const body = creationSchema.safeParse(await readDocumentJson(request));
    if (!body.success)
      return errorResponse("INVALID_INPUT", "Invalid document metadata", 400);
    const parent = await db
      .from("chat_projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();
    if (parent.error && parent.error.code !== "PGRST116")
      return errorResponse(
        "DATABASE_ERROR",
        "The project could not be verified. Retry creating the document.",
        503,
      );
    if (!parent.data)
      return errorResponse("NOT_FOUND", "Project not found", 404);
    const { title, doc_type, icon, status } = body.data;

    const { data: doc, error: docError } = await db
      .from("project_docs")
      .insert({
        project_id: projectId,
        workspace_id: projectId,
        user_id: user.id,
        title,
        doc_type,
        icon: icon ?? null,
        status,
      })
      .select()
      .single();

    if (docError) {
      return errorResponse(
        "DATABASE_ERROR",
        "Document creation was not confirmed. Retry after checking your documents.",
        503,
      );
    }

    return successResponse({ doc }, 201);
  } catch (err) {
    if (err instanceof DocumentSaveError)
      return errorResponse("INVALID_INPUT", err.message, err.status);
    return handleApiError(err);
  }
}
