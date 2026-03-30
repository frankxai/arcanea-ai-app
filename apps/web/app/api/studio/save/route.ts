/**
 * Studio Save API — Image Upload + Creation Record
 *
 * POST /api/studio/save
 *
 * Accepts JSON body:
 *   - imageUrl: string  — either a data:image/...;base64,... URL or a remote https:// URL
 *   - prompt:   string  — the generation prompt
 *   - title:    string  — display title (defaults to prompt truncated)
 *   - model:    string? — AI model used (optional)
 *   - element:  string? — Arcanea element (optional)
 *   - gate:     string? — Arcanea gate (optional)
 *   - guardian: string? — Guardian name (optional)
 *
 * Flow:
 *   1. Auth check — 401 if not logged in
 *   2. Decode base64 or fetch remote URL → ArrayBuffer
 *   3. Upload buffer to Supabase Storage bucket "creations" under user_id/timestamp.png
 *   4. Insert row into creations table with thumbnail_url = public URL
 *   5. Return { creation, imageUrl }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCreation } from '@/lib/database/services/creation-service';
import { getProjectWorkspaceForCurrentUser } from '@/lib/projects/server';
import { enrichProjectGraph } from '@/lib/projects/enrichment';
import { recordProjectTrace } from '@/lib/projects/trace';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: 'Sign in to save your creations.' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.imageUrl !== 'string') {
      return NextResponse.json(
        { error: { message: 'imageUrl is required.' } },
        { status: 400 }
      );
    }

    const {
      imageUrl,
      prompt = '',
      title,
      model,
      element,
      gate,
      guardian,
      projectId,
      sourceSessionId,
    } = body as {
      imageUrl: string;
      prompt?: string;
      title?: string;
      model?: string;
      element?: string;
      gate?: string;
      guardian?: string;
      projectId?: string;
      sourceSessionId?: string;
    };

    // Resolve image bytes + mime type
    let imageBuffer: ArrayBuffer;
    let mimeType = 'image/png';

    if (imageUrl.startsWith('data:')) {
      // data:<mime>;base64,<data>
      const commaIdx = imageUrl.indexOf(',');
      if (commaIdx === -1) {
        return NextResponse.json(
          { error: { message: 'Malformed data URL.' } },
          { status: 400 }
        );
      }
      const header = imageUrl.slice(5, commaIdx); // strip "data:"
      const base64Part = imageUrl.slice(commaIdx + 1);
      mimeType = header.replace(';base64', '') || 'image/png';

      const binaryStr = atob(base64Part);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      imageBuffer = bytes.buffer;
    } else if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
      // Remote URL — fetch and re-upload so we own the file
      const fetchRes = await fetch(imageUrl, { signal: AbortSignal.timeout(15_000) });
      if (!fetchRes.ok) {
        return NextResponse.json(
          { error: { message: `Could not fetch image (${fetchRes.status}).` } },
          { status: 400 }
        );
      }
      mimeType = fetchRes.headers.get('content-type') || 'image/png';
      imageBuffer = await fetchRes.arrayBuffer();
    } else {
      return NextResponse.json(
        { error: { message: 'imageUrl must be a data URL or https:// URL.' } },
        { status: 400 }
      );
    }

    if (imageBuffer.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: { message: 'Image exceeds 20 MB limit.' } },
        { status: 413 }
      );
    }

    // Determine file extension from mime type
    const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
    const storagePath = `${user.id}/${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('creations')
      .upload(storagePath, imageBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('[studio/save] storage upload error:', uploadError);
      return NextResponse.json(
        { error: { message: uploadError.message || 'Storage upload failed.' } },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from('creations')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Build creation title — truncate prompt if no explicit title
    const creationTitle =
      (typeof title === 'string' && title.trim()) || prompt.slice(0, 100) || 'Image creation';

    // Insert creation record
    const creation = await createCreation(supabase, user.id, {
      title: creationTitle,
      description: prompt.slice(0, 500) || undefined,
      type: 'image',
      status: 'draft',
      visibility: 'private',
      thumbnailUrl: publicUrl,
      aiPrompt: prompt || undefined,
      aiModel: model || undefined,
      element: element as Parameters<typeof createCreation>[2]['element'],
      gate: gate as Parameters<typeof createCreation>[2]['gate'],
      guardian: guardian as Parameters<typeof createCreation>[2]['guardian'],
      projectId,
      sourceSessionId,
      content: {
        mode: 'image',
        prompt,
        imageUrl: publicUrl,
      },
    });

    if (!creation) {
      console.error('[studio/save] DB insert returned null');
      return NextResponse.json(
        { error: { message: 'Failed to save creation record.' } },
        { status: 500 }
      );
    }

    if (projectId) {
      await recordProjectTrace(supabase as any, {
        userId: user.id,
        projectId,
        action: 'project_creation_linked',
        metadata: {
          creationId: creation.id,
          type: creation.type,
          sourceSessionId: sourceSessionId ?? null,
        },
      });

      const workspace = await getProjectWorkspaceForCurrentUser(projectId);
      if (workspace) {
        await enrichProjectGraph(supabase as any, user.id, workspace);
      }
    }

    return NextResponse.json({ creation, imageUrl: publicUrl }, { status: 201 });
  } catch (err) {
    console.error('[studio/save] unexpected error:', err);
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : 'Save failed.' } },
      { status: 500 }
    );
  }
}
