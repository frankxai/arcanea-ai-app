import { NextRequest } from 'next/server';
import { z } from 'zod';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  createProjectForCurrentUser,
  getProjectAuthContext,
  listProjectsForCurrentUser,
} from '@/lib/projects/server';

const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional(),
  goal: z.string().trim().max(1000).optional(),
});

export async function GET() {
  try {
    const { user } = await getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }
    const projects = await listProjectsForCurrentUser();
    return successResponse({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid project input', 400, {
        errors: validation.error.errors,
      });
    }

    const project = await createProjectForCurrentUser(validation.data);
    if (!project) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    return successResponse({ project }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
