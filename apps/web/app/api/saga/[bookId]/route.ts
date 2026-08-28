/**
 * Public Saga API — released-book boundary.
 *
 * No book manuscript is currently allowlisted for public API delivery.
 */

import { NextResponse } from 'next/server';
import { notPublicPayload } from '@/lib/saga/public-release-registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(notPublicPayload('book'), { status: 404 });
}
