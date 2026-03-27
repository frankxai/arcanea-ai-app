/* ================================================================
 *  GRIMOIRE BINDING — Spellbook Store Service
 *  "Bind a grimoire to your soul. Its spells become yours to cast."
 *
 *  Canon: Basic spells (cantrip, Gate 1) are always free.
 *  Advanced grimoires cost Mana. Core creation is never paywalled.
 * ================================================================ */

import { createAdminClient, createClient } from '@/lib/supabase/server';
import type { SpellbookProduct, UserSpellbook } from '@/lib/types/commerce';
import { SPELLBOOK_PRICES } from './pricing';
import { debitMana, getOrCreateWallet } from './wallet-service';
import { SPELLBOOKS, ALL_SPELLS } from '@/lib/challenges/spellbooks';

/** Get all spellbook products with pricing */
export function getSpellbookProducts(): SpellbookProduct[] {
  return SPELLBOOKS.map((sb) => {
    const pricing = SPELLBOOK_PRICES[sb.id] || { price: 0, tier: 'free' };
    return {
      id: sb.id,
      spellbookId: sb.id,
      name: sb.name,
      element: sb.element,
      price: pricing.price,
      tier: pricing.tier as SpellbookProduct['tier'],
      features: sb.spells.map((s) => `${s.name} (${s.tier})`),
      purchaseCount: 0,
    };
  });
}

/** Purchase and bind a spellbook */
export async function purchaseSpellbook(
  userId: string,
  spellbookId: string
): Promise<UserSpellbook> {
  const pricing = SPELLBOOK_PRICES[spellbookId];
  if (!pricing) throw new Error('Spellbook not found');

  // Free spellbooks don't need payment
  if (pricing.price === 0) {
    return bindSpellbook(userId, spellbookId, null);
  }

  // Check if already owned
  const owned = await getUserSpellbooks(userId);
  if (owned.some((s) => s.spellbookProductId === spellbookId)) {
    throw new Error('You have already bound this grimoire to your soul.');
  }

  // Debit Mana
  const tx = await debitMana(
    userId,
    pricing.price,
    'spellbook-unlock',
    'Grimoire Binding',
    `Bound ${SPELLBOOKS.find((s) => s.id === spellbookId)?.name || spellbookId} to your soul.`,
    'spellbook',
    spellbookId
  );

  return bindSpellbook(userId, spellbookId, tx.id);
}

/** Check if user owns a specific spellbook */
export async function getUserSpellbooks(userId: string): Promise<UserSpellbook[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_spellbooks')
    .select()
    .eq('user_id', userId);

  if (error) return [];
  return (data || []).map(mapUserSpellbookRow);
}

/** Check if user has access to a specific spell */
export async function hasSpellAccess(
  userId: string,
  spellId: string,
  userGatesOpen: number
): Promise<{ hasAccess: boolean; reason?: string }> {
  const spell = ALL_SPELLS.find((s) => s.id === spellId);
  if (!spell) return { hasAccess: false, reason: 'Spell not found' };

  // Gate check first
  if (userGatesOpen < spell.unlockGate) {
    return { hasAccess: false, reason: `Requires Gate ${spell.unlockGate} to be open` };
  }

  // Free spellbooks (fire, water, earth) — always accessible
  const spellbook = SPELLBOOKS.find((sb) => sb.spells.some((s) => s.id === spellId));
  if (!spellbook) return { hasAccess: false, reason: 'Spell not in any grimoire' };

  const pricing = SPELLBOOK_PRICES[spellbook.id];
  if (!pricing || pricing.price === 0) return { hasAccess: true };

  // Paid spellbook — check ownership
  const owned = await getUserSpellbooks(userId);
  if (owned.some((s) => s.spellbookProductId === spellbook.id)) {
    return { hasAccess: true };
  }

  return {
    hasAccess: false,
    reason: `Requires ${spellbook.name} (${pricing.price} Mana)`,
  };
}

/* ----------------------------------------------------------------
 *  INTERNAL HELPERS
 * ---------------------------------------------------------------- */

async function bindSpellbook(
  userId: string,
  spellbookId: string,
  transactionId: string | null
): Promise<UserSpellbook> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('user_spellbooks')
    .upsert(
      {
        user_id: userId,
        spellbook_product_id: spellbookId,
        transaction_id: transactionId,
      },
      { onConflict: 'user_id,spellbook_product_id' }
    )
    .select()
    .single();

  if (error) throw new Error(`Failed to bind grimoire: ${error.message}`);
  return mapUserSpellbookRow(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUserSpellbookRow(row: any): UserSpellbook {
  return {
    id: row.id,
    userId: row.user_id,
    spellbookProductId: row.spellbook_product_id,
    purchasedAt: row.purchased_at,
    transactionId: row.transaction_id,
  };
}
