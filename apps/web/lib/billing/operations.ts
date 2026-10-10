import type { ActionId } from "./catalog";
import type { BillingAccount } from "./ledger";

export class BillingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BillingError";
  }
}
export class InsufficientCreditsError extends BillingError {
  constructor(
    public readonly required: number,
    public readonly balance: number,
  ) {
    super("Not enough credits");
  }
}
export class OperationPendingError extends BillingError {
  constructor(public readonly reference: string) {
    super(
      "Your generation is pending recovery. Retry this request to check its status; it will not generate or charge again.",
    );
  }
}
export class OperationConflictError extends BillingError {
  constructor() {
    super("This request key belongs to different generation settings.");
  }
}
export class OperationFailedError extends BillingError {
  constructor() {
    super(
      "This generation failed and its credits have been returned. Start a new generation to try again.",
    );
  }
}
export interface OperationInput {
  userId: string;
  action: ActionId;
  amount: number;
  requestKey: string;
  fingerprint: string;
  metadata?: Record<string, unknown>;
}
export type OperationReceipt<T> = BillingAccount & {
  ok: boolean;
  reason?: string;
  required?: number;
  idempotent: boolean;
  state: "running" | "result_ready" | "refund_pending" | "completed" | "failed";
  result?: T;
  charged?: number;
};
export type BillingRpc = <T>(
  fn: string,
  args: Record<string, unknown>,
) => Promise<T>;

/** Retry only idempotent database transitions, never provider work. */
async function transition<T>(
  rpc: BillingRpc,
  fn: string,
  args: Record<string, unknown>,
): Promise<T> {
  try {
    return await rpc<T>(fn, args);
  } catch {
    return rpc<T>(fn, args);
  }
}

export async function runReservedOperation<T>(
  rpc: BillingRpc,
  input: OperationInput,
  work: (reference: string) => Promise<{ result: T; actualCredits: number }>,
) {
  const reference = `${input.userId}:${input.requestKey}`;
  let receipt: OperationReceipt<T>;
  try {
    receipt = await rpc<OperationReceipt<T>>("billing_reserve_credits", {
      p_user: input.userId,
      p_amount: input.amount,
      p_action: input.action,
      p_reference: reference,
      p_metadata: { ...input.metadata, fingerprint: input.fingerprint },
    });
  } catch {
    throw new OperationPendingError(reference);
  }
  if (!receipt.ok) {
    if (receipt.reason === "request_conflict")
      throw new OperationConflictError();
    throw new InsufficientCreditsError(
      receipt.required ?? input.amount,
      receipt.balance,
    );
  }
  const returned = (account: OperationReceipt<T>) => {
    if (
      account.result === undefined ||
      account.result === null ||
      typeof account.charged !== "number"
    )
      throw new OperationPendingError(reference);
    return {
      result: account.result,
      charged: account.charged,
      account,
      reference,
    };
  };
  const complete = async (result: T, actual: number) => {
    try {
      return returned(
        await transition<OperationReceipt<T>>(
          rpc,
          "billing_complete_operation",
          {
            p_user: input.userId,
            p_reference: reference,
            p_actual: actual,
            p_result: result,
          },
        ),
      );
    } catch {
      throw new OperationPendingError(reference);
    }
  };
  if (receipt.state === "completed") return returned(receipt);
  if (
    receipt.state === "result_ready" &&
    receipt.result != null &&
    typeof receipt.charged === "number"
  )
    return complete(receipt.result, receipt.charged);
  if (receipt.state === "failed") throw new OperationFailedError();
  if (receipt.state === "refund_pending") {
    try {
      await transition(rpc, "billing_release_reservation", {
        p_user: input.userId,
        p_reference: reference,
        p_metadata: {},
      });
    } catch {
      throw new OperationPendingError(reference);
    }
    throw new OperationFailedError();
  }
  if (receipt.idempotent) throw new OperationPendingError(reference);
  let outcome: { result: T; actualCredits: number };
  try {
    outcome = await work(reference);
  } catch {
    try {
      await transition(rpc, "billing_request_release", {
        p_user: input.userId,
        p_reference: reference,
      });
      await transition(rpc, "billing_release_reservation", {
        p_user: input.userId,
        p_reference: reference,
        p_metadata: {},
      });
    } catch {
      throw new OperationPendingError(reference);
    }
    throw new OperationFailedError();
  }
  try {
    await transition(rpc, "billing_stage_result", {
      p_user: input.userId,
      p_reference: reference,
      p_actual: outcome.actualCredits,
      p_result: outcome.result,
    });
  } catch {
    throw new OperationPendingError(reference);
  }
  return complete(outcome.result, outcome.actualCredits);
}
