import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const [statsResult, elementResult] = await Promise.all([
      supabase.from('platform_stats').select('*').single(),
      supabase.from('element_distribution').select('*'),
    ]);

    if (statsResult.error) throw statsResult.error;

    return successResponse({
      stats: statsResult.data,
      elements: elementResult.data ?? [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}
