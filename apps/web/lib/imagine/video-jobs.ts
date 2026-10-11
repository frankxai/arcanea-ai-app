import { createAdminClient } from "../supabase/server";
import { OperationPendingError } from "../billing/operations";
import type { VideoJob } from "./video";
import type { ImageJob } from "./generate";

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
async function checkpointJob(
  userId: string,
  reference: string,
  kind: "pendingVideo" | "pendingImage",
  job: VideoJob | ImageJob,
) {
  try {
    const { data, error } = await store()
      .from("billing_operations")
      .update({ result: { [kind]: job } })
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

async function readJob(
  userId: string,
  reference: string,
  kind: "pendingVideo" | "pendingImage",
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
    return (data as { result?: Record<string, unknown> }).result?.[kind];
  } catch {
    throw new OperationPendingError(reference);
  }
}

export const checkpointVideoJob = (
  userId: string,
  reference: string,
  job: VideoJob,
) => checkpointJob(userId, reference, "pendingVideo", job);
export const readVideoJob = (userId: string, reference: string) =>
  readJob(userId, reference, "pendingVideo");
export const checkpointImageJob = (
  userId: string,
  reference: string,
  job: ImageJob,
) => checkpointJob(userId, reference, "pendingImage", job);
export const readImageJob = (userId: string, reference: string) =>
  readJob(userId, reference, "pendingImage");
