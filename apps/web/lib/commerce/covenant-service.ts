/* ================================================================
 *  COVENANT OF THE FORGE — Team Revenue Split Service
 *  "Sign the covenant. When the Guardian's Bounty falls,
 *   each receives their rightful share."
 * ================================================================ */

import { createAdminClient, createClient } from '@/lib/supabase/server';
import type { ForgeCovenant, CovenantSplit } from '@/lib/types/commerce';
import { creditMana } from './wallet-service';

/** Create a new covenant for a team-challenge pairing */
export async function createCovenant(
  teamId: string,
  challengeId: string,
  splits: CovenantSplit[]
): Promise<ForgeCovenant> {
  // Validate splits sum to 100
  const totalPercent = splits.reduce((sum, s) => sum + s.percentage, 0);
  if (totalPercent !== 100) {
    throw new Error(`Covenant splits must total 100%. Current total: ${totalPercent}%`);
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('forge_covenants')
    .insert({
      team_id: teamId,
      challenge_id: challengeId,
      splits: splits as unknown as Record<string, unknown>,
      status: 'draft',
      total_earnings: 0,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to forge covenant: ${error.message}`);
  return mapCovenantRow(data);
}

/** Sign the covenant (each member signs individually) */
export async function signCovenant(
  covenantId: string,
  memberId: string
): Promise<ForgeCovenant> {
  const supabase = createAdminClient();

  const { data: covenant, error: findError } = await supabase
    .from('forge_covenants')
    .select()
    .eq('id', covenantId)
    .single();

  if (findError || !covenant) throw new Error('Covenant not found');

  // Track signed members in metadata
  const metadata = (covenant.metadata as Record<string, unknown>) || {};
  const signedMembers = (metadata.signedMembers as string[]) || [];

  if (!signedMembers.includes(memberId)) {
    signedMembers.push(memberId);
  }

  // Check if all members have signed
  const splits = covenant.splits as unknown as CovenantSplit[];
  const allSigned = splits.every((s) => signedMembers.includes(s.memberId));

  const { data, error } = await supabase
    .from('forge_covenants')
    .update({
      status: allSigned ? 'signed' : 'draft',
      metadata: { ...metadata, signedMembers },
    })
    .eq('id', covenantId)
    .select()
    .single();

  if (error) throw new Error(`Failed to sign covenant: ${error.message}`);
  return mapCovenantRow(data);
}

/** Distribute prize money according to covenant splits */
export async function distributePrize(
  covenantId: string,
  totalAmount: number
): Promise<ForgeCovenant> {
  if (totalAmount <= 0) throw new Error('Prize amount must be positive');

  const supabase = createAdminClient();

  const { data: covenant, error: findError } = await supabase
    .from('forge_covenants')
    .select()
    .eq('id', covenantId)
    .single();

  if (findError || !covenant) throw new Error('Covenant not found');

  const splits = covenant.splits as unknown as CovenantSplit[];

  // Distribute to each member
  for (const split of splits) {
    const memberAmount = Math.round(totalAmount * (split.percentage / 100));
    if (memberAmount > 0) {
      await creditMana(
        split.memberId,
        memberAmount,
        'reward',
        "Guardian's Bounty",
        `The Covenant of the Forge distributes ${memberAmount} Mana (${split.percentage}% share as ${split.role}).`,
        'challenge',
        covenant.challenge_id
      );
    }
  }

  // Update covenant
  const { data, error } = await supabase
    .from('forge_covenants')
    .update({
      status: 'completed',
      total_earnings: totalAmount,
      distributed_at: new Date().toISOString(),
    })
    .eq('id', covenantId)
    .select()
    .single();

  if (error) throw new Error(`Failed to distribute: ${error.message}`);
  return mapCovenantRow(data);
}

/** Get covenants for a team or challenge */
export async function getCovenants(
  filters: { teamId?: string; challengeId?: string }
): Promise<ForgeCovenant[]> {
  const supabase = await createClient();

  let query = supabase
    .from('forge_covenants')
    .select()
    .order('created_at', { ascending: false });

  if (filters.teamId) query = query.eq('team_id', filters.teamId);
  if (filters.challengeId) query = query.eq('challenge_id', filters.challengeId);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch covenants: ${error.message}`);
  return (data || []).map(mapCovenantRow);
}

/* ----------------------------------------------------------------
 *  INTERNAL HELPERS
 * ---------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCovenantRow(row: any): ForgeCovenant {
  return {
    id: row.id,
    teamId: row.team_id,
    challengeId: row.challenge_id,
    splits: row.splits as CovenantSplit[],
    status: row.status,
    totalEarnings: row.total_earnings,
    distributedAt: row.distributed_at,
    createdAt: row.created_at,
  };
}
