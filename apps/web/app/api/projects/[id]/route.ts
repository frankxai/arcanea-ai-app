import { NextRequest } from 'next/server';
import { z } from 'zod';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  deleteProjectForCurrentUser,
  getProjectForCurrentUser,
  updateProjectForCurrentUser,
} from '@/lib/projects/server';

const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  goal: z.string().trim().max(1000).nullable().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await getProjectForCurrentUser(id);
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

    const project = await updateProjectForCurrentUser(id, validation.data);
    if (!project) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

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
    const deleted = await deleteProjectForCurrentUser(id);
    if (!deleted) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
