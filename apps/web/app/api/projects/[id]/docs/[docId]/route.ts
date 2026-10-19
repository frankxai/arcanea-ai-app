/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from "next/server";
import {
  errorResponse,
  handleApiError,
  successResponse,
} from "@/lib/api-utils";
import { createClient } from "@/lib/supabase/server";
import { isAuthSessionMissingError } from "@supabase/supabase-js";
import {
  DocumentSaveError,
  readDocumentOperation,
  verifiedDocumentReceipt,
} from "@/lib/docs/save";

type AuthContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  // Temporary bridge until real generated types include docs tables.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
  user: { id: string } | null;
};

async function getDocAuthContext(): Promise<AuthContext> {
  const supabase = await projectDocRouteDeps.createClient();
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

export const projectDocRouteDeps = {
  createClient,
  getDocAuthContext,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const { id: projectId, docId } = await params;
    const { db, user } = await projectDocRouteDeps.getDocAuthContext();

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const { data: doc, error } = await db
      .from("project_docs")
      .select("*, project_doc_content (*)")
      .eq("id", docId)
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single();

    if (error || !doc) {
      return errorResponse("NOT_FOUND", "Document not found", 404);
    }

    const content = Array.isArray(doc.project_doc_content)
      ? (doc.project_doc_content[0] ?? null)
      : (doc.project_doc_content ?? null);

    return successResponse({
      doc: { ...doc, project_doc_content: undefined, content },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const { id: projectId, docId } = await params;
    const { db, user } = await projectDocRouteDeps.getDocAuthContext();

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const operation = await readDocumentOperation(request);
    if (operation.expected_actor !== user.id)
      return errorResponse(
        "CONFLICT",
        "The account changed. Keep your draft and sign in to its owner account.",
        409,
      );
    const { data, error } = await db.rpc("save_project_document", {
      p_project: projectId,
      p_doc: docId,
      p_revision: operation.expected_revision,
      p_operation: operation.operation_id,
      p_patch: operation.patch,
    });
    if (error) {
      if (error.message === "document_not_found")
        return errorResponse("NOT_FOUND", "Document not found", 404);
      if (
        error.message === "document_revision_conflict" ||
        error.message === "document_operation_conflict"
      )
        return errorResponse(
          "CONFLICT",
          "The saved document changed. Keep your draft and reopen the saved revision.",
          409,
        );
      if (error.message === "document_invalid")
        return errorResponse("INVALID_INPUT", "Invalid document save", 400);
      return errorResponse(
        "DATABASE_ERROR",
        "Saving was not confirmed. Retry or download your draft.",
        503,
      );
    }
    const receipt = verifiedDocumentReceipt(
      data,
      { user: user.id, project: projectId, doc: docId },
      operation,
    );
    return successResponse({ ok: true, receipt });
  } catch (err) {
    if (err instanceof DocumentSaveError)
      return errorResponse("INVALID_INPUT", err.message, err.status);
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const { id: projectId, docId } = await params;
    const { db, user } = await projectDocRouteDeps.getDocAuthContext();

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const { error } = await db
      .from("project_docs")
      .delete()
      .eq("id", docId)
      .eq("project_id", projectId)
      .eq("user_id", user.id);

    if (error) {
      return errorResponse("INTERNAL_ERROR", error.message, 500);
    }

    return successResponse({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
