/**
 * Creations Upload API
 *
 * POST /api/creations/upload
 *
 * Accepts FormData with:
 *   - file: The file to upload (max 100MB)
 *   - metadata: JSON string with title, tags, isPublic
 *
 * If Supabase is configured:
 *   - Authenticates the user via cookie session
 *   - Uploads file to the 'creations' storage bucket
 *   - Inserts a record into the 'creations' table
 *
 * If Supabase is not configured:
 *   - Returns a mock success response for local development
 */

import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadataStr = formData.get('metadata') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 413 });
    }

    const metadata = metadataStr ? JSON.parse(metadataStr) : {};

    // Check if Supabase is configured
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured — return mock response for development
      return NextResponse.json({
        data: {
          id: `mock-${Date.now()}`,
          url: '/placeholder.png',
          title: metadata.title || file.name,
          type: file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('video/')
            ? 'video'
            : 'text',
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Supabase is configured — authenticate and upload
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const ext = file.name.split('.').pop() || 'bin';
    const storagePath = `${user.id}/${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('creations')
      .upload(storagePath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[creations upload] storage error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('creations')
      .getPublicUrl(storagePath);

    const creationType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
      ? 'video'
      : 'text';

    const { data: creation, error: insertError } = await supabase
      .from('creations')
      .insert({
        user_id: user.id,
        title: metadata.title || file.name,
        type: creationType,
        content: urlData.publicUrl,
        tags: metadata.tags || [],
        visibility: metadata.isPublic === false ? 'private' : 'public',
        status: 'published',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[creations upload] db error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: creation.id,
        url: urlData.publicUrl,
        title: creation.title,
        type: creation.type,
        createdAt: creation.created_at,
      },
    });
  } catch (error) {
    console.error('[creations upload] unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
