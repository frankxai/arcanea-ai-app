import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import { getProjectWorkspaceForCurrentUser } from '@/lib/projects/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const workspace = await getProjectWorkspaceForCurrentUser(id);
    if (!workspace) {
      return errorResponse('NOT_FOUND', 'Project graph not found', 404);
    }

    return successResponse({ workspace });
  } catch (error) {
    return handleApiError(error);
  }
}
