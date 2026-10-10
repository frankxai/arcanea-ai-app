/**
 * Credit ledger — server-only access to the billing kernel.
 *
 * Every function here calls a security-definer Postgres function with the
 * service-role client, so the application never computes a balance itself and
 * never races itself. Use `withReservation` around any paid provider call.
 */

import {
  runReservedOperation,
  BillingError,
  type OperationInput,
} from "./operations";
export {
  BillingError,
  InsufficientCreditsError,
  OperationPendingError,
  OperationConflictError,
  OperationFailedError,
} from "./operations";
import { createAdminClient } from "@/lib/supabase/server";
import { WELCOME_CREDITS, type PlanId } from "./catalog";

export interface BillingAccount {
  userId: string;
  plan: PlanId;
  planStatus:
    | "none"
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "revoked"
    | "paused";
  balance: number;
  reserved: number;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  polarCustomerId: string | null;
  polarSubscriptionId: string | null;
}

type RpcClient = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
};

function admin(): RpcClient {
  // The generated Database type does not know the billing functions yet. The
  // RPC surface is stable and small, so a narrow structural cast is safer than
  // regenerating types in this slice.
  return createAdminClient() as unknown as RpcClient;
}

async function call<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await admin().rpc(fn, args);
  if (error) {
    throw new BillingError(`${fn} failed: ${error.message}`);
  }
  return data as T;
}

/** Refuse new purchases until the recovery migration is committed. */
export async function requireRecoverySchema(): Promise<void> {
  const ready = await call<boolean>("billing_recovery_ready", {});
  if (ready !== true)
    throw new BillingError("Billing recovery schema is unavailable");
}

/** Account state. Creates the account with the welcome grant on first contact. */
export async function getAccount(userId: string): Promise<BillingAccount> {
  return call<BillingAccount>("billing_ensure_account", {
    p_user: userId,
    p_welcome: WELCOME_CREDITS,
  });
}

export async function applyEvent(
  id: string,
  type: string,
  payload: unknown,
  intents: unknown[],
): Promise<{ duplicate: boolean; applied: number }> {
  return call("billing_apply_event", {
    p_id: id,
    p_type: type,
    p_payload: payload,
    p_intents: intents,
  });
}

export async function withReservation<T>(
  input: OperationInput,
  work: (reference: string) => Promise<{ result: T; actualCredits: number }>,
) {
  await getAccount(input.userId);
  return runReservedOperation<T>(call, input, work);
}
