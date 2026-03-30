import { NextRequest } from 'next/server';
import { z } from 'zod';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  getProjectAuthContext,
  deleteProjectForCurrentUser,
  getProjectForCurrentUser,
  updateProjectForCurrentUser,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  goal: z.string().trim().max(1000).nullable().optional(),
});

export const projectRouteDeps = {
  getProjectAuthContext,
  deleteProjectForCurrentUser,
  getProjectForCurrentUser,
  updateProjectForCurrentUser,
  recordProjectTrace,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await projectRouteDeps.getProjectForCurrentUser(id);
    if (!project) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    return successResponse({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const validation = updateProjectSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid project patch', 400, {
        errors: validation.error.errors,
      });
    }

    const { supabase, user } = await projectRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const project = await projectRouteDeps.updateProjectForCurrentUser(id, validation.data);
    if (!project) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    await projectRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId: project.id,
      action: 'project_updated',
      metadata: validation.data,
    });

    return successResponse({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { supabase, user } = await projectRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const deleted = await projectRouteDeps.deleteProjectForCurrentUser(id);
    if (!deleted) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    await projectRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId: id,
      action: 'project_deleted',
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
