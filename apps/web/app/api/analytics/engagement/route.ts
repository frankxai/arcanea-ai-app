import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const { data, error } = await supabase
      .from('user_engagement')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return successResponse({ engagement: data });
  } catch (error) {
    return handleApiError(error);
  }
}
