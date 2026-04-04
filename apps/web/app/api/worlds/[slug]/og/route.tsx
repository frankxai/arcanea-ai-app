/**
 * Dynamic OG Image for World sharing.
 * Generates a beautiful social card when someone shares a world link.
 *
 * GET /api/worlds/[slug]/og
 */

import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444', Water: '#3b82f6', Earth: '#22c55e',
  Wind: '#94a3b8', Void: '#8b5cf6', Spirit: '#fbbf24',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sb = await createClient();

  const { data: world } = await sb
    .from('worlds')
    .select('name, tagline, mood, elements, star_count, fork_count, character_count')
    .eq('slug', slug)
    .eq('visibility', 'public')
    .single();

  if (!world) {
    return new ImageResponse(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#09090b', color: 'white', fontSize: 40, fontFamily: 'sans-serif' }}>
        World not found
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const elements = Array.isArray(world.elements)
    ? (world.elements as Array<{ name?: string } | string>).map(e => typeof e === 'string' ? e : e.name || '').filter(Boolean)
    : [];

  return new ImageResponse(
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      width: '100%', height: '100%', padding: '60px',
      background: 'linear-gradient(135deg, #09090b 0%, #0a1628 50%, #09090b 100%)',
      fontFamily: 'sans-serif',
    }}>
      {/* Aurora glow */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', width: '60%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(0,188,212,0.15) 0%, transparent 70%)',
      }} />

      {/* Arcanea badge */}
      <div style={{
        position: 'absolute', top: 40, left: 60,
        fontSize: 16, color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.2em', textTransform: 'uppercase' as const,
      }}>
        arcanea.ai
      </div>

      {/* World name */}
      <div style={{ fontSize: 72, fontWeight: 'bold', color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
        {world.name}
      </div>

      {/* Tagline */}
      {world.tagline && (
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.5)', marginBottom: 32, maxWidth: '80%' }}>
          {world.tagline}
        </div>
      )}

      {/* Elements + stats row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Element dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {elements.slice(0, 5).map((el) => (
            <div key={el} style={{
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: ELEMENT_COLORS[el] || '#00bcd4',
              boxShadow: `0 0 12px ${ELEMENT_COLORS[el] || '#00bcd4'}60`,
            }} />
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, fontSize: 18, color: 'rgba(255,255,255,0.35)' }}>
          <span>{world.star_count || 0} stars</span>
          <span>{world.character_count || 0} characters</span>
          <span>{world.fork_count || 0} forks</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
