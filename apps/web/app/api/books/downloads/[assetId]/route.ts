import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import {
  areCinematicDownloadsEnabled,
  CINEMATIC_DOWNLOADS,
  cinematicDownloadPath,
  isCinematicDownloadId,
} from '@/lib/books/downloads';
import { getCinematicBookAccess } from '@/lib/books/polar-access';
import { cinematicDownloadHttpStatus } from '@/lib/books/cinematic-access-contract';
import { readVerifiedCinematicArtifact } from '@/lib/books/cinematic-artifact-integrity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface DownloadRouteProps {
  params: Promise<{ assetId: string }>;
}

export async function GET(
  request: Request,
  { params }: DownloadRouteProps,
): Promise<Response> {
  const { assetId } = await params;
  if (!isCinematicDownloadId(assetId)) {
    return NextResponse.json({ error: 'Edition file not found.' }, { status: 404 });
  }

  const access = await getCinematicBookAccess();
  const downloadsEnabled = areCinematicDownloadsEnabled();
  const accessStatus = cinematicDownloadHttpStatus(access.status, downloadsEnabled);
  if (accessStatus === 401) {
    return NextResponse.json({ error: 'Sign in is required.' }, { status: 401 });
  }
  if (accessStatus === 503 && access.status === 'unavailable') {
    return NextResponse.json(
      { error: 'Purchase history could not be verified. Please try again.' },
      { status: 503 },
    );
  }
  if (accessStatus === 403) {
    return NextResponse.json({ error: 'Complete-edition access is required.' }, { status: 403 });
  }
  if (accessStatus === 503 || access.status !== 'granted') {
    return NextResponse.json(
      { error: 'Edition downloads are still being verified.' },
      { status: 503 },
    );
  }

  const asset = CINEMATIC_DOWNLOADS[assetId];
  const evidence = access.releaseFiles[asset.filename];
  if (!evidence) {
    return NextResponse.json({ error: 'Edition downloads are still being verified.' }, { status: 503 });
  }
  let result: Awaited<ReturnType<typeof get>>;
  try {
    result = await get(cinematicDownloadPath(assetId), {
      access: 'private',
      abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(30_000)]),
    });
  } catch {
    return NextResponse.json(
      { error: 'Edition storage could not be reached. Please try again.' },
      { status: 503 },
    );
  }
  if (!result || result.statusCode !== 200 || !result.stream) {
    return NextResponse.json({ error: 'Edition file not found.' }, { status: 404 });
  }

  if (result.blob.size !== evidence.bytes) {
    void result.stream.cancel().catch(() => undefined);
    return NextResponse.json({ error: 'Edition file could not be verified. Please try again.' }, { status: 503 });
  }
  const bytes = await readVerifiedCinematicArtifact(result.stream, evidence, { signal: request.signal });
  if (!bytes) {
    return NextResponse.json({ error: 'Edition file could not be verified. Please try again.' }, { status: 503 });
  }

  return new NextResponse(bytes, {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': `attachment; filename="${asset.filename}"`,
      'Content-Type': asset.contentType,
      'Content-Length': String(bytes.byteLength),
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
