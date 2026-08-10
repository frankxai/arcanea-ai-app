import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_JSON_BYTES = Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 4_096;
const ALLOWED_IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

function unauthorized() {
  return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
}

function parseBase64Image(imageData: unknown, mimeType: unknown): {
  base64: string;
  mimeType: string;
  extension: string;
} {
  if (typeof imageData !== 'string' || typeof mimeType !== 'string') {
    throw new Error('Image data and MIME type are required');
  }

  const normalizedMimeType = mimeType.toLowerCase();
  const extension = ALLOWED_IMAGE_TYPES.get(normalizedMimeType);
  if (!extension) {
    throw new Error('Unsupported image type');
  }

  const base64 = imageData.replace(/^data:[^;]+;base64,/, '');
  if (
    base64.length === 0 ||
    base64.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)
  ) {
    throw new Error('Invalid image encoding');
  }

  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const decodedBytes = (base64.length * 3) / 4 - padding;
  if (decodedBytes > MAX_IMAGE_BYTES) {
    throw new Error('Image exceeds the 10 MB limit');
  }

  return { base64, mimeType: normalizedMimeType, extension };
}

export async function POST(req: NextRequest) {
  try {
    const declaredLength = Number(req.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
      return NextResponse.json({ error: 'Image exceeds the 10 MB limit' }, { status: 413 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorized();
    }

    const { imageData, mimeType, prompt } = await req.json();
    const parsed = parseBase64Image(imageData, mimeType);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        url: null,
        message: 'Storage not configured — image available in session only',
      });
    }

    const { put } = await import('@vercel/blob');
    const blob = await put(
      `imagine/${user.id}/${crypto.randomUUID()}.${parsed.extension}`,
      Buffer.from(parsed.base64, 'base64'),
      {
        // Transitional only: the Media Fabric migration moves canonical assets to R2.
        // UUID paths prevent enumeration, while the gallery is isolated by user ID.
        access: 'public',
        contentType: parsed.mimeType,
        addRandomSuffix: false,
      },
    );

    return NextResponse.json({
      url: blob.url,
      prompt: typeof prompt === 'string' ? prompt.slice(0, 2_000) : undefined,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error('Imagine save failed', {
      type: error instanceof Error ? error.name : 'unknown',
    });
    const message = error instanceof Error ? error.message : 'Failed to save image';
    const status = message.includes('10 MB') ? 413 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
