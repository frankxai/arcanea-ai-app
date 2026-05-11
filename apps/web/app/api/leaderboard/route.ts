/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

const leaderboardSchema = z.object({
  type: z.enum(['xp', 'creations', 'likes', 'streak']).default('xp'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = leaderboardSchema.safeParse({
      type: searchParams.get('type') ?? 'xp',
      limit: searchParams.get('limit') ?? '20',
    });

    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid parameters', 400);
    }

    const { type, limit } = parsed.data;
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('get_leaderboard', {
      board_type: type,
      result_limit: limit,
    });

    if (error) throw error;

    return successResponse({
      leaderboard: data ?? [],
      type,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
