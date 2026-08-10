import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ images: [], hasStorage: false });
    }

    const { list } = await import('@vercel/blob');
    const { blobs } = await list({
      prefix: `imagine/${user.id}/`,
      limit: 100,
    });

    const images = blobs
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
        size: blob.size,
      }));

    return NextResponse.json({
      images,
      hasStorage: true,
    });
  } catch (error) {
    console.error('Imagine gallery failed', {
      type: error instanceof Error ? error.name : 'unknown',
    });
    return NextResponse.json({ error: 'Failed to load gallery' }, { status: 500 });
  }
}
