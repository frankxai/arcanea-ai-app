/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from 'next/server';
import { ARCANEAN_STYLES } from '@/lib/imagine/styles';
import { OPENROUTER_IMAGE_MODELS } from '@/lib/imagine/generate';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const premium = searchParams.get('premium') === 'true';

  const styles = premium
    ? ARCANEAN_STYLES
    : ARCANEAN_STYLES.filter((s) => s.tier === 'free');

  // Expose available image models too
  const models = OPENROUTER_IMAGE_MODELS.map((m) => ({
    id: m.id,
    name: m.name,
    label: m.label,
    tier: m.tier,
    provider: m.provider,
  }));

  return NextResponse.json({
    styles: styles.map((s) => ({
      id: s.id,
      name: s.name,
      label: s.label,
      description: s.description,
      guardian: s.guardian || null,
      element: s.element || null,
      tier: s.tier,
      tags: s.tags,
    })),
    models,
    providers: {
      grok: { configured: !!process.env.XAI_API_KEY },
      openrouter: { configured: !!process.env.OPENROUTER_API_KEY },
      gemini: { configured: !!(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) },
    },
  });
}
