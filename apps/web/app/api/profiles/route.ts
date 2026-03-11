/**
 * Profiles API
 *
 * PATCH /api/profiles - Update the current authenticated user's profile
 *
 * Accepts a JSON body with any subset of:
 *   - displayName / display_name
 *   - bio
 *   - avatarUrl / avatar_url
 *   - academyHouse / academy_house
 */

import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_FIELDS = ['display_name', 'bio', 'avatar_url', 'academy_house'] as const;

export async function PATCH(request: NextRequest) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    for (const field of ALLOWED_FIELDS) {
      // Accept both snake_case and camelCase variants from the request body
      const camelCase = field.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
      if (body[camelCase] !== undefined) {
        updates[field] = body[camelCase];
      } else if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[profiles PATCH] db error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[profiles PATCH] unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}
