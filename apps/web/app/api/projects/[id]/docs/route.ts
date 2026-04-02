import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch docs with word_count joined from content table
    const { data: docs, error } = await (supabase as any)
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Flatten word_count to top level
    const normalised = (docs ?? []).map(
      (doc: Record<string, unknown> & { project_doc_content?: { word_count?: number }[] }) => ({
        ...doc,
        word_count: doc.project_doc_content?.[0]?.word_count ?? 0,
        project_doc_content: undefined,
      })
    );

    return NextResponse.json({ docs: normalised });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { title = 'Untitled', doc_type = 'note', icon, status = 'draft' } = body as {
      title?: string;
      doc_type?: string;
      icon?: string;
      status?: string;
    };

    // Create the doc row
    const { data: doc, error: docError } = await (supabase as any)
      .from('project_docs')
      .insert({
        project_id: projectId,
        workspace_id: user.id, // use user id as workspace_id until workspace system exists
        user_id: user.id,
        title,
        doc_type,
        icon: icon ?? null,
        status,
      })
      .select()
      .single();

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 500 });
    }

    // Create the content row
    const { error: contentError } = await (supabase as any)
      .from('project_doc_content')
      .insert({
        doc_id: doc.id,
        content_json: {},
        content_text: '',
        word_count: 0,
      });

    if (contentError) {
      // Non-fatal — doc was created, content row can be created on first save
      console.error('Failed to create doc content row:', contentError.message);
    }

    return NextResponse.json({ doc }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
