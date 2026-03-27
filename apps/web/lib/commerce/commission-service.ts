/* ================================================================
 *  LUMINOR COMMISSION SERVICE
 *  "Commission a Luminor. They create. You receive. They earn forever."
 * ================================================================ */

import { createAdminClient, createClient } from '@/lib/supabase/server';
import type { LuminorCommission, CommissionType, CommissionComplexity } from '@/lib/types/commerce';
import { calculateCommissionPrice } from './pricing';
import { lockMana, releaseMana, refundMana, creditMana } from './wallet-service';

/** Estimate price before committing */
export function estimatePrice(type: CommissionType, complexity: CommissionComplexity) {
  return calculateCommissionPrice(type, complexity);
}

/** Request a new commission — locks Mana in escrow */
export async function requestCommission(
  clientUserId: string,
  luminorId: string,
  luminorCreatorId: string,
  type: CommissionType,
  complexity: CommissionComplexity,
  brief: string
): Promise<LuminorCommission> {
  const { price, platformFee, creatorEarnings } = calculateCommissionPrice(type, complexity);

  // Lock client's Mana in escrow
  const escrowTx = await lockMana(clientUserId, price, 'commission', luminorId);

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('luminor_commissions')
    .insert({
      luminor_id: luminorId,
      luminor_creator_id: luminorCreatorId,
      client_user_id: clientUserId,
      type,
      brief,
      complexity,
      price,
      platform_fee: platformFee,
      creator_earnings: creatorEarnings,
      status: 'accepted', // Auto-accept — AI agents are always available
      escrow_transaction_id: escrowTx.id,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create commission: ${error.message}`);
  return mapCommissionRow(data);
}

/** Mark commission as in-progress */
export async function startCommission(commissionId: string): Promise<LuminorCommission> {
  return updateCommissionStatus(commissionId, 'in-progress');
}

/** Deliver commission results */
export async function deliverCommission(
  commissionId: string,
  deliverables: string[]
): Promise<LuminorCommission> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('luminor_commissions')
    .update({ deliverables, status: 'delivered' })
    .eq('id', commissionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to deliver commission: ${error.message}`);
  return mapCommissionRow(data);
}

/** Client approves — escrow released, creator gets 80%, platform gets 20% */
export async function completeCommission(commissionId: string): Promise<LuminorCommission> {
  const supabase = createAdminClient();

  const { data: commission, error: findError } = await supabase
    .from('luminor_commissions')
    .select()
    .eq('id', commissionId)
    .single();

  if (findError || !commission) throw new Error('Commission not found');

  if (!commission.escrow_transaction_id) {
    throw new Error('No escrow transaction found for this commission');
  }

  // Release escrow to the Luminor creator (80%)
  await releaseMana(commission.escrow_transaction_id, commission.luminor_creator_id);

  // Update status
  const { data, error } = await supabase
    .from('luminor_commissions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', commissionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to complete commission: ${error.message}`);
  return mapCommissionRow(data);
}

/** Dispute — escalates to Council Gate Quorum consensus */
export async function disputeCommission(commissionId: string): Promise<LuminorCommission> {
  return updateCommissionStatus(commissionId, 'disputed');
}

/** Cancel commission — refund escrow */
export async function cancelCommission(commissionId: string): Promise<LuminorCommission> {
  const supabase = createAdminClient();

  const { data: commission, error: findError } = await supabase
    .from('luminor_commissions')
    .select()
    .eq('id', commissionId)
    .single();

  if (findError || !commission) throw new Error('Commission not found');

  // Refund escrow
  if (commission.escrow_transaction_id) {
    await refundMana(commission.escrow_transaction_id);
  }

  const { data, error } = await supabase
    .from('luminor_commissions')
    .update({ status: 'cancelled' })
    .eq('id', commissionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to cancel commission: ${error.message}`);
  return mapCommissionRow(data);
}

/** List commissions for a user (as client or creator) */
export async function getCommissions(
  userId: string,
  role: 'client' | 'creator' = 'client'
): Promise<LuminorCommission[]> {
  const supabase = await createClient();
  const column = role === 'client' ? 'client_user_id' : 'luminor_creator_id';

  const { data, error } = await supabase
    .from('luminor_commissions')
    .select()
    .eq(column, userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch commissions: ${error.message}`);
  return (data || []).map(mapCommissionRow);
}

/** Get a single commission by ID */
export async function getCommission(commissionId: string): Promise<LuminorCommission | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('luminor_commissions')
    .select()
    .eq('id', commissionId)
    .single();

  if (error) return null;
  return mapCommissionRow(data);
}

/* ----------------------------------------------------------------
 *  INTERNAL HELPERS
 * ---------------------------------------------------------------- */

async function updateCommissionStatus(
  commissionId: string,
  status: string
): Promise<LuminorCommission> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('luminor_commissions')
    .update({ status })
    .eq('id', commissionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update commission: ${error.message}`);
  return mapCommissionRow(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCommissionRow(row: any): LuminorCommission {
  return {
    id: row.id,
    luminorId: row.luminor_id,
    luminorCreatorId: row.luminor_creator_id,
    clientUserId: row.client_user_id,
    type: row.type,
    brief: row.brief,
    complexity: row.complexity,
    price: row.price,
    platformFee: row.platform_fee,
    creatorEarnings: row.creator_earnings,
    status: row.status,
    deliverables: row.deliverables || [],
    spellsUsed: row.spells_used || [],
    escrowTransactionId: row.escrow_transaction_id,
    teamId: row.team_id,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}
