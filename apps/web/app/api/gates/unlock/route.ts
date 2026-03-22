import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError, parseRequestBody } from '@/lib/api-utils';

const GATE_MAP: Record<number, string> = {
  1: 'Foundation', 2: 'Flow', 3: 'Fire', 4: 'Heart', 5: 'Voice',
  6: 'Sight', 7: 'Crown', 8: 'Starweave', 9: 'Unity', 10: 'Source',
};

const unlockSchema = z.object({
  gateNumber: z.number().int().min(1).max(10),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const body = await parseRequestBody(request);
    if (!body) return errorResponse('INVALID_INPUT', 'Invalid request body', 400);

    const parsed = unlockSchema.safeParse(body);
    if (!parsed.success) return errorResponse('VALIDATION_ERROR', 'Invalid gate number', 400);

    const { gateNumber } = parsed.data;
    const gateName = GATE_MAP[gateNumber];

    const { error } = await supabase.rpc('unlock_gate', {
      p_user_id: user.id,
      p_gate_number: gateNumber,
      p_gate_name: gateName,
    });

    if (error) throw error;

    return successResponse({ gateNumber, gateName, unlocked: true });
  } catch (error) {
    return handleApiError(error);
  }
}
