import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  CINEMATIC_BOOK_ID,
  CINEMATIC_EDITION_ID,
} from '@/lib/books/cinematic-edition';
import {
  getCinematicBookAccess,
  isCinematicCheckoutConfigured,
} from '@/lib/books/polar-access';

export const runtime = 'nodejs';

function polarApiBase(): string {
  return process.env.POLAR_MODE === 'sandbox'
    ? 'https://sandbox-api.polar.sh'
    : 'https://api.polar.sh';
}

export async function POST(): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Sign in is required.' }, { status: 401 });
  }

  const accessToken = process.env.POLAR_ACCESS_TOKEN?.trim();
  const productId = process.env.POLAR_BOOK_PRODUCT_ID?.trim();
  if (!isCinematicCheckoutConfigured() || !accessToken || !productId) {
    return NextResponse.json(
      { error: 'The founding edition is not open for purchase yet.' },
      { status: 503 },
    );
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_APP_URL
    || process.env.NEXT_PUBLIC_SITE_URL
    || 'https://arcanea.ai'
  ).replace(/\/$/, '');

  const existingAccess = await getCinematicBookAccess();
  if (existingAccess.status === 'granted') {
    return NextResponse.json({ url: `${siteUrl}/books/${CINEMATIC_BOOK_ID}` });
  }
  if (existingAccess.status === 'unavailable') {
    return NextResponse.json(
      { error: 'Purchase history could not be verified. Please try again.' },
      { status: 503 },
    );
  }

  const response = await fetch(`${polarApiBase()}/v1/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: [productId],
      external_customer_id: user.id,
      customer_email: user.email,
      allow_discount_codes: true,
      success_url: `${siteUrl}/books/${CINEMATIC_BOOK_ID}/confirmed?checkout_id={CHECKOUT_ID}`,
      return_url: `${siteUrl}/books/${CINEMATIC_BOOK_ID}`,
      metadata: {
        book_id: CINEMATIC_BOOK_ID,
        edition_id: CINEMATIC_EDITION_ID,
        access_type: 'complete_book',
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Secure checkout could not be opened.' },
      { status: 502 },
    );
  }

  const checkout = await response.json() as { url?: string };
  if (!checkout.url) {
    return NextResponse.json(
      { error: 'Secure checkout did not return a destination.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: checkout.url });
}
