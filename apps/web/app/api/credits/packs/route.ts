/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextResponse } from 'next/server';
import { CREDIT_PACKS } from '@/lib/types/credits';

export const runtime = 'edge';

export async function GET() {
  try {
    const packs = CREDIT_PACKS.map(pack => ({
      id: pack.id,
      name: pack.id,
      credits: pack.credits,
      price: pack.priceUsd,
      unitPrice: pack.unitPrice,
      popular: pack.popular,
      available: true,
    }));

    return NextResponse.json({
      packs,
      forge: {
        price: 29,
        interval: 'month',
        available: !!process.env.STRIPE_SECRET_KEY,
      },
      currency: 'usd',
    });
  } catch (error) {
    console.error('[credits packs GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
