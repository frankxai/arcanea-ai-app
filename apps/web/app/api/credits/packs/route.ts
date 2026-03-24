import { NextResponse } from 'next/server';
import { CREDIT_PACKS } from '@/lib/types/credits';

export const runtime = 'edge';

export async function GET() {
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
}
