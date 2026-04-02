import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import { createClient } from '@/lib/supabase/server';

type AuthContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  // Temporary bridge until real generated types include docs tables.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
  user: { id: string } | null;
};

async function getDocAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
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
  getDocAuthContext,
};

async function loadDocForResponse(
  db: AuthContext['db'],
  projectId: string,
  docId: string,
  userId: string,
) {
  const { data: doc, error } = await db
    .from('project_docs')
    .select('*, project_doc_content (*)')
    .eq('id', docId)
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single();

  if (error || !doc) {
    return null;
  }

  const content = Array.isArray(doc.project_doc_content)
    ? doc.project_doc_content[0] ?? null
    : doc.project_doc_content ?? null;

  return { ...doc, project_doc_content: undefined, content };
}
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { id: projectId, docId } = await params;
    const { db, user } = await projectDocRouteDeps.getDocAuthContext();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const doc = await loadDocForResponse(db, projectId, docId, user.id);
    if (!doc) {
      return errorResponse('NOT_FOUND', 'Document not found', 404);
    }

    return successResponse({ doc });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { id: projectId, docId } = await params;
    const { db, user } = await projectDocRouteDeps.getDocAuthContext();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const { title, doc_type, status, icon, content_json, content_text, word_count } = body as {
      title?: string;
      doc_type?: string;
      status?: string;
      icon?: string;
      content_json?: Record<string, unknown>;
      content_text?: string;
      word_count?: number;
    };

    if (title !== undefined || doc_type !== undefined || status !== undefined || icon !== undefined) {
      const docPatch: Record<string, unknown> = { last_edited_at: new Date().toISOString() };
      if (title !== undefined) docPatch.title = title;
      if (doc_type !== undefined) docPatch.doc_type = doc_type;
      if (status !== undefined) docPatch.status = status;
      if (icon !== undefined) docPatch.icon = icon;

      const { error: docError } = await db
        .from('project_docs')
        .update(docPatch)
        .eq('id', docId)
        .eq('project_id', projectId)
        .eq('user_id', user.id);

      if (docError) {
        return errorResponse('INTERNAL_ERROR', docError.message, 500);
      }
    }

    let contentChanged = false;

    if (content_json !== undefined || content_text !== undefined) {
      const existingDoc = await loadDocForResponse(db, projectId, docId, user.id);
      if (!existingDoc) {
        return errorResponse('NOT_FOUND', 'Document not found', 404);
      }

      const nextContentJson = content_json ?? {};
      const nextContentText = content_text ?? '';
      const nextWordCount = word_count ?? 0;
      const existingContentJson = existingDoc.content?.content_json ?? {};
      const existingContentText = existingDoc.content?.content_text ?? '';
      const existingWordCount = existingDoc.content?.word_count ?? 0;

      contentChanged =
        JSON.stringify(existingContentJson) !== JSON.stringify(nextContentJson) ||
        existingContentText !== nextContentText ||
        existingWordCount !== nextWordCount;

      const readingTimeMinutes = Math.max(1, Math.round((word_count ?? 0) / 200));
      const { error: contentError } = await db
        .from('project_doc_content')
        .upsert(
          {
            doc_id: docId,
            content_json: nextContentJson,
            content_text: nextContentText,
            word_count: nextWordCount,
            reading_time_minutes: readingTimeMinutes,
          },
          { onConflict: 'doc_id' }
        );

      if (contentError) {
        return errorResponse('INTERNAL_ERROR', contentError.message, 500);
      }

      if (contentChanged) {
        const { data: versionData } = await db
          .from('project_doc_versions')
          .select('version_number')
          .eq('doc_id', docId)
          .order('version_number', { ascending: false })
          .limit(1)
          .single();

        const nextVersion = ((versionData as { version_number: number } | null)?.version_number ?? 0) + 1;

        await db.from('project_doc_versions').insert({
          doc_id: docId,
          version_number: nextVersion,
          editor_type: 'human',
          author_user_id: user.id,
          content_json: nextContentJson,
          content_text: nextContentText,
        });
      }
    }

    const doc = await loadDocForResponse(db, projectId, docId, user.id);
    if (!doc) {
      return errorResponse('NOT_FOUND', 'Document not found', 404);
    }

    return successResponse({ ok: true, contentChanged, doc });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { id: projectId, docId } = await params;
    const { db, user } = await projectDocRouteDeps.getDocAuthContext();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { error } = await db
      .from('project_docs')
      .delete()
      .eq('id', docId)
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    if (error) {
      return errorResponse('INTERNAL_ERROR', error.message, 500);
    }

    return successResponse({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
