/* ================================================================
 *  THE BAZAAR OF WONDERS — Marketplace & Tipping Service
 *  "Browse the Bazaar. Find wonder. Offer Mana to creators you admire."
 * ================================================================ */

import { createAdminClient, createClient } from '@/lib/supabase/server';
import type { MarketplaceListing, ListingType } from '@/lib/types/commerce';
import { MARKETPLACE_TITHE_PERCENT } from './pricing';
import { debitMana, creditMana } from './wallet-service';

/** List an item for sale */
export async function listItem(
  sellerId: string,
  type: ListingType,
  itemId: string,
  title: string,
  description: string,
  price: number
): Promise<MarketplaceListing> {
  if (price <= 0) throw new Error('Price must be positive');

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('marketplace_listings')
    .insert({
      seller_id: sellerId,
      type,
      item_id: itemId,
      title,
      description,
      price,
      currency: 'mana',
      status: 'active',
      platform_fee: Math.round(price * (MARKETPLACE_TITHE_PERCENT / 100)),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to list in the Bazaar: ${error.message}`);
  return mapListingRow(data);
}

/** Purchase an item — buyer pays, seller receives minus tithe */
export async function purchaseItem(
  buyerId: string,
  listingId: string
): Promise<MarketplaceListing> {
  const supabase = createAdminClient();

  const { data: listing, error: findError } = await supabase
    .from('marketplace_listings')
    .select()
    .eq('id', listingId)
    .eq('status', 'active')
    .single();

  if (findError || !listing) throw new Error('Listing not found or already sold');
  if (listing.seller_id === buyerId) throw new Error('Cannot purchase your own listing');

  const price = listing.price;
  const tithe = listing.platform_fee;
  const sellerReceives = price - tithe;

  // Debit buyer
  await debitMana(
    buyerId,
    price,
    'marketplace-purchase',
    'Bazaar Purchase',
    `Acquired "${listing.title}" from the Bazaar of Wonders.`,
    'marketplace',
    listingId
  );

  // Credit seller (minus tithe)
  await creditMana(
    listing.seller_id,
    sellerReceives,
    'marketplace-sale',
    'Bazaar Sale',
    `"${listing.title}" sold in the Bazaar. The Tithe: ${tithe} Mana.`,
    'marketplace',
    listingId
  );

  // Update listing
  const { data, error } = await supabase
    .from('marketplace_listings')
    .update({ status: 'sold', buyer_id: buyerId })
    .eq('id', listingId)
    .select()
    .single();

  if (error) throw new Error(`Failed to complete purchase: ${error.message}`);
  return mapListingRow(data);
}

/** Delist an item */
export async function delistItem(
  sellerId: string,
  listingId: string
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('marketplace_listings')
    .update({ status: 'delisted' })
    .eq('id', listingId)
    .eq('seller_id', sellerId);

  if (error) throw new Error(`Failed to delist: ${error.message}`);
}

/** Send a Mana tip (offering) */
export async function tipCreator(
  fromUserId: string,
  toUserId: string,
  amount: number
): Promise<void> {
  if (amount <= 0) throw new Error('Tip amount must be positive');
  if (fromUserId === toUserId) throw new Error('Cannot tip yourself');

  await debitMana(
    fromUserId,
    amount,
    'tip',
    'Mana Offering',
    `Mana Offering of ${amount} sent to a fellow creator.`
  );

  await creditMana(
    toUserId,
    amount,
    'tip',
    'Mana Offering Received',
    `A fellow creator honoured you with a Mana Offering of ${amount}.`
  );
}

/** Browse marketplace listings */
export async function getListings(
  filters?: {
    type?: ListingType;
    status?: string;
    sellerId?: string;
    limit?: number;
    offset?: number;
  }
): Promise<MarketplaceListing[]> {
  const supabase = await createClient();

  let query = supabase
    .from('marketplace_listings')
    .select()
    .order('created_at', { ascending: false });

  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.sellerId) query = query.eq('seller_id', filters.sellerId);
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to browse Bazaar: ${error.message}`);
  return (data || []).map(mapListingRow);
}

/* ----------------------------------------------------------------
 *  INTERNAL HELPERS
 * ---------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapListingRow(row: any): MarketplaceListing {
  return {
    id: row.id,
    sellerId: row.seller_id,
    type: row.type,
    itemId: row.item_id,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: row.currency,
    status: row.status,
    buyerId: row.buyer_id,
    platformFee: row.platform_fee,
    royaltyPercentage: row.royalty_percentage,
    createdAt: row.created_at,
  };
}
