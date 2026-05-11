/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Memories API Route
 *
 * GET /api/bonds/[userId]/memories - Get memories for user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMemories } from '@/lib/database/services/bond-service';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

/**
 * GET /api/bonds/[userId]/memories
 *
 * Fetch memories for user across all Luminors or specific Luminor
 *
 * Query parameters:
 * - luminorId: Optional Luminor ID to filter by
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabaseServer = await createClient();
    const { userId } = await params;

    if (!userId) {
      return errorResponse('INVALID_INPUT', 'User ID is required', 400);
    }

    const { searchParams } = new URL(request.url);
    const luminorId = searchParams.get('luminorId');

    // Fetch memories
    const memoriesData = await getMemories(supabaseServer, userId, luminorId ?? '');

    return successResponse(memoriesData);
  } catch (error) {
    return handleApiError(error);
  }
}
