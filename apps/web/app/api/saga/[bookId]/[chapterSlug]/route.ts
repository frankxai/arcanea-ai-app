/**
 * Public Saga API — released-chapter boundary.
 *
 * Development chapters are never loaded from disk on a public route.
 */

import { NextResponse } from 'next/server';
import { notPublicPayload } from '@/lib/saga/public-release-registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(notPublicPayload('chapter'), { status: 404 });
}
