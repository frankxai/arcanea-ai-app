/* ================================================================
 *  QUEST BOARD — Bounty Service
 *  "Post your quest. Set the reward. A creator will answer the call."
 *
 *  Inspired by Civitai's bounty system: demand-driven creation
 *  where users post requests and creators compete to deliver.
 * ================================================================ */

import { createAdminClient, createClient } from '@/lib/supabase/server';
import type { ArcaneBounty, CommissionType } from '@/lib/types/commerce';
import type { Element } from '@/lib/types/challenge';
import { BOUNTY_MIN_REWARD, BOUNTY_MAX_REWARD, BOUNTY_MAX_DURATION_DAYS } from './pricing';
import { lockMana, releaseMana, refundMana } from './wallet-service';

/** Post a new bounty — locks Mana in escrow */
export async function createBounty(
  posterId: string,
  title: string,
  description: string,
  type: CommissionType,
  reward: number,
  deadlineDays: number,
  element?: Element
): Promise<ArcaneBounty> {
  if (reward < BOUNTY_MIN_REWARD) {
    throw new Error(`Minimum quest reward is ${BOUNTY_MIN_REWARD} Mana`);
  }
  if (reward > BOUNTY_MAX_REWARD) {
    throw new Error(`Maximum quest reward is ${BOUNTY_MAX_REWARD} Mana`);
  }
  if (deadlineDays > BOUNTY_MAX_DURATION_DAYS) {
    throw new Error(`Maximum quest duration is ${BOUNTY_MAX_DURATION_DAYS} days`);
  }

  // Lock poster's Mana
  const escrowTx = await lockMana(posterId, reward, 'bounty', 'new-bounty');

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + deadlineDays);

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('arcane_bounties')
    .insert({
      poster_id: posterId,
      title,
      description,
      type,
      element: element || null,
      reward,
      escrow_transaction_id: escrowTx.id,
      status: 'open',
      deadline: deadline.toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create quest: ${error.message}`);
  return mapBountyRow(data);
}

/** Creator claims a bounty */
export async function claimBounty(
  bountyId: string,
  creatorId: string
): Promise<ArcaneBounty> {
  const supabase = createAdminClient();

  const { data: bounty, error: findError } = await supabase
    .from('arcane_bounties')
    .select()
    .eq('id', bountyId)
    .eq('status', 'open')
    .single();

  if (findError || !bounty) throw new Error('Quest not found or already claimed');
  if (bounty.poster_id === creatorId) throw new Error('Cannot claim your own quest');

  const { data, error } = await supabase
    .from('arcane_bounties')
    .update({ claimed_by_id: creatorId, status: 'claimed' })
    .eq('id', bountyId)
    .select()
    .single();

  if (error) throw new Error(`Failed to claim quest: ${error.message}`);
  return mapBountyRow(data);
}

/** Creator submits their work */
export async function submitBounty(
  bountyId: string,
  submissionUrl: string
): Promise<ArcaneBounty> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('arcane_bounties')
    .update({ submission_url: submissionUrl, status: 'submitted' })
    .eq('id', bountyId)
    .select()
    .single();

  if (error) throw new Error(`Failed to submit quest: ${error.message}`);
  return mapBountyRow(data);
}

/** Poster approves — Mana released to creator */
export async function approveBounty(bountyId: string): Promise<ArcaneBounty> {
  const supabase = createAdminClient();

  const { data: bounty, error: findError } = await supabase
    .from('arcane_bounties')
    .select()
    .eq('id', bountyId)
    .eq('status', 'submitted')
    .single();

  if (findError || !bounty) throw new Error('Quest not found or not yet submitted');

  // Release escrow to the creator who claimed it
  if (bounty.escrow_transaction_id && bounty.claimed_by_id) {
    await releaseMana(bounty.escrow_transaction_id, bounty.claimed_by_id);
  }

  const { data, error } = await supabase
    .from('arcane_bounties')
    .update({ status: 'completed' })
    .eq('id', bountyId)
    .select()
    .single();

  if (error) throw new Error(`Failed to approve quest: ${error.message}`);
  return mapBountyRow(data);
}

/** Cancel or expire a bounty — refund escrow */
export async function cancelBounty(bountyId: string): Promise<ArcaneBounty> {
  const supabase = createAdminClient();

  const { data: bounty, error: findError } = await supabase
    .from('arcane_bounties')
    .select()
    .eq('id', bountyId)
    .single();

  if (findError || !bounty) throw new Error('Quest not found');

  if (bounty.escrow_transaction_id) {
    await refundMana(bounty.escrow_transaction_id);
  }

  const { data, error } = await supabase
    .from('arcane_bounties')
    .update({ status: 'cancelled' })
    .eq('id', bountyId)
    .select()
    .single();

  if (error) throw new Error(`Failed to cancel quest: ${error.message}`);
  return mapBountyRow(data);
}

/** Browse bounties */
export async function getBounties(
  filters?: {
    status?: string;
    type?: CommissionType;
    element?: Element;
    limit?: number;
    offset?: number;
  }
): Promise<ArcaneBounty[]> {
  const supabase = await createClient();

  let query = supabase
    .from('arcane_bounties')
    .select()
    .order('reward', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.element) query = query.eq('element', filters.element);
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch quests: ${error.message}`);
  return (data || []).map(mapBountyRow);
}

/** Get a single bounty */
export async function getBounty(bountyId: string): Promise<ArcaneBounty | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('arcane_bounties')
    .select()
    .eq('id', bountyId)
    .single();

  if (error) return null;
  return mapBountyRow(data);
}

/* ----------------------------------------------------------------
 *  INTERNAL HELPERS
 * ---------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBountyRow(row: any): ArcaneBounty {
  return {
    id: row.id,
    posterId: row.poster_id,
    title: row.title,
    description: row.description,
    type: row.type,
    element: row.element,
    reward: row.reward,
    escrowTransactionId: row.escrow_transaction_id,
    status: row.status,
    claimedById: row.claimed_by_id,
    submissionUrl: row.submission_url,
    deadline: row.deadline,
    createdAt: row.created_at,
  };
}
