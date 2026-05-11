/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getNotifications, markAllAsRead } from '@/services/notification-service';
import { requireAuth, validateOwnership } from '@/lib/auth/middleware';
import { applyRateLimit, RateLimitPresets } from '@/lib/rate-limit/rate-limiter';
import { validateBody, markNotificationsReadSchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // 2. Apply rate limiting (generous for notifications)
    const rateLimitResult = await applyRateLimit(req, RateLimitPresets.generous, user.id);
    if (rateLimitResult) return rateLimitResult;

    // 3. Extract query parameters (userId defaults to authenticated user)
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || user.id;
    const page = parseInt(url.searchParams.get('page') || '1', 10) || 1;
    const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '20', 10) || 20, 100);

    // 4. Verify ownership (users can only see their own notifications)
    const ownershipError = validateOwnership(user.id, userId);
    if (ownershipError) return ownershipError;

    // 5. Execute business logic
    const supabase = await createClient();
    const notifications = await getNotifications(supabase, userId, { page, pageSize });
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // 1. Authenticate user
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // 2. Apply rate limiting
    const rateLimitResult = await applyRateLimit(req, RateLimitPresets.standard, user.id);
    if (rateLimitResult) return rateLimitResult;

    // 3. Validate request body
    const validationResult = await validateBody(req, markNotificationsReadSchema);
    if (!validationResult.success) return validationResult.error;
    const { userId } = validationResult.data;

    // 4. Verify ownership
    const ownershipError = validateOwnership(user.id, userId);
    if (ownershipError) return ownershipError;

    // 5. Execute business logic
    const supabase = await createClient();
    await markAllAsRead(supabase, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
