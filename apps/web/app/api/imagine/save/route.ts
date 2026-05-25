/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageData, mimeType, prompt } = await req.json();

    if (!imageData || !mimeType) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Gracefully degrade — return success without persisting
      return NextResponse.json({
        url: null,
        message: 'Storage not configured — image available in session only',
      });
    }

    const { put } = await import('@vercel/blob');

    // Convert base64 to buffer
    const buffer = Buffer.from(imageData, 'base64');
    const ext = mimeType.includes('png') ? 'png' : 'jpg';
    const filename = `imagine/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Store in Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      prompt,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error('Save API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save image' },
      { status: 500 }
    );
  }
}
