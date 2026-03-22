import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, handleApiError, parsePaginationParams } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = parsePaginationParams(searchParams);
    const element = searchParams.get('element');
    const gate = searchParams.get('gate');

    const supabase = await createClient();

    let query = supabase
      .from('trending_creations')
      .select('*')
      .order('trending_score', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (element) query = query.eq('element', element);
    if (gate) query = query.eq('gate', gate);

    const { data, error } = await query;
    if (error) throw error;

    return successResponse({
      creations: data ?? [],
      page,
      pageSize,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
