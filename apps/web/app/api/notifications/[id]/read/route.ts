import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import { markAsRead } from '@/lib/database/services/notification-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const { id } = await params;
    if (!id) return errorResponse('VALIDATION_ERROR', 'Notification ID required', 400);

    await markAsRead(supabase, [id]);

    return successResponse({ id, read: true });
  } catch (error) {
    return handleApiError(error);
  }
}
