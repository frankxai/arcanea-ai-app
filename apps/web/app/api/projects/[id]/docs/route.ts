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

async function getDocsAuthContext(): Promise<AuthContext> {
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

export const projectDocsRouteDeps = {
  getDocsAuthContext,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { db, user } = await projectDocsRouteDeps.getDocsAuthContext();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { data: docs, error } = await db
      .from('project_docs')
      .select(`
        id, title, slug, icon, status, doc_type, sort_order,
        created_at, updated_at, last_edited_at, metadata,
        project_doc_content ( word_count )
      `)
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      return errorResponse('INTERNAL_ERROR', error.message, 500);
    }

    const normalised = (docs ?? []).map(
      (doc: Record<string, unknown> & { project_doc_content?: { word_count?: number }[] }) => ({
        ...doc,
        word_count: doc.project_doc_content?.[0]?.word_count ?? 0,
        project_doc_content: undefined,
      })
    );

    return successResponse({ docs: normalised });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { db, user } = await projectDocsRouteDeps.getDocsAuthContext();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const { title = 'Untitled', doc_type = 'note', icon, status = 'draft' } = body as {
      title?: string;
      doc_type?: string;
      icon?: string;
      status?: string;
    };

    const { data: doc, error: docError } = await db
      .from('project_docs')
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
      return errorResponse('INTERNAL_ERROR', docError.message, 500);
    }

    const { error: contentError } = await db
      .from('project_doc_content')
      .insert({
        doc_id: doc.id,
        content_json: {},
        content_text: '',
        word_count: 0,
      });

    if (contentError) {
      console.error('Failed to create doc content row:', contentError.message);
    }

    return successResponse({ doc }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
