/**
 * Public Saga API — released-reference boundary.
 *
 * Canon bibles, mystery ledgers, and development reference documents are
 * internal unless an approved release manifest explicitly publishes them.
 */

import { NextResponse } from 'next/server';
import { notPublicPayload } from '@/lib/saga/public-release-registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(notPublicPayload('document'), { status: 404 });
}
