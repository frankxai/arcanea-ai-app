import { createAdminClient } from "../supabase/server";
import { OperationPendingError } from "../billing/operations";
import type { VideoJob } from "./video";

type Query = { data: unknown; error: unknown };
type Filter = {
  eq(column: string, value: string): Filter;
  is(column: string, value: null): Filter;
  select(columns: string): Filter;
  maybeSingle(): PromiseLike<Query>;
};
type Store = {
  from(table: string): {
    update(value: Record<string, unknown>): Filter;
    select(columns: string): Filter;
  };
};
const store = () => createAdminClient() as unknown as Store;

/** Reuse the private operation row; no new database, public grant or credential. */
export async function checkpointVideoJob(
  userId: string,
  reference: string,
  job: VideoJob,
) {
  try {
    const { data, error } = await store()
      .from("billing_operations")
      .update({ result: { pendingVideo: job } })
      .eq("user_id", userId)
      .eq("reference", reference)
      .eq("state", "running")
      .is("result", null)
      .select("reference")
      .maybeSingle();
    if (error || !data) throw new Error("Checkpoint not confirmed");
  } catch {
    throw new OperationPendingError(reference);
  }
}

export async function readVideoJob(
  userId: string,
  reference: string,
): Promise<unknown> {
  try {
    const { data, error } = await store()
      .from("billing_operations")
      .select("result")
      .eq("user_id", userId)
      .eq("reference", reference)
      .eq("state", "running")
      .maybeSingle();
    if (error || !data) throw new Error("Checkpoint unavailable");
    return (data as { result?: { pendingVideo?: unknown } }).result
      ?.pendingVideo;
  } catch {
    throw new OperationPendingError(reference);
  }
}
