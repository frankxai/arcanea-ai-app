import { NextRequest } from 'next/server';
import { z } from 'zod';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  createProjectForCurrentUser,
  getProjectAuthContext,
  listProjectsForCurrentUser,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional(),
  goal: z.string().trim().max(1000).optional(),
});

export const projectsRouteDeps = {
  createProjectForCurrentUser,
  getProjectAuthContext,
  listProjectsForCurrentUser,
  recordProjectTrace,
};

export async function GET() {
  try {
    const { user } = await projectsRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }
    const projects = await projectsRouteDeps.listProjectsForCurrentUser();
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

    const { supabase, user } = await projectsRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const project = await projectsRouteDeps.createProjectForCurrentUser(validation.data);
    if (!project) {
      return errorResponse('INTERNAL_ERROR', 'Failed to create project', 500);
    }

    await projectsRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId: project.id,
      action: 'project_created',
      metadata: {
        title: project.title,
      },
    });

    return successResponse({ project }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
