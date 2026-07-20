/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Dynamic OG Image for World sharing.
 * Generates a beautiful social card when someone shares a world link.
 *
 * GET /api/worlds/[slug]/og
 */

import { ImageResponse } from 'next/og';
import { brand, cosmic, elements as elementTokens } from '@arcanea/design-system';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

// Resolved token values only — Satori renders outside the DOM and resolves no
// CSS custom properties, so a `var(...)` in `background`/`backgroundColor`
// throws at render time.
const ELEMENT_COLORS: Record<string, string> = {
  Fire: elementTokens.fire.base,
  Water: elementTokens.water.base,
  Earth: elementTokens.earth.base,
  Wind: elementTokens.wind.base,
  Void: elementTokens.void.base,
  Spirit: brand.arcaneanGold,
};

const VOID_BG = cosmic.void;
const DEEP_BG = cosmic.deep;
const TEAL = brand.atlanteanTeal;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: VOID_BG, color: 'white', fontSize: 40, fontFamily: 'sans-serif' }}>
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
      background: `linear-gradient(135deg, ${VOID_BG} 0%, ${DEEP_BG} 50%, ${VOID_BG} 100%)`,
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
              backgroundColor: ELEMENT_COLORS[el] || TEAL,
              boxShadow: `0 0 12px ${ELEMENT_COLORS[el] || TEAL}60`,
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
