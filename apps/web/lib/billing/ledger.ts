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
import { WELCOME_CREDITS, type ActionId, type PlanId } from "./catalog";

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

export type ReserveResult =
  | ({ ok: true; idempotent: boolean } & BillingAccount)
  | ({
      ok: false;
      reason: "insufficient_credits";
      required: number;
    } & BillingAccount);

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

/** Account state. Creates the account with the welcome grant on first contact. */
export async function getAccount(userId: string): Promise<BillingAccount> {
  return call<BillingAccount>("billing_ensure_account", {
    p_user: userId,
    p_welcome: WELCOME_CREDITS,
  });
}

export async function grantCredits(input: {
  userId: string;
  amount: number;
  kind: "grant" | "purchase" | "refund" | "adjust";
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<BillingAccount & { applied: boolean }> {
  return call("billing_grant_credits", {
    p_user: input.userId,
    p_amount: input.amount,
    p_kind: input.kind,
    p_reference: input.reference,
    p_metadata: input.metadata ?? {},
  });
}

export async function reserveCredits(input: {
  userId: string;
  amount: number;
  action: ActionId;
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<ReserveResult> {
  return call("billing_reserve_credits", {
    p_user: input.userId,
    p_amount: input.amount,
    p_action: input.action,
    p_reference: input.reference,
    p_metadata: input.metadata ?? {},
  });
}

export async function settleReservation(input: {
  userId: string;
  reference: string;
  actual: number;
  metadata?: Record<string, unknown>;
}): Promise<BillingAccount & { ok: true; charged?: number }> {
  return call("billing_settle_reservation", {
    p_user: input.userId,
    p_reference: input.reference,
    p_actual: input.actual,
    p_metadata: input.metadata ?? {},
  });
}

export async function releaseReservation(input: {
  userId: string;
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<BillingAccount & { ok: true }> {
  return call("billing_release_reservation", {
    p_user: input.userId,
    p_reference: input.reference,
    p_metadata: input.metadata ?? {},
  });
}

export async function setPlan(input: {
  userId: string;
  plan: PlanId;
  status: BillingAccount["planStatus"];
  polarCustomerId?: string | null;
  polarSubscriptionId?: string | null;
  polarProductId?: string | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean;
}): Promise<BillingAccount> {
  return call("billing_set_plan", {
    p_user: input.userId,
    p_plan: input.plan,
    p_status: input.status,
    p_polar_customer_id: input.polarCustomerId ?? null,
    p_polar_subscription_id: input.polarSubscriptionId ?? null,
    p_polar_product_id: input.polarProductId ?? null,
    p_period_end: input.currentPeriodEnd
      ? input.currentPeriodEnd.toISOString()
      : null,
    p_cancel_at_period_end: input.cancelAtPeriodEnd ?? false,
  });
}

/** Verified webhook fulfillment and acknowledgement commit in one transaction. */
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

export function withReservation<T>(
  input: OperationInput,
  work: (reference: string) => Promise<{ result: T; actualCredits: number }>,
) {
  return runReservedOperation<T>(call, input, work);
}
