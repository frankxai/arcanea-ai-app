import assert from "node:assert/strict";
import { test } from "node:test";
import {
  runReservedOperation,
  InsufficientCreditsError,
  OperationPendingError,
  OperationFailedError,
  OperationConflictError,
  type BillingRpc,
  type OperationReceipt,
} from "../operations";
const input = {
  userId: "user-a",
  action: "image.standard" as const,
  amount: 10,
  requestKey: "key",
  fingerprint: "hash",
};
function fixture() {
  let receipt: OperationReceipt<string> | undefined;
  let workCalls = 0;
  const failures = new Map<string, number>();
  const committedFailures = new Set<string>();
  const calls: string[] = [];
  const account = {
    userId: input.userId,
    plan: "spark" as const,
    planStatus: "none" as const,
    balance: 90,
    reserved: 10,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    polarCustomerId: null,
    polarSubscriptionId: null,
  };
  const rpc: BillingRpc = async <T>(
    fn: string,
    args: Record<string, unknown>,
  ): Promise<T> => {
    calls.push(fn);
    const remaining = failures.get(fn) ?? 0;
    if (remaining > 0) {
      failures.set(fn, remaining - 1);
      throw Error("database unavailable");
    }
    if (fn === "billing_reserve_credits") {
      if (receipt) receipt.idempotent = true;
      else
        receipt = { ...account, ok: true, idempotent: false, state: "running" };
    } else if (fn === "billing_stage_result") {
      receipt = {
        ...receipt!,
        state: "result_ready",
        result: args.p_result as string,
        charged: args.p_actual as number,
      };
    } else if (fn === "billing_complete_operation") {
      receipt = { ...receipt!, state: "completed", reserved: 0 };
    } else if (fn === "billing_request_release")
      receipt!.state = "refund_pending";
    else if (fn === "billing_release_reservation")
      receipt = {
        ...receipt!,
        state: "failed",
        reserved: 0,
        balance: 100,
        charged: 0,
      };
    if (committedFailures.delete(fn))
      throw Error("acknowledgement lost after commit");
    return { ...receipt } as T;
  };
  const work = async () => {
    workCalls++;
    return { result: "stored-image", actualCredits: 10 };
  };
  return {
    rpc,
    work,
    failures,
    committedFailures,
    calls,
    get receipt() {
      return receipt;
    },
    get workCalls() {
      return workCalls;
    },
  };
}
test("completed retry replays the actual artifact without a second provider call", async () => {
  const f = fixture();
  const a = await runReservedOperation(f.rpc, input, f.work);
  const b = await runReservedOperation(f.rpc, input, f.work);
  assert.equal(a.result, "stored-image");
  assert.equal(b.result, a.result);
  assert.equal(f.workCalls, 1);
});
test("uncertain admission never invokes work, and retry does not reserve again", async () => {
  const f = fixture();
  f.committedFailures.add("billing_reserve_credits");
  await assert.rejects(
    runReservedOperation(f.rpc, input, f.work),
    OperationPendingError,
  );
  await assert.rejects(
    runReservedOperation(f.rpc, input, f.work),
    OperationPendingError,
  );
  assert.equal(f.workCalls, 0);
});
test("competing retry observes running state and invokes no additional work", async () => {
  const f = fixture();
  let release!: () => void;
  const barrier = new Promise<void>((r) => {
    release = r;
  });
  const first = runReservedOperation(f.rpc, input, async () => {
    await barrier;
    return f.work();
  });
  await new Promise((r) => setImmediate(r));
  await assert.rejects(
    runReservedOperation(f.rpc, input, f.work),
    OperationPendingError,
  );
  release();
  await first;
  assert.equal(f.workCalls, 1);
});
test("settlement outage retains output for same-key recovery", async () => {
  const f = fixture();
  f.failures.set("billing_complete_operation", 2);
  await assert.rejects(
    runReservedOperation(f.rpc, input, f.work),
    OperationPendingError,
  );
  assert.equal(f.receipt?.state, "result_ready");
  const recovered = await runReservedOperation(f.rpc, input, f.work);
  assert.equal(recovered.result, "stored-image");
  assert.equal(f.workCalls, 1);
});
test("lost result and settlement acknowledgements retry database transitions only", async () => {
  const f = fixture();
  f.committedFailures.add("billing_stage_result");
  f.committedFailures.add("billing_complete_operation");
  assert.equal(
    (await runReservedOperation(f.rpc, input, f.work)).result,
    "stored-image",
  );
  assert.equal(f.workCalls, 1);
});
test("failed refund remains durable and resumes on retry without work", async () => {
  const f = fixture();
  f.failures.set("billing_release_reservation", 2);
  await assert.rejects(
    runReservedOperation(f.rpc, input, async () => {
      throw Error("provider failure");
    }),
    OperationPendingError,
  );
  assert.equal(f.receipt?.state, "refund_pending");
  await assert.rejects(
    runReservedOperation(f.rpc, input, f.work),
    OperationFailedError,
  );
  assert.equal(f.receipt?.balance, 100);
  assert.equal(f.workCalls, 0);
});
test("insufficient credit and request conflicts invoke no provider or enhancement work", async () => {
  for (const reason of ["insufficient_credits", "request_conflict"]) {
    let calls = 0;
    const rpc: BillingRpc = async <T>() =>
      ({ ok: false, reason, balance: 0, required: 10 }) as T;
    await assert.rejects(
      runReservedOperation(rpc, input, async () => {
        calls++;
        return { result: "bad", actualCredits: 10 };
      }),
      reason === "request_conflict"
        ? OperationConflictError
        : InsufficientCreditsError,
    );
    assert.equal(calls, 0);
  }
});
