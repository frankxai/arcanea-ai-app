import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { docId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: doc, error } = await (supabase as any)
      .from('project_docs')
      .select(`*, project_doc_content (*)`)
      .eq('id', docId)
      .eq('user_id', user.id)
      .single();

    if (error || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const content = Array.isArray(doc.project_doc_content)
      ? doc.project_doc_content[0] ?? null
      : doc.project_doc_content ?? null;

    return NextResponse.json({ doc: { ...doc, project_doc_content: undefined, content } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { docId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
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

    // Update doc metadata if any doc fields provided
    if (title !== undefined || doc_type !== undefined || status !== undefined || icon !== undefined) {
      const docPatch: Record<string, unknown> = { last_edited_at: new Date().toISOString() };
      if (title !== undefined) docPatch.title = title;
      if (doc_type !== undefined) docPatch.doc_type = doc_type;
      if (status !== undefined) docPatch.status = status;
      if (icon !== undefined) docPatch.icon = icon;

      const { error: docError } = await (supabase as any)
        .from('project_docs')
        .update(docPatch)
        .eq('id', docId)
        .eq('user_id', user.id);

      if (docError) {
        return NextResponse.json({ error: docError.message }, { status: 500 });
      }
    }

    // Update content if provided
    if (content_json !== undefined || content_text !== undefined) {
      const reading_time_minutes = Math.max(1, Math.round((word_count ?? 0) / 200));

      const { error: contentError } = await (supabase as any)
        .from('project_doc_content')
        .upsert(
          {
            doc_id: docId,
            content_json: content_json ?? {},
            content_text: content_text ?? '',
            word_count: word_count ?? 0,
            reading_time_minutes,
          },
          { onConflict: 'doc_id' }
        );

      if (contentError) {
        return NextResponse.json({ error: contentError.message }, { status: 500 });
      }

      // Snapshot version
      const { data: versionData } = await (supabase as any)
        .from('project_doc_versions')
        .select('version_number')
        .eq('doc_id', docId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      const nextVersion = ((versionData as { version_number: number } | null)?.version_number ?? 0) + 1;

      await (supabase as any).from('project_doc_versions').insert({
        doc_id: docId,
        version_number: nextVersion,
        editor_type: 'human',
        author_user_id: user.id,
        content_json: content_json ?? {},
        content_text: content_text ?? '',
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { docId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await (supabase as any)
      .from('project_docs')
      .delete()
      .eq('id', docId)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
